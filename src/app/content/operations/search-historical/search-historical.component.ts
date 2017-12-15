import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MessageService} from '../../../shared/_services/message.service';

@Component({
    selector: 'lsl-search-historical',
    templateUrl: './search-historical.component.html',
    styleUrls: ['./search-historical.component.scss']
})

export class SearchHistoricalComponent implements OnInit {
    searchForm: FormGroup;
    public snackbarMessage: string;

    toppings = new FormControl();

    toppingList = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

    constructor(fb: FormBuilder,
                public translate: TranslateService,
                public messageService: MessageService) {
        this.searchForm = fb.group({
            'tails': [null, Validators.required],
            'from': [null, Validators.required],
            'to': [null, Validators.required]
        });

        this.translate.setDefaultLang('en');
    }

    ngOnInit() {

    }

    private translateString(toTranslate: string) {
        this.translate.get(toTranslate).subscribe((res: string) => {
            this.snackbarMessage = res;
        });
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
