import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {StatusAog} from '../../shared/_models/aog/statusAog';
import {Aog} from '../../shared/_models/aog/aog';
import {Validation} from '../../shared/_models/validation';
import {ApiRestService} from '../../shared/_services/apiRest.service';
import {User} from '../../shared/_models/user/user';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DetailsService} from '../_services/details.service';
import {MessageService} from '../../shared/_services/message.service';
import {StorageService} from '../../shared/_services/storage.service';
import {DataService} from '../../shared/_services/data.service';
import {HttpClient} from '@angular/common/http';
import {TranslationService} from '../../shared/_services/translation.service';

@Component({
  selector: 'lsl-follow-up-aog',
  templateUrl: './follow-up-aog.component.html',
  styleUrls: ['./follow-up-aog.component.scss']
})

/**
 * Follow up component
 * Allow to make follow ups for created contingencies when time from creation date is less than 180 minutes
 */
@Component({
  selector: 'lsl-follow-up-aog',
  templateUrl: './follow-up-aog.component.html',
  styleUrls: ['./follow-up-aog.component.scss']
})
export class FollowUpAogComponent implements OnInit, OnDestroy {

  public static FOLLOW_UP_CLOSED_STATUS = 'AOG.AOG_DETAILS.FOLLOW_UP.FOLLOW_UP_CLOSED_STATUS';
  public static FOLLOW_UP_LAST_STATUS = 'AOG.AOG_DETAILS.FOLLOW_UP.FOLLOW_UP_LAST_STATUS';
  public static FOLLOW_UP_DISABLED = 'AOG.AOG_DETAILS.FOLLOW_UP.FOLLOW_UP_DISABLED';
  public static FOLLOW_UP_SUCCESSFULLY = 'AOG.AOG_DETAILS.FOLLOW_UP.FOLLOW_UP_SUCCESSFULLY';

  @ViewChild('faog') followUpFormAogChild;
  private _aogSubcription: Subscription;
  private _detailAogServiceSubscription: Subscription;
  private _configStatusAogSubscription: Subscription;

  private _followUpAog: StatusAog;

  private _currentUTCTime: number;
  private _followUpAogForm: FormGroup;

  private _user: User;
  private _selectedAog: Aog;
 // private _statusCodes: StatusCode[];

  private _durations: number[];
  private _validations: Validation;
  private _apiRestService: ApiRestService;
  private _delta: number;

  private _follow_up_successfully: string;

  constructor(private _detailsService: DetailsService,
              private _messageService: MessageService,
              private fb: FormBuilder,
              private _storageService: StorageService,
              private _dataService: DataService,
              private http: HttpClient,
              private _translationService: TranslationService) {

    this.followUpAog = StatusAog.getInstance();
    this.followUpAog.audit.username = this._storageService.getCurrentUser().userId;
    this.apiRestService = new ApiRestService(http);

    this.currentUTCTime = 0;
    this.selectedAog = Aog.getInstance();
    this.validations = new Validation(false, true, true, false);

    this.user = this._storageService.getCurrentUser();

    // this.statusCodes = [];
  }

  ngOnInit() {
  }

  ngOnDestroy() {

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

  get selectedAog(): Aog {
    return this._selectedAog;
  }

  set selectedAog(value: Aog) {
    this._selectedAog = value;
  }

  get validations(): Validation {
    return this._validations;
  }

  set validations(value: Validation) {
    this._validations = value;
  }

  get apiRestService(): ApiRestService {
    return this._apiRestService;
  }

  set apiRestService(value: ApiRestService) {
    this._apiRestService = value;
  }


  get user(): User {
    return this._user;
  }

  set user(value: User) {
    this._user = value;
  }
}
