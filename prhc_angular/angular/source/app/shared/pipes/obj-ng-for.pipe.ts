import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'ObjNgFor',  pure: false })
export class ObjNgForPipe implements PipeTransform {
  transform(value: any): any {
    return Object.keys(value);
  }
}
