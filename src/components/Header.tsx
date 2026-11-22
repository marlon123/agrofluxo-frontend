import { Bell, Menu, Search } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { navigation } from '../lib/modules'
export function Header({ onMenu }: { onMenu: () => void }) {
  const location = useLocation(); const current = navigation.find(item => item.to === location.pathname) ?? navigation[0]
  return <header className="topbar"><button className="mobile-menu" onClick={onMenu}><Menu size={21} /></button><div className="topbar-context"><span className="topbar-section">Operação</span><span className="topbar-separator">/</span><span>{current.label}</span></div><div className="topbar-actions"><button className="icon-button" aria-label="Pesquisar"><Search size={18} /></button><button className="icon-button notification" aria-label="Notificações"><Bell size={18} /><i /></button><div className="avatar">MC</div></div></header>
}
