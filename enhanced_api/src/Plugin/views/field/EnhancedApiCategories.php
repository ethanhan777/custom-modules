<?php

namespace Drupal\enhanced_api\Plugin\views\field;

use Drupal\views\Plugin\views\field\FieldPluginBase;
use Drupal\views\ResultRow;
use Drupal\Core\Link;
use Drupal\Core\Url;

/**
 * Class EnhancedApiLinks
 *
 * @ingroup views_field_handlers
 *
 * @ViewsField("enhanced_api_categories")
 */
class EnhancedApiCategories extends FieldPluginBase {

  /**
   * {@inheritdoc}
   */
  public function render(ResultRow $values) {
    $raw_links = $this->getValue($values);
    if ($raw_links) {
      // foreach($raw_links as $raw_link) {
      //   $link = Link::fromTextAndUrl(
      //     $raw_link['title'],
      //     Url::fromRoute(
      //       'enhanced_api.categories',
      //       array('name' => $raw_link['url'])
      //     )
      //   );
      //   $links[] = $link->toString();
      // }
      return [
        '#theme' => 'item_list',
        '#items' => $raw_links,
      ];
    }
  }
}
