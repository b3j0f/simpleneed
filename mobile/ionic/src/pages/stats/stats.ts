import * as c3 from 'c3';
import * as d3 from 'd3';

import { Component } from '@angular/core';

@Component({
    selector: 'page-stats',
    templateUrl: 'stats.html'
    })
export class StatsPage {

    daystatschart: any;
    allstatschart: any;

    start: Date = new Date(new Date().getTime() - 1000 * 3600 * 24 * 365);
    end: Date = new Date();

    alltype: string = 'line';
    todaytype: string = 'pie';

    ngAfterViewInit() {
        this.allstatschart = c3.generate({
            bindto: '#allstatschart',
            data: {
                columns: [
                    ['needs', 30, 200, 100, 400, 150, 250],
                    ['answered needs', 60, 100, 110, 450, 10, 200],
                    ['roams', 50, 20, 10, 40, 15, 25]
                ]
            }
        });
        this.daystatschart = c3.generate({
            bindto: '#daystatschart',
            data: {
                type: 'pie',
                columns: [
                    ['needs', 3],
                    ['answered needs', 5],
                    ['roams', 1]
                ]
            },
            pie: {
                label: {
                    format: (value, ratio, id) => {
                        return d3.format('')(value);// + ' / ' + ratio + '%'; // d3.format('')(value);
                    }
                }
            }
        });
    }

    changetodaytype() {
        this.todaytype = (this.todaytype === 'pie' ? 'bar' : 'pie');
        this.daystatschart.transform(this.todaytype);
    }

    changealltype() {
        this.alltype = (this.alltype === 'line' ? 'bar' : 'line');
        this.allstatschart.transform(this.alltype);
    }

}