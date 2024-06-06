export enum Ethnicity {
  NorthEurope = "Northern European",
  AfricanAmer = "African American",
  Hispanic = "Hispanic",
  Asian = "Asian",
  Other = "Other",
}

// export type BaseEthnicity = Exclude<Ethnicity, Ethnicity.Other>;

export enum Disease {
  CysticFibrosis = "Cystic fibrosis",
  SMA = "Spinal Muscular Atrophy",
  SickleCellBetaThalassemia = "Sickle cell disease/Beta-thalassemia",
  AlphaThalassemia = "Alpha-thalassemia",

}

export const ethnicitiesEnums: Ethnicity[] = [Ethnicity.NorthEurope, Ethnicity.AfricanAmer, Ethnicity.Hispanic,
  Ethnicity.Asian, Ethnicity.Other]
export const diseaseEnums: Disease[] = [Disease.CysticFibrosis, Disease.SMA, Disease.SickleCellBetaThalassemia, Disease.AlphaThalassemia]


export interface EthnicityBreakdown {
  readonly northEurope: number;
  readonly africanAmer: number;
  readonly hispanic: number;
  readonly asian: number;
  readonly other: number;
}

export interface AnnualPregnanciesPaternalScreens {
  annualPregnancies_C2: number;
  ratePaternalFollowUp_C9: number;
}

export interface MakeCarrierFrequency {
  cell_id: string;
  disease: Disease;
  ethnicity: Ethnicity;
  frequency: number;
  frequencyTwo?: number;
  prevalence?: number;
  shareMainFrequency?: number;
}

export interface CarrierFrequencyRow {

  disease: Disease;
  ethnicity: Ethnicity;
  cell_id: string;
  frequency: number;
  frequencyRisky: number;
}

// todo: C38 aka E38, C39, C40
export interface UnityTestPerformance {
  sensitivity_C38: number;
  specificity_C39: number;
  noCallRate_C40: number;

}

// todo: C12:15
// TODO Remove paternal cost components. Only using the total
export interface AdminTestingCosts {
  screenMaternalCostBase_C12: number;
  screenPaternalCost_C13: number;
  clinicianPaternalCost_C14: number;
  adminPaternalCost_C15: number;
  costPaternalTotal_OC18: number;

}

// todo C19:24
export interface WorkflowAssumptions {
  shareRiskyNiptReferralMFM_C19: number;
  costCounselingVisitMFM_C20: number;
  costInvasiveTest_C21: number;
  shareCarrierPositiveExpandedPanel_C22: number;
  sharePositiveDiagnosticUptakeParentBase_C23: number;
  shareDiagnosticUptakeParentReflex_C24: number;

}

export interface IntervalSpec {
  physicalMin: number,
  assumedMin: number,
  assumedMax: number,
  physicalMax: number
}

export interface InputIntervals {
  ratePaternalFollowUp: IntervalSpec;
  rateReferralMFM: IntervalSpec;
  costPaternalTesting: IntervalSpec;
  costMFM: IntervalSpec;


}

// These are independent (almost, except CarrierFrequencyAggregate, which has input elements)
export interface InputGraph {

  pregnanciesPaternalScreens: AnnualPregnanciesPaternalScreens
  adminTestingCosts: AdminTestingCosts
  unityTestPerformance: UnityTestPerformance
  workflowAssumptions: WorkflowAssumptions
  ethnicityBreakdown: EthnicityBreakdown
  carrierFrequencyRows: CarrierFrequencyRow[]


}
