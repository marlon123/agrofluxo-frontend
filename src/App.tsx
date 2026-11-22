import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { Dashboard } from './pages/Dashboard'
import { ModulePage } from './pages/ModulePage'
import { AreasPage } from './pages/AreasPage'
import { ManejoPage } from './pages/ManejoPage'
export default function App() {
  return <Routes><Route element={<AppLayout />}><Route path="/" element={<Dashboard />} /><Route path="/areas" element={<AreasPage />} /><Route path="/culturas" element={<ModulePage module="culturas" />} /><Route path="/solos" element={<ModulePage module="solos" />} /><Route path="/manejo" element={<ManejoPage />} /><Route path="/historico" element={<ModulePage module="historico" />} /><Route path="*" element={<Navigate to="/" replace />} /></Route></Routes>
}
