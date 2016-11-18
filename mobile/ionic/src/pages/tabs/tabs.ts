import { Component } from '@angular/core';

import { MapPage } from '../map/map';
import { StatsPage } from '../stats/stats';
import { EmergencyPage } from '../emergency/emergency';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  mapPage: any = MapPage;
  statsPage: any = StatsPage;
  emergencyPage: any = EmergencyPage;

  constructor() {

  }
}
