<?php

namespace Drupal\enhanced_api\Plugin;

use Drupal\enhanced_api\Plugin\EnhancedApiRequest;
/**
 * Title-specific request handler
 */
class EnhancedApiRequestWorkViews extends EnhancedApiRequest {
  function __construct($base_field, $id, $method) {
    parent::__construct($base_field, $id, $method);

    if (isset($method) && $method == 'views/product-display') {
      $this->params['catSetId'] = 'CN';
      $product_codes = [
        '956',
        '07X',
        '95A',
        '9CA',
        'ABL',
        'A7R',
        '970',
        '9QL',
      ];
      $this->addMultiIds($product_codes, 'ignoreProductType');
    }
  }

  function parse($joins) {
    $works = null;
    switch ($this->method) {
      case 'views/also-in/author':
        $works = $this->response->data->titles;
        break;

      case 'views/also-in/series':
        $works = $this->response->data->series;
        break;

      case 'views/list-display':
      case 'views/also-purchased':
      case 'views/series-display':
        $works = $this->response->data->works;
        break;

      case 'views/product-display':
        $works[] = $this->response->data;
        break;
    }

    $results = array();
    foreach ($works as $work) {
      // cover image
      if (isset($work->isbn)) {
        $work->cover = $this->get_image($work->isbn);
      }

      if (isset($work->_links)) {
        foreach ($work->_links as $link) {
          if ($link->rel == 'icon') {
            $work->cover = $link->href;
          }
        }
      }

      if (isset($work->frontlistiestTitle)) {
        $work->cover = $this->get_image($work->frontlistiestTitle->isbn);
      }

      if (isset($work->isbn)) {
        $work->cover = $this->get_image($work->isbn);
      }

      // praise
      if (isset($work->praises)) {
        foreach ($work->praises as $isbn => $praise) {
          if ($isbn == $work->frontlistiestTitle->isbn) {
            $work->praise = $praise;
            // unset($work->praises);
          }
        }
      }

      // awards
      if (isset($work->bookAwards)) {
        foreach ($work->bookAwards as $type => $awards) {
          foreach ($awards as $award) {
            if ($award->ean == $this->id) {
              if ($type == 'longlist') {
                $work->awards->longlists[] = $award;
              }
              if ($type == 'winner') {
                $work->awards->winners[] = $award;
              }
              unset($work->bookAwards);
            }
          }
        }
      }

      // current title details
      if (isset($work->frontlistiestTitle)) {
        // if ($isbn == $this->id) {
        // Cover image
        $work->frontlistiestTitle->cover = $this->get_image($work->frontlistiestTitle->isbn);

        // onSaleDate timestamp
        if (isset($work->frontlistiestTitle->onSaleDate)) {
          $work->frontlistiestTitle->onSaleTimestamp =
            strtotime($work->frontlistiestTitle->onSaleDate->date . ' ' .
            $work->frontlistiestTitle->onSaleDate->timezone);
        }

        // authors
        if (isset($work->frontlistiestTitle->contributors)) {
          $authors = array();
          foreach ($work->frontlistiestTitle->contributors as $contributor) {
            if ($contributor->roleCode == 'A') {
              $authors[] = $contributor->display;
            }
          }

          // one author
          if (count($authors) < 2) {
            $work->author = implode('', $authors);
          }

          // two authors
          elseif (count($authors) == 2) {
            $work->author = implode(' and ', $authors);
          }

          // more than two authors
          else {
            foreach($authors as $key => $author) {
              if ($key == 0) {
                $work->author = $author;
              }
              else if ($key > 0 && $key < count($authors) - 1) {
                $work->author .= ', ' . $author;
              }
              else if ($key == count($authors) - 1) {
                $work->author .= ' and ' . $author;
              }
              else {
                $work->author .= $author;
              }
            }
          }
        }

        $work = (object) array_merge((array) $work, (array) $work->frontlistiestTitle);

        // parse other titles
        forEach($work->formats as $key => $formats) {
          forEach($formats as $format) {
            // cover image
            $format->cover = $this->get_image($format->isbn);
            // contributors
            $formatContributors = $format->contributors;
            unset($format->contributors);
            $format->contributors = array();
            foreach ($formatContributors as $formatContributor) {
              $format->contributors[] = $formatContributor;
            }

            $work->otherFormats[] = $format;
          }
        }

        // remove other titles
        unset($work->formats);
      }

      // contributors
      if (isset($work->contributors)) {
        $contributors = $work->contributors;
        unset($work->contributors);
        $work->contributors = array();
        foreach ($contributors as $contributor) {
          $work->contributors[] = $contributor;
        }
      }

      $results[] = $work;
    }

    return $results;
  }
}
