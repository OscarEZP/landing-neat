import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { DataService } from '../shared/_services/data.service';

@Component({
    selector: 'lsl-simplified-layout',
    templateUrl: './simplified-layout.component.html',
    styleUrls: ['./simplified-layout.component.css']
})
export class SimplifiedLayoutComponent implements OnInit {

    private _messageDataSubscription: Subscription;
    public loading: boolean;
    public mode: string;
    public value: number;

    constructor(private messageData: DataService) {
    }

    ngOnInit() {
        this._messageDataSubscription = this.messageData
                                            .currentStringMessage
                                            .subscribe(message => setTimeout(() => this.activateLoadingBar(message), 0));
    }

    private activateLoadingBar(message: string) {
        if (message === 'open') {
            this.loading = true;
            this.mode = 'indeterminate';
            this.value = 20;
        } else if (message === 'close') {
            this.loading = false;
            this.mode = 'determinate';
            this.value = 100;
        }
    }

}
