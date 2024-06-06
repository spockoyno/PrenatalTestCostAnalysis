import {
  AdminTestingCosts,
  AnnualPregnanciesPaternalScreens,
  CarrierFrequencyRow,
  diseaseEnums,
  ethnicitiesEnums,
  Ethnicity,
  EthnicityBreakdown,
  UnityTestPerformance,
  WorkflowAssumptions
} from "./model.input";
import {
  AffectedFetuses, CarrierFrequencyAggregate,
  CarrierFrequencyEthnicCompositionAggregate,
  CostPerFetusBase,
  CostPerFetusReflex,
  DiseaseFrequency,
  FollowCostPositiveResultBase,
  FollowCostPositiveResultReflex,
  FollowDiagnosticTestCostBase,
  FollowDiagnosticTestCostReflex,
  FollowUpCostComparisons, ReflexPricingScenario,
  ScenarioCostsPerAffectedFetus
} from "./model.output";
import * as math from "mathjs";

export function   round2( number: number): number {
  const factor = Math.pow(10, 2);
  return Math.round(number * factor) / factor;
}
// todo C6, C38
export function affectedFetuses(d: CarrierFrequencyEthnicCompositionAggregate, fa: AnnualPregnanciesPaternalScreens,
                                sens: UnityTestPerformance): AffectedFetuses {
  const totalAffected = d.affectedFetusesTotal_OE142
  const missedBase = totalAffected * (1 - fa.ratePaternalFollowUp_C9)
  const missedRefl = totalAffected * (1 - sens.sensitivity_C38)

  return {
    base: {missed: missedBase, detected: totalAffected - missedBase},
    reflex: {missed: missedRefl, detected: totalAffected - missedRefl}
  }


}


//todo: C2 total, E95 wtd aver, C9 father screen, C13:15 costs, C22 carr positive rate, C20 mfw vizit. (base)
// C23, C21,
// C19, referal rate, C40 unity noCalRate (refl)
// C24

export function followUpCostComparisons(cst: AdminTestingCosts,
                                        tst: UnityTestPerformance,
                                        tot: AnnualPregnanciesPaternalScreens,
                                        wf: WorkflowAssumptions,
                                        ag: CarrierFrequencyAggregate,
                                        compo: CarrierFrequencyEthnicCompositionAggregate): FollowUpCostComparisons {
  const normedPop = tot.annualPregnancies_C2 /1_000_000

  const totalBaseFollowCost = tot.ratePaternalFollowUp_C9 * ag.totalWeighted * (cst.costPaternalTotal_OC18 + wf.shareCarrierPositiveExpandedPanel_C22 * wf.costCounselingVisitMFM_C20) * normedPop

  const posiBase: FollowCostPositiveResultBase = {caseCostMFM_0C20: wf.costCounselingVisitMFM_C20,
  shareCarrierNeedFollow_OC15: ag.totalWeighted,shareDonePaternal_OC17: tot.ratePaternalFollowUp_C9, shareReferredMFM_0C19:  wf.shareCarrierPositiveExpandedPanel_C22,
  paternalTestCost_OC18: cst.costPaternalTotal_OC18, totalCost_OC14: totalBaseFollowCost}

  const sharePositivePaternalBase = compo.affectedFetusesTotal_OE142/tot.annualPregnancies_C2 * 4 / compo.totalDiseaseIncidence_OE130
  const costDiagBase = normedPop * posiBase.shareCarrierNeedFollow_OC15 * posiBase.shareDonePaternal_OC17 *
    sharePositivePaternalBase * wf.sharePositiveDiagnosticUptakeParentBase_C23 * wf.costInvasiveTest_C21

  const diagBase: FollowDiagnosticTestCostBase = {costTesting_OC24: wf.costInvasiveTest_C21, shareTestUptake_OC23: wf.sharePositiveDiagnosticUptakeParentBase_C23, sharePaternalPositive_OC22:  sharePositivePaternalBase,
  totalCost_OC21: costDiagBase}

  const totalCostBase = totalBaseFollowCost + costDiagBase

  const posiCostRflx = normedPop * compo.riskyRateNIPT_OE151 * wf.shareRiskyNiptReferralMFM_C19 * wf.costCounselingVisitMFM_C20

  const posiReflex : FollowCostPositiveResultReflex = {shareNeededUnity_OD16: compo.riskyRateNIPT_OE151 + tst.noCallRate_C40,  shareReferredMFM_OD19: wf.shareRiskyNiptReferralMFM_C19,
 caseCostMFM_OD20: wf.costCounselingVisitMFM_C20, totalCost_OD14: posiCostRflx }

  const costDiagReflex = normedPop *  posiReflex.shareNeededUnity_OD16 *  wf.shareDiagnosticUptakeParentReflex_C24 * wf.costInvasiveTest_C21

  const diagRflx: FollowDiagnosticTestCostReflex = {costTesting_OD24:wf.costInvasiveTest_C21, shareTestUptake_OD23: wf.shareDiagnosticUptakeParentReflex_C24, totalCost_OD21:costDiagReflex}

  const totalCostRflx =  posiReflex.totalCost_OD14 + diagRflx.totalCost_OD21


  return {base: {positiveResult: posiBase, diagnostics: diagBase, totalCost_OC25: totalCostBase},
    reflex: {positiveResult: posiReflex, diagnostics: diagRflx, totalCost_OD25: totalCostRflx},
    savingsPositiveResult_OE14: posiBase.totalCost_OC14 - posiReflex.totalCost_OD14,
    savingsDiagnostics_OE21: diagBase.totalCost_OC21 - diagRflx.totalCost_OD21,
    savingsTotal_OE25: ( posiBase.totalCost_OC14 - posiReflex.totalCost_OD14 ) +  diagBase.totalCost_OC21 - diagRflx.totalCost_OD21}




}



export function scenarioCostsPerAffectedFetus(cst: AdminTestingCosts,
                                        tot: AnnualPregnanciesPaternalScreens,
                                              aff: AffectedFetuses,
                                              comp: FollowUpCostComparisons
                                              ): ScenarioCostsPerAffectedFetus {


 const normedPop = tot.annualPregnancies_C2 /1_000_000
  const maternalScreenCost = normedPop *  cst.screenMaternalCostBase_C12



  const totalCostBase = maternalScreenCost + comp.base.positiveResult.totalCost_OC14 + comp.base.diagnostics.totalCost_OC21
  const countFetusesBase = aff.base.detected

  const costPerFetusBase = totalCostBase/countFetusesBase






  const base: CostPerFetusBase = {maternalCarrierScreen_OC30: maternalScreenCost, positiveResultFollowUp_OC31: comp.base.positiveResult.totalCost_OC14,
    diagnosticTestFollowUp_OC32: comp.base.diagnostics.totalCost_OC21, totalCost_OC33: totalCostBase, countAffectedFetuses_OC34: countFetusesBase,
    costPerAffectedFetus_OC35: costPerFetusBase

  }

   const totalCost_OD33 = maternalScreenCost +  comp.reflex.positiveResult.totalCost_OD14 + comp.reflex.diagnostics.totalCost_OD21



  const costPerFetusRflx = totalCost_OD33/aff.reflex.detected


  const reflex: CostPerFetusReflex = {maternalCarrierScreen_OD30: maternalScreenCost, positiveResultFollowUp_OD31: comp.reflex.positiveResult.totalCost_OD14,
    diagnosticTestFollowUp_OD32: comp.reflex.diagnostics.totalCost_OD21,
  totalCost_OD33: totalCost_OD33, countAffectedFetuses_OD34: aff.reflex.detected, costPerAffectedFetus_OD35: costPerFetusRflx}

  const deltaCost = costPerFetusBase - costPerFetusRflx

  return {base: base, reflex: reflex, costDiff: deltaCost, costBase : costPerFetusBase, costReflex: costPerFetusRflx}


}

// todo: C4:C8; ... ; C2; E38
export function carrierFrequencyEthnicCompositionAggregate(br: EthnicityBreakdown,
                                                           ag: CarrierFrequencyAggregate,
                                                           preg: AnnualPregnanciesPaternalScreens,
                                                           tst: UnityTestPerformance
): CarrierFrequencyEthnicCompositionAggregate {

  const ethnicities: number[] = [br.northEurope, br.africanAmer, br.hispanic, br.asian, br.other]

  const pregCount = preg.annualPregnancies_C2


  let totalAffecteds = 0
  let totalIncidence = 0
  let carrierFrequency: DiseaseFrequency[] = []

  for (let ind in diseaseEnums) {
    const disease = diseaseEnums[ind]
    let share = 0
    let affecteds = 0
    let currents = ag.frequencies.filter(item => item.disease === disease);
    for (let j in ethnicities) {
      let val = currents.filter(item => item.ethnicity === ethnicitiesEnums[j])[0]
      const w = ethnicities[j]
      share += w * val.frequency
      affecteds += w * val.frequencyRisky

    }

    totalIncidence += share

    let entry: DiseaseFrequency = {
      disease: disease,
      carrierFrequency: share,
      fatherScreens: share * pregCount,
      affectedFetuses: affecteds * pregCount / 4
    }
    carrierFrequency.push(entry)

    totalAffecteds += entry.affectedFetuses

  }

  //=(Input!E38*E142/Input!C2)/(Input!E38*E142/Input!C2+(1-Input!C39)*(1-E142/Input!C2))

  const normed = totalAffecteds / pregCount
  const ppv = tst.sensitivity_C38 * normed / (tst.sensitivity_C38 * normed + (1 - tst.specificity_C39) * (1 - normed))
  const nipt = normed / ppv

  return {
    frequencyCounts: carrierFrequency,
    affectedFetusesTotal_OE142: totalAffecteds,
    positivePredictiveValue_OE150: ppv,
    riskyRateNIPT_OE151: nipt,
    totalDiseaseIncidence_OE130: totalIncidence
  }


}

export function carrierFrequenceAggregate(frequencies: CarrierFrequencyRow[], d: EthnicityBreakdown): CarrierFrequencyAggregate {
  let totalNorthEurope: number = 0;
  let totalAfricanAmer: number = 0;
  let totalHispanic: number = 0;
  let totalAsian: number = 0;
  let totalOther: number = 0;

  for (let row of frequencies) {
    let val = row.frequency
    switch (row.ethnicity) {
      case Ethnicity.NorthEurope:
        totalNorthEurope += val;
        break;
      case Ethnicity.AfricanAmer:
        totalAfricanAmer += val;
        break;
      case Ethnicity.Hispanic:
        totalHispanic += val;
        break;
      case Ethnicity.Asian:
        totalAsian += val;
        break;
      case Ethnicity.Other:
        totalOther += val;
        break;

    }
  }


  const weighted = math.dot([d.northEurope, d.africanAmer, d.hispanic, d.asian, d.other],
    [totalNorthEurope, totalAfricanAmer, totalHispanic, totalAsian, totalOther])

  return {
    frequencies: frequencies,
    totalAfricanAmer: totalAfricanAmer,
    totalAsian: totalAsian,
    totalHispanic: totalHispanic,
    totalNorthEurope: totalNorthEurope,
    totalOther: totalOther,
    totalWeighted: weighted
  }


}



export function reflexPricingScenarios(ag: ScenarioCostsPerAffectedFetus,  fol: FollowUpCostComparisons, af: AffectedFetuses, shares: number[] = [0, 0.25, 0.5, 0.75, 1]) {
  const costDiff = ag.costDiff
  const cost0 = ag.costReflex
  const costFollowUp_OD56 = fol.reflex.totalCost_OD25
  const detectedCount = af.reflex.detected

  const costFollowUp_0 = cost0 * detectedCount - costFollowUp_OD56

  let rows: ReflexPricingScenario[] = [{passedPercent: 0, costFetus: round2(cost0), price: round2(costFollowUp_0 * 10)}]
  if(shares.length == 1){
    return rows
  }

  shares.slice(1).forEach(s => {
    let cst = s* costDiff + cost0
    let prc = (cst * detectedCount - costFollowUp_OD56) * 10
    rows.push({ passedPercent: s, costFetus: round2(cst), price: round2(prc) });
  });

  return rows;



}

export function generateRandomNumbers(a:number, b:number, n:number) {
  const dif = b-a
    let randomNumbers:number[] = [];
    for (let i = 0; i < n; i++) {
        let randomNum = Math.random() *dif + a;
        randomNumbers.push(randomNum);
    }
    return randomNumbers;
}




// Helpers



