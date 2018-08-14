export class RecoveryStage {

    private _seq: number;
    private _code: string;
    private _label: string;
    private _description: string;
    private _level: number;
    private _color: string;
    private _projectedColor: string;


    constructor(seq: number, code: string, label: string, description: string, level: number, color: string, projectedColor: string) {
        this._seq = seq;
        this._code = code;
        this._label = label;
        this._description = description;
        this._level = level;
        this._color = color;
        this._projectedColor = projectedColor;
    }

    getInstance(): RecoveryStage {

        return new RecoveryStage(null, null, null, null, null, null, null);

    }

    get seq(): number {
        return this._seq;
    }

    set seq(value: number) {
        this._seq = value;
    }

    get code(): string {
        return this._code;
    }

    set code(value: string) {
        this._code = value;
    }

    get label(): string {
        return this._label;
    }

    set label(value: string) {
        this._label = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get level(): number {
        return this._level;
    }

    set level(value: number) {
        this._level = value;
    }

    get color(): string {
        return this._color;
    }

    set color(value: string) {
        this._color = value;
    }

    get projectedColor(): string {
        return this._projectedColor;
    }

    set projectedColor(value: string) {
        this._projectedColor = value;
    }
}
