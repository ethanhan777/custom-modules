<?php

namespace Drupal\enhanced_api\Plugin;

use Drupal\enhanced_api\Plugin\EnhancedApiRequest;
/**
 * Title-specific request handler
 */
class EnhancedApiRequestDivision extends EnhancedApiRequest {
  function parse($joins) {
    if (is_null($this->method)) {
      $divisions = $this->response->data->divisions;
    }
    else {
      $divisions = $this->response->data->{$this->method};
    }

    $results = array();

    foreach ($divisions as $division) {
      $results[] = $division;
    }

    return $results;
  }
}
