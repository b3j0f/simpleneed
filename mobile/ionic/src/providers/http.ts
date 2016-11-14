import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
    Generated class for the HTTP provider.

    See https://angular.io/docs/ts/latest/guide/dependency-injection.html
    for more info on providers and Angular 2 DI.
*/
@Injectable()
export class HTTP {

    root: string = '/rest/v1/';
    maxduration: number = 5000;

    constructor(public http: Http) {

    }

    getpath(lookup, data) {
        let result = lookup + '';
        if (data != undefined) {
            if (result.indexOf('?') != -1) {
                result += '?';
            }
            for(let key in data) {
                result += (key + '=' + data[key] + '&');
            }
        }
        return result;
    }

    post(lookup: string, data: any = {}, headers: any = {}) {
        return this.process('post', lookup, data, headers);
    }
    get(lookup: string, data: any = {}, headers: any = {}) {
        return this.process('get', this.getpath(lookup, data), data, headers);
    }
    put(lookup: string, data: any = {}, headers: any = {}) {
        return this.process('put', lookup, data, headers);
    }
    delete(lookup: string, data: any = {}, headers: any = {}) {
        return this.process('delete', this.getpath(lookup, data), data, headers);
    }

    process(
        method: string, path: string, data: any, headers: any
    ) {
        let options = {
            data: data,
            headers: headers
        };

        return this.http[method](this.root + path, options);
    }

}
