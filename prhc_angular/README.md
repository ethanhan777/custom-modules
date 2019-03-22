# PRHC Angular Integration

This module allows Angular components to be included in pages as custom Drupal blocks. This is inspired by the concept of [Decoupled Blocks](https://www.drupal.org/project/pdb) originally implemented in the [pdb module](https://github.com/mrjmd/pdb).

## System Requirements

* [Drupal 8](https://www.drupal.org/home)
* [Node v8+](https://nodejs.org/en/)
* [Yarn](https://yarnpkg.com/en/docs/getting-started)

---

## Getting Started

### Enable in Drupal

* Under `admin > extend`, this module is listed under the `Penguin Custom` category
* Select `PRHC Angular` and click `Install`

### Setup for Local Development

In your terminal:

* Navigate to `prhc_angular/angular`
* Run `yarn install`
* Run `yarn start` to start the local development build server

In Drupal Admin:

* Go to `admin > Configuration > Web Services > PRHC Angular Settings`
* Enable `Local Development Mode` and click `Save Configuration`

---

## Writing Your Own Blocks

This module leverages the [Angular CLI](https://cli.angular.io/) to process Angular components and enable them to be used dynamically inside of a Drupal page.

### Setup Angular Components

Write your Angular components as is [customary](https://angular.io/docs) with some slight variations for components that you want to be availble as Drupal Blocks:

**Component Selector**

When specifying the selector for the component, store the string value in an exported constant.

```ts
import { Component } from '@angular/core';

export const fooComponentSelector = 'prhc-foo';

@Component({
  selector: fooComponentSelector,
  templateUrl: './foo.component.html',
  styleUrls: ['./foo.component.scss']
})
export class FooComponent {}
```

**Module Hookup**

When hooking up the component to your NgModule, you will need to specify it as an `entryComponent`. You will also need to add it's selector to the `entryComponentSelectors` array and provide it's class value with the syntax `{ provide: fooComponentSelector, useValue: FooComponent }`

```ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FooComponent, fooComponentSelector } from './foo.component';

export const entryComponentSelectors = [fooComponentSelector];

@NgModule({
  imports: [BrowserModule],
  declarations: [FooComponent],
  providers: [{ provide: fooComponentSelector, useValue: FooComponent }],
  entryComponents: [FooComponent],
})
export class AppModule {
  ngDoBootstrap() {}
}
```

### Setup Drupal Blocks

In order for Drupal to know about your custom block, you need to create a `component_name.info.yml` file beside your component class file with the following content structure inside:

```yml
name: Foo Component # Change as appropriate
description: 'Foo Component description' # Change as appropriate
selector: prhc-foo # Must match the component selector definied in the decorator
type: prhc_angular
package: 'PRHC Angular'
version: '1.0.0'
core: '8.x'
module_status: active
```

_Note_: The `info.yml` file name must use `_` for word deliniation. Drupal will not find the module if you use `-`.

Once you clear your Drupal cache, you should see your new block available in any block selection interface inside Drupal under the category `PRHC Angular`.

---

## Going to Production

When preparing your site for deployment there are a few steps that you need to take:

1. Ensure that `Local Development Mode` inside of `PRHC Angular Settings` is disabled (this is the default)
2. Run `yarn build` inside of `prhc_angular/angular` to generate the production optimized JavaScript and CSS assets
3. Profit 🙂

---

## Contributors

* Andrew Smith
* Ethan Han
