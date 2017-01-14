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

$('#keywords').on('chip.add', function (e, chip) {
	refresh();
});
$('#keywords').on('chip.delete', function (e, chip) {
	refresh();
});
$('#keywords').on('chip.select', function(e, chip) {
	refresh();
});
$('#keywords').material_chip({
	placeholder: '+Mot clef',
	secondaryPlaceholder: '+Mots clefs',
});

Object.keys(needs).forEach(function (need) {
	var child = document.createElement('option');
	child.setAttribute('id', 'need'+need);
	child.setAttribute('value', need);
	child.innerText = needs[need];
	document.getElementById('needs').appendChild(child);
	filterneeds.push(need);
});

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

function updatelocatedelementfilter(elt) {
	var markup = $(elt);
	if (markup.hasClass('filter')) {
		markup.removeClass('filter');
		markup.addClass('black');
	} else {
		markup.addClass('filter');
		markup.removeClass('black');
	}
	refresh();
}

function onchangetype(type) {
	types.forEach(function(type) {
		$('.'+type).hide();
		$('.'+type).attr('disabled', true);
	});
	$('.'+type).show();
	$('.'+type).attr('disabled', false);
	document.getElementById('atype').innerText = translate[type];
	$('#type').attr('value', type);
};

function del() {
	$('#load').modal('open');
	$.ajax({
		type: 'DELETE',
		url: document.getElementById('delete').getAttribute('command'),
		success: function(){
			$('#load').modal('close');
			$('#edit').modal('close');
			var msg = 'Élément supprimée';
			var $toastContent = $('<p class="green-text">' + msg + '</p>');
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
		document.getElementById('emergency').removeAttribute('checked');
		document.getElementById('name').removeAttribute('text');
		document.getElementById('id').removeAttribute('value');
		Object.keys(needs).forEach(function (need) {
			document.getElementById('need' + need).removeAttribute('selected');
		});
		$('#needs').material_select();
	} else {
		$('.update').show();
		$('.new').hide();
		$('#'+elt.type).attr('selected', true);
		$('#type').attr('disable', true);
		onchangetype(elt.type);
		$('#delete').attr('command', '{{ api }}/' + elt.type + 's/' + elt.id + '/');
		Object.keys(needs).forEach(function (need) {
			document.getElementById('need' + need).removeAttribute('selected');
		});
		elt.needs.forEach(function (need) {
			document.getElementById('need' + need).setAttribute('selected', true);
		});
		$('#needs').material_select();
		var shorttranslation = {
			'needlocation': 'd\'une galère',
			'roam': 'd\'une maraude',
			'supplylocation': 'd\'une aide'
		};
		document.getElementById('description').innerText = elt.description;
		if (elt.emergency) {
			document.getElementById('emergency').setAttribute('checked', true);
		} else {
			document.getElementById('emergency').removeAttribute('checked');
		}
		document.getElementById('name').setAttribute('value', elt.name);
		document.getElementById('update-type').innerText = 'Mise à jour ' + shorttranslation[elt.type];
		document.getElementById('id').setAttribute('value', elt.id);
		Materialize.updateTextFields();
	}
	$('#edit').modal({
		complete: refresh
	});
	$('#edit').modal('open');
};

var features = new ol.source.Vector();

var styleClusterCache = {};

function getClusterStyle(size) {
	var result = styleClusterCache[size];
	if (result === undefined) {
		result = new ol.style.Style({
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
		styleClusterCache[size] = result;
	}
	return result;
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
	var filterneeds = $('#filterneeds').val();
	if (filterneeds) {
		filterneeds	= filterneeds.join();
	} else {
		filterneeds = Object.keys(needs).join();
	}
	var chips = $('#keywords').data().chips;
	var types = $('.type.filter');
	if (types.length > 0) {
		var _types = [];
		for (var index = 0; index < types.length; index++) {
			var type = types[index];
			_types.push(type.getAttribute('name'));
		}
		types = _types;
	} else {
		types = ['locatedelement'];
	}
	function getlocatedelements(word) {
		function success(data) {
			var results = {};
			data.results.forEach(function (elt) {
				var type = elt.type;
				if (elt.schild !== undefined) {
					Object.keys(elt.schild.fields).forEach(function(field) {
						elt[field] = elt.schild.fields[field];
					});
				} else {
					for(var index=0; index<elt.needs.length; index++) {
						var need = elt.needs[index].substring(0, elt.needs[index].length - 1);
						elt.needs[index] = need.substring(need.lastIndexOf('/') + 1);
					}
				}
				results[elt.id] = elt;
			});
			var eltfeatures = toFeatures(results);
			features.addFeatures(Object.values(eltfeatures));
		}
		function ajax(type, fname) {
			var data = {
				longitude__gte: bottomLeft[0],
				longitude__lte: topRight[0],
				latitude__lte: topRight[1],
				latitude__gte: bottomLeft[1],
				startts__lte: endts,
				endts__gte: endts,
				needs__in: filterneeds
			};
			data[fname] = word;
			$.ajax({
				type: 'GET',
				url: '{{ api }}/' + type + 's/',
				data: data,
				success: success
			});
		}
		for (var index = 0; index < types.length; index++) {
			var type = types[index];
			ajax(type, 'description__icontains');
			if (type === 'roam') {
				ajax(type, 'name__icontains');
			}
		}
	}
	features.clear();
	if (chips.length > 0) {
		chips.forEach(function(chip) {
			var word = chip.tag;
			getlocatedelements(word);
		});
	} else {
		getlocatedelements();
	}
}

var clusterSource = new ol.source.Cluster({
	distance: parseInt('40', 10),
	source: features
});

function getStyle(feature) {
	var result;
	var features = feature.get('features');
	if (features.length == 1) {
		result = getLocatedElementStyle(features[0].get('elt'));
	} else {
		result = getClusterStyle(features.length);
	}
	return result;
}

var clusters = new ol.layer.Vector({
	id: 'clusters',
	source: clusterSource,
	style: function(feature) {
		return getStyle(feature);
	}
});

function interact(features, coordinates) {
	if (features.length > 1) {
		refresh();
		// TODO do something when several features are selected.
	} else {
		var feature = features[0];
		var elt = feature.get('elt');
		var coordinates = coordinates || feature.getGeometry().getCoordinates();
		edit(elt, coordinates);
	}
}

var selectinteraction = new ol.interaction.Select({
	style: function(feature) {
		return getStyle(feature);
	}
});
selectinteraction.on('select', function (evt) {
	evt.selected.forEach(function (selected) {
		var features = selected.get('features');
		interact(features);/*
		if (features.length > 1) {
			// TODO do something when several features are selected.
		} else {
			var feature = features[0];
			var elt = feature.get('elt');
			var coordinates = feature.getGeometry().getCoordinates();
			edit(elt, coordinates);
		}*/
	});
});

var translateinteraction = new ol.interaction.Translate({
	handleEvent: function(evt) {
		console.log(evt);
	},
});
translateinteraction.on('translatestart', function(evt) {
	var length = evt.features.getLength();
	if (length > 1 || evt.features.getArray()[0].get('features').length > 1) {
		evt.preventDefault();
	}
});
translateinteraction.on('translateend', function(evt) {
	evt.features.getArray().forEach(function (feature) {
		var features = feature.get('features');
		interact(features, evt.coordinate);
	});
});

var map = new ol.Map({
	interactions: ol.interaction.defaults().extend(
		[selectinteraction, translateinteraction]
		),
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

map.on('singleclick', function(evt, layer) {
	var feature = map.forEachFeatureAtPixel(
		evt.pixel,
		function(feature) { return feature; }
		);
	if (feature === undefined) {
		edit(feature, evt.coordinate);
	}
});

function setCenter(longitude, latitude) {
	console.log(longitude, latitude);
	map.getView().setCenter([longitude, latitude]);
}

function recrefresh() {
	refresh();
	setTimeout(recrefresh, 30000);
}
setTimeout(recrefresh, 30000);