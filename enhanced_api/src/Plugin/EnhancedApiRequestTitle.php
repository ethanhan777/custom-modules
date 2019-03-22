<?php

namespace Drupal\enhanced_api\Plugin;

use Drupal\enhanced_api\Plugin\EnhancedApiRequest;
/**
 * Title-specific request handler
 */
class EnhancedApiRequestTitle extends EnhancedApiRequest {
  function parse($joins) {
    $results = array();

    if (isset($this->response->data->titles)) {
      $titles = $this->response->data->titles;
    }
    else if ($this->method == 'work') {
      $titles = $this->response->data->works;
    }
    else {
      if ($this->method == 'weblinks') {
        $titles = $this->response->data->webLinks;
      } elseif ($this->method == 'work') {
        $titles = $this->response->data->works;
      } else {
        $titles = $this->response->data->{$this->method};
      }
      return $titles;
    }

    foreach ($titles as $title) {
      // Canadian price
      if (isset($title->price)){
        foreach($title->price as $price) {
          if ($price->currencyCode == 'CAD') {
            $title->canPrice =  $price->amount;
            $title->currency =  $price->currencyCode;
          }
        }
      }

      // cover image
      if (isset($title->isbn)) {
        $title->cover = $this->get_image($title->isbn);
      } else {
        $title->cover = $this->get_image($this->id);
      }

      $results[] = $title;
    }

    return $results;
  }

  function parseToken() {
    $results = array();
    $titles = $this->response->data->titles;

    foreach ($titles as $title) {
      $title->id = (isset($title->isbn)) ? $title->isbn : null;
      $title->url = (isset($title->seoFriendlyUrl)) ? $title->seoFriendlyUrl : null;
      $title->title = (isset($title->title)) ? $title->title : null;

      foreach ($title->_links as $key => $values) {
        if (isset($values->rel) && $values->rel == 'icon') {
          $title->image = $values->href;
          break;
        }
      }

      $results[] = $title;
    }

    return $results;
  }
}
