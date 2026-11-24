import type { AppliedIrrigation, DailyWeather } from './api/types'
import type { DailyFormData } from './manejoFlow'

export type DailyLaunchRecord = {
  date: string
  etpMm?: number
  precipitationMm?: number
  appliedIrrigationMm?: number
}

export function todayUtc() {
  return new Date().toISOString().slice(0, 10)
}

export function getDailyQueryRange(to: string) {
  const date = new Date(`${to}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() - 365)
  return { from: date.toISOString().slice(0, 10), to }
}

export function mergeDailyLaunchRecords(weather: DailyWeather[], irrigation: AppliedIrrigation[]) {
  const records = new Map<string, DailyLaunchRecord>()
  weather.forEach((entry) => records.set(entry.date, { ...(records.get(entry.date) || { date: entry.date }), date: entry.date, etpMm: entry.etpMm, precipitationMm: entry.precipitationMm }))
  irrigation.forEach((entry) => records.set(entry.date, { ...(records.get(entry.date) || { date: entry.date }), date: entry.date, appliedIrrigationMm: entry.appliedIrrigationMm }))
  return [...records.values()].sort((a, b) => b.date.localeCompare(a.date))
}

export function getDailyFormValues(date: string, weather: DailyWeather[], irrigation: AppliedIrrigation[]) {
  const weatherEntry = weather.find((entry) => entry.date === date)
  const irrigationEntry = irrigation.find((entry) => entry.date === date)
  return {
    etp: weatherEntry ? String(weatherEntry.etpMm) : '',
    precipitation: weatherEntry ? String(weatherEntry.precipitationMm) : '',
    realIrrigation: irrigationEntry ? String(irrigationEntry.appliedIrrigationMm) : '',
    complete: Boolean(weatherEntry && irrigationEntry),
  }
}

export function validateDailyLaunchForm(form: DailyFormData) {
  const errors: Partial<Record<keyof DailyFormData, string>> = {}
  const decimalPattern = /^\d+(?:\.\d{1,2})?$/
  if (!form.launchDate) errors.launchDate = 'Informe a data do lançamento.'
  else if (form.launchDate > todayUtc()) errors.launchDate = 'A data não pode ser futura.'
  const validateMillimeters = (field: 'etp' | 'precipitation' | 'realIrrigation', label: string) => {
    const value = form[field]
    if (value.trim() === '' || !decimalPattern.test(value) || Number(value) < 0 || Number(value) > 1000) errors[field] = `Informe ${label} entre 0 e 1.000 mm, com no máximo 2 casas decimais.`
  }
  validateMillimeters('etp', 'a ETP')
  validateMillimeters('precipitation', 'a precipitação')
  validateMillimeters('realIrrigation', 'a irrigação real aplicada')
  return errors
}
