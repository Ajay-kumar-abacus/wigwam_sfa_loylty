import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { IonicPage, LoadingController, NavController, NavParams, ToastController, ActionSheetController, PopoverController, ModalController, Platform, AlertController, ViewController } from 'ionic-angular';
import { MyserviceProvider } from '../../../providers/myservice/myservice';
import { AddMultipleContactPage } from '../../add-multiple-contact/add-multiple-contact';
import { ExpenseStatusModalPage } from '../../expense-status-modal/expense-status-modal';
import { PointLocationPage } from '../../point-location/point-location';
import { LmsActivityListPage } from '../../sales-app/new-lead/lms-lead-activity/lms-activity-list/lms-activity-list';
import { LmsLeadAddPage } from '../../sales-app/new-lead/lms-lead-add/lms-lead-add';
import { LmsQuotationListPage } from '../../sales-app/new-lead/lms-lead-quotation/lms-quotation-list/lms-quotation-list';
import { SiteProjectListPage } from '../site-project-list/site-project-list';
import { AddSiteProjectPage } from '../add-site-project/add-site-project';
import { Storage } from '@ionic/storage';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Geolocation } from '@ionic-native/geolocation';
import moment from 'moment';
import { EndCheckinPage } from '../../sales-app/end-checkin/end-checkin';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { ViewProfilePage } from '../../view-profile/view-profile';
import { ConstantProvider } from '../../../providers/constant/constant';
import { FollowupListPage } from '../../followup-list/followup-list';
import { CheckinListPage } from '../../sales-app/checkin-list/checkin-list';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { SecondaryOrderAddPage } from '../../secondary-order-add/secondary-order-add';
import { FollowupAddPage } from '../../followup-add/followup-add';
import { SecondaryOrderMainPage } from '../../secondary-order-main/secondary-order-main';
import { Device } from '@ionic-native/device';
import { Diagnostic } from '@ionic-native/diagnostic';
import { CameraModalPage } from '../../camera-modal/camera-modal';
declare let cordova: any;
@IonicPage()
@Component({
  selector: 'page-lms-lead-detail',
  templateUrl: 'site-project-detail.html',
})
export class SiteProjectDetailPage {
  Checkin_Data: any = {}
  search: any = {}
  siteId: any;
  tabType: any = 'Remark';
  siteDetail: any = {};
  selected_date = new Date().toISOString().slice(0, 10);
  activity_list: any = [];
  contactPerson: any = {};
  visiting_image: any = [];
  image: any = '';
  assignedContactsList: any = []
  

  attendancelist: any = []
  productsArray: any = []
  data: any = {};
  form: any = {};
  actionType: any;
  sitId: any;
  userId: any;
  starttime: any;
  stoptime: any;
  TryCounter: any;
  spinnerLoader: boolean = false;
  attendenceButton: any;
  influencerArray: any = [];
  constructor(public diagnostic: Diagnostic,public Device: Device,public popoverCtrl: PopoverController, public openNativeSettings: OpenNativeSettings, public navCtrl: NavController, public toastCtrl: ToastController, public actionSheetController: ActionSheetController,
    private camera: Camera, public navParams: NavParams, public serve: MyserviceProvider, public loadingCtrl: LoadingController, public service: MyserviceProvider, public locationAccuracy: LocationAccuracy, public geolocation: Geolocation,
    public modalCtrl: ModalController, public constant: ConstantProvider, public storage: Storage, public platform: Platform, public alertCtrl: AlertController, public androidPermissions: AndroidPermissions, public viewCtrl: ViewController) {

    this.sitId = this.navParams.get('id');
    this.actionType = this.navParams.get('actionType');
    console.log( this.actionType)

  }

  ionViewWillEnter() {
    this.siteId = this.navParams.get('id');
    this.actionType = this.navParams.get('actionType');
    this.site_detail();
    this.get_Activity_List();
    this.getCkeckInData()
  }

  show_Error() {
    let msg = ''
    if (this.attendancelist.start_time == "") {
      msg = "You have to start your <strong>Attendence</strong> first !"
    } else if (this.attendancelist.stop_time != '00:00:00') {
      msg = "Your <strong>Attendence</strong> has been stopped !"
    }
    let alert = this.alertCtrl.create({
      title: 'Alert',
      message: "You have to start your Attendence first !",
      cssClass: 'alert-modal',
      buttons: [
        {
          text: 'cancel',
          role: 'cancel'
        },
        {
          text: 'Ok',

        }

      ]
    });
    alert.present();
  }
  getCkeckInData() {
    // this.serve.presentLoading();
    this.storage.get('userId').then((id) => {
      this.userId = id;
      this.serve.addData({ 'user_id': this.userId, 'checkin_type': 'My' }, 'AppCheckin/getCheckinList/' + this.selected_date).then((result) => {
        if (result['statusCode'] == 200) {
          // this.serve.dismissLoading();

          this.attendancelist = result['data']['attendance'];
          this.attendenceButton = result['attendenceButton']

          if (this.attendancelist) {
            this.starttime = moment(this.attendancelist['start_time_withDate'], 'hh:mm:ss a');
            this.stoptime = moment(this.attendancelist['stop_time'], 'hh:mm:ss a');
          }
          // this.expense = this.checkinData['expense_data'].total_expense;
        } else {

          // this.serve.dismissLoading();
          this.serve.errorToast(result['statusMsg'])
        }
      }, error => {
        this.serve.Error_msg(error);
        // this.serve.dismissLoading();
      });
    });

  }
  startVisit(newRetailer) {
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
  
                  }
                }
              ]
            });
            alert.present();
          }
          else {
  
            this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
              () => {
                this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then((result) => {
  
                  let options = { maximumAge: 10000, timeout: 15000, enableHighAccuracy: true };
                  this.geolocation.getCurrentPosition(options).then((resp) => {
                    var lat = resp.coords.latitude
                    var lng = resp.coords.longitude
  
                    this.data.display_name = this.siteDetail.ownerName + ' (' + this.siteDetail.ownerMobile + ')';
                    this.data.name = this.siteDetail.ownerName
                    this.data.mobile = this.siteDetail.ownerMobile
                    this.data.dr_id = this.sitId
                    this.data.dr_type = this.siteDetail.dr_type
                    this.data.company_name = this.siteDetail.ownerName;
  
                    this.data.dr_type_name = 'site';
                    this.data.type_name = 'site';
  
  
                    this.data.lat = lat;
                    this.data.lng = lng;
                    this.service.addData({ 'lat': this.data.lat, 'lng': this.data.lng, 'dr_type_name': this.data.dr_type_name, 'type_name': this.data.type_name, 'dr_type': this.data.dr_type, 'activity_type': this.data.activity_type, 'dr_id': this.data.dr_id, 'new_counter': 'FALSE', 'display_name': this.data.display_name }, 'AppCheckin/startVisitNew').then((result) => {
  
                      if (result['statusCode'] == 200) {
                        this.spinnerLoader = false;
                        this.service.successToast(result['statusMsg']);
                        if (this.navCtrl.getViews().length >= 2) {
                          this.navCtrl.remove(1, 1, { animate: false })
                          this.navCtrl.pop({ animate: false })
                        }
                        this.navCtrl.push(EndCheckinPage, { 'data': this.Checkin_Data });
  
                      }
                      else {
                        this.spinnerLoader = false;
                        this.service.errorToast(result['statusMsg'])
                      }
  
                    }, error => {
                      this.spinnerLoader = false;
                      this.service.Error_msg(error);
                    });
  
  
                  }).catch((error) => {
                    this.spinnerLoader = false;
                    this.service.dismissLoading();
                    if (error.code == 2 || error.code == 3) {
                      let alert = this.alertCtrl.create({
                        enableBackdropDismiss: false,
                        title: "Can't Get Your Location",
                        message: 'Please Try Again',
                        cssClass: 'alert-modal',
                        buttons: [
                          {
                            text: 'Cancel',
                            handler: () => {
                            }
                          },
                          {
                            text: 'Try Again',
                            handler: () => {
                              this.TryCounter += 1
                              if (this.TryCounter == 2) {
                                this.restartYourDevice()
                              } else {
  
                                this.startVisit(newRetailer)
                              }
                            }
                          }
  
                        ]
                      });
                      alert.present();
                    } else {
                      this.presentConfirm('Turn On Location permisssion !', 'please go to <strong>Settings</strong> -> Location to turn on <strong>Location permission</strong>')
                    }
                  });
                },
                  error => {
                    this.spinnerLoader = false;
                    this.service.dismissLoading();
                    this.service.errorToast('Allow Location Permission')
                  });
              }).catch((error) => {
                this.spinnerLoader = false
                this.presentConfirm('Turn On Location permisssion !', 'please go to <strong>Settings</strong> -> Location to turn on <strong>Location permission</strong>')
              })
          }
  
  
  
        }, (error) => console.log(error));

      }else {
  
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
          () => {
            this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then((result) => {

              let options = { maximumAge: 10000, timeout: 15000, enableHighAccuracy: true };
              this.geolocation.getCurrentPosition(options).then((resp) => {
                var lat = resp.coords.latitude
                var lng = resp.coords.longitude

                this.data.display_name = this.siteDetail.ownerName + ' (' + this.siteDetail.ownerMobile + ')';
                this.data.name = this.siteDetail.ownerName
                this.data.mobile = this.siteDetail.ownerMobile
                this.data.dr_id = this.sitId
                this.data.dr_type = this.siteDetail.dr_type
                this.data.company_name = this.siteDetail.ownerName;

                this.data.dr_type_name = 'site';
                this.data.type_name = 'site';


                this.data.lat = lat;
                this.data.lng = lng;
                this.service.addData({ 'lat': this.data.lat, 'lng': this.data.lng, 'dr_type_name': this.data.dr_type_name, 'type_name': this.data.type_name, 'dr_type': this.data.dr_type, 'activity_type': this.data.activity_type, 'dr_id': this.data.dr_id, 'new_counter': 'FALSE', 'display_name': this.data.display_name }, 'AppCheckin/startVisitNew').then((result) => {

                  if (result['statusCode'] == 200) {
                    this.spinnerLoader = false;
                    this.service.successToast(result['statusMsg']);
                    if (this.navCtrl.getViews().length >= 2) {
                      this.navCtrl.remove(1, 1, { animate: false })
                      this.navCtrl.pop({ animate: false })
                    }
                    this.navCtrl.push(EndCheckinPage, { 'data': this.Checkin_Data });

                  }
                  else {
                    this.spinnerLoader = false;
                    this.service.errorToast(result['statusMsg'])
                  }

                }, error => {
                  this.spinnerLoader = false;
                  this.service.Error_msg(error);
                });


              }).catch((error) => {
                this.spinnerLoader = false;
                this.service.dismissLoading();
                if (error.code == 2 || error.code == 3) {
                  let alert = this.alertCtrl.create({
                    enableBackdropDismiss: false,
                    title: "Can't Get Your Location",
                    message: 'Please Try Again',
                    cssClass: 'alert-modal',
                    buttons: [
                      {
                        text: 'Cancel',
                        handler: () => {
                        }
                      },
                      {
                        text: 'Try Again',
                        handler: () => {
                          this.TryCounter += 1
                          if (this.TryCounter == 2) {
                            this.restartYourDevice()
                          } else {

                            this.startVisit(newRetailer)
                          }
                        }
                      }

                    ]
                  });
                  alert.present();
                } else {
                  this.presentConfirm('Turn On Location permisssion !', 'please go to <strong>Settings</strong> -> Location to turn on <strong>Location permission</strong>')
                }
              });
            },
              error => {
                this.spinnerLoader = false;
                this.service.dismissLoading();
                this.service.errorToast('Allow Location Permission')
              });
          }).catch((error) => {
            this.spinnerLoader = false
            this.presentConfirm('Turn On Location permisssion !', 'please go to <strong>Settings</strong> -> Location to turn on <strong>Location permission</strong>')
          })
      }

    });


  }
  restartYourDevice() {
    let alert = this.alertCtrl.create({
      enableBackdropDismiss: false,
      title: 'Please Restart Yuor Device',
      // message: '',
      cssClass: 'alert-modal',
      buttons: [
        {
          text: null,
          handler: () => {
          }
        },
        {
          text: 'Restart',
          handler: () => {
            this.platform.exitApp();
          }
        }

      ]
    });
    alert.present();
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
  site_detail() {
    this.serve.presentLoading();
    this.service.addData({ 'id': this.siteId, search: this.search }, 'AppEnquiry/getSiteDetail').then((result) => {

      if (result['statusCode'] == 200) {
        this.siteDetail = result['data'];
        this.influencerArray = result['data']['influencerArray'];

        this.visiting_image.push(this.siteDetail.visiting_card_image)
        this.contactPerson = result['data']['contactPerson'];
        this.assignedContactsList = result['data']['contact_info']
        this.productsArray = result['data']['products']
        if(this.siteDetail.ownerName){
          this.siteDetail.ownerName = String(this.siteDetail.ownerName)
        }
        this.serve.dismissLoading();

      }
      else {
        this.serve.errorToast(result['statusMsg']);
        this.serve.dismissLoading();
      }

    }, error => {
      this.serve.Error_msg(error);
      this.serve.dismiss();
    });
  }
  EditSite() {
    this.navCtrl.push(AddSiteProjectPage, { 'from': 'EditSitePage', 'id': this.siteId })
  }
  get_Activity_List() {
    this.serve.addData({ 'dr_id': this.siteId }, "AppEnquiry/siteActivityList")
      .then(result => {
        this.activity_list = result['result'];
        if (this.activity_list.length > 0) {
          this.activity_list.reverse()
        }
      }, error => {
        this.serve.Error_msg(error);
        this.serve.dismiss();
      })
  }
  lead_activity(type, id, company_name) {
    this.navCtrl.push(LmsActivityListPage, { 'type': type, 'id': id, 'company_name': company_name })
  }

  goToQuotation(type, id, company_name) {
    this.navCtrl.push(LmsQuotationListPage, { 'type': type, 'id': id, 'company_name': company_name });
  }
  goOnTravelAdd() {
    this.navCtrl.push(LmsLeadAddPage, { 'data': this.siteDetail })
  }
  addContactPerson(id) {
    this.navCtrl.push(AddMultipleContactPage, { 'siteId': id })
  }

  update_location(lat, lng, id, leadType) {
    this.navCtrl.push(PointLocationPage, { "lat": lat, "lng": lng, "id": id, "type": leadType });
  }

  remove_image(i: any) {
    this.visiting_image.splice(i, 1);
  }


  captureMedia() {
    let actionsheet = this.actionSheetController.create({
      title: "Upload Image",
      cssClass: 'cs-actionsheet',

      buttons: [{
        cssClass: 'sheet-m',
        text: 'Camera',
        icon: 'camera',
        handler: () => {
          // this.takePhoto();
          this.cameraModal('camera')
        }
      },
      {
        cssClass: 'sheet-m1',
        text: 'Gallery',
        icon: 'image',
        handler: () => {
          this.getImage();
        }
      },
      {
        cssClass: 'cs-cancel',
        text: 'Cancel',
        role: 'cancel',
        icon: 'cancel',
        handler: () => {
        }
      }
      ]
    });
    actionsheet.present();
  }

  statusModal(type) {
    // if (this.siteDetail.assigned_to_influencer_name == '') {
    //   this.service.errorToast("To chage status assign a influencer first")
    //   return
    // }
    // if (!this.siteDetail.checkin_id || this.siteDetail.checkin_id == null) {
    //   this.service.errorToast("To chage status start a visit first")
    //   return
    // }
    this.Checkin_Data.name = this.siteDetail.ownerName
    this.Checkin_Data.id = this.siteDetail.id
    this.Checkin_Data.dr_type = this.siteDetail.type
    this.Checkin_Data.stage_level = this.siteDetail.stage_level;
    let modal = this.modalCtrl.create(ExpenseStatusModalPage, { 'from': type, 'id': this.siteId, 'dr_type': this.siteDetail.type, 'name': this.siteDetail.ownerName, 'siteStatus': this.siteDetail.stage_level, 'selectAuto': (this.siteDetail.stage_level == 'Win-F' || this.siteDetail.stage_level == 'Open') ? true : false });
    modal.present();

    modal.onDidDismiss((data) => {
      console.log(data, "this is data")
      if (data == true) {
        this.site_detail()
      }
    })
  }
  close(type) {
    this.viewCtrl.dismiss({ 'TabStatus': type });
  }
  cameraModal(type) {
    let modal = this.modalCtrl.create(CameraModalPage,{'type':type});

    modal.onDidDismiss(data => {
      console.log(data)
      if (data != undefined && data != null) {  
        this.image = data
        if (this.image) {
          this.fileChange(this.image);
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
        this.fileChange(this.image);
      }
    },
      (err) => {
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

  getImage() {
    this.diagnostic.requestCameraAuthorization().then((isAvailable: any) => {
    const options: CameraOptions =
    {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false
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
        this.fileChange(this.image);
      }
    }, (err) => {
    });
  }).catch((error: any) => {
   
  });
  }
  GoTo(page) {
    if (page == 'followup') {
      this.navCtrl.push(FollowupListPage)

    } else if (page == 'checkin') {
      this.navCtrl.push(CheckinListPage, { 'from': 'Site_Detail', 'dr_id': this.siteDetail.id })
    }
  }
  imageModal(src) {
    this.modalCtrl.create(ViewProfilePage, { "Image": src }).present();
  }
  addOrder() {

    this.navCtrl.push(SecondaryOrderAddPage, { 'dr_type': this.siteDetail.assigned_to_influencer_type, 'id': this.siteDetail.assigned_to_influencer_id, 'site_id': this.siteId, 'site_name': (this.siteDetail.ownerName + ' - ' + this.siteDetail.ownerMobile), 'dr_name': this.siteDetail.assigned_to_influencer_name, 'order_type': 'Secondary', 'transfer_from_enquiry': this.siteDetail.transfer_from_enquiry });
  }
  orderSummary() {
    this.navCtrl.push(SecondaryOrderMainPage, { 'site_id': this.siteDetail.id, 'type': 'order' })
  }
  go_to(type) {
    this.navCtrl.push(CheckinListPage, { 'comes_from_which_page': 'leads-details', 'delivery_from': 'Yes', 'dr_id': this.siteId, 'type': type, 'dr_type': 15, 'Mode': this.actionType })

  }
  // addFollowup(){
  //   // this.navCtrl.push(FollowupAddPage, { 'dr_id': this.checkin_data.dr_id, 'dr_name': this.siteDetail.ownerName , 'dr_type': this.checkin_data.dr_type, 'dr_type_name': this.checkin_data.dr_type_name, 'checkin_id': this.checkin_data.checkin_id });
  // }
  fileChange(img) {
    this.visiting_image = (img);
    this.image = '';
  }

  addRemark() {
    if (this.form.remark == undefined) {
      this.serve.errorToast('remarks is required');
      return
    }
    this.serve.presentLoading()
    this.serve.addData({ "dr_id": this.siteId, "dr_name": this.siteDetail.ownerName, 'remarks': this.form.remark }, "AppEnquiry/addSiteActivity")
      .then(result => {
        if (result['statusCode'] == 200) {
          this.form.remark = '';
          this.serve.dismissLoading();
          this.get_Activity_List();
        }
        else {
          this.serve.dismissLoading();
          this.serve.errorToast(result['statusMsg'])
        }
      },
        err => {
        });
  }

  presentPopover(myEvent) {

    this.Checkin_Data.display_name = this.siteDetail.name + ' ' + '(' + this.siteDetail.mobile + ')';
    this.Checkin_Data.name = this.siteDetail.name
    this.Checkin_Data.mobile = this.siteDetail.mobile
    this.Checkin_Data.id = this.siteDetail.id
    this.Checkin_Data.dr_type = this.siteDetail.dr_type
    this.Checkin_Data.company_name = this.siteDetail.company_name;
    this.Checkin_Data.stage_level = this.siteDetail.stage_level;

    let popover = this.popoverCtrl.create(LmsActivityListPage, { 'from': 'siteDetail', 'dr_type': this.siteDetail.dr_type, 'id': this.siteDetail.id, 'name': this.siteDetail.ownerName });

    popover.present({
      ev: myEvent
    });

    popover.onDidDismiss(() => {
      this.navCtrl.popTo(SiteProjectListPage)
    })
  }


  openModal() {
    let modal = this.modalCtrl.create(ExpenseStatusModalPage, { 'from': 'site_contact', 'site_id': this.siteId, 'selectAuto': (this.siteDetail.stage_level == 'Open' || this.siteDetail.stage_level == 'Win-F') ? true : false });
    modal.onDidDismiss(data => {
      if (data == true) {
        this.site_detail();
      }
    });
    modal.present();
  }


  deleteConfirmation(id) {
    let alert = this.alertCtrl.create({
      title: 'Are You Sure?',
      subTitle: 'You want to delete it',
      cssClass: 'alert-modal',

      buttons: [{
        text: 'No',
        role: 'cancel',
        handler: () => {
        }
      },
      {
        text: 'Yes',
        handler: () => {
          this.deleteRow(id)
        }
      }]
    });
    alert.present();
  }


  deleteRow(id) {
    this.serve.addData({ "data": { 'id': id } }, 'AppEnquiry/deleteSiteContactPerson')
      .then(resp => {
        if (resp['statusCode'] == 200) {
          this.serve.successToast(resp['statusMsg']);
          this.site_detail();
        } else {
          this.serve.errorToast(resp['statusMsg']);
        }
      }, error => {
        this.serve.Error_msg(error);
      })

  }

}
