import {Directive, ElementRef, HostListener, Inject, Input} from '@angular/core';
import {DOCUMENT} from '@angular/common';

@Directive({
    selector: '[lslScrollTrigger]'
})
export class ScrollTriggerDirective {

    private state: string;

    constructor(@Inject(DOCUMENT) private document: Document) {
        this.state = 'blank';
    }

    @HostListener('click')
    myClick() {
        console.log(this.document);
    }

    @HostListener('window:scroll', [])
    onWindowScroll() {
        let number = this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
        console.log(number);
    }


}
