
var features = new ol.source.Vector();

function getClusterStyle(size) {
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

function getLocatedElementStyle(feature) {
	return new ol.style.Style({
		image: new ol.style.Icon({
			src: 'https://openlayers.org/en/v3.19.1/examples/data/icon.png'
		})
	});
}

function addLocatedElements(elts) {
	if (elts === undefined) {
		$.get('' + {{ host }} + '/needlocations', function(data) {
			addLocatedElements(data);
		});
	} else {
		var result = [];
		for(var elt of elts) {
			var feature = new ol.Feature({
				geometry: new ol.geom.Point([elt.longitude, elt.latitude]),
				id: elt.id,
				elt: elt
			});
			result.push(feature);
		}
		features.addFeatures(result);
	}
}

var clusterSource = new ol.source.Cluster({
	distance: parseInt('40', 10),
	source: features
});

var styleClusterCache = {};

var clusters = new ol.layer.Vector({
	source: clusterSource,
	style: function(feature) {
		var features = feature.get('features');
		var size = features.length;
		var style = styleClusterCache[size];
		if (!style) {
			if (size == 1) {
				style = getLocatedElementStyle(features[0]);
			} else {
				style = getClusterStyle(size);
				styleClusterCache[size] = style;
			}
		}
		return style;
	}
});

var map = new ol.Map({
	target: 'map',
	layers: [
	new ol.layer.Tile({source: new ol.source.OSM()}),
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

map.on('singleclick', (event, layer) => {
	var coordinate = event.coordinate;
	var feature = map.forEachFeatureAtPixel(
		event.pixel,
		feature => { return feature; }
		) || {'elt': undefined};
	edit(feature.elt, coordinate);
});

function setCenter(longitude, latitude) {
	console.log(longitude, latitude);
	map.getView().setCenter([longitude, latitude]);
}

var selectSingleClick = new ol.interaction.Select({
	condition: ol.events.condition.singleClick,
	style: function(feature, q) {
		features.toString();
		var features = feature.get('features');
		return null;
	},
	layers: [clusterSource]
});
map.addInteraction(selectSingleClick);
