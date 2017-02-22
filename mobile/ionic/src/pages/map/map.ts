import { Component , ViewChild } from '@angular/core';
import { MapComponent } from './../../components/map-component/map-component';
import { HTTP } from '../../providers/http';
import { NavController, LoadingController } from 'ionic-angular';
import { CRUPPage } from '../crup/crup';
//import { Geolocation, DeviceOrientation, CompassHeading, Network, Diagnostic, CallNumber, AppRate } from 'ionic-native';
import { Geolocation, /*Shake*/ } from 'ionic-native';
import { Storage } from '@ionic/storage';

@Component({
    selector: 'page-map',
    templateUrl: 'map.html',
    providers: [ HTTP, Storage ]
})
export class MapPage {

    @ViewChild('map') mapcomponent: MapComponent;

    needs: any = {
        'health': true,
        'money': true,
        'accomodation': true,
        'hygiene': true,
        'food': true,
        'snack': true,
        'clothes': true,
        'stuffs': true,
        'company': true
    };
    types: any = {
        'roams': true,
        'needlocations': true,
        'supplylocations': true
    };

    constructor(
        public navCtrl: NavController,
        public http: HTTP,
        public loadingCtrl: LoadingController,
        public storage: Storage
    ) {

    }

    ngAfterViewInit() {
        this.mapcomponent.edit = (elt, coordinate) => this.edit(
            elt, coordinate
        );
        this.mapcomponent.getelts = (extent, callback) => this.getLocatedElements(extent, callback);
        /*let watch = Shake.startWatch().subscribe(() => {
            this.refresh();
        });*/
    }

    getLocatedElements(extent, callback) {
        let endts = new Date().getTime() / 1000;
        this.http.get(
            'locatedelements/',
            {
                startts__lte: endts,
                endts__gte: endts,
                needs: this.needs,
                longitude__gte: extent[0],
                longitude__lte: extent[2],
                latitude__lte: extent[3],
                latitude__gte: extent[1],
            }, undefined, true
        ).then(data => {
            let result = data['results'];
            let elts = {};
            result.forEach((elt) => {
                if (this.types[elt.type]) {
                    elts[elt.id] = elt;
                }
            });
            callback(elts);
        });
    }

    findLocation() {
        let loading = this.loadingCtrl.create();
        loading.present();
        Geolocation.getCurrentPosition().then(
            resp => {
                loading.dismiss();
                this.mapcomponent.setCenter(
                    resp.coords.longitude,
                    resp.coords.latitude
                );
                this.refresh();
            }
        ).catch(
            error => {
                loading.dismiss();
                console.error(error);
                this.refresh();
            }
        );
    }

    edit(elt, coordinate) {
        let item;
        if (elt === undefined) {
            item = {
                type: 'needlocation',
                longitude: coordinate[0],
                latitude: coordinate[1],
                needs: [],
                messages: [],
                needlocations: [],
                name: ''
            }
        } else {
            item = elt.item;
        }
        this.navCtrl.push(
            CRUPPage,
            {
                item: item,
                save: (item) => this.save(item),
                delete: (item) => this.delete(item)
            }
        );
    }

    save(item) {
        for(let pos in item.needs) {
            let need = item.needs[pos];
            item.needs[pos] = this.http.root + 'needs/' + need + '/';
        }
        let method = (url, options) => item.id === undefined ? this.http.post(url, options) : this.http.put(url + item.id, options);
        method(item.type + 's/', item
            ).then(
            data => this.refresh()
        ).catch(error => this.refresh());
    }

    delete(item) {
        this.http.delete(item.type + 's/' + item.id).then(
            data => this.refresh()
        ).catch(
            data => this.refresh()
        );
    }

    searchNeed(need: string) {
        if (this.needs[need]) {
            for(let key in this.needs) {
                this.needs[key] = false;
            }
            this.needs[need] = true;
        } else {
            this.needs[need] = true;
        }
        this.refresh();
    }

    searchLE(le: string) {
        if (this.types[le]) {
            for(let key in this.types) {
                this.types[key] = false;
            }
            this.types[le] = true;
        } else {
            this.types[le] = true;
        }
        this.refresh();
    }

    getNeedColor(need: string) {
        return this.needs[need] ? 'primary' : 'light';
    }

    getLEColor(le: string) {
        return this.types[le] ? le : 'light';
    }

    refresh() {
        this.storage.set('needs', this.needs);
        this.storage.set('types', this.types);
        this.mapcomponent.refresh();
    }

}
