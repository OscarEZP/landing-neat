import {Component, OnInit} from '@angular/core';
import {ApiRestService} from '../../../../../shared/_services/apiRest.service';
import {StorageService} from '../../../../../shared/_services/storage.service';
import {Summary} from '../../../../../shared/_models/management/summary';
import {MessageService} from '../../../../../shared/_services/message.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'lsl-file-uploader',
    templateUrl: './bulk-load.component.html',
    styleUrls: ['./bulk-load.component.scss']
})
export class BulkLoadComponent implements OnInit {

    public static MANAGEMENT_USERS_LOAD = 'managementUsersLoad';
    public static LOAD_FILE_ID = 'in-bulk-load-file';

    private _loaded: boolean;
    private _fileCsv: string;
    private _fileUpload: File;
    private _formData: FormData;
    private _fileInput: HTMLElement;

    private _summary: Summary;

    constructor(
        private _apiRestService: ApiRestService,
        private _storageService: StorageService,
        private _messageService: MessageService,
        private _translateService: TranslateService
    ) {
        this.summary = new Summary();
    }

    ngOnInit() {
        this.loaded = false;
        this.fileCsv = '';
        this.formData = new FormData();
    }

    /**
     * Handler for a selected file
     * @param e
     */
    handleInputChange(e) {
        this.fileUpload = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
        this.uploadFile();
    }

    /**
     * Set an input file element and trigger a click for selection interface
     */
    public selectFile() {
        this.fileInput = document.getElementById(BulkLoadComponent.LOAD_FILE_ID) as HTMLElement;
        this.fileInput.click();
    }

    /**
     * Upload file
     */
    private uploadFile() {
        if (this.fileUpload) {
            this.formData.append('file', this.fileUpload);
            this.formData.append('fileName', this.fileUpload.name);
            this._apiRestService.postUploadFile<Summary>(BulkLoadComponent.MANAGEMENT_USERS_LOAD, this.formData, this._storageService.username)
                .toPromise()
                .then(response => {
                    this.fileUpload = null;
                    this.loaded = true;
                    if (response) {
                        this.summary = response;
                    }
                })
                .catch(() => {
                    this._translateService.get('ERRORS.DEFAULT')
                        .toPromise()
                        .then(res => this._messageService.openSnackBar(res)
                    );
                });
        }
    }

    get loaded(): boolean {
        return this._loaded;
    }

    set loaded(value: boolean) {
        this._loaded = value;
    }

    get fileCsv(): string {
        return this._fileCsv;
    }

    set fileCsv(value: string) {
        this._fileCsv = value;
    }

    get fileUpload(): File {
        return this._fileUpload;
    }

    set fileUpload(value: File) {
        this._fileUpload = value;
    }

    get formData(): FormData {
        return this._formData;
    }

    set formData(value: FormData) {
        this._formData = value;
    }

    get fileInput(): HTMLElement {
        return this._fileInput;
    }

    set fileInput(value: HTMLElement) {
        this._fileInput = value;
    }

    get summary(): Summary {
        return this._summary;
    }

    set summary(value: Summary) {
        this._summary = value;
    }
}
