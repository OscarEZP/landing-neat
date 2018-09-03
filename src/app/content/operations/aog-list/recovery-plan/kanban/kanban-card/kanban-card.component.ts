import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {KanbanCardInterface, KanbanInterface, KanbanService} from '../_services/kanban.service';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import {filter, tap} from 'rxjs/operators';

@Component({
    selector: 'lsl-kanban-card',
    templateUrl: './kanban-card.component.html',
    styleUrls: ['./kanban-card.component.scss']
})
export class KanbanCardComponent implements OnInit, OnDestroy {

    @Input('isTemplate') private _isTemplate: boolean;
    @Input('card') _kanbanCard: KanbanCardInterface;

    private _kanbanSub: Subscription;

    constructor(
        private _kanbanService: KanbanService
    ) {
    }

    ngOnInit() {
        this._kanbanSub = this.kanbanService$.subscribe();

    }

    ngOnDestroy() {
        this._kanbanSub.unsubscribe();
    }

    get kanbanService$(): Observable<KanbanInterface> {
        return this._kanbanService.service$
            .pipe(
                filter((v: KanbanInterface) => !!v.selectedCards.find(id => this.kanbanCard ? this.kanbanCard.id === id : false)),
                tap((v: KanbanInterface) => {
                })
            );
    }

    get kanbanCard(): KanbanCardInterface {
        return this._kanbanCard;
    }

    set kanbanCard(value: KanbanCardInterface) {
        this._kanbanCard = value;
    }

    get isTemplate(): boolean {
        return this._isTemplate;
    }
}
