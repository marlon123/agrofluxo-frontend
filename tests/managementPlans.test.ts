import assert from 'node:assert/strict'
import test from 'node:test'
import { getActiveManagementPlan, getClosedManagementPlans, toManagementPlanInput, validateManagementPlanForm } from '../src/lib/managementPlans.ts'
import { getManejoStepCompletion } from '../src/lib/manejoFlow.ts'
import { getDailyFormValues, mergeDailyLaunchRecords, validateDailyLaunchForm } from '../src/lib/dailyLaunch.ts'
import type { ManagementPlan } from '../src/lib/api/types.ts'

const basePlan = (id: string, endDate: string | null): ManagementPlan => ({ id, areaId: 'area', cropId: `crop-${id}`, soilProfileId: `soil-${id}`, startDate: '2026-01-01', endDate, fFactor: 0.5, sprinklerRateMmPerHour: 5 })

test('identifica o plano ativo exclusivamente por endDate nulo', () => {
  const closed = basePlan('closed', '2026-03-31')
  const active = basePlan('active', null)
  assert.equal(getActiveManagementPlan([closed, active])?.id, 'active')
  assert.deepEqual(getClosedManagementPlans([closed, active]).map((plan) => plan.id), ['closed'])
  assert.equal(getActiveManagementPlan([]), null)
  assert.deepEqual(getClosedManagementPlans([]), [])
})

test('valida faixa e precisão de F e taxa', () => {
  const valid = { cropId: 'crop', soilProfileId: 'soil', startDate: '2026-01-01', endDate: '', fFactor: '0.5000', sprinklerRateMmPerHour: '5.0000' }
  assert.deepEqual(validateManagementPlanForm(valid), {})
  assert.ok(validateManagementPlanForm({ ...valid, fFactor: '0' }).fFactor)
  assert.ok(validateManagementPlanForm({ ...valid, sprinklerRateMmPerHour: '500.00001' }).sprinklerRateMmPerHour)
  assert.ok(validateManagementPlanForm({ ...valid, endDate: '2025-12-31' }).endDate)
})

test('preserva endDate em atualização e envia referências nulas', () => {
  const input = toManagementPlanInput({ cropId: 'crop', soilProfileId: 'soil', startDate: '2026-01-01', endDate: '2026-03-31', fFactor: '0.5', sprinklerRateMmPerHour: '5' }, 'edit')
  assert.deepEqual(input, { cropId: null, soilProfileId: null, startDate: null, endDate: '2026-03-31', fFactor: 0.5, sprinklerRateMmPerHour: 5 })
})

test('monta o payload de criação com os valores em fração decimal', () => {
  const input = toManagementPlanInput({ cropId: 'crop', soilProfileId: 'soil', startDate: '2026-01-01', endDate: '', fFactor: '0.5', sprinklerRateMmPerHour: '5' }, 'create')
  assert.deepEqual(input, { cropId: 'crop', soilProfileId: 'soil', startDate: '2026-01-01', endDate: null, fFactor: 0.5, sprinklerRateMmPerHour: 5 })
})

test('conclui a revisão somente após a confirmação com dados válidos', () => {
  assert.deepEqual(getManejoStepCompletion({ areaReady: true, dailyDataValid: true, reviewConfirmed: false, resultAvailable: false }), [true, true, false, false])
  assert.deepEqual(getManejoStepCompletion({ areaReady: true, dailyDataValid: true, reviewConfirmed: true, resultAvailable: false }), [true, true, true, false])
})

test('carrega e combina lançamentos preservando valores zero', () => {
  const weather = [{ id: 'weather', areaId: 'area', date: '2026-11-24', etpMm: 4.25, precipitationMm: 0 }]
  const irrigation = [{ id: 'irrigation', areaId: 'area', date: '2026-11-24', appliedIrrigationMm: 0 }]
  assert.deepEqual(getDailyFormValues('2026-11-24', weather, irrigation), { etp: '4.25', precipitation: '0', realIrrigation: '0', complete: true })
  assert.deepEqual(mergeDailyLaunchRecords(weather, irrigation), [{ date: '2026-11-24', etpMm: 4.25, precipitationMm: 0, appliedIrrigationMm: 0 }])
})

test('valida lançamentos diários aceitando zero e rejeitando data futura', () => {
  const valid = { launchDate: '2026-01-01', irrigationDay: '1', etp: '0', precipitation: '0', realIrrigation: '0' }
  assert.deepEqual(validateDailyLaunchForm(valid), {})
  assert.ok(validateDailyLaunchForm({ ...valid, launchDate: '2999-01-01' }).launchDate)
  assert.ok(validateDailyLaunchForm({ ...valid, etp: '1.001' }).etp)
})
