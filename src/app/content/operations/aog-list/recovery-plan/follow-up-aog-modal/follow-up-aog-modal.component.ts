import { Component, OnInit } from '@angular/core';
import {DialogService} from '../../../../_services/dialog.service';
import {DataService} from '../../../../../shared/_services/data.service';
import {ApiRestService} from '../../../../../shared/_services/apiRest.service';
import {Subscription} from 'rxjs/Subscription';
import {Types} from '../../../../../shared/_models/configuration/types';
import {GroupTypes} from '../../../../../shared/_models/configuration/groupTypes';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {StatusAog} from '../../../../../shared/_models/aog/statusAog';
import {StorageService} from '../../../../../shared/_services/storage.service';
import {Aog} from '../../../../../shared/_models/aog/aog';
import {Validation} from '../../../../../shared/_models/validation';
import {User} from '../../../../../shared/_models/user/user';
import {ActualTimeModel} from '../../../../../shared/_models/actualTime';
import {DetailsServiceAog} from '../../../../../details/_services/details_aog.service';
import {MessageService} from '../../../../../shared/_services/message.service';

@Component({
  selector: 'lsl-follow-up-aog-modal',
  templateUrl: './follow-up-aog-modal.component.html',
  styleUrls: ['./follow-up-aog-modal.component.scss']
})
export class FollowUpAogModalComponent implements OnInit {

  public static FOLLOW_UP_CLOSED_STATUS = 'AOG.AOG_DETAILS.FOLLOW_UP.FOLLOW_UP_CLOSED_STATUS';
  public static FOLLOW_UP_LAST_STATUS = 'AOG.AOG_DETAILS.FOLLOW_UP.FOLLOW_UP_LAST_STATUS';
  public static FOLLOW_UP_DISABLED = 'AOG.AOG_DETAILS.FOLLOW_UP.FOLLOW_UP_DISABLED';
  public static FOLLOW_UP_SUCCESSFULLY = 'AOG.AOG_DETAILS.FOLLOW_UP.FOLLOW_UP_SUCCESSFULLY';

  private _configStatusAogSubscription: Subscription;
  private _aogSubcription: Subscription;
  private _followUpAog: StatusAog;

  private _currentUTCTime: number;
  private _followUpAogForm: FormGroup;

  private _user: User;
  private _selectedAog: Aog;
  private _statusCodes: Types[];

  private _durations: number[];
  private _validations: Validation;
  private _apiRestService: ApiRestService;
  private _delta: number;
  private _maxChars: number

  private _follow_up_successfully: string;

  constructor(private _detailsService: DetailsServiceAog,
              private _messageService: MessageService,
              private _dialogService: DialogService,
              private _dataService: DataService,
              private http: HttpClient,
              private fb: FormBuilder,
              private _storageService: StorageService) {

    this.followUpAog = StatusAog.getInstance();
    this.followUpAog.audit.username = this._storageService.getCurrentUser().userId;
    this.apiRestService = new ApiRestService(http);

    this.currentUTCTime = 0;
    this.selectedAog = Aog.getInstance();
    this.validations = Validation.getInstance();

    this.user = this._storageService.getCurrentUser();

    this.statusCodes = [];

    this.maxChars = 400;

    this.followUpAogForm = fb.group({
      'observation': [this.followUpAog.observation, Validators.required],
      'code': [this.followUpAog.code, Validators.required],
      'duration': [this.followUpAog.requestedInterval.duration, Validators.required]
    });
  }

  ngOnInit() {
    this.generateIntervalSelection();
    this.getStatusCodesAvailable();
    this.aogSubcription = this._detailsService.selectedAogChange.subscribe(aog => this.selectedAogChanged(aog));
  }

  /**
   * Open a cancel message if there is a filled item
   */
  public openCancelDialog(): void {

      this._dialogService.closeAllDialogs();
    }

  /**
   * Private method that use generic service to get available status codes for the selected aog,
   * also send a message to the service that show loading bar when the method is called and close it
   * when the result is completed (no matter if success or fail).
   *
   * @return {Types[]}
   *
   * @example
   * [{
     *  "code": "NI",
     *  "description": New Information

     *},
   *{
     *  "code": "ETR",
     *  "description": Extend Time Release

     *}]
   *
   */
  private getStatusCodesAvailable(): Types[] {
    this._dataService.stringMessage('open');
    this._configStatusAogSubscription = this.apiRestService
        .getSingle<GroupTypes>('configTypes', 'AOG_STATUS')
        .subscribe((data: GroupTypes) => {
              this.statusCodes = data.types.sort((a, b ): number => {
                if (a.code > b.code) return -1;
                if (a.code < b.code) return 1;
                return 0;
              });

            },
            error => () => {
              this._dataService.stringMessage('close');
            }, () => {
              this._dataService.stringMessage('close');
            });

    return this.statusCodes;
  }

  /**
   * Public method called when a status code is selected in the view and select the default value of time
   * defined for the status.
   *
   * @param {StatusAog} statusCode - String code from safety event list
   *
   * @example
   * this.selectActiveCode("ETR");
   *
   * @return {void} nothing to return
   */
  public selectActiveCode(statusCode: StatusAog) {
    this.followUpAog.requestedInterval.duration = 30;
    this.followUpAogForm.get('duration').setValue(30);
    this.followUpAogForm.get('duration').updateValueAndValidity();

    this.followUpAog.code = statusCode.code;
  }

  /**
   * Method to get current time from service, is called in the initialization of the component and everytime one value of the combo box is selected to calculate real remaining time.
   *
   * @return {void} nothing to return
   */
  public getCurrentTime(): Subscription {
    this._dataService.stringMessage('open');
    return this.apiRestService
        .getAll('dateTime')
        .subscribe((data: ActualTimeModel) => {
              this.currentUTCTime = data.currentTimeLong;

              this.setActualDelta();
            },
            error => () => {
              this._dataService.stringMessage('close');
            },
            () => {
              this._dataService.stringMessage('close');
            }
        );
  }

  /**
   * Method to calculate the delta time remaining between the selected time in combo box and the real remaining time
   * (180 minutes rule), set the delta to a variable and set the warning if the time selected is greater than
   * the real remaining.
   *
   * @param {number} currentTimeLong
   *
   * @return {void} nothing to return
   */
  private setActualDelta(): number {

    this.delta = -1;

    if (this.selectedAog.audit.time.epochTime !== null) {
      this.delta = Math.round(((this.selectedAog.audit.time.epochTime + 180 * 60 * 1000) - this.currentUTCTime) / 60000);
    }

    return this.delta;
  }

  /**
   * Private service called everytime the aog selected from list change,
   * validate if aog is null because when the component initialize there's no aog yet.
   *
   * If aog is not null is assigned to a variable and the time interval is regenerated from the creation
   * date of aog instead of all 180 minutes, also the status codes available for the selected aog is called.
   *
   * @param {Aog} aog - Aog Model
   * @type {Aog}
   *
   * @return {void} nothing to return
   */
  private selectedAogChanged(aog: Aog): void {
    this.selectedAog = aog;
    // this.validations.isComponentDisabled = this.isComponentDisabled();

    this.getCurrentTime();
    this.getStatusCodesAvailable();
    this.generateIntervalSelection(this.selectedAog.audit.time.epochTime);

    this.followUpAog.aogId = this.selectedAog.id;
  }

  /**
   * Method to generate values for combo box where the time available for the follow up is showed,
   * in interval of 30 minutes, has an optional argument to generate the available time from the
   * creation date of the aog.
   *
   * If the equation has a value less than 0 or greater than 7 (the 180 minutes limit) the save
   * follow up button is set disabled.
   *
   * @todo
   * Get the time limit from a config service instead of use hard value of 180.
   *
   * @param {number} creationDate - Creation date value is in epoch time milliseconds
   * @example
   * this.generateIntervalSelection(1513900719000)
   * currentTime = 1513904314000
   *
   * Difference between two values: 60 minutes then the array will have values from 30 to 120 minutes with intervals of 30 minutes between them.
   *
   * @return {void} nothing to return
   */
  private generateIntervalSelection(creationDate?: number): void {
    let i: number;
    let quantity = 6;
    this.apiRestService.getAll<ActualTimeModel>('dateTime')
        .subscribe(response => this.currentUTCTime = response.currentTimeLong)
        .add(() => {
          this.durations = [];
          if (creationDate) {
            quantity = Math.ceil(((creationDate + (180 * 60000)) - this.currentUTCTime) / (60000 * 30));
          }

          if (0 < quantity && quantity < 7) {
            for (i = 0; i < quantity; i++) {
              this.durations.push(i * 30 + 30);
            }
          }
        });
  }

  /**
   * Method to validate and submit the follow up information
   *
   * @param value
   *
   * @return {void} nothing to return
   */
  public submitForm(value: any) {

    console.log('Submit Aog');
    this.validations.isSubmited = true;

    if (this.followUpAogForm.valid) {
      this.validations.isSending = true;
      this._dataService.stringMessage('open');

      this._detailsService.closeSidenav();
      this._dataService.stringMessage('reload');
      this._messageService.openSnackBar(this.follow_up_successfully);
      this._dataService.stringMessage('close');
      this.validations.isSubmited = false;
      this.validations.isSending = false;
      this._followUpAogForm.reset();
      //const safetyCode = this.followUpForm.get('safetyEventCode').value;

      /*this.apiRestService
       .add<Status>('followUp', this.followUp, safetyCode)
       .subscribe(() => {
       this._detailsService.closeSidenav();
       this._dataService.stringMessage('reload');
       this._messageService.openSnackBar(this.follow_up_successfully);
       this._dataService.stringMessage('close');
       this.validations.isSubmited = false;
       this.validations.isSending = false;
       this._followUpForm.reset();

       }, (err: HttpErrorResponse) => {
       this._dataService.stringMessage('close');
       this._messageService.openSnackBar(err.error.message);
       this.validations.isSubmited = false;
       this.validations.isSending = false;
       });*/
    }
  }
  get apiRestService(): ApiRestService {
    return this._apiRestService;
  }

  set apiRestService(value: ApiRestService) {
    this._apiRestService = value;
  }


  get statusCodes(): Types[] {
    return this._statusCodes;
  }

  set statusCodes(value: Types[]) {
    this._statusCodes = value;
  }


  get followUpAogForm(): FormGroup {
    return this._followUpAogForm;
  }

  set followUpAogForm(value: FormGroup) {
    this._followUpAogForm = value;
  }

  get followUpAog(): StatusAog {
    return this._followUpAog;
  }

  set followUpAog(value: StatusAog) {
    this._followUpAog = value;
  }


  get currentUTCTime(): number {
    return this._currentUTCTime;
  }

  set currentUTCTime(value: number) {
    this._currentUTCTime = value;
  }

  get user(): User {
    return this._user;
  }

  set user(value: User) {
    this._user = value;
  }

  get selectedAog(): Aog {
    return this._selectedAog;
  }

  set selectedAog(value: Aog) {
    this._selectedAog = value;
  }

  get durations(): number[] {
    return this._durations;
  }

  set durations(value: number[]) {
    this._durations = value;
  }

  get validations(): Validation {
    return this._validations;
  }

  set validations(value: Validation) {
    this._validations = value;
  }

  get delta(): number {
    return this._delta;
  }

  set delta(value: number) {
    this._delta = value;
  }

  get maxChars(): number {
    return this._maxChars;
  }

  set maxChars(value: number) {
    this._maxChars = value;
  }


  get aogSubcription(): Subscription {
    return this._aogSubcription;
  }

  set aogSubcription(value: Subscription) {
    this._aogSubcription = value;
  }


  get follow_up_successfully(): string {
    return this._follow_up_successfully;
  }

  set follow_up_successfully(value: string) {
    this._follow_up_successfully = value;
  }
}
