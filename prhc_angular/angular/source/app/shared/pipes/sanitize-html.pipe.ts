import { Pipe, PipeTransform, Inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({ name: 'sanitizeHtml' })
export class SanitizeHtmlPipe implements PipeTransform {
  _sanitizer: DomSanitizer;

  constructor(@Inject(DomSanitizer) _sanitizer: DomSanitizer) {
    this._sanitizer = _sanitizer;
  }

  transform(v: string): SafeHtml {
    return this._sanitizer.bypassSecurityTrustHtml(v);
  }
}
