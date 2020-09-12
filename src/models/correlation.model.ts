export interface CorrelationParams {
    correlationId: string;
    parentElementId: string
}

export type CorrelatedElement<T> = T & { correlationParams?: CorrelationParams };

export type AggregationFailedElement<T> = CorrelatedElement<Error & T>;