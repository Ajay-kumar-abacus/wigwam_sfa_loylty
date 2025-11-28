import { Component, ViewChild } from '@angular/core';
import { AlertController, Events, IonicPage, LoadingController, ModalController, Navbar, NavController, NavParams, Platform, PopoverController, ToastController } from 'ionic-angular';
import moment from 'moment';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { Storage } from '@ionic/storage';
import { AddCheckinPage } from '../sales-app/add-checkin/add-checkin';
import { ExpensePopoverPage } from '../expense-popover/expense-popover';
import { IonicSelectableComponent } from 'ionic-selectable';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { EndCheckinPage } from '../sales-app/end-checkin/end-checkin';
import { Geolocation } from '@ionic-native/geolocation';
import { DashboardPage } from '../dashboard/dashboard';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { ConstantProvider } from '../../providers/constant/constant';
import { SelectRegistrationTypePage } from '../select-registration-type/select-registration-type';
import { Device } from '@ionic-native/device';
import { CameraModalPage } from '../camera-modal/camera-modal';
@IonicPage()
@Component({
  selector: 'page-checkin-new',
  templateUrl: 'checkin-new.html',
})
export class CheckinNewPage {
  @ViewChild('district_Selectable') district_Selectable: IonicSelectableComponent;
  @ViewChild('selectComponent') selectComponent: IonicSelectableComponent;

  selected_date = new Date().toISOString().slice(0, 10);
  today_date = new Date().toISOString().slice(0, 10);
  userId: any;
  checkinData: any = {};
  actual: any = false;
  checkinType: any = "My";
  data: any
  teamCount: any
  attendenceButton: any
  checkinButton: any
  travelPlan: string = "actual_travel";
  user_list: any = []
  traveled: any = true;
  summary: any = false;
  spinnerLoader: boolean = false;
  expense: any;
  Mode: any;
  checkinlist: any = [];
  travellist: any = [];
  attendancelist: any = {};
  first_checkin:any='';
  last_checkin:any='';
  starttime: any = [];
  stoptime: any = [];
  expenselist: any;
  checkin_count_data: any = {};
  userIdTrack: any;
  checkinListTest: any =[];
  startimage: any;
 
  checkinCameraFlag: number=0;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public Device: Device,
    public platform: Platform,
    public locationAccuracy: LocationAccuracy,
    public geolocation: Geolocation,
    public serve: MyserviceProvider,
    public toastCtrl: ToastController,
    public constant: ConstantProvider,
    public alertrCtl: AlertController,
    public modalCtrl: ModalController,
    public events: Events,
    public openNativeSettings: OpenNativeSettings,
    public loadingCtrl: LoadingController
    , public popoverCtrl: PopoverController
    , public alertCtrl: AlertController,

    public storage: Storage) {

    this.storage.get('userId').then((id) => {
      this.userId = id;
    });


    this.checkinListTest = [
  {
    company_name: 'ABC Traders',
    dr_type_name: 'Retail',
    checked: false
  },
  {
    company_name: 'Health Medicos',
    dr_type_name: 'Distributor',
    checked: true
  },
  {
    company_name: 'Sunrise Pharma',
    dr_type_name: 'Wholesaler',
    checked: false
  },
   {
    company_name: 'Sunrise Pharma',
    dr_type_name: 'Wholesaler',
    checked: false
  }
  ,
   {
    company_name: 'Sunrise Pharma',
    dr_type_name: 'Wholesaler',
    checked: false
  }
];



    this.getuserlist()

  }
  ionViewWillEnter() {
    this.Mode = this.navParams.get('Mode');
    this.userIdTrack = this.navParams.get('userIdTrack');
    if(this.userIdTrack){
      console.log(this.userIdTrack,"line 82")
      this.checkinType = 'Team';
      
      this.getCkeckInData(''); 
    }
    else{
      this.getCkeckInData(''); 
    }
   
  }
  ionViewDidLoad() {
    this.storage.get('team_count').then((team_count) => {
      this.teamCount = team_count;
    });
    this.selected_date = moment().format('YYYY-MM-DD');
    this.today_date = moment().format('YYYY-MM-DD');

    this.pending_checkin()
  }
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(ExpensePopoverPage, { 'from': 'Checkins' });
    popover.present({
      ev: myEvent
    });

    popover.onDidDismiss(resultData => {
      if (resultData) {
        this.checkinType = resultData.TabStatus;
        if (this.checkinType == 'My') {
          this.getCkeckInData('');
        } else {
          this.checkin_count_data = "";
          this.checkin_out = "";
          this.attendenceButton = "";
          this.checkinButton = "";
          this.checkinData = "";
          this.attendancelist = "";
          this.expenselist = "";
          this.checkinlist = "";
        }
      }

    })

  }
  data1: any = {}
  startVisit(data) {
    this.spinnerLoader = true;
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
            this.startCheckinAlert(data);
          }


        }, error => console.log(error));
      }
      else {
        this.startCheckinAlert(data);
      }
    });


  }

  startCheckinAlert(data) {
    let alert = this.alertCtrl.create({
      title: 'Checkin',
      message: 'Do you want to start checkin?',
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
            // this.startvisit1(data)
                if(this.checkinCameraFlag==1){
  this.takePhotoStart('camera',data)
          }
          else{
              this.startvisit1(data)
          }
           

          }
        }


      ]
    });
    alert.present();
  }

  takePhotoStart(type,checkinData) {
    let modal = this.modalCtrl.create(CameraModalPage,{'type':type});

    modal.onDidDismiss(data => {
   
      if (data != undefined && data != null) {  
        this.startimage = data  
        this.startvisit1(checkinData)
      
    }
    
    
      
    });

    modal.present();
  }
  checkin_data: any = []
  startvisit1(data) {
    // this.serve.presentLoading()
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {

        let options = { maximumAge: 10000, timeout: 15000, enableHighAccuracy: true };
        this.geolocation.getCurrentPosition(options).then((resp) => {
          var lat = resp.coords.latitude
          var lng = resp.coords.longitude
          this.data1 = data;
          //  let startTime = 15000
          this.serve.addData({ 'lat': lat, 'lng': lng, 'display_name': this.data1.display_name, 'dr_type': this.data1.dr_type, 'dr_id': this.data1.id, 'dr_type_name': this.data1.dr_type_name, 'new_counter': this.data1.new_counter,'start_image':this.startimage }, 'AppCheckin/startVisitNew').then((result) => {
            if (result['statusCode'] == 200) {
              this.spinnerLoader = false;
              this.navCtrl.remove(2, 1, { animate: false });
              this.navCtrl.pop({ animate: false });
              this.pending_checkin();
              if (this.checkin_data != null) {
                this.checkin_data.checkin_type='planned'
                this.navCtrl.push(EndCheckinPage, { 'data': this.checkin_data,'checkin_type':'planned' });
              }
              this.serve.successToast(result['statusMsg'])
              this.serve.dismissLoading();
            }
            else {
              this.spinnerLoader = false;
              this.serve.dismissLoading();
              this.serve.errorToast(result['statusMsg'])
            }

          });
        }).catch((error) => {
          this.spinnerLoader = false;
          this.serve.dismissLoading();
          this.presentConfirm('Turn On Location permisssion !', 'please go to <strong>Settings</strong> -> Location to turn on <strong>Location permission</strong>')
        });
      },
      error => {
        this.spinnerLoader = false;
        this.serve.dismissLoading();
        this.serve.errorToast('Allow Location!')
      });
  }
  presentConfirm(title, msg) {
    let alert = this.alertrCtl.create({
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
    console.log("hlo")
    this.serve.addData({}, 'AppCheckin/pendingCheckin').then((result) => {
      if (result['statusCode'] == 200) {
        this.checkin_data = result['checkin_data'];
        this.checkinCameraFlag = result['checkinCameraFlag'];
      } else {
        this.serve.errorToast(result['statusMsg'])
      }
    }, err => {
      this.serve.Error_msg(err);
      this.serve.dismiss();
    })
  }
  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Visit Started Successfully',
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }
  getuserlist() {
    this.storage.get('userId').then((id) => {
      this.userId = id;
      this.serve.addData({ 'user_id': this.userId }, 'AppCheckin/getallAsm').then((result) => {
        if (result['statusCode'] == 200) {
          this.user_list = result['asm_id'];
        } else {
          this.serve.errorToast(result['statusMsg'])
        }
      }, err => {
        this.serve.Error_msg(err);
        this.serve.dismiss();
      });
    });

  }

  changeDate(type) {
    if (type == 'previous')
      this.selected_date = moment(this.selected_date).subtract(1, "days").format('YYYY-MM-DD');
    if (type == 'next')
      this.selected_date = moment(this.selected_date).add(1, 'days').format('YYYY-MM-DD');
    this.getCkeckInData('');

  }

  addCheckin() {
    this.navCtrl.push(AddCheckinPage,{'checkinCameraFlag':this.checkinCameraFlag})
  }
  show_Error() {
    let msg = ''
    console.log(this.attendancelist);
    if (this.attendancelist.Total_Working_Time == '') {
      msg = "You have to start your <strong>Attendence</strong> first !"

    } else if (this.attendancelist.Total_Working_Time != '' && this.attendancelist.start_time != '' && this.attendancelist.manual_absent == 0 && this.attendancelist.stop_time != '00:00:00') {
      msg = "Your <strong>Attendence</strong> has been stopped !"
    }
    else if (this.attendancelist.Total_Working_Time != '' && this.attendancelist.start_time != '' && this.attendancelist.manual_absent == 1 && this.attendancelist.stop_time == '00:00:00') {
      msg = "Your <strong>Attendence</strong> has been stopped. Contact To Admin Now.."
    }
    else if (this.checkinButton == false) {
      msg = "Please checkout first";
    }
    else if (this.attendancelist.Total_Working_Time != '' && this.attendancelist.start_time != '' && this.attendancelist.manual_absent == 1 && this.attendancelist.stop_time == '00:00:00') {
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
  checkinDataorder: any = []
  checkin_out: any
  getCkeckInData(e) {
    if(e == ''){
      this.selected_date = this.today_date
    }
    this.serve.presentLoading();
    this.storage.get('userId').then((id) => {
      if (this.checkinType != 'My') {
        console.log("line 380")
        this.userId = this.userIdTrack ? this.userIdTrack : this.data.id;
        
      } else {
        this.userId = id;
      }
      this.serve.addData({ 'user_id': this.userId, 'checkin_type': this.checkinType }, 'AppCheckin/getCheckinList/' + this.selected_date).then((result) => {
        if (result['statusCode'] == 200) {
          this.serve.dismissLoading();
          this.checkin_count_data = result['count'];
          this.checkin_out = result['checkOut'];
          this.checkinButton = result['checkinButton']
          this.attendenceButton = result['attendenceButton']
          this.checkinData = result['data'];
          this.attendancelist = result['data']['attendance'];
          this.first_checkin = result['first_checkin'];
          this.last_checkin = result['last_checkin'];
          const timestamp1 = new Date(this.first_checkin).getTime(); // Convert to milliseconds
          const timestamp2 = new Date(this.last_checkin).getTime(); // Convert to milliseconds
          
          // Calculate the difference in milliseconds
          const timeDiffInMilliseconds = Math.abs(timestamp1 - timestamp2);
          
          // Convert milliseconds to hours, minutes, seconds
          const hours = Math.floor(timeDiffInMilliseconds / (1000 * 60 * 60));
          const minutes = Math.floor((timeDiffInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeDiffInMilliseconds % (1000 * 60)) / 1000);
          this.attendancelist.workingHours = (hours +':'+minutes)
          // Display the difference
          console.log(`Time difference: ${hours} hours, ${minutes} minutes, ${seconds} seconds`);
          this.expenselist = result['data']['expense_data'];
          this.checkinlist = result['data']['actual_travel'];
          if (result['data']['travel_plan'] != null) {
            this.travellist = result['data']['travel_plan']['area_dealer_list'];
          }
          this.checkinData = result['data'];
          this.checkinDataorder = result['data']['primary_order'];
          if (this.attendancelist) {
            this.starttime = moment(this.attendancelist['start_time_withDate'], 'hh:mm:ss a');
            this.stoptime = moment(this.checkinData['attendance']['stop_time'], 'hh:mm:ss a');
          }
          // this.expense = this.checkinData['expense_data'].total_expense;
        } else {
          this.serve.dismissLoading();
          this.serve.errorToast(result['statusMsg'])
        }
      }, error => {
        this.serve.Error_msg(error);
        this.serve.dismissLoading();
      });
    });

  }


  //  getFollowupList() {

    

  //   this.serve.addData({}, 'AppFollowup/followupListInfo').then((result) => {

  //     if (result['statusCode'] = 200) {
  //       this.serve.dismissLoading();
  //       this.checkinList = result['result'];


  //     } else {
  //       this.serve.dismissLoading();
  //       this.serve.errorToast(result['statusMsg'])
  //     }

  //   }, error => {
  //     this.serve.Error_msg(error);
  //     this.serve.dismissLoading();
  //   })

  // }

}
