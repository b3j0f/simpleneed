var needs = {
	'money': 'argent',
	'snack': 'collation',
	'food': 'nourriture',
	'clothes': 'vêtements',
	'company': 'compagnie',
	'hygiene': 'hygiène',
	'accomodation': 'logement',
	'health': 'soins'
};
var filterneeds = new Array();

Object.keys(needs).forEach(function (need) {
	var child = document.createElement('option');
	child.setAttribute('id', 'need'+need);
	child.setAttribute('value', need);
	child.innerText = needs[need];
	document.getElementById('needs').appendChild(child);
	filterneeds.push(need);
});

function filter(elt) {
	var index = filterneeds.indexOf(elt.id);
	if (index >= 0) {
		filterneeds.splice(index, 1);
		$(elt).addClass('black');
	} else {
		filterneeds.push(elt.id);
		$(elt).removeClass('black');
	}
	refresh();
}

function gettype(elt) {
	return elt.rroam ? 'roam' : elt.rneedlocation ? 'needlocation' : 'supplylocation';
}

function save() {
	//var csrfmiddlewaretoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
	var type = $('#type').attr('value');
	var name = $('#name').val();
	var description = $('#description').val();
	var emergency = $('#emergency')[0].checked;
	var needs = $('#needs').val();
	var fneeds = new Array();
	needs.forEach(function(need) {
		fneeds.push('{{ api }}/needs/' + need + '/');
	});
	var id = $('#id').val();
	var latitude = $('#latitude').val();
	var longitude = $('#longitude').val();
	$('#load').modal('open');
	var ajaxtype = (id === '') ? 'POST' : 'PUT';
	var url = '{{ api }}/' + type + 's/';
	if (id !== '') {
		url += id + '/';
	}
	$.ajax({
		type: ajaxtype,
		url: url,
		data: JSON.stringify({
			type: type,
			name: name,
			description: description,
			emergency: emergency,
			needs: fneeds,
			latitude: latitude,
			longitude: longitude,
			messages: [],
			needlocations: [],
			//csrfmiddlewaretoken: csrfmiddlewaretoken
		}),
		dataType: 'json',
		contentType: 'application/json',
		success: function() {
			$('#load').modal('close');
			$('#edit').modal('close');
			var translate = type === 'needlocation' ? 'galère' : type === 'roam' ? 'maraude' : 'aide';
			var msg = translate + (id === '' ? ' créée' : ' mise à jour');
			var $toastContent = $('<p class="green-text">' + msg + '</p>');
			Materialize.toast($toastContent, 5000);
			refresh();
		},
		error: function(error, msg, t) {
			$('#load').modal('close');
			console.log(error, msg, t);
			var msg = 'erreur : ' + error.responseText;
			var $toastContent = $('<p class="red-text">'+msg+'</p>');
			Materialize.toast($toastContent, 5000);
		}
	});
};

$('#load').modal({
	dismissible: false
});

function geoloc() {
	$('#load').modal('open');
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			function(pos) {
				map.getView().setCenter(
					[
					pos.coords.longitude,
					pos.coords.latitude
					]
					);
				$('#load').modal('close');
			},
			function(msg) {
				$('#status')[0].innerHTML = 'Erreur : ' + (typeof msg == 'string' ? msg : 'failed');
			}
			);
	} else {
		$('#status')[0].innerHTML = 'Erreur : Geolocalisation non supportée';
	}
}

var types = ['needlocation', 'roam', 'supplylocation'];
var translate = {
	needlocation: 'suis en galère',
	roam: 'crée une maraude',
	supplylocation: 'propose mon aide'
};

function onchangetype(type) {
	types.forEach(function(type) {
		$('.'+type).hide();
		$('.'+type).attr('disabled', true);
	});
	$('.'+type).show();
	$('.'+type).attr('disabled', false);
	$('#atype')[0].innerText = translate[type];
	$('#type').attr('value', type);
};

function del() {
	$('#load').modal('open');
	$.ajax({
		type: 'DELETE',
		url: document.getElementById('delete').getAttribute('href'),
		success: function(){
			$('#load').modal('close');
			$('#edit').modal('close');
			var msg = 'élément supprimée';
			var $toastContent = $('<p class="green-text">' + msg + '</p>');
			Materialize.toast($toastContent, 5000);
			refresh();
		},
		failure: function(error) {
			$('#load').modal('close');
			$('#edit').modal('close');
			var msg = 'Erreur lors de la suppression : ' + typeof error == 'string' ? error : "failed";
			var $toastContent = $('<p class="red-text">' + msg + '</p>');
			Materialize.toast($toastContent, 5000);
			refresh();
		}
	});
};

function edit(elt, coordinate) {
	$('#longitude').val(coordinate[0]);
	$('#latitude').val(coordinate[1]);
	if (elt === undefined) {
		$('.update').hide();
		$('.new').show();
		$('#type').attr('disabled', false);
		onchangetype('needlocation');
		document.getElementById('description').innerText = '';
		document.getElementById('emergency').setAttribute('checked', false);
		document.getElementById('name').removeAttribute('text');
		document.getElementById('id').removeAttribute('value');
	} else {
		$('.update').show();
		$('.new').hide();
		var type = gettype(elt);
		$('#'+type).attr('selected', true);
		$('#type').attr('disable', true);
		onchangetype(type);
		$('#delete').attr('href', '{{ api }}/' + type + 's/' + elt.id + '/');
		Object.keys(needs).forEach(function (need) {
			document.getElementById('need' + need).removeAttribute('selected');
		});
		elt.needs.forEach(function (need) {
			var prefix = need.substring(0, need.length - 1);
			var name = prefix.substring(prefix.lastIndexOf('/') + 1);
			document.getElementById('need' + name).setAttribute('selected', true);
		});
		$('#needs').material_select();
		var type = gettype(elt);
		var shorttranslation = {
			'needlocation': 'd\'une galère',
			'roam': 'd\'une maraude',
			'supplylocation': 'd\'une aide'
		};
		document.getElementById('description').innerText = elt.description;
		document.getElementById('emergency').setAttribute('checked', elt.checked === true);
		document.getElementById('name').setAttribute('text', elt.name);
		document.getElementById('update-type').innerText = 'Mise à jour ' + shorttranslation[type];
		document.getElementById('id').setAttribute('value', elt.id);
	}
	$('#edit').modal('open');
};

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

function getLocatedElementStyle(elt) {
	return new ol.style.Style({
		image: new ol.style.Circle({
			radius: 10 + 1.5 * 1,
			stroke: new ol.style.Stroke({
				color: '#fff'
			}),
			fill: new ol.style.Fill({
				color: '#3399CC'
			})
		}),
		text: new ol.style.Text({
			text: '1',
			fill: new ol.style.Fill({
				color: '#fff'
			})
		}),
		elt: elt
	});
}

function toFeatures(elts) {
	var result = {};
	Object.values(elts).forEach(function (elt) {
		var feature = new ol.Feature({
			geometry: new ol.geom.Point(
				[elt.longitude, elt.latitude]
				),
			id: elt.id,
			elt: elt
		});
		result[elt.id] = feature;
	});
	return result;
}

function refresh() {
	var extent = map.getView().calculateExtent(map.getSize());
	var bottomLeft = [extent[0], extent[1]];
	var topRight = [extent[2], extent[3]];
	var endts = new Date().getTime() / 1000;
	var fneeds = '';
	var search = $('#search').val();
	filterneeds.forEach(function(need) {
		fneeds += need + ',';
	});
	$.ajax({
		type: 'GET',
		url: '{{ api }}/locatedelements/',
		data: {
			longitude__gte: bottomLeft[0],
			longitude__lte: topRight[0],
			latitude__lte: topRight[1],
			latitude__gte: bottomLeft[1],
			endts__gte: endts,
			needs__in: fneeds,
			description__icontains: search
		},
		success: function(data) {
			var results = {};
			data.results.forEach(function (elt) {
				results[elt.id] = elt;
			});
			var eltfeatures = toFeatures(results);
			features.clear();
			features.addFeatures(Object.values(eltfeatures));
		}
	});
}

var clusterSource = new ol.source.Cluster({
	distance: parseInt('40', 10),
	source: features
});

var styleClusterCache = {};

var clusters = new ol.layer.Vector({
	id: 'clusters',
	source: clusterSource,
	style: function(feature) {
		var features = feature.get('features');
		var size = features.length;
		var style = styleClusterCache[size];
		if (!style) {
			if (size == 1) {
				style = getLocatedElementStyle(features[0].get('elt'));
			} else {
				style = getClusterStyle(size);
				styleClusterCache[size] = style;
			}
		}
		return style;
	}
});

var select = new ol.interaction.Select({
});
select.on('select', function (evt) {
	evt.selected.forEach(function (selected) {
		selected.get('features').forEach(function (feature) {
			var elt = feature.get('elt');
			var coordinates = feature.getGeometry().getCoordinates();
			edit(elt, coordinates);
		});
	});
});

var translate = new ol.interaction.Translate({
});
translate.on('translateend', function(evt) {
	evt.features.getArray().forEach(function (feature) {
		feature.get('features').forEach(function (feature) {
			var elt = feature.get('elt');
			edit(elt, evt.coordinate);
		});
	});
});

var map = new ol.Map({
	interactions: ol.interaction.defaults().extend([select, translate]),
	target: 'map',
	layers: [
	new ol.layer.Tile({source: new ol.source.OSM()}),
	clusters
	],
	view: new ol.View({
		projection: 'EPSG:4326',
		center: ol.proj.fromLonLat([0, 0]),
		zoom: 6,
		minZoom: 3
	}),
	controls: ol.control.defaults({
		rotate: false,
	}),
});

function onMoveEnd(evt) {
	refresh();
}

map.on('moveend', onMoveEnd);

function setCenter(longitude, latitude) {
	console.log(longitude, latitude);
	map.getView().setCenter([longitude, latitude]);
}

function recrefresh() {
	refresh();
	setTimeout(recrefresh, 10000);
}
recrefresh();