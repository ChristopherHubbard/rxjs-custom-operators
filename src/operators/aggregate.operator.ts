import { Observable, OperatorFunction, forkJoin, throwError, race, of } from 'rxjs';
import { filter, first, switchMap, take } from 'rxjs/operators';
import { CorrelatedElement, AggregationFailedElement } from '../models';
import { getProp } from '../utils';

export function aggregate<S, T extends CorrelatedElement<S>, U extends AggregationFailedElement<S>>(dependentElements: Map<Observable<T>, number> | Observable<T>[], idProp: string = 'type', correlationParamsProp: string = 'payload.correlationParams', failElements?: Observable<U>[]): OperatorFunction<T, T[]> {
    // Filter the elements for the correlation
    const filterElement = (sourceElement: T, dependentElement: T | U): boolean =>
        !!getProp(dependentElement, correlationParamsProp) && !!getProp(sourceElement, correlationParamsProp) &&
        getProp(dependentElement, `${correlationParamsProp}.correlationId`) === getProp(sourceElement, `${correlationParamsProp}.correlationId`) &&
        getProp(dependentElement, `${correlationParamsProp}.parentElementId`) === getProp(sourceElement, idProp);

    const getAggregatedElements = (sourceElement: T): Observable<T[]> => {
        // Create the observables that are expected to complete - could be either a Map to the number of times
        // an emission is expected or just an array (assumes one emission per obserrvables)
        const dependentElementsObservables: Observable<T>[] = dependentElements instanceof Map ? [...dependentElements.entries()].map(([element$, expectedEmissions]) => element$.pipe(
            filter(element => filterElement(sourceElement, element)),
            take(expectedEmissions)
        )) : dependentElements.map(element$ => element$.pipe(
            filter(element => filterElement(sourceElement, element)),
            first()
        ));

        return failElements ? race([
            dependentElementsObservables?.length !== 0 ? forkJoin(dependentElementsObservables) : of([]),
            race(
                failElements.map(failedElement$ => failedElement$.pipe(
                    filter(element => filterElement(sourceElement, element)),
                    first(),
                    switchMap(element => throwError(element))
                ))
            )
        ]) : dependentElementsObservables.length !== 0 ? forkJoin(dependentElementsObservables) : of([]);
    };

    return (source: Observable<T>) => source.pipe(
        switchMap(sourceAction => getAggregatedElements(sourceAction))
    );
}
