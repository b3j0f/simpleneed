import {Component, ViewChild} from '@angular/core';

import * as ol from 'openlayers';

@Component({
    selector: 'map-component',
    templateUrl: 'map-component.html'
})
export class MapComponent {

    @ViewChild('map') map;

    /*constructor(public renderer: Renderer) {
    }*/

  ngAfterViewInit() {
    console.log(this.map);

    //var projection = ol.proj.get('EPSG:3857');

    //var map =
    new ol.Map({
      target: "map",
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([8.92471, 46.07257]),
        zoom: 4
      }),
      controls: ol.control.defaults({
          attributionOptions: {
            collapsible: false
          }
        }),
    });
  }
}
