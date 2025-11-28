import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams, ToastController, ActionSheetController, PopoverController } from 'ionic-angular';
import { MyserviceProvider } from '../../../../providers/myservice/myservice';
import { LmsActivityListPage } from '../lms-lead-activity/lms-activity-list/lms-activity-list';
import { LmsQuotationListPage } from '../lms-lead-quotation/lms-quotation-list/lms-quotation-list';
import { AddMultipleContactPage } from '../../../add-multiple-contact/add-multiple-contact';
import { PointLocationPage } from '../../../point-location/point-location';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { LmsLeadAddPage } from '../lms-lead-add/lms-lead-add';
import { ModalController } from 'ionic-angular';
import { ExpenseStatusModalPage } from '../../../expense-status-modal/expense-status-modal';
import { FollowupAddPage } from '../../../followup-add/followup-add';
import { Device } from '@ionic-native/device';
import { Diagnostic } from '@ionic-native/diagnostic';
import { CameraModalPage } from '../../../camera-modal/camera-modal';
declare let cordova: any;


@IonicPage()
@Component({
  selector: 'page-lms-lead-detail',
  templateUrl: 'lms-lead-detail.html',
})
export class LmsLeadDetailPage {
  Checkin_Data: any = {}
  search: any = {}
  dr_id: any;
  lead_detail: any = {};
  activity_list: any;
  contactPerson: any = {};
  visiting_image: any = [];
  image: any = '';
  data: any = '';
  form: any = {};
  actionType: any;

  constructor(public diagnostic: Diagnostic,public Device:Device,public popoverCtrl: PopoverController, public navCtrl: NavController, public toastCtrl: ToastController, public actionSheetController: ActionSheetController,
    private camera: Camera, public navParams: NavParams, public serve: MyserviceProvider, public loadingCtrl: LoadingController, public service: MyserviceProvider,
    public modalCtrl: ModalController) {
  }

  ionViewWillEnter() {
    this.dr_id = this.navParams.get('id');
    this.actionType = this.navParams.get('actionType');
    this.lead_Detail();
    this.get_Activity_List();
  }


  lead_Detail() {
    // this.serve.presentLoading();
    this.service.addData({ 'dr_id': this.dr_id, search: this.search }, 'AppEnquiry/getEnquiryDetail').then((result) => {

      if (result['statusCode'] == 200) {
        this.lead_detail = result['data'];
        this.visiting_image.push(this.lead_detail.visiting_card_image)
        this.contactPerson = result['data']['contactPerson'];
        if(this.lead_detail.name){
          this.lead_detail.name = String(this.lead_detail.name)
        }
        // this.serve.dismissLoading();
      }
      else {
        this.serve.errorToast(result['statusMsg']);
        // this.serve.dismissLoading();
      }

    }, error => {
      this.serve.Error_msg(error);
      this.serve.dismiss();
    });
  }

  get_Activity_List() {
    this.serve.addData({ 'dr_id': this.dr_id }, "AppEnquiry/activityList")
      .then(result => {
        this.activity_list = result['result'];
        this.activity_list.reverse()
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
    this.navCtrl.push(LmsLeadAddPage, { 'data': this.lead_detail })
  }
  addContactPerson(id) {
    this.navCtrl.push(AddMultipleContactPage, { 'dr_id': id })
  }

  update_location(lat, lng, id, leadType) {
    this.navCtrl.push(PointLocationPage, { "lat": lat, "lng": lng, "id": id, "type": leadType });
  }
  addFollowup() {
    this.navCtrl.push(FollowupAddPage, { 'dr_id': this.dr_id, 'dr_name': this.lead_detail.name, 'mobile': this.lead_detail.mobile, 'dr_type': this.lead_detail.influencer_type_id, 'dr_type_name': this.lead_detail.influencer_type, 'vertualLead_id': this.lead_detail.enquiry_id, 'converted': this.lead_detail.converted });
  }
  remove_image(i: any) {
    this.visiting_image.splice(i, 1);
  }

  statusModal() {
    let modal = this.modalCtrl.create(ExpenseStatusModalPage, { 'from': 'enquiry_status', 'id': this.lead_detail.id, 'type': this.lead_detail.stage_level, 'dr_type': this.lead_detail.dr_type, 'converted': this.lead_detail.converted });

    modal.onDidDismiss((data) => {
      if (data == true) {
        this.lead_Detail();
      }
    });

    modal.present();
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

  cameraModal(type) {
    let modal = this.modalCtrl.create(CameraModalPage,{'type':type});

    modal.onDidDismiss(data => {
      
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



  fileChange(img) {
    this.visiting_image = (img);
    this.image = '';
  }

  addRemark(remark) {
    this.form.remark = remark
    if (this.form.remark == undefined) {
      this.serve.errorToast('remarks is required');
      return
    }
    this.serve.presentLoading()
    this.serve.addData({ "dr_id": this.dr_id, "dr_name": this.lead_detail.name, 'remarks': remark }, "AppEnquiry/addEnquiryActivity")
      .then(result => {
        if (result['statusCode'] == 200) {
          this.form.remark = '';
          
          this.serve.dismissLoading();
          this.navCtrl.pop();
          // this.get_Activity_List();
        
        }
        else {
          this.serve.dismissLoading();
          this.serve.errorToast(result['statusMsg'])
        }
      },
        err => {
        });
  }
  addCustomer(remark) {
    this.form.remark = remark
    if (this.form.remark == undefined) {
      this.serve.errorToast('remarks is required');
      return
    } 
    this.serve.presentLoading()
    this.serve.addData({ "dr_id": this.dr_id, "dr_name": this.lead_detail.name, 'remarks': 'Customer Exsist' }, "AppEnquiry/addEnquiryActivity")
      .then(result => {
        if (result['statusCode'] == 200) {
          this.form.remark = '';
          
          this.serve.dismissLoading();
          this.AddCustomerType();
          // this.get_Activity_List();
        
        }
        else {
          this.serve.dismissLoading();
          this.serve.errorToast(result['statusMsg'])
        }
      },
        err => {
        });
  }
  AddCustomerType(){
    this.serve.addData({ "dr_id": this.dr_id, "customerExsist":"yes" }, "AppEnquiry/addCustomerType")
    .then(result => {
      if (result['statusCode'] == 200) {
        this.service.successToast(result['statusMsg'])
        
       
      
      }
      else {
       
        this.serve.errorToast(result['statusMsg'])
      }
    },
      err => {
      });

  }
  
  presentPopover(myEvent) {

    this.Checkin_Data.display_name = this.lead_detail.name + ' ' + '(' + this.lead_detail.mobile + ')';
    this.Checkin_Data.name = this.lead_detail.name
    this.Checkin_Data.mobile = this.lead_detail.mobile
    this.Checkin_Data.id = this.lead_detail.id
    this.Checkin_Data.dr_type = this.lead_detail.type
    this.Checkin_Data.company_name = this.lead_detail.company_name;
    this.Checkin_Data.stage_level = this.lead_detail.stage_level;
    console.log(this.lead_detail.converted, "converetd")
    let popover = this.popoverCtrl.create(LmsActivityListPage, { 'from': 'enquiryDetail', 'dr_type': this.lead_detail.type, 'id': this.lead_detail.id, 'name': this.lead_detail.name, 'checkin_data': this.Checkin_Data, 'converted': this.lead_detail.converted });

    popover.present({
      ev: myEvent
    });
  }
}
