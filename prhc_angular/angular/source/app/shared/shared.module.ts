import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Angular2FontawesomeModule } from 'angular2-fontawesome';

import { CleanStringPipe } from './pipes/clean-string.pipe';
import { OnSaleDatePipe } from './pipes/on-sale-date.pipe';
import { ObjNgForPipe } from './pipes/obj-ng-for.pipe';
import { SanitizeHtmlPipe } from './pipes/sanitize-html.pipe';

const declarations = [
  CleanStringPipe,
  OnSaleDatePipe,
  ObjNgForPipe,
  SanitizeHtmlPipe
];

@NgModule({
  imports: [CommonModule,
  Angular2FontawesomeModule
  ],
  exports: [...declarations],
  declarations,
})
export class SharedModule { }
