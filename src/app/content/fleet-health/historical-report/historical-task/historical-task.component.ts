import {Component, Input, OnInit} from '@angular/core';
import {HistoricalTask} from '../../../../shared/_models/task/historical/historicalTask';
import {Subscription} from 'rxjs/Subscription';
import {ApiRestService} from '../../../../shared/_services/apiRest.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'lsl-historical-task',
  templateUrl: './historical-task.component.html',
  styleUrls: ['./historical-task.component.scss']
})
export class HistoricalTaskComponent implements OnInit {

  private _historicalTask: HistoricalTask;
  private _apiRestService: ApiRestService;

  constructor(httpClient: HttpClient) {
      this.apiRestService = new ApiRestService(httpClient);
  }

  ngOnInit() {
      this.historicalTask = HistoricalTask.getInstance();

      this.getHistoricalTask('T009R9LM'); // test propose only
  }

  @Input()
  public getHistoricalTask(barcode: string): Subscription {
      return this.apiRestService
          .getSingle<HistoricalTask>('taskHistoricalReport', barcode)
          .subscribe((response: HistoricalTask) => {
              this.historicalTask = response;
          });
  }

    get historicalTask(): HistoricalTask {
        return this._historicalTask;
    }

    set historicalTask(value: HistoricalTask) {
        this._historicalTask = value;
    }

    get apiRestService(): ApiRestService {
        return this._apiRestService;
    }

    set apiRestService(value: ApiRestService) {
        this._apiRestService = value;
    }
}
