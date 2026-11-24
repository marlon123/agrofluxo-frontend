export type UUID = string

export type PagedResponse<T> = {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export type ValidationViolation = { field?: string; message: string }
export type ProblemDetails = { type?: string; title?: string; status?: number; detail?: string; violations?: ValidationViolation[]; [key: string]: unknown }

export type IrrigationSystemType = 'SPRINKLER' | 'DRIP' | 'MICRO_SPRINKLER' | 'FURROW' | 'CENTER_PIVOT' | 'SURFACE'
export type MeasurementUnit = 'HECTARES' | 'SQUARE_METERS' | 'CUBIC_METERS_PER_HOUR' | 'LITERS_PER_SECOND' | 'MILLIMETERS' | 'MILLIMETERS_PER_DAY' | 'GRAMS_PER_CUBIC_CENTIMETER' | 'PERCENT' | 'VOLUMETRIC_WATER_CONTENT' | 'HOURS' | 'FRACTION' | 'DIMENSIONLESS'

export type Area = { id: UUID; name: string; areaHectares: number | null; latitude: number | null; longitude: number | null; generalCharacteristics: string | null; irrigationSystemType: IrrigationSystemType | null; systemFlowRate: number | null; irrigationEfficiency: number | null }
export type AreaInput = Omit<Area, 'id'>

export type CropStage = { name: string; kc: number; stageOrder: number }
export type Crop = { id: UUID; name: string; variety: string | null; cultivationCycleDays: number | null; stages: CropStage[] | null; kc: number | null; rootDepthMm: number | null }
export type CropInput = Omit<Crop, 'id'>

export type SoilProfile = { id: UUID; soilType: string; fieldCapacity: number | null; permanentWiltingPoint: number | null; fieldCapacityGravimetricPct: number | null; permanentWiltingPointGravimetricPct: number | null; bulkDensity: number; effectiveRootDepth: number | null; availableWater: number | null; soilWaterUnit: MeasurementUnit | null; bulkDensityUnit: MeasurementUnit | null; rootDepthUnit: MeasurementUnit | null; availableWaterUnit: MeasurementUnit | null }
export type SoilProfileInput = Omit<SoilProfile, 'id'>

export type ManagementPlan = { id: UUID; areaId: UUID; cropId: UUID; soilProfileId: UUID; startDate: string; endDate: string | null; fFactor: number; sprinklerRateMmPerHour: number }
export type ManagementPlanInput = { cropId: UUID | null; soilProfileId: UUID | null; startDate: string | null; endDate: string | null; fFactor: number; sprinklerRateMmPerHour: number }

export type DailyWeather = { id: UUID; areaId: UUID; date: string; etpMm: number; precipitationMm: number }
export type DailyWeatherInput = { date: string; etpMm: number; precipitationMm: number }
export type AppliedIrrigation = { id: UUID; areaId: UUID; date: string; appliedIrrigationMm: number }
export type AppliedIrrigationInput = { date: string; appliedIrrigationMm: number }
