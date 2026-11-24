import { AlertCircle, ArrowLeft, ArrowRight, ClipboardCheck } from 'lucide-react'
import type { Area, ManagementPlan } from '../lib/api/types'
import type { DailyFormData } from '../lib/manejoFlow'

type Props = {
  form: DailyFormData
  selectedArea: Area | null
  activePlan: ManagementPlan | null
  cropNames: Record<string, string>
  soilNames: Record<string, string>
  onBack: () => void
  onNext: () => void
}

type ReviewItem = [string, string]

export function ReviewStep({ form, selectedArea, activePlan, cropNames, soilNames, onBack, onNext }: Props) {
  const areaItems: ReviewItem[] = [
    ['Área de cultivo', selectedArea?.name || '—'],
    ['Cultura', activePlan ? cropNames[activePlan.cropId] || 'Cultura não encontrada' : '—'],
    ['Perfil de solo', activePlan ? soilNames[activePlan.soilProfileId] || 'Solo não encontrado' : '—'],
  ]

  return <section className="panel workflow-panel review-panel"><div className="workflow-panel-header"><div><span className="panel-kicker">Etapa 3 de 4</span><h2>Revise as informações</h2><p>Confira os dados que serão preparados para a execução do balanço.</p></div><ClipboardCheck className="workflow-header-icon" size={22} /></div><div className="review-grid"><ReviewGroup title="Área e plano de manejo" items={areaItems} /><ReviewGroup title="Lançamento" items={[['Data do lançamento', formatReviewDate(form.launchDate)], ['Dia do turno de rega (TR)', form.irrigationDay || '—']]} /><ReviewGroup title="Dados meteorológicos" items={[['ETP', formatMillimeters(form.etp)], ['Precipitação (P)', formatMillimeters(form.precipitation)]]} /><ReviewGroup title="Irrigação real aplicada" items={[['Lâmina aplicada', formatMillimeters(form.realIrrigation)]]} /></div><div className="review-warning"><AlertCircle size={16} /><span>A execução ainda não está disponível. Você pode avançar para consultar a etapa de resultado, que permanecerá indisponível até a integração do cálculo.</span></div><div className="workflow-actions"><button className="button secondary" onClick={onBack}><ArrowLeft size={16} /> Voltar e corrigir</button><button className="button primary" onClick={onNext}>Consultar resultado <ArrowRight size={16} /></button></div></section>
}

function formatReviewDate(value: string) { return value ? new Intl.DateTimeFormat('pt-BR').format(new Date(`${value}T00:00:00`)) : '—' }
function formatMillimeters(value: string) { return value ? `${value} mm` : '—' }

function ReviewGroup({ title, items }: { title: string; items: ReviewItem[] }) {
  return <div className="review-group"><h3>{title}</h3>{items.map(([label, value]) => <div className="review-row" key={label}><span>{label}</span><strong>{value || '—'}</strong></div>)}</div>
}
