import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  public lat;
  public lng;

  constructor() {
  }

//   getLocation(): Promise<any> {
//     document.addEventListener("deviceready", onDeviceReady, false);
//    function onDeviceReady() {
//    alert("navigator.geolocation works well");
// }

 //   return new Promise((resolve, reject) => {
   //    navigator.geolocation.getCurrentPosition(
   //      function(position) {
   //       alert("Lat: " + position.coords.latitude + "\nLon: " + position.coords.longitude);
   //       resolve({lng: position.coords.longitude, lat: position.coords.latitude});
   //       //   alert("Lat: " + position.coords.latitude + "\nLon: " + position.coords.longitude);
   //      },
   //      function(error) {
   //       alert(error.message);
   //       reject({ error });
   //       //   alert(error.message);
   //      }, {
   //         enableHighAccuracy: true,
   //         timeout: 5000
   //      }
   //   );
    //}).then(function(result) {
    //   return Promise.resolve(result);
  //  })
  //  .catch(error => error);
//}
}
  


