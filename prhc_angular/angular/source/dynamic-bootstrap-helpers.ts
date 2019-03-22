import { NgModuleRef, NgZone, ApplicationRef } from '@angular/core';

export function bootstrapTopLevelComponents(selectors: string[]) {
  return <T>(app: NgModuleRef<T>) => {
    selectors.forEach(bootstrapComponent(app));
    return app;
  };
}

function bootstrapComponent<T>(app: NgModuleRef<T>) {
  return (selector: string) => {
    const ngZone: NgZone = app.injector.get(NgZone);
    // Have to run these inside of NgZone in order for component change detection to fire correctly
    ngZone.run(() => {
      const appRef = app.injector.get(ApplicationRef);
      const componentClass = app.injector.get(selector);
      // DOM Node required to manage multiple tags with the same selector
      const domNodes = Array.from(document.querySelectorAll(selector));
      domNodes.forEach(domNode => appRef.bootstrap(componentClass, domNode));
    });
  };
}
