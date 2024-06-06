import {Injectable} from '@angular/core';
import {
  adminTestingCosts,
  annualPregnanciesPaternalScreens, asserter,
  carrierFrequencyRows, ethnicityBreakdown,
  unityTestPerformance,
  workflowAssumptions
} from "./initiate";
import {EthnicityBreakdown, InputGraph, InputIntervals, IntervalSpec} from "./model.input";
import {
  affectedFetuses,
  carrierFrequenceAggregate,
  carrierFrequencyEthnicCompositionAggregate,
  followUpCostComparisons, generateRandomNumbers, reflexPricingScenarios, scenarioCostsPerAffectedFetus
} from "./logic";
import {ComputedGraph} from "./model.output";
import {SimulatedOutputs, SimulationInputs, UserInputIntervals, UserInputs} from "../CORE/model.view";
import {cos} from "mathjs";
import { median, quantile, mean} from 'd3-array';

@Injectable({
  providedIn: 'root'
})
export class CreatorService {

  constructor() {
  }


  inputGraph(): InputGraph {


    return {
      pregnanciesPaternalScreens: annualPregnanciesPaternalScreens(),
      adminTestingCosts: adminTestingCosts(),
      unityTestPerformance: unityTestPerformance(),
      workflowAssumptions: workflowAssumptions(),
      ethnicityBreakdown: ethnicityBreakdown(),
      carrierFrequencyRows: carrierFrequencyRows()

    }


  }

  computedGraph(inp: InputGraph): ComputedGraph {

    const carrierFrequencies = carrierFrequenceAggregate(inp.carrierFrequencyRows, inp.ethnicityBreakdown)
    const carrierComposed = carrierFrequencyEthnicCompositionAggregate(inp.ethnicityBreakdown,
      carrierFrequencies,
      inp.pregnanciesPaternalScreens, inp.unityTestPerformance)
    const affected = affectedFetuses(carrierComposed, inp.pregnanciesPaternalScreens, inp.unityTestPerformance)
    const followUp = followUpCostComparisons(inp.adminTestingCosts, inp.unityTestPerformance,
      inp.pregnanciesPaternalScreens, inp.workflowAssumptions,
      carrierFrequencies, carrierComposed)

    const scenario = scenarioCostsPerAffectedFetus(inp.adminTestingCosts,
      inp.pregnanciesPaternalScreens,
      affected,
      followUp)

    const pricingScenarios = reflexPricingScenarios(scenario, followUp, affected)


    return {
      carrierFrequencies: carrierFrequencies,
      carrierFrequencyEthnicities: carrierComposed,
      followUpCostComparisons: followUp,
      scenarioCostsPerFetus: scenario,
      affectedFetuses: affected,
      reflexPricingScenarios: pricingScenarios
    }


  }


  userInputs(d: InputGraph): UserInputs {

    return {
      ratePaternalFollowUp: d.pregnanciesPaternalScreens.ratePaternalFollowUp_C9,
      rateReferralMFM: d.workflowAssumptions.shareRiskyNiptReferralMFM_C19,
      costMFM: d.workflowAssumptions.costCounselingVisitMFM_C20,
      costPaternalTesting: d.adminTestingCosts.costPaternalTotal_OC18
    }


  }

  //todo: hardcoded to user inputs
  inputIntervals(d: UserInputs, downLengthMultiple: number = 0.9): InputIntervals {
    const ka = downLengthMultiple
    asserter(ka > 0 && ka <= 1)


    function inner(d: { physicalMin: number, physicalMax: number }, point: number) {
      asserter(point > d.physicalMin && point <= d.physicalMax)
      const delta = Math.min(point - d.physicalMin, d.physicalMax - point)
      const len = ka * delta
      return {...d, assumedMin: point - len, assumedMax: point + len}

    }

    return {
      ratePaternalFollowUp: inner({physicalMin: 0.002, physicalMax: 1},
        d.ratePaternalFollowUp),
      rateReferralMFM: inner({physicalMin: 0, physicalMax: 1},
        d.rateReferralMFM),
      costPaternalTesting: inner({physicalMin: 0, physicalMax: 5000},
        d.costPaternalTesting),
      costMFM: inner({physicalMin: 0, physicalMax: 15000},
        d.costMFM)
    }

  }

  updateUserInputs(old: InputGraph, inputs: UserInputs): InputGraph {
    return {
      ...old,
      pregnanciesPaternalScreens: {
        ...old.pregnanciesPaternalScreens,
        ratePaternalFollowUp_C9: inputs.ratePaternalFollowUp
      },
      workflowAssumptions: {
        ...old.workflowAssumptions,
        shareRiskyNiptReferralMFM_C19: inputs.rateReferralMFM,
        costCounselingVisitMFM_C20: inputs.costMFM
      },
      adminTestingCosts: {
        ...old.adminTestingCosts,
        costPaternalTotal_OC18: inputs.costPaternalTesting
      }
    };
  }

  summariseSimulations(costDiffs: number[], quant: number): SimulatedOutputs{

     const mn:number = mean(costDiffs) || NaN
    const md = median(costDiffs) || NaN
    const lo = quantile(costDiffs, quant) || NaN

       const up = quantile(costDiffs, 1-quant) || NaN


  return {costDiffs: costDiffs,
  mean: mn,
  median: md,
  lowQuant: lo,
  upperQuant: up}
  }


  simulateCosts(old: InputGraph, da: UserInputIntervals, inp: SimulationInputs): SimulatedOutputs {
    const n = inp.drawsCount




    const ratePaternalFollowUp: number[] = generateRandomNumbers(da.ratePaternalFollowUpMin, da.ratePaternalFollowUpMax, n)
    const rateReferralMFM: number [] = generateRandomNumbers(da.rateReferralMFMin, da.rateReferralMFMax, n)
    const costPaternalTest: number[] = generateRandomNumbers(da.costPaternalTestingMin, da.costPaternalTestingMax, n)
    const costMFM: number[] = generateRandomNumbers(da.costMFMin, da.costMFMax, n)



    let costDiffs: number[] = []

    for (let i = 0; i < n; i++) {

      const inp: UserInputs = {
        ratePaternalFollowUp: ratePaternalFollowUp[i],
        rateReferralMFM: rateReferralMFM[i],
        costPaternalTesting: costPaternalTest[i],
        costMFM: costMFM[i]
      }

      const newInput = this.updateUserInputs(old, inp)
      const computedGraph = this.computedGraph(newInput)

      costDiffs.push(computedGraph.scenarioCostsPerFetus.costDiff)
      let pricings = computedGraph.reflexPricingScenarios

       // costDiffs.push(pricings[pricings.length-1].price)



    }




    return  this.summariseSimulations(costDiffs, inp.quantile)

  }


}
