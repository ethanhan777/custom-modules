<?php
namespace Drupal\enhanced_api\Plugin\views\field;

use Drupal\views\Plugin\views\field\FieldPluginBase;
use Drupal\views\ResultRow;

/**
 * Class CoverImage
 *
 * @ViewsField("cover_image")
 */
class CoverImage extends FieldPluginBase {

  /**
   * {@inheritdoc}
   */
  public function render(ResultRow $values) {
    $cover = $this->getValue($values);
    if ($cover) {
      return [
        '#theme' => 'image',
        '#uri' => $cover,
        '#alt' => $this->t('Cover Image'),
      ];
    }
  }
}
