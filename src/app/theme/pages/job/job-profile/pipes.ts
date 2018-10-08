import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter',
    pure: false
})
export class FilterPipe implements PipeTransform {
    /*transform(items: any[], termName): any { 
        return termName 
            ? items.filter(item => item.name.toLowerCase().indexOf(termName.toLowerCase()) !== -1)
            : items;
    }*/
    transform(items: any[], termPosId: string, termStaffId: string, termName: string, termPos: string, termStt: string) {
        if (items && items.length) {
            return items.filter(item => {
                if (termPosId && item.positionId.toLowerCase().indexOf(termPosId.toLowerCase()) === -1) {
                    return false;
                }
                if (termStaffId && item.staffNo.toLowerCase().indexOf(termStaffId.toLowerCase()) === -1) {
                    return false;
                }
                if (termName && item.name.toLowerCase().indexOf(termName.toLowerCase()) === -1) {
                    return false;
                }
                if (termPos && item.positionName.toLowerCase().indexOf(termPos.toLowerCase()) === -1) {
                    return false;
                }
                if (termStt && item.status.toLowerCase().indexOf(termStt.toLowerCase()) === -1) {
                    return false;
                }
                return true;
            })
        }
        else {
            return items;
        }
    }
}

@Pipe({
    name: 'sortBy'
})
export class SortByPipe implements PipeTransform {
    transform(items: any[], sortedBy: string): any {
        console.log('sortedBy', sortedBy);

        return items.sort((a, b) => { return b[sortedBy] - a[sortedBy] });
    }
}