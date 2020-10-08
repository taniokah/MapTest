"use strict";

window.onload = function() {
  var btn = document.getElementById('send');
  btn.addEventListener('click', function() {
    const markerData = $.cookie('markerData');
    window.open('mailto:tanioka.hiroki@tokushima-u.ac.jp?subject=gpstest&body=' + markerData);
  }, false);

  //$.cookie.json = true;
  //$.cookie('markerData', JSON.stringify(markerData), {secure: true});
};

var watchId;
/*
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
};*/

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

  navigator.geolocation.watchPosition(function (position) {
    (function() {
      let mark = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        altitude: position.coords.altitude,
        accuracy: position.coords.accuracy,
        altitudeAccuracy: position.coords.altitudeAccuracy,
        heading: position.coords.heading,
        speed: position.coords.speed,
        timestamp: position.timestamp
      };

      const marker = new google.maps.Marker({
        position: {lat: mark.latitude, lng: mark.longitude},
        title:    mark.timestamp,
        icon:     "",
        map: map
      });

      const infoWindow = new google.maps.InfoWindow({
        content: position.coords.latitude + "<br>" +
                "," + position.coords.longitude + "<br>" +
                "(" + position.coords.speed + ")"
      });

      marker.addListener('click', function() {
        infoWindow.open(map, marker);
      });

      let markerData = JSON.parse($.cookie('markerData'));
      markerData = markerData.length > 10 ? markerData.slice(-10) : markerData;
      markerData.push(mark);

      $.cookie('markerData', JSON.stringify(markerData), {secure: true});
    }());
  }, error, option);

}
