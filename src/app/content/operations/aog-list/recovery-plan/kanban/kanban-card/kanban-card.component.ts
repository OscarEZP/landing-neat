import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {KanbanCardInterface, KanbanInterface} from '../_services/kanban.service';

@Component({
    selector: 'lsl-kanban-card',
    templateUrl: './kanban-card.component.html',
    styleUrls: ['./kanban-card.component.scss']
})
export class KanbanCardComponent implements OnInit, OnDestroy {

    @Input('card') _kanbanCard: KanbanCardInterface;

    constructor() {
    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }

    get kanbanCard(): KanbanCardInterface {
        return this._kanbanCard;
    }

    set kanbanCard(value: KanbanCardInterface) {
        this._kanbanCard = value;
    }
}
