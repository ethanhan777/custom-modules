<?php

namespace Drupal\enhanced_api\Plugin;

use Drupal\enhanced_api\Plugin\EnhancedApiRequest;
/**
 * Title-specific request handler
 */
class EnhancedApiRequestEvent extends EnhancedApiRequest {
  function parse($joins) {
    if (empty($this->method)) {
      $events = $this->response->data->events;
    }
    else {
      $events = isset($this->response->data->{$this->method}) ? $this->response->data->{$this->method} : null;
    }

    $results = array();
    if ($events) {
      foreach ($events as $event) {
        if (isset($event->_embeds)) {
          foreach ($event->_embeds as $embed) {
            if (isset($embed->authors)) {
              $event->authors = $embed->authors;
              $event->eventName = $event->authors[0]->display . ' at ' . $event->location;
            } elseif (isset($embed->titles)) {
              $event->titles = $embed->titles;
            }
          }
        }
        elseif (isset($this->response->data->_embeds)) {
          foreach ($this->response->data->_embeds as $embed) {
            if (isset($embed->authors)) {
              $event->authors = $embed->authors;
              $event->eventName = $event->authors[0]->display . ' at ' . $event->location;
            } elseif (isset($embed->titles)) {
              $event->titles = $embed->titles;
            }
          }
        }

        $results[] = $event;
      }
    }

    return $results;
  }

  function parseToken() {
    $results = array();
    $events = $this->response->data->events;

    foreach ($events as $event) {
      $event->id = (isset($event->eventId)) ? $event->eventId : null;
      $event->url = (isset($event->eventId)) ? '/events/' . $event->eventId : null;
      $event->title = (isset($event->location)) ? $event->location : null;

      foreach ($event->_links as $key => $values) {
        if (isset($values->rel) && $values->rel == 'icon') {
          $event->image = $values->href;
          break;
        }
        else {
          //default image? or empty?
          $event->image = '';
        }
      }

      $results[] = $event;
    }

    return $results;
  }
}
