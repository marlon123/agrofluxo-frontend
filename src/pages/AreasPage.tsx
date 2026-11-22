import { Filter, MoreHorizontal, Plus, Search, Sprout } from 'lucide-react'
import { useState } from 'react'
import { EmptyState } from '../components/EmptyState'
import { PageHeader } from '../components/PageHeader'

export function AreasPage() {
  const [search, setSearch] = useState('')

  return <div>
    <PageHeader eyebrow="Cadastro" title="Áreas de cultivo" description="Organize as áreas acompanhadas e seus dados de referência." action={<button className="button primary"><Plus size={17} /> Nova área</button>} />
    <section className="panel table-panel" aria-label="Listagem de áreas de cultivo">
      <div className="toolbar areas-toolbar">
        <label className="search-field search-input" htmlFor="area-search"><Search size={16} /><input id="area-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nome da área..." /></label>
        <div className="toolbar-actions"><button className="button secondary"><Filter size={16} /> Filtros <span className="filter-placeholder">(em breve)</span></button></div>
      </div>
      <div className="table-scroll">
        <table className="data-table"><thead><tr><th>Área</th><th>Tamanho</th><th>Sistema de irrigação</th><th>Plano de manejo</th><th className="actions-column">Ações</th></tr></thead><tbody><tr><td colSpan={5}><EmptyState icon={Sprout} title={search ? 'Nenhuma área encontrada' : 'Nenhuma área cadastrada'} description={search ? 'Revise o termo de busca ou limpe o filtro para tentar novamente.' : 'Cadastre a primeira área para começar a organizar sua operação de irrigação.'} /><div className="empty-action"><button className="button primary"><Plus size={16} /> Nova área</button></div></td></tr></tbody></table>
      </div>
      <div className="table-footer"><span>Listagem preparada para paginação</span><button className="icon-button" aria-label="Mais ações"><MoreHorizontal size={18} /></button></div>
    </section>
  </div>
}
