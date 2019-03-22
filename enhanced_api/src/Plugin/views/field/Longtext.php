<?php
namespace Drupal\enhanced_api\Plugin\views\field;

use Drupal\views\Plugin\views\field\FieldPluginBase;
use Drupal\views\ResultRow;
use Drupal\Core\Form\FormStateInterface;

/**
 * Class CoverImage
 *
 * @ViewsField("longtext")
 */
class Longtext extends FieldPluginBase {
  /**
   * {@inheritdoc}
   */
  protected function defineOptions() {
    $options = parent::defineOptions();
    $options['html_markup_flag'] = TRUE;
    return $options;
  }

  /**
   * {@inheritdoc}
   */
  public function buildOptionsForm(&$form, FormStateInterface $form_state) {
    $form['html_markup_flag'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('HTML markup'),
      '#default_value' => $this->options['html_markup_flag'],
      '#description' => $this->t('Check to markup text.'),
    ];
    parent::buildOptionsForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function render(ResultRow $values) {
    $longtext = $this->getValue($values);
    if ($longtext) {
      if ($this->options['html_markup_flag']) {
        return check_markup($longtext, 'full_html');
      }

      return $longtext;
    }
  }
}
