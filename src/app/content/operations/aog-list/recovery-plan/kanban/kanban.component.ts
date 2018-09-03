import {Component, OnDestroy, OnInit} from '@angular/core';
import {DragulaService} from 'ng2-dragula';
import {Subscription} from 'rxjs/Subscription';
import {filter, tap} from 'rxjs/operators';

@Component({
    selector: 'lsl-kanban',
    templateUrl: './kanban.component.html',
    styleUrls: ['./kanban.component.scss']
})
export class KanbanComponent implements OnInit, OnDestroy {

    private static BACKLOG_ID = 'backlog';

    private _dragulaSub: Subscription;
    public backlog: string[] = ['', ''];
    public todo: string[] = ['', '', '', ''];
    public doing: string[] = [''];
    public done: string[] = ['', '', ''];

    constructor(
        private _dragulaService: DragulaService
    ) {
        // [1]: Card
        // [2]: Target column
        this._dragulaSub = this._dragulaService.drop
            .pipe(
                tap(v => {
                    console.log(this.backlog, this.todo, this.doing, this.done);
                    return v;
                })
            )
            .pipe(
                filter(v => v[2].getAttribute('id') === KanbanComponent.BACKLOG_ID),
                tap(args => console.log('Drop on Backlog!'))
            )
            .subscribe();
    }

    log(v) {
        console.log(v);
    }

    ngOnInit() {

    }

    ngOnDestroy() {
        this._dragulaSub.unsubscribe();
    }

}
