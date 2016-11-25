// import { captureException, config } from 'raven-js';
import { NgModule, /*ErrorHandler*/ } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { MapPage } from '../pages/map/map';
import { StatsPage } from '../pages/stats/stats';
import { TabsPage } from '../pages/tabs/tabs';
import { EmergencyPage } from '../pages/emergency/emergency';
import { MapComponent } from '../components/map-component/map-component';
import { CRUPPage } from '../pages/crup/crup';
import { MenuComponent } from '../components/menu/menu';
import { NavBarComponent } from '../components/navbar/navbar';
import { HTTP } from '../providers/http';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';

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
    CRUPPage,
    MenuComponent,
    NavBarComponent,
    EmergencyPage
  ],
  imports: [
    IonicModule.forRoot(MyApp), HttpModule, BrowserModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    MapComponent,
    MapPage,
    StatsPage,
    TabsPage,
    CRUPPage,
    MenuComponent,
    NavBarComponent,
    EmergencyPage
  ],
  providers: [ HTTP, /*{ provide: ErrorHandler, useClass: RavenErrorHandler }*/]
})
export class AppModule {}
