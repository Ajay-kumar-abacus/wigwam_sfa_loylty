import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController,Nav, Events, ActionSheetController, AlertController, ModalController} from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ViewProfilePage } from '../view-profile/view-profile';
import { PointLocationPage } from '../point-location/point-location';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { DomSanitizer  } from '@angular/platform-browser';
import { SelectRegistrationTypePage } from '../select-registration-type/select-registration-type';
import { HomePage } from '../home/home';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { ConstantProvider } from '../../providers/constant/constant';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Geolocation,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { LoginPage } from '../login/login';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy';
import { Device } from '@ionic-native/device';
import { DashboardPage } from '../dashboard/dashboard';
import BackgroundGeolocation from 'cordova-background-geolocation-lt';
import { AppVersion } from '@ionic-native/app-version';
import { Diagnostic } from '@ionic-native/diagnostic';
import { CameraModalPage } from '../camera-modal/camera-modal';
declare let cordova:any ;

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  
  @ViewChild(Nav) nav: Nav;
  karigar_detail:any={};
  loading:Loading;
  today_point:any='';
  last_point:any='';
  spinner:boolean = false;
  upload_url:any

   app_version:any=''
  constructor(public diagnostic: Diagnostic,public Device:Device,public navCtrl: NavController, public appVersion: AppVersion,public navParams: NavParams, public serve: MyserviceProvider,public geolocation: Geolocation ,

    public service:DbserviceProvider,public loadingCtrl:LoadingController,public locationAccuracy: LocationAccuracy, public storage: Storage,
    public events: Events,public actionSheetController: ActionSheetController,public openNativeSettings: OpenNativeSettings,
    private camera: Camera,public alertCtrl:AlertController,
    public modalCtrl: ModalController,public sanitizer: DomSanitizer,public constant : ConstantProvider){
      if(this.service.connection=='offline')
      {
        this.service.showOfflineAlert()
        this.navCtrl.setRoot(HomePage)
      }
      this.upload_url = this.constant.upload_url1 + 'profile/'
    }
    
    photoURL(url) {
      return this.sanitizer.bypassSecurityTrustUrl(url);
    }
    
    logout() {
      let alert = this.alertCtrl.create({
        title: 'Logout!',
        message: 'Are you sure you want Logout?',
        buttons: [
          {
            text: 'No',
            handler: () => {
              // this.d.('Action Cancelled!')
            }
          },
          {
            text: 'Yes',
            handler: () => {
              this.storage.set('token', '');
              this.storage.set('role', '');
              this.storage.set('displayName', '');
              this.storage.set('role_id', '');
              this.storage.set('name', '');
              this.storage.set('type', '');
              this.storage.set('token_value', '');
              this.storage.set('userId', '');
              this.storage.set('token_info', '');
              this.constant.UserLoggedInData = {};
              this.constant.UserLoggedInData.userLoggedInChk = false;
              console.log(this.constant.UserLoggedInData);
              this.events.publish('data','1', Date.now());
              this.showSuccess( " Logout Successfully ");
              BackgroundGeolocation.stop();
              this.storage.get('userPermission').then((val) => {
                console.log(val)
                if(val=='true'){
                    this.navCtrl.setRoot(LoginPage);
                   
                }else{
                    this.navCtrl.setRoot(PrivacyPolicyPage);
                }
            });
            }
          }
        ]
      })
      
      alert.present();
      
    }
    
    
    ionViewDidLoad() {
      console.log('ionViewDidLoad ProfilePage');
      if(this.service.connection!='offline')
      {
        this.presentLoading();
      }
    }
    
    ionViewWillEnter()
    {
      this.appVersion.getVersionNumber().then(resp => {
        this.app_version = resp;
    });
      if(this.service.connection!='offline')
      {
        this.getKarigarDetail();
      }
    }
    latitude:any
    longitude:any
    pointlocation(){
      this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(() => {
        let options = { maximumAge: 10000, timeout: 15000, enableHighAccuracy: true };
        this.geolocation.getCurrentPosition(options).then((resp) => {
          console.log('response geolocation', resp);
          this.latitude = resp.coords.latitude;
          this.longitude = resp.coords.longitude;
          
          this.uploadImage('','gps');
        }).catch((error) => {
          this.serve.dismissLoading()
          this.spinner = false;
          this.presentConfirm('Turn On Location permisssion !', 'please go to  <strong>Settings</strong> -> Location to turn on <strong>Location permission</strong>')
        });
      },
      error => {
        this.serve.dismissLoading()
        this.spinner = false;
        this.serve.presentToast('Please Allow Location !!')
      });
    }
    presentConfirm(title, msg) {
      let alert = this.alertCtrl.create({
        enableBackdropDismiss: false,
        title: title,
        message: msg,
        cssClass: 'alert-modal',
        buttons: [
          
          {
            text: 'Cancel',
            handler: () => {
            }
          },
          {
            text: 'Settings',
            handler: () => {
              this.openSettings()
            }
          }
        ]
      });
      alert.present();
    }
    openSettings() {
      this.openNativeSettings.open("application_details")
    }
    getKarigarDetail()
    {
      console.log('karigar');
      
      this.serve.addData( {'karigar_id': this.constant.UserLoggedInData.id },'Login/userProfile').then(r =>
        {
          console.log(r);
          this.loading.dismiss();
          this.karigar_detail=r;
          
          
        }, err => {
          this.serve.Error_msg(err);
          this.serve.dismiss();
        });
      }
      
      pointLocation()
      {
        this.navCtrl.push(PointLocationPage,{'lat':this.karigar_detail.cust_lat,'log':this.karigar_detail.cust_long,'old_loc':this.karigar_detail.cust_geo_address});
      }
      openeditprofile()
      {
        let actionsheet = this.actionSheetController.create({
          title:"Profile photo",
          cssClass: 'cs-actionsheet',
          
          buttons:[{
            cssClass: 'sheet-m',
            text: 'Camera',
            icon:'camera',
            handler: () => {
              console.log("Camera Clicked");
              // this.takePhoto();
              this.cameraModal('camera');
            }
          },
          {
            cssClass: 'sheet-m1',
            text: 'Gallery',
            icon:'image',
            handler: () => {
              console.log("Gallery Clicked");
              this.getImage();
            }
          },
          {
            cssClass: 'cs-cancel',
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
      actionsheet.present();
    }

    cameraModal(type) {
      let modal = this.modalCtrl.create(CameraModalPage,{'type':type});
  
      modal.onDidDismiss(data => {
    
        if (data != undefined && data != null) {  
          this.karigar_detail.profile = data
          console.log(this.karigar_detail.profile);
        if(this.karigar_detail.profile)
        {
          this.uploadImage(this.karigar_detail.profile,'profile');
        }
      }
      
      
        
      });
  
      modal.present();
    }
    takePhoto()
    {
      this.diagnostic.requestCameraAuthorization().then((isAvailable: any) => {
      console.log("i am in camera function");
      const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth : 500,
        targetHeight : 400
      }
      
      console.log(options);
      if(this.Device.platform=='Android'){
        cordova.plugins.foregroundService.start('Camera', 'is running');
      }
      this.camera.getPicture(options).then((imageData) => {
        this.karigar_detail.profile = 'data:image/jpeg;base64,' + imageData;
        if(this.Device.platform=='Android'){
      cordova.plugins.foregroundService.stop();
      }
        console.log(this.karigar_detail.profile);
        if(this.karigar_detail.profile)
        {
          this.uploadImage(this.karigar_detail.profile,'profile');
        }
      }, (err) => {
        if(this.Device.platform=='Android'){
        cordova.plugins.foregroundService.stop();
      }
      });
    }).catch((error: any) => {
      if(this.Device.platform=='Android'){
        cordova.plugins.foregroundService.stop();
      }
    });
    }
    getImage() 
    {
      this.diagnostic.requestCameraAuthorization().then((isAvailable: any) => {
      const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        saveToPhotoAlbum:false
      }
      console.log(options);
      if(this.Device.platform=='Android'){
        cordova.plugins.foregroundService.start('Camera', 'is running');
      }
      this.camera.getPicture(options).then((imageData) => {
        this.karigar_detail.profile = 'data:image/jpeg;base64,' + imageData;
        if(this.Device.platform=='Android'){
      cordova.plugins.foregroundService.stop();
      }
        console.log(this.karigar_detail.profile);
        if(this.karigar_detail.profile)
        {
          this.uploadImage(this.karigar_detail.profile,'profile');
        }
      }, (err) => {
        if(this.Device.platform=='Android'){
        cordova.plugins.foregroundService.stop();
      }
      });
    }).catch((error: any) => {
      if(this.Device.platform=='Android'){
        cordova.plugins.foregroundService.stop();
      }
    });
    }
    uploadImage(profile,type)
    {
      this.spinner = true
      console.log(profile);
      this.serve.addData( {'karigar_id': this.constant.UserLoggedInData.id,'profile':profile,'type':type,'lat':this.latitude,'lng':this.longitude },'Login/updateProfile').then(r =>
        {
          console.log(r)
          if(r['statusCode'] == 200){
          if(type == 'profile'){

            this.showSuccess("Profile Photo Updated")   
          }else{
            this.showSuccess("Base Location Updated")   

          }
          this.getKarigarDetail()
          this.spinner = false
        }else{
          this.getKarigarDetail()
          this.serve.errorToast(r['statusMsg'])
          this.spinner = false

        }
        })
        
      }
      
      viewProfiePic()
      {
        this.modalCtrl.create(ViewProfilePage, {"Image": this.karigar_detail.profile}).present();
      }
      
      showSuccess(text)
      {
        let alert = this.alertCtrl.create({
          title:'Success!',
          subTitle: text,
          buttons: ['OK']
        });
        alert.present();
      }
      presentLoading() 
      {
        this.loading = this.loadingCtrl.create({
          content: "Please wait...",
          dismissOnPageChange: true
        });
        this.loading.present();
      }
      
      
      editProfilePage()
      {
        this.navCtrl.push(EditProfilePage,{'detail':this.karigar_detail});
      }
    }
    