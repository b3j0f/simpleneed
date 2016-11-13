import {NavController} from 'ionic-angular';
import {Component, ViewChild} from '@angular/core';
import {MapComponent} from './../../components/map-component/map-component';
import {FilterPage} from './../filter/filter';
import {CRUPPage} from './../crup/crup';

@Component({
    selector: 'page-map',
    templateUrl: 'map.html'
})
export class MapPage {

    @ViewChild('map') mapcomponent: MapComponent;

    filter: any;
    needlocations: any = [];
    roams: any = [];

    constructor(public navCtrl: NavController) {

    }

    ngAfterViewInit() {
        console.log(this.mapcomponent);
    }

    openFilter() {
        console.log(this.mapcomponent);
        this.navCtrl.push(FilterPage, {parent: this, filter: this.filter});
    }

    openCRUP(elt) {
        this.navCtrl.push(CRUPPage, {elt: elt, parent: this});
    }

    refresh(filter) {
        this.filter = filter;
        this.needlocations = [];  // http call
        for(let needlocation in this.needlocations) {
            this.mapcomponent.map.addMarker
        }
        console.log('refresh: ' + filter);
    }

    save(params) {
        console.log('save: ' + params);
    }

}
