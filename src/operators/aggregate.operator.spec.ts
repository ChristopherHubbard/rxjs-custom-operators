import { TestScheduler } from 'rxjs/testing';
import { expect } from 'chai';
import { aggregate } from './aggregate.operator';
import { Action, createAction } from 'redux-actions';
import { Observable } from 'rxjs';
import { ofType } from 'redux-observable';
import { CorrelatedElement, CorrelationParams } from '../models';
import { v4 as uuid } from 'uuid';
import { HotObservable } from 'rxjs/internal/testing/HotObservable';
import { tap } from 'rxjs/operators';

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
                parentElementId: 'parentAction'
            };

            const parentAction: CorrelatedElement<Action<any>> = createAction('parentAction', () => ({ correlationParams }))();
            const action1: Action<any> = createAction('firstAction', (params: any) => ({ ...params, correlationParams }))({});
            const action2: Action<any> = createAction('secondAction', (params: any) => ({ ...params, correlationParams}))({ value: 3 });

            const actions$: HotObservable<CorrelatedElement<Action<any>>> = hot('a--b--c', {
                a: parentAction,
                b: action1,
                c: action2
            });

            const dependentObservables: Observable<CorrelatedElement<Action<any>>>[] = [
                actions$.pipe(
                    ofType(action1.type)
                ),
                actions$.pipe(
                    ofType(action2.type)
                )
            ];

            const result$: Observable<CorrelatedElement<Action<any>[]>> = actions$.pipe(
                ofType(parentAction.type),
                aggregate(dependentObservables)
            );

            const expectedMarble: string = 'a|'
            const expectedValues = {
                a: [
                    action1,
                    action2
                ]
            }

            expectObservable(result$).toBe(expectedMarble, expectedValues);
        })
    });

    it('should fail when one of the internal actions fails with the failELement', () => {

    });
});
