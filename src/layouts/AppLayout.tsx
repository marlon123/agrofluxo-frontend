import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '../components/Header'
import { Sidebar } from '../components/Sidebar'
export function AppLayout() { const [collapsed, setCollapsed] = useState(false); const [mobileOpen, setMobileOpen] = useState(false); return <div className={`app-shell ${collapsed ? 'sidebar-collapsed' : ''}`}><Sidebar collapsed={collapsed} onToggle={() => setCollapsed(v => !v)} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} /><div className="main-area"><Header onMenu={() => setMobileOpen(true)} /><main className="content"><Outlet /></main><footer className="footer">Agrofluxo <span>•</span> Fundação do produto</footer></div></div> }
