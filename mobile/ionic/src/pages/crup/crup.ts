import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Clipboard, SocialSharing } from 'ionic-native';
//import { SocialSharing, Shake, SecureStorage, Globalization } from 'ionic-native';

@Component({
    selector: 'page-crup',
    templateUrl: 'crup.html'
})
export class CRUPPage {

    @ViewChild('sharefab') sharefab: any;

    mydate: any;
    savecallback: any;
    delcallback: any;
    item: any;
    kind: string = 'needlocation';
    duration: Array<number> = [];
    lastmessage: string = '';

    durations: any = {};

    constructor(
        public navCtrl: NavController, navParams: NavParams,
        public toastCtrl: ToastController
    ) {
        this.item = navParams.get('item');
        this.kind = this.item.needs === undefined ? 'roam' : 'needlocation';
        this.savecallback = navParams.get('save');
        this.delcallback = navParams.get('delete');

        this.fillForm();
    }

    fillForm() {
        // fill this form with item
        this.durations = {};
        let startts = this.item.startts;
        if (startts === undefined) {
            this.durations.lower = 0;
        } else {
            this.durations.lower = Math.floor(
                Math.abs(new Date().getTime() / 1000 - startts) / 3600
            );
        }
        let endts = this.item.endts;
        if (endts === undefined) {
            this.durations.upper = 8;
        } else {
            this.durations.upper = Math.ceil(
                Math.abs(new Date().getTime() / 1000 - endts) / 3600
            );
        }
    }

    save() {
        let now = new Date().getTime() / 1000;
        let lower = this.durations.lower;
        if (lower === 0 && this.item.startts !== undefined) {
            this.item.startts = Math.min(
                this.item.startts,
                now + lower * 3600
            )
        } else {
            this.item.startts = now + lower * 3600
        }
        this.item.endts = now + this.durations.upper * 3600;
        if (this.lastmessage !== '') {
            this.item.messages.push(this.lastmessage);
        }
        this.navCtrl.pop();
        this.savecallback(this.item);
    }

    delete() {
        this.delcallback(this.item);
    }

    edited() {
        return true;
    }

    copy() {
        Clipboard.copy(this.item.toString()).then(
            () => this.toastCtrl.create({
                    message: 'Element copied in clipboard !',
                    duration: 700
                })
        ).catch(
            error => this.toastCtrl.create({
                message: 'Error "' + error + '" on copy !',
                duration: 700
            })
        );
    }

    share (app) {
        SocialSharing.shareVia(
            app,
            this.item.toString(),
            'simple need',
            undefined,
            'http://api.simpleneed.net/' + this.kind + 's/' + this.item.id
        ).then(
            () => this.toastCtrl.create({
                message: 'Element shared to ' + app + '!',
                duration: 700
            })
        ).catch(
            error => this.toastCtrl.create({
                message: 'Error "' + error + '" on sharing on ' + app,
                duration: 700
            })
        )
        this.sharefab.close();
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
