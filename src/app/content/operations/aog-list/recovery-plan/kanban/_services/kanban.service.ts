import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {KanbanCardComponent} from '../kanban-card/kanban-card.component';

export interface KanbanInterface {
    selectedCards: KanbanCardComponent[];
}

@Injectable()
export class RecoveryPlanService {

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
            selectedCards: []
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

    public set selectedCards(value: KanbanCardComponent[]) {
        this.kanbanInterface.selectedCards = value;
        this.emitData(this.kanbanInterface);
    }

}