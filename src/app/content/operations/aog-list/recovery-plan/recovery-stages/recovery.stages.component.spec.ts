import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../../../../shared/shared.module';
import {KonvaModule} from 'ng2-konva';
import {ScrollbarModule} from 'ngx-scrollbar';
import {RecoveryStagesComponent} from './recovery-stages.component';
import {RecoveryPlanComponent} from '../recovery-plan.component';
import {RecoveryRealPlanComponent} from '../recovery-real-plan/recovery-real-plan.component';
import {RecoverySlotsComponent} from '../recovery-slots/recovery-slots.component';
import {RecoveryZoomComponent} from '../recovery-zoom/recovery-zoom.component';
import {TimeConverter} from '../util/timeConverter';
import {ShapeDraw} from '../util/shapeDraw';
import {RecoveryPlanService} from '../_services/recovery-plan.service';
import {DialogService} from '../../../../_services/dialog.service';
import {MAT_DIALOG_DATA} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('Recovery Stages Test', () => {

    let recoveryStagesComponent: RecoveryStagesComponent;
    let fixture: ComponentFixture<RecoveryStagesComponent>;

    const MockRecoveryPlanService = {};

    const MockStageData = [
        {
            'code' : 'ACC',
            'serie' : null,
            'range' : {
                'from' : {
                    'label' : '2018-08-22T17:16:48.230Z',
                    'epochTime' : 1534958208230
                },
                'to' : {
                    'label' : '2018-08-22T19:16:48.230Z',
                    'epochTime' : 1534965408230
                }
            }
        }, {
            'code' : 'EVA',
            'serie' : null,
            'range' : {
                'from' : {
                    'label' : '2018-08-22T19:16:48.230Z',
                    'epochTime' : 1534965408230
                },
                'to' : {
                    'label' : '2018-08-22T21:16:48.230Z',
                    'epochTime' : 1534972608230
                }
            }
        }, {
            'code' : 'SUP',
            'serie' : null,
            'range' : {
                'from' : {
                    'label' : '2018-08-22T21:16:48.230Z',
                    'epochTime' : 1534972608230
                },
                'to' : {
                    'label' : '2018-08-22T23:16:48.230Z',
                    'epochTime' : 1534979808230
                }
            }
        }, {
            'code': 'EXE',
            'serie': null,
            'range': {
                'from': {
                    'label': '2018-08-22T23:16:48.230Z',
                    'epochTime': 1534979808230
                },
                'to': {
                    'label': '2018-08-23T01:16:48.230Z',
                    'epochTime': 1534987008230
                }
            }
        }
    ];

    const MockAogData = {
        'id' : 352,
        'tail' : 'CC-BEA',
        'fleet' : 'A320-FAM',
        'operator' : 'LA',
        'barcode' : 'T00CMYI',
        'station' : 'SCL',
        'safety' : null,
        'maintenance' : 'EXT',
        'failure' : 'FT2',
        'reason' : 'Text for tests.',
        'status' : {
            'id' : 22,
            'aogId' : 352,
            'code' : 'ETR',
            'observation' : 'Text for tests.',
            'requestedInterval' : {
                'dt' : {
                    'label' : '2018-08-21T12:47:25.175Z',
                    'epochTime' : 1534855645175
                },
                'duration' : 60.0
            },
            'realInterval' : {
                'dt' : {
                    'label' : null,
                    'epochTime' : null
                },
                'duration' : null
            },
            'audit' : {
                'time' : {
                    'label' : '2018-08-21T11:47:25.173Z',
                    'epochTime' : 1534852045173
                },
                'username' : 'mcp.testUser.supervisor'
            }
        },
        'audit' : {
            'time' : {
                'label' : '2018-08-21T11:47:25.169Z',
                'epochTime' : 1534852045169
            },
            'username' : 'mcp.testUser.supervisor'
        }
    };

    const MockStageKonva = {
        destroy: () => true,
        batchDraw: () => true
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                SharedModule,
                KonvaModule,
                ScrollbarModule,
                BrowserAnimationsModule
            ],
            declarations: [
                RecoveryStagesComponent,
                RecoveryPlanComponent,
                RecoveryRealPlanComponent,
                RecoverySlotsComponent,
                RecoveryZoomComponent,
                RecoveryZoomComponent
            ],
            providers: [
                TimeConverter,
                ShapeDraw,
                DialogService,
                {provide: MAT_DIALOG_DATA, userValue: MockAogData},
                {provide: RecoveryPlanService, useValue: MockRecoveryPlanService}
            ]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RecoveryStagesComponent);
        recoveryStagesComponent = fixture.componentInstance;
        /*recoveryStagesComponent.konvaStage = MockStageKonva;
        recoveryStagesComponent.triggerStageInterface = {'stage': MockStageData};*/
    });

    afterEach(() => {
        recoveryStagesComponent.ngOnDestroy();
    });

    it('Test to know if the component exist', () => {
        expect(recoveryStagesComponent).toBeDefined();
    });
});
