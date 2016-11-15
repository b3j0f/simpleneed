import { Component , ViewChild } from '@angular/core';
import { MapComponent } from './../../components/map-component/map-component';
import { HTTP } from '../../providers/http';
import { NavController, LoadingController } from 'ionic-angular';
import { ACTION_FILTER, ACTION_CRUP, LocatedElementPage } from '../located-element/located-element';
//import { Geolocation, DeviceOrientation, CompassHeading, Network, Diagnostic, CallNumber, AppRate } from 'ionic-native';
import { Geolocation } from 'ionic-native';

@Component({
    selector: 'page-map',
    templateUrl: 'map.html',
    providers: [ HTTP ]
})
export class MapPage {

    @ViewChild('map') mapcomponent: MapComponent;
    map: any;

    // pos: Array<number> = Geolocation.getCurrentPosition()

    _filter: any = {
        needs: [],
        //sick: false,
        //gender: 'other',
        //mood: 2,
        //handicapped: false,
        //people: 1,
        durations: {lower: 0, upper: 8}
    };
    filter: any = this._filter;
    kind: string = 'needlocation';

    needlocations: any = [];
    roams: any = [];

    constructor(
        public navCtrl: NavController,
        public http: HTTP,
        public loadingCtrl: LoadingController
    ) {

    }

    ngAfterViewInit() {
        this.mapcomponent.map.on(
            'singleclick', (event) => {
                console.log(event);
                if (event.elt === undefined) {
                    let item = {
                        longitude: event.coordinate[0],
                        latitude: event.coordinate[1]
                    }
                    for(let key in self._filters) {
                        item[key] = self._filters[key];
                    }
                    let kind = 'needlocation';
                } else {
                    let item = elt.item;
                    let kind = elt.kind;
                }

                this.openCRUP(kind, item);
            }
        );
    }

    findLocation() {
        let loading = this.loadingCtrl.create();
        loading.present();
        Geolocation.getCurrentPosition().then(
            resp => {
                loading.dismiss();
                console.log(resp);
                this.mapcomponent.map.getView().SetCenter(
                    resp.coords.longitude,
                    resp.coords.latitude
                );
            }
        ).catch(error => {
            loading.dismiss();
            console.log(error);
        });
    }

    openFilter() {
        this.navCtrl.push(
            LocatedElementPage, {
                kind: this.kind,
                item: this.filter,
                callback: (kind, item) => this.applyFilter(kind, item),
                action: ACTION_FILTER,
            }
        );
    }

    openCRUP(kind, item) {
        this.navCtrl.push(
            LocatedElementPage, {
                kind: kind,
                item: item,
                action: ACTION_CRUP,
                callback: (kind, item) => this.save(kind, item)
            }
        );
    }

    refresh(kind, filter) {
        let apifilter = this.getAPIFilter(filter);
        this.http.get(kind + 's', apifilter);
    }

    getAPIFilter(filter) {
        let result = {};
        let applyproperty = (
            name, suffix: string = '', name2: string = null
        ) => {
            if (name2 === null) {
                name2 = name;
            }
            if (filter[name2] != undefined) {
                result[name + suffix] = filter[name2];
            }
        }

        applyproperty('people', '__lte');
        applyproperty('startdatetime', '__lte', 'enddatetime');
        applyproperty('enddatetime', '__gte', 'startdatetime');
        applyproperty('description', '__iregex');
        applyproperty('name');
        applyproperty('mood');
        applyproperty('needs');
        applyproperty('handicaped');
        applyproperty('sick');
        applyproperty('gender');
        applyproperty('roam');

        return result;
    }

    applyFilter(kind, item) {
        this.filter = item;
        this.process(ACTION_FILTER, kind, item);
    }

    save(kind, item) {
        this.process(ACTION_CRUP, kind, item);
    }

    process(action, kind, item) {
        if (action === ACTION_CRUP) {
            let method = 'id' in item ? this.http.put : this.http.post;
            method(kind + 's', item).then(
                data => this.refresh(kind, data)
            ).catch(error => this.refresh(kind, item));
        } else {
            this.refresh(kind, item);
        }
    }

}
