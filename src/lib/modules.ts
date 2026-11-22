import type { LucideIcon } from 'lucide-react'
import { BarChart3, Droplets, History, Leaf, LayoutDashboard, Mountain, Sprout } from 'lucide-react'

export type ModuleKey = 'areas' | 'culturas' | 'solos' | 'manejo' | 'historico'
export type ModuleConfig = { key: ModuleKey; label: string; title: string; description: string; icon: LucideIcon; eyebrow: string; action?: string }

export const navigation = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/areas', label: 'Áreas de cultivo', icon: Sprout },
  { to: '/culturas', label: 'Culturas', icon: Leaf },
  { to: '/solos', label: 'Perfis de solo', icon: Mountain },
  { to: '/manejo', label: 'Manejo hídrico', icon: Droplets },
  { to: '/historico', label: 'Histórico', icon: History },
]

export const modules: Record<ModuleKey, ModuleConfig> = {
  areas: { key: 'areas', label: 'Áreas de cultivo', title: 'Áreas de cultivo', description: 'Organize as áreas acompanhadas e seus dados de referência.', icon: Sprout, eyebrow: 'Cadastro', action: 'Nova área' },
  culturas: { key: 'culturas', label: 'Culturas', title: 'Culturas', description: 'Gerencie as culturas disponíveis para o planejamento.', icon: Leaf, eyebrow: 'Cadastro', action: 'Nova cultura' },
  solos: { key: 'solos', label: 'Perfis de solo', title: 'Perfis de solo', description: 'Mantenha os perfis de solo usados nas recomendações.', icon: Mountain, eyebrow: 'Configuração', action: 'Novo perfil' },
  manejo: { key: 'manejo', label: 'Manejo hídrico', title: 'Manejo hídrico', description: 'Acompanhe o fluxo de informações para executar o balanço hídrico.', icon: Droplets, eyebrow: 'Operação' },
  historico: { key: 'historico', label: 'Histórico', title: 'Histórico', description: 'Consulte os balanços hídricos executados ao longo do tempo.', icon: BarChart3, eyebrow: 'Consultas' },
}
