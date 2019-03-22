<?php

namespace Drupal\prhc_angular\Plugin\Block;

use Drupal\Core\Block\BlockBase;

/**
 * Provides a Block that renders the host tag of an Angular element.
 *
 * @Block(
 *   id = "angular_component",
 *   admin_label = @Translation("Angular Component"),
 *   category = @Translation("PRHC Angular"),
 *   deriver = "\Drupal\prhc_angular\Plugin\Derivative\AngularBlockDeriver"
 * )
 */
class AngularBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    $config_settings = \Drupal::config('prhc_angular.settings');
    $info = $this->getComponentInfo();
    $selector = $info['selector'];
    $asset_library = 'prhc_angular/prhc_angular.prod';
    if (isset($config_settings) && $config_settings->get('ng_development_mode')) {
      $asset_library = 'prhc_angular/prhc_angular.dev';
    }

    return array(
      '#allowed_tags' => array($selector),
      '#markup' => "<$selector></$selector>",
      '#attached' => array(
        'library' => array($asset_library),
      ),
    );
  }

  /**
   * Returns the component definition.
   *
   * @return array
   *   The component definition.
   */
  private function getComponentInfo() {
    $plugin_definition = $this->getPluginDefinition();
    return $plugin_definition['info'];
  }

}
