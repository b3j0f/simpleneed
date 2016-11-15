//import { captureException, config } from 'raven-js';
import { NgModule, /* ErrorHandler*/ } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { MapPage } from '../pages/map/map';
import { StatsPage } from '../pages/stats/stats';
import { TabsPage } from '../pages/tabs/tabs';
import { MapComponent } from '../components/map-component/map-component';
import { LocatedElementPage } from '../pages/located-element/located-element';
import { MenuComponent } from '../components/menu/menu';
import { NavBarComponent } from '../components/navbar/navbar';
import { HTTP } from '../providers/http';

//config('https://7ca3f181c11f40aea28d05fe60acd978@sentry.io/114226')
//  .install();

/*class RavenErrorHandler implements ErrorHandler {
  handleError(err:any) : void {
    captureException(err.originalError);
  }
}*/

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    MapComponent,
    MapPage,
    StatsPage,
    TabsPage,
    LocatedElementPage,
    MenuComponent,
    NavBarComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    MapComponent,
    MapPage,
    StatsPage,
    TabsPage,
    LocatedElementPage,
    MenuComponent,
    NavBarComponent
  ],
  providers: [ HTTP /*{ /*provide: ErrorHandler, /*useClass: RavenErrorHandler }*/]
})
export class AppModule {}
