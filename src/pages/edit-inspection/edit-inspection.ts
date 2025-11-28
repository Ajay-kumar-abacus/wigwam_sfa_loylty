import { Component } from '@angular/core';
import { ActionSheetController, AlertController, IonicPage, LoadingController, ModalController, NavController, NavParams } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Diagnostic } from '@ionic-native/diagnostic';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { DomSanitizer } from '@angular/platform-browser';
import { ConstantProvider } from '../../providers/constant/constant';
import { ComplaintDetailPage } from '../complaints/complaint-detail/complaint-detail';
declare let cordova:any ;
import { Device } from '@ionic-native/device';
import { CameraModalPage } from '../camera-modal/camera-modal';
/**
 * Generated class for the EditInspectionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-inspection',
  templateUrl: 'edit-inspection.html',
})
export class EditInspectionPage {

  segment_list: any = []
  segment_detail: any = []
  segment_sub_list: any = []
  formData: any = {};
  filter: any = {};
  warranty_period: any;
  isCameraEnabled: boolean = false;
  loading: any = {};
  detail: any;
  // warrantyDetail: any;
  flag: boolean = true;
  bankImageFlag: boolean = false;
  documentImageFlag: boolean = false;
  documentBackImageFlag: boolean = false;
  upl_file: any = "";
  upload_url1: any
  cam: any = "Camera";
  gal: any = "Gallery";
  cancl: any = "Cancel";
  id: any;
  monthsToAdd: any;
  videoId: any;
  currentDate: string;


  constructor(public modalCtrl: ModalController,public Device:Device,public navCtrl: NavController, public db: MyserviceProvider, public actionSheetController: ActionSheetController, private camera: Camera, public alertCtrl: AlertController, public diagnostic: Diagnostic, public androidPermissions: AndroidPermissions, public dom: DomSanitizer, public serve: MyserviceProvider, public loadingCtrl: LoadingController, public navParams: NavParams, public constant: ConstantProvider) {

    this.currentDate = new Date().toISOString();
    console.log(this.currentDate);

    this.upload_url1 = this.constant.upload_url1 + 'service_task/'
    this.id = this.navParams.data.detail.id;
    this.detail = this.navParams.data.detail;
    if (this.detail) {
      this.segmentItemsDetail(this.detail.product_id)
      this.formData.serial_no = this.detail.serial_no
      this.formData.date_of_purchase = this.detail
      this.formData.warranty_end_date = this.detail
      this.formData.warranty_status = this.detail.warranty_status
      this.formData.closing_type = this.detail.closing_type
      this.formData.inspection_remark = this.detail.inspection_remark
      this.formData.warranty_status = this.detail.warranty_status
      this.formData.date_of_purchase = this.detail.date_of_purchase
      this.formData.warranty_end_date = this.detail.warranty_end_date

      this.formData.bill_copy_img = this.detail.bill_copy_img
      if (this.formData.bill_copy_img) {
        this.documentBackImageFlag = true
      }

      this.formData.warranty_card_copy_img = this.detail.warranty_card_copy_img
      if (this.formData.warranty_card_copy_img) {
        this.documentImageFlag = true
      }

      this.get_segment();
      this.formData.category = this.detail.segment_id
      this.formData.sub_category = this.detail.sub_segment_id
      this.formData.product_id = this.detail.product_id
      this.formData.product_name = this.detail.product_name
      this.formData.product_code = this.detail.product_code
      this.get_sub_segment(this.formData.category);
      this.get_sub_segmentDetail(this.formData.category, this.formData.sub_category);

    }
  }
  ionViewDidLoad() {
    this.isCameraAvailable();
  }

  showAlert(text) {
    let alert = this.alertCtrl.create({
      title: 'Alert!',
      cssClass: 'action-close',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }

  isCameraAvailable() {
    this.diagnostic.isCameraPresent()
      .then((isAvailable: any) => {
        this.isCameraEnabled = true;
      })
      .catch((error: any) => {
        console.dir('Camera is:' + error);
      });
  }



  captureMedia() {
    if (this.videoId) {
      this.captureImageVideo();
    }
    else {
      let actionsheet = this.actionSheetController.create({
        title: "Upload",
        cssClass: 'cs-actionsheet',

        buttons: [{
          cssClass: 'sheet-m',
          text: 'Image',
          icon: 'camera',
          handler: () => {
            console.log("Image Clicked");
            this.captureImageVideo();
          }
        },
        // {
        //   cssClass: 'sheet-m1',
        //   text: 'Video',
        //   icon:'image',
        //   handler: () => {
        //     console.log("Video Clicked");
        //     this.onGetCaptureVideoPermissionHandler();
        //   }
        // },
        {
          cssClass: 'cs-cancel',
          text: 'Cancel',
          role: 'cancel',
          icon: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
        ]
      });
      actionsheet.present();

    }

  }

  showLimit() {
    console.log('Image Data', this.image_data)
    let alert = this.alertCtrl.create({
      title: 'Alert',
      subTitle: "You can upload only 5 bill images",
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


  captureImageVideo() {
    let actionsheet = this.actionSheetController.create({
      title: "Complaint Media",
      cssClass: 'cs-actionsheet',

      buttons: [{
        cssClass: 'sheet-m',
        text: 'Camera',
        icon: 'camera',
        handler: () => {
          console.log("Camera Clicked");

          // this.takePhoto();
          this.cameraModal('camera');
        }
      },
      {
        cssClass: 'sheet-m1',
        text: 'Gallery',
        icon: 'image',
        handler: () => {
          console.log("Gallery Clicked");
          this.getImage();
        }
      },
      {
        cssClass: 'cs-cancel',
        text: 'Cancel',
        role: 'cancel',
        icon: 'cancel',
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
        this.image = data  
        console.log(this.image);
      if (this.image) {
        this.fileChange(this.image);
      }
    }
    
    
      
    });

    modal.present();
  }


  image: any = '';
  takePhoto() {
    this.diagnostic.requestCameraAuthorization().then((isAvailable: any) => {
    console.log("i am in camera function");
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 500,
      targetHeight: 400
    }

    console.log(options);
    if(this.Device.platform=='Android'){
        cordova.plugins.foregroundService.start('Camera', 'is running');
      }
    this.camera.getPicture(options).then((imageData) => {
      this.image = 'data:image/jpeg;base64,' + imageData;
      if(this.Device.platform=='Android'){
      cordova.plugins.foregroundService.stop();
      }
      console.log(this.image);
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
  getImage() {
    this.diagnostic.requestCameraAuthorization().then((isAvailable: any) => {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false
    }
    console.log(options);
    if(this.Device.platform=='Android'){
        cordova.plugins.foregroundService.start('Camera', 'is running');
      }
    this.camera.getPicture(options).then((imageData) => {
      this.image = 'data:image/jpeg;base64,' + imageData;
      if(this.Device.platform=='Android'){
      cordova.plugins.foregroundService.stop();
      }
      console.log(this.image);
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

  image_data: any = [];
  fileChange(img) {

    this.image_data.push({ "image": img });
    console.log(this.image_data);
    this.image = '';
  }

  remove_image(i: any) {
    this.image_data.splice(i, 1);
  }


  get_segment() {

    this.db.addData({}, "AppCustomerNetwork/segmentList")
      .then(resp => {
        if (resp['statusCode'] == 200) {
          this.segment_list = resp['data'];
        } else {
          this.db.errorToast(resp['statusMsg'])
        }
      },
        err => {
        })
  }

  get_sub_segment(id) {
    this.db.addData({ 'cat_id': id }, "AppCustomerNetwork/subSegmentList")
      .then(resp => {
        if (resp['statusCode'] == 200) {
          this.segment_sub_list = resp['data'];
          if (this.segment_sub_list.length <= 0) {
            this.get_sub_segmentDetail(this.formData.category, '')
          }

        } else {
          this.db.errorToast(resp['statusMsg'])
        }
      },
        err => {
        })
  }

  get_sub_segmentDetail(category, sub_category) {
    this.filter.cat_id = category
    this.filter.sub_cat_id = sub_category
    this.filter.product_warranty = 'not_zero'
    this.db.addData({ 'filter': this.filter }, "AppCustomerNetwork/segmentItems")
      .then(resp => {
        if (resp['statusCode'] == 200) {
          this.segment_detail = resp['data'];
        } else {
          this.db.errorToast(resp['statusMsg'])
        }
      },
        err => {
        })
  }

  segmentItemsDetail(id) {
    if (id) {
      let index = this.segment_detail.findIndex(d => d.id == id);
      if (index != -1) {
        this.formData.product_name = this.segment_detail[index].product_name;
        this.formData.product_code = this.segment_detail[index].product_code;
        this.warranty_period = this.segment_detail[index].warranty_period;
        this.calculateWarrantyEnd();
      }
    }
  }

  showSuccess(text) {
    let alert = this.alertCtrl.create({
      title: 'Success!',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }

  onUploadChange(evt: any) {
    let actionsheet = this.actionSheetController.create({
      title: this.upl_file,
      cssClass: 'cs-actionsheet',
      buttons: [{
        cssClass: 'sheet-m',
        text: this.cam,
        icon: 'camera',
        handler: () => {
          this.takeDocPhoto();
        }
      },
      {
        cssClass: 'sheet-m1',
        text: this.gal,
        icon: 'image',
        handler: () => {
          this.getDocImage();
        }
      },
      {
        cssClass: 'cs-cancel',
        text: this.cancl,
        role: 'cancel',
        handler: () => {
          this.formData.doc_edit_id = this.formData.id;
        }
      }
      ]
    });
    actionsheet.present();
  }
  getDocImage() {
    const options: CameraOptions = {
      quality: 75,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false
    }
    if(this.Device.platform=='Android'){
        cordova.plugins.foregroundService.start('Camera', 'is running');
      }
    this.camera.getPicture(options).then((imageData) => {
      this.flag = false;
      this.formData.doc_edit_id = '';
      this.documentImageFlag = true
      this.formData.docFrontBase64 = true
      this.formData.warranty_card_copy_img = 'data:image/jpeg;base64,' + imageData;
      if(this.Device.platform=='Android'){
      cordova.plugins.foregroundService.stop();
      }
    }, (err) => {
    });
  }
  takeDocPhoto() {
    const options: CameraOptions = {
      quality: 75,
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 1050,
      targetHeight: 1000
    }
    if(this.Device.platform=='Android'){
        cordova.plugins.foregroundService.start('Camera', 'is running');
      }
    this.camera.getPicture(options).then((imageData) => {
      this.flag = false;
      this.formData.doc_edit_id = '',
        this.formData.docFrontBase64 = true
      this.documentImageFlag = true
      this.formData.warranty_card_copy_img = 'data:image/jpeg;base64,' + imageData;
      if(this.Device.platform=='Android'){
      cordova.plugins.foregroundService.stop();
      }
    }, (err) => {
    });
  }

  onUploadBackChange(evt: any) {
    let actionsheet = this.actionSheetController.create({
      title: this.upl_file,
      cssClass: 'cs-actionsheet',
      buttons: [{
        cssClass: 'sheet-m',
        text: this.cam,
        icon: 'camera',
        handler: () => {
          this.backDocPhoto();
        }
      },
      {
        cssClass: 'sheet-m1',
        text: this.gal,
        icon: 'image',
        handler: () => {
          this.backDocImage();
        }
      },
      {
        cssClass: 'cs-cancel',
        text: this.cancl,
        role: 'cancel',
        handler: () => {
          this.formData.doc_back_edit_id = this.formData.id;
        }
      }
      ]
    });
    actionsheet.present();
  }
  backDocPhoto() {
    const options: CameraOptions = {
      quality: 75,
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 1050,
      targetHeight: 1000
    }
    if(this.Device.platform=='Android'){
        cordova.plugins.foregroundService.start('Camera', 'is running');
      }
    this.camera.getPicture(options).then((imageData) => {
      this.flag = false;
      this.formData.doc_back_edit_id = ''
      this.documentBackImageFlag = true
      this.formData.docBackBase64 = true
      this.formData.bill_copy_img = 'data:image/jpeg;base64,' + imageData;
      if(this.Device.platform=='Android'){
      cordova.plugins.foregroundService.stop();
      }
    }, (err) => {
    });
  }
  backDocImage() {
    const options: CameraOptions = {
      quality: 75,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false
    }
    if(this.Device.platform=='Android'){
        cordova.plugins.foregroundService.start('Camera', 'is running');
      }
    this.camera.getPicture(options).then((imageData) => {
      this.flag = false;
      this.formData.doc_back_edit_id = '';
      this.documentBackImageFlag = true
      this.formData.docBackBase64 = true
      this.formData.bill_copy_img = 'data:image/jpeg;base64,' + imageData;
      if(this.Device.platform=='Android'){
      cordova.plugins.foregroundService.stop();
      }
    }, (err) => {
    });
  }

  saveInspection() {
    this.formData.complaint_id = this.id
    this.formData.image = this.image_data ? this.image_data : [];
    this.serve.addData({ "data": this.formData }, 'AppServiceTask/complaintInspection').then(result => {
      if (result['statusCode'] == 200) {
        this.serve.dismissLoading();
        this.showSuccess("Inspection Successfully!");
        this.navCtrl.setRoot(ComplaintDetailPage, { id: this.id });
      }
      else {
        this.serve.errorToast(result['statusMsg'])
      }
    });

  }

  presentLoading() {
    this.loading = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  calculateWarrantyEnd() {
    const selectedDate = new Date(this.formData.date_of_purchase);
    const monthsToAdd = this.warranty_period;
    const newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + monthsToAdd, selectedDate.getDate());
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, '0');
    const day = String(newDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    this.formData.warranty_end_date = formattedDate;
  }

}
