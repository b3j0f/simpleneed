import { Component , ViewChild } from '@angular/core';
import { MapComponent } from './../../components/map-component/map-component';
import { HTTP } from '../../providers/http';
import { LoadingController, NavController } from 'ionic-angular';
import { ACTION_FILTER, ACTION_CRUP, LocatedElementPage } from '../located-element/located-element';

@Component({
    selector: 'page-map',
    templateUrl: 'map.html',
    providers: [ HTTP ]
})
export class MapPage {

    @ViewChild('map') mapcomponent: MapComponent;
    map: any;

    _filter: any = {
        needs: [],
        sick: false,
        gender: 'other',
        mood: 2,
        handicapped: false,
        people: 1,
        durations: {lower: 2, upper: 8}
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
                let elt = {'item': undefined, 'kind': undefined};
                let item = elt.item;
                let kind = elt.kind;
                item['longitude'] = event.coordinate[0];
                item['latitude'] = event.coordinate[1];
                this.openCRUP(kind, item);
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
        console.log(this, filter);
        let apifilter = this.getAPIFilter(filter);

        let loading = this.loadingCtrl.create();
        loading.present();

        this.http.get(kind, apifilter).then(
            data => {
                loading.dismiss();
            }
        );
    }

    getAPIFilter(filter) {
        let result = {};
        let applyproperty = (name, suffix: string = '') => {
            if (filter[name] != undefined) {
                result[name + suffix] = filter[name];
            }
        }

        applyproperty('people', '__lte');
        applyproperty('startdatetime', '__gte');
        applyproperty('enddatetime', '__lte');
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
            let loading = this.loadingCtrl.create();
            loading.present();
            method(kind, item).then(() => {
                loading.dismiss(); this.refresh(kind, item);
            });
        } else {
            this.refresh(kind, item);
        }
    }

}
