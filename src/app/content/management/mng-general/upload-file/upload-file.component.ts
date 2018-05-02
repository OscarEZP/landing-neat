import {Component, OnInit} from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import {ApiRestService} from "../../../../shared/_services/apiRest.service";


@Component({
    selector: 'file-uploader',
    templateUrl: './upload-file.component.html',
    styleUrls: ['./upload-file.component.scss'],

})
export class UploadFileComponent implements OnInit{
    loaded: boolean = false;
    fileCsv: string = '';
    fileUpload: File;
    formData: FormData;
    constructor(private http: HttpClient,
                private _apiRestService: ApiRestService) {

    }

    ngOnInit() {
    }

    handleInputChange(e) {
        this.fileUpload = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];

        console.log('fileUpload',this.fileUpload);
;
    }

    _handleReaderLoaded(e) {
        var reader = e.target;
        this.fileCsv = reader.result;
        this.loaded = true;
    }
    public onArchivoSeleccionado() {
        console.log('seleccionando archivo');
        console.log('fileUpload send',this.fileUpload)
        let formData = new FormData();
        formData.append('file', this.fileUpload);
        formData.append('fileName', this.fileUpload.name);
        console.log('formData',formData);
        /*let res: Response;
        const idToken = localStorage.getItem('currentUser');
        const requestOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded',
                'Accept':'application/json',
                'Access-Control-Allow-Origin': '*',
                'Authorization':idToken
            })
        };*/

      /*  this.http.post('https://staging.mcp.maintenix.ifs.cloud/api/v1/management/users/_load',formData,requestOptions).subscribe(response => console.log('response',response),
            () => {
                console.log('OK');
            });
*/
       this._apiRestService.postUploadFile<Response>('uploadFile',this.fileUpload).toPromise().then(response => console.log(response)

        ).catch(x => console.log(x));
    }


}
