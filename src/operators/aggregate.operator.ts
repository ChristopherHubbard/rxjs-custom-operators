import { Observable, OperatorFunction, forkJoin, throwError, race } from 'rxjs';
import { filter, first, switchMap } from 'rxjs/operators';
import { CorrelatedElement, AggregationFailedElement } from '../models';

export function aggregate<S, T extends CorrelatedElement<S>, U extends AggregationFailedElement<S>>(idProp: string, dependentElements: Observable<T>[], failElement$?: Observable<U>): OperatorFunction<T, T[]> {
    // Filter the elements for the correlation
    const filterElement = (sourceElement: T, { correlationParams }: T | U): boolean =>
        !!correlationParams && !!sourceElement.correlationParams &&
        correlationParams.correlationId === sourceElement.correlationParams.correlationId &&
        correlationParams.parentElementId === (sourceElement as any)[idProp];

    const getAggregatedElements = (sourceElement: T): Observable<T[]> => {
        const dependentElementsObservables: Observable<T>[] = dependentElements.map(element$ => element$.pipe(
            filter(element => filterElement(sourceElement, element)),
            first()
        ));

        return failElement$ ? race([
            forkJoin(dependentElementsObservables),
            failElement$.pipe(
                filter(element => filterElement(sourceElement, element)),
                first(),
                switchMap(element => throwError(element))
            )
        ]) : forkJoin(dependentElementsObservables);
    };

    return (source: Observable<T>) => source.pipe(
        switchMap(sourceAction => getAggregatedElements(sourceAction))
    );
}
