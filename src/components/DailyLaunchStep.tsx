import { AlertCircle, ArrowLeft, ArrowRight, Check, CloudRain, Droplets } from 'lucide-react'
import { LoadingState } from './ResourceFeedback'
import type { DailyFormData } from '../lib/manejoFlow'
import type { DailyLaunchRecord } from '../lib/dailyLaunch'

type Props = {
  form: DailyFormData
  errors: Partial<Record<keyof DailyFormData, string>>
  history: DailyLaunchRecord[]
  loading: boolean
  saving: boolean
  saved: boolean
  error: string
  onChange: (field: keyof DailyFormData, value: string) => void
  onDateChange: (value: string) => void
  onBack: () => void
  onSave: () => Promise<boolean>
  onContinue: () => Promise<void>
}

export function DailyLaunchStep({ form, errors, history, loading, saving, saved, error, onChange, onDateChange, onBack, onSave, onContinue }: Props) {
  return <section className="panel workflow-panel daily-panel"><div className="workflow-panel-header"><div><span className="panel-kicker">Etapa 2 de 4</span><h2>Informe os dados diários</h2><p>Preencha os dados observados e salve o lançamento associado à área selecionada.</p></div><CloudRain className="workflow-header-icon" size={22} /></div>{error && <div className="form-error" role="alert">{error}</div>}{saved && <div className="daily-saved-status"><Check size={15} /> Lançamento carregado do backend.</div>}<div className="form-section"><div className="form-section-title"><span>Identificação do lançamento</span><small>Obrigatório</small></div><div className="form-grid two-columns"><Field label="Data do lançamento" hint="Datas futuras não são aceitas pelo backend." type="date" max={new Date().toISOString().slice(0, 10)} value={form.launchDate} error={errors.launchDate} onChange={onDateChange} /><Field label="Dia do turno de rega (TR)" hint="Número do dia dentro do turno de rega." type="number" min="1" value={form.irrigationDay} error={errors.irrigationDay} onChange={(value) => onChange('irrigationDay', value)} /></div></div><div className="form-section"><div className="form-section-title"><span>Dados meteorológicos</span><small>Valores em milímetros</small></div><div className="form-grid two-columns"><Field label="Evapotranspiração de referência (ETP)" hint="Valor informado manualmente. Zero é válido." suffix="mm" type="number" min="0" max="1000" step="0.01" value={form.etp} error={errors.etp} onChange={(value) => onChange('etp', value)} /><Field label="Precipitação (P)" hint="Chuva observada no dia. Zero é válido." suffix="mm" type="number" min="0" max="1000" step="0.01" value={form.precipitation} error={errors.precipitation} onChange={(value) => onChange('precipitation', value)} /></div></div><div className="form-section"><div className="form-section-title"><span>Irrigação aplicada</span><small>Valor observado</small></div><div className="form-grid one-column"><Field label="Irrigação real aplicada no dia" hint="Lâmina efetivamente aplicada pelo usuário. Zero é válido em dias sem aplicação." suffix="mm" type="number" min="0" max="1000" step="0.01" value={form.realIrrigation} error={errors.realIrrigation} onChange={(value) => onChange('realIrrigation', value)} /></div><div className="input-note"><AlertCircle size={14} /> Este campo representa somente a irrigação real aplicada; a irrigação ideal será calculada em etapa futura.</div></div><div className="workflow-actions"><button className="button secondary" onClick={onBack}><ArrowLeft size={16} /> Voltar</button><button className="button secondary" disabled={saving || loading} onClick={() => void onSave()}>{saving ? 'Salvando...' : 'Salvar lançamento'} <Droplets size={16} /></button><button className="button primary" disabled={saving || loading} onClick={() => void onContinue()}>{saving ? 'Salvando...' : 'Salvar e revisar'} <ArrowRight size={16} /></button></div><DailyLaunchHistory history={history} loading={loading} /></section>
}

function DailyLaunchHistory({ history, loading }: { history: DailyLaunchRecord[]; loading: boolean }) {
  return <div className="daily-history"><div className="form-section-title"><span>Histórico de lançamentos</span><small>Até 366 dias</small></div>{loading ? <LoadingState /> : history.length === 0 ? <p className="daily-history-empty">Nenhum lançamento encontrado para o período consultado.</p> : <div className="daily-history-list">{history.slice(0, 12).map((entry) => <div className="daily-history-row" key={entry.date}><strong>{formatDate(entry.date)}</strong><span>ETP {formatValue(entry.etpMm)} · P {formatValue(entry.precipitationMm)} · IR {formatValue(entry.appliedIrrigationMm)}</span></div>)}</div>}</div>
}

function formatDate(value: string) { return new Intl.DateTimeFormat('pt-BR').format(new Date(`${value}T00:00:00`)) }
function formatValue(value: number | undefined) { return value === undefined ? '—' : `${value.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} mm` }

function Field({ label, hint, suffix, type, min, max, step, value, error, onChange }: { label: string; hint: string; suffix?: string; type: string; min?: string; max?: string; step?: string; value: string; error?: string; onChange: (value: string) => void }) {
  return <label className={`form-field ${error ? 'has-error' : ''}`}><span className="field-label">{label}</span><span className="field-control"><input type={type} min={min} max={max} step={step} value={value} onChange={(event) => onChange(event.target.value)} />{suffix && <em>{suffix}</em>}</span><small>{error ?? hint}</small></label>
}
