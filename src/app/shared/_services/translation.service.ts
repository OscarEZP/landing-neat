import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {MessageService} from './message.service';

@Injectable()
export class TranslationService {

    private static LANG = 'en';

    constructor(
        private _translateService: TranslateService,
        private _messageService: MessageService
    ) {
        this._translateService.setDefaultLang(TranslationService.LANG);
    }

    /**
     * Translate a message
     * @param {string} toTranslate
     * @returns {Promise<string>}
     */
    public translate(toTranslate: string): Promise<string> {
        return this._translateService.get(toTranslate).toPromise();
    }

    /**
     * Translate and show a toast message
     * @param {string} toTranslate
     */
    public translateAndShow(toTranslate: string, time: number = 2500): Promise<void> {
        return this.translate(toTranslate).then((res: string) => this._messageService.openSnackBar(res, time));
    }
}
