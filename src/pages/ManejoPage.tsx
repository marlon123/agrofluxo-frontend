import { AlertCircle, ArrowLeft, ArrowRight, Check, ChevronRight, ClipboardCheck, CloudRain, Droplets, Leaf, LockKeyhole, Mountain, Sprout, Waves } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ManagementPlanDialog } from '../components/ManagementPlanDialog'
import { ManagementPlanSummary } from '../components/ManagementPlanSummary'
import { ReviewStep as ReviewStepWithContext } from '../components/ReviewStep'
import { ErrorState, LoadingState } from '../components/ResourceFeedback'
import { PageHeader } from '../components/PageHeader'
import { areasService, cropsService, managementPlansService, soilProfilesService } from '../lib/api/services'
import { getApiErrorMessage } from '../lib/api/client'
import { getManejoStepCompletion, isDailyDataValid } from '../lib/manejoFlow'
import { getActiveManagementPlan, getClosedManagementPlans } from '../lib/managementPlans'
import type { Area, Crop, ManagementPlan, PagedResponse, SoilProfile } from '../lib/api/types'
import type { DailyFormData } from '../lib/manejoFlow'

type Step = { title: string; description: string; icon: typeof Sprout }
type FormState = DailyFormData
const PAGE_SIZE = 100
const steps: Step[] = [
  { title: 'Selecionar área', description: 'Área e plano ativo', icon: Sprout },
  { title: 'Dados diários', description: 'Informações do dia', icon: CloudRain },
  { title: 'Revisar', description: 'Conferência dos dados', icon: ClipboardCheck },
  { title: 'Resultado', description: 'Consulta do balanço', icon: Waves },
]
const initialForm: FormState = { launchDate: '', irrigationDay: '', etp: '', precipitation: '', realIrrigation: '' }

async function loadAllPages<T>(loadPage: (page: number) => Promise<PagedResponse<T>>) {
  const records: T[] = []
  let page = 0
  let result: PagedResponse<T>
  do {
    result = await loadPage(page)
    records.push(...result.content)
    page += 1
  } while (page < result.totalPages)
  return records
}

export function ManejoPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [form, setForm] = useState<FormState>(initialForm)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [reviewConfirmed, setReviewConfirmed] = useState(false)
  const [areas, setAreas] = useState<Area[]>([])
  const [crops, setCrops] = useState<Crop[]>([])
  const [soils, setSoils] = useState<SoilProfile[]>([])
  const [catalogLoading, setCatalogLoading] = useState(true)
  const [catalogError, setCatalogError] = useState('')
  const [selectedAreaId, setSelectedAreaId] = useState('')
  const [plans, setPlans] = useState<ManagementPlan[]>([])
  const [plansLoading, setPlansLoading] = useState(false)
  const [plansError, setPlansError] = useState('')
  const [notice, setNotice] = useState('')
  const [planDialog, setPlanDialog] = useState<{ mode: 'create' | 'edit'; item?: ManagementPlan } | null>(null)
  const selectionRequest = useRef(0)

  const loadCatalogs = async () => {
    setCatalogLoading(true); setCatalogError('')
    try {
      const [nextAreas, nextCrops, nextSoils] = await Promise.all([
        loadAllPages((page) => areasService.list({ page, size: PAGE_SIZE, sortBy: 'name', direction: 'asc' })),
        loadAllPages((page) => cropsService.list({ page, size: PAGE_SIZE })),
        loadAllPages((page) => soilProfilesService.list({ page, size: PAGE_SIZE })),
      ])
      setAreas(nextAreas); setCrops(nextCrops); setSoils(nextSoils)
    } catch (error) { setCatalogError(getApiErrorMessage(error)) } finally { setCatalogLoading(false) }
  }

  useEffect(() => { void loadCatalogs() }, [])

  const selectedArea = areas.find((area) => area.id === selectedAreaId) || null
  const activePlan = getActiveManagementPlan(plans)
  const closedPlans = getClosedManagementPlans(plans)
  const cropNames = useMemo(() => Object.fromEntries(crops.map((crop) => [crop.id, crop.name])), [crops])
  const soilNames = useMemo(() => Object.fromEntries(soils.map((soil) => [soil.id, soil.soilType])), [soils])
  const areaReady = Boolean(selectedAreaId && activePlan)
  const dailyDataValid = isDailyDataValid(form)
  const resultAvailable = false
  const completedSteps = getManejoStepCompletion({ areaReady, dailyDataValid, reviewConfirmed, resultAvailable })

  const loadPlans = async (areaId: string, requestId: number) => {
    setPlansLoading(true); setPlansError('')
    try {
      const nextPlans = await managementPlansService.list(areaId)
      if (requestId !== selectionRequest.current) return
      setPlans(nextPlans)
    } catch (error) {
      if (requestId === selectionRequest.current) { setPlans([]); setPlansError(getApiErrorMessage(error)) }
    } finally {
      if (requestId === selectionRequest.current) setPlansLoading(false)
    }
  }

  const selectArea = (areaId: string) => {
    const requestId = selectionRequest.current + 1
    selectionRequest.current = requestId
    setSelectedAreaId(areaId); setPlans([]); setPlansError(''); setNotice(''); setPlanDialog(null)
    if (areaId) void loadPlans(areaId, requestId)
  }

  const retryPlans = () => { if (selectedAreaId) void loadPlans(selectedAreaId, selectionRequest.current) }
  const openCreatePlan = () => { if (selectedAreaId) setPlanDialog({ mode: 'create' }) }
  const openEditPlan = (plan: ManagementPlan) => setPlanDialog({ mode: 'edit', item: plan })
  const onPlanSaved = async (message: string) => {
    setPlanDialog(null); setNotice(message)
    if (selectedAreaId) await loadPlans(selectedAreaId, selectionRequest.current)
  }

  const updateField = (field: keyof FormState, value: string) => { setForm((current) => ({ ...current, [field]: value })); setErrors((current) => ({ ...current, [field]: undefined })); setReviewConfirmed(false) }
  const goToStep = (step: number) => { setCurrentStep(step); setErrors({}) }
  const validateDailyData = () => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {}
    if (!form.launchDate) nextErrors.launchDate = 'Informe a data do lançamento.'
    if (!form.irrigationDay || !/^\d+$/.test(form.irrigationDay) || Number(form.irrigationDay) < 1) nextErrors.irrigationDay = 'Informe um dia válido.'
    if (!form.etp || Number(form.etp) < 0) nextErrors.etp = 'Informe um valor igual ou maior que zero.'
    if (!form.precipitation || Number(form.precipitation) < 0) nextErrors.precipitation = 'Informe um valor igual ou maior que zero.'
    if (!form.realIrrigation || Number(form.realIrrigation) < 0) nextErrors.realIrrigation = 'Informe um valor igual ou maior que zero.'
    setErrors(nextErrors); return Object.keys(nextErrors).length === 0
  }
  const next = () => { if (currentStep === 0 && !areaReady) return; if (currentStep === 1 && !validateDailyData()) return; if (currentStep === 2 && (!areaReady || !dailyDataValid)) return; if (currentStep === 2) setReviewConfirmed(true); if (currentStep < steps.length - 1) setCurrentStep((step) => step + 1) }
  const previous = () => { if (currentStep > 0) setCurrentStep((step) => step - 1) }

  return <div>
    <PageHeader eyebrow="Operação" title="Manejo hídrico" description="Percorra as etapas para preparar um balanço hídrico." />
    {notice && <div className="success-banner">{notice}<button onClick={() => setNotice('')} aria-label="Fechar mensagem">×</button></div>}
    <section className="workflow-stepper" aria-label="Etapas do manejo hídrico">{steps.map((step, index) => { const Icon = step.icon; const isCurrent = index === currentStep; const isCompleted = completedSteps[index] && !isCurrent; return <button key={step.title} className={`workflow-step ${isCurrent ? 'current' : ''} ${isCompleted ? 'completed' : ''}`} onClick={() => goToStep(index)} aria-current={isCurrent ? 'step' : undefined}><span className="step-index">{isCompleted ? <Check size={14} /> : index + 1}</span><span className="step-copy"><strong>{step.title}</strong><small>{step.description}</small></span>{index < steps.length - 1 && <ChevronRight className="step-chevron" size={17} />}{isCurrent && <Icon className="step-mobile-icon" size={17} />}</button> })}</section>
    <div className="workflow-content">{currentStep === 0 && <AreaStep areas={areas} selectedAreaId={selectedAreaId} selectedArea={selectedArea} onAreaChange={selectArea} catalogLoading={catalogLoading} catalogError={catalogError} onRetryCatalogs={loadCatalogs} activePlan={activePlan} closedPlans={closedPlans} cropNames={cropNames} soilNames={soilNames} plansLoading={plansLoading} plansError={plansError} onRetryPlans={retryPlans} onCreatePlan={openCreatePlan} onEditPlan={openEditPlan} areaReady={areaReady} onNext={next} />}{currentStep === 1 && <DailyStep form={form} errors={errors} updateField={updateField} onBack={previous} onNext={next} />}{currentStep === 2 && <ReviewStepWithContext form={form} selectedArea={selectedArea} activePlan={activePlan} cropNames={cropNames} soilNames={soilNames} onBack={() => goToStep(1)} onNext={next} />}{currentStep === 3 && <ResultStep onBack={() => goToStep(2)} />}</div>
    {planDialog && selectedAreaId && <ManagementPlanDialog areaId={selectedAreaId} dialog={planDialog} crops={crops} soils={soils} onClose={() => setPlanDialog(null)} onSaved={onPlanSaved} />}
  </div>
}

type AreaStepProps = { areas: Area[]; selectedAreaId: string; selectedArea: Area | null; onAreaChange: (value: string) => void; catalogLoading: boolean; catalogError: string; onRetryCatalogs: () => void; activePlan: ManagementPlan | null; closedPlans: ManagementPlan[]; cropNames: Record<string, string>; soilNames: Record<string, string>; plansLoading: boolean; plansError: string; onRetryPlans: () => void; onCreatePlan: () => void; onEditPlan: (plan: ManagementPlan) => void; areaReady: boolean; onNext: () => void }
function AreaStep({ areas, selectedAreaId, selectedArea, onAreaChange, catalogLoading, catalogError, onRetryCatalogs, activePlan, closedPlans, cropNames, soilNames, plansLoading, plansError, onRetryPlans, onCreatePlan, onEditPlan, areaReady, onNext }: AreaStepProps) {
  return <div className="workflow-grid"><section className="panel workflow-panel"><div className="workflow-panel-header"><div><span className="panel-kicker">Etapa 1 de 4</span><h2>Selecione uma área de cultivo</h2><p>Escolha a área e configure o plano que será usado como base para o balanço.</p></div><Sprout className="workflow-header-icon" size={22} /></div><div className="select-placeholder"><label htmlFor="area-select">Área de cultivo</label><select id="area-select" value={selectedAreaId} disabled={catalogLoading || Boolean(catalogError)} onChange={(event) => onAreaChange(event.target.value)}><option value="">{catalogLoading ? 'Carregando áreas...' : areas.length === 0 ? 'Nenhuma área cadastrada' : 'Selecione uma área'}</option>{areas.map((area) => <option key={area.id} value={area.id}>{area.name}</option>)}</select><small>{catalogError || (areas.length === 0 && !catalogLoading ? 'Cadastre uma área de cultivo para habilitar o início do manejo hídrico.' : 'A seleção é mantida apenas durante esta sessão.')}</small></div>{catalogError ? <div className="workflow-empty"><AlertCircle size={20} /><div><strong>Não foi possível carregar as áreas</strong><p>{catalogError}</p><button className="button secondary" onClick={onRetryCatalogs}>Tentar novamente</button></div></div> : !selectedArea ? <div className="workflow-empty"><LockKeyhole size={20} /><div><strong>Nenhuma área selecionada</strong><p>Escolha uma área para consultar o plano de manejo ativo.</p></div></div> : plansLoading ? <div className="workflow-empty"><LoadingState /></div> : plansError ? <div className="workflow-empty"><AlertCircle size={20} /><div><strong>Não foi possível consultar os planos</strong><p>{plansError}</p><button className="button secondary" onClick={onRetryPlans}>Tentar novamente</button></div></div> : !activePlan ? <div className="workflow-empty"><LockKeyhole size={20} /><div><strong>Esta área não possui plano ativo</strong><p>Configure um plano no painel ao lado para concluir esta etapa.</p></div></div> : <div className="workflow-empty workflow-ready"><Check size={20} /><div><strong>Área e plano ativo carregados</strong><p>{selectedArea.name} está pronta para iniciar o manejo hídrico.</p></div></div>}<div className="workflow-actions"><button className="button primary" disabled={!areaReady} onClick={onNext}>Continuar <ArrowRight size={16} /></button></div></section><ManagementPlanSummary activePlan={activePlan} closedPlans={closedPlans} cropNames={cropNames} soilNames={soilNames} loading={plansLoading} error={plansError} canCreate={Boolean(selectedArea)} onCreate={onCreatePlan} onEdit={onEditPlan} /></div>
}

function DailyStep({ form, errors, updateField, onBack, onNext }: { form: FormState; errors: Partial<Record<keyof FormState, string>>; updateField: (field: keyof FormState, value: string) => void; onBack: () => void; onNext: () => void }) { return <section className="panel workflow-panel daily-panel"><div className="workflow-panel-header"><div><span className="panel-kicker">Etapa 2 de 4</span><h2>Informe os dados diários</h2><p>Preencha somente os dados observados no dia do lançamento.</p></div><CloudRain className="workflow-header-icon" size={22} /></div><div className="form-section"><div className="form-section-title"><span>Identificação do lançamento</span><small>Obrigatório</small></div><div className="form-grid two-columns"><Field label="Data do lançamento" hint="Dia em que os dados foram registrados." type="date" value={form.launchDate} error={errors.launchDate} onChange={(value) => updateField('launchDate', value)} /><Field label="Dia do turno de rega (TR)" hint="Número do dia dentro do turno de rega." type="number" min="1" value={form.irrigationDay} error={errors.irrigationDay} onChange={(value) => updateField('irrigationDay', value)} /></div></div><div className="form-section"><div className="form-section-title"><span>Dados meteorológicos</span><small>Valores em milímetros</small></div><div className="form-grid two-columns"><Field label="Evapotranspiração de referência (ETP)" hint="Demanda atmosférica de água no dia." suffix="mm" type="number" min="0" step="0.01" value={form.etp} error={errors.etp} onChange={(value) => updateField('etp', value)} /><Field label="Precipitação (P)" hint="Chuva observada no dia." suffix="mm" type="number" min="0" step="0.01" value={form.precipitation} error={errors.precipitation} onChange={(value) => updateField('precipitation', value)} /></div></div><div className="form-section"><div className="form-section-title"><span>Irrigação aplicada</span><small>Valor observado</small></div><div className="form-grid one-column"><Field label="Irrigação real aplicada no dia" hint="Lâmina efetivamente aplicada pelo usuário. Aceita zero em dias sem aplicação." suffix="mm" type="number" min="0" step="0.01" value={form.realIrrigation} error={errors.realIrrigation} onChange={(value) => updateField('realIrrigation', value)} /></div><div className="input-note"><AlertCircle size={14} /> A irrigação ideal será calculada pelo sistema em uma etapa futura; não informe esse valor aqui.</div></div><div className="workflow-actions"><button className="button secondary" onClick={onBack}><ArrowLeft size={16} /> Voltar</button><button className="button primary" onClick={onNext}>Revisar informações <ArrowRight size={16} /></button></div></section> }
function Field({ label, hint, suffix, type, min, step, value, error, onChange }: { label: string; hint: string; suffix?: string; type: string; min?: string; step?: string; value: string; error?: string; onChange: (value: string) => void }) { return <label className={`form-field ${error ? 'has-error' : ''}`}><span className="field-label">{label}</span><span className="field-control"><input type={type} min={min} step={step} value={value} onChange={(event) => onChange(event.target.value)} />{suffix && <em>{suffix}</em>}</span><small>{error ?? hint}</small></label> }
function ReviewStep({ form, onBack, onNext }: { form: FormState; onBack: () => void; onNext: () => void }) { return <section className="panel workflow-panel review-panel"><div className="workflow-panel-header"><div><span className="panel-kicker">Etapa 3 de 4</span><h2>Revise as informações</h2><p>Confira os dados que serão preparados para a execução do balanço.</p></div><ClipboardCheck className="workflow-header-icon" size={22} /></div><div className="review-grid"><ReviewGroup title="Área e plano de manejo" items={['Área de cultivo', 'Cultura', 'Perfil de solo']} empty /><ReviewGroup title="Lançamento" items={[['Data do lançamento', form.launchDate], ['Dia do turno de rega (TR)', form.irrigationDay]]} /><ReviewGroup title="Dados meteorológicos" items={[['ETP', `${form.etp} mm`], ['Precipitação (P)', `${form.precipitation} mm`]]} /><ReviewGroup title="Irrigação real aplicada" items={[['Lâmina aplicada', `${form.realIrrigation} mm`]]} /></div><div className="review-warning"><AlertCircle size={16} /><span>A execução ainda não está disponível. Esta etapa apenas organiza a revisão dos dados.</span></div><div className="workflow-actions"><button className="button secondary" onClick={onBack}><ArrowLeft size={16} /> Voltar e corrigir</button><button className="button primary" disabled onClick={onNext}>Consultar resultado <ArrowRight size={16} /></button></div></section> }
function ReviewGroup({ title, items, empty }: { title: string; items: (string | [string, string])[]; empty?: boolean }) { return <div className="review-group"><h3>{title}</h3>{empty ? <div className="review-empty">Selecione uma área para carregar os dados do plano.</div> : items.map((item) => { const [label, value] = Array.isArray(item) ? item : [item, '—']; return <div className="review-row" key={label}><span>{label}</span><strong>{value || '—'}</strong></div> })}</div> }
function ResultStep({ onBack }: { onBack: () => void }) { return <section className="panel workflow-panel result-panel"><div className="workflow-panel-header"><div><span className="panel-kicker">Etapa 4 de 4</span><h2>Resultado do balanço hídrico</h2><p>Esta área está preparada para receber os resultados do backend.</p></div><Waves className="workflow-header-icon" size={22} /></div><div className="result-empty"><div className="result-icon"><LockKeyhole size={22} /></div><h3>Resultado indisponível</h3><p>O balanço ainda não foi executado. Quando a integração estiver disponível, os indicadores e a recomendação aparecerão aqui.</p><div className="result-preview-grid"><span>ETc (mm)</span><span>CAD (mm)</span><span>AFD inicial (mm)</span><span>AFD final (mm)</span><span>Irrigação ideal (mm)</span><span>Tempo do aspersor</span></div></div><div className="workflow-actions"><button className="button secondary" onClick={onBack}><ArrowLeft size={16} /> Voltar para revisão</button></div></section> }
