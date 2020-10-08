"use strict";

window.onload = function() {
  var btn = document.getElementById('send');
  btn.addEventListener('click', function() {
    const markerData = JSON.parse($.cookie('markerData'));
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
    const pos = {lat: position.coords.latitude, lng: position.coords.longitude};
    (function() {
      const marker = new google.maps.Marker({
        position: pos,
        title:    "現在地",
        icon:     "",
        map: map
      });

      let mark = {
        pos: {lat: position.coords.latitude, lng: position.coords.longitude},
        title: "position.timestamp",
        icon: "",
        infoWindowOpen: true,
        infoWindowCotent: "" + position.coords.latitude + "<br>" +
                "," + position.coords.longitude + "<br>" +
                "," + position.coords.speed + "<br>" +
                " (" + position.timestamp + ")"
      };
      const infoWindow = new google.maps.InfoWindow({
        content: mark.infoWindowContent
      });

      marker.addListener('click', function() {
        infoWindow.open(map, marker);
      });

      const markerData = JSON.parse($.cookie('markerData'));
      markerData.push(mark);

      $.cookie('markerData', JSON.stringify(markerData), {secure: true});
    }());
  }, error, option);

}
