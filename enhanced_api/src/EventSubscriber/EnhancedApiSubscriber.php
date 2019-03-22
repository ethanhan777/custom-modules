<?php

namespace Drupal\enhanced_api\EventSubscriber;

use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\GetResponseEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Drupal\enhanced_api\Plugin\EnhancedApiRequest;

class EnhancedApiSubscriber implements EventSubscriberInterface {

  public function checkForRedirection(GetResponseEvent $event) {
    $baseUrl = $event->getRequest()->getBaseUrl();
    $attr = $event->getRequest()->attributes;

    if (
      $attr !== null &&
      $attr->get('base_route_name') == 'page_manager.page_view_author_view' &&
      $attr->get('author_id') !== null
    ) {
      $client_source_id = $this->getAuthorClientSourceId($attr->get('author_id'));

      if ($client_source_id > 0) {
        $event->setResponse(new RedirectResponse($baseUrl . '/authors/' . $client_source_id));
      }
    }
  }

  /**
   * {@inheritdoc}
   */
  static function getSubscribedEvents() {
    $events[KernelEvents::REQUEST][] = array('checkForRedirection');
    return $events;
  }

  public function getAuthorClientSourceId($author_id) {
    $authorsReq = EnhancedApiRequest::factory('authors', $author_id, '', 'enhanced_api_author');
    $authorsReq->setFilter('suppressLinks', 'true');
    $authorsReq->setFilter('suppressRecordCount', 'true');
    $authorsReq->setFilter('returnEmptyLists', 'true');
    $resp = $authorsReq->execute();

    if (!isset($resp->response->data)) {
      return 0;
    }

    $authors = $resp->parse([]);

    if (isset($authors[0]->clientSourceId) && $authors[0]->clientSourceId > 0) {
      return $authors[0]->clientSourceId;
    } else {
      return 0;
    }
  }

}
