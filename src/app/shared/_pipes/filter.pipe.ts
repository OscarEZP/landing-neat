import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter',
    pure: false
})
export class FilterPipe implements PipeTransform {
    transform(items: any[], term): any {
        return term
            ? items.filter(item => item.tail.indexOf(term.toUpperCase()) !== -1)
            : items;
    }
}