import {Injectable} from '@angular/core';

@Injectable()
export class RoutingService {
    public moduleTitle: string;

    constructor() {
        this.moduleTitle = '';
    }

    public setActiveModule(url: string) {
        switch (url) {
            case '/dashboard'    :
                this.moduleTitle = 'Dashboard';
                break;
            default:
            case '/operations/contingencies'   :
                this.moduleTitle = 'Operations Module';
                break;
            case '/hemycicle/contingencies' :
                this.moduleTitle = 'Hemycicle Module';
                break;
        }
        console.log('Title: ' + this.moduleTitle);
    }

    public getModuleTitle() {
        return this.moduleTitle;
    }
}
