export class QuillConfiguration {

    private _style: object;
    private _placeholder: string;
    private _readOnly: boolean;
    private _theme: string;
    private _modules: object;

    private constructor(style: object, placeholder: string, readOnly: boolean, theme: string, modules: object) {
        this._style = style;
        this._placeholder = placeholder;
        this._readOnly = readOnly;
        this._theme = theme;
        this._modules = modules;
    }

    static getInstance(): QuillConfiguration {
        return new QuillConfiguration({'height': '250px'}, 'Enter text here...', false, 'snow', {
            toolbar: [
                ['bold', 'italic', 'underline'],            // toggled buttons
                [{'list': 'ordered'}, {'list': 'bullet'}],
                [{'indent': '-1'}, {'indent': '+1'}],       // outdent/indent

                [{'color': []}, {'background': []}],        // dropdown with defaults from theme
                [{'align': []}],

                ['clean']                                   // remove formatting button
            ]
        });
    }


    get style(): object {
        return this._style;
    }

    set style(value: object) {
        this._style = value;
    }

    get placeholder(): string {
        return this._placeholder;
    }

    set placeholder(value: string) {
        this._placeholder = value;
    }

    get readOnly(): boolean {
        return this._readOnly;
    }

    set readOnly(value: boolean) {
        this._readOnly = value;
    }

    get theme(): string {
        return this._theme;
    }

    set theme(value: string) {
        this._theme = value;
    }

    get modules(): object {
        return this._modules;
    }

    set modules(value: object) {
        this._modules = value;
    }
}
