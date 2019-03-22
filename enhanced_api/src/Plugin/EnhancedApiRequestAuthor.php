<?php

namespace Drupal\enhanced_api\Plugin;

use Drupal\enhanced_api\Plugin\EnhancedApiRequest;
/**
 * Title-specific request handler
 */
class EnhancedApiRequestAuthor extends EnhancedApiRequest {
  function parse($joins) {
    if (isset($this->response->data->authors)) {
      $authors = $this->response->data->authors;
    }
    else {
      if ($this->method == 'weblinks') {
        $authors = $this->response->data->webLinks;
      }
      else {
        $authors = isset($this->response->data->{$this->method}) ? $this->response->data->{$this->method} : null;
      }
      return $authors;
    }

    $results = array();
    foreach ($authors as $author) {
      $author->photo = $this->get_image($author->authorId, 'authors');
      $results[] = $author;
    }

    return $results;
  }

  function parseViews() {
    //make machine readable name for keys of response data.
    // foreach ($authors as &$author) {
    //   foreach ($authors as $field_name => $value) {
    //     $field_name = strtolower(preg_replace("/[A-Z]/", "_$0", $field_name));
    //   }
    // }
  }

  function parseToken() {
    if (isset($this->response->data->authors)) {
      $authors = $this->response->data->authors;
    }

    $results = array();
    foreach ($authors as $author) {
      $author->id = (isset($author->authorId)) ? $author->authorId : null;
      $author->url = (isset($author->seoFriendlyUrl)) ? $author->seoFriendlyUrl : null;
      $author->title = (isset($author->display)) ? $author->display : null;
      $author->image = $this->get_image($author->authorId, 'authors');

      $results[] = $author;
    }

    return $results;
  }
}
