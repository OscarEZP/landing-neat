import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from '../../../shared/_services/message.service';
import { ApiRestService } from '../../../shared/_services/apiRest.service';
import { Aircraft } from '../../../shared/_models/aircraft';
import { ContingencyService} from '../_services/contingency.service';

@Component({
    selector: 'lsl-search-historical',
    templateUrl: './search-historical.component.html',
    styleUrls: ['./search-historical.component.scss']
})

export class SearchHistoricalComponent implements OnInit {
    searchForm: FormGroup;
    public snackbarMessage: string;

    toppings = new FormControl();

    public aicraftList: Aircraft[];

    constructor(fb: FormBuilder,
                public translate: TranslateService,
                public messageService: MessageService,
                public service: ApiRestService,
                public contingencyService: ContingencyService) {
        this.searchForm = fb.group({
            'tails': [null, Validators.required],
            'from': [null, Validators.required],
            'to': [null, Validators.required]
        });

        this.translate.setDefaultLang('en');
    }

    ngOnInit() {
        this.getAircraft();

    }

    private getAircraft(): void {
        const searchSignature = {
            enable: 2
        }
        this.contingencyService.getAircrafts(searchSignature).subscribe((data) => {
            this.aicraftList = data as Aircraft[];
        });
    }

    private translateString(toTranslate: string) {
        this.translate.get(toTranslate).subscribe((res: string) => {
            this.snackbarMessage = res;
        });
    }

    public clearSearch(): void {
        this.searchForm.controls['tails'].reset();
        this.searchForm.controls['from'].reset();
        this.searchForm.controls['to'].reset();
    }

    submitForm(value: any) {
        if (this.searchForm.valid) {

            console.log('valid', value);
        } else {
            this.translateString('OPERATIONS.VALIDATION_ERROR_MESSAGE');
            this.messageService.openSnackBar(this.snackbarMessage);
        }

    }

}
