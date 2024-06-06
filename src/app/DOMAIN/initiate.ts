import {
  AdminTestingCosts,
  AnnualPregnanciesPaternalScreens,
  CarrierFrequencyRow,
  Disease,
  Ethnicity, EthnicityBreakdown, InputGraph, InputIntervals, IntervalSpec,
  MakeCarrierFrequency,
  UnityTestPerformance,
  WorkflowAssumptions
} from "./model.input";


export function asserter(condition: any, message: string = "condition failed"): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

export function findMinAndMax(array:number[]) {
    if (array.length === 0) {
        return []; // Return an empty array if the input array is empty
    }
    let minimum = array[0];
    let maximum = array[0];
    for (let i = 1; i < array.length; i++) {
        if (array[i] < minimum) {
            minimum = array[i];
        }
        if (array[i] > maximum) {
            maximum = array[i];
        }
    }
    return [minimum, maximum];
}

export function annualPregnanciesPaternalScreens():AnnualPregnanciesPaternalScreens{
  return {annualPregnancies_C2:100_000, ratePaternalFollowUp_C9:0.42}
}


export function ethnicityBreakdown(): EthnicityBreakdown{

  const northEurope: number = 0.558
       const        africanAmer: number = 0.139
     const          hispanic: number = 0.208
      const         asian: number = 0.072

    const sum = northEurope + africanAmer + hispanic + asian
  const other = 1 - sum

  return {northEurope:northEurope,
  africanAmer: africanAmer,
  hispanic: hispanic,
  asian: asian,
  other: other}

}

export function unityTestPerformance(): UnityTestPerformance {

  return {sensitivity_C38: 0.985, specificity_C39: 0.999, noCallRate_C40: 0.005}

}
export function adminTestingCosts():AdminTestingCosts{

  const screen = 694
  const clinical =  200
  const admin = 50
  const totalPaternal = screen + clinical + admin

  return {screenMaternalCostBase_C12:694, screenPaternalCost_C13:screen, clinicianPaternalCost_C14:clinical,
  adminPaternalCost_C15: admin, costPaternalTotal_OC18: totalPaternal}
}


export function workflowAssumptions():WorkflowAssumptions{

  return { shareRiskyNiptReferralMFM_C19: 0.8, costCounselingVisitMFM_C20: 1236, costInvasiveTest_C21: 730,
  shareCarrierPositiveExpandedPanel_C22: 0.358, sharePositiveDiagnosticUptakeParentBase_C23: 0.5, shareDiagnosticUptakeParentReflex_C24:0.5}
}



 function toCarrierFrequencyRow(d: MakeCarrierFrequency): CarrierFrequencyRow {

  let risky: number
  let frequency: number = d.frequency

  if (d.prevalence === undefined) {
    if (d.frequencyTwo !== undefined &&
      d.shareMainFrequency !== undefined) {
      frequency = frequency * d.shareMainFrequency + d.frequencyTwo * (1 - d.shareMainFrequency)
    }
    risky = frequency * frequency
  } else {
    risky = frequency * d.prevalence
  }
  return {disease: d.disease, ethnicity: d.ethnicity, cell_id: d.cell_id, frequency: frequency, frequencyRisky: risky}
}


export function carrierFrequencyRows(): CarrierFrequencyRow[] {

  const freqs: MakeCarrierFrequency[] = [
    {disease: Disease.CysticFibrosis, ethnicity: Ethnicity.NorthEurope, cell_id: "E66", frequency: 1 / 25},
    {disease: Disease.CysticFibrosis, ethnicity: Ethnicity.AfricanAmer, cell_id: "E67", frequency: 1 / 61},
    {disease: Disease.CysticFibrosis, ethnicity: Ethnicity.Hispanic, cell_id: "E68", frequency: 1 / 58},
    {disease: Disease.CysticFibrosis, ethnicity: Ethnicity.Asian, cell_id: "E69", frequency: 1 / 94},
    {disease: Disease.CysticFibrosis, ethnicity: Ethnicity.Other, cell_id: "E70", frequency: 1 / 45},

    {disease: Disease.SMA, ethnicity: Ethnicity.NorthEurope, cell_id: "E72", frequency: 1 / 47},
    {disease: Disease.SMA, ethnicity: Ethnicity.AfricanAmer, cell_id: "E73", frequency: 1 / 72},
    {disease: Disease.SMA, ethnicity: Ethnicity.Hispanic, cell_id: "E74", frequency: 1 / 68},
    {disease: Disease.SMA, ethnicity: Ethnicity.Asian, cell_id: "E75", frequency: 1 / 59},
    {disease: Disease.SMA, ethnicity: Ethnicity.Other, cell_id: "E76", frequency: 1 / 54},

    {
      disease: Disease.SickleCellBetaThalassemia,
      ethnicity: Ethnicity.NorthEurope,
      cell_id: "E78",
      frequency: 1 / 373,
      frequencyTwo: 1 / 28,
      shareMainFrequency: 0.9
    },
    {disease: Disease.SickleCellBetaThalassemia, ethnicity: Ethnicity.AfricanAmer, cell_id: "E79", frequency: 1 / 8},
    {disease: Disease.SickleCellBetaThalassemia, ethnicity: Ethnicity.Hispanic, cell_id: "E80", frequency: 1 / 17},
    {disease: Disease.SickleCellBetaThalassemia, ethnicity: Ethnicity.Asian, cell_id: "E81", frequency: 1 / 54},
    {disease: Disease.SickleCellBetaThalassemia, ethnicity: Ethnicity.Other, cell_id: "E82", frequency: 1 / 49},


    {
      disease: Disease.AlphaThalassemia,
      ethnicity: Ethnicity.NorthEurope,
      cell_id: "E84",
      frequency: 1 / 44,
      prevalence: 1 / 3807
    },
    {
      disease: Disease.AlphaThalassemia,
      ethnicity: Ethnicity.AfricanAmer,
      cell_id: "E85",
      frequency: 1 / 3,
      prevalence: 1 / 5000
    },
    {
      disease: Disease.AlphaThalassemia,
      ethnicity: Ethnicity.Hispanic,
      cell_id: "E86",
      frequency: 1 / 16,
      prevalence: 1 / 570
    },
    {
      disease: Disease.AlphaThalassemia,
      ethnicity: Ethnicity.Asian,
      cell_id: "E87",
      frequency: 1 / 16,
      prevalence: 1 / 93
    },
    {
      disease: Disease.AlphaThalassemia,
      ethnicity: Ethnicity.Other,
      cell_id: "E88",
      frequency: 1 / 16,
      prevalence: 1 / 570
    },


  ]

  let rows: CarrierFrequencyRow[]  = []

  for (let row of freqs ){

    rows.push(toCarrierFrequencyRow(row))

  }

return  rows


}


