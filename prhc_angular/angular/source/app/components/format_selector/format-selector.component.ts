import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  SimpleChange
} from '@angular/core';

export const formatSelectorSelector = 'format-selector';

@Component({
  selector: formatSelectorSelector,
  templateUrl: './format-selector.component.html',
})
export class FormatSelectorComponent implements OnInit, OnChanges {
  @Input() activeIsbn: string;
  @Input() formats = [];
  @Output() selectedFormat = new EventEmitter<any>();
  parsedFormats = [];

  ngOnInit() {
    this.parsedFormats = parseFormat(this.formats, this.activeIsbn);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.activeIsbn && changes.activeIsbn.previousValue) {
      const activeIsbn: SimpleChange = changes.activeIsbn;
      this.activeIsbn = activeIsbn.currentValue;
      this.parsedFormats = parseFormat(this.formats, this.activeIsbn);
    }
  }

  changeFormat(url) {
    this.selectedFormat.emit(url);
  }
}

export function parseFormat(formats, activeIsbn) {
  const parsedFormats = [];

  formats.map(format => {
    parsedFormats.push({
      title: format.format.name,
      seoFriendlyUrl: format.seoFriendlyUrl,
      subtitle: format.canPrice,
      cover: 'https://images.randomhouse.com/cover/' + format.isbn,
      active: format.isbn === activeIsbn ? true : false,
    });
  });

  return parsedFormats;
}
