import * as c3 from 'c3';

import { Component } from '@angular/core';
import { HTTP } from '../../providers/http';

@Component({
    selector: 'page-stats',
    templateUrl: 'stats.html',
    providers: [HTTP]
    })
export class StatsPage {

    totalchart: any;
    historychart: any;
    c3totalchart: any;
    c3historychart: any;

    roams: number = 0;
    supplies: number = 0;

    constructor(
        public http: HTTP
        ) {

    }

    ngAfterViewInit() {
        this.c3totalchart = c3.generate({
            bindto: '#totalchart',
            data: {
                columns: [],
                type: 'pie'
                },
                tooltip: {
                    format: {
                        value: function (value, ratio, id, index) { return value; }
                    }
                }
            }
            );

        this.c3historychart = c3.generate({
            bindto: '#historychart',
            data: {
                x: 'x',
                columns: [
                ['x', 0]
                ],
                type: 'line'
                },
                axis: {
                    x: {
                        type: 'timeseries',
                        tick: {
                            format: '%d/%m/%Y'
                        }
                    }
                }
            }
            );

        this.refresh();

    }

    refresh() {
        this.http.get(
            'stats/',
            {'order_by': 'ts'},
            undefined,
            false
            ).then(data => {
                let results = data['results'];
                let totalcolumns = [];
                let historycolumns = [];
                let translate = {'needs': 'needs', 'answeredneeds': 'answered needs', 'roams': 'roams', 'supplies': 'helps'};
                if (results.length === 0) {
                    totalcolumns = [
                    ['needs', 0],
                    ['answered needs', 0],
                    ['roams', 0],
                    ['helps', 0]
                    ];
                    historycolumns = [
                    ['x', 0],
                    ['needs', 0],
                    ['answered needs', 0],
                    ['roams', 0],
                    ['helps', 0]
                    ];
                    } else {
                        let _totalcolumns = {
                            'needs': 0,
                            'answered needs' : 0,
                            'roams': 0,
                            'helps': 0
                        };
                        let namedcolumns = Array();
                        namedcolumns.push('x');
                        results.forEach(stat => namedcolumns.push(stat.ts * 1000));
                        historycolumns.push(namedcolumns);
                        for(let name in translate) {
                            let translation = translate[name];
                            namedcolumns = [translation];
                            results.forEach( stat => {
                                let value = stat[name];
                                namedcolumns.push(value);
                                _totalcolumns[translation] += value;
                                });
                            historycolumns.push(namedcolumns);
                        }
                        ['roams', 'supplies'].forEach( key => {
                            let value = _totalcolumns[translate[key]];
                            this[key] = value;
                            });
                        ['needs', 'answered needs'].forEach(type => {
                            totalcolumns.push([type, _totalcolumns[type]]);
                            });
                    }
                    this.c3totalchart.load({
                        'columns': totalcolumns
                        });
                    this.c3historychart.load({
                        'columns': historycolumns
                        });
                    setTimeout(() => this.refresh(), 10000);
                    return true;
                }
                );
        }
    }