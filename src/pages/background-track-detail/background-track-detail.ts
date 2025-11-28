import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController, ActionSheetController, Platform, Events, ModalController } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { Storage } from '@ionic/storage';
import { ConstantProvider } from '../../providers/constant/constant';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { FileOpener } from '@ionic-native/file-opener';
declare const L: any


@IonicPage()
@Component({
  selector: 'page-background-track-detail',
  templateUrl: 'background-track-detail.html',
})
export class BackgroundTrackDetailPage {

  @ViewChild('map') mapElement: ElementRef;
  loading: any;
  TabType: any = 'Live';
  userData: any = {};
  userDetail: any = {};
  // deviceInfo: DeviceInfo;
  state: any;
  enabled: boolean;
  isMoving: boolean;
  distanceFilter: number;
  stopTimeout: number;
  autoSync: boolean;
  stopOnTerminate: boolean;
  startOnBoot: boolean;
  debug: boolean;
  provider: any;
  menuActive: boolean;
  motionActivity: string;
  odometer: string;
  map: any;
  locationMarkers: any;
  currentLocationMarker: any;
  lastLocation: any;
  stationaryRadiusCircle: any;
  pageFrom: any;
  polyline: any;
  DateData: any;
  latest_location: any;
  userID: any = '';
  Multiple_Location: any = [];
  mapOptions: any = {};
  polylinePath: any = [];
  myMap: any
  router: any

  constructor(public navCtrl: NavController, private fileOpener: FileOpener,
    public events: Events, public constant: ConstantProvider, public modalCtrl: ModalController, public loadingCtrl: LoadingController,
    public navParams: NavParams, public service: MyserviceProvider, public toastCtrl: ToastController, public alertCtrl: AlertController,
    public storage: Storage, public actionSheetController: ActionSheetController, public db: DbserviceProvider,
    private zone: NgZone,
    private platform: Platform,
  ) {

    this.pageFrom = this.navParams.get('from')
    if (this.pageFrom == 'attendance') {
      this.userID = this.navParams.get('userID')
      this.DateData = this.navParams.get('date')

    } else {

      this.userDetail = this.navParams.get('userDetail')
      this.DateData = this.navParams.get('date')
      this.userID = this.userDetail.user_data.id
    }

    this.state = {};
    this.isMoving = false;
    this.enabled = false;
    this.autoSync = true;
    this.distanceFilter = 10;
    this.stopTimeout = 1;
    this.stopOnTerminate = false;
    this.startOnBoot = true;
    this.debug = true;

    // UI members.
    this.motionActivity = 'Activity';
    this.menuActive = false;
  }
  // ionViewDidLoad() {

  //   console.log('ionViewDidLoad HomePage');
  //   this.getuserDetail()
  // }
  ionViewWillEnter() {
    this.getuserDetail()

  }
  getuserDetail() {
    console.log(this.userID, "user id")

    this.service.presentLoading()

    this.service.addData({ 'user_id': this.userID, 'start_date': this.DateData }, 'AppLocation/getLatestGeoLocation').then((result) => {
      if (result['statusCode'] == 200) {

        this.latest_location = result['latest_location']
        this.userData = result['user_data']
        this.Multiple_Location = result['data']
        this.locationMarkers = this.Multiple_Location
        this.configureMap(this.TabType);
        this.service.dismissLoading()

      } else {
        this.service.errorToast(result['statusMsg'])
        this.service.dismissLoading()

      }
    }, err => {
      this.service.Error_msg(err);
      this.service.dismiss();
    });


  }






  configureMap(TabType) {

    if (this.myMap) {
      this.myMap.off(); // Remove the existing map if it exists
      this.myMap.remove(); // Remove the existing map if it exists
    }
    if (TabType == 'Tracker') {
      this.myMap = L.map('map').setView([this.locationMarkers[0].lat, this.locationMarkers[0].lng], 16);
      var OSM = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 22,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      })
      OSM.addTo(this.myMap);

      var googleHybrid = L.tileLayer('http://{s}.google.com/vt?lyrs=s,h&x={x}&y={y}&z={z}', {
        maxZoom: 22,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      });

      var googleStreets = L.tileLayer('http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 22,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      });

      var Dark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 22
      });
      const markerClusterGroup = L.markerClusterGroup();
      const polylinePoints = this.locationMarkers

      polylinePoints.forEach((point, index) => {

        const marker = L.marker([point.lat, point.lng]).addTo(this.myMap);

        if (point.type == 'Checkin') {
          marker.setIcon(L.icon({
            iconUrl: './assets/location/checkin.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            riseOnHover: true,
          }));
          marker.bindPopup(`<p><strong><span style="color: blue">Checkin</span></strong><br /><strong>Customer : </strong> ${point.dr_name}<br /><strong>Address : </strong> ${point.address}</p>`);
        }
        else if (point.type == 'Checkout') {
          marker.setIcon(L.icon({
            iconUrl: './assets/location/checkout.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            riseOnHover: true,
          }));
          marker.bindPopup(`<p><strong><span style="color: blue">Checkout</span></strong><br /><strong>Customer : </strong> ${point.dr_name}<br /><strong>Address : </strong> ${point.address}</p>`);
        }
        else if (point.type == 'Attendence Start') {

          marker.setIcon(L.icon({
            iconUrl: './assets/location/start_point.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            riseOnHover: true,
          }));
          marker.bindPopup('Address : ' + point.address)
        }
        else if (point.type == 'Attendence Stop') {

          marker.setIcon(L.icon({
            iconUrl: './assets/location/end_point.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            riseOnHover: true,
          }));
          marker.bindPopup('Address : ' + point.address)
        }
        else if (point.type == 'Checkout') {

          marker.setIcon(L.icon({
            iconUrl: './assets/location/bg_location.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            riseOnHover: true,
          }));
        }
        else {
          marker.setIcon(L.icon({
            iconUrl: './assets/location/bg_location.png',
            iconSize: [28, 28],
            iconAnchor: [16, 32],
            riseOnHover: true,
          }));
        }

        markerClusterGroup.addLayer(marker);
      });
      this.myMap.addLayer(markerClusterGroup);
      const animatedMarker = L.marker(polylinePoints[0], {
        icon: L.icon({
          iconUrl: './assets/location/person.png',
          iconSize: [40, 40],
          iconAnchor: [16, 32],
          riseOnHover: true,
        }),
      }).addTo(this.myMap);

      var baseLayers = {
        "Streets": googleStreets,
        "OpenStreetMap": OSM,
        "Hybrid": googleHybrid,
        "Dark": Dark
      };
      L.control.layers(baseLayers).addTo(this.myMap);
      const waypoints = polylinePoints.map(point => L.latLng(point.lat, point.lng));

      var polyline = L.polyline(waypoints, { linecap: 'round', color: '#00007b', stroke: true, weight: 4, lineJoin: 'round', fill: false }).addTo(this.myMap);
      this.myMap.fitBounds(polyline.getBounds());



      this.map = this.myMap;

    } else {
      this.myMap = L.map('map').setView([this.latest_location.lat, this.latest_location.lng], 16);
      var OSM = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 22,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      })
      OSM.addTo(this.myMap);
      const marker = L.marker([this.latest_location.lat, this.latest_location.lng]).addTo(this.myMap);
      marker.setIcon(L.icon({
        iconUrl: './assets/location/person.png',
        iconSize: [40, 40],
        iconAnchor: [16, 32],
        riseOnHover: true,
      }));
      marker.bindPopup('Address :' + this.latest_location.gps)

    }


  }
  // configureMap(TabType) {
  //   if (TabType == 'Tracker') {
  //     // Code for displaying multiple location markers and polyline
  //     this.locationMarkers = this.Multiple_Location;

  //     // Create a map centered on the first marker's position
  //     let latLng = new google.maps.LatLng(this.Multiple_Location[0].lat, this.Multiple_Location[0].lng);

  //     let mapOptions = {
  //       center: latLng,
  //       zoom: 17,
  //       mapTypeId: google.maps.MapTypeId.ROADMAP,
  //     };

  //     this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

  //     // Use the Directions Service to fetch and display the route
  //     const directionsService = new google.maps.DirectionsService();
  //     const polylinePath = this.locationMarkers.map(point => ({
  //       lat: point.lat,
  //       lng: point.lng,
  //       type: point.type
  //     }));
  //     polylinePath.forEach((point, index) => {
  //       let customMarkerIcon
  //       if (point.type == 'Checkin') {
  //         customMarkerIcon = {
  //           url: './assets/location/checkin.png',
  //           scaledSize: new google.maps.Size(30, 30),
  //         }
  //       }
  //       else if (point.type == 'Attendence Start' || point.type == 'Attendence Stop') {
  //         customMarkerIcon = {
  //           url: './assets/location/start_point.png',
  //           scaledSize: new google.maps.Size(30, 30),
  //         }
  //       }
  //       else {
  //         customMarkerIcon = {
  //           url: './assets/location/location.png',
  //           scaledSize: new google.maps.Size(30, 30),
  //         }
  //       }

  //       new google.maps.Marker({
  //         position: point,
  //         map: this.map,
  //         title: `Waypoint ${index + 1}`,
  //         icon: customMarkerIcon,
  //       });
  //     });
  //     const origin = polylinePath[0];
  //     const destination = polylinePath[polylinePath.length - 1];
  //     // const chunkSize = 23; // Max waypoints per request
  //     const maxWaypoints = 20;
  //     const waypoints = this.reduceWaypoints(polylinePath.slice(1, polylinePath.length - 1), maxWaypoints); // Make a copy of all waypoints

  //     // const processChunk = () => {
  //     directionsService.route(
  //       {
  //         origin,
  //         destination,
  //         waypoints: waypoints.map(coord => ({
  //           location: new google.maps.LatLng(coord.lat, coord.lng),
  //           stopover: true,
  //         })),
  //         travelMode: google.maps.TravelMode.DRIVING,
  //         provideRouteAlternatives: false, // Display only one route
  //       },
  //       (response, status) => {
  //         if (status === google.maps.DirectionsStatus.OK) {
  //           const route = response.routes[0];
  //           const path = route.overview_path;
  //           const polyline = new google.maps.Polyline({
  //             path: path,
  //             strokeColor: '#081099',
  //             strokeOpacity: 1,
  //             strokeWeight: 5,
  //             icons: [{
  //               repeat: '30px',
  //               icon: {
  //                 path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
  //                 scale: 1,
  //                 fillOpacity: 0,
  //                 strokeColor: '#ffffff',
  //                 strokeWeight: 1,
  //                 strokeOpacity: 1
  //               }
  //             }],
  //             map: this.map,
  //           });
  //         } else {
  //           console.error('Directions request failed:', status);
  //         }
  //       }
  //     );

  //   } else {
  //     // Code for displaying a single location marker
  //     let latLng = new google.maps.LatLng(this.latest_location.lat, this.latest_location.lng);

  //     let mapOptions = {
  //       center: latLng,
  //       zoom: 17,
  //       mapTypeId: google.maps.MapTypeId.TERRAIN,
  //       zoomControl: false,
  //       mapTypeControl: false,
  //       panControl: false,
  //       rotateControl: false,
  //       scaleControl: false,
  //       streetViewControl: false,
  //       disableDefaultUI: true
  //     };
  //     this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

  //     new google.maps.Marker({
  //       position: latLng,
  //       map: this.map,
  //       title: 'Current Location',
  //       icon: {
  //         path: google.maps.SymbolPath.CIRCLE,
  //         scale: 12,
  //         fillColor: COLORS.polyline_color,
  //         fillOpacity: 1,
  //         strokeColor: COLORS.lightGrey,
  //         strokeOpacity: 1,
  //         strokeWeight: 6
  //       }
  //     });

  //   }
  // }
  // reduceWaypoints(waypoints, max) {
  //   const step = Math.ceil(waypoints.length / max);
  //   return waypoints.filter((elem, index) => index % step === 0);
  // }
}
