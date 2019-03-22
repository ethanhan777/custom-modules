<?php

namespace Drupal\enhanced_api\Plugin;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use \GuzzleHttp\Exception\ClientException;
use Drupal\Core\Url;

/**
 * PRH Enhanced API Request class.
 *
 * Use EnhancedApiRequest::factory(my.methodname) to get a request object. All
 * public methods return $this and can be chained together.
 */
class EnhancedApiRequest {

  // API response, populated by EnhancedApiRequest->execute()
  public $response;

  // Flag to designate if the $response is from a cache.
  public $cache;

  // Default API url
  public $url;

  // API parameter, use EnhancedApiRequest->setFilter() to set.
  protected $params = array();

  // API parameter(Special, use EnhancedApiRequest->addMultiISBNs() to set.
  protected $special_params = '';

  // The cache table to use.
  protected $cache_table = 'cache';

  // API id
  protected $id;

  // API method
  protected $method;

  // API admin config settings.
  protected $settings;

  /**
   * Factory method!
   *
   * @param $base_field
   * @param $id
   * @param $method
   *   The Enhanced API method to build a request for.
   *
   * @param $base_table
   *
   * @return EnhancedApiRequest object
   */
  static function factory($base_field, $id, $method, $base_table) {
    $method_arr = explode('/', $method);

    switch ($base_table) {
      case 'enhanced_api_author':
        if ($method_arr[0] == 'views') {
          return new EnhancedApiRequestAuthorViews($base_field, $id, $method);
        }
        return new EnhancedApiRequestAuthor($base_field, $id, $method);
      case 'enhanced_api_category':
        return new EnhancedApiRequestCategory($base_field, $id, $method);
      case 'enhanced_api_division':
        return new EnhancedApiRequestDivision($base_field, $id, $method);
      case 'enhanced_api_event':
        return new EnhancedApiRequestEvent($base_field, $id, $method);
      case 'enhanced_api_imprint':
        return new EnhancedApiRequestImprint($base_field, $id, $method);
      case 'enhanced_api_series':
        return new EnhancedApiRequestSeries($base_field, $id, $method);
      case 'enhanced_api_title':
        if ($method_arr[0] == 'views') {
          return new EnhancedApiRequestTitleViews($base_field, $id, $method);
        }
        return new EnhancedApiRequestTitle($base_field, $id, $method);
      case 'enhanced_api_work':
        if ($method_arr[0] == 'views') {
          return new EnhancedApiRequestWorkViews($base_field, $id, $method);
        }
        return new EnhancedApiRequestWork($base_field, $id, $method);
      case 'enhanced_api_search':
        return new EnhancedApiRequestSearch($base_field, $id, $method);
    }
  }

  /**
   * Constructor, please use the factory. k,thx
   *
   * @param $base_field
   * @param $id
   * @param $method
   */
  function __construct($base_field, $id, $method) {
    $this->settings = \Drupal::config('enhanced_api.settings');

    $this->url = $this->settings->get('enhanced_api_url')
      . $this->settings->get('enhanced_api_domain');
    if (!empty($base_field)) {
      $this->url .= '/' . $base_field;
    }

    if (!empty($id)) {
      $this->url .= '/' . $id;
    }

    if (!empty($method)) {
      $this->url .= '/' . $method;
    }

    $this->id = $id;
    $this->method = $method;
    if ($base_field == 'works' || $method == 'works') {
      $this->params['suppressLinks'] = 'false';
    }
    else {
      $this->params['suppressLinks'] = 'true';
    }
    $this->params['api_key'] = $this->settings->get('enhanced_api_key');
  }

  /**
   * Add a filter to the request. Classes that extend this one should declare
   * what $keys are accepted.
   *
   * @param $key
   *   The filter to set
   * @param $value
   *   The value to set for the $key.
   *
   * @return EnhancedApiRequest object
   */
  public function setFilter($key, $value) {
    $this->params[$key] = $value;
    return $this;
  }

  /**
   * Add special paramaters like isbns.
   */
  public function addMultiIds($ids, $param) {
    foreach ($ids as $id) {
      $this->special_params .= '&' . $param . '=' . $id;
    }
    return $this;
  }

  public function resetFilters() {
    $this->params = [];
    return $this;
  }

  /**
   * Make the request! The results of the call will be set on the `response`
   * attribute.
   *
   * @return EnhancedApiRequest object
   */
  public function execute() {
    // Put the API call URL together.
    // TODO determine if we really should use url() here...
    $this->request_url = Url::fromUri($this->url,
      array(
        'query' => $this->params,
        'absolute' => TRUE
      ))->toString();

    $this->request_url .= $this->special_params;
    // reset special params
    $this->special_params = '';
    $this->request_url = str_replace('%2B', '+', $this->request_url);
    // kint($this->request_url);
    // die();

    // Check if we have a cache hit or not.
    if ($result = $this->cache_get($this->request_url)) {
      $this->response = $result;
      $this->cache = TRUE;
    }
    else {
      $this->response = $this->request($this->request_url);
      $this->cache_set($this->request_url, $this->response);
      $this->cache = FALSE;
    }

    return $this;
  }

  public function getRequestedUrl() {
    if (isset($this->request_url)) {
      return $this->request_url;
    }
    return null;
  }

  /**
   * Make the actual HTTP request and parse output
   * @return bool|mixed
   */
  protected function request($request_url) {
    // $response = drupal_http_request($request_url);
    $client = \Drupal::httpClient();
    $options['http_errors'] = FALSE;
    $request = $client->get($request_url, ['http_errors' => false]);
    $status_code = $request->getStatusCode();

    if ($status_code == '200') {
      $response = $request->getBody();
      $data = json_decode($response);
      if (isset($data->error) && isset($data->error->code)) {
        \Drupal::logger('enhanced_api')->error("PRH Content API error @code",
          array(
            '@code' => $data->error,
          ));
      }
      else {
        return $data;
        // TODO determine how to handle the pager here. It seems like every
        // request returns a stdClass with a single attribute. This attribute
        // doesn't have a standard name, but varies by method. This single
        // attribute is also a stdClass, it has a @attr attribute that contains
        // the paging info.
        //

        /*
        list($head, $values) = $data;
        // A full reponse may be spread over several pages, so if there are
        // additional pages we retrieve them.
        if (($head->page < $head->pages) && ($head->per_page < $head->total)) {
          $this->params['page'] = $head->page + 1;
          $url = $this->url .'?'. $this->query_string();
          if ($recurse = $this->_request($request_url)) {
            $values = array_merge($values, $recurse);
          }
        }
        return $values;
        */
      }
    }
    // 404 means the content is removed from API.
    elseif ($status_code == '404') {}
    else {
      \Drupal::logger('enhanced_api')->error('HTTP error @code received',
        array(
          '@code' => $status_code
        ));
      // throw new NotFoundHttpException();
    }

    return FALSE;
  }

  /**
   * Populate the cache. Wrapper around Drupal's cache_get()
   *
   * TODO determine the correct lifetime / management strategy for the response cache.
   *
   * The caching model implemented here is somewhat different than drupal's
   * normal model because the data in this cache cannot be regenerated locally.
   *
   * Additionally we wait to avoid making repeated failed requests to the API in
   * the case where it's either down, or a invalid query has been fomulated.
   *
   * @param $request_url
   *   The API url that would be used.
   * @param $reset
   *   Set to TRUE to force a retrieval from the database.
   *
   * @return bool
   */
  protected function cache_get($request_url, $reset = FALSE) {
    static $items = array();

    $cid = $this->cache_id($request_url);

    if (!isset($items[$cid]) || $reset) {
      $cache = \Drupal::cache()->get($cid);
      $items[$cid] = ($cache != FALSE) ? $cache->data : null;

      // Don't return temporary items more that 5 minutes old.
      if (isset($items[$cid]->expire) && $items[$cid]->expire === -1 && isset($items[$cid]->created) && $items[$cid]->created > (time() + 300)) {
        return FALSE;
      }
    }
    return $items[$cid];
  }

  /**
   * Retrieve the cache. Wrapper around Drupal's cache_set()
   */
  protected function cache_set($url, $data) {
    if ($data === FALSE) {
      // If we don't get a response we set a temporary cache to prevent hitting
      // the API frequently for no reason.
      \Drupal::cache()->set($this->cache_id($url), FALSE, -1);
    }
    else {
      if ($this->settings) {
        $ttl = (int)$this->settings->get('enhanced_api_cache_time');
        $expire = time() + ($ttl * 60);

        \Drupal::cache()->set($this->cache_id($url), $data, $expire);
      }
    }
  }

  /**
   * Helper function to generate a cache id based on the class name and
   * hash of the url
   *
   * @param $request_url
   *
   * @return string
   */
  protected function cache_id($request_url) {
    return get_class($this) .':'. md5($request_url);
  }

  /**
   * @param $joins
   * @param $data
   */
  protected function get_related_data($joins, $data) {
    // Joins aka relationships are set as separate requests whose data is pulled into
    // the existing result set. The method to be called is set in the 'method' key,
    // and the arg to be passed to the method is set in the 'arg' key. The assumption
    // is that the arg exists as a property in the result set.
    //
    // There is also an assumption that related data only returns one record. This makes
    // sense if you think about it.
    if (isset($joins)) {
      foreach ($joins as $type => $info) {
        $request = EnhancedApiRequest::factory($info['base_field'], $info['id'], $info['method'], $type);
        if (isset($info['arg'])) {
          $request->setFilter($info['arg'], $data->{$info['arg']});
        }
        if (isset($info['params'])) {
          foreach ($info['params'] as $key => $val) {
            $request->setFilter($key, $val);
          }
        }
        $request->execute();
        $result = $request->parse(array());

        $data->{$info['method']} =  $result;
      }
      return $data;
    }
  }

  /**
   * Custom parser for the type of data we're retrieving.
   * Must be implemented by all subclasses. Must return an
   * indexed array of results, each result being an array keyed
   * by the field name.
   *
   * @param $joins
   */
  public function parse($joins) {
  }

  public function get_image($id='', $type=null) {
    if ($type == 'authors') {
      return $this->settings->get('enhanced_api_author_photo_url') . $id;
    } else {
      // TODO: include different sizes
      // {"450jpg":"http://images.randomhouse.com/cover//9780399564512"},
      // {"100gif":"http://images.randomhouse.com/cover/100gif/9780399564512"},
      // {"200gif":"http://images.randomhouse.com/cover/200gif/9780399564512"},
      // {"700jpg":"http://images.randomhouse.com/cover/700jpg/9780399564512"},
      return $this->settings->get('enhanced_api_cover_image_url') . $id;
    }
  }
}

