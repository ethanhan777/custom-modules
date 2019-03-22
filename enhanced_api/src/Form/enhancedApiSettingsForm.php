<?php

namespace Drupal\enhanced_api\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

class enhancedApiSettingsForm extends ConfigFormBase {

  public function getFormId() {
    return 'enhanced_api_admin_settings';
  }

  protected function getEditableConfigNames() {
    return [
      'enhanced_api.settings',
    ];
  }

  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('enhanced_api.settings');

    $form['enhanced_api_key'] = array(
      '#title' => t('API Key'),
      '#type' => 'textfield',
      '#size' => 32,
      '#maxlength' => 32,
      '#required' => TRUE,
      '#default_value' => $config->get('enhanced_api_key'),
      '#description' => t('PRH Enhanced Content API key.'),
    );

    $form['enhanced_api_url'] = array(
      '#title' => t('API URL'),
      '#type' => 'textfield',
      '#size' => 50,
      '#maxlength' => 100,
      '#required' => TRUE,
      '#default_value' => $config->get('enhanced_api_url'),
      '#description' => t('Base URL to PRH Enhanced Content API.'),
    );

    $form['enhanced_api_domain'] = array(
      '#title' => t('API Domain'),
      '#type' => 'textfield',
      '#size' => 10,
      '#maxlength' => 10,
      '#required' => TRUE,
      '#default_value' => $config->get('enhanced_api_domain'),
      '#description' => t('Base URL to PRH Enhanced Content API.'),
    );

    $form['enhanced_api_cache_time'] = array(
      '#title' => t('Cache time'),
      '#type' => 'textfield',
      '#size' => 10,
      '#maxlength' => 10,
      '#required' => TRUE,
      '#default_value' => $config->get('enhanced_api_cache_time'),
      '#description' => t('Number of minutes that results from PRH Enhanced Content API should be cached.'),
    );

    $form['enhanced_api_cover_image_url'] = array(
      '#title' => t('Cover Image URL'),
      '#type' => 'textfield',
      '#size' => 50,
      '#maxlength' => 100,
      '#required' => TRUE,
      '#default_value' => $config->get('enhanced_api_cover_image_url'),
      '#description' => t('Base URL to PRH cover images.'),
    );

    $form['enhanced_api_author_photo_url'] = array(
      '#title' => t('Author Photo URL'),
      '#type' => 'textfield',
      '#size' => 50,
      '#maxlength' => 100,
      '#required' => TRUE,
      '#default_value' => $config->get('enhanced_api_author_photo_url'),
      '#description' => t('Base URL to PRH author photos.'),
    );

    return parent::buildForm($form, $form_state);
  }

  public function submitForm(array &$form, FormStateInterface $form_state) {
    $this->config('enhanced_api.settings')
      ->set('enhanced_api_key', $form_state->getValue('enhanced_api_key'))
      ->set('enhanced_api_url', $form_state->getValue('enhanced_api_url'))
      ->set('enhanced_api_domain', $form_state->getValue('enhanced_api_domain'))
      ->set('enhanced_api_cache_time', $form_state->getValue('enhanced_api_cache_time'))
      ->set('enhanced_api_cover_image_url', $form_state->getValue('enhanced_api_cover_image_url'))
      ->set('enhanced_api_author_photo_url', $form_state->getValue('enhanced_api_author_photo_url'))
      ->save();

    parent::submitForm($form, $form_state);
  }
}
