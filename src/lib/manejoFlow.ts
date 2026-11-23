export type DailyFormData = {
  launchDate: string
  irrigationDay: string
  etp: string
  precipitation: string
  realIrrigation: string
}

export type ManejoStepStateInput = {
  areaReady: boolean
  dailyDataValid: boolean
  reviewConfirmed: boolean
  resultAvailable: boolean
}

const hasNonNegativeNumber = (value: string) => value.trim() !== '' && Number.isFinite(Number(value)) && Number(value) >= 0

export function isDailyDataValid(form: DailyFormData) {
  return Boolean(form.launchDate) &&
    /^\d+$/.test(form.irrigationDay) && Number(form.irrigationDay) >= 1 &&
    hasNonNegativeNumber(form.etp) &&
    hasNonNegativeNumber(form.precipitation) &&
    hasNonNegativeNumber(form.realIrrigation)
}

export function getManejoStepCompletion({ areaReady, dailyDataValid, reviewConfirmed, resultAvailable }: ManejoStepStateInput) {
  return [areaReady, dailyDataValid, areaReady && dailyDataValid && reviewConfirmed, resultAvailable]
}
