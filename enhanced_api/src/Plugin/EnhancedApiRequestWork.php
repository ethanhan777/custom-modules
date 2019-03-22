<?php

namespace Drupal\enhanced_api\Plugin;

use Drupal\enhanced_api\Plugin\EnhancedApiRequest;
/**
 * Title-specific request handler
 */
class EnhancedApiRequestWork extends EnhancedApiRequest {
  function __construct($base_field, $id, $method) {
    parent::__construct($base_field, $id, $method);

    if (isset($method) && $method == 'views/product-display') {
      $this->params['catSetId'] = 'CN';
    }
  }

  function parse($joins) {
    if (isset($this->response->data->works)) {
      $works = $this->response->data->works;
    }
    else {
      if ($this->method == 'weblinks') {
        $works = $this->response->data->webLinks;
      }
      else {
        $works = $this->response->data->{$this->method};
      }
      return $works;
    }

    $results = array();

    foreach ($works as $work) {
      // Canadian price
      if (isset($work->price)) {
        foreach($work->price as $price) {
          if ($price->currencyCode == 'CAD') {
            $work->canPrice =  $price->amount;
            $work->currency =  $price->currencyCode;
          }
        }
      }

      // onSaleDate timestamp
      if (isset($work->onsale)) {
        $work->onSaleTimestamp = strtotime($work->onsale);
      }

      // cover image
      if (isset($work->_links)) {
        foreach ($work->_links as $link) {
          if ($link->rel == 'icon') {
            $work->cover = $link->href;
          }
        }
      }
      if (isset($work->isbn)) {
        $work->cover = $this->get_image($work->isbn);
      }

      $results[] = $work;
    }

    return $results;
  }

  function parseToken() {
    $results = array();
    $works = $this->response->data->works;

    foreach ($works as $work) {
      $work->id = (isset($work->workId)) ? $work->workId : null;
      $work->url = (isset($work->seoFriendlyUrl)) ? $work->seoFriendlyUrl : null;
      $work->title = (isset($work->title)) ? $work->title : null;
      $work->author = (isset($work->author)) ? $work->author : null;

      foreach ($work->_links as $key => $values) {
        if (isset($values->rel) && $values->rel == 'icon') {
          $work->image = $values->href;
          break;
        }
      }

      $results[] = $work;
    }

    return $results;
  }
}
