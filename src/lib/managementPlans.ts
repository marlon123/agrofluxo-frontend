import type { ManagementPlan, ManagementPlanInput } from './api/types'

export type ManagementPlanFormValues = {
  cropId: string
  soilProfileId: string
  startDate: string
  endDate: string
  fFactor: string
  sprinklerRateMmPerHour: string
}

export function getActiveManagementPlan(plans: ManagementPlan[]) {
  return plans.find((plan) => plan.endDate === null) || null
}

export function getClosedManagementPlans(plans: ManagementPlan[]) {
  return plans.filter((plan) => plan.endDate !== null)
}

export function validateManagementPlanForm(form: ManagementPlanFormValues) {
  const errors: Record<string, string> = {}
  const decimalPattern = /^\d+(?:\.\d{1,4})?$/
  if (!form.cropId) errors.cropId = 'Selecione uma cultura.'
  if (!form.soilProfileId) errors.soilProfileId = 'Selecione um perfil de solo.'
  if (!form.startDate) errors.startDate = 'Informe a data inicial.'
  if (!form.fFactor || !decimalPattern.test(form.fFactor) || Number(form.fFactor) <= 0 || Number(form.fFactor) > 1) errors.fFactor = 'Informe um valor maior que 0 e até 1, com no máximo 4 casas decimais.'
  if (!form.sprinklerRateMmPerHour || !decimalPattern.test(form.sprinklerRateMmPerHour) || Number(form.sprinklerRateMmPerHour) <= 0 || Number(form.sprinklerRateMmPerHour) > 500) errors.sprinklerRateMmPerHour = 'Informe um valor maior que 0 e até 500, com no máximo 4 casas decimais.'
  if (form.endDate && form.startDate && form.endDate < form.startDate) errors.endDate = 'A data final deve ser igual ou posterior à data inicial.'
  return errors
}

export function toManagementPlanInput(form: ManagementPlanFormValues, mode: 'create' | 'edit'): ManagementPlanInput {
  if (mode === 'edit') return { cropId: null, soilProfileId: null, startDate: null, endDate: form.endDate || null, fFactor: Number(form.fFactor), sprinklerRateMmPerHour: Number(form.sprinklerRateMmPerHour) }
  return { cropId: form.cropId, soilProfileId: form.soilProfileId, startDate: form.startDate, endDate: form.endDate || null, fFactor: Number(form.fFactor), sprinklerRateMmPerHour: Number(form.sprinklerRateMmPerHour) }
}
