import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { getHttpOptions } from './enhanced_api.service';

@Injectable()

export class RetailersService {
  title: any;
  amazonUrls = [];
  retailerTypes = [{
    name: 'eBook',
    formatCodes: ['EL'],
    retailers: [{
      name: 'Amazon',
      seoFriendlyUrl: undefined,
    },
    {
      name: 'Kobo',
      seoFriendlyUrl: undefined,
    },
    {
      name: 'Google',
      seoFriendlyUrl: undefined,
    },
    {
      name: 'iBooks',
      seoFriendlyUrl: undefined,
    }],
  },
  {
    name: 'Physical',
    formatCodes: ['BR', 'BX', 'CD', 'CD', 'CD', 'CS', 'DG', 'HC', 'HC', 'MG', 'MM', 'NT', 'TR', 'VI'],
    retailers: [{
      name: 'Amazon',
      seoFriendlyUrl: undefined,
    },
    {
      name: 'Chapters-Indigo',
      seoFriendlyUrl: undefined,
    },
    {
      name: 'Shop Independent',
      seoFriendlyUrl: '#',
    }],
  },
  {
    name: 'Audio',
    formatCodes: ['DN'],
    retailers: [{
      name: 'Audible',
      seoFriendlyUrl: undefined,
    },
    {
      name: 'Kobo',
      seoFriendlyUrl: undefined,
    },
    {
      name: 'Google',
      seoFriendlyUrl: undefined,
    }],
  }];
  titleRetailers = [];

  constructor (private http: HttpClient) {}

  setRetailers(currentTitle) {
    // set the title
    this.title = currentTitle;

    this.setRetailerLinks(this.title);

    this.retailerTypes.map(type => {
      type.formatCodes.map(code => {
        // check which retailer type the current title belongs to
        if (code === this.title.format.code) {
          this.titleRetailers = type.retailers;
        }
      });
    });
  }

  setRetailerLinks(title) {
    // setting the retailers after we have the title info
    if (title.format.code === 'EL') {
      this.getAmazonUrl(title.isbn, title.format.code);
      this.getOtherUrls(title.isbn, title.title, title.author);
      this.getiTunesUrl(title.isbn, title.format.name, title.title, title.author);
      this.getGoogleUrl(title.isbn);
    } else if (title.format.code === 'DN') {
      this.getOtherUrls(title.isbn, title.title, title.author);
    } else {
      this.getIndigoUrl(title.isbn);
      this.getAmazonUrl(title.isbn, title.format.code);
    }
  }

  getAmazonUrl(isbn, formatCode) {
    const url = '/api/prhc/getAsin/' + isbn;

    if (this.amazonUrls[formatCode]) {
      this.retailerTypes.map(retailerType => {
        if (retailerType.formatCodes.indexOf(formatCode) >= 0) {
          retailerType.retailers.map(retailer => {
            if (retailer.name === 'Amazon') {
              retailer.seoFriendlyUrl = this.amazonUrls[formatCode];
            }
          });
        }
      });
    } else {
      return this.http.get(url)
        .map(res => res)
        .subscribe(res => {
          if (res[0] && res[0].DetailPageURL) {
            this.retailerTypes.map(retailerType => {
              if (retailerType.formatCodes.indexOf(formatCode) >= 0) {
                retailerType.retailers.map(retailer => {
                  if (retailer.name === 'Amazon') {
                    retailer.seoFriendlyUrl = res[0].DetailPageURL;
                    this.amazonUrls[formatCode] = retailer.seoFriendlyUrl;
                  }
                });
              }
            });
          }
        });
    }
  }

  getOtherUrls(isbn, title, author) {
    const keyword = title.split(' ').join('+') + ' + ' + author.split(' ').join('+');
    const koboUrl = 'https://click.linksynergy.com/deeplink' +
      '?id=lMh2Xiq9xN0&mid=37219&murl=https%3A%2F%2Fwww.kobo.com%2Fca%2Fen%2Fsearch%3FQuery%3D' +
      isbn;
    const audibleUrl = 'https://www.audible.ca/search/ref=a_hp_tseft' +
      '?advsearchKeywords=' + keyword +
      '&filterby=field-keywords';
    const googleUrl = 'http://books.google.com/books?pubid=21000000000124596&q=' + isbn;

    this.retailerTypes.map(retailerType => {
      if (
        retailerType.name === 'eBook' ||
        retailerType.name === 'Audio'
      ) {
        retailerType.retailers.map(retailer => {
          if (retailer.name === 'Kobo') {
            retailer.seoFriendlyUrl = koboUrl;
          }
          if (retailer.name === 'Audible') {
            retailer.seoFriendlyUrl = audibleUrl;
          }
          if (retailer.name === 'Google' && retailerType.name === 'Audio') {
            retailer.seoFriendlyUrl = googleUrl;
          }
        });
      }
    });
  }

  getIndigoUrl(isbn) {
    const url = '/api/prhc/getIndigo/' + isbn;

    return this.http.get(url)
      .map(res => res)
      .subscribe(res => {
        let indigoUrl;
        if (
          res['response'] &&
          res['response'].products &&
          res['response'].products.product
        ) {
          indigoUrl = res['response'].products.product['buy-url'];

          this.retailerTypes.map(retailerType => {
            if (retailerType.name === 'Physical') {
              retailerType.retailers.map(retailer => {
                if (retailer.name === 'Chapters-Indigo') {
                  retailer.seoFriendlyUrl = indigoUrl;
                }
              });
            }
          });
        }
      });
  }

  getiTunesUrl(isbn, format, title, author) {
    const affiliateId = '10l3QC';
    const url = '/api/prhc/getiTunes/' + isbn;
    const params = {
      'type': format === 'eBook' ? 'ebook' : 'audiobook',
      'term': title.split(' ').join('+') + ' + ' + author.split(' ').join('+'),
    };

    return this.http.get(url, getHttpOptions(params))
      .map(res => res)
      .subscribe(res => {
        if (res && res['trackViewUrl']) {
          const itunesUrl = res['trackViewUrl'] + '&at=' + affiliateId;
          this.retailerTypes.map(retailerType => {
            if (retailerType.name === 'eBook') {
              retailerType.retailers.map(retailer => {
                if (retailer.name === 'iBooks') {
                  retailer.seoFriendlyUrl = itunesUrl;
                }
              });
            }
          });
        }
      });
  }

  getGoogleUrl(isbn) {
    const url = '/api/prhc/getGoogle/' + isbn;
    return this.http.get(url, getHttpOptions({}))
      .map(res => res)
      .subscribe(res => {
        if (
          res['response'] &&
          res['response'].items &&
          res['response'].items.length &&
          res['response'].items[0].id
        ) {
          this.retailerTypes.map(retailerType => {
            if (retailerType.name === 'eBook') {
              retailerType.retailers.map(retailer => {
                if (retailer.name === 'Google') {
                  retailer.seoFriendlyUrl =
                    'https://play.google.com/store/books/details?id=' +
                    res['response'].items[0].id;
                }
              });
            }
          });
        }
      });
  }
}
