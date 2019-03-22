<?php

namespace Drupal\prhc_angular\Plugin\Derivative;

use Drupal\Component\Plugin\Derivative\DeriverBase;
use Drupal\Core\Plugin\Context\ContextDefinition;
use Drupal\Core\Plugin\Discovery\ContainerDeriverInterface;
use Drupal\prhc_angular\ComponentDiscoveryInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides a deriver for Angular Blocks.
 */
class AngularBlockDeriver extends DeriverBase implements ContainerDeriverInterface {

  /**
   * The component discovery service.
   *
   * @var \Drupal\prhc_angular\ComponentDiscoveryInterface
   */
  private $componentDiscovery;

  /**
   * AngularBlockDeriver constructor.
   *
   * @param \Drupal\prhc_angular\ComponentDiscoveryInterface $component_discovery
   *   The component discovery service.
   */
  public function __construct(ComponentDiscoveryInterface $component_discovery) {
    $this->componentDiscovery = $component_discovery;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, $base_plugin_id) {
    return new static(
      $container->get('prhc_angular.component_discovery')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getDerivativeDefinitions($base_plugin_definition) {
    // Get all custom blocks which should be rediscovered.
    $components = $this->componentDiscovery->getComponents();

    foreach ($components as $block_id => $block_info) {
      $this->derivatives[$block_id] = $base_plugin_definition;
      $this->derivatives[$block_id]['info'] = $block_info->info;
      $this->derivatives[$block_id]['admin_label'] = $block_info->info['name'];
      $this->derivatives[$block_id]['cache'] = array('max-age' => 0);
    }
    return $this->derivatives;
  }
}
