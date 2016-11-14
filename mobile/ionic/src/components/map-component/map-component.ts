import { Component } from '@angular/core';

import * as ol from 'openlayers';

@Component({
    selector: 'map-component',
    templateUrl: 'map-component.html'
    })
export class MapComponent {

    coordinate: any = [0, 0];
    zoom: number = 2;

    map: any;

    refresh(coordinate, zoom) {
        if (coordinate == undefined) {
            coordinate = this.coordinate;
        }
        if (zoom == undefined) {
            zoom = this.zoom;
        }
        this.map.getView().setCenter(coordinate);
        this.map.getView().setZoom(zoom);
    }

    ngAfterViewInit() {
        //var projection = ol.proj.get('EPSG:3857');

        this.map = new ol.Map({
            target: "map",
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                })
            ],
            view: new ol.View({
                center: ol.proj.fromLonLat(this.coordinate),
                zoom: this.zoom,
                minZoom: 2
            }),
            controls: ol.control.defaults({
                rotate: false,
            }),
        });
    }
}
