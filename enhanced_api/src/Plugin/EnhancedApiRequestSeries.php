<?php

namespace Drupal\enhanced_api\Plugin;

use Drupal\enhanced_api\Plugin\EnhancedApiRequest;
/**
 * Title-specific request handler
 */
class EnhancedApiRequestSeries extends EnhancedApiRequest {
  function parse($joins) {
    if (isset($this->response->data->series)) {
      $series = $this->response->data->series;
    }
    else {
      $series = $this->response->data->{$this->method};
    }

    $results = array();
    foreach ($series as $set) {
      // Canadian price instead of US
      if (isset($set->price)) {
        foreach ($set->price as $price) {
          if ($price->currencyCode == 'CAD') {
            $set->price = $price->amount;
          }
        }
      }

      // content image parsing
      if ($this->method == 'titles') {
        $set->cover = $this->get_image($set->isbn);
      }
      elseif ($this->method == 'authors') {
        $set->photo = $this->get_image($set->authorId, 'authors');
      }
      elseif ($this->method == 'works') {
        foreach ($set->_links as $link) {
          if ($link->rel == 'icon') {
            $set->cover = $link->href;
          }
        }
      }
      $results[] = $set;
    }

    return $results;
  }
}


//
