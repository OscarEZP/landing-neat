import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ContingencyListComponent} from './contingency-list.component';
import {RouterTestingModule} from '@angular/router/testing';
import {DataService} from '../../../shared/_services/data.service';
import {DialogService} from '../../_services/dialog.service';
import {DetailsService} from '../../../details/_services/details.service';
import {HistoricalSearchService} from '../../_services/historical-search.service';
import {ContingencyService} from '../../_services/contingency.service';
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs/Observable';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../../shared/shared.module';
import {StorageService} from '../../../shared/_services/storage.service';
import {MessageService} from '../../../shared/_services/message.service';
import {ApiRestService} from '../../../shared/_services/apiRest.service';
import 'rxjs/add/observable/of';
import {ActivatedRoute} from '@angular/router';
import {Contingency} from '../../../shared/_models/contingency/contingency';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {GroupTypes} from '../../../shared/_models/configuration/groupTypes';
import {Types} from '../../../shared/_models/configuration/types';
import {TimeInstant} from '../../../shared/_models/timeInstant';
import {LayoutService} from '../../../layout/_services/layout.service';
import {TranslationService} from '../../../shared/_services/translation.service';
import {EditFieldComponent} from '../edit-field/edit-field.component';

jest.mock('../../../details/_services/details.service');
jest.mock('../../_services/dialog.service');
jest.mock('../../_services/historical-search.service');
jest.mock('../../_services/contingency.service');
jest.mock('../../../shared/_services/data.service');
jest.mock('../../../shared/_services/apiRest.service');
jest.mock('../../../shared/_services/storage.service');
jest.mock('../../../shared/_services/message.service');
jest.mock('../../../layout/_services/layout.service');

describe('Contingency List Test', () => {

    let contingencyListComponent: ContingencyListComponent;
    let fixture: ComponentFixture<ContingencyListComponent>;
    let translate;

    const MockConfigRefresh = {
        'groupName' : 'CONTINGENCY_UPDATE_INTERVAL',
        'types' : [ {
            'code': '130',
            'description': 'Period of time (seconds) to refresh contingency list view',
            'updateDate': {
                'label': '2018-01-24T15:55:56.549Z',
                'epochTime': 1516809356549
            }
        } ]
    };

    const translations: any = {
        'OPERATIONS' : {
            'SHOWING': 'a',
            'OF' : 'a',
            'CLOSED_CONTINGENCIES': 'a',
            'ACTIVE_CONTINGENCIES': 'a',
            'ACTIVE_CONTINGENCY': 'a'
        }
    };

    const MockDataService = {
        currentNumberMessage: Observable.of(this.messageSourceNumber),
        currentStringMessage: Observable.of(this.messageSourceString)
    };

    const MockContingencyList = {
        contingencyList: () => [
            Contingency().getInstance()
        ],
        clearList: () => {},
        getContingencies: () => Observable.of([new Contingency()]),
        loading: false
    };

    const fakeGroupTypeRS = new GroupTypes(MockConfigRefresh.groupName, [new Types(MockConfigRefresh.types[0].code, MockConfigRefresh.types[0].description, new TimeInstant(MockConfigRefresh.types[0].updateDate.epochTime, MockConfigRefresh.types[0].updateDate.label))]);

    const MockApiRestService = {
        getSingle: () => Observable.of(fakeGroupTypeRS)
    };

    class FakeLoader implements TranslateLoader {
        getTranslation(lang: string): Observable<any> {
            return Observable.of(translations);
        }
    }

    const fakeActivatedRoute = {
        data: Observable.of({})
    } as ActivatedRoute;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                SharedModule,
                RouterTestingModule,
                HttpClientTestingModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: FakeLoader
                    }
                }),
                BrowserAnimationsModule
            ],
            providers: [
                {provide: DataService, useValue: MockDataService},
                DialogService,
                DetailsService,
                HistoricalSearchService,
                {provide: ContingencyService, useValue: MockContingencyList},
                StorageService,
                MessageService,
                {provide: ApiRestService, useValue: MockApiRestService},
                {
                    provide: ActivatedRoute,
                    useValue: fakeActivatedRoute
                },
                LayoutService,
                TranslationService
            ],
            declarations: [
                ContingencyListComponent,
                EditFieldComponent
            ]
        }).compileComponents();
        translate = TestBed.get(TranslateService);
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ContingencyListComponent);
        contingencyListComponent = fixture.componentInstance;
    });

    afterEach(() => {
        contingencyListComponent.ngOnDestroy();
    });

    it('Test to know if the module exist', () => {
        expect(contingencyListComponent).toBeDefined();
    });

    it('$checkDataStatus method expect to be false at beginning', () => {
        expect(contingencyListComponent.checkDataStatus()).toBeFalsy();
    });

    it('Details should open', () => {
        const section = 'section';
        const contingency = Contingency.getInstance();
        contingencyListComponent.openDetails(contingency, section);
        expect(contingencyListComponent.detailsService.activeContingencyChanged).toBeCalledWith(contingency);
        expect(contingencyListComponent.detailsService.openDetails).toBeCalledWith(section);
    });

});
