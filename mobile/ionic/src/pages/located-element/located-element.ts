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
    lastmessage: string = '';

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
        this.item.durations = {};
        let startts = this.item.startts;
        if (startts === undefined) {
            this.item.durations.lower = 0;
        } else {
            this.item.durations.lower = Math.floor(
                Math.abs(new Date().getTime() / 1000 - startts) / 3600
            );
        }
        let endts = this.item.endts;
        if (endts === undefined) {
            this.item.durations.upper = 8;
        } else {
            this.item.durations.upper = Math.ceil(
                Math.abs(new Date().getTime() / 1000 - endts) / 3600
            );
        }
    }

    doAction() {
        let now = new Date().getTime() / 1000;
        let lower = this.item.durations.lower;
        if (lower === 0 && this.item.startts !== undefined) {
            this.item.startts = Math.min(
                this.item.startts,
                now + lower * 3600
            )
        } else {
            this.item.startts = now + lower * 3600
        }
        this.item.endts = now + this.item.durations.upper * 3600;
        if (this.lastmessage !== '') {
            this.item.messages.push(this.lastmessage);
        }
        this.navCtrl.pop();
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

    hasPwd() {
        return this.item.haspwd || (
            this.item.pwd !== undefined && this.item.pwd !== ''
        );
    }

    islocked() {
        return this.hasPwd();
    }

}
