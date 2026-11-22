import { NavLink } from 'react-router-dom'
import { ChevronLeft, Menu, Sprout } from 'lucide-react'
import { navigation } from '../lib/modules'
type Props = { collapsed: boolean; onToggle: () => void; mobileOpen: boolean; onClose: () => void }
export function Sidebar({ collapsed, onToggle, mobileOpen, onClose }: Props) {
  return <><div className={`sidebar-backdrop ${mobileOpen ? 'visible' : ''}`} onClick={onClose} /><aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
    <div className="brand"><span className="brand-mark"><Sprout size={19} /></span><span className="brand-name">Agrofluxo</span><button className="mobile-close" onClick={onClose}><ChevronLeft size={18} /></button></div>
    <div className="workspace-label">Workspace</div><nav className="nav-list">{navigation.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} end={to === '/'} onClick={onClose} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}><Icon size={18} strokeWidth={1.8} /><span>{label}</span></NavLink>)}</nav>
    <div className="sidebar-bottom"><div className="status-dot" /><span>Ambiente de trabalho</span></div><button className="collapse-button" onClick={onToggle}>{collapsed ? <Menu size={18} /> : <><ChevronLeft size={17} /><span>Recolher menu</span></>}</button>
  </aside></>
}
