import {ReflexPricingScenario} from "../DOMAIN/model.output";
import {exp} from "mathjs";

//todo: remove prices
export interface ScenarioOutputsView {

  costBase: number;
  costReflex: number;
  costDiff: number;
  shareSaved: number;
  midPrice: number;
  reflexPricingScenarios: ReflexPricingScenario[];


}

export interface UserInputs {
  ratePaternalFollowUp: number;
  rateReferralMFM: number;
  costPaternalTesting: number;
  costMFM: number;


}


export interface UserInputIntervals {
  ratePaternalFollowUpMin: number;
  ratePaternalFollowUpMax: number;
  rateReferralMFMin: number;
  rateReferralMFMax: number;
  costPaternalTestingMin: number;
  costPaternalTestingMax: number;
  costMFMin: number;
  costMFMax: number;

}

export interface SimulatedOutputs {
  costDiffs: number[];
  mean: number;
  median: number;
  lowQuant: number;
  upperQuant: number;
}

export const simulatedOutputs: SimulatedOutputs = {
  costDiffs: [],
  mean: NaN,
  median: NaN,
  lowQuant: NaN,
  upperQuant: NaN
}


export interface SimulationInputs {
  drawsCount: number;
  quantile: number;
}

export const simulationInputs: SimulationInputs = {
  drawsCount: 100_000,
  quantile: 0.05,
}





