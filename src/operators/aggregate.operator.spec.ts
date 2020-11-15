import { TestScheduler } from 'rxjs/testing';
import { expect } from 'chai';
import { aggregate } from './aggregate.operator';
import { Action, createAction } from 'redux-actions';
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

    it.only('should aggregate elements without a failElement', () => {
        // Run the marble test scheduler to test the observables
        scheduler.run(({ cold, hot, expectObservable }) => {
            const correlationParams: CorrelationParams = {
                correlationId: uuid(),
                parentElementId: 'parent'
            };

            const parentAction: CorrelatedElement<Action<any>> = createAction('parentAction', () => )
            const action1: Action<any> = createAction('firstAction')();
            const action2: Action<any> = createAction('secondAction')();

            const dependentObservables: Observable<CorrelatedElement<Action<any>>>[] = [
                cold('---a', { a: { type: }})
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
