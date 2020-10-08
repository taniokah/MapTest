"use strict";

window.onload = function() {
  var btn = document.getElementById('send');
  btn.addEventListener('click', function() {
    //const markerData = $.cookie('markerData');
    const markerData = localStorage.getItem('markerData');
    window.open('mailto:tanioka.hiroki@tokushima-u.ac.jp?subject=gpstest&body=' + markerData);
  }, false);

  //$.cookie.json = true;
  //$.cookie('markerData', JSON.stringify(markerData), {secure: true});
  //let markerData = JSON.parse($.cookie('markerData'));
  let markerData = JSON.parse(localStorage.getItem('markerData'));
  if (markerData == null) {
    markerData = [];
  }
  if (markerData.length > 0) {
    if ((new Date()).getTime() - markerData.slice(-1)[0].timestamp > 86400000) {
      //$.cookie('markerData', JSON.stringify([]), {secure: true});
      localStorage.setItem('markerData', JSON.stringify([]));
    }
  }
  localStorage.setItem('markerData', JSON.stringify(markerData));
};

var watchId;

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

  watchId = navigator.geolocation.watchPosition(function (position) {
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
        title:    "" + mark.timestamp,
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

      //let markerData = JSON.parse($.cookie('markerData'));
      let markerData = JSON.parse(localStorage.getItem('markerData'));
      if (markerData == null) {
        markerData = [];
      }
      if (markerData.length > 0) {
        markerData = markerData.length > 2880 ? markerData.slice(-10) : markerData;
      }
      markerData.push(mark);

      //$.cookie('markerData', JSON.stringify(markerData), {secure: true});
      localStorage.setItem('markerData', JSON.stringify(markerData));
    }());
  }, error, option);

}
