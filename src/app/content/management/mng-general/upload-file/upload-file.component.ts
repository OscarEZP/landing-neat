import {Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ApiRestService} from '../../../../shared/_services/apiRest.service';


@Component({
    selector: 'lsl-file-uploader',
    templateUrl: './upload-file.component.html',
    styleUrls: ['./upload-file.component.scss'],

})
export class UploadFileComponent implements OnInit {

    private _loaded: boolean;
    private _fileCsv: string;
    private _fileUpload: File;
    private _formData: FormData;

    constructor(private http: HttpClient,
                private _apiRestService: ApiRestService) {

    }

    ngOnInit() {
        this.loaded = false;
        this.fileCsv = '';
    }

    handleInputChange(e) {
        this.fileUpload = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
        console.log('fileUpload', this.fileUpload);
    }

    public onSelectFile() {
        console.log('seleccionando archivo');
        console.log('fileUpload send', this.fileUpload);
        const formData = new FormData();
        formData.append('file', this.fileUpload);
        formData.append('fileName', this.fileUpload.name);
        console.log('formData', formData);
        this._apiRestService.postUploadFile<Response>('managementUsersLoad', this.fileUpload)
            .toPromise()
            .then(response => console.log(response)
        ).catch(x => console.log(x));
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
}
