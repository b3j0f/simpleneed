import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

export let ACTION_FILTER: string = 'filter';
export let ACTION_CRUP: string = 'crup';

@Component({
    selector: 'page-located-element',
    templateUrl: 'located-element.html'
})
export class LocatedElementPage {

    action: string = 'filter';
    callback: any;
    item: any;
    kind: string = 'needlocation';
    duration: Array<number> = [];

    constructor(public navCtrl: NavController, navParams: NavParams) {
        this.action = navParams.get('action');
        this.callback = navParams.get('callback');
        this.kind = navParams.get('kind') || 'needlocation';

        let item = navParams.get('item');
        this.fillForm(item);
    }

    isFilter() {
        return this.action === ACTION_FILTER;
    }

    fillForm(item) {
        // fill this form with item
        if (item !== undefined) {
            this.item = {};
            for(let key in item) {
                this.item[key] = item[key];
            }
            if (item.durations === undefined) {
                item.durations = [];
                if (item.startdatetime !== undefined) {
                    item.durations.lower = Math.round(
                        Math.abs(
                            item.startdatetime.getTime() - new Date().getTime()
                        ) / 3600000
                    );
                } else {
                    item.durations.lower = 2;
                }
                if (item.enddatetime !== undefined) {
                    item.durations.upper = Math.round(
                        Math.abs(
                            item.enddatetime.getTime() - new Date().getTime()
                        ) / 3600000
                    );
                } else {
                    item.durations.upper = 8;
                }
            } else {
                item.durations = [2, 8];
            }
        }
    }

    doAction() {
        this.item.startdatetime = new Date(
            new Date().getTime() + this.item.durations.lower * 3600000
        );
        this.item.enddatetime = new Date(
            new Date().getTime() + this.item.durations.upper * 3600000
        );
        this.navCtrl.pop();
        this.callback(this.kind, this.item);
    }

    clickNeed(name) {
        this.item[name] = !this.item[name];
    }

}
