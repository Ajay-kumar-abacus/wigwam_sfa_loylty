import { Component, ElementRef, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController, Events, Platform, MenuController, ModalCmp, ModalController, Nav, Content } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';
import { AttendenceserviceProvider } from '../../providers/attendenceservice/attendenceservice';
import moment from 'moment';
import { Subscription } from 'rxjs/Subscription';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { MainDistributorListPage } from '../sales-app/main-distributor-list/main-distributor-list';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { GeolocationserviceProvider } from '../../providers/geolocationservice/geolocationservice';
import { ConstantProvider } from '../../providers/constant/constant';
import { WorkTypeModalPage } from '../work-type-modal/work-type-modal';
import { Network } from '@ionic-native/network';
import { ExpenseListPage } from '../expense-list/expense-list';
import { LmsLeadListPage } from '../sales-app/new-lead/lms-lead-list/lms-lead-list';
import { ContractorMeetListPage } from '../Contractor-Meet/contractor-meet-list/contractor-meet-list';
import { FollowupListPage } from '../followup-list/followup-list'
import { AnnouncementListPage } from '../announcement/announcement-list/announcement-list';
import { EndCheckinPage } from '../sales-app/end-checkin/end-checkin';
import { CheckinNewPage } from '../checkin-new/checkin-new';
import { LeaveListPage } from '../leave-list/leave-list';
import { TravelListNewPage } from '../travel-list-new/travel-list-new';
import { RetailerListPage } from '../retailer-list/retailer-list';
import { FollowupAddPage } from '../followup-add/followup-add';
import { ExpenseAddPage } from '../expense-add/expense-add';
import { PrimaryOrderMainPage } from '../primary-order-main/primary-order-main';
import { SecondaryOrderMainPage } from '../secondary-order-main/secondary-order-main';
import { AttendenceNewPage } from '../attendence-new/attendence-new'
import { TargetPage } from '../target/target';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { DashboardNewPage } from '../dashboard-new/dashboard-new';
import { ProfilePage } from '../profile/profile';
import { SurveyListPage } from '../survey/survey-list/survey-list';
import { PopGiftListPage } from '../sales-app/pop-gift/pop-gift-list/pop-gift-list';
import { TaskListPage } from '../task-list/task-list';
import { SiteListPage } from '../loyalty/site-list/site-list';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { ScanningPage } from '../scanning/scanning';
import { ProductsPage } from '../products/products';
import { LoyaltyCataloguePage } from '../loyalty-catalogue/loyalty-catalogue';
import { NotificationPage } from '../notification/notification';
import { AnnouncementNoticesListPage } from '../announcement-notices-list/announcement-notices-list';
import { HolidayListPage } from '../holiday-list/holiday-list';
import { Diagnostic } from '@ionic-native/diagnostic';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { SelectRegistrationTypePage } from '../select-registration-type/select-registration-type';
import { KriKpaTargetPage } from '../kri-kpa-target/kri-kpa-target';
import { BackgroundTrackListingPage } from '../background-track-listing/background-track-listing';
import OneSignal from 'onesignal-cordova-plugin';
import zingchart from 'zingchart'
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
import { ProminentDisclosureModalPage } from '../prominent-disclosure-modal/prominent-disclosure-modal';
import { SupportListPage } from '../support-list/support-list';
import { BrandAuditListPage } from '../brand-audit-list/brand-audit-list';
import { SiteProjectListPage } from '../site-project/site-project-list/site-project-list';
import { MainHomePage } from '../main-home/main-home';
import { AddLeavePage } from '../add-leave/add-leave';
import { PopRequisitionPage } from '../pop-requisition/pop-requisition';
import { AddCheckinPage } from '../sales-app/add-checkin/add-checkin';
import { Device } from '@ionic-native/device';
import { TargetVsAchievementPage } from '../target-vs-achievement/target-vs-achievement';
import { AppVersion } from '@ionic-native/app-version';
import { Market } from "@ionic-native/market"
import { CheckinSummaryPage } from '../checkin-summary/checkin-summary';
import { PriceListPage } from '../price-list/price-list';
import { CameraModalPage } from '../camera-modal/camera-modal';
import { TeamTrackDetailPage } from '../team-track-detail/team-track-detail';
import { PrimaryOrderAddPage } from '../primary-order-add/primary-order-add';
import { SecondaryOrderAddPage } from '../secondary-order-add/secondary-order-add';

declare let cordova: any;

@IonicPage()
@Component({
    selector: 'page-dashboard',
    templateUrl: 'dashboard.html',
})
export class DashboardPage {
    @ViewChild(Nav) nav: Nav;
    @ViewChild(Content) content: Content;
    private subscriptions: any[] = [];
    private backgroundLocationEventListeners: any[] = [];
    checkinCameraFlag: number =0;
     private listenSub: Subscription;
    showActionList: boolean = false;
    attend_id: any = '';
    device_unique_id: any = ''
    currentTime: any = '';
    checkinMode: any = {};
    attendanceMode: any = '';
    user_id: any = '';
    doughnutChart: any;
    qr_code: any;
    checkinChart: any;
    followupChart: any;
    skLoading: boolean = true
    spinner: boolean = false
    attendence_data: any = [];
    appbanner: any = [];
    announcementCount: any;
    enquiry_count: number;
    checkin_data: any = [];
    timer;
    checkin_out: any = ''
    today_date = new Date().toISOString().slice(0, 10);
    checkedToggle: any = '';
    subscription: any;
    vehicle: any = '';
    last_attendence_data: any = {};
    today_count: any = {};
    user_data: any = {};
    today_checkin: any = [];
    total_dealer: any = [];
    total_distributor: any = [];
    total_direct_dealer: any = [];
    user_logged_in: boolean;
    start_attend_time: any;
    stop_attend_time: any;
    total_primary_order: any = [];
    total_secondary_order: any = [];
    primary_order_sum: number;
    secondary_order_sum: number;
    targetVsAchievement: any = {};
    dr_credit_details: any = {};
    today_followup: any = [];
    image: any = '';
    image_data: any = [];
    bannerURL: any = '';
    Authtoken: any = '';
    influencerUser: any = [];
    attendence_button: any;
    followupcount: any;
    read_enquiry_count: any;
    AuthorizationStatus: any;
    test_user_flag: any = 0
    app_version: any = ''
    NotificationCount: any;
    notificationToken: any;
    count: any;
    Approval_array: any;
    projection_data: any;
    leaveMsg: any;
    halfDayMsg: any;
    approvalCount: any
    expense: any
    leaveany: any
    team_count: any;
    unreadTaskCount: any;
    flag: boolean = false
    login_status: any = '';
    networkType: any = []
    leave: any = []

      suggestionList: any=[];
    isBottomSheetOpen: boolean= false;
    data: any;
    checkinData: any={};
    spinnerLoader: boolean=false;
    commandType: string;

    constructor(private network: Network,
        public Market: Market,
        public navCtrl: NavController,
        public diagnostic: Diagnostic,
        public Device: Device,
        public loadingCtrl: LoadingController,
        private zone: NgZone,
        private androidPermissions: AndroidPermissions,
        public geolocation: Geolocation
        , private storage: Storage
        , public attendence_serv: AttendenceserviceProvider
        , public toastCtrl: ToastController
        , public alertCtrl: AlertController
        , public events: Events
        , public locationAccuracy: LocationAccuracy
        , public platform: Platform
        , public push: Push
          ,private tts: TextToSpeech
            ,private speech: SpeechRecognition
        , public service: MyserviceProvider
        , public track: GeolocationserviceProvider
        , public menu: MenuController
        , public constant: ConstantProvider
        , public modal: ModalController
        , public appVersion: AppVersion
        , private camera: Camera
        , public modalCtrl: ModalController
        , public openNativeSettings: OpenNativeSettings
        , private barcodeScanner: BarcodeScanner,
        private device: Device) {

        this.storage.get('token').then((value) => {
            this.Authtoken = value
        })
    }

    ionViewWillEnter() {
        if (this.isLowEndDevice()) {
            // Add delays for low-end devices
            setTimeout(() => {
                this.initializeApp();
            }, 500);
        } else {
            this.initializeApp();
        }
    }

    initializeApp() {
        this.primaryProjection()
        this.appVersion.getVersionNumber().then(resp => {
            this.app_version = resp;
        });

        const resumeSub = this.platform.resume.subscribe(() => {
            this.checkBatteryOptimizations();
        });
        this.subscriptions.push(resumeSub);

        this.platform.ready().then(() => {
            this.storage.get('onesigalToken').then((val) => {
                console.log(val, 'this is one signal token');
                this.notificationToken = val;
            });
            setTimeout(() => {
                this.OneSignalInit();
            }, 1500);
        })

        // Store network subscriptions
        this.platform.ready().then(() => {
            const connectSub = this.network.onConnect().subscribe(() => {
                this.constant.connectionChk = 'online;'
            });
            const disconnectSub = this.network.onDisconnect().subscribe(() => {
                this.constant.connectionChk = 'offline';
            });
            this.subscriptions.push(connectSub, disconnectSub);
        });

        this.getCount();
        this.pending_checkin();
        this.last_attendence();
        //  this.checkinSuggestion('Ted'); 
        this.events.publish('current_page', 'Dashboard');
        
        this.storage.get('token').then((token) => {
            if (typeof (token) !== 'undefined' && token) {
                this.user_logged_in = true;
            }
        });
        
        this.storage.get('userId').then((id) => {
            if (typeof (id) !== 'undefined' && id) {
                this.user_id = id;
            }
        });
    }

    ionViewDidLeave() {
        this.events.publish('current_page', '');
    }

    ionViewWillLeave() {
        // Unsubscribe all subscriptions
        this.subscriptions.forEach(sub => {
            if (sub && sub.unsubscribe) {
                sub.unsubscribe();
            }
        });
        this.subscriptions = [];

        // Clean up background location event listeners
         this.cleanupBackgroundLocationListeners();
    }

    private updateUIAfterAsyncOperation(callback: () => void) {
        this.zone.run(() => {
            callback();
        });
    }

    private isLowEndDevice(): boolean {
        return this.Device.platform === 'Android' && 
               (this.Device.version < '8.0' || 
                navigator.hardwareConcurrency < 4);
    }

 private cleanupBackgroundLocationListeners() {
  this.backgroundLocationEventListeners.forEach(listenerObj => {
    if (listenerObj && listenerObj.event && typeof listenerObj.handler === 'function') {
      try {
        BackgroundGeolocation.removeListener(
          listenerObj.event,
          listenerObj.handler
        );
      } catch (e) {
        console.warn('Error removing background location listener:', e);
      }
    }
  });
  this.backgroundLocationEventListeners = [];
}


    getInfluencer() {
        this.service.addData({}, 'AppInfluencer/influencerList').then(result => {
            this.updateUIAfterAsyncOperation(() => {
                if (result['statusCode'] == 200) {
                    this.influencerUser = result['result'];
                }
                else {
                    this.service.errorToast(result['statusMsg'])
                }
            });
        }, err => {
            this.service.Error_msg(err);
            this.service.dismiss();
        });
    }

    takePhoto(type) {
        this.storage.get('prominentModal').then((prominentModal) => {
            if (prominentModal == true) {
                if ((this.user_data.lat || this.user_data.lat != '') && (this.user_data.lng != '' || this.user_data.lng)) {
                    this.platform.ready().then(() => {
                        if (this.Device.platform == 'Android') {
                            var whiteList = [''];
                            (<any>window).gpsmockchecker.check(whiteList, (result) => {
                                if (result.isMock) {
                                    let alert = this.alertCtrl.create({
                                        title: 'Alert!',
                                        subTitle: 'Please Remove Third Party Location Apps',
                                        buttons: [
                                            {
                                                text: 'Ok',
                                                handler: () => {
                                                    this.service.addData({ 'app_name': result.mocks[0]['name'], 'package_name': result.mocks[0]['package'] }, 'Login/thirdPartyDisabled').then((result) => {
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
                                                            this.service.errorToast("Your account is blocked");
                                                            this.navCtrl.setRoot(SelectRegistrationTypePage);
                                                        } else {
                                                            this.service.errorToast(result['statusMsg'])
                                                        }
                                                    },
                                                        error => {
                                                            this.service.Error_msg(error);
                                                        })
                                                }
                                            }
                                        ]
                                    });
                                    alert.present();
                                }
                                else {
                                    this.spinner = true
                                    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then((res) => {
                                        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then((result) => {
                                            let options = { maximumAge: 3000, timeout: 15000, enableHighAccuracy: false };
                                            this.geolocation.getCurrentPosition(options).then((resp) => {
                                                var lat = resp.coords.latitude
                                                var lng = resp.coords.longitude
                                                this.spinner = false;
                                                if (this.user_data.camera_flag == 0) {
                                                    let modal = this.modalCtrl.create(CameraModalPage, { 'type': 'camera' });

                                                    modal.onDidDismiss(data => {
                                                        
                                                        if (data != undefined && data != null) {
                                                            this.image = data;
                                                            if (this.image) {
                                                                this.fileChange(this.image);
                                                                this.openModal(type)
                                                            }
                                                        }
                                                    });

                                                    modal.present();
                                                } else {
                                                    this.openModal(type)
                                                }
                                            }).catch((error) => {
                                                this.spinner = false
                                                if (this.user_data.camera_flag == 0) {
                                                    let modal = this.modalCtrl.create(CameraModalPage, { 'type': 'camera' });

                                                    modal.onDidDismiss(data => {
                                                       
                                                        if (data != undefined && data != null) {
                                                            this.image = data;
                                                            if (this.image) {
                                                                this.fileChange(this.image);
                                                                this.openModal(type)
                                                            }
                                                        }
                                                    });

                                                    modal.present();
                                                } else {
                                                    this.openModal(type)
                                                }
                                            });
                                        }).catch((error) => {
                                            this.spinner = false
                                            this.presentConfirm('Turn On Location permisssion !', 'please go to <strong>Settings</strong> -> Location to turn on <strong>Location permission</strong>')
                                        })
                                    },
                                        error => {
                                            this.spinner = false
                                            this.service.errorToast('Please Allow Location!!')
                                        });
                                }
                            });
                        } else {
                            this.spinner = true
                            this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then((res) => {
                                this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then((result) => {
                                    let options = { maximumAge: 3000, timeout: 15000, enableHighAccuracy: false };
                                    this.geolocation.getCurrentPosition(options).then((resp) => {
                                        var lat = resp.coords.latitude
                                        var lng = resp.coords.longitude
                                        this.spinner = false;
                                        if (this.user_data.camera_flag == 0) {
                                            let modal = this.modalCtrl.create(CameraModalPage, { 'type': 'camera' });

                                            modal.onDidDismiss(data => {
                                             
                                                if (data != undefined && data != null) {
                                                    this.image = data;
                                                    if (this.image) {
                                                        this.fileChange(this.image);
                                                        this.openModal(type)
                                                    }
                                                }
                                            });

                                            modal.present();
                                        } else {
                                            this.openModal(type)
                                        }
                                    }).catch((error) => {
                                        this.spinner = false
                                        if (this.user_data.camera_flag == 0) {
                                            let modal = this.modalCtrl.create(CameraModalPage, { 'type': 'camera' });

                                            modal.onDidDismiss(data => {
                                              
                                                if (data != undefined && data != null) {
                                                    this.image = data;
                                                    if (this.image) {
                                                        this.fileChange(this.image);
                                                        this.openModal(type)
                                                    }
                                                }
                                            });

                                            modal.present();
                                        } else {
                                            this.openModal(type)
                                        }
                                    });
                                }).catch((error) => {
                                    this.spinner = false
                                    this.presentConfirm('Turn On Location permisssion !', 'please go to <strong>Settings</strong> -> Location to turn on <strong>Location permission</strong>')
                                })
                            },
                                error => {
                                    this.spinner = false
                                    this.service.errorToast('Please Allow Location!!')
                                });
                        }
                    })
                }
                else {
                    let alert = this.alertCtrl.create({
                        title: 'Base location is not updated',
                        message: 'Go to <strong>Profile</strong> page to set your base location , to start your attendance .',
                        cssClass: 'alert-modal',
                        buttons: [
                            {
                                text: 'Cancel',
                                role: 'cancel',
                                handler: () => {
                                    this.last_attendence()
                                }
                            },
                            {
                                text: 'Okay',
                                handler: () => {
                                    this.navCtrl.push(ProfilePage);
                                }
                            }
                        ]
                    });
                    alert.present();
                }
            } else {
                this.openProminentModal("punchin")
            }
        })
    }

    startAttendance() {
        this.storage.get('prominentModal').then((prominentModal) => {
            if (prominentModal == true) {
                this.spinner = true
                let modal = this.modalCtrl.create(CameraModalPage, { 'type': 'camera' });
                modal.onDidDismiss(data => {
                    if (data != undefined && data != null) {
                        this.image = data;
                        if (this.image) {
                            this.fileChange(this.image);
                            this.openModal('start')
                             this.spinner = false;
                        }
                    }
                });
                modal.present();
            } else {
                this.openProminentModal("punchin")
            }
        })
    }

    fileChange(img) {
        this.image_data.push(img);
        this.image = '';
    }

    openModal(type) {
        let workTypeModal = this.modal.create(WorkTypeModalPage, { 'type': type, 'id': this.last_attendence_data.attend_id, 'working_type': this.last_attendence_data.working_type, 'camera_flag': this.user_data.camera_flag, 'image': this.image, 'image_data': this.image_data });

        workTypeModal.onDidDismiss(data => {
            this.image_data = []
            this.events.publish('user:login');
            this.last_attendence();
        });

        workTypeModal.present();
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

    pending_checkin() {
        this.service.addData({}, 'AppCheckin/pendingCheckin').then((result) => {
            this.updateUIAfterAsyncOperation(() => {
                if (result['statusCode'] == 200) {
                    this.checkin_data = result['checkin_data'];
                     this.checkinCameraFlag = result['checkinCameraFlag'];
                } else {
                    this.service.errorToast(result['statusMsg'])
                }
            });
        }, err => {
            this.service.Error_msg(err);
            this.service.dismiss();
        })
    }

    pending_approval() {
        this.service.addData({}, 'login/pendingForApproval').then((result) => {
            this.updateUIAfterAsyncOperation(() => {
                if (result['statusCode'] == 200) {
                    this.Approval_array = result['loginData']['Approval_array'];
                } else {
                    this.service.errorToast(result['statusMsg'])
                }
            });
        }, err => {
            this.service.Error_msg(err);
            this.service.dismiss();
        })
    }

    bannerDetail() {
        this.service.addData({}, 'Influencer/banner_list').then((r) => {
            this.service.dismiss();
            this.updateUIAfterAsyncOperation(() => {
                this.appbanner = r['banner_list'];
            });
        });
    }

    stop_attend() {
        this.service.presentLoading()
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(() => {
            let options = { maximumAge: 10000, timeout: 15000, enableHighAccuracy: true };
            this.geolocation.getCurrentPosition(options).then((resp) => {
                var lat = resp.coords.latitude
                var lng = resp.coords.longitude
                this.service.addData({ 'lat': lat, 'lng': lng, 'attendence_id': this.last_attendence_data.attend_id, 'image': this.last_attendence_data.image }, "AppAttendence/stopAttendence").then((result) => {
                    if (result['statusCode'] == 200) {
                        this.service.dismissLoading()
                        this.service.successToast(result['statusMsg']);
                        this.stopBackgroundGeolocation()
                        this.last_attendence()
                    } else {
                        this.service.dismissLoading()
                        this.service.errorToast(result['statusMsg']);
                        this.last_attendence()
                    }
                }, err => {
                    this.service.Error_msg(err);
                    this.service.dismissLoading()
                })
            }).catch((error) => {
                this.service.dismissLoading()
                this.presentConfirm('Turn On Location permisssion !', 'please go to  <strong>Settings</strong> -> Location to turn on <strong>Location permission</strong>')
            });
        },
            error => {
                this.service.dismissLoading()
                this.service.presentToast('Please Allow Location !!')
            });
    }

    stopBackgroundGeolocation() {
        try {
            BackgroundGeolocation.stop();
            BackgroundGeolocation.stopWatchPosition();
            this.cleanupBackgroundLocationListeners();
            console.log("BackgroundGeolocation has been stopped")
        } catch (e) {
            console.warn("Error stopping BackgroundGeolocation:", e);
        }
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
                                            this.service.addData({ 'app_name': result.mocks[0]['name'], 'package_name': result.mocks[0]['package'] }, 'Login/thirdPartyDisabled').then((result) => {
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
                                                    this.service.errorToast("Your account is blocked");
                                                    this.navCtrl.setRoot(SelectRegistrationTypePage);
                                                } else {
                                                    this.service.errorToast(result['statusMsg'])
                                                }
                                            },
                                                error => {
                                                    this.service.Error_msg(error);
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
                } else {
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
            this.service.errorToast('Please Check Out First')
        }
    }

    last_attendence() {
        this.skLoading = true
        this.service.addData({ 'app_version': this.app_version }, 'login/login_data').then((result) => {
            this.updateUIAfterAsyncOperation(() => {
                if (result['statusCode'] == 200) {
                    this.skLoading = false
                    this.getNetworkType();
                    this.last_attendence_data = result['loginData']['attendence_data'];
                    this.leaveMsg = result['loginData']['shortLeaveMsg'];
                    this.halfDayMsg = result['loginData']['halfDayMsg'];
                    this.attendence_button = result['loginData']['attendenceButton'];
                    this.today_count = result['loginData']['today_count'];
                    this.team_count = result['loginData']['team_count'];
                    this.storage.set('team_count', this.team_count);
                    this.NotificationCount = result['loginData']['chk_announcement'];
                    this.announcementCount = result['loginData']['announcementCount'];
                    this.enquiry_count = result['loginData']['unread_enquiry_count'];
                    this.test_user_flag = this.user_data.test_user_flag;
                    this.read_enquiry_count = result['loginData']['today_count']['read_enquiry_count'];
                    this.followupcount = result['loginData']['today_count']['pending_followup_count'];
                    this.unreadTaskCount = result['loginData']['unread_task_count'];
                    this.approvalCount = result['loginData']['Approval_array']
                    
                    this.user_data = result['loginData']['user_data'];
                    this.login_status = result['loginData']['login_status'];
                    this.service.userData = this.user_data;
                    this.device_unique_id = result['loginData']['user_data']['device_unique_id'];
                    console.log(this.device_unique_id, "this comes from backend")
                    console.log(this.device.uuid, "this comes from frontend")
                    
                    if (this.login_status.trim().toLowerCase() == 'inactive') {
                        this.logout();
                    }
                    
                    if (this.device_unique_id && this.device_unique_id != this.device.uuid && !this.test_user_flag) {
                        this.storage.set('token', '');
                        this.storage.set('role', '');
                        this.storage.set('displayName', '');
                        this.storage.set('role_id', '');
                        this.storage.set('name', '');
                        this.storage.set('type', '');
                        this.storage.set('token_value', '');
                        this.storage.set('one_signal_external_id', '');
                        this.storage.set('userId', '');
                        this.storage.set('token_info', '');
                        this.constant.UserLoggedInData = {};
                        this.constant.UserLoggedInData.userLoggedInChk = false;
                        this.events.publish('data', '1', Date.now());
                        this.service.errorToast("Your account is automatically logged out.");
                        this.navCtrl.setRoot(SelectRegistrationTypePage);
                    }
                    
                    if (this.last_attendence_data.start_time != '') {
                        var dt = moment("12:15 AM", ["h:mm A"]).format("HH:mm");
                        var H = +this.last_attendence_data.start_time.substr(0, 2);
                        var h = (H % 12) || 12;
                        var ampm = H < 12 ? "AM" : "PM";
                        this.start_attend_time = h + this.last_attendence_data.start_time.substr(2, 3) + ' ' + ampm;
                    }
                    if (this.last_attendence_data.stop_time != '') {
                        var dt = moment("12:15 AM", ["h:mm A"]).format("HH:mm");
                        var H = +this.last_attendence_data.stop_time.substr(0, 2);
                        var h = (H % 12) || 12;
                        var ampm = H < 12 ? "AM" : "PM";
                        this.stop_attend_time = h + this.last_attendence_data.stop_time.substr(2, 3) + ' ' + ampm;
                    }
                    
                    if (((this.last_attendence_data.stop_time == '00:00:00' || this.last_attendence_data.stop_time == '') && (this.last_attendence_data.start_time != '' || this.last_attendence_data.start_time == '00:00:00'))) {
                        console.log('inside the bglc running');
                        this.storage.get('prominentModal').then((prominentModal) => {
                            if (prominentModal == true) {
                                this.platform.ready().then(this.configureBackgroundGeolocation.bind(this))
                            } else {
                                this.openProminentModal("punchout")
                            }
                        })
                    }
                } else {
                    this.skLoading = false
                    this.service.errorToast(result['statusMsg'])
                }
            });
        }, error => {
            this.skLoading = false;
            this.service.Error_msg(error);
        })
    }

    openProminentModal(type) {
        let workTypeModal = this.modal.create(ProminentDisclosureModalPage, { "fromType": type });
        workTypeModal.onDidDismiss(data => {
            if (data == 'punchout') {
                this.platform.ready().then(this.configureBackgroundGeolocation.bind(this))
            } else if (data == 'punchin') {
                this.startAttendance()
            }
        });
        workTypeModal.present();
    }

    configureBackgroundGeolocation() {
        // Clean up existing listeners before setting up new ones
        this.cleanupBackgroundLocationListeners();

        const locationListener = BackgroundGeolocation.onLocation(this.onLocation.bind(this));
        const motionListener = BackgroundGeolocation.onMotionChange(this.onMotionChange.bind(this));
        const activityListener = BackgroundGeolocation.onActivityChange(this.onActivityChange.bind(this));

        // Store listeners for cleanup
        this.backgroundLocationEventListeners.push(locationListener, motionListener, activityListener);

        const headers = {
            'Authorization': 'Bearer ' + this.Authtoken,
            'Content-Type': 'application/json'
        };

        BackgroundGeolocation.ready({
            // Accuracy and filtering improvements
            desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
            distanceFilter: 10,

            // Location validation
            locationTimeout: 30,
            locationUpdateInterval: 60000,

            // Network and sync settings
            url: this.constant.backgroundLocationUrl,
            headers: headers,
            autoSync: true,

            // Device and permission settings
            extras: {
                user_id: this.user_id,
                device_id: this.device.uuid
            },
            stopOnTerminate: false,
            startOnBoot: true,
            heartbeatInterval: 60,
            disableElasticity: true,
            activityType: BackgroundGeolocation.ACTIVITY_TYPE_OTHER,
            preventSuspend: true,

            // Logging for debugging
            debug: false,
            logLevel: BackgroundGeolocation.LOG_LEVEL_WARNING
        }, (state) => {
            console.warn('[ready] BackgroundGeolocation is configured', state);
            if (!state.enabled) {
                BackgroundGeolocation.start();
            }
        });
    }

    onLocation(location: Location) {
        console.log('[location] -', location);
    }
    
    onMotionChange(event: MotionChangeEvent) {
        console.log('[motionchange] -', event.isMoving, event.location);
    }
    
    onActivityChange(event: MotionActivityEvent) {
        console.log('[activitychange] -', event.activity, event.confidence);
    }
    
    onHttp(event: HttpEvent) {
        console.log('[http] -', event.success, event.status, event.responseText);
    }
    
    onEnabledChange(enabled: boolean) {
        console.log('[enabledchange] - enabled? ', enabled);
    }
    
    onConnectivityChange(event: ConnectivityChangeEvent) {
        console.log('[connectivitychange] - connected?', event.connected);
    }

    async checkBatteryOptimizations() {
        cordova.plugins.DozeOptimize.IsIgnoringBatteryOptimizations(function (responce) {
            if (responce == "false") {
                cordova.plugins.DozeOptimize.RequestOptimizations(function (responce) {
                }, function (error) {
                });
            }
            else {
            }
        }, function (error) {
        });
    }

    goSiteListPage(moduleName, scanRight, pointsRight, type) {
        this.navCtrl.push(SiteListPage, { 'userType': this.user_data.user_type, 'moduleName': moduleName, 'scanRight': scanRight, 'type': type, 'pointsRight': pointsRight })
    }

    goToCheckin2() {
        if (this.checkin_data.length == 0) {
            this.navCtrl.push(CheckinNewPage);
        } else {
            this.navCtrl.push(EndCheckinPage, { 'data': this.checkin_data })
        }
    }

    goToCheckin3() {
        if (this.attendence_button) {
            if (this.checkin_data.length == 0) {
               this.navCtrl.push(AddCheckinPage,{'checkinCameraFlag':this.checkinCameraFlag})
            } else {
                this.navCtrl.push(EndCheckinPage, { 'data': this.checkin_data })
            }
        }
        else {
            this.show_Error()
        }
    }

    show_Error() {
        let msg = ''
        console.log(this.last_attendence_data);
        if (this.last_attendence_data.Total_Working_Time == '') {
            msg = "You have to start your <strong>Attendence</strong> first !"
        } else if (this.last_attendence_data.Total_Working_Time != '' && this.last_attendence_data.start_time != '' && this.last_attendence_data.manual_absent == 0 && this.last_attendence_data.stop_time != '00:00:00') {
            msg = "Your <strong>Attendence</strong> has been stopped !"
        }
        else if (this.last_attendence_data.Total_Working_Time != '' && this.last_attendence_data.start_time != '' && this.last_attendence_data.manual_absent == 1 && this.last_attendence_data.stop_time == '00:00:00') {
            msg = "Your <strong>Attendence</strong> has been stopped. Contact To Admin Now.."
        }
        else if (this.last_attendence_data.Total_Working_Time != '' && this.last_attendence_data.start_time != '' && this.last_attendence_data.manual_absent == 1 && this.last_attendence_data.stop_time == '00:00:00') {
            msg = "Your <strong>Attendence</strong> has been stopped. Contact To Admin Now.."
        }
        let alert = this.alertCtrl.create({
            title: 'Alert',
            message: msg,
            cssClass: 'alert-modal',
            buttons: [
                {
                    text: 'cancel',
                    role: 'cancel'
                },
                {
                    text: 'Ok',
                    handler: () => {
                        this.navCtrl.push(DashboardPage)
                    }
                }
            ]
        });
        alert.present();
    }

    goToCheckin() {
        this.navCtrl.push(CheckinNewPage);
    }

    goToEvent() {
        this.navCtrl.push(CheckinNewPage);
    }

    gotoPriceList() {
        this.navCtrl.push(PriceListPage, { 'view_type': 'price_list' });
    }

    scanProduct() {
        const options: BarcodeScannerOptions = {
            prompt: ""
        };
        this.barcodeScanner.scan(options).then(resp => {
            this.qr_code = resp.text;
            if (resp.text != '') {
                this.service.presentLoading()
                this.service.addData({ 'coupon_code': this.qr_code, }, 'AppCouponScan/fetchProduct').then((r: any) => {
                    if (r['statusCode'] == 200) {
                        let result;
                        result = r['result']
                        setTimeout(() => {
                            this.service.dismissLoading()
                            this.navCtrl.push(ScanningPage, { 'product_detail': result, 'page_type': 'scan' })
                        }, 600);
                    }
                    else {
                        setTimeout(() => {
                            this.service.dismissLoading()
                            this.service.errorToast(r['statusMsg'])
                        }, 600);
                    }
                },
                    err => {
                        this.service.dismissLoading();
                        this.service.Error_msg(err);
                    });
            }
            else {
            }
        }, err => {
            this.presentConfirm('Turn On Camera permisssion !', 'please go to <strong>Settings</strong> -> Camera to turn on <strong>Camera permission</strong>')
        })
    }

    manualProduct() {
        this.navCtrl.push(ScanningPage, { 'page_type': 'manual' })
    }

    goTopop() {
        this.navCtrl.push(PopGiftListPage)
    }

    goToPopRequisition() {
        this.navCtrl.push(PopRequisitionPage)
    }

    goToAddLeave() {
        this.navCtrl.push(AddLeavePage)
    }

    goToAttendence() {
        this.navCtrl.push(AttendenceNewPage);
    }

    goToTask() {
        this.navCtrl.push(TaskListPage);
    }

    goToFollowupAdd() {
        this.navCtrl.push(FollowupAddPage);
    }

    goToFollowup() {
        this.navCtrl.push(FollowupListPage);
    }

    goToLeave(type) {
        this.navCtrl.push(LeaveListPage, { 'from': type });
    }

    goToBtl(type) {
        this.navCtrl.push(ContractorMeetListPage, { 'type': type });
    }

    goToExpense(type) {
        this.navCtrl.push(ExpenseListPage, { 'view_type': type })
    }

    goToProjection(type) {
        this.navCtrl.push(TargetPage, { 'view_type': type });
    }

    goToTravel(type) {
        this.navCtrl.push(TravelListNewPage, { 'view_type': type });
    }

    goToTravel1(type) {
        this.navCtrl.push(TravelListNewPage, { 'view_type': type, 'page_type': 'mjp' });
    }

    GoToProfile() {
        this.navCtrl.push(ProfilePage);
    }

    goToDigitalLead() {
        this.navCtrl.push(LmsLeadListPage);
    }

    goToCustomers() {
        this.navCtrl.push(MainDistributorListPage, { 'type': 1, 'module_name': 'Channel Partner', 'from': 'dashboardPage' })
    }

    goToCustomerNetwork() {
        this.navCtrl.push(MainHomePage);
    }

    goToDashboard() {
        this.navCtrl.push(DashboardNewPage, { 'user_data': this.user_data });
    }

    goTocheckinSummary() {
        this.navCtrl.push(CheckinSummaryPage);
    }

    goToExpenseAdd() {
        this.navCtrl.push(ExpenseAddPage, {
            from: 'expense', view_type: 'Team'
        });
    }

    goToevent() {
        this.navCtrl.push(ContractorMeetListPage);
    }

    goToSurvey() {
        this.navCtrl.push(SurveyListPage);
    }

    goToSite() {
        this.navCtrl.push(SiteProjectListPage);
    }

    goToMainDistributorListPage(type, module_name) {
        this.navCtrl.push(MainDistributorListPage, { 'type': type, 'module_name': module_name })
    }

    goToPrimaryOrders(type) {
        this.navCtrl.push(PrimaryOrderMainPage, { 'type': type });
    }

    goToSecondaryOrders(type) {
        this.navCtrl.push(SecondaryOrderMainPage, { 'type': type });
    }

    goToSupport() {
        this.navCtrl.push(SupportListPage);
    }

    goToBrandAudit() {
        this.navCtrl.push(BrandAuditListPage);
    }

    goOnProductPage() {
        this.navCtrl.push(ProductsPage, { 'mode': 'home' });
    }

    viewAchievement(type) {
        this.navCtrl.push(TargetPage, { 'user_data': this.user_data })
    }

    viewTarget() {
        this.navCtrl.push(TargetVsAchievementPage)
    }

    goOnDigitalcatPage() {
        this.navCtrl.push(LoyaltyCataloguePage)
    }

    announcementModal() {
        this.navCtrl.push(AnnouncementNoticesListPage);
    }

    gotoHolidayList() {
        this.navCtrl.push(HolidayListPage);
    }

    announcementList() {
        this.navCtrl.push(AnnouncementListPage)
    }

    goToTeamMember() {
        this.navCtrl.push(BackgroundTrackListingPage, { 'page_type': 'manual' })
    }

    goToTrackDetail() {
        this.navCtrl.push(TeamTrackDetailPage)
    }

    goToPoP() {
        this.navCtrl.push(PopGiftListPage)
    }

    getNetworkType() {
        this.service.addData('', "AppCustomerNetwork/distributionNetworkModule").then(result => {
            this.updateUIAfterAsyncOperation(() => {
                this.networkType = result['modules'];
            });
        }, err => {
            this.service.Error_msg(err);
            this.service.dismiss();
        })
    }

    getCount() {
        this.service.addData('', "AppCustomerNetwork/pendingForAction").then(result => {
            this.updateUIAfterAsyncOperation(() => {
                this.count = result;
                console.log(this.count, 'count')
            });
        }, err => {
            this.service.Error_msg(err);
            this.service.dismiss();
        })
    }

    doRefresh(refresher) {
        this.last_attendence();
        this.pending_checkin();
        this.primaryProjection();
        setTimeout(() => {
            refresher.complete();
        }, 1000);
    }

    logout() {
        OneSignal.logout();
        this.storage.set('token', '');
        this.storage.set('role', '');
        this.storage.set('displayName', '');
        this.storage.set('role_id', '');
        this.storage.set('name', '');
        this.storage.set('type', '');
        this.storage.set('token_value', '');
        this.storage.set('onesigalToken', '');
        this.storage.set('userId', '');
        this.storage.set('token_info', '');
        this.constant.UserLoggedInData = {};
        this.constant.UserLoggedInData.userLoggedInChk = false;
        console.log(this.constant.UserLoggedInData);
        this.events.publish('data', '1', Date.now());
        this.service.errorToast("You Are Currently In Active, Contact To Admin.");
        this.navCtrl.setRoot(SelectRegistrationTypePage);
    }

    goToKRIKPA() {
        this.navCtrl.push(KriKpaTargetPage);
    }

    updateNow() {
        if (this.Device.platform == 'Android') {
            window.open('market://details?id=com.basiq.wigwamply&hl=en', '_system', 'location=yes');
        } else {
            this.Market.open('6502594764')
        }
    }

    leaveAlert() {
        let alert = this.alertCtrl.create({
            title: 'Alert',
            message: 'you are on leave',
            cssClass: 'alert-modal',
            buttons: [
                {
                    text: 'Ok',
                    handler: () => {
                    }
                }
            ]
        });
        alert.present();
    }

    OneSignalInit(): void {
        OneSignal.logout()
        setTimeout(() => {
            OneSignal.initialize("8f9d7bb2-b26f-44a1-831d-b4f36379645d");
            console.log(this.notificationToken, '415');

            if (this.notificationToken) {
                console.log('====================================');
                console.log('updating token');
                console.log('====================================');
                OneSignal.login(this.notificationToken)
            }
            let self = this;
            let myClickListener = async function (event) {
                let notificationData = event;
                console.log('====================================');
                console.log(notificationData);
                let page = notificationData.notification.additionalData.page
                let params = notificationData.notification.additionalData
                self.nav.push(page, params);
                console.log('====================================');
            };
            OneSignal.Notifications.addEventListener("click", myClickListener);
            OneSignal.Notifications.requestPermission(true)
        }, 300);
    }

    primaryProjection() {
        this.service.addData({}, 'login/targetAchievementDashboard').then((result) => {
            this.updateUIAfterAsyncOperation(() => {
                if (result['statusCode'] == 200) {
                    this.projection_data = result['result'];
                    setTimeout(() => {
                        this.getReport()
                    }, 2000);
                } else {
                    this.service.errorToast(result['statusMsg'])
                    this.projection_data = result['result'];
                }
            });
        }, err => {
            this.service.Error_msg(err);
            this.service.dismiss();
        })
    }

    getReport() {
        console.log("hello")
        let ProspectCpPieChart: any = {
            type: 'ring',
            backgroundColor: '#fff',
            plot: {
                tooltip: {
                    backgroundColor: '#000',
                    borderWidth: '0px',
                    fontSize: '10px',
                    sticky: true,
                    thousandsSeparator: ',',
                },
                valueBox: {
                    type: 'all',
                    text: '%npv%',
                    placement: 'in',
                    fontSize: '8px'
                },
                animation: {
                    effect: 2,
                    sequence: 4,
                    speed: 1000
                },
                backgroundColor: '#FBFCFE',
                borderWidth: '0px',
                slice: 40,
            },
            plotarea: {
                margin: '0px',
                backgroundColor: 'transparent',
                borderRadius: '10px',
                borderWidth: '0px',
            },
            series: [
                {
                    text: 'Open',
                    values: [this.projection_data.current_month_primary_target],
                    backgroundColor: '#06870d',
                    lineColor: '#06870d',
                    lineWidth: '1px',
                    marker: {
                        backgroundColor: '#06870d',
                    },
                },
                {
                    text: 'Converted Sub-dealer',
                    values: [this.projection_data.current_month_primary_achv],
                    backgroundColor: '#ff4441',
                    lineColor: '#ff4441',
                    lineWidth: '1px',
                    marker: {
                        backgroundColor: '#ff4441',
                    },
                },
            ],
            noData: {
                text: 'No Selection',
                alpha: 0.6,
                backgroundColor: '#20b2db',
                bold: true,
                fontSize: '10px',
                textAlpha: 0.9,
            },
        };

        ProspectCpPieChart.gui = { contextMenu: { visible: false } };
        setTimeout(() => {
            zingchart.render({ id: 'ProspectCpPieChart', data: ProspectCpPieChart, height: 185 });
        }, 1000);
    }

    toggleActionList() {
        this.showActionList = !this.showActionList;
        this.pending_approval()
    }

    // Scroll function for navigating to specific sections
    scrollToSection(elementId: string) {
        console.log(`Attempting to scroll to element: ${elementId}`);
        let element = document.getElementById(elementId);
        if (element) {
            this.content.scrollTo(0, element.offsetTop, 500);
            console.log(`Scrolled to offsetTop: ${element.offsetTop}`);
        } else {
            console.error(`Element with ID '${elementId}' not found.`);
            this.service.errorToast(`Could not find the ${elementId} section.`);
        }
    }

    // Function to navigate to shortcuts section
    goToShortcuts() {
        this.scrollToSection('shortcutsSection');
    }

    // speech recognication implemntation

        async initSpeech() {
    // 1 Check + request permission (Android 6+ & iOS)
    const hasPerm = await this.speech.hasPermission();
    if (!hasPerm) {
      await this.speech.requestPermission();
    }

   
    this.listenSub = this.speech.startListening({
      language: this.platform.is('ios') ? 'en-US' : 'en-AU',
      matches: 1,                // top transcription only
      showPartial: true,         // get live transcription
      prompt: 'Say a command',   // Android prompt
    }).subscribe(
      (matches: string[]) => this.onVoice(matches[0]),   // take first result
      err => console.error('Speech err', err)
    );
  }

  stopSpeech() {
    if (this.listenSub) { this.listenSub.unsubscribe(); }
    this.speech.stopListening();
  }

onVoice(text: string) {
    console.log(text, "line 1277")
    this.isBottomSheetOpen = false;
    this.suggestionList = [];
    const command = text.toLowerCase().trim();
    console.log("Voice command received:", command);

    // Check if command contains the keyword (more flexible matching)
    
    // Primary navigation commands
    if (command.includes('expense')) {
        this.navCtrl.push(ExpenseListPage, { 'view_type': 'My' });
        this.speak('Opening expense page');
    }
    else if (command.includes('leave')) {
        this.navCtrl.push(LeaveListPage, { 'from': 'My' });
        this.speak('Opening leave page');
    }
    else if (command.includes('holiday')) {
        this.navCtrl.push(HolidayListPage);
        this.speak('Opening Holiday Page');
    }
    else if (command.includes('product')) {
        this.navCtrl.push(ProductsPage, { 'mode': 'home' });
        this.speak('Opening product Page');
    }
    else if (command.includes('catalogue') || command.includes('catalog')) {
        this.navCtrl.push(LoyaltyCataloguePage);
        this.speak('Opening catalogue');
    }
    else if (command.includes('task')) {
        this.navCtrl.push(TaskListPage);
        this.speak('Opening Task');
    }
    else if (command.includes('enquiry') ||  command.includes('digital enquiry')) {
        this.navCtrl.push(LmsLeadListPage);
        this.speak('Opening Enquiry Page');
    }
    else if (command.includes('stop attendance')) {
        console.log("inside 1330")
        this.stopAttendanceAlert();
        this.speak('Stopping Your Attendance, Kindly Select Yes');
    }
    else if (command.includes('start attendance') || command.includes('start from home')) {
        console.log("inside 1330")
        this.today_count.leave > 0 ? this.leaveAlert() : this.startAttendance()
        this.speak('Starting Your Attendance, Please Wait');
    }
    
    // Shortcut section commands
    else if (command.includes('site') || command.includes('lead') || command.includes('lead management')) {
        this.navCtrl.push(SiteProjectListPage);
        this.speak('Opening Lead Management');
    }
    else if (command.includes('team member') || command.includes('present member')) {
        if (this.team_count > 0) {
            this.navCtrl.push(BackgroundTrackListingPage, { 'page_type': 'manual' });
            this.speak('Opening Present Members');
        } else {
            this.speak('No team members available');
        }
    }
    else if (command.includes('plan of action') || command.includes('poa')) {
        this.navCtrl.push(TravelListNewPage, { 'view_type': 'My' });
        this.speak('Opening Plan of Action');
    }
    else if (command.includes('monthly journey') || command.includes('mjp')) {
        this.navCtrl.push(TravelListNewPage, { 'view_type': 'My', 'page_type': 'mjp' });
        this.speak('Opening Monthly Journey Plan');
    }
    else if (command.includes('btl') || command.includes('btl activity') || command.includes('event')) {
        this.navCtrl.push(ContractorMeetListPage);
        this.speak('Opening BTL Activity');
    }
    else if (command.includes('projection')) {
        this.navCtrl.push(TargetPage, { 'user_data': this.user_data });
        this.speak('Opening Projection');
    }
    else if (command.includes('target') || command.includes('achievement')) {
        this.navCtrl.push(TargetVsAchievementPage);
        this.speak('Opening Target');
    }
    else if (command.includes('pop inventory') || command.includes('inventory')) {
        this.navCtrl.push(PopGiftListPage);
        this.speak('Opening POP Inventory');
    }
    else if (command.includes('summary')) {
        if (this.team_count > 0) {
            this.navCtrl.push(CheckinSummaryPage);
            this.speak('Opening Summary');
        } else {
            this.speak('Summary not available');
        }
    }
    else if (command.includes('pop requisition') || command.includes('requisition')) {
        this.navCtrl.push(PopRequisitionPage);
        this.speak('Opening POP Requisition');
    }
    else if (command.includes('attendance') || command.includes('attendence')) {
        this.navCtrl.push(AttendenceNewPage);
        this.speak('Opening Attendance');
    }
    else if (command.includes('dashboard')) {
        this.navCtrl.push(DashboardNewPage, { 'user_data': this.user_data });
        this.speak('Opening Dashboard');
    }
    // else if (command.includes('planned checkin') || command.includes('planned check in')) {
    //     this.navCtrl.push(CheckinNewPage);
    //     this.speak('Opening Planned Checkin');
    // }
    // else if (command.includes('unplanned checkin') || command.includes('unplanned check in')) {
    //     this.goToCheckin3();
    //     this.speak('Opening Unplanned Checkin');
    // }
    else if (command.includes('survey')) {
        this.navCtrl.push(SurveyListPage);
        this.speak('Opening Survey');
    }
    else if (command.includes('support') || command.includes('ticket')) {
        this.navCtrl.push(SupportListPage);
        this.speak('Opening Support Ticket');
    }
    else if (command.includes('brand audit') || command.includes('audit')) {
        this.navCtrl.push(BrandAuditListPage);
        this.speak('Opening Brand Audit');
    }
    else if (command.includes('announcement')) {
        this.navCtrl.push(AnnouncementListPage);
        this.speak('Opening Announcement');
    }
    else if (command.includes('pricing') || command.includes('price list')) {
        this.navCtrl.push(PriceListPage, { 'view_type': 'price_list' });
        this.speak('Opening Pricing');
    }
    else if (command.includes('followup') || command.includes('follow up')) {
        this.navCtrl.push(FollowupListPage);
        this.speak('Opening Followups');
    }
    else if (command.includes('customer network')) {
        this.navCtrl.push(MainHomePage);
        this.speak('Opening Customer Network');
    }
    else if (command.includes('profile')) {
        this.navCtrl.push(ProfilePage);
        this.speak('Opening Profile');
    }
    else if (command.includes('notification')) {
        this.navCtrl.push(AnnouncementNoticesListPage);
        this.speak('Opening Notifications');
    }
    else if (command.includes('add leave') || command.includes('apply leave')) {
        this.navCtrl.push(AddLeavePage);
        this.speak('Opening Add Leave Page');
    }
    else if (command.includes('primary order')) {
        this.navCtrl.push(PrimaryOrderMainPage);
        this.speak('Opening Primary Order Page');
    }
    else if (command.includes('secondary order')) {
        this.navCtrl.push(SecondaryOrderMainPage, { 'type': 'order' });
        this.speak('Opening Secondary Order Page');
    }
    else if (command.includes('stock transfer')) {
        this.navCtrl.push(SecondaryOrderMainPage, { 'type': 'stock' });
        this.speak('Opening Stock Transfer');
    }
    else if (command.includes('kri') || command.includes('kpa')) {
        this.navCtrl.push(KriKpaTargetPage);
        this.speak('Opening KRI KPA Target');
    }
    
    // Special checkin/order commands with name extraction
    else if (command.includes('check') || command.includes('checkin') || command.includes('check in') || command.includes('checking')) {
        const extractedName = this.extractNameFromCheckinCommand(command);
        if (extractedName) {
            this.checkinSuggestion(extractedName);
            this.commandType = "Checkin"
          
        } else {
            // If no name extracted, go to regular checkin
            this.goToCheckin3();
            this.speak('Opening Checkin');
        }
    }
    // else if (command.includes('order')) {
    //     const extractedName = this.extractNameFromOrderCommand(command);
    //     if (extractedName) {
    //         this.checkinSuggestion(extractedName);
    //         this.commandType = "Order"
    //         this.speak('Kindly Select Party Name To Create Order');
    //     } else {
    //         this.navCtrl.push(PrimaryOrderMainPage);
    //         this.speak('Opening Primary Order Page');
    //     }
    // }
    else {
        // If no command matched, try again
        // setTimeout(() => {
        //     this.initSpeech()
        // }, 2000);
         this.speak('Try Again No Data Found');
    }
}
speak(text: string) {
  this.tts.speak({
    text: text,
    // locale: 'en-US',
    locale: 'hi-IN',
    rate: 0.85
  }).then(() => console.log("Spoken: ", text))
    .catch(err => console.error("TTS error:", err));
}
    
closeBottomSheet(){
   this.suggestionList=[]
}
checkinSuggestion(text) {
        this.service.addData({'search':text,'filterType':this.commandType}, "AppCheckin/checkinSuggestionBoxAccToVoiceAssist").then(result => {
              this.zone.run(() => {
            this.suggestionList = result['result'];
            console.log(this.suggestionList,"suggestion")
             this.isBottomSheetOpen = true;
               this.speak('Kindly Select Party Name');
              });
             console.log(this.isBottomSheetOpen,"1280")
             if(this.suggestionList.length==0){
             this.speak('No Party Exsist');
             }
        }, err => {
            this.service.Error_msg(err);
            this.service.dismiss();
        })
    }

 customerAddToList(data) {
    this.spinnerLoader = true;
    console.log(data);
    
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(() => {
        let options = { maximumAge: 10000, timeout: 15000, enableHighAccuracy: true };
        this.geolocation.getCurrentPosition(options).then((resp) => {
            try {
                console.log("line 1293");
                const lat = resp.coords.latitude;
                const lng = resp.coords.longitude;
                console.log(resp, "line 1296");
                console.log(lat);
                console.log(lng);

                this.checkinData.dr_id = data.id;
                this.checkinData.dr_name = data.name;
                this.checkinData.display_name = data.display_name || data.name;
                this.checkinData.dr_type_name = data.type_name;
                this.checkinData.type_name = 'Dr';
                this.checkinData.lat = lat;
                this.checkinData.lng = lng;
                this.checkinData.dr_type = data.type || '';
                this.checkinData.mobile = data.mobile || '';

                // Check if camera is required (checkinCameraFlag == 1)
                if (this.checkinCameraFlag == 1) {
                    // Take photo first, then proceed with check-in
                    this.spinnerLoader = false;
                    this.takeCameraForCheckin(this.checkinData);
                } else {
                    // No camera required, proceed directly with check-in
                    this.proceedWithCheckin(this.checkinData, '');
                }

            } catch (err) {
                this.spinnerLoader = false;
                console.error("Internal error in geolocation success block:", err);
                this.service.errorToast('Something went wrong during check-in.');
            }

        }).catch(() => {
            this.spinnerLoader = false;
            this.service.errorToast('Unable to get location. Please enable location services in settings.');
        });

    }).catch(() => {
        this.spinnerLoader = false;
        this.service.errorToast('Allow Location Permission');
    });
}

// New function to handle camera capture for check-in
takeCameraForCheckin(checkinData) {
    let modal = this.modalCtrl.create(CameraModalPage, { 'type': 'camera' });
    
    modal.onDidDismiss(imageData => {
        if (imageData != undefined && imageData != null) {
            // Photo taken successfully, proceed with check-in
            this.spinnerLoader = true;
            this.proceedWithCheckin(checkinData, imageData);
        } else {
            // User cancelled photo, don't proceed with check-in
            this.speak('Check-in cancelled. Photo is required.');
        }
    });
    
    modal.present();
    this.speak('Please take a photo to continue with check-in');
}

// New function to handle the actual check-in process
proceedWithCheckin(checkinData, startImage) {
    const payload = {
        lat: checkinData.lat,
        lng: checkinData.lng,
        dr_type_name: checkinData.dr_type_name,
        type_name: checkinData.type_name,
        dr_type: checkinData.dr_type,
        activity_type: checkinData.activity_type,
        dr_id: checkinData.dr_id,
        new_counter: checkinData.new_counter,
        display_name: checkinData.display_name,
        mobile: checkinData.mobile,
        start_image: startImage // Include the image if camera flag was 1
    };

    this.service.addData(payload, 'AppCheckin/startVisitNew').then((result) => {
        if (result['statusCode'] === 200) {
            console.log("1322");
            if (this.navCtrl.getViews().length >= 2) {
                this.navCtrl.remove(1, 1, { animate: false });
                this.navCtrl.pop({ animate: false });
            }
            this.checkin_data = result['data'] || {};
            this.navCtrl.push(EndCheckinPage, { data: this.checkin_data });
            this.isBottomSheetOpen = false;
            this.suggestionList = [];
            this.spinnerLoader = false;
            this.service.successToast(result['statusMsg']);
        } else {
            this.service.errorToast(result['statusMsg']);
            this.spinnerLoader = false;
        }
    }).catch(error => {
        this.service.Error_msg(error);
        this.spinnerLoader = false;
    });
}

extractNameFromCheckinCommand(command: string): string {
  // Remove checkin-related words and common grammar words
  let cleanedCommand = command
    .replace(/\b(i|want|to|do|checkin|check|in|checking|at|with|the|a|an|is|am|are|was|were|be|been|being|have|has|had|will|would|could|should|can|may|might|must|shall|please|thanks|thank|you|me|my|mine|your|yours|his|her|hers|its|our|ours|their|theirs|this|that|these|those|here|there|now|then|today|yesterday|tomorrow|and|or|but|so|if|when|where|why|how|what|who|which)\b/g, '')
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();

  // Split by common separators and filter out empty strings
  const words = cleanedCommand.split(/[,.\-_\s]+/).filter(word => word.length > 0);
  
  // Join remaining words as the name (assuming it's a person's name)
  const extractedName = words.join(' ').trim();
  
  // Return the name if it exists and looks valid (at least 2 characters)
  return extractedName.length >= 2 ? extractedName : '';
}
extractNameFromOrderCommand(command: string): string {
  // Remove checkin-related words and common grammar words
  let cleanedCommand = command
    .replace(/\b(for|i|want|to|do|order|in|create|creating|at|with|the|a|an|is|am|are|was|were|be|been|being|have|has|had|will|would|could|should|can|may|might|must|shall|please|thanks|thank|you|me|my|mine|your|yours|his|her|hers|its|our|ours|their|theirs|this|that|these|those|here|there|now|then|today|yesterday|tomorrow|and|or|but|so|if|when|where|why|how|what|who|which)\b/g, '')
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();

  // Split by common separators and filter out empty strings
  const words = cleanedCommand.split(/[,.\-_\s]+/).filter(word => word.length > 0);
  
  // Join remaining words as the name (assuming it's a person's name)
  const extractedName = words.join(' ').trim();
  
  // Return the name if it exists and looks valid (at least 2 characters)
  return extractedName.length >= 2 ? extractedName : '';
}

createOrder(data){

       if (data.type =='1'|| data.type =='7') {
            this.navCtrl.push(PrimaryOrderAddPage, { 'dr_type': data.type, 'checkin_id': '0', 'id': data.id, 'dr_name': data.company_name,'order_type': 'Primary' });
      
        }
        else if (data.type =='3') {
          console.log('Secondary', this.checkin_data.dr_type)
          this.navCtrl.push(SecondaryOrderAddPage, {'checkin_id': '0', 'dr_type': data.type, 'networkType': data.type,  'id': data.id, 'dr_name': data.company_name, 'order_type': 'Secondary' });
        }
}
}