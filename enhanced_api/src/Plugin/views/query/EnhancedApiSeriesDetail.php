<?php
namespace Drupal\enhanced_api\Plugin\views\query;

use Drupal\views\Plugin\views\query\QueryPluginBase;
use Drupal\views\Plugin\views\ViewsPluginInterface;
use Drupal\views\ViewExecutable;
use Drupal\views\ResultRow;
use Drupal\enhanced_api\Plugin\EnhancedApiRequest;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Enhanced API views query plugin which wraps calls to the Enhanced API in order
 * to expose the results to views.
 *
 * @ViewsQuery(
 *   id = "enhanced_api_series_detail",
 *   title = @Translation("Enhanced API Series Detail"),
 *   help = @Translation("Query against the Enhanced API.")
 * )
 */
class EnhancedApiSeriesDetail extends QueryPluginBase {

  public function ensureTable($table, $relationship = NULL) {
    return '';
  }

  public function addField($table, $field, $alias = '', $params = array()) {
    return $field;
  }

  // public function __construct(array $configuration, $plugin_id, $plugin_definition) {
  //   parent::__construct($configuration, $plugin_id, $plugin_definition);
  //   // $this->fitbitClient = $fitbit_client;
  //   // $this->fitbitAccessTokenManager = $fitbit_access_token_manager;
  // }

  /**
   * {@inheritdoc}
   */
  protected function defineOptions() {
    $options = parent::defineOptions();
    return $options;
  }

  public function addWhere($group, $field, $value = NULL, $operator = NULL) {
    // Ensure all variants of 0 are actually 0. Thus '', 0 and NULL are all
    // the default group.
    if (empty($group)) {
      $group = 0;
    }
    // Check for a group.
    if (!isset($this->where[$group])) {
      $this->setWhereGroup('AND', $group);
    }
    $this->where[$group]['conditions'][] = [
      'field' => $field,
      'value' => $value,
      'operator' => $operator,
    ];
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition
    );
  }

  /**
   * {@inheritdoc}
   */
  public function build(ViewExecutable $view) {
    // Mostly modeled off of \Drupal\views\Plugin\views\query\Sql::build()

    // Store the view in the object to be able to use it later.
    $this->view = $view;

    $view->initPager();

    // Let the pager modify the query to add limits.
    $view->pager->query();

    $view->build_info['query'] = $this->query();
    $view->build_info['count_query'] = $this->query(TRUE);
  }

  /**
   * {@inheritdoc}
   */
  public function execute(ViewExecutable $view) {
    if (isset($this->where)) {
      foreach ($this->where as $where_group => $where) {
        foreach ($where['conditions'] as $condition) {
          // Remove dot from beginning of the string.
          $field_name = ltrim($condition['field'], '.');
          $filters[$field_name] = $condition['value'];
        }
      }
    }

    $start = $rows = null;
    if (isset($view->pager->options['items_per_page'])
      && isset($view->pager->options['offset'])) {
      $rows = $view->pager->options['items_per_page'];
      $start = $view->pager->options['offset'];
    }
    $series_code = $filters['series_code'];

    $request = EnhancedApiRequest::factory('series', $series_code, 'works', 'enhanced_api_series');
    $request->setFilter('start', $start);
    $request->setFilter('rows', $rows);
    $data_raw = $request->execute();
    $data = $data_raw->parse(array());

    $frontiest = array();
    foreach ($data as $work) {
      $work_id = $work->work_id;
      $work_request = EnhancedApiRequest::factory('works', $work_id, 'titles', 'enhanced_api_work');
      $titles = $work_request->execute()->parse(array());
      $frontiest[] = $this->getFrontiest($titles);
    }

    $index = 0;
    foreach ($frontiest as $series) {
      foreach ($series as $field_name => $value) {
        $row[$field_name] = $value;
      }

      if (!empty($row)) {
        $row['index'] = $index++;
        $view->result[] = new ResultRow($row);
      }
    }
  }

  protected function getFrontiest($titles) {
    foreach ($titles as $title) {
      if ($title->frontlistiest_seq == '1') {
        return $title;
      }
    }

    // if not found return the first title.
    return $titles[0];
  }

}
