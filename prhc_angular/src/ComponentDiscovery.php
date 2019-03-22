<?php

namespace Drupal\prhc_angular;

use Drupal\Core\Extension\ExtensionDiscovery;
use Drupal\Core\Extension\InfoParserInterface;

/**
 * Discovery service for front-end components provided by modules and themes.
 *
 * Components (anything whose info file 'type' is 'prhc_angular') are treated as Drupal
 * extensions unto themselves.
 */
class ComponentDiscovery extends ExtensionDiscovery implements ComponentDiscoveryInterface {

  /**
   * The info parser.
   *
   * @var \Drupal\Core\Extension\InfoParserInterface
   */
  protected $infoParser;

  /**
   * ComponentDiscovery constructor.
   *
   * @param string $root
   *   The root directory of the Drupal installation.
   * @param \Drupal\Core\Extension\InfoParserInterface $info_parser
   *   The info parser.
   */
  public function __construct($root, InfoParserInterface $info_parser) {
    parent::__construct($root);
    $this->infoParser = $info_parser;
  }

  /**
   * {@inheritdoc}
   */
  public function getComponents() {
    // Find components.
    $components = $this->scan('prhc_angular');

    // Read info files for each module.
    foreach ($components as $key => $component) {
      $components[$key]->info = $this->infoParser->parse($component->getPathname());
    }

    return $components;
  }

}
