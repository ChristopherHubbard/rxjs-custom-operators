import { TestScheduler } from 'rxjs/testing';
import { expect } from 'chai';
import { aggregate } from './aggregate.operator';
import { Action } from 'redux-actions';
import { Observable } from 'rxjs';
import { CorrelatedElement, CorrelationParams } from '../models';
import uuid from 'uuid/v4';

describe('Aggregate Operator', () => {
    let scheduler: TestScheduler;

    beforeEach(() => {
        // Create the marble testing scheduler -- test that actuals === expected
        scheduler = new TestScheduler((actual, expected) => {
            expect(actual).deep.equal(expected);
        })
    });

    it('should aggregate elements without a failElement', () => {
        scheduler.run(({ cold, hot, expectObservable }) => {
            const correlationParams: CorrelationParams = {
                correlationId: uuid(),
                parentElementId: 'parent'
            };

            const dependentObservables: Observable<CorrelatedElement<Action<any>>>[] = [

            ];

            const sourceElement$: Observable<Action<any>> = ;

            const result$: Observable<CorrelatedElement<Action<any>[]>> = sourceElement$.pipe(
                aggregate(dependentObservables)
            );

            const expectedMarble: string = 'a|'
            const expectedValues = {
                a: [

                ]
            }

            expectObservable(result$).toBe(expectedMarble, expectedValues);
        })
    });

    it('should fail when one of the internal actions fails with the failELement', () => {

    });
});
