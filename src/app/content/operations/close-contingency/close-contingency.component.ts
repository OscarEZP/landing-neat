import {Component, OnInit, Inject, OnDestroy} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogService } from '../../_services/dialog.service';
import { MAT_DIALOG_DATA } from '@angular/material';
import { StorageService } from '../../../shared/_services/storage.service';
import { ContingencyService } from '../../_services/contingency.service';
import { MessageService } from '../../../shared/_services/message.service';
import { DataService } from '../../../shared/_services/data.service';
import { CancelComponent } from '../cancel/cancel.component';
import { ApiRestService } from '../../../shared/_services/apiRest.service';
import {TranslationService} from '../../../shared/_services/translation.service';
import {Close} from '../../../shared/_models/close';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import {Location} from '../../../shared/_models/configuration/location';
import {User} from '../../../shared/_models/user/user';
import {map, startWith} from 'rxjs/operators';
import {GroupTypes} from '../../../shared/_models/configuration/groupTypes';
import {Aog} from '../../../shared/_models/aog/aog';

@Component({
    selector: 'lsl-close-contingency',
    templateUrl: './close-contingency.component.html',
    styleUrls: ['./close-contingency.component.scss']
})
export class CloseContingencyComponent implements OnInit, OnDestroy {

    private static CLOSE_TYPE = 'CLOSE_TYPE';
    private static CLOSE_SUCCESS_MESSAGE = 'OPERATIONS.CLOSE_COMPONENT.CLOSE_SUCCESS';
    private static VALIDATION_ERROR_MESSAGE = 'OPERATIONS.VALIDATION_ERROR_MESSAGE';
    private static CANCEL_COMPONENT_MESSAGE = 'OPERATIONS.CANCEL_COMPONENT.MESSAGE';
    private static LOCATIONS_ENDPOINT = 'locations';
    private static TYPES_LIST_ENDPOINT = 'types';

    private _aog: Aog;
    private _closeForm: FormGroup;
    private _aogForm: FormGroup;
    private _closeSignature: Close;
    private _locationList: Location[];
    private _typeCloseList: GroupTypes;
    private _groupTypeList: GroupTypes[];

    private _locationList$: Observable<Location[]>;

    private _closeTypeSubs: Subscription;
    private _locationSubs: Subscription;
    private _groupTypesSubs: Subscription;

    constructor(
        private _dialogService: DialogService,
        private _storageService: StorageService,
        private _contingencyService: ContingencyService,
        private _messageService: MessageService,
        private _dataService: DataService,
        private _apiRestService: ApiRestService,
        private _fb: FormBuilder,
        private _translationService: TranslationService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this._closeForm = _fb.group({
            'type': [null, Validators.required],
            'observation': [null, Validators.required]
        });

        this._aogForm = _fb.group({
            'station'   : ['', Validators.required],
            'barcode'   : ['', [Validators.pattern('^([a-zA-Z0-9])+'), Validators.maxLength(80)]],
            'reason'    : ['', Validators.required],
            'status'    : ['', Validators.required],
            'duration'  : ['', Validators.required],
            'tipology'  : ['', Validators.required]
        });

        this._closeSignature = new Close();
        this._typeCloseList = new GroupTypes();
        this._aog = Aog.getInstance();
    }

    ngOnInit() {
        this._locationSubs = this.getLocationSubs();
        this._groupTypesSubs = this.getGroupTypesSubs();
    }

    ngOnDestroy() {
        this._locationSubs.unsubscribe();
        this._groupTypesSubs.unsubscribe();
    }

    /**
     * Get the location list from server
     * @return {Subscription}
     */
    private getLocationSubs(): Subscription {
        return this._apiRestService
            .getAll<Location[]>(CloseContingencyComponent.LOCATIONS_ENDPOINT)
            .subscribe((response: Location[]) => {
                this.locationList = response;
                this.locationList$ = this.aogForm
                    .controls['station']
                    .valueChanges
                    .pipe(
                        startWith(''),
                        map(val => this.locationFilter(val))
                    );
            });
    }

    /**
     * Filter for location observable list in view
     * @param {string} val
     * @return {Location[]}
     */
    private locationFilter(val: string): Location[] {
        return this.locationList.filter(location =>
            location.code.toLocaleLowerCase().search(val ? val.toLocaleLowerCase() : '') !== -1);
    }

    // private getCloseTypeSubs(): Subscription {
    //     return this._apiRestService.getSingle<GroupTypes>('configTypes', CloseContingencyComponent.CLOSE_TYPE)
    //         .subscribe(rs => this.typeCloseList = rs);
    // }

    public submitForm() {
        if (this.closeForm.valid) {
            this._contingencyService.closeContingency(this.closeSignature).subscribe(
                () => {
                    this._translationService.translateAndShow(CloseContingencyComponent.CLOSE_SUCCESS_MESSAGE);
                    this.dismissCloseContigency();
                    this._dataService.stringMessage('reload');
                }, err => console.error(err)
            );
        } else {
            this._translationService.translateAndShow(CloseContingencyComponent.VALIDATION_ERROR_MESSAGE);
        }
    }

    /**
     * Get all group types
     * @return {Subscription}
     */
    private getGroupTypesSubs(): Subscription {
        return this._apiRestService
            .getAll<GroupTypes[]>(CloseContingencyComponent.TYPES_LIST_ENDPOINT)
            .subscribe((response: GroupTypes[]) => {
                this.groupTypeList = response;
                this.getSelectedGroupType();
            });
    }

    /**
     * Split the groups accord to they purpose and init they instances variables
     */
    private getSelectedGroupType(): void {
        let variableName: string;
        this.groupTypeList.forEach(function (value) {
            variableName = value.groupName.toLowerCase().replace(/(\_\w)/g, function (m) {
                return m[1].toUpperCase();
            });
            this[variableName] = value.types;
        }, this);
    }

    get closeSignature(): Close {
        return new Close(
            this.data.id,
            null,
            this.closeForm.controls['type'].value,
            this.closeForm.controls['observation'].value,
            this.user.userId
        );
    }

    public openCancelDialog() {
        if (this.validateFilledItems()) {
            this._translationService.translate(CloseContingencyComponent.CANCEL_COMPONENT_MESSAGE)
                .then(res => this._messageService.openFromComponent(CancelComponent, {
                    data: {message: res},
                    horizontalPosition: 'center',
                    verticalPosition: 'top'
                }));
        } else {
            this.dismissCloseContigency();
        }
    }

    private validateFilledItems(): boolean {
        let counterFilled = 0;
        const defaultValid = 0;
        Object.keys(this.closeForm.controls).forEach(elem => {
            if (this.closeForm.controls[elem].valid) {
                counterFilled = counterFilled + 1;
            }
        });
        return counterFilled > defaultValid;
    }

    dismissCloseContigency(): void {
        this._dialogService.closeAllDialogs();
    }

    get user(): User  {
        return this._storageService.getCurrentUser();
    }

    get aogForm(): FormGroup {
        return this._aogForm;
    }

    set aogForm(value: FormGroup) {
        this._aogForm = value;
    }

    get closeForm(): FormGroup {
        return this._closeForm;
    }

    set closeForm(value: FormGroup) {
        this._closeForm = value;
    }

    get typeCloseList(): GroupTypes {
        return this._typeCloseList;
    }

    set typeCloseList(value: GroupTypes) {
        this._typeCloseList = value;
    }

    get locationList$(): Observable<Location[]> {
        return this._locationList$;
    }

    set locationList$(value: Observable<Location[]>) {
        this._locationList$ = value;
    }

    get locationList(): Location[] {
        return this._locationList;
    }

    set locationList(value: Location[]) {
        this._locationList = value;
    }

    get aog(): Aog {
        return this._aog;
    }

    set aog(value: Aog) {
        this._aog = value;
    }

    get groupTypeList(): GroupTypes[] {
        return this._groupTypeList;
    }

    set groupTypeList(value: GroupTypes[]) {
        this._groupTypeList = value;
    }
}
