import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { MapPage } from '../pages/map/map';
import { StatsPage } from '../pages/stats/stats';
import { EmergencyPage } from '../pages/emergency/emergency';
import { CRUPPage } from '../pages/crup/crup';
import { MapComponent } from '../components/map-component/map-component';
import { NavBarComponent } from '../components/navbar/navbar';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { HTTP } from '../providers/http';
import { Storage } from '@ionic/storage';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { LegendPage } from '../pages/legend/legend'

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    MapPage,
    MapComponent,
    StatsPage,
    EmergencyPage,
    CRUPPage,
    NavBarComponent,
    LegendPage
  ],
  imports: [
    IonicModule.forRoot(MyApp), HttpModule, BrowserModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    MapPage,
    MapComponent,
    StatsPage,
    EmergencyPage,
    CRUPPage,
    NavBarComponent,
    LegendPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HTTP,
    Storage
  ]
})
export class AppModule {}
