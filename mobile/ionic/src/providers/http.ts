import { ToastController, LoadingController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Http, Request, RequestMethod, RequestOptions, Response, Headers } from '@angular/http';
/*
    Generated class for the HTTP provider.

    See https://angular.io/docs/ts/latest/guide/dependency-injection.html
    for more info on providers and Angular 2 DI.
*/
@Injectable()
export class HTTP {

    root: string = 'http://localhost:8000/rest/v1/';

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
        return this.process('Post', lookup, data, headers);
    }
    get(lookup: string, data: any = undefined, headers: any = undefined) {
        return this.process('Get', this.getpath(lookup, data), data, headers);
    }
    put(lookup: string, data: any = undefined, headers: any = undefined) {
        return this.process('Put', lookup, data, headers);
    }
    delete(lookup: string, data: any = undefined, headers: any = undefined) {
        return this.process('Delete', this.getpath(lookup, data), data, headers);
    }

    process(
        method: string, path: string, data: any, headers: any
    ) {
        let body = JSON.stringify(data);
        let _headers = new Headers(
            { 'Content-Type': 'application/json;charset=utf-8' }
        );

        let requestoptions: RequestOptions = new RequestOptions({
            method: RequestMethod[method],
            url: this.root + path,
            headers: _headers,
            body: body
        })

        let loading = this.loadingCtrl.create();
        loading.present();

        return new Promise(
            resolve =>
                this.http.request(new Request(requestoptions))
                    .map((res: Response) => { return res.json(); })
                    .subscribe(
                        data => {
                            loading.dismiss();
                            resolve(data)
                        }
                    )
            ).catch(error => console.error(error));
    }

}
