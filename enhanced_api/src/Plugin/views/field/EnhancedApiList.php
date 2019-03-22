<?php

namespace Drupal\enhanced_api\Plugin\views\field;

use Drupal\views\Plugin\views\field\FieldPluginBase;
use Drupal\views\ResultRow;
use Drupal\Core\Link;
use Drupal\Core\Url;

/**
 * Class EnhancedApiList
 *
 * @ingroup views_field_handlers
 *
 * @ViewsField("enhanced_api_list")
 */
class EnhancedApiList extends FieldPluginBase {

  /**
   * {@inheritdoc}
   */
  public function render(ResultRow $values) {
    $list = $this->getValue($values);
    if ($list) {
      return [
        '#theme' => 'item_list',
        '#items' => $list,
      ];
    }
  }
}
