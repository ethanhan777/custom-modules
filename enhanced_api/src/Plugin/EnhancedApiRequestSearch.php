<?php

namespace Drupal\enhanced_api\Plugin;

use Drupal\enhanced_api\Plugin\EnhancedApiRequest;
/**
 * Title-specific request handler
 */
class EnhancedApiRequestSearch extends EnhancedApiRequest {
  function __construct($base_field, $id, $method) {
    parent::__construct($base_field, $id, $method);

    $this->params['companyCode'] = 'R_H';
  }

  function parse($joins) {
    if ($this->method == 'predictive') {
      $results = $this->response->data->results;
    }
    else {
      $results = $this->response->data;
      if (isset($this->response->params->q)) {
        $results->query = $this->response->params->q;
      }
    }

    return $results;
  }

  function getFacet($resp) {
    $facets = null;
    if (isset($this->response->data->facets)) {
      $facets = $this->response->data->facets;
    }

    return $facets;
  }
}
