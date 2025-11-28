import { Component } from '@angular/core';
import {
  IonicPage, NavController, NavParams, ToastController, ViewController, ActionSheetController,
  LoadingController, Events, AlertController, Platform,
  ModalController
} from 'ionic-angular';
import { AttendenceserviceProvider } from '../../providers/attendenceservice/attendenceservice';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Geolocation } from '@ionic-native/geolocation';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { GeolocationserviceProvider } from '../../providers/geolocationservice/geolocationservice';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { ConstantProvider } from '../../providers/constant/constant';
import { SelectRegistrationTypePage } from '../select-registration-type/select-registration-type';
import BackgroundGeolocation, {
  State,
  Config,
  Location,
  LocationError,
  Geofence,
  HttpEvent,
  MotionActivityEvent,
  ProviderChangeEvent,
  MotionChangeEvent,
  GeofenceEvent,
  GeofencesChangeEvent,
  HeartbeatEvent,
  ConnectivityChangeEvent
} from "cordova-background-geolocation-lt";
import { Device } from '@ionic-native/device';
import { Diagnostic } from '@ionic-native/diagnostic';
import { CameraModalPage } from '../camera-modal/camera-modal';
declare let cordova: any;
@IonicPage()
@Component({
  selector: 'page-work-type-modal',
  templateUrl: 'work-type-modal.html',
})
export class WorkTypeModalPage {
  working_type: any = []
  checkin_data: any = [];
  input_type: any = false;
  spinner: any = false;
  user_id: any
  id: any
  image: any = '';
  image_data: any = [];
  data: any = {};
  type: string = '';
  strtReadin: any = 0;
  workType: any = '';
  leave_data_count: any = {}
  leave_data: any = []
  loading: any = ''
  Authtoken: any = ''
  camera_flag: any = 0;
  history: string = "Ledger";
  cacheTime: number;
  cachedPosition: any;



  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public navParams: NavParams,
    public serv: AttendenceserviceProvider,
    public viewcontrol: ViewController,
    public loadingCtrl: LoadingController,
    public actionSheetController: ActionSheetController,
    public locationAccuracy: LocationAccuracy,
    public serve: MyserviceProvider,
    public geolocation: Geolocation,
    private camera: Camera,
    public Device: Device,
    public diagnostic: Diagnostic,
    public constant: ConstantProvider,
    private storage: Storage,
    public track: GeolocationserviceProvider,
    public openNativeSettings: OpenNativeSettings,
    public alertCtrl: AlertController,
    public events: Events,
    public platform: Platform) {
      this.preWarmLocation()
    this.type = this.navParams.get('type');
    this.id = this.navParams.get('id');
    this.image = this.navParams.get('image');
    this.image_data = this.navParams.get('image_data');
    this.camera_flag = this.navParams.get('camera_flag');
    if (this.type == 'start') {
      this.storage.get('userId').then((id) => {
        if (typeof (id) !== 'undefined' && id) {
          this.user_id = id;
        }
      });
    }
    this.storage.get('token').then((value) => {
      this.Authtoken = value
    });


    if (this.type != "stop") {
      this.data.working_type = 'Own Bike';
    }
    if (this.type == "stop") {
      this.data.working_type = this.navParams.get('working_type');
    }
  }


  close() {

    this.viewcontrol.dismiss();
  }
  presentLoading() {
    this.loading = this.loadingCtrl.create({
      spinner: 'dots',
    });

    this.loading.present();
  }


  startAttendAlert() {
    this.spinner = true
    if (this.image_data != '') {
      this.platform.ready().then(() => {
        if (this.Device.platform == 'Android') {
          var whiteList = ['com.package.example', 'com.package.example2'];
          (<any>window).gpsmockchecker.check(whiteList, (result) => {

            if (result.isMock) {

              let alert = this.alertCtrl.create({
                title: 'Alert!',
                subTitle: 'Please Remove Third Party Location Apps',
                buttons: [
                  {
                    text: 'Ok',
                    handler: () => {
                      this.serve.addData({ 'app_name': result.mocks[0]['name'], 'package_name': result.mocks[0]['package'] }, 'Login/thirdPartyDisabled').then((result) => {
                        if (result['statusCode'] == 200) {
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
                          this.events.publish('data', '1', Date.now());
                          this.serve.errorToast("Your account is blocked");
                          this.navCtrl.setRoot(SelectRegistrationTypePage);

                        } else {
                          this.serve.errorToast(result['statusMsg'])
                        }
                      },
                        error => {
                          this.serve.Error_msg(error);
                        })
                    }
                  }
                ]
              });
              alert.present();
            }
            else {
              this.startAttendence()
            };
          }, (error) => console.log(error));
        } else {
          this.startAttendence()
        }
      })

    } else {
      this.spinner = false;
      this.serve.dismissLoading();
      this.serve.errorToast('Please Upload Image')
    }
  }
  // startAttendence() {
  //   this.spinner = true;
  //   this.serve.presentLoading();
  //   this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
  //     () => {

  //       let options = { maximumAge: 10000, timeout: 15000, enableHighAccuracy: true };
  //       this.geolocation.getCurrentPosition(options).then((resp) => {

  //         var lat = resp.coords.latitude
  //         var lng = resp.coords.longitude
  //         this.serve.addData({ 'lat': lat, 'lng': lng, 'image': this.image_data, 'working_type': this.data.working_type }, 'AppAttendence/startAttendence').then((result) => {
  //           if (result['statusCode'] == 200) {
  //             this.events.publish('user:login');
  //             this.viewcontrol.dismiss();
  //             this.serve.dismissLoading();
  //             this.serve.successToast(result['statusMsg'])
  //             this.image_data = []
  //             this.spinner = false;

  //           } else {
  //             this.spinner = false;
  //             this.viewcontrol.dismiss();
  //             this.serve.dismissLoading()
  //             this.image_data = []
  //             this.serve.errorToast(result['statusMsg'])
  //           }
  //         },
  //           error => {
  //             this.serve.Error_msg(error);
  //             this.spinner = false;
  //             this.serve.dismissLoading()
  //           })

  //       }).catch((error) => {

  //       });
  //     },
  //     error => {
  //       this.serve.dismissLoading();
  //       this.spinner = false;
  //       this.serve.errorToast('Please Allow Location!!')
  //     })
  // }
  async preWarmLocation(): Promise<void> {
  try {
    // Start location services early
    const canRequest = await this.locationAccuracy.canRequest();
    if (canRequest) {
      await this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
    }
    
    // Cache a position
    this.cachedPosition = await this.geolocation.getCurrentPosition({
      maximumAge: 60000,
      timeout: 5000,
      enableHighAccuracy: false
    });
    this.cacheTime = Date.now();
  } catch (error) {
    console.log('Pre-warm failed:', error);
  }
}

  async startAttendence(): Promise<void> {
  try {
    this.spinner = true;
    this.serve.presentLoading();

    let position;
    
    // Use cached position if it's less than 30 seconds old
    if (this.cachedPosition && (Date.now() - this.cacheTime) < 60000) {
      position = this.cachedPosition;
    } else {
      // Get fresh position with shorter timeout
      position = await this.geolocation.getCurrentPosition({
        maximumAge: 15000,
        timeout: 5000,
        enableHighAccuracy: false
      });
    }

    // Submit attendance data
    const result = await this.serve.addData({
      'lat': position.coords.latitude,
      'lng': position.coords.longitude,
      'image': this.image_data,
      'working_type': this.data.working_type
    }, 'AppAttendence/startAttendence');

    // Handle response
    if (result['statusCode'] == 200) {
      this.events.publish('user:login');
      this.viewcontrol.dismiss();
      this.serve.successToast(result['statusMsg']);
    } else {
      this.viewcontrol.dismiss();
      this.serve.errorToast(result['statusMsg']);
    }

  } catch (error) {
    // Handle location permission or geolocation errors
    if (error.code === 1) {
      this.serve.errorToast('Please Allow Location!!');
    } else {
      this.serve.Error_msg(error);
    }
  } finally {
    // Always cleanup
    this.spinner = false;
    this.serve.dismissLoading();
    this.image_data = [];
  }
}
  startAttend1Alert() {
    this.platform.ready().then(() => {
      if (this.Device.platform == 'Android') {
        var whiteList = ['com.package.example', 'com.package.example2'];
        (<any>window).gpsmockchecker.check(whiteList, (result) => {

          if (result.isMock) {

            let alert = this.alertCtrl.create({
              title: 'Alert!',
              subTitle: 'Please Remove Third Party Location Apps',
              buttons: [
                {
                  text: 'Ok',
                  handler: () => {
                    this.serve.addData({ 'app_name': result.mocks[0]['name'], 'package_name': result.mocks[0]['package'] }, 'Login/thirdPartyDisabled').then((result) => {
                      if (result['statusCode'] == 200) {
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
                        this.events.publish('data', '1', Date.now());
                        this.serve.errorToast("Your account is blocked");
                        this.navCtrl.setRoot(SelectRegistrationTypePage);

                      } else {
                        this.serve.errorToast(result['statusMsg'])
                      }
                    },
                      error => {
                        this.serve.Error_msg(error);
                      })
                  }
                }
              ]
            });
            alert.present();
          }
          else {
            this.StartAttendence1()
          };
        }, (error) => console.log(error));
      } else {
        this.StartAttendence1()
      }
    })
  }



  StartAttendence1() {
    this.serve.presentLoading();
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {

        let options = { maximumAge: 10000, timeout: 15000, enableHighAccuracy: true };
        this.geolocation.getCurrentPosition(options).then((resp) => {

          var lat = resp.coords.latitude
          var lng = resp.coords.longitude
          this.serve.addData({ 'lat': lat, 'lng': lng, 'image': this.image_data, 'working_type': this.data.working_type }, 'AppAttendence/  ence').then((result) => {
            if (result['statusCode'] == 200) {
              this.events.publish('user:login');
              this.viewcontrol.dismiss();
              this.serve.dismissLoading();
              this.serve.successToast(result['statusMsg'])
              this.image_data = []
              this.spinner = false;

            } else {
              this.spinner = false;
              this.viewcontrol.dismiss();
              this.serve.dismissLoading()
              this.image_data = []
              this.serve.errorToast(result['statusMsg'])
            }
          },
            error => {
              this.serve.Error_msg(error);
              this.spinner = false;
              this.serve.dismissLoading()
            })

        }).catch((error) => {
          this.serve.dismissLoading();
          this.spinner = false;
          this.presentConfirm('Turn On Location permisssion !', 'please go to Settings -> Location to turn on <strong>Location permission</strong>')
        });
      },
      error => {
        this.serve.dismissLoading();
        this.spinner = false;
        this.serve.errorToast('Please Allow Location!!')
      })
  }


  stopAttendanceAlert() {
    this.spinner = true

    if (this.checkin_data.length == 0 || this.checkin_data == null) {
      this.platform.ready().then(() => {
        if (this.Device.platform == 'Android') {

          var whiteList = ['com.package.example', 'com.package.example2'];
          (<any>window).gpsmockchecker.check(whiteList, (result) => {
            if (result.isMock) {
              this.spinner = false
              let alert = this.alertCtrl.create({
                title: 'Alert!',
                subTitle: 'Please Remove Third Party Location Apps',
                buttons: [
                  {
                    text: 'Ok',
                    handler: () => {
                      this.serve.addData({ 'app_name': result.mocks[0]['name'], 'package_name': result.mocks[0]['package'] }, 'Login/thirdPartyDisabled').then((result) => {
                        if (result['statusCode'] == 200) {
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
                          this.events.publish('data', '1', Date.now());
                          this.serve.errorToast("Your account is blocked");
                          this.navCtrl.setRoot(SelectRegistrationTypePage);
                        } else {
                          this.serve.errorToast(result['statusMsg'])
                        }
                      },
                        error => {
                          this.serve.Error_msg(error);
                        })
                    }
                  }
                ]
              });
              alert.present();
            }
            else {
              this.spinner = false
              let alert = this.alertCtrl.create({
                title: 'Stop Time',
                message: 'Do you want to stop work time?',
                cssClass: 'alert-modal',
                buttons: [
                  {
                    text: 'No',
                    role: 'cancel',
                    handler: () => {
  
                    }
                  },
                  {
                    text: 'Yes',
                    handler: () => {
                      this.stop_attend();
  
                    }
                  }
  
  
                ]
              });
              alert.present();
            }
  
  
          });
        }else {
          this.spinner = false
          let alert = this.alertCtrl.create({
            title: 'Stop Time',
            message: 'Do you want to stop work time?',
            cssClass: 'alert-modal',
            buttons: [
              {
                text: 'No',
                role: 'cancel',
                handler: () => {

                }
              },
              {
                text: 'Yes',
                handler: () => {
                  this.stop_attend();

                }
              }


            ]
          });
          alert.present();
        }

      });
    } else {
      this.spinner = false
      this.serve.errorToast('Please Check Out First')
    }

  }

  stop_attend() {
    this.serve.presentLoading()
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(() => {
      let options = { maximumAge: 10000, timeout: 15000, enableHighAccuracy: false };
      this.geolocation.getCurrentPosition(options).then((resp) => {
        var lat = resp.coords.latitude
        var lng = resp.coords.longitude
        this.serve.addData({ 'lat': lat, 'lng': lng, 'attendence_id': this.id, 'image': this.image_data }, "AppAttendence/stopAttendence").then((result) => {
          if (result['statusCode'] == 200) {
            this.viewcontrol.dismiss(true);
            this.serve.dismissLoading()
            this.serve.successToast(result['statusMsg']);
            this.stopBackgroundGeolocation()
            this.image_data = []
            this.spinner = false;
          } else {

            this.serve.errorToast(result['statusMsg']);
            this.spinner = false;
            this.viewcontrol.dismiss();
            this.serve.dismissLoading()
            this.image_data = []
          }
        }, err => {
          this.serve.Error_msg(err);
          this.serve.dismissLoading()

        })

      }).catch((error) => {
        this.serve.dismissLoading()
        this.presentConfirm('Turn On Location permisssion !', 'please go to  <strong>Settings</strong> -> Location to turn on <strong>Location permission</strong>')
      });
    },
      error => {
        this.serve.dismissLoading()
        this.serve.presentToast('Please Allow Location !!')
      });

  }

  stopBackgroundGeolocation() {
    BackgroundGeolocation.stop();
  }
  cameraModal(type) {
    let modal = this.modalCtrl.create(CameraModalPage,{'type':type});

    modal.onDidDismiss(data => {
      
      if (data != undefined && data != null) {  
        this.image = data
        if (this.image) {
          this.image_data.push(this.image);
        }
    }
    
    
      
    });

    modal.present();
  }
  takePhoto() {
    this.diagnostic.requestCameraAuthorization().then((isAvailable: any) => {
    const options: CameraOptions =
    {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 500,
      targetHeight: 400,
      cameraDirection: 1,
      correctOrientation: true,
    }
    if(this.Device.platform=='Android'){
        cordova.plugins.foregroundService.start('Camera', 'is running');
      }
    this.camera.getPicture(options).then((imageData) => {
      this.image = 'data:image/jpeg;base64,' + imageData;
      if(this.Device.platform=='Android'){
      cordova.plugins.foregroundService.stop();
      }
      if (this.image) {
        this.image_data.push(this.image);
      }
    },
      (err) => {
        if (err == 20) {
          this.presentConfirm('Turn On Camera permisssion !', 'please go to <strong>Settings</strong> -> Camera to turn on <strong>Camera permission</strong>')
        }
      });
    }).catch((error: any) => {
      if(this.Device.platform=='Android'){
        cordova.plugins.foregroundService.stop();
      }
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

  remove_image(i: any) {
    this.image_data.splice(i, 1)
  }

}
