"use strict";

window.onload = function() {
  //$.cookie.json = true;
  let markerData = [
    {
    	pos: { lat: 34.0785302, lng: 134.5598359 },
	    title: "徳島大学情報センター",
      icon: "",
      infoWindowOpen: true ,
      infoWindowContent: "<h3>徳島大学情報センター</h3><p><img src='https://lh5.googleusercontent.com/p/AF1QipPFYULtooVYVBCalq4Yd8_CDIWp9Wi7lU-ihBQ7=w426-h240-k-no' width='200px'></p>"
    },
    {
    	pos: { lat: 34.0769362, lng: 134.5594632 },
      title: "徳島大学付属図書館",
      icon: "",
      infoWindowOpen: false,
      infoWindowContent: "<h3>徳島大学付属図書館</h3><p><img src='https://lh5.googleusercontent.com/p/AF1QipO5Z_pZaO47_pWD7qtvIwPQoMom5hzcirDBktkO=w408-h306-k-no' width='200px'></p>"
    },
  ];

  $.cookie('markerData', JSON.stringify(markerData), {secure:true});
};

var watchId;

var success = function (position) {
  var result = '<tr>' +
    '<td>' + position.coords.latitude + '</td>' +
    '<td>' + position.coords.longitude + '</td>' +
    '<td>' + position.coords.altitude + '</td>' +
    '<td>' + position.coords.accuracy + '</td>' +
    '<td>' + position.coords.altitudeAccuracy + '</td>' +
    '<td>' + position.coords.heading + '</td>' +
    '<td>' + position.coords.speed + '</td>' +
    '<td>' + position.timestamp + '</td>' +
    '</tr>';
  //$('#result').append(result);
  console.log(result);
};

// 位置情報取得に失敗したとき呼ばれるcallback関数
var error = function (error) {
  var result = '<tr>' +
    '<td>' + error.code + '</td>' +
    '<td>' + error.message + '</td>' +
    '</tr>';
  //$('#errorresult').append(result);
  console.error(result);
};

// 位置情報取得時に設定するオプション
var option = {
  enableHighAccuracy: true,
  timeout : 10000,
  maximumAge: 0
};

let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: {
      lat: 34.0785302,
      lng: 134.5598359
    },
    zoom: 15
  });
  map.setMapTypeId(google.maps.MapTypeId.SATELLITE);

  //$.cookie.json = true;
  const markerData = JSON.parse($.cookie('markerData'));

  for (const mark of markerData) {
    (function() {
      const marker = new google.maps.Marker({
        position: mark.pos,
        title:    mark.title,
        icon:     mark.icon,
        map: map
      });

      if (mark.infoWindowContent) {
        const infoWindow = new google.maps.InfoWindow({
          content: mark.infoWindowContent
        });

        marker.addListener('click', function() {
          infoWindow.open(map, marker);
        });
        if (mark.infoWindowOpen) {
          infoWindow.open(map, marker);
        }
      }
    }());
  }

  navigator.geolocation.watchPosition(success, error, option)
}
