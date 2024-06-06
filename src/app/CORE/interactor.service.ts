import { Injectable } from '@angular/core';
import {BehaviorSubject, distinctUntilChanged, map, Observable} from "rxjs";
import {CreatorService} from "../DOMAIN/creator.service";
import {
  ScenarioOutputsView, simulatedOutputs,
  SimulatedOutputs,
  simulationInputs,
  SimulationInputs,
  UserInputIntervals,
  UserInputs
} from "./model.view";
import {round2} from "../DOMAIN/logic";
import {InputGraph, InputIntervals} from "../DOMAIN/model.input";
import {ComputedGraph} from "../DOMAIN/model.output";



@Injectable({
  providedIn: 'root'
})
export class InteractorService {

 private computed$: BehaviorSubject<ComputedGraph>;
  private input$: BehaviorSubject<InputGraph>;
  public initialInput: UserInputs
  public initialIntervals: InputIntervals

  private startInputGraph: InputGraph

  public  simulated$: BehaviorSubject<SimulatedOutputs> = new BehaviorSubject<SimulatedOutputs>(simulatedOutputs)

public simInputs$ = new BehaviorSubject<SimulationInputs>(simulationInputs)

  constructor(public creator: CreatorService) {
    // Assuming computedGraph returns a synchronous value for the sake of example
    const input = creator.inputGraph()
    this.startInputGraph = input
    this.initialInput  = creator.userInputs(input)

    this.initialIntervals = creator.inputIntervals(this.initialInput)

    const graph = creator.computedGraph(input);

    this.input$ = new BehaviorSubject<InputGraph>(input);
    this.computed$ = new BehaviorSubject<ComputedGraph>(graph);



  }

  private toScenarioOutputView(d: ComputedGraph): ScenarioOutputsView {
    const b = d.scenarioCostsPerFetus


     return {
          costBase: round2(b.costBase),
          costReflex: round2(b.costReflex),
          costDiff: round2(b.costDiff),
       shareSaved: round2(b.costDiff/b.costBase),
          reflexPricingScenarios: d.reflexPricingScenarios,
       midPrice: d.reflexPricingScenarios[2].price  //TODO Hardcoded! Assumes 3rd elem -> 50%

        };

  }


computedObservable(): Observable<ScenarioOutputsView> {
    return this.computed$.asObservable().pipe(
      map(d => {

        return  this.toScenarioOutputView(d)
      })
    );
}

currentScenarioOutputView(): ScenarioOutputsView {
    return this.toScenarioOutputView(this.computed$.value)
}


newSimulatedValues$(): Observable<number[]> {

    return this.simulated$.asObservable() .pipe(
      map(data => data.costDiffs), // Emit only costDiffs
      distinctUntilChanged() // Use strict identity comparison
    );

}

simulatedSummaries$(): Observable<SimulatedOutputs> {

    return this.simulated$.asObservable()

}

 newUserInputs(d: UserInputs){

    const updated = this.creator.updateUserInputs(this.input$.value, d)
   this.input$.next(updated)

   this.computed$.next(this.creator.computedGraph(updated))



  }



userInputIntervals(d: InputIntervals): UserInputIntervals {
  return {
    ratePaternalFollowUpMin: d.ratePaternalFollowUp.assumedMin,
    ratePaternalFollowUpMax: d.ratePaternalFollowUp.assumedMax,
    rateReferralMFMin: d.rateReferralMFM.assumedMin,
    rateReferralMFMax: d.rateReferralMFM.assumedMax,
    costPaternalTestingMin: d.costPaternalTesting.assumedMin,
    costPaternalTestingMax: d.costPaternalTesting.assumedMax,
    costMFMin: d.costMFM.assumedMin,
    costMFMax: d.costMFM.assumedMax,
  };
}


  runSimulation(intervals: UserInputIntervals,inp: SimulationInputs) {
       let startTime = Date.now();

   const simd =  this.creator.simulateCosts(this.startInputGraph, intervals, inp);
   this.simulated$.next(simd)


    console.log(`Execution time: ${Date.now() - startTime} ms`);



  }

  newSimulationInputs(d: SimulationInputs) {

    const summ = this.creator.summariseSimulations(this.simulated$.value.costDiffs, d.quantile)

    this.simulated$.next(summ)

  }
}
