import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';

export interface KanbanCardInterface {
    stageCode: string;
    activity: string;
    unit: string;
    isAlternative: boolean;
    color: string;
    id: number|string;
}

export interface KanbanColInterface {
    name: string;
    cards: KanbanCardInterface[];
}

export interface KanbanColumnsInterface {
    backlog: KanbanColInterface;
    todo: KanbanColInterface;
    doing: KanbanColInterface;
    done: KanbanColInterface;
}

export interface KanbanInterface {
    selectedCards: string[];
    action: 'drag'|'drop'|'none';
}

@Injectable()
export class KanbanService {

    private _serviceSubject: BehaviorSubject<KanbanInterface>;
    private _service$: Observable<KanbanInterface>;

    constructor() {
        this._serviceSubject = new BehaviorSubject<KanbanInterface>(this.newKanbanInterface);
        this._service$ = this._serviceSubject.asObservable();
    }

    /**
     * Generate a new interface
     */
    private get newKanbanInterface(): KanbanInterface {
        return {
            selectedCards: [],
            action: 'none'
        };
    }

    get service$(): Observable<KanbanInterface> {
        return this._service$;
    }

    private get kanbanInterface() {
        return this._serviceSubject.getValue();
    }

    public emitData(value: KanbanInterface) {
        this._serviceSubject.next(this.kanbanInterface);
    }

    public set selectedCards(value: any[]) {
        this.kanbanInterface.selectedCards = value;
        this.emitData(this.kanbanInterface);
    }

    public addCard(card: string): void {
        const newCards = this.kanbanInterface.selectedCards;
        newCards.push(card);
        this.selectedCards = newCards;
    }

    public delCard(id: string|number): void {
        this.selectedCards = this.kanbanInterface.selectedCards.filter(v => v !== id);
    }

}
