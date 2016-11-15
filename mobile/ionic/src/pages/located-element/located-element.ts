import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
//import { SocialSharing, Shake, SecureStorage, Globalization } from 'ionic-native';

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
        this.item = {};
        for(let key in item) {
            this.item[key] = item[key];
        }
        this.fillForm();
    }

    isFilter() {
        return this.action === ACTION_FILTER;
    }

    fillForm() {
        // fill this form with item
        if (this.item.durations === undefined) {
            this.item.durations = {};
            let startdatetime = this.item.startdatetime;
            if (startdatetime === undefined) {
                this.item.startdatetime = new Date();
                this.item.duration.lower = 0;
            } else {
                this.item.durations.lower = Math.floor(
                    Math.max(
                        Math.abs(
                            startdatetime.getTime() - new Date().getTime()
                        ) / 3600000,
                        0
                    )
                );
            }
            let enddatetime = this.item.enddatetime;
            if (enddatetime !== undefined) {
                this.item.durations.upper = Math.round(
                    Math.abs(
                        enddatetime.getTime() - new Date().getTime()
                    ) / 3600000
                );
            } else {
                this.item.durations.upper = 8;
            }
        } else {
            this.item.durations = {
                lower: Math.floor(
                    Math.max(this.item.startdatetime.getTime() / 3600000, 0)
                ),
                upper: Math.ceil(this.item.enddatetime.getTime() / 3600000, 0)
            };
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
        console.log('FFFF', this.callback);
        this.callback(this.kind, this.item);
    }

    clickNeed(name) {
        let index = this.item.needs.indexOf(name);
        if (index === -1) {
            this.item.needs.push(name);
        } else {
            this.item.needs.splice(index, 1);
        }
    }

    hasNeed(name) {
        return this.item.needs.indexOf(name) !== -1;
    }

}
