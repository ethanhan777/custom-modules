<?php

namespace Drupal\enhanced_api\Plugin;

use Drupal\enhanced_api\Plugin\EnhancedApiRequest;
/**
 * Title-specific request handler
 */
class EnhancedApiRequestAuthorViews extends EnhancedApiRequest {
  function parse($joins) {
    $results = array();
    $author_parsed = new \stdClass();
    $authors = null;
    switch ($this->method) {
      case 'views/list-display':
        $authors = $this->response->data->authors;
        break;

      case 'views/author-display':
        $authors[] = $this->response->data;
        break;

      case 'views/also-purchased':
        return $this->response->data->works;
        break;
    }

    foreach ($authors as $author) {
      $author->photo = $this->get_image($author->authorId, 'authors');
      $results[] = $author;
    }

    return $results;
  }
}
