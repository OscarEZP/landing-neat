import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
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

    @Output() onDelete: EventEmitter<boolean>;
    @Input('isTemplate') private _isTemplate: boolean;
    @Input('card') _kanbanCard: KanbanCardInterface;

    private _kanbanSub: Subscription;

    constructor(
        private _kanbanService: KanbanService
    ) {
        this.onDelete = new EventEmitter<boolean>(false);
    }

    ngOnInit() {
        this._kanbanSub = this.kanbanService$.subscribe();

    }

    ngOnDestroy() {
        this._kanbanSub.unsubscribe();
    }

    deleteCard() {
        this.onDelete.emit(true);
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
