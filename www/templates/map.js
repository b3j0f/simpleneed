{% load static %}

var needs = {
	'money': 'argent',
	'food': 'nourriture',
	'clothes': 'vêtements',
	'company': 'compagnie',
	'hygiene': 'hygiène',
	'accomodation': 'logement',
	'health': 'soins'
};

var types = ['needlocation', 'roam', 'supplylocation'];
var translate = {
	needlocation: 'suis en galère',
	roam: 'crée une maraude',
	supplylocation: 'propose mon aide'
};

var address = $.cookie('address');
if (address) {
	$('#address').val(address);
}

function getCookie(name, def) {
	var result = $.cookie(name);
	if (result === undefined || isNaN(result[0])) {
		result = def;
	} else {
		result = result.split(',');
	}
	return result;
}

var ftypes = getCookie('ftypes', types);

$('.type.filter').removeClass('filter').addClass('transparent').addClass('black-text');
ftypes.forEach(function(type) {
	$('#' + type + 'filter').addClass('filter').removeClass('transparent').removeClass('black-text');
});

var fneeds = getCookie('fneeds', []);
fneeds.forEach(function(need) {
	document.getElementById(need + 'filter').setAttribute('selected', true);
});

$('#keywords').on('chip.add', function (e, chip) {
	refresh();
});
$('#keywords').on('chip.delete', function (e, chip) {
	refresh();
});
$('#keywords').on('chip.select', function(e, chip) {
	refresh();
});
var keywords = getCookie('keywords', []);
var data = [];
keywords.forEach(function(keyword) {
	data.push({tag: keyword});
});
$('#keywords').material_chip({
	placeholder: '+Mot clef',
	secondaryPlaceholder: '+Mots clefs',
	data: data
});

var filtersdom = document.getElementById('filterneeds');
var needsdom = document.getElementById('needs');
Object.keys(needs).forEach(function (need) {
	var name = needs[need];

	var filterhtml = '<option id="' + need + 'filter" value="' + need + '">' + name + '</option>';
	filtersdom.insertAdjacentHTML('beforeEnd', filterhtml);

	var needhtml = '<div class="col s6 m4 l3">';
	needhtml += '<input type="checkbox" id="need' + need + '" name="' + need + '" onclick="enablesubmit();"/>';
	needhtml += '<label for="need' + need + '">' + name + '</label>';
	needhtml += '</div>';
	needsdom.insertAdjacentHTML('beforeEnd', needhtml);
});

function save() {
	//var csrfmiddlewaretoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
	var type = $('#type').attr('value');
	var name = $('#name').val();
	var description = $('#description').val();
	var emergency = $('#emergency')[0].checked;
	var needsval = [];
	var fneeds = new Array();
	Object.keys(needs).forEach(function(need) {
		if (document.getElementById('need' + need).checked) {
			fneeds.push('{{ api }}/needs/' + need + '/');
		}
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
		xhrFields: {
			withCredentials: true
		},
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
				setCenter(pos.coords.longitude, pos.coords.latitude);
				map.getView().setZoom(
					Math.max(
						map.getView().getZoom(),
						15
						)
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

function updatelocatedelementfilter(elt) {
	var markup = $(elt);
	if (markup.hasClass('filter')) {
		$('.type').removeClass('filter').addClass('transparent').addClass('black-text');
	}
	markup.addClass('filter');
	markup.removeClass('transparent');
	markup.removeClass('black-text');
	refresh();
}

var gtype;

function onchangetype(type) {
	types.forEach(function(type) {
		$('.'+type).hide();
		$('.'+type).attr('disabled', true);
	});
	$('.'+type).show();
	$('.'+type).attr('disabled', false);
	document.getElementById('atype').innerText = translate[type];
	$('#type').attr('value', type);
	gtype = type;
	enablesubmit();
};

function del() {
	$('#load').modal('open');
	$.ajax({
		type: 'PUT',
		url: document.getElementById('delete').getAttribute('command'),
		xhrFields: {
			withCredentials: true
		},
		data: JSON.stringify({
			endts: new Date().getTime() / 1000,
			needs: [],
			latitude: document.getElementById('latitude').value,
			longitude: document.getElementById('longitude').value,
			messages: [],
			name: document.getElementById('name').value,
			needlocations: []
		}),
		dataType: 'json',
		contentType: 'application/json',
		success: function(){
			$('#load').modal('close');
			$('#edit').modal('close');
			var msg = 'Élément supprimé';
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

function enablesubmit() {
	var enable = true;
	if (gtype === 'roam') {
		enable = $('#name').val() && true;
	}
	if (enable && gstate === 'new') {
		enable = false;
		for(var need of Object.keys(needs)) {
			if (document.getElementById('need' + need).checked) {
				enable = true;
				break;
			}
		}
	}
	var submit = document.getElementById('submit');
	if (enable) {
		submit.removeAttribute('disabled');
	} else {
		submit.setAttribute('disabled', undefined);
	}
}

var gstate;

function edit(elt, coordinate) {
	$('#longitude').val(coordinate[0]);
	$('#latitude').val(coordinate[1]);
	if (elt === undefined) {
		gstate = 'new';
		$('.update').hide();
		$('.new').show();
		$('#type').attr('disabled', false);
		onchangetype('needlocation');
		$('#description').val('');
		$('#description').trigger('autoresize');
		$('#name').val('');
		document.getElementById('emergency').removeAttribute('checked');
		document.getElementById('name').removeAttribute('text');
		document.getElementById('id').removeAttribute('value');
		Object.keys(needs).forEach(function (need) {
			document.getElementById('need' + need).checked = false;
		});
	} else {
		gstate = 'update';
		$('.update').show();
		$('.new').hide();
		$('#'+elt.type).attr('selected', true);
		$('#type').attr('disable', true);
		onchangetype(elt.type);
		$('#delete').attr('command', '{{ api }}/' + elt.type + 's/' + elt.id + '/');
		Object.keys(needs).forEach(function (need) {
			document.getElementById('need' + need).checked = false;
		});
		elt.needs.forEach(function (need) {
			document.getElementById('need' + need).checked = true;
		});
		var shorttranslation = {
			'needlocation': 'Galère',
			'roam': 'Maraude',
			'supplylocation': 'Lieu d\'aide'
		};
		$('#description').val(elt.description);
		$('#description').trigger('autoresize');
		if (elt.emergency) {
			document.getElementById('emergency').setAttribute('checked', true);
		} else {
			document.getElementById('emergency').removeAttribute('checked');
		}
		document.getElementById('name').setAttribute('value', elt.name);
		document.getElementById('update-type').innerText = shorttranslation[elt.type];
		document.getElementById('id').setAttribute('value', elt.id);
		Materialize.updateTextFields();
	}
	enablesubmit();
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
		styleClusterCache[size] = result;
	}
	return result;
}

var styles = {};

function getLocatedElementStyle(elt) {
	var key = elt.type + elt.needs.join() + elt.emergency;
	var result = styles[key];
	if (result === undefined) {
		var src = '{% static 'img' %}/pin-' + elt.type + (elt.emergency ? '-emergency' : '')  + '.png';
		var text = elt.needs.length.toString();
		var style = new ol.style.Style({
			image: new ol.style.Icon({
				src: src,
				anchor: [0.5, 1]
			})
		});
		result = styles[key] = style;
	}
	return result;
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
	$.cookie('address', $('#address').val());
	$.cookie('zoom', map.getView().getZoom());
	$.cookie('center', map.getView().getCenter());
	var endts = new Date().getTime() / 1000;
	var filterneeds = $('#filterneeds').val();
	if (filterneeds === null) {
		filterneeds = Object.keys(needs);
		$.removeCookie('fneeds');
	} else {
		$.cookie('fneeds', filterneeds);
	}
	filterneeds = filterneeds.join();
	var chips = $('#keywords').data().chips;
	var types = $('.type.filter');
	if (types.length > 0) {
		var _types = [];
		for (var index = 0; index < types.length; index++) {
			var type = types[index];
			_types.push(type.getAttribute('name'));
		}
		types = _types;
		$.cookie('ftypes', types);
	} else {
		types = [];
		$.removeCookie('ftypes');
	}
	var oldfeatures = {};
	function getlocatedelements(word) {
		function success(data) {
			var results = {};
			data.results.forEach(function (elt) {
				if (oldfeatures[elt.id] === undefined) {
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
					oldfeatures[elt.id] = results[elt.id] = elt;
				}
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
				xhrFields: {
					withCredentials: true
				},
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
	features.refresh({force:true});
	if (chips.length > 0) {
		var keywords = [];
		chips.forEach(function(chip) {
			var word = chip.tag;
			keywords.push(word);
			getlocatedelements(word);
		});
		$.cookie('keywords', keywords);
	} else {
		getlocatedelements();
		$.removeCookie('keywords');
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
		if (features.length > 1) {
			/*map.getView().setCenter(selected.getGeometry().getCoordinates());
			map.getView().setZoom(map.getView().getZoom() + 1);*/
		} else {
			interact(features);
		}
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

var center = getCookie('center', ol.proj.fromLonLat([0, 0]));
for(var index in center) {
	center[index] = parseFloat(center[index]);
}

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
		center: center,
		zoom: $.cookie('zoom') || 6,
		minZoom: 3
	}),
	controls: ol.control.defaults({
		//rotate: false,
	}),
});

function onMoveEnd(evt) {
	refresh();
	var center = map.getView().getCenter();
	updateAddress(center[0], center[1]);
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

function updateAddress(longitude, latitude) {
	$.ajax({
		method: 'GET',
		url: 'http://nominatim.openstreetmap.org/reverse',
		data: {
			format: 'json',
			lon: longitude,
			lat: latitude
		},
		success: function(data) {
			if(data !== undefined) {
				$('#address').val(data.display_name);
			}
		}
	});
}

function setCenter(longitude, latitude) {
	console.log(longitude, latitude);
	map.getView().setCenter([parseFloat(longitude), parseFloat(latitude)]);
	updateAddress(longitude, latitude);
}

function recrefresh() {
	refresh();
	setTimeout(recrefresh, 30000);
}
setTimeout(recrefresh, 30000);

function setAddress(address) {
	$('#load').modal('open');
	$.ajax({
		method: 'GET',
		url: 'http://nominatim.openstreetmap.org/search/',
		data: {
			format: 'json',
			q: address
		},
		success: function(data) {
			$('#load').modal('close');
			console.log(data);
			if (data.length > 0) {
				var item = data[0];
				var boundingbox = [
				item.boundingbox[2],
				item.boundingbox[0],
				item.boundingbox[3],
				item.boundingbox[1]
				];
				var size = ol.extent.getSize(boundingbox);
				setCenter(item.lon, item.lat);
				//map.setSize(size);
				refresh();
				var names = [];
				data.forEach(function(item) {
					names.push(item.display_name);
				});
				var msg = names.length + ' adresse(s) trouvée(s) : <br/>' + names.join(',<br/>');
				var $toastContent = $('<p class="green-text">'+msg+'</p>');
			} else {
				var msg = 'Aucun adresse trouvée';
				var $toastContent = $('<p class="red-text">'+msg+'</p>');
			}
			Materialize.toast($toastContent, 5000);
		},
		error: function(error) {
			$('#load').modal('close');
			console.log(error);
			var msg = 'erreur : ' + error.responseText;
			var $toastContent = $('<p class="red-text">'+msg+'</p>');
			Materialize.toast($toastContent, 5000);
		}
	}, );
}