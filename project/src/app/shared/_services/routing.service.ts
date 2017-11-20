import { Injectable } from '@angular/core';

@Injectable()
export class RoutingService {

    private moduleTitle: string;

    public setActiveModule(url: string){
        switch (url) {
            case '/dashboard'    : this.moduleTitle = 'Dashboard'; break;
            case '/operations/contingencies'   : this.moduleTitle = 'Operations Module'; break;
        }
        console.log('Title: ' + this.moduleTitle);
    }

    public getModuleTitle(){
        return this.moduleTitle;
    }

}
