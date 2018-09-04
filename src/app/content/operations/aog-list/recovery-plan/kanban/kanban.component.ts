import {Component, OnDestroy, OnInit} from '@angular/core';
import {DragulaService} from 'ng2-dragula';
import {Subscription} from 'rxjs/Subscription';
import {filter, map, tap} from 'rxjs/operators';
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

    private _activities: KanbanCardInterface[];
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

    ngOnInit() {
        this._activitiesSub = this.getActivities();
        this._dragulaDragSub = this._dragulaService.drag
            .pipe(
                tap(args => {
                    const card = args[1];
                    this._kanbanService.addCard(card.getAttribute('id'));
                })
            )
            .subscribe();

        // todo: desacoplar
        this._dragulaDropSub = this._dragulaService.drop
            .pipe(
                filter(args => !!args[2]),
                tap(args => {
                    const cardId = args[1] ? args[1].getAttribute('id') : null;
                    const oldColId = args[3] ? args[3].getAttribute('id') : null;
                    const nextCardId = args[4] ? args[4].getAttribute('id') : null;
                    const newColId = args[2].getAttribute('id');

                    const newcard: KanbanCardInterface = oldColId === this.backlog.name ?
                        Object.assign({}, this.activities.find(v => v.id === cardId)) :
                        this[oldColId].cards.find(v => v.id === cardId);

                    if (oldColId === this.backlog.name) {
                        const nativeSelector = '#'.concat(newColId).concat(' #' + newcard.id);
                        const nativeElement = document.querySelector(nativeSelector);
                        nativeElement.parentNode.removeChild(nativeElement);
                        newcard.id = 'card'.concat(Math.random().toString(36).substring(7));
                    }

                    const nextIndex = this[newColId].cards.findIndex(v => v.id === nextCardId);
                    const oldIndex = this[oldColId].cards.findIndex(v => v.id === cardId);

                    if (newColId !== oldColId) {
                        this[oldColId].cards = this[oldColId].cards.filter(v => v.id !== cardId);
                        if (nextIndex === -1) {
                            this[newColId].cards.push(newcard);
                        } else {
                            this[newColId].cards.splice(nextIndex, 0, newcard);
                        }
                    } else {
                        if (nextIndex === -1) {
                            this[newColId].cards.push(newcard);
                            this[newColId].cards.splice(this[newColId].cards.findIndex(v => v.id === newcard.id), 1);
                        } else {
                            this[newColId].cards.splice(oldIndex, 1);
                            this[newColId].cards.splice(nextIndex, 0, newcard);
                        }
                    }
                    this.logCols();
                })
            )
            .subscribe();

        /**
         * Resctrict moves from and to backlog
         */
        this._dragulaService.setOptions(this.kanbanName, {
            copy: (card, fromCol) => fromCol ? fromCol.getAttribute('id') === this.backlog.name : false,
            accepts: (card, toCol, fromCol) => {
                const fromId = fromCol.getAttribute('id');
                const toId = toCol.getAttribute('id');
                return !((fromId === this.backlog.name && toId !== this.todo.name) || toCol.getAttribute('id') === this.backlog.name);
            }
        });
    }

    private logCols() {
        console.log(this.todo, this.doing, this.done);
    }

    getActivities(): Subscription {
        return this._recoveryPlanService.activities$
            .subscribe(v => this.activities = v);
    }

    deleteCard(idCard: string, idCol: string) {
        this[idCol].cards = this[idCol].cards.filter(v => v.id !== idCard);
        this.logCols();
    }

    ngOnDestroy() {
        this._dragulaDropSub.unsubscribe();
        this._dragulaDragSub.unsubscribe();
        this._dragulaService.destroy(this.kanbanName);
    }

    get kanbanName(): string {
        return this._kanbanName;
    }

    set kanbanName(value: string) {
        this._kanbanName = value;
    }

    get backlog(): KanbanColInterface {
        return this._kanbanColumns.backlog;
    }

    get todo(): KanbanColInterface {
        return this._kanbanColumns.todo;
    }

    get doing(): KanbanColInterface {
        return this._kanbanColumns.doing;
    }

    get done(): KanbanColInterface {
        return this._kanbanColumns.done;
    }

    get activities(): KanbanCardInterface[] {
        return this._activities;
    }

    set activities(value: KanbanCardInterface[]) {
        this._activities = value;
    }
}
