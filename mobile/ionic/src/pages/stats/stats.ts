import * as c3 from 'c3';

import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'page-stats',
  templateUrl: 'stats.html'
})
export class StatsPage {

  @ViewChild('daystatschart') daystatschart;
  @ViewChild('monthstatschart') monthstatschart;
  @ViewChild('yearstatschart') yearstatschart;
  @ViewChild('allstatschart') allstatschart;

  ionViewDidEnter() {
    c3.generate({
      bindto: this.allstatschart.nativeElement,
      data: {
        columns: [
          ['', 30, 200, 100, 400, 150, 250],
          ['', 50, 20, 10, 40, 15, 25]
        ]
      }
    });
  }
}