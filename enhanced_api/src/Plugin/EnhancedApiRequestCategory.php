<?php

namespace Drupal\enhanced_api\Plugin;

use Drupal\enhanced_api\Plugin\EnhancedApiRequest;
/**
 * Title-specific request handler
 */
class EnhancedApiRequestCategory extends EnhancedApiRequest {
  function parse($joins) {
    if (isset($this->response->data->categories)) {
      $categories = $this->response->data->categories;
    }
    else {
      $categories = $this->response->data->{$this->method};
    }

    $results = array();

    foreach ($categories as $category) {
      // cover image
      if (isset($category->_links)) {
        foreach ($category->_links as $link) {
          if ($link->rel == 'icon') {
            $category->cover = $link->href;
          }
        }
      }
      if (isset($category->isbn)) {
        $category->cover = $this->get_image($category->isbn);
      }

      $results[] = $category;
    }

    return $results;
  }
}
