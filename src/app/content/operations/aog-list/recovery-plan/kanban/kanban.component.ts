import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DragulaService, DragulaDirective} from 'ng2-dragula';
import {Subscription} from 'rxjs/Subscription';
import {KanbanCardComponent} from './kanban-card/kanban-card.component';

@Component({
    selector: 'lsl-kanban',
    templateUrl: './kanban.component.html',
    styleUrls: ['./kanban.component.scss']
})
export class KanbanComponent implements OnInit, OnDestroy {

    @ViewChild('toDo') toDo: DragulaDirective;

    card: KanbanCardComponent;

    private static BACKLOG_ID = 'backlog';

    private _dragulaSub: Subscription;
    public cards: boolean[] = [true, false, true, false, true, false];

    constructor(
        private _dragulaService: DragulaService
    ) {
        // [1]: Card
        // [2]: Target column
        this._dragulaSub = this._dragulaService.drop
            .subscribe(args => {
                let [bagName, card, dropCol, source] = args;
                if (dropCol.getAttribute('id') === KanbanComponent.BACKLOG_ID) {
                    console.log('Drop on Backlog!');
                }
                console.log('drop', card);
            });

        this._dragulaService.drag.subscribe(v => {
            console.log('drag', v);
        });

        this._dragulaService.dropModel.subscribe(v => {
            console.log('dropModel', v);
        });
    }

    drag(v) {
        console.log('drag', v);
    }

    ngOnInit() {

    }

    ngOnDestroy() {
        this._dragulaSub.unsubscribe();
    }

}
