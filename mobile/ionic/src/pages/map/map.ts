import { Component , ViewChild } from '@angular/core';
import { MapComponent } from './../../components/map-component/map-component';
import { HTTP } from '../../providers/http';
import { NavController, LoadingController } from 'ionic-angular';
import { CRUPPage } from '../crup/crup';
//import { Geolocation, DeviceOrientation, CompassHeading, Network, Diagnostic, CallNumber, AppRate } from 'ionic-native';
import { Geolocation, /*Shake*/ } from 'ionic-native';

@Component({
    selector: 'page-map',
    templateUrl: 'map.html',
    providers: [ HTTP ]
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
        'stuffs': true
    };
    locatedElements: any = {
        'roams': true,
        'needlocations': true
    };

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
        /*let watch = Shake.startWatch().subscribe(() => {
            this.refresh();
        });*/
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
                longitude: coordinate[0],
                latitude: coordinate[1],
                needs: [],
                messages: []
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

    refresh() {
        let filter = {'endts__gte': new Date().getTime() / 1000};
        this.http.get('locatedelements/', filter).then(
            data => this.mapcomponent.addLocatedElements(data['results'])
        ).catch(error => console.error(error));
    }

    save(item) {
        let kind = item.needs === undefined ? 'roam' : 'needlocation';
        if (kind === 'needlocation') {
            for(let pos in item.needs) {
                let need = item.needs[pos];
                item.needs[pos] = this.http.root + 'needs/' + need + '/';
            }
        }
        let method = (url, options) => item.id === undefined ? this.http.post(url, options) : this.http.put(url + item.id, options);
        method(kind + 's/', item).then(
            data => {
                this.mapcomponent.addLocatedElements([data]);
                this.refresh();
            }
        ).catch(error => this.refresh());
    }

    delete(item) {
        let url = item.needs === undefined ? 'roam' : 'needlocation';
        this.http.delete(url + 's/' + item.id).then(
            data => this.refresh()
        ).catch(
            data => this.refresh()
        );
    }

    searchNeed(need: string) {
        this.needs[need] = !this.needs[need];
        this.refresh();
    }

    searchLE(le: string) {
        this.locatedElements[le] = !this.locatedElements[le];
        this.refresh();
    }

    getNeedColor(need: string) {
        return this.needs[need] ? 'primary' : 'light';
    }

    getLEColor(le: string) {
        return this.locatedElements[le] ? 'primary' : 'light';
    }

}
