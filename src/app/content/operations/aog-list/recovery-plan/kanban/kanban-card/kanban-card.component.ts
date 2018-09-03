import {Component, Input, OnDestroy, OnInit} from '@angular/core';

@Component({
    selector: 'lsl-kanban-card',
    templateUrl: './kanban-card.component.html',
    styleUrls: ['./kanban-card.component.scss']
})
export class KanbanCardComponent implements OnInit, OnDestroy {

    private _displayCard: boolean;
    private _stageCode: string;
    private _activity: string;
    private _unit: string;
    private _isAlternative: boolean;

    constructor() {
        this._stageCode = 'ACC';
        this._activity = 'REMOCIÓN E INSTALACIÓN DE PARTES';
        this._unit = 'PRO';
        this._isAlternative = true;
        this._displayCard = true;
    }

    ngOnInit() {
    }

    ngOnDestroy() {

    }

    get stageCode(): string {
        return this._stageCode;
    }

    set stageCode(value: string) {
        this._stageCode = value;
    }


    get activity(): string {
        return this._activity;
    }

    set activity(value: string) {
        this._activity = value;
    }

    get unit(): string {
        return this._unit;
    }

    set unit(value: string) {
        this._unit = value;
    }

    get isAlternative(): boolean {
        return this._isAlternative;
    }

    set isAlternative(value: boolean) {
        this._isAlternative = value;
    }

    get displayCard(): boolean {
        return this._displayCard;
    }

    set displayCard(value: boolean) {
        this._displayCard = value;
    }
}
