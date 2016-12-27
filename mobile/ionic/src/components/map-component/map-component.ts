import { Component } from '@angular/core';

import * as ol from 'openlayers';

@Component({
    selector: 'map-component',
    templateUrl: 'map-component.html'
    })
export class MapComponent {

    coordinate: any = [0, 0];
    zoom: number = 5;

    map: any;

    features: ol.source.Vector = new ol.source.Vector();

    edit: any;  // edition function.

    getClusterStyle(size) {
        return new ol.style.Style({
            image: new ol.style.Circle({
                radius: 10 + 1.5 * size,
                stroke: new ol.style.Stroke({
                    color: '#fff'
                }),
                fill: new ol.style.Fill({
                    color: '#3399CC'
                })
            }),
            text: new ol.style.Text({
                text: size.toString(),
                fill: new ol.style.Fill({
                    color: '#fff'
                })
            })
        });
    }

    getLocatedElementStyle(feature) {
        //let kind = feature.elt.needs === undefined ? 'roam' : 'needlocation';

        return new ol.style.Style({
            image: new ol.style.Icon({
                src: 'https://openlayers.org/en/v3.19.1/examples/data/icon.png'
            })
        });
    }

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
        let clusterSource = new ol.source.Cluster({
            distance: parseInt('40', 10),
            source: this.features
        });

        let styleClusterCache = {};
        let clusters = new ol.layer.Vector({
            source: clusterSource,
            style: (feature) => {
                let features = feature.get('features');
                let size = features.length;
                let style = styleClusterCache[size];
                if (!style) {
                    if (size == 1) {
                        style = this.getLocatedElementStyle(features[0]);
                    } else {
                        style = this.getClusterStyle(size);
                        styleClusterCache[size] = style;
                    }
                }
                return style;
            }
        });

        this.map = new ol.Map({
            target: 'map',
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                }),
                clusters
            ],
            view: new ol.View({
                projection: 'EPSG:4326',
                center: ol.proj.fromLonLat(this.coordinate),
                zoom: this.zoom,
                minZoom: 2
            }),
            controls: ol.control.defaults({
                rotate: false,
            }),
        });

        this.map.on('singleclick', (event, layer) => {
            let coordinate = event.coordinate;
            let feature = this.map.forEachFeatureAtPixel(
                event.pixel,
                feature => { return feature; }
            ) || {'elt': undefined};
            this.edit(feature.elt, coordinate);
        });

        // select interaction working on "singleclick"
        var selectSingleClick = new ol.interaction.Select({
            condition: ol.events.condition.singleClick,
            style: (feature, q) => {
                this.features.toString();
                let features = feature.get('features');
                return null;
            },
            //layers: [clusterSource.getSource()]
        });
        this.map.addInteraction(selectSingleClick);
        //this.map.addInteraction(selectSingleClick);
        /*selectSingleClick.on(
            'select',
            event => {
                let features = event.target.getFeatures();
                if (features.length === 1) {
                    this.edit(features[0].elt, event.coordinate);
                }
            }
        );*/

        // select interaction working on "pointermove"
        /*let selectPointerMove = new ol.interaction.Select({
            condition: ol.events.condition.pointerMove
        });
        this.map.addInteraction(selectPointerMove);
        selectPointerMove.on('select', event => {
            //console.log(event);
        });*/

    }

    addLocatedElements(elts) {
        let result = Array<ol.Feature>();
        for(let elt of elts) {
            let feature = new ol.Feature({
                geometry: new ol.geom.Point([elt.longitude, elt.latitude]),
                id: elt.id,
                elt: elt
            });
            result.push(feature);
        }
        this.features.addFeatures(result);
        return result;
    }

    setCenter(longitude, latitude) {
        console.log(longitude, latitude);
        this.map.getView().setCenter([longitude, latitude]);
        // this.map.getView().setZoom(17);
    }
}
