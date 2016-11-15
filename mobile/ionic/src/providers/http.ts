import { ToastController, LoadingController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Http } from '@angular/http';
/*
    Generated class for the HTTP provider.

    See https://angular.io/docs/ts/latest/guide/dependency-injection.html
    for more info on providers and Angular 2 DI.
*/
@Injectable()
export class HTTP {

    root: string = 'http://ovh:8000/rest/v1/';
    maxduration: number = 5000;

    constructor(
        public http: Http,
        private toastCtrl: ToastController,
        private loadingCtrl: LoadingController
    ) {

    }

    getpath(lookup, data) {
        let result = lookup + '';
        if (data !== undefined) {
            if (result.indexOf('?') === -1) {
                result += '?';
            }
            for(let key in data) {
                result += (key + '=' + data[key] + '&');
            }
        }
        return result;
    }

    post(lookup: string, data: any = undefined, headers: any = undefined) {
        return this.process('post', lookup, data, headers);
    }
    get(lookup: string, data: any = undefined, headers: any = undefined) {
        return this.process('get', this.getpath(lookup, data), data, headers);
    }
    put(lookup: string, data: any = undefined, headers: any = undefined) {
        return this.process('put', lookup, data, headers);
    }
    delete(lookup: string, data: any = undefined, headers: any = undefined) {
        return this.process('delete', this.getpath(lookup, data), data, headers);
    }

    process(
        method: string, path: string, data: any, headers: any
    ) {
        let options = {
            method: method,
            body: data,
            headers: headers
        };

        let loading = this.loadingCtrl.create();
        loading.present();
        console.log('process', options, loading);

        return new Promise(resolve => {
            this.http[method](this.root + path)
                .map(res => res.json())
                .subscribe(data => {
                    loading.dismiss();
                    resolve(data);
                });
        });
    }

}
