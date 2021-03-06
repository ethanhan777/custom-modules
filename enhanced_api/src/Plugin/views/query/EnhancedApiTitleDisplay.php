<?php
namespace Drupal\enhanced_api\Plugin\views\query;

use Drupal\views\Plugin\views\query\QueryPluginBase;
use Drupal\enhanced_api\Plugin\EnhancedApiRequest;
use Drupal\views\Plugin\views\ViewsPluginInterface;
use Drupal\views\ViewExecutable;
use Drupal\views\ResultRow;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Enhanced API views query plugin which wraps calls to the Fitbit API in order
 * to expose the results to views.
 *
 * @ViewsQuery(
 *   id = "enhanced_api_title",
 *   title = @Translation("Enhanced API Title Display"),
 *   help = @Translation("Query against the Enhanced API.")
 * )
 */
class EnhancedApiTitleDisplay extends QueryPluginBase {

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

    $isbn = isset($filters['isbn']) ? $filters['isbn'] : '9780345810427';
    $request = EnhancedApiRequest::factory('titles', $isbn, 'views/product-display', 'enhanced_api_title');
    $data_raw = $request->execute();
    $data = $data_raw->parse(array());
    $index = 0;
    foreach ($data as $title) {
      foreach ($title as $field_name => $value) {
        $row[$field_name] = $value;
      }
    }

    $row['index'] = $index++;
    $view->result[] = new ResultRow($row);
  }

}
