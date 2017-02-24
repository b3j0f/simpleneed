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

    savecallback: any;
    delcallback: any;
    item: any;

    constructor(
        public navCtrl: NavController, navParams: NavParams,
        public toastCtrl: ToastController
    ) {
        this.item = navParams.get('item');
        this.savecallback = navParams.get('save');
        this.delcallback = navParams.get('delete');
    }

    save() {
        this.navCtrl.pop();
        this.savecallback(this.item);
    }

    delete() {
        this.navCtrl.pop();
        this.delcallback(this.item);
    }

    modified() {
        let result = this.item.id && true;
        if (! result) {
            result = this.item.needs.length > 0;
        }
        if (result) {
            if (this.item.type === 'roam') {
                result = this.item.name && true;
            }
        }
        return result;
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
            'http://api.simpleneed.net/' + this.item.type + 's/' + this.item.id
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

    getColor(name) {
        return this.hasNeed(name) ? 'primary' : 'light';
    }

}
