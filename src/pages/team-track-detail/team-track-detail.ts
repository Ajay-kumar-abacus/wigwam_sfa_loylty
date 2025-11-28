
import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { Storage } from '@ionic/storage';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { CheckinNewPage } from '../checkin-new/checkin-new';

declare const L: any;

interface UserLocation {
  lat: number;
  lng: number;
  gps: string;
  username: string;
  avatar?: string;
  role?: string;
  timestamp?: string;
  status?: string;
}


@IonicPage()
@Component({
  selector: 'page-team-track-detail',
  templateUrl: 'team-track-detail.html',
})
export class TeamTrackDetailPage {
  @ViewChild('map') mapElement: ElementRef;
  
  TabType: string = 'Live';
  myMap: any;
  markers: any[] = [];
  
  isBottomSheetOpen: boolean = false;
  selectedUser: UserLocation = null;
  
  // Current location
  latest_location: UserLocation = {
    lat: 37.7749,
    lng: -122.4194,
    gps: "123 Market Street, San Francisco, CA 94105",
    username: "Admin"
  };
  userLocations: any;
  userDetail: any;
  
  // Array for multiple user locations
  // userLocations: UserLocation[] = [
  //   {
  //     lat: 28.6139,
  //     lng: 77.2090,
  //     gps: "Rajpath Area, Central Secretariat, New Delhi, Delhi 110001",
  //     username: "John Smith",
  //     avatar: "assets/avatars/john.jpg",
  //     role: "Sales Representative",
  //     timestamp: "2025-04-24T10:00:00",
  //     status: "Active"
  //   },
  //   {
  //     lat: 28.6448,
  //     lng: 77.2167,
  //     gps: "Connaught Place, New Delhi, Delhi 110001",
  //     username: "Sarah Johnson",
  //     avatar: "assets/avatars/sarah.jpg",
  //     role: "Field Agent",
  //     timestamp: "2025-04-24T10:15:00",
  //     status: "Idle"
  //   },
  //   {
  //     lat: 28.6132,
  //     lng: 77.2922,
  //     gps: "Lajpat Nagar, New Delhi, Delhi 110024",
  //     username: "Michael Chen",
  //     avatar: "assets/avatars/michael.jpg",
  //     role: "Delivery Driver",
  //     timestamp: "2025-04-24T10:30:00",
  //     status: "En Route"
  //   },
  //   {
  //     lat: 28.6353,
  //     lng: 77.2250,
  //     gps: "Karol Bagh, New Delhi, Delhi 110005",
  //     username: "Lisa Garcia",
  //     avatar: "assets/avatars/lisa.jpg",
  //     role: "Customer Service",
  //     timestamp: "2025-04-24T10:45:00",
  //     status: "On Break"
  //   }
  // ];
  

  constructor(
    public navCtrl: NavController,
    public service: MyserviceProvider,
    public storage: Storage, 
    public db: DbserviceProvider,
    private renderer: Renderer2
  ) {
   
  }

  ionViewWillEnter() {
 
    setTimeout(() => {
      this.configureMap();
    }, 2000);
    this.getteamDetail()
  }

  getteamDetail() {
   

   this.service.presentLoading()

    this.service.addData({}, 'AppAttendence/teamMemberMapData').then((result) => {
      if (result['statusCode'] == 200) {

        this.userLocations = result['result']
      
    
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


  configureMap() {
    if (this.myMap) {
      this.myMap.off();
      this.myMap.remove();
      this.markers = [];
    }
    
    // Initialize the map centered on the latest location
    this.myMap = L.map('map').setView([this.latest_location.lat, this.latest_location.lng], 13);
    
    // Add Google Streets layer
    const googleStreets = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '&copy; Google Maps'
    });
    
    googleStreets.addTo(this.myMap);
    
    // Add markers for each user location
    this.addUserMarkers();
    
    // Set map bounds to include all markers
    this.fitMapToMarkers();
  }

  addUserMarkers() {
    // Add markers for all user locations
    this.userLocations.forEach(location => {
      // Get first letter of username for the marker label
      const firstLetter = location.name.charAt(0).toUpperCase();
      
      // Create custom marker with the first letter
      const customIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `<div class="marker-circle">${firstLetter}</div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });
      
      // Add marker to map with custom icon
      const marker = L.marker([location.latestLat, location.latestLng], {
        icon: customIcon
      }).addTo(this.myMap);
      
      // When marker is clicked, open bottom sheet with user details
      marker.on('click', () => {
        this.openBottomSheet(location);
      });
      
      this.markers.push(marker);
    });
  }

  fitMapToMarkers() {
    if (this.markers.length > 0) {
      const group = L.featureGroup(this.markers);
      this.myMap.fitBounds(group.getBounds(), { padding: [50, 50] });
    }
  }
  getuserDetail(user) {
   

    this.service.presentLoading()

    this.service.addData({'user_id':user.id}, 'AppAttendence/teamMemberMapDataDetail').then((result) => {
      if (result['statusCode'] == 200) {

        this.selectedUser = result['result']
        this.isBottomSheetOpen = true;
      
    
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

  openBottomSheet(user: UserLocation) {
   
    this.getuserDetail(user)
   
  }

  closeBottomSheet() {
    this.isBottomSheetOpen = false;
    this.configureMap();
  }

  // Calculate how long ago the timestamp was
  getTimeAgo(timestamp: string): string {
    if (!timestamp) return 'N/A';
    
    const now = new Date();
    const time = new Date(timestamp);
    const diff = Math.floor((now.getTime() - time.getTime()) / 60000); // minutes
    
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff} minutes ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
    return `${Math.floor(diff / 1440)} days ago`;
  }

  // Navigate to user detail page
  viewUserDetail(user) {

   this.navCtrl.push(CheckinNewPage,{'userIdTrack':user.id});
  }

  // Call the selected user
  callUser(user: UserLocation) {
    console.log('Calling:', user.username);
    // Implement call functionality
  }

  // Send message to selected user
  messageUser(user: UserLocation) {
    console.log('Messaging:', user.username);
    // Implement message functionality
  }
  goBack(){
    this.navCtrl.pop();
  }
}




