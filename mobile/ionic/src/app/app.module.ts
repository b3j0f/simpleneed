import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { MapPage } from '../pages/map/map';
import { StatsPage } from '../pages/stats/stats';
import { TabsPage } from '../pages/tabs/tabs';
import { MapComponent } from '../components/map-component/map-component';
import { CRUPPage } from '../pages/crup/crup';
import { FilterPage } from '../pages/filter/filter';
import { MenuComponent } from '../components/menu/menu';
import { NavBarComponent } from '../components/navbar/navbar';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    MapComponent,
    MapPage,
    StatsPage,
    TabsPage,
    CRUPPage,
    FilterPage,
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
    CRUPPage,
    FilterPage,
    MenuComponent,
    NavBarComponent
  ],
  providers: []
})
export class AppModule {}
