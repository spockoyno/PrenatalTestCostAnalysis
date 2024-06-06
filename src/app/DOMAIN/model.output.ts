import {CarrierFrequencyRow, Disease} from "./model.input";


export interface CarrierFrequencyAggregate {
  frequencies: CarrierFrequencyRow[];
  totalNorthEurope: number;
   totalAfricanAmer: number;
   totalHispanic: number;
totalAsian: number;
  totalOther: number;
 totalWeighted: number;


}

export interface DiseaseFrequency {

  disease: Disease;
  carrierFrequency: number;
  fatherScreens: number;
  affectedFetuses: number;
}

export interface CarrierFrequencyEthnicCompositionAggregate {
  frequencyCounts: DiseaseFrequency[];
  totalDiseaseIncidence_OE130: number;
  affectedFetusesTotal_OE142: number;
  positivePredictiveValue_OE150: number; //ppv
  riskyRateNIPT_OE151: number;
}

export interface AffectedFetuses {
  base: { missed: number, detected: number }; // TODO  out: C6, C7
  reflex: { missed: number, detected: number }; // TODO out D6, D7
}

export interface FollowCostPositiveResultBase {
  totalCost_OC14: number;
  shareCarrierNeedFollow_OC15: number;
  shareDonePaternal_OC17: number;
  paternalTestCost_OC18: number;
  shareReferredMFM_0C19: number;
  caseCostMFM_0C20: number;
}

export interface FollowDiagnosticTestCostBase {
  totalCost_OC21: number;
  sharePaternalPositive_OC22: number;
  shareTestUptake_OC23: number;
  costTesting_OC24: number
}

export interface FollowCostPositiveResultReflex {
  totalCost_OD14: number;
  shareNeededUnity_OD16: number;
  shareReferredMFM_OD19: number;
  caseCostMFM_OD20: number;

}

export interface FollowDiagnosticTestCostReflex {
  totalCost_OD21: number;
  shareTestUptake_OD23: number;
  costTesting_OD24: number
}

// todo The costs are in $MM
export interface FollowUpCostComparisons {
  base: {
    positiveResult: FollowCostPositiveResultBase,
    diagnostics: FollowDiagnosticTestCostBase,
    totalCost_OC25: number
  };
  reflex: {
    positiveResult: FollowCostPositiveResultReflex,
    diagnostics: FollowDiagnosticTestCostReflex,
    totalCost_OD25: number
  };

  savingsPositiveResult_OE14: number;
  savingsDiagnostics_OE21: number;
  savingsTotal_OE25: number;


}

export interface CostPerFetusBase {
  maternalCarrierScreen_OC30: number;
  positiveResultFollowUp_OC31: number;
  diagnosticTestFollowUp_OC32: number;

  totalCost_OC33: number;
  countAffectedFetuses_OC34: number;
  costPerAffectedFetus_OC35: number;
}

export interface CostPerFetusReflex {
  maternalCarrierScreen_OD30: number;
  positiveResultFollowUp_OD31: number;
  diagnosticTestFollowUp_OD32: number;

  totalCost_OD33: number;
  countAffectedFetuses_OD34: number;
  costPerAffectedFetus_OD35: number;

}

export interface ScenarioCostsPerAffectedFetus {
  base: CostPerFetusBase;
  reflex: CostPerFetusReflex;
  costBase: number;
  costReflex: number;
  costDiff: number;

}


export interface ReflexPricingScenario{
  passedPercent: number;
  costFetus: number;
  price: number;
}







export interface ComputedGraph {


  carrierFrequencies: CarrierFrequencyAggregate
  affectedFetuses: AffectedFetuses
  carrierFrequencyEthnicities: CarrierFrequencyEthnicCompositionAggregate
  followUpCostComparisons: FollowUpCostComparisons
  scenarioCostsPerFetus: ScenarioCostsPerAffectedFetus
  reflexPricingScenarios: ReflexPricingScenario[]


}
