import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'cleanString' })
export class CleanStringPipe implements PipeTransform {
  transform(value: string): any {
    if (!value) {
      return value;
    }
    return value.replace(/\s+/g, '+').toLowerCase();
  }
}
