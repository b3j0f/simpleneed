import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
//import { platformBrowser } from '@angular/platform-browser';
import { enableProdMode } from '@angular/core';

//import { AppModuleNgFactory } from './app.module.ngfactory';

import { AppModule } from './app.module';

enableProdMode();
//platformBrowser().bootstrapModule(AppModule);
platformBrowserDynamic().bootstrapModule(AppModule);

/* uncomment for prod
enableProdMode();
platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);
*/