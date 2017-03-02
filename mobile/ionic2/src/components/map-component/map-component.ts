import { Component, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController } from 'ionic-angular';

import ol from 'openlayers';

@Component({
    selector: 'map-component',
    templateUrl: 'map-component.html',
    providers: [Storage]
    })
export class MapComponent {

    @ViewChild('map') mapview;

    coordinate: any = [0, 0];
    zoom: number = 15;

    map: any;

    refreshts: number = 30000;

    features: ol.source.Vector = new ol.source.Vector();
    styleClusterCache: any = {};
    styles: any = {};

    edit: any;  // edition function.
    getelts: any;  // get elements function

    elt: any; // current editing element

    constructor(public storage: Storage, public navCtrl: NavController) {
    }

    getClusterStyle(size) {
        let result = this.styleClusterCache[size];
        if (result === undefined) {
            result = new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 32 + 1.5 * size,
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
            this.styleClusterCache[size] = result;
        }
        return result;
    }

    getLocatedElementStyle(elt) {
        let key = elt.type + elt.needs.join() + elt.emergency;
        let result = this.styles[key];
        if (result === undefined) {
            let src = 'assets/icon/pin-' + elt.type + (elt.emergency ? '-emergency' : '')  + '.png';
            let style = new ol.style.Style({
                image: new ol.style.Icon({
                    src: src,
                    anchor: [0.5, 1]
                    })
                });
            result = this.styles[key] = style;
        }
        return result;
    }

    getStyle(feature) {
        let result;
        let features = feature.get('features');
        if (features.length == 1) {
            result = this.getLocatedElementStyle(features[0].get('elt'));
        } else {
            result = this.getClusterStyle(features.length);
        }
        return result;
    }

    toFeatures(elts) {
        let result = {};
        for (let key in elts) {
            let elt = elts[key];
            let feature = new ol.Feature({
                geometry: new ol.geom.Point(
                    [elt.longitude, elt.latitude]
                ),
                id: elt.id,
                elt: elt
            });
            result[elt.id] = feature;
        };
        return result;
    }

    refresh() {
        let extent = this.map.getView().calculateExtent(this.map.getSize());
        this.storage.set('zoom', this.map.getView().getZoom());
        this.storage.set('center', this.map.getView().getCenter());
        this.getelts(extent, (elts) => {
            this.features.clear();
            let features = [];
            let dfeatures = this.toFeatures(elts);
            for(let id in dfeatures) {
                let feature = dfeatures[id];
                features.push(feature);
            }
            this.features.addFeatures(features);
        });
    }

    recrefresh() {
        this.refresh();
        setTimeout(() => this.recrefresh(), this.refreshts);
    }

    interact(features, coordinates=undefined) {
        if (features.length > 1) {
            this.refresh();
            // TODO do something when several features are selected.
        } else {
            let feature = features[0];
            let elt = feature.get('elt');
            coordinates = coordinates || feature.getGeometry().getCoordinates();
            this.edit(elt, coordinates);
        }
    }

    ngAfterViewInit() {
        let clusterSource = new ol.source.Cluster({
            distance: parseInt('40', 10),
            source: this.features
        });

        let clusters = new ol.layer.Vector({
            source: clusterSource,
            style: (feature) => {
                return this.getStyle(feature);
            }
        });

        let selectinteraction = new ol.interaction.Select({
            style: (feature) => {
                return this.getStyle(feature);
            }
        });
        selectinteraction.on('select', (evt) => {
            evt.selected.forEach((selected) => {
                if (this.navCtrl.getActive().component.name !== 'CRUPPage') {
                    let features = selected.get('features');
                    this.interact(features);
                }
            });
        });

        let translateinteraction = new ol.interaction.Translate({});
        translateinteraction.on('translatestart', (evt) => {
            let length = evt.features.getLength();
            if (length > 1 || evt.features.getArray()[0].get('features').length > 1) {
                evt.preventDefault();
            }
        });
        translateinteraction.on('translateend', (evt) => {
            evt.features.getArray().forEach((feature) => {
                let features = feature.get('features');
                this.interact(features, evt.coordinate);
            });
        });

        this.storage.get('zoom').then((zoom) => {
            zoom = zoom || 15;
            this.storage.get('center').then((center) => {
                center = center || ol.proj.fromLonLat([0, 0]);
                for(let index in center) {
                    center[index] = parseFloat(center[index]);
                }
                this.map = new ol.Map({
                    interactions: ol.interaction.defaults().extend(
                        [selectinteraction, translateinteraction]
                        ),
                    target: "map",
                    layers: [
                        new ol.layer.Tile({source: new ol.source.OSM()}),
                        clusters
                    ],
                    view: new ol.View({
                        projection: 'EPSG:4326',
                        center: center,
                        zoom: zoom,
                        minZoom: 3
                    })
                });
                this.map.on('moveend', () => this.refresh());
                this.map.on('singleclick', (evt, layer) => {
                    if (this.navCtrl.getActive().component.name !== 'CRUPPage') {
                        this.edit(undefined, evt.coordinate);
                    }
                });
                this.recrefresh();
            });
        });
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
        this.map.getView().setCenter([longitude, latitude]);
        this.map.getView().setZoom(
            Math.max(
                this.map.getView().getZoom(),
                15
            )
        );
    }
}
