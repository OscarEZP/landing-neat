export class Menu {

    private _label: string;
    private _icon: string;
    private _link: string;
    private _submenu: Menu[];
    private _collapse: boolean;

    constructor(label: string = '', icon: string = '', link: string = '', collapse = false, submenu: Menu[] = []) {
        this._label = label;
        this._icon = icon;
        this._link = link;
        this._submenu = submenu;
        this._collapse = collapse;
    }

    get slug(): string {
        // console.log(this.link.split('/').pop());
        // return this.link;
        return this.link !== '' ? this.link.split('/').pop() : '';
    }

    get label(): string {
        return this._label;
    }

    set label(value: string) {
        this._label = value;
    }

    get icon(): string {
        return this._icon;
    }

    set icon(value: string) {
        this._icon = value;
    }

    get link(): string {
        return this._link;
    }

    set link(value: string) {
        this._link = value;
    }

    get submenu(): Menu[] {
        return this._submenu;
    }

    set submenu(value: Menu[]) {
        this._submenu = value;
    }

    get collapse(): boolean {
        return this._collapse;
    }

    set collapse(value: boolean) {
        this._collapse = value;
    }
}
