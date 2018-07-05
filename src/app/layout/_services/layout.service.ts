import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

export interface Layout {
    showAddButton: boolean;
    showRightNav: boolean;
    disableAddButton: boolean;
    disableRightNav: boolean;
    loading: boolean;
}

@Injectable()
export class LayoutService {
    private _layout: BehaviorSubject<Layout>;
    private _layout$: Observable<Layout>;

    constructor() {
        this._layout = new BehaviorSubject<Layout>({
            showAddButton: false,
            showRightNav: false,
            disableAddButton: false,
            disableRightNav: false,
            loading: true
        });
        this._layout$ = this._layout.asObservable();
    }

    get layout$(): Observable<Layout> {
        return this._layout$;
    }

    set layout(value: Layout) {
        this._layout.next(value);
    }

    private getLayout(): Layout {
        return this._layout.getValue();
    }

    set showAddButton(value: boolean) {
        this.getLayout().showAddButton = value;
    }

    set showRightNav(value: boolean) {
        this.getLayout().showRightNav = value;
    }

    set disableAddButton(value: boolean) {
        this.getLayout().disableAddButton = value;
    }

    set disableRightNav(value: boolean) {
        this.getLayout().disableRightNav = value;
    }

    set loading(value: boolean) {
        this.getLayout().loading = value;
    }
}
