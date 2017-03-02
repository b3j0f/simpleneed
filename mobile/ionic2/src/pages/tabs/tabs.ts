import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { MapPage } from '../map/map';
import { StatsPage } from '../stats/stats';
import { EmergencyPage } from '../emergency/emergency';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  mapRoot: any = MapPage;
  statsRoot: any = StatsPage;
  emergencyRoot: any = EmergencyPage;
  mySelectedIndex: number;

  constructor(navParams: NavParams) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }
}
