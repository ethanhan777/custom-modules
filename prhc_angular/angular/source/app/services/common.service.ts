/**
 * check if string is valid url.
 */
export function isValidUrl(str) {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ); // fragment locator

  return pattern.test(str);
}

export function isValidEmail(email) {
  const pattern = new RegExp(
    '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$'
  );
  return pattern.test(email);
}

/**
 * converts string to url friendly string.
 */
export function convertStrToUrl(str) {
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  const from =
    'ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;';
  const to =
    'AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------';
  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes

  return str;
}

/**
 * truncate long text
 *
 * @param {string} long text
 * @param {charLimit} integer value of charactor limit
 */
export function truncateString(string, charLimit) {
  let subString = '';
  if (string) {
    if (string.length <= charLimit) {
      subString = string.replace(/<\/?[bB]>/g, '');
      return subString;
    } else {
      subString = string.substr(0, charLimit - 1).replace(/<\/?[bB]>/g, '');
      return subString.substr(0, subString.lastIndexOf(' ')) + '&hellip;';
    }
  }

  return subString;
}

export function removeBoldTags(string) {
  return string.replace(/<\/?[bB]>/g, '');
}

/**
 * get province or state's full name by code
 *
 * @param {code} province or state code
 */
export function getProvinceName(code) {
  const provinces = [
    'Alberta',
    'British Columbia',
    'Manitoba',
    'New Brunswick',
    'Newfoundland and Labrador',
    'Nova Scotia',
    'Northwest Territories',
    'Nunavut',
    'Ontario',
    'Prince Edward Island',
    'Quebec',
    'Saskatchewan',
    'Yukon',
    'Armed Forces America',
    'Armed Forces',
    'Armed Forces Pacific',
    'Alaska',
    'Alabama',
    'Arkansas',
    'Arizona',
    'California',
    'Colorado',
    'Connecticut',
    'Washington DC',
    'Delaware',
    'Florida',
    'Georgia',
    'Guam',
    'Hawaii',
    'Iowa',
    'Idaho',
    'Illinois',
    'Indiana',
    'Kansas',
    'Kentucky',
    'Louisiana',
    'Massachusetts',
    'Maryland',
    'Maine',
    'Michigan',
    'Minnesota',
    'Missouri',
    'Mississippi',
    'Montana',
    'North Carolina',
    'North Dakota',
    'Nebraska',
    'New Hampshire',
    'New Jersey',
    'New Mexico',
    'Nevada',
    'New York',
    'Ohio',
    'Oklahoma',
    'Oregon',
    'Pennsylvania',
    'Puerto Rico',
    'Rhode Island',
    'South Carolina',
    'South Dakota',
    'Tennessee',
    'Texas',
    'Utah',
    'Virginia',
    'Virgin Islands',
    'Vermont',
    'Washington',
    'Wisconsin',
    'West Virginia',
    'Wyoming',
  ];
  const provinceCodes = [
    'AB',
    'BC',
    'MB',
    'NB',
    'NL',
    'NS',
    'NT',
    'NU',
    'ON',
    'PE',
    'QC',
    'SK',
    'YT',
    'AA',
    'AE',
    'AP',
    'AK',
    'AL',
    'AR',
    'AZ',
    'CA',
    'CO',
    'CT',
    'DC',
    'DE',
    'FL',
    'GA',
    'GU',
    'HI',
    'IA',
    'ID',
    'IL',
    'IN',
    'KS',
    'KY',
    'LA',
    'MA',
    'MD',
    'ME',
    'MI',
    'MN',
    'MO',
    'MS',
    'MT',
    'NC',
    'ND',
    'NE',
    'NH',
    'NJ',
    'NM',
    'NV',
    'NY',
    'OH',
    'OK',
    'OR',
    'PA',
    'PR',
    'RI',
    'SC',
    'SD',
    'TN',
    'TX',
    'UT',
    'VA',
    'VI',
    'VT',
    'WA',
    'WI',
    'WV',
    'WY',
  ];

  if (provinceCodes.indexOf(code) > -1) {
    return provinces[provinceCodes.indexOf(code)];
  } else {
    return code;
  }
}

export function getVideoKey(url) {
  const regExpVM = /(?:http?s?:\/\/)?(?:www\.)?(?:vimeo\.com)\/?(.+)/g;
  const regExpYT = /(?:http?s?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g;
  const video = {
    youtube: undefined,
    vimeo: undefined,
  };
  if (regExpYT.test(url)) {
    video.youtube = url.replace(regExpYT, '$1');
  } else if (regExpVM.test(url)) {
    video.vimeo = url.replace(regExpVM, '$1');
  }
  return video;
}

export function getAudioKey(url) {
  const regExpSC = /(?:http?s?:\/\/)?(?:www\.)?(?:soundcloud\.com)\/?(.+)/g;
  const audio = {
    soundcloud: undefined,
  };
  if (regExpSC.test(url)) {
    audio.soundcloud = url.replace(regExpSC, '$1');
  }
  return audio;
}


export function convertYoutubeVideo(url, width?, height?) {
  width = width ? width : 420;
  height = height ? height : 345;

  const regExpVM = /(?:http?s?:\/\/)?(?:www\.)?(?:vimeo\.com)\/?(.+)/g;
  const regExpYT = /(?:http?s?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g;

  if (regExpYT.test(url)) {
    const replacement =
      '<iframe width="420" height="345" src="http://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe>';
    return url.replace(regExpYT, replacement);
  } else if (regExpVM.test(url)) {
    const replacement =
      // tslint:disable-next-line:max-line-length
      '<iframe width="420" height="345" src="//player.vimeo.com/video/$1" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
    return url.replace(regExpVM, replacement);
  } else {
    return false;
  }
}

export function capitalizeString(string) {
  let formattedString = '';
  if (string) {
    const words = string.split('-');
    formattedString = string.charAt(0).toUpperCase() + string.slice(1);

    if (words && words.length > 1) {
      for (const key in words) {
        if (words.hasOwnProperty(key)) {
          words[key] = words[key].charAt(0).toUpperCase() + words[key].slice(1);
        }
      }
      formattedString = words.join('-');
    }
  }
  return formattedString;
}

export function convertToHumanType(person) {
  // Set the pronoun to change based on selected relationship
  let pronoun: string;

  if (person === 'myself' || person === 'Myself') {
    pronoun = 'you';
  } else if ( person === 'stranger' || person === 'Stranger') {
    pronoun = 'the ' + person;
  } else if ( person === 'It\'s Complicated' || person === 'it\'s complicated') {
    pronoun = person;
  } else {
    pronoun = 'your ' + person;
  }

  return pronoun;
}

// Check for decimal places  in price so there are always 2 decimal points
export function checkPrice(amount) {
  const decimalCheck = amount - Math.floor(amount);
  let updatedAmount: string;
  if (decimalCheck === 0) {
      updatedAmount = amount + '.00';
  } else if (decimalCheck === 0.5) {
    updatedAmount = amount + '0';
  } else {
     updatedAmount = amount;
  }
  return `$${updatedAmount}`;
}

export function decodeHTML(string) {
  const tempElement = document.createElement('div');
  tempElement.innerHTML = string;
  return tempElement.innerText;
}

export const provinceStates = [
  {
    short: 'AL',
    name: 'Alabama',
    country: 'US'
  },
  {
    short: 'AK',
    name: 'Alaska',
    country: 'US'
  },
  {
    short: 'AZ',
    name: 'Arizona',
    country: 'US'
  },
  {
    short: 'AR',
    name: 'Arkansas',
    country: 'US'
  },
  {
    short: 'CA',
    name: 'California',
    country: 'US'
  },
  {
    short: 'CO',
    name: 'Colorado',
    country: 'US'
  },
  {
    short: 'CT',
    name: 'Connecticut',
    country: 'US'
  },
  {
    short: 'DC',
    name: 'Washington D.C.',
    country: 'US'
  },
  {
    short: 'DE',
    name: 'Delaware',
    country: 'US'
  },
  {
    short: 'FL',
    name: 'Florida',
    country: 'US'
  },
  {
    short: 'GA',
    name: 'Georgia',
    country: 'US'
  },
  {
    short: 'HI',
    name: 'Hawaii',
    country: 'US'
  },
  {
    short: 'ID',
    name: 'Idaho',
    country: 'US'
  },
  {
    short: 'IL',
    name: 'Illinois',
    country: 'US'
  },
  {
    short: 'IN',
    name: 'Indiana',
    country: 'US'
  },
  {
    short: 'IA',
    name: 'Iowa',
    country: 'US'
  },
  {
    short: 'KS',
    name: 'Kansas',
    country: 'US'
  },
  {
    short: 'KY',
    name: 'Kentucky',
    country: 'US'
  },
  {
    short: 'LA',
    name: 'Louisiana',
    country: 'US'
  },
  {
    short: 'ME',
    name: 'Maine',
    country: 'US'
  },
  {
    short: 'MD',
    name: 'Maryland',
    country: 'US'
  },
  {
    short: 'MA',
    name: 'Massachusetts',
    country: 'US'
  },
  {
    short: 'MI',
    name: 'Michigan',
    country: 'US'
  },
  {
    short: 'MN',
    name: 'Minnesota',
    country: 'US'
  },
  {
    short: 'MS',
    name: 'Mississippi',
    country: 'US'
  },
  {
    short: 'MO',
    name: 'Missouri',
    country: 'US'
  },
  {
    short: 'MT',
    name: 'Montana',
    country: 'US'
  },
  {
    short: 'NE',
    name: 'Nebraska',
    country: 'US'
  },
  {
    short: 'NV',
    name: 'Nevada',
    country: 'US'
  },
  {
    short: 'NH',
    name: 'New Hampshire',
    country: 'US'
  },
  {
    short: 'NJ',
    name: 'New Jersey',
    country: 'US'
  },
  {
    short: 'NM',
    name: 'New Mexico',
    country: 'US'
  },
  {
    short: 'NY',
    name: 'New York',
    country: 'US'
  },
  {
    short: 'NC',
    name: 'North Carolina',
    country: 'US'
  },
  {
    short: 'ND',
    name: 'North Dakota',
    country: 'US'
  },
  {
    short: 'OH',
    name: 'Ohio',
    country: 'US'
  },
  {
    short: 'OK',
    name: 'Oklahoma',
    country: 'US'
  },
  {
    short: 'OR',
    name: 'Oregon',
    country: 'US'
  },
  {
    short: 'PA',
    name: 'Pennsylvania',
    country: 'US'
  },
  {
    short: 'RI',
    name: 'Rhode Island',
    country: 'US'
  },
  {
    short: 'SC',
    name: 'South Carolina',
    country: 'US'
  },
  {
    short: 'SD',
    name: 'South Dakota',
    country: 'US'
  },
  {
    short: 'TN',
    name: 'Tennessee',
    country: 'US'
  },
  {
    short: 'TX',
    name: 'Texas',
    country: 'US'
  },
  {
    short: 'UT',
    name: 'Utah',
    country: 'US'
  },
  {
    short: 'VT',
    name: 'Vermont',
    country: 'US'
  },
  {
    short: 'VA',
    name: 'Virginia',
    country: 'US'
  },
  {
    short: 'WA',
    name: 'Washington',
    country: 'US'
  },
  {
    short: 'WV',
    name: 'West Virginia',
    country: 'US'
  },
  {
    short: 'WI',
    name: 'Wisconsin',
    country: 'US'
  },
  {
    short: 'WY',
    name: 'Wyoming',
    country: 'US'
  },
  {
    short: 'AS',
    name: 'American Samoa',
    country: 'US'
  },
  {
    short: 'GU',
    name: 'Guam',
    country: 'US'
  },
  {
    short: 'MP',
    name: 'Northern Mariana Islands',
    country: 'US'
  },
  {
    short: 'PR',
    name: 'Puerto Rico',
    country: 'US'
  },
  {
    short: 'UM',
    name: 'United States Minor Outlying Islands',
    country: 'US'
  },
  {
    short: 'VI',
    name: 'Virgin Islands',
    country: 'US'
  },
  {
    short: 'AB',
    name: 'Alberta',
    country: 'CA'
  },
  {
    short: 'BC',
    name: 'British Columbia',
    country: 'CA'
  },
  {
    short: 'MB',
    name: 'Manitoba',
    country: 'CA'
  },
  {
    short: 'NB',
    name: 'New Brunswick',
    country: 'CA'
  },
  {
    short: 'NL',
    name: 'Newfoundland and Labrador',
    country: 'CA'
  },
  {
    short: 'NS',
    name: 'Nova Scotia',
    country: 'CA'
  },
  {
    short: 'NU',
    name: 'Nunavut',
    country: 'CA'
  },
  {
    short: 'NT',
    name: 'Northwest Territories',
    country: 'CA'
  },
  {
    short: 'ON',
    name: 'Ontario',
    country: 'CA'
  },
  {
    short: 'PE',
    name: 'Prince Edward Island',
    country: 'CA'
  },
  {
    short: 'QC',
    name: 'Quebec',
    country: 'CA'
  },
  {
    short: 'SK',
    name: 'Saskatchewan',
    country: 'CA'
  },
  {
    short: 'YT',
    name: 'Yukon',
    country: 'CA'
  },
];


