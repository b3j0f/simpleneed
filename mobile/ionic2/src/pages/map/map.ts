import { Component , ViewChild } from '@angular/core';
import { MapComponent } from './../../components/map-component/map-component';
import { HTTP } from '../../providers/http';
import { NavController, LoadingController } from 'ionic-angular';
import { CRUPPage } from '../crup/crup';
//import { Geolocation, DeviceOrientation, CompassHeading, Network, Diagnostic, CallNumber, AppRate } from 'ionic-native';
import { Geolocation, /*Shake*/ } from 'ionic-native';
import { Storage } from '@ionic/storage';

import { LegendPage } from '../legend/legend';

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

    showLegend() {
        this.navCtrl.push(LegendPage);
    }

    getLocatedElements(extent, callback) {
        let endts = new Date().getTime() / 1000;
        let filter_needs = [];
        Object.keys(this.needs).forEach(
            (need) => (this.needs[need] && filter_needs.push(need))
        );
        this.http.get(
            'locatedelements/',
            {
                startts__lte: endts,
                endts__gte: endts,
                needs__in: filter_needs.join(),
                longitude__gte: extent[0],
                longitude__lte: extent[2],
                latitude__lte: extent[3],
                latitude__gte: extent[1],
            }, undefined, false
        ).then(data => {
            let result = data['results'];
            let elts = {};
            let updateneeds = (elt) => {
                let needs = [];
                elt.needs.forEach((need) => {
                    let splitted = need.split('/');
                    needs.push(splitted[splitted.length - 2]);
                });
                elt.needs = needs;
            }
            result.forEach((elt) => {
                if (this.types[elt.type + 's']) {
                    elts[elt.id] = elt;
                    elt.name = elt.schild.fields.name;
                    elt.emergency = elt.schild.fields.emergency;
                    updateneeds(elt);
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
            item = elt;
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
        let method = (url, options) => item.id === undefined ? this.http.post(url, options) : this.http.put(url + item.id + '/', options);
        method(item.type + 's/', item
            ).then(
            (data) => this.refresh()
        ).catch(error => this.refresh());
    }

    delete(item) {
        let data = {
            endts: new Date().getTime() / 1000,
            needs: [],
            latitude: item.latitude,
            longitude: item.longitude,
            messages: item.messages || [],
            name: item.name,
            needlocations: item.needlocations || []
        };
        this.http.put(item.type + 's/' + item.id + '/', data).then(
            (data) => this.refresh()
        ).catch(
            (data) => this.refresh()
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
