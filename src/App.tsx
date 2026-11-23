import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { Dashboard } from './pages/Dashboard'
import { ModulePage } from './pages/ModulePage'
import { AreasPage } from './pages/AreasPage'
import { ManejoPage } from './pages/ManejoPage'
import { CulturasPage } from './pages/CulturasPage'
import { SolosPage } from './pages/SolosPage'
export default function App() {
  return <Routes><Route element={<AppLayout />}><Route path="/" element={<Dashboard />} /><Route path="/areas" element={<AreasPage />} /><Route path="/culturas" element={<CulturasPage />} /><Route path="/solos" element={<SolosPage />} /><Route path="/manejo" element={<ManejoPage />} /><Route path="/historico" element={<ModulePage module="historico" />} /><Route path="*" element={<Navigate to="/" replace />} /></Route></Routes>
}
