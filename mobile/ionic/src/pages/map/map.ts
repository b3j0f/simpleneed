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
        haspwd: false,
        messages: [],
        description: '',
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

    refreshtask: any;

    constructor(
        public navCtrl: NavController,
        public http: HTTP,
        public loadingCtrl: LoadingController
    ) {

    }

    ngAfterViewInit() {
        this.mapcomponent.edit = (elt, coordinate) => this.edit(
            elt, coordinate
        );
        this.refresh();
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
            }
        ).catch(
            error => {
                loading.dismiss();
                console.error(error);
            }
        );
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

    edit(elt, coordinate) {
        let item, kind;
        if (elt === undefined) {
            item = {
                longitude: coordinate[0],
                latitude: coordinate[1],
                needs: [],
                haspwd: false
            }
            for(let key in this._filter) {
                item[key] = this._filter[key];
            }
            kind = 'needlocation';
        } else {
            item = elt.item;
            kind = elt.kind;
        }
        this.openCRUP(kind, item);
    }

    openCRUP(kind, item) {
        this.navCtrl.push(
            LocatedElementPage, {
                kind: kind,
                item: item,
                action: ACTION_CRUP,
                callback: (kind, item) => {
                    this.save(kind, item);
                }
            }
        );
    }

    refresh() {
        let filter = {'endts__gte': new Date().getTime() / 1000};
        this.http.get('locatedelements/', filter).then(
            data => {
                console.log(data);
                this.mapcomponent.addLocatedElements(data.results);
            }
        );
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
        applyproperty('startts', '__lte', 'endts');
        applyproperty('endts', '__gte', 'startts');
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
        for(let pos in item.needs) {
            let need = item.needs[pos];
            item.needs[pos] = this.http.root + 'needs/' + need + '/';
        }
        this.process(ACTION_CRUP, kind, item);
    }

    process(action, kind, item) {
        if (action === ACTION_CRUP) {
            let method = (url, options) => item.id === undefined ? this.http.post(url, options) : this.http.put(url, options);
            method(kind + 's/', item).then(
                data => this.mapcomponent.addLocatedElements([data])
            ).catch(error => this.refresh());
        } else {
            this.refresh();
        }
    }

}
