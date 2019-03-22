<?php

namespace Drupal\enhanced_api\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Drupal\enhanced_api\Plugin\EnhancedApiRequest;
use Drupal\enhanced_api\Plugin\EnhancedApiRequestTitle;
use Drupal\Core\Link;
use Drupal\Core\Url;
use Drupal\Component\Utility\UrlHelper;

Class EnhancedApiController extends ControllerBase {
  // book redirect
  public function books($work_id, $title = null) {
    // $this->getCurrentPath();
    $route_name = 'page_manager.page_view_book_view_book_view-panels_variant-0';
    return $this->books_redirect($work_id, $title, $route_name);
  }

  // book excerpt and reading guide redirects
  public function books_ex($work_id, $title) {
    $route_name = 'page_manager.page_view_excerpt_view_excerpt_view-panels_variant-0';
    return $this->books_redirect($work_id, $title, $route_name);
  }
  public function books_rg($work_id, $title) {
    $route_name = 'page_manager.page_view_reading_guide_view_reading_guide_view-panels_variant-0';
    return $this->books_redirect($work_id, $title, $route_name);
  }

  // book format redirects
  public function books_paperback($work_id, $title) {
    $route_name = 'page_manager.page_view_book_view_book_view-panels_variant-0';
    return $this->books_redirect($work_id, $title, $route_name, 'paperback');
  }
  public function books_hardcover($work_id, $title) {
    $route_name = 'page_manager.page_view_book_view_book_view-panels_variant-0';
    return $this->books_redirect($work_id, $title, $route_name, 'hardcover');
  }
  public function books_ebook($work_id, $title) {
    $route_name = 'page_manager.page_view_book_view_book_view-panels_variant-0';
    return $this->books_redirect($work_id, $title, $route_name, 'ebook');
  }
  public function books_audio($work_id, $title) {
    $route_name = 'page_manager.page_view_book_view_book_view-panels_variant-0';
    return $this->books_redirect($work_id, $title, $route_name, 'audio');
  }
  public function books_merchandise($work_id, $title) {
    $route_name = 'page_manager.page_view_book_view_book_view-panels_variant-0';
    return $this->books_redirect($work_id, $title, $route_name, 'merchandise');
  }
  public function books_boxedset($work_id, $title) {
    $route_name = 'page_manager.page_view_book_view_book_view-panels_variant-0';
    return $this->books_redirect($work_id, $title, $route_name, 'boxedset');
  }
  public function books_boardbook($work_id, $title) {
    $route_name = 'page_manager.page_view_book_view_book_view-panels_variant-0';
    return $this->books_redirect($work_id, $title, $route_name, 'boardbook');
  }

  private function books_redirect($work_id, $title, $route_name, $format = null) {
    //Redirect to penels Book view page with frontlistest ISBN
    $isbn = null;
    $title = '';
    $request = EnhancedApiRequest::factory('works', $work_id, 'views/product-display', 'enhanced_api_work');
    $join = [];
    $titles = [];
    $resp = $request->execute();

    if (!isset($resp->response->data)) {
      throw new NotFoundHttpException();
    }

    $work = $resp->parse($join);

    if (isset($work[0]) && isset($work[0]->otherFormats)) {
      foreach($work[0]->otherFormats as $f) {
          $titles[] = $f;
      }
    }

    foreach ($titles as $title_obj) {
      if (is_null($format)) {
        if ($title_obj->frontlistiestSeq == 1) {
          $title = explode('/', $title_obj->seoFriendlyUrl)[3];
          $isbn = $title_obj->isbn;
          break;
        }
      }
      else {
        switch ($format) {
          case 'boxedset':
            $format = 'boxed set';
            break;
          case 'boardbook' :
            $format = 'board book';
            break;
        }

        if (strtolower($title_obj->format->family) == $format) {
          $title = explode('/', $title_obj->seoFriendlyUrl)[3];
          $isbn = $title_obj->isbn;
          break;
        }
      }
    }

    return $this->redirect(
      $route_name,
      [
        'work_id' => $work_id,
        'title' => $title,
        'isbn' => $isbn,
      ]
    );
  }

  public function books_insight($isbn) {
    $route_name = 'page_manager.page_view_book_view_book_view-panels_variant-0';
    $request = EnhancedApiRequest::factory('titles', $isbn, null, 'enhanced_api_title');
    $resp = $request->execute();

    if (!isset($resp->response->data)) {
      throw new NotFoundHttpException();
    }

    $titles = $resp->parse([]);

    $title = '';
    $work_id = null;
    if (isset($titles[0])) {
      $title = explode('/', $titles[0]->seoFriendlyUrl)[3];
      $work_id = $titles[0]->workId;
    }

    return $this->redirect(
      $route_name,
      [
        'work_id' => $work_id,
        'title' => $title,
        'isbn' => $isbn,
      ]
    );
  }

  public function authors($author_id) {
    $authorsReq = EnhancedApiRequest::factory('authors', $author_id, '', 'enhanced_api_author');
    $authorsReq->setFilter('suppressLinks', 'true');
    $authorsReq->setFilter('suppressRecordCount', 'true');
    $authorsReq->setFilter('returnEmptyLists', 'true');
    $resp = $authorsReq->execute();

    if (!isset($resp->response->data)) {
      throw new NotFoundHttpException();
    }

    $authors = $resp->parse([]);

    // create category title.
    $url = isset($authors[0]->seoFriendlyUrl) ? $authors[0]->seoFriendlyUrl : '';
    $display = explode('/', $url)[3];
    $route_name = 'page_manager.page_view_author_view_author_view-panels_variant-0';

    if (isset($authors[0]->clientSourceId) && $authors[0]->clientSourceId > 0) {
      $author_id = $authors[0]->clientSourceId;
    }

    return $this->redirect($route_name, array(
      'author_id' => $author_id,
      'name' => $display,
    ));
  }

  public function events($event_id) {
    if (!is_numeric($event_id)) {
      $event_id = $this->getEventIdByAlias($event_id);
    }

    if (isset($event_id) && is_numeric($event_id)) {
      $eventsReq = EnhancedApiRequest::factory('events', $event_id, '', 'enhanced_api_event');
      $eventsReq->setFilter('suppressLinks', 'true');
      $eventsReq->setFilter('suppressRecordCount', 'true');
      $eventsReq->setFilter('returnEmptyLists', 'true');
      $eventsReq->setFilter('zoom', 'https://api.penguinrandomhouse.com/title/authors/definition');
      $resp = $eventsReq->execute();

      if (!isset($resp->response->data)) {
        throw new NotFoundHttpException();
      }

      $event = $resp->parse([]);

      // create event title.
      $title = isset($event[0]->authors[0]->display) ? $event[0]->authors[0]->display : '';
      $title .= isset($event[0]->location) && !is_null($event[0]->location) ? ' at ' . $event[0]->location : '';
      // encode title to url friendly.
      $title = \Drupal::service('pathauto.alias_cleaner')->cleanString($title);

      $route_name = 'page_manager.page_view_event_view_event_view-panels_variant-0';

      return $this->redirect($route_name, array(
        'event_id' => $event_id,
        'title' => $title,
      ));
    } else {
      throw new NotFoundHttpException();
    }
  }

  public function series($series_code) {
    $seriesReq = EnhancedApiRequest::factory('series', $series_code, '', 'enhanced_api_series');
    $seriesReq->setFilter('suppressLinks', 'true');
    $seriesReq->setFilter('suppressRecordCount', 'true');
    $seriesReq->setFilter('returnEmptyLists', 'true');
    $resp = $seriesReq->execute();

    if (!isset($resp->response->data)) {
      throw new NotFoundHttpException();
    }

    $series = $resp->parse([]);

    // create series title.
    $url = isset($series[0]->seoFriendlyUrl) ? $series[0]->seoFriendlyUrl : '';

    $series_title = explode('/', $url)[3];
    $route_name = 'page_manager.page_view_landing_page_series_landing_page_series-panels_variant-0';

    return $this->redirect($route_name, array(
      'series_code' => $series_code,
      'series_title' => $series_title,
    ));
  }

  public function categories($cat_id) {
    $categoriesReq = EnhancedApiRequest::factory('categories', $cat_id, '', 'enhanced_api_category');
    $categoriesReq->setFilter('suppressLinks', 'true');
    $categoriesReq->setFilter('suppressRecordCount', 'true');
    $categoriesReq->setFilter('returnEmptyLists', 'true');
    $resp = $categoriesReq->execute();

    if (!isset($resp->response->data)) {
      throw new NotFoundHttpException();
    }

    $categories = $resp->parse([]);

    // create category title.
    $cat_uri = isset($categories[0]->catUri) ? $categories[0]->catUri : '';
    $cat_uri = str_replace('/', '', $cat_uri);

    $route_name = 'page_manager.page_view_landing_page_categories_landing_page_categories-panels_variant-0';

    return $this->redirect($route_name, array(
      'cat_id' => $cat_id,
      'cat_uri' => $cat_uri,
    ));
  }

  public function imprints($imprint_code) {
    $req = EnhancedApiRequest::factory('imprints', $imprint_code, '', 'enhanced_api_imprint');
    $req->setFilter('suppressLinks', 'true');
    $req->setFilter('suppressRecordCount', 'true');
    $req->setFilter('returnEmptyLists', 'true');
    $resp = $req->execute();

    if (!isset($resp->response->data)) {
      throw new NotFoundHttpException();
    }

    $data = $resp->parse([]);

    // create category title.
    $imprint_name = isset($data[0]->description) ? $data[0]->description : '';
    $imprint_name = \Drupal::service('pathauto.alias_cleaner')->cleanString($imprint_name);

    $route_name = 'page_manager.page_view_landing_page_imprints_landing_page_imprints-panels_variant-0';

    return $this->redirect($route_name, array(
      'imprint_code' => $imprint_code,
      'imprint_name' => $imprint_name,
    ));
  }

  /**
   * Callback for get API method.
   */
  public function get( $type, $content_id=null, $method=null ) {
    $params = array();
    $base_table = 'enhanced_api_';

    // preprocess for calling enhanced api.
    switch ($type) {
      case 'imprints':
      case 'series':
      case 'titles':
        $base_table .= $type == 'series' ? $type : substr($type, 0, -1);
        break;

      case 'authors':
      case 'categories':
      case 'works':
        $base_table .= $type == 'categories' ? 'category' : substr($type, 0, -1);
        // use contentId as method.
        if (!is_null($content_id) && !is_numeric($content_id) && is_null($method)) {
          $method = $content_id;
          $content_id = null;
        }
        break;

      case 'events':
        $base_table .= 'event';
        //Setting default parameters for events list.
        if (is_null($content_id)) {
          $params = array(
            'status' => 'Confirmed',
            'eventDateFrom' => date('m/d/Y'),
            'eventDateTo' => date('m/d/Y', strtotime('+1 year')),
            'sort' => 'eventdate',
          );
        }
        if (is_null($method)) {
          $params['zoom'] = 'https://api.penguinrandomhouse.com/title/authors/definition';
        }

        break;

      case 'search':
        $base_table .= 'search';
        $method = $content_id;
        $content_id = null;

        if (is_null($method)) {
          $method = 'views/search-display';
        }

        if ($method == 'predictive-views') {
          $method = 'predictive/views/predictive-display';
        }
        break;
    }

    // parsing method
    if ($method == 'display') {
      $method = $type == 'authors' ? 'views/author-display' : 'views/product-display';
    }
    elseif ($method == 'also-purchased'
      ||$method == 'series-display'
      ||$method == 'hierarchy'
      ||$method == 'list-display') {
      $method = 'views/' . $method;
    }

    $request = EnhancedApiRequest::factory($type, $content_id, $method, $base_table);

    //setting default parameters.
    foreach ($params as $key => $val) {
      $request->setFilter($key, $val);
    }

    //setting filters from query strings.
    $query_string = \Drupal::request()->getUri();
    $parsed_url = UrlHelper::parse($query_string);
    if (isset($parsed_url['query'])) {
      foreach($parsed_url['query'] as $key => $val) {
        if ($key != 'eventCityState' && $key != 'q' ) {
          $ids = explode(',', urldecode($val));
        }

        // if query string has more than one value, add multi values on a key.
        if (isset($ids) && count($ids) > 1) {
          // unset($ids[count($ids) - 1]);
          $request->addMultiIds($ids, $key);
        }
        else {
          $request->setFilter($key, urldecode($val));
        }
      }
    }

    $data_raw = $request->execute();

    $response['method'] = 'GET';
    $response['status'] = isset($data_raw->response->status) ? $data_raw->response->status : null;
    $response['recordCount'] = isset($data_raw->response->recordCount) ? $data_raw->response->recordCount : null;
    $data = isset($data_raw->response->data) ? $data_raw->parse(array()) : null;
    $response['data'] = $data;

    return new JsonResponse( $response );
  }

  public function getEventIdByAlias($event_title) {
    $q = implode('+', explode('-', $event_title));
    $request = EnhancedApiRequest::factory('search', null, null, 'enhanced_api_search');
    $request->setFilter('q', $q);
    $request->setFilter('docType', 'event');
    $request->setFilter('rows', '1');
    $result = $request->execute()->parse([]);

    if (isset($result->results) && isset($result->results[0])) {
      return $result->results[0]->key;
    }

    return false;
  }
}
