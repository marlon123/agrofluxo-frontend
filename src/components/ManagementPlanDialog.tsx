import { useState } from 'react'
import { ResourceDialog } from './ResourceDialog'
import { getApiErrorMessage, getFieldErrors } from '../lib/api/client'
import { managementPlansService } from '../lib/api/services'
import type { Crop, ManagementPlan, ManagementPlanInput, SoilProfile } from '../lib/api/types'
import { toManagementPlanInput, validateManagementPlanForm } from '../lib/managementPlans'

type Props = {
  areaId: string
  dialog: { mode: 'create' | 'edit'; item?: ManagementPlan }
  crops: Crop[]
  soils: SoilProfile[]
  onClose: () => void
  onSaved: (message: string) => Promise<void>
}

type FormState = { cropId: string; soilProfileId: string; startDate: string; endDate: string; fFactor: string; sprinklerRateMmPerHour: string }

const emptyForm: FormState = { cropId: '', soilProfileId: '', startDate: '', endDate: '', fFactor: '', sprinklerRateMmPerHour: '' }
const fromPlan = (plan: ManagementPlan): FormState => ({ cropId: plan.cropId, soilProfileId: plan.soilProfileId, startDate: plan.startDate, endDate: plan.endDate || '', fFactor: String(plan.fFactor), sprinklerRateMmPerHour: String(plan.sprinklerRateMmPerHour) })
export function ManagementPlanDialog({ areaId, dialog, crops, soils, onClose, onSaved }: Props) {
  const readOnlyStartDate = dialog.mode === 'edit'
  const [form, setForm] = useState<FormState>(dialog.item ? fromPlan(dialog.item) : emptyForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const update = (field: keyof FormState, value: string) => setForm((current) => ({ ...current, [field]: value }))

  const submit = async () => {
    const next = validateManagementPlanForm(form)
    if (Object.keys(next).length) { setErrors(next); return }

    const input: ManagementPlanInput = toManagementPlanInput(form, dialog.mode)

    setSaving(true); setErrors({})
    try {
      if (dialog.mode === 'edit' && dialog.item) {
        await managementPlansService.update(areaId, dialog.item.id, input)
        await onSaved('Plano de manejo atualizado com sucesso.')
      } else {
        await managementPlansService.create(areaId, input)
        await onSaved('Plano de manejo criado com sucesso.')
      }
    } catch (error) {
      setErrors({ form: getApiErrorMessage(error), ...getFieldErrors(error) })
    } finally { setSaving(false) }
  }

  return <ResourceDialog title={dialog.mode === 'edit' ? 'Editar plano de manejo' : 'Novo plano de manejo'} onClose={onClose} footer={<><button className="button secondary" onClick={onClose}>Cancelar</button><button className="button primary" disabled={saving} onClick={() => void submit()}>{saving ? 'Salvando...' : 'Salvar plano'}</button></>}>
    <form className="resource-form" onSubmit={(event) => { event.preventDefault(); void submit() }}>
      {errors.form && <div className="form-error">{errors.form}</div>}
      <SelectField label="Cultura" required value={form.cropId} error={errors.cropId} disabled={dialog.mode === 'edit'} onChange={(value) => update('cropId', value)} options={crops.map((crop) => [crop.id, crop.name])} emptyLabel="Selecione uma cultura" />
      <SelectField label="Perfil de solo" required value={form.soilProfileId} error={errors.soilProfileId} disabled={dialog.mode === 'edit'} onChange={(value) => update('soilProfileId', value)} options={soils.map((soil) => [soil.id, soil.soilType])} emptyLabel="Selecione um perfil" />
      <div className="form-grid two-columns"><FormField label="Data inicial" required type="date" value={form.startDate} error={errors.startDate} disabled={readOnlyStartDate} onChange={(value) => update('startDate', value)} /><FormField label="Data final" type="date" value={form.endDate} error={errors.endDate} hint="Deixe em branco para manter o plano ativo." onChange={(value) => update('endDate', value)} /></div>
      <div className="form-grid two-columns"><FormField label="Fator de disponibilidade (F)" required type="number" min="0.0001" max="1" step="0.0001" value={form.fFactor} error={errors.fFactor} hint="Informe a fração decimal, por exemplo 0,50." onChange={(value) => update('fFactor', value)} /><FormField label="Taxa do aspersor (mm/h)" required type="number" min="0.0001" max="500" step="0.0001" value={form.sprinklerRateMmPerHour} error={errors.sprinklerRateMmPerHour} onChange={(value) => update('sprinklerRateMmPerHour', value)} /></div>
    </form>
  </ResourceDialog>
}

function SelectField({ label, value, options, onChange, error, required, disabled, emptyLabel }: { label: string; value: string; options: Array<[string, string]>; onChange: (value: string) => void; error?: string; required?: boolean; disabled?: boolean; emptyLabel: string }) {
  return <label className={`form-field ${error ? 'has-error' : ''}`}><span className="field-label">{label}{required && ' *'}</span><select value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)}><option value="">{emptyLabel}</option>{options.map(([key, text]) => <option key={key} value={key}>{text}</option>)}</select><small>{error || ''}</small></label>
}

function FormField({ label, value, onChange, error, hint, required, disabled, type = 'text', min, max, step }: { label: string; value: string; onChange: (value: string) => void; error?: string; hint?: string; required?: boolean; disabled?: boolean; type?: string; min?: string; max?: string; step?: string }) {
  return <label className={`form-field ${error ? 'has-error' : ''}`}><span className="field-label">{label}{required && ' *'}</span><input type={type} min={min} max={max} step={step} value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)} /><small>{error || hint}</small></label>
}
