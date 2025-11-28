import { Component, ViewChild } from '@angular/core';
import { App, IonicPage, NavController, ViewController, NavParams, Navbar, ActionSheetController, PopoverController, ToastController, LoadingController, AlertController, Platform, Events, ModalController } from 'ionic-angular';
import { MyserviceProvider } from '../../../providers/myservice/myservice';
import { Geolocation } from '@ionic-native/geolocation';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { AddOrderPage } from '../../add-order/add-order';
import { PrimaryOrderAddPage } from '../../primary-order-add/primary-order-add';
import { SecondaryOrderAddPage } from '../../secondary-order-add/secondary-order-add';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { MediaCapture, CaptureVideoOptions, MediaFile } from '@ionic-native/media-capture';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { EnquiryserviceProvider } from '../../../providers/enquiryservice/enquiryservice';
import { ExpensePopoverPage } from '../../expense-popover/expense-popover';
import { FollowupAddPage } from '../../followup-add/followup-add';
import { VisitingCardAddPage } from '../../visiting-card/visiting-card-add/visiting-card-add';
import { PopGiftAddPage } from '../../sales-app/pop-gift/pop-gift-add/pop-gift-add';
import { LmsQuotationAddPage } from '../../sales-app/new-lead/lms-lead-quotation/lms-quotation-add/lms-quotation-add';
import { ContractorMeetAddPage } from '../../Contractor-Meet/contractor-meet-add/contractor-meet-add';
import { AddMultipleContactPage } from '../../add-multiple-contact/add-multiple-contact';
import { DashboardPage } from '../../dashboard/dashboard';
import { PrimaryOrderDetailPage } from '../../primary-order-detail/primary-order-detail';
import { SecondaryOrderDetailPage } from '../../secondary-order-detail/secondary-order-detail';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { CheckinNewPage } from '../../checkin-new/checkin-new';
import { ConstantProvider } from '../../../providers/constant/constant';
import { SelectRegistrationTypePage } from '../../select-registration-type/select-registration-type';
import { Device } from '@ionic-native/device';
import { BrandAuditAddPage } from '../../brand-audit-add/brand-audit-add';
import { SupportPage } from '../../support/support';
import { AddSiteProjectPage } from '../../site-project/add-site-project/add-site-project';
import { PrimaryOrderPage } from '../../primary-order/primary-order';
import { CheckinListPage } from '../checkin-list/checkin-list';
import { SecondaryOrderPage } from '../../secondary-order/secondary-order';
import { LeadsDetailPage } from '../../leads-detail/leads-detail';
import { Diagnostic } from '@ionic-native/diagnostic';
import { CameraModalPage } from '../../camera-modal/camera-modal';
declare let cordova: any;
@IonicPage()
@Component({
  selector: 'page-end-checkin',
  templateUrl: 'end-checkin.html',
})
export class EndCheckinPage {
  @ViewChild(Navbar) navBar: Navbar;

  state_list: any = []; city_list: any = [];
  city_name: any = [];
  data: any = {};
  checkin_data: any = [];
  orderType: any = '';
  checkin: any = {};
  checkinForm: FormGroup;
  checkinFormWithNewDealer: FormGroup;
  order_token: any = [];
  brand_assign: any = [];
  salesUserId: any;
  spinnerLoader: boolean = false;
  showEditRetailer: boolean = true;
  today_date = new Date().toISOString().slice(0, 10);
  pending_checkin_id: any;
  new_retailer_id: any;
  area_list: any = [];
  form1: any = {};
  update_retailer_flag: any = '0';
  check_gst: any = '';
  gst_details: any = [];
  check_mobile: any = '';
  district_list: any = [];
  image: any = '';
  image_data: any = [];
  distributor_detail: any = {};
  videoId: any;
  flag_upload = true;
  flag_play = true;
  for_order: any = [];
  Folders: any = [];
  functionCalled: any = 0
  followup_status: string;
  checkin_type: any;
  
  checkinCameraFlag: number =0;

  constructor( public diagnostic: Diagnostic,public appCtrl: App, public events: Events, public constant: ConstantProvider, public viewCtrl: ViewController, public navCtrl: NavController, private camera: Camera, public popoverCtrl: PopoverController, public platform: Platform, public androidPermissions: AndroidPermissions, public navParams: NavParams, public actionSheetController: ActionSheetController, private mediaCapture: MediaCapture, public service: MyserviceProvider, public geolocation: Geolocation, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public formBuilder: FormBuilder,
    public locationAccuracy: LocationAccuracy, public openNativeSettings: OpenNativeSettings,
    public services: EnquiryserviceProvider, public Device: Device,
    public alertCtrl: AlertController, public storage: Storage,public modalCtrl: ModalController) {
    this.checkin_data = this.navParams.get('data');
    this.checkin_type = this.navParams.get('checkin_type');
    console.log(this.checkin_data,"checkin_data");
    console.log(this.checkin_type,"checkin_type");
    this.checkinForm = this.formBuilder.group({
      description: ['', Validators.compose([Validators.required])],
    })
    this.checkin.dr_name = this.checkin_data.dr_name;
    this.checkin.name = this.checkin_data.name;
    this.checkin.dr_mobile = this.checkin_data.dr_mobile_no;
  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
    this.pending_checkin();

    this.navBar.backButtonClick = () => {
      this.backAction('test button call')
    }
    this.salesUserId = this.checkin_data.created_by;
  }

  present_upload_document_alert() {
    let alert = this.alertCtrl.create({
      title: 'Document',
      subTitle: 'Upload Document is Mandatory',
      cssClass: 'action-close',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: () => {

        }
      }
      ]
    });
    alert.present();
  }


  backAction(test) {
    this.navCtrl.push(DashboardPage);
  }
  pending_checkin() {
    // this.service.presentLoading();
    this.service.addData({}, 'AppCheckin/pendingCheckin').then((result) => {
      if (result['statusCode'] == 200) {
        this.checkin_data = result['checkin_data'];
        this.checkinCameraFlag = result['checkinCameraFlag'];

        this.orderType = result['order_type'];
        this.Folders = result['checklist'];
        this.pending_checkin_id = this.checkin_data['checkin_id']
        this.new_retailer_id = this.checkin_data['dr_id']
        this.checkin.dr_name = this.checkin_data.dr_name;
        this.checkin.name = this.checkin_data.name;
        this.checkin.dr_type = this.checkin_data.dr_type;
        this.checkin.dr_code = this.checkin_data.dr_code;
        this.checkin.dr_type_name = this.checkin_data.dr_type_name;
        this.checkin.dr_mobile = this.checkin_data.dr_mobile_no;
        this.update_retailer_flag = this.checkin_data['update_retailer'];
        this.dr_detail();
        this.service.dismissLoading();
      } else {
        this.service.dismissLoading();

        this.service.errorToast(result['statusMsg'])
      }
    }, err => {
      this.service.Error_msg(err);
      this.service.dismissLoading();

    })
  }

  dr_detail() {

    this.service.addData({ 'Id': this.new_retailer_id ,'type':this.checkin.dr_type}, 'AppCustomerNetwork/distributorDetails').then((result) => {
      if (result['statusCode'] == 200) {

        this.distributor_detail = result['result'];
        console.log(this.distributor_detail)
      } else {

        // this.service.errorToast(result['statusMsg'])
      }
    }, error => {
      this.service.Error_msg(error);
      this.service.dismiss();
    }
    );

  }

  go_to(type) {

    if (type == 'Primary') {

      this.navCtrl.push(PrimaryOrderPage, { 'comes_from_which_page': 'leads-detail', 'dr_code': this.distributor_detail.dr_code, 'delivery_from': 'Yes', 'dr_id': this.new_retailer_id, 'type': type, 'dr_type': this.checkin_data.dr_type,'order_status':'Pending'});

    } else if (type == 'Secondary') {
      this.navCtrl.push(SecondaryOrderPage, { 'comes_from_which_page': 'leads-details', 'dr_code': this.distributor_detail.dr_code, 'delivery_from': (this.checkin_data.dr_type == 1 || this.checkin_data.dr_type == 3) ? 'Yes' : 'No', 'dr_id': this.new_retailer_id, 'type': 'order', 'dr_type': this.checkin_data.dr_type })
    } else if (type == 'Stock') {

      this.navCtrl.push(SecondaryOrderPage, { 'comes_from_which_page': 'leads-details', 'dr_code': this.distributor_detail.dr_code, 'delivery_from': this.checkin_data.dr_type == 3 ? 'No' : 'Yes', 'dr_id': this.new_retailer_id, 'type': 'stock', 'dr_type': this.checkin_data.dr_type })


    } else if (type == 'Checkin') {

      this.navCtrl.push(CheckinListPage, { 'comes_from_which_page': 'leads-details', 'dr_code': this.distributor_detail.dr_code, 'delivery_from': 'Yes', 'dr_id': this.new_retailer_id, 'type': type, 'dr_type': this.checkin_data.dr_type, 'Mode': 'My' })
    }
  }
  end_visit(checkin_id, description) {

    if (!this.checkin.checklist) {
      this.service.errorToast('Please Add Topic of Discussion !!')
      return;
    }
    if (this.image_data.length == 0) {
      this.service.errorToast('Please Capture Image')
      return;
    }
    if(this.checkin_data.followup_flag!=1 && this.checkin.followupType=='Yes'){
       this.service.errorToast("Please Add Follow Up");
       return;
    }
    
    this.spinnerLoader = true;
    this.platform.ready().then(() => {
      var whiteList = [];
      if (this.Device.platform == 'Android') {
        (<any>window).gpsmockchecker.check(whiteList, (result) => {
          if (result.isMock) {
            let alert = this.alertCtrl.create({
              title: 'Alert!',
              subTitle: 'Please Remove Thirt Party Location Apps',
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
            this.checkinEnd(checkin_id, description)
          }
        }, (error) => this.service.errorToast(error));
      } else {
        this.checkinEnd(checkin_id, description)
      }
    });


  }
  get_followup(){
    if(this.checkin.followupType=='Yes'){
      this.navCtrl.push(FollowupAddPage, { 'dr_id': this.checkin_data.dr_id, 'dr_name': this.checkin_data.dr_name ? this.checkin_data.dr_name : this.checkin_data.name, 'mobile': this.checkin_data.mobile, 'dr_type': this.checkin_data.dr_type, 'dr_type_name': this.checkin_data.dr_type_name, 'checkin_id': this.checkin_data.checkin_id });

    }
  }
  checkinEnd(checkin_id, description) {
    // if (!description) {
    //   this.service.errorToast('Please Add Description !!')
    //   return;
    // }

        if (!this.checkin.checklist) {
      this.service.errorToast('Please Add Topic of Discussion !!')
      return;
    }
    // if (this.image_data.length == 0) {
    //   this.service.errorToast('Please Capture Image')
    //   return;
    // }
    if(this.checkin_data.followup_flag!=1 && this.checkin.followupType=='Yes'){
       this.service.errorToast("Please Add Follow Up");
       return;
    }

    this.functionCalled = 1

    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {
        let options = { maximumAge: 10000, timeout: 15000, enableHighAccuracy: true };
        this.geolocation.getCurrentPosition(options).then((resp) => {

          var lat = resp.coords.latitude
          var lng = resp.coords.longitude
          this.service.presentLoading();
          this.checkin.lat = lat
          this.checkin.lng = lng
          this.checkin.checkin_id = checkin_id
          this.checkin.description = description
          this.checkin.imgarr = this.image_data
          this.checkin.dr_id = this.new_retailer_id
          this.checkin.transfer_from_enquiry = this.distributor_detail.transfer_from_enquiry
        
          this.service.addData(this.checkin, 'AppCheckin/visitEnd').then((result) => {
            if (result['statusCode'] == 200) {
              this.spinnerLoader = false;
              this.for_order = result['for_order'];
              this.brand_assign = result['brand_assign'];
              this.service.dismissLoading();
              this.service.successToast(result['statusMsg']);
              if (this.checkin_data.other_name == '') {
                console.log("line 299")
                // this.viewCtrl.dismiss();
                // this.appCtrl.getRootNav().push(CheckinNewPage);
                if (this.navCtrl.getViews().length >= 2) {
                  this.navCtrl.remove(1, 1, { animate: false })
                  this.navCtrl.pop({ animate: false })
                }
                // this.navCtrl.push(CheckinNewPage);
                 this.navCtrl.push(DashboardPage);
              }
              else {
                if (this.navCtrl.getViews().length >= 2) {
                  this.navCtrl.remove(1, 1, { animate: false })
                  this.navCtrl.pop({ animate: false })
                }
                this.navCtrl.push(CheckinNewPage);
                this.service.dismissLoading();
              }
            } else {
              this.spinnerLoader = false;
              this.service.errorToast(result['statusMsg'])
              this.service.dismissLoading();
            }
          },
            error => {
              this.spinnerLoader = false;
              this.service.Error_msg(error);
              this.service.dismissLoading();
            })

        }).catch((error) => {

        });
      },
      error => {
        this.spinnerLoader = false;
        this.service.Error_msg(error);
        this.service.dismissLoading();
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
             this.spinnerLoader = true;
          this.cameraModal('camera');
        }
      },
      {
        cssClass: 'sheet-m1',
        text: 'Gallery',
        icon: 'image',
        handler: () => {
          // this.getImage();
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


  getImage() {
    const options: CameraOptions = {
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
      if(this.Device.platform=='Android'){
        cordova.plugins.foregroundService.stop();
      }
    });
  }

  permissionFunction(){
  if(this.checkinCameraFlag==1){
 this.cameraModal('camera')
    }else{
this.checkinEnd(this.checkin_data.checkin_id,this.checkin.description)
    }
   
  }
  cameraModal(type) {
    this.spinnerLoader = true;
    let modal = this.modalCtrl.create(CameraModalPage,{'type':type});

    modal.onDidDismiss(data => {
      
      if (data != undefined && data != null) {  
        this.image = data
        if (this.image) {
          this.fileChange(this.image);
          // this.end_visit(this.checkin_data.checkin_id,this.checkin.description)
          
          this.checkinEnd(this.checkin_data.checkin_id,this.checkin.description)
        }
      
    }
    
    
      
    });

    modal.present();
  }
  takePhoto() {
    this.diagnostic.requestCameraAuthorization().then((isAvailable: any) => {
    console.log('in take photo', this.image_data)
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 500,
      targetHeight: 400

    }
    // this.service.dismiss();
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
  fileChange(img) {
    // this.image_data=[];
    this.image_data.push(img);

    this.image = '';
  }


  remove_image(i: any) {
    this.image_data.splice(i, 1);
  }



  presentPopover(myEvent, type) {
    let popover = this.popoverCtrl.create(ExpensePopoverPage, { 'via': 'checkin', 'checkInData': this.checkin_data, 'showEditRetailer': this.showEditRetailer, 'type': type });
    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss(resultData => {
      if (resultData['Retailer'] == 'Show') {
        this.showEditRetailer = true;
      }
      else if (resultData['Retailer'] == 'Hide') {
        this.showEditRetailer = false;
      }
    })
  }

  showLimit() {
    console.log('Image Data', this.image_data)
    let alert = this.alertCtrl.create({
      title: 'Alert',
      subTitle: "You can upload only 6 document images",
      cssClass: 'alert-modal',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
        }
      }
      ]
    });
    alert.present();
  }

  distributor_list: any = []
  goPrimaryOrderDetail(id) {
    this.navCtrl.push(PrimaryOrderDetailPage, { id: id, pageFrom: 'CheckinPage' })
  }

  goSecondaryOrderDetail(id) {
    this.navCtrl.push(SecondaryOrderDetailPage, { id: id, pageFrom: 'CheckinPage' })
  }


  goTo(where) {
    if (where == 'Primary') {
      console.log(this.checkin_data.state,"state")
      this.navCtrl.push(PrimaryOrderAddPage, { 'dr_type': this.checkin_data.dr_type, 'dr_code': this.checkin.dr_code, 'checkin_id': this.checkin_data.checkin_id, 'id': this.checkin_data.dr_id, 'dr_name': this.checkin_data.dr_name,'state':this.checkin_data.state, 'order_type': 'Primary','transfer_from_enquiry':this.distributor_detail.transfer_from_enquiry });
    }
    else if (where == 'Secondary') {
      this.navCtrl.push(SecondaryOrderAddPage, { 'dr_type': this.checkin_data.dr_type, 'id': this.checkin_data.dr_id, 'checkin_id': this.checkin_data.checkin_id, 'dr_name': this.checkin_data.dr_name, 'order_type': 'Secondary','transfer_from_enquiry':this.distributor_detail.transfer_from_enquiry});
    }
    else if (where == 'Stock') {
      this.navCtrl.push(SecondaryOrderAddPage, { 'dr_type': this.checkin_data.dr_type, 'id': this.checkin_data.dr_id, 'checkin_id': this.checkin_data.checkin_id, 'dr_name': this.checkin_data.dr_name, 'order_type': 'stock','transfer_from_enquiry':this.distributor_detail.transfer_from_enquiry});
    }
    // else if (where == 'SecondaryLead') {
    //   this.navCtrl.push(SecondaryOrderAddPage, { 'dr_type': this.checkin_data.assigned_to_influencer_type, 'id': this.checkin_data.assigned_to_influencer_id, 'checkin_id': this.checkin_data.checkin_id, 'dr_name': this.checkin_data.assigned_to_influencer_name, 'order_type': 'Secondary', 'site_name': this.checkin_data.dr_name + ' - ' + this.checkin_data.mobile, 'site_id': this.checkin_data.dr_id });
    // }
    else if (where == 'SecondaryLead') {
      this.navCtrl.push(SecondaryOrderAddPage, { 'dr_type':this.checkin_data.dr_type, 'id': this.checkin_data.dr_id, 'checkin_id': this.checkin_data.checkin_id, 'dr_name': this.checkin_data.dr_name, 'order_type': 'Secondary', 'site_id': this.checkin_data.dr_id });
    }
    else if (where == 'FollowUp') {

   
              this.navCtrl.push(FollowupAddPage, { 'dr_id': this.checkin_data.dr_id, 'dr_name': this.checkin_data.dr_name ? this.checkin_data.dr_name : this.checkin_data.name, 'mobile': this.checkin_data.mobile, 'dr_type': this.checkin_data.dr_type, 'dr_type_name': this.checkin_data.dr_type_name, 'checkin_id': this.checkin_data.checkin_id });
          
      
    }

    else if (where == 'VisitingCard') {
      this.navCtrl.push(VisitingCardAddPage, { 'dr_type': this.checkin_data.dr_type, 'checkin_id': this.checkin_data.checkin_id, 'dr_name': this.checkin_data.dr_name });
    }
    else if (where == 'quotation') {
      this.navCtrl.push(LmsQuotationAddPage, { 'dr_type': this.checkin_data.dr_type, 'checkin_id': this.checkin_data.checkin_id, 'dr_name': this.checkin_data.dr_name })
    }
    else if (where == 'MEET') {
      this.navCtrl.push(ContractorMeetAddPage, { 'dr_type': this.checkin_data.dr_type, 'checkin_id': this.checkin_data.checkin_id, 'dr_name': this.checkin_data.dr_name, 'checkinUserID': this.salesUserId })
    }
    else if (where == 'UPLOAD') {
      this.captureMedia();
    }
    else if (where == 'Contacts') {
      this.navCtrl.push(AddMultipleContactPage, { 'dr_id': this.checkin_data.dr_id, 'checkin_id': this.checkin_data.checkin_id, 'dr_name': this.checkin_data.dr_name })
    }
  }


  goToBrandAudit() {
    if(this.checkin_data.dr_code == ''){
      this.checkin_data.dr_type='2'
    }
    this.navCtrl.push(BrandAuditAddPage, { 'dr_type': this.checkin_data.dr_type.toString(), 'dr_id': this.checkin_data.dr_id, 'checkin_id': this.checkin_data.checkin_id, 'dr_name': this.checkin_data.dr_name })
  }
  goToAddTicket() {
    if(this.checkin_data.dr_code == ''){
      this.checkin_data.dr_type='2'
    }
    console.log(this.checkin_data.dr_type)
    this.navCtrl.push(SupportPage, { 'dr_type': this.checkin_data.dr_type.toString(), 'dr_id': this.checkin_data.dr_id, 'checkin_id': this.checkin_data.checkin_id, 'dr_name': this.checkin_data.dr_name })
  }
  goToAddLead() {
    this.navCtrl.push(AddSiteProjectPage, { 'dr_type': this.checkin_data.dr_type.toString(), 'dr_id': this.checkin_data.dr_id, 'checkin_id': this.checkin_data.checkin_id, 'dr_name': this.checkin_data.dr_name, 'dr_type_name': this.checkin_data.dr_type_name })
  }

  distributor_detail_page(dr_id) {
    this.navCtrl.push(LeadsDetailPage, { 'dr_id': dr_id, 'type': 'Dr', 'dr_type': this.checkin_data.dr_type.toString(), "Mode":"My" })
  }

  goToPage(type) {

    if (type == 'Primary') {

      this.navCtrl.push(PrimaryOrderPage, { 'comes_from_which_page': 'leads-detail', 'dr_id': this.checkin_data.dr_id, 'type': type, 'dr_type': this.checkin_data.dr_type });

    } else if (type == 'Checkin') {
      this.navCtrl.push(CheckinListPage, { 'comes_from_which_page': 'leads-details', 'delivery_from': 'Yes', 'dr_id': this.checkin_data.dr_id, 'type': type, 'dr_type': this.checkin_data.dr_type, 'Mode': 'My' })
    }
    else if (type == 'Secondary') {
      this.navCtrl.push(SecondaryOrderPage, { 'comes_from_which_page': 'leads-details', 'delivery_from': (this.checkin_data.dr_type == 1 || this.checkin_data.dr_type == 3) ? 'Yes' : 'No', 'dr_id': this.checkin_data.dr_id, 'type': 'order', 'dr_type': this.checkin_data.dr_type })
    } else if (type == 'Stock') {

      this.navCtrl.push(SecondaryOrderPage, { 'comes_from_which_page': 'leads-details', 'delivery_from': this.checkin_data.dr_type == 3 ? 'No' : 'Yes', 'dr_id': this.checkin_data.dr_id, 'type': 'stock', 'dr_type': this.checkin_data.dr_type })
    }
  }


  noMeetingFlag: boolean = false;

  findTopics() {
    this.noMeetingFlag = false;
    console.log(this.checkin.checklist, "this is check list")
    for (let i = 0; i < this.checkin.checklist.length; i++) {
      if (this.checkin.checklist[i]['id'] == 17) {
        this.noMeetingFlag = true;
        this.checkin.checklist = [{ date_created: "2023-11-20", del: 0, id: 17, name: "No Meeting" }]
        this.checkin.description="No Meeting"
      }
    }
    console.log(this.checkin.checklist)
  }
}
