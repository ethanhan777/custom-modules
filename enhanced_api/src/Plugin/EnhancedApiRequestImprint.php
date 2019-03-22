<?php

namespace Drupal\enhanced_api\Plugin;

use Drupal\enhanced_api\Plugin\EnhancedApiRequest;
/**
 * Title-specific request handler
 */
class EnhancedApiRequestImprint extends EnhancedApiRequest {
  function parse($joins) {
    $imprints = $this->response->data->imprints;
    $results = array();

    foreach ($imprints as $imprint) {
      $results[] = $imprint;
    }

    return $results;
  }
}
