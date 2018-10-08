import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'filter',
    pure: false
})
export class FilterPipe implements PipeTransform {
    transform(items: any[], termPos: string, termLoc: string, termComp: string) {
        try {
            if (items && items.length) {
                return items.filter(item => {
                    if (termPos && item.pos.toLowerCase().indexOf(termPos.toLowerCase()) === -1) {
                        return false;
                    }
                    if (termLoc && item.loc.toLowerCase().indexOf(termLoc.toLowerCase()) === -1) {
                        return false;
                    }
                    if (termComp && item.comp.toLowerCase().indexOf(termComp.toLowerCase()) === -1) {
                        return false;
                    }
                    return true;
                })
            }
            else {
                return items;
            }
        } catch {
            return null;
        }
    }
}

@Pipe({
    name: 'sortBy'
})
export class SortByPipe implements PipeTransform {
    transform(items: any[], sortedBy: string): any {
        //console.log('sortedBy', sortedBy);
        try {
            return items.sort((a, b) => { return b[sortedBy] - a[sortedBy] });
        } catch {
            return null;
        }
    }
}