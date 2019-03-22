<?php

namespace Drupal\prhc_angular\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Class PrhcAngularSettingsForm.
 *
 * @package Drupal\prhc_angular\Form
 */
class PrhcAngularSettingsForm extends ConfigFormBase {

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return ['prhc_angular.settings'];
  }

  /**
   * {@inheridoc}
   */
  public function getFormId() {
    return 'prhc_angular_settings_form';
  }

  /**
   * {@inheridoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('prhc_angular.settings');
    $form['ng_development_mode'] = array(
      '#type' => 'checkbox',
      '#title' => $this->t('Local Development Mode'),
      '#description' => $this->t('Checking the box enables local development mode. Please make sure that a local development build is created inside of prhc_angular/angular/dist'),
      '#default_value' => $config->get('ng_development_mode'),
    );
    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    parent::submitForm($form, $form_state);
    // Set variables based on form values.
    $development_mode = $form_state->getValue('ng_development_mode');
    // Get the config object.
    $config = \Drupal::service('config.factory')
      ->getEditable('prhc_angular.settings');
    // Set the values the user submitted in the form.
    $config->set('ng_development_mode', $development_mode);
    $config->save();
  }

}
