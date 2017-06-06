var divMapa = document.getElementById("mapa");
navigator.geolocation.getCurrentPosition(fn_ok, fn_mal);

var gMapa;
var marcadores = [];
var id = 0;

var cur_lat;
var cur_lng;
var directionsDisplay;

function fn_mal() {}

function fn_ok(request) {
	cur_lat = request.coords.latitude;
	cur_lng = request.coords.longitude;

	criarMapa(cur_lat, cur_lng);

	var gLatLon = new google.maps.LatLng(cur_lat, cur_lng);

	var objConfigMarker = {
		position: gLatLon,
		map: gMapa,
		title: "Localização Atual"
	}

	var gMarker = new google.maps.Marker(objConfigMarker);
}

function criarMapa(lat, lng) {
	if(gMapa == undefined) {
		var gLatLon = new google.maps.LatLng(lat, lng);

		var objConfig = {
			zoom: 17,
			center: gLatLon
		}

		gMapa = new google.maps.Map(divMapa, objConfig);

		directionsDisplay = new google.maps.DirectionsRenderer({
				suppressMarkers: true
		});

		directionsDisplay.setMap(gMapa);

		return gMapa;
	}
}

function addMarker(lat, lng, name){
	if(gMapa == undefined) {
		criarMapa(lat, lng);
	}

	// console.log('funcao1');
	var myLatLng = new google.maps.LatLng(lat, lng);

	var markerOpt = {
		position: myLatLng,
		map: gMapa,
		title: name,
		icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|' + 'FFFF33'
	}

	var marker = new google.maps.Marker(markerOpt);

	return marker;

	// console.log(marker);
}

function addPsf(lat, lng, name, id){
	if(name) {
		marcadores[id] = addMarker(lat,lng, id + ': ' + name);
		// console.log(marcadores[id]);
	}
}

document.getElementById("btn-emergencia").addEventListener("click", function(){
	//algoritmo de busca pela 'UPA' mais proxima

	var service = new google.maps.DistanceMatrixService;

	var curLoc = new google.maps.LatLng(cur_lat, cur_lng);

	var dests = [];
	marcadores.forEach(function (marcador) {
		dests.push(marcador.getPosition());
	})

	service.getDistanceMatrix({
		origins: [curLoc],
		destinations: dests,
		travelMode: 'DRIVING',
		unitSystem: google.maps.UnitSystem.METRIC,
		avoidHighways: false,
		avoidTolls: false
	}, function(response, status) {
		var nearIndex = 0;
		var nearTime = 999999;

		if (status == 'OK') {
			var arResp = response.rows[0].elements;
			arResp.forEach(function (dest, index) {
				// console.log(index + ': ' +dest.duration.value);
				var time = dest.duration.value;
				if(time < nearTime) {
					nearTime = time;
					nearIndex = index;
				}
			});

			calcRoute(curLoc, marcadores[nearIndex].getPosition());
		} else {
			console.log('erro');
		}
	});
});

document.getElementById("btn-nao-urgente").addEventListener("click", function(){
	//algoritmo de busca pela 'UPA' próxima à casa do usuário
	//busca posicao atual
	//procurar a rota para a upa default
	//executa a rota
	var origin = new google.maps.LatLng(cur_lat, cur_lng)
	var dest = marcadores[4].getPosition();

	calcRoute(origin, dest);
});

function calcRoute(origin, dest){
	var directionsService = new google.maps.DirectionsService;

	directionsService.route({
		origin: origin,
		destination: dest,
		travelMode: 'DRIVING'
	},
		function(response, status) {
			if (status === 'OK') {
				directionsDisplay.setDirections(response);
			} else {
				window.alert('Directions request failed due to ' + status);
			}
		});
}