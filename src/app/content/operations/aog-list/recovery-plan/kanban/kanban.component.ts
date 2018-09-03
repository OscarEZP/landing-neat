import {Component, OnDestroy, OnInit} from '@angular/core';
import {DragulaService} from 'ng2-dragula';
import {Subscription} from 'rxjs/Subscription';
import {tap} from 'rxjs/operators';
import {
    KanbanCardInterface, KanbanColInterface, KanbanColumnsInterface,
    KanbanService
} from './_services/kanban.service';
import {RecoveryPlanService} from '../_services/recovery-plan.service';
import {Observable} from 'rxjs/Observable';

@Component({
    selector: 'lsl-kanban',
    templateUrl: './kanban.component.html',
    styleUrls: ['./kanban.component.scss']
})
export class KanbanComponent implements OnInit, OnDestroy {

    private _dragulaDropSub: Subscription;
    private _dragulaDragSub: Subscription;

    private _activitiesSub: Subscription;
    private _kanbanColumns: KanbanColumnsInterface;
    private _kanbanName: string;

    constructor(
        private _dragulaService: DragulaService,
        private _recoveryPlanService: RecoveryPlanService,
        private _kanbanService: KanbanService
    ) {
       this._kanbanColumns = {
           backlog: {name: 'backlog', cards: []},
           todo: {name: 'todo', cards: []},
           doing: {name: 'doing', cards: []},
           done: {name: 'done', cards: []}
       };
       this._kanbanName = 'kanban';
    }

    log(v) {
        console.log(v);
    }

    ngOnInit() {

        this._dragulaDragSub = this._dragulaService.drop
            .pipe(
                tap(args => {
                    console.log('Dragged!!', args[1], args[1].getAttribute('id'));

                })
            )
            .subscribe();

        // [1]: Card
        // [2]: Target column
        this._dragulaDropSub = this._dragulaService.drop
            .pipe(
                tap(args => {
                    console.log('Dropped!!', args[1], args[1].getAttribute('id'));
                })
            )
            .subscribe();



        /**
         * Resctrict moves from and to backlog
         */
        this._dragulaService.setOptions(this.kanbanName, {
            copy: (card, fromCol) => fromCol ? fromCol.getAttribute('id') === this.backlogCol.name : false,
            accepts: (card, toCol, fromCol) => {
                const fromId = fromCol.getAttribute('id');
                const toId = toCol.getAttribute('id');
                return !((fromId === this.backlogCol.name && toId !== this.todoCol.name) || toCol.getAttribute('id') === this.backlogCol.name);
            }
        });
    }

    get activities$(): Observable<KanbanCardInterface> {
        return this._recoveryPlanService.activities$;
    }

    ngOnDestroy() {
        this._dragulaDropSub.unsubscribe();
        this._dragulaDragSub.unsubscribe();
        // this._activitiesSub.unsubscribe();
    }

    get kanbanName(): string {
        return this._kanbanName;
    }

    set kanbanName(value: string) {
        this._kanbanName = value;
    }

    get backlogCol(): KanbanColInterface {
        return this._kanbanColumns.backlog;
    }

    get todoCol(): KanbanColInterface {
        return this._kanbanColumns.todo;
    }

    get doingCol(): KanbanColInterface {
        return this._kanbanColumns.doing;
    }

    get doneCol(): KanbanColInterface {
        return this._kanbanColumns.done;
    }



}
