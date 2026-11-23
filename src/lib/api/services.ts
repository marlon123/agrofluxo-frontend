import { apiClient, buildQuery } from './client'
import type { Area, AreaInput, Crop, CropInput, PagedResponse, SoilProfile, SoilProfileInput } from './types'

export const areasService = {
  list: (params: { page: number; size: number; sortBy?: 'name' | 'areaHectares'; direction?: 'asc' | 'desc' }) => apiClient.get<PagedResponse<Area>>(`/areas${buildQuery(params)}`),
  get: (id: string) => apiClient.get<Area>(`/areas/${id}`),
  create: (input: AreaInput) => apiClient.post<Area>('/areas', input),
  update: (id: string, input: AreaInput) => apiClient.put<Area>(`/areas/${id}`, input),
  remove: (id: string) => apiClient.delete(`/areas/${id}`),
}

export const cropsService = {
  list: (params: { page: number; size: number }) => apiClient.get<PagedResponse<Crop>>(`/crops${buildQuery(params)}`),
  get: (id: string) => apiClient.get<Crop>(`/crops/${id}`),
  create: (input: CropInput) => apiClient.post<Crop>('/crops', input),
  update: (id: string, input: CropInput) => apiClient.put<Crop>(`/crops/${id}`, input),
  remove: (id: string) => apiClient.delete(`/crops/${id}`),
}

export const soilProfilesService = {
  list: (params: { page: number; size: number }) => apiClient.get<PagedResponse<SoilProfile>>(`/soil-profiles${buildQuery(params)}`),
  get: (id: string) => apiClient.get<SoilProfile>(`/soil-profiles/${id}`),
  create: (input: SoilProfileInput) => apiClient.post<SoilProfile>('/soil-profiles', input),
  update: (id: string, input: SoilProfileInput) => apiClient.put<SoilProfile>(`/soil-profiles/${id}`, input),
  remove: (id: string) => apiClient.delete(`/soil-profiles/${id}`),
}
