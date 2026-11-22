import { Filter, Plus, Search } from 'lucide-react'
import { EmptyState } from '../components/EmptyState'
import { PageHeader } from '../components/PageHeader'
import { modules, type ModuleKey } from '../lib/modules'
export function ModulePage({ module }: { module: ModuleKey }) { const config = modules[module]; const Icon = config.icon; return <div><PageHeader eyebrow={config.eyebrow} title={config.title} description={config.description} action={config.action ? <button className="button primary"><Plus size={17} /> {config.action}</button> : undefined} /><div className="panel module-panel"><div className="toolbar"><div className="search-field"><Search size={16} /><span>Buscar {config.label.toLowerCase()}...</span></div><button className="button secondary"><Filter size={16} /> Filtros</button></div><EmptyState icon={Icon} title={`Nenhum registro de ${config.label.toLowerCase()}`} description="Quando houver dados cadastrados, eles serão exibidos nesta área." /></div></div> }
