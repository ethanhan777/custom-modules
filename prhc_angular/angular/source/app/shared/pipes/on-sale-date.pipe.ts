import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'onSaleDate' })
export class OnSaleDatePipe implements PipeTransform {
  transform(value: string, args: string[]): any {
    if (!value) {
      return value;
    }

    const isString = args !== undefined ? args[0] : 'n';
    return this.timeConverter(value, isString);
  }

  timeConverter(date, isTimestamp) {
    let a;
    if (isTimestamp === 'y') {
      a = new Date(date * 1000);
    } else {
      a = new Date(date.replace(/-/g, '/'));
    }

    const months = [
      'January',
      'Feburary',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const day = a.getDate();
    // var hour = a.getHours();
    // var min = a.getMinutes();
    // var sec = a.getSeconds();
    const time = month + ' ' + day + ', ' + year;
    return time;
  }
}
