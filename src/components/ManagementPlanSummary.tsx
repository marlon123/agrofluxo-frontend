import { CalendarDays, ClipboardCheck, Droplets, Leaf, Mountain, Pencil, Plus, Waves } from 'lucide-react'
import type { ManagementPlan } from '../lib/api/types'

type Props = {
  activePlan: ManagementPlan | null
  closedPlans: ManagementPlan[]
  cropNames: Record<string, string>
  soilNames: Record<string, string>
  loading: boolean
  error: string
  canCreate: boolean
  onCreate: () => void
  onEdit: (plan: ManagementPlan) => void
}

const formatDate = (value: string | null) => value ? new Intl.DateTimeFormat('pt-BR').format(new Date(`${value}T00:00:00`)) : 'Em aberto'
const formatNumber = (value: number) => value.toLocaleString('pt-BR', { maximumFractionDigits: 4 })
const formatFactor = (value: number) => `${formatNumber(value)} (${(value * 100).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}%)`

export function ManagementPlanSummary({ activePlan, closedPlans, cropNames, soilNames, loading, error, canCreate, onCreate, onEdit }: Props) {
  return <aside className="panel plan-preview management-plan-summary">
    <div className="panel-kicker">Plano de manejo</div>
    <h2>{activePlan ? 'Plano ativo' : 'Configuração necessária'}</h2>
    {loading ? <div className="plan-summary-feedback">Carregando planos...</div> : error ? <div className="plan-summary-error">{error}</div> : activePlan ? <>
      <p className="plan-muted">Vigente desde {formatDate(activePlan.startDate)}.</p>
      <PlanDetails plan={activePlan} cropNames={cropNames} soilNames={soilNames} />
      <button className="button secondary plan-summary-action" onClick={() => onEdit(activePlan)}><Pencil size={15} /> Editar plano</button>
    </> : <>
      <p className="plan-muted">Selecione uma área e configure um plano ativo para habilitar a primeira etapa.</p>
      <button className="button primary plan-summary-action" onClick={onCreate} disabled={loading || !canCreate}><Plus size={15} /> Configurar plano</button>
    </>}
    {closedPlans.length > 0 && <div className="closed-plans"><div className="closed-plans-title"><ClipboardCheck size={15} /> Planos encerrados</div><p className="closed-plans-hint">Planos com data final são encerrados. Edite um plano para limpar a data final e torná-lo ativo.</p>{closedPlans.map((plan) => <div className="closed-plan" key={plan.id}><div><strong>{formatDate(plan.startDate)} — {formatDate(plan.endDate)}</strong><small>{cropNames[plan.cropId] || 'Cultura não encontrada'} · {soilNames[plan.soilProfileId] || 'Solo não encontrado'}</small></div><div className="closed-plan-meta"><span>{formatFactor(plan.fFactor)}</span><button className="icon-button" title="Editar plano encerrado" aria-label={`Editar plano de ${formatDate(plan.startDate)}`} onClick={() => onEdit(plan)}><Pencil size={14} /></button></div></div>)}</div>}
  </aside>
}

function PlanDetails({ plan, cropNames, soilNames }: { plan: ManagementPlan; cropNames: Record<string, string>; soilNames: Record<string, string> }) {
  return <div className="plan-fields plan-summary-fields">
    <PlanInfo icon={Leaf} label="Cultura" value={cropNames[plan.cropId] || 'Cultura não encontrada'} />
    <PlanInfo icon={Mountain} label="Perfil de solo" value={soilNames[plan.soilProfileId] || 'Solo não encontrado'} />
    <PlanInfo icon={CalendarDays} label="Período do plano" value={`${formatDate(plan.startDate)} — ${formatDate(plan.endDate)}`} />
    <PlanInfo icon={Droplets} label="Fator de disponibilidade (F)" value={formatFactor(plan.fFactor)} />
    <PlanInfo icon={Waves} label="Taxa do aspersor" value={`${formatNumber(plan.sprinklerRateMmPerHour)} mm/h`} />
  </div>
}

function PlanInfo({ icon: Icon, label, value }: { icon: typeof Leaf; label: string; value: string }) {
  return <div className="info-item"><Icon size={15} /><span>{label}</span><b title={value}>{value}</b></div>
}
