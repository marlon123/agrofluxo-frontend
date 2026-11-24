import type { MeasurementUnit } from './api/types'

const measurementUnitLabels: Record<MeasurementUnit, string> = {
  HECTARES: 'ha',
  SQUARE_METERS: 'm²',
  CUBIC_METERS_PER_HOUR: 'm³/h',
  LITERS_PER_SECOND: 'L/s',
  MILLIMETERS: 'mm',
  MILLIMETERS_PER_DAY: 'mm/dia',
  GRAMS_PER_CUBIC_CENTIMETER: 'g/cm³',
  PERCENT: '%',
  VOLUMETRIC_WATER_CONTENT: 'cm³/cm³',
  HOURS: 'h',
  FRACTION: 'fração',
  DIMENSIONLESS: 'adimensional',
}

export function formatMeasurementUnit(unit: MeasurementUnit | null | undefined) {
  return unit ? measurementUnitLabels[unit] ?? unit : ''
}
