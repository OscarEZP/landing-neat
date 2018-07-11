import {Component, OnInit, ViewChild} from '@angular/core';
import {Aog} from '../../../shared/_models/aog/aog';
import {TranslateService} from '@ngx-translate/core';
import {LayoutService} from '../../../layout/_services/layout.service';
import {TimeInstant} from '../../../shared/_models/timeInstant';
import {StatusAog} from '../../../shared/_models/aog/statusAog';
import {Interval} from '../../../shared/_models/interval';
import {ApiRestService} from '../../../shared/_services/apiRest.service';
import {Subscription} from 'rxjs/Subscription';
import {PaginatorObjectService} from '../../_services/paginator-object.service';
import {MatPaginator} from '@angular/material';
import {Pagination} from '../../../shared/_models/common/pagination';
import {AogSearch} from '../../../shared/_models/aog/aogSearch';


@Component({
  selector: 'lsl-aog-list',
  templateUrl: './aog-list.component.html',
  styleUrls: ['./aog-list.component.scss']
})
export class AogListComponent implements OnInit {

  @ViewChild('contPaginator') public paginator: MatPaginator;

  private static AIRCRAFT_ON_GROUND_SEARCH_ENDPOINT = 'aircraftOnGroundSearch';
  private static AIRCRAFT_ON_GROUND_COUNT_ENDPOINT = 'aircraftOnGroundCount';

  private static CONTINGENCY_UPDATE_INTERVAL = 'CONTINGENCY_UPDATE_INTERVAL';
  private static DEFAULT_INTERVAL = 30;

  private _aogList: Aog[];
  private _error: boolean;
  private _loading: boolean;
  private _paginatorObject: PaginatorObjectService;
  private _paginatorSubscription: Subscription;
  private _listSubscription: Subscription;
  private _intervalRefreshSubscription: Subscription;
  private _intervalToRefresh: number;

  constructor(private _translate: TranslateService,
              private _apiRestService: ApiRestService,
              private _layout: LayoutService) {



  }

  ngOnInit() {

    this._translate.setDefaultLang('en');
    this._layout.disableRightNav = true;
    this._layout.disableAddButton = true;
    this._layout.showAddButton = true;
    this._layout.showRightNav = true;

    this.error = false;

    this.aogList = [];

    this.paginatorObjectService = PaginatorObjectService.getInstance();

    this.paginatorSubscription = this.getPaginationSubscription();
    //this.getList();

  }

  /**
   * Returns a subscription for pagination page event. Show loader and set pagination attributes in page change.
   * @return {Subscription}
   */
  public getPaginationSubscription(): Subscription {
    return this.paginator.page.subscribe((page) => {
      console.log('getPaginationSubscription');
      console.log(page);
      this.paginatorObjectService.pageSize = page.pageSize;
      this.paginatorObjectService.pageIndex = page.pageIndex;
      this.getList();
    });
  }

  /**
   * Method for get a search signature for get data
   * @return {SearchAog}
   */
  private getSearchSignature(): AogSearch {
    const signature: AogSearch = AogSearch.getInstance();

    signature.pagination = new Pagination(this.paginatorObjectService.offset, this.paginatorObjectService.pageSize);

    return signature;
  }
  /**
   * Set a subscription for get total amount of records and data list.
   */
  private getList(): void {
    const signature = this.getSearchSignature();
    this.listSubscription = this.getListSubscription(signature);
  }
  /**
   * Subscription for get the data list
   * @param signature
   * @return {Subscription}
   */
  private getListSubscription(signature: AogSearch): Subscription {
    this.loading = true;
    this.error = false;

    return this._apiRestService.search<Aog[]>(AogListComponent.AIRCRAFT_ON_GROUND_SEARCH_ENDPOINT, signature).subscribe(
          (response) => {


     /*       this.subscribeTimer();*/
      console.log(response);
            this.aogList = response;
            this.getCountSubscription();
            this.loading = false;
          },
          () => {
            this.getError();
            //this.subscribeTimer();
          });


  }

  private getCountSubscription(): Subscription {

    return this._apiRestService.search<number>(AogListComponent.AIRCRAFT_ON_GROUND_COUNT_ENDPOINT, null).subscribe(
        (response) => {

         this.paginatorObjectService.length = response;
     },
        () => {
          this.getError();

        });


  }

  /**
   * Handler for error process on api request
   * @return {boolean}
   */
  private getError(): boolean {
    this.paginatorObjectService.length = 0;
    this.loading = false;
    return this.error = true;
  }

  get aogList(): Aog[] {
    return this._aogList;
  }

  set aogList(value: Aog[]) {
    this._aogList = value;
  }


  get error(): boolean {
    return this._error;
  }

  set error(value: boolean) {
    this._error = value;
  }


  get paginatorObjectService(): PaginatorObjectService {
    return this._paginatorObject;
  }

  set paginatorObjectService(value: PaginatorObjectService) {
    this._paginatorObject = value;
  }


  get paginatorSubscription(): Subscription {
    return this._paginatorSubscription;
  }

  set paginatorSubscription(value: Subscription) {
    this._paginatorSubscription = value;
  }


  get listSubscription(): Subscription {
    return this._listSubscription;
  }

  set listSubscription(value: Subscription) {
    this._listSubscription = value;
  }


  get loading(): boolean {
    return this._loading;
  }

  set loading(value: boolean) {
    this._loading = value;
  }


  get intervalRefreshSubscr iption(): Subscription {
    return this._intervalRefreshSubscription;
  }

  set intervalRefreshSubscription(value: Subscription) {
    this._intervalRefreshSubscription = value;
  }

  get intervalToRefresh(): number {
    return this._intervalToRefresh;
  }

  set intervalToRefresh(value: number) {
    this._intervalToRefresh = value;
  }
}
