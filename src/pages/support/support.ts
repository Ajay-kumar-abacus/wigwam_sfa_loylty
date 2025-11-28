import { Component, ViewChild } from '@angular/core';
import { FileOpener } from '@ionic-native/file-opener';
import { ActionSheetController, AlertController, IonicPage, LoadingController, ModalController, NavController, NavParams, ToastController } from 'ionic-angular';
import { ConstantProvider } from '../../providers/constant/constant';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { SupportListPage } from '../support-list/support-list';
import { IonicSelectableComponent } from 'ionic-selectable';
import { Device } from '@ionic-native/device';
import { Diagnostic } from '@ionic-native/diagnostic';
import { CameraModalPage } from '../camera-modal/camera-modal';
declare let cordova: any;
@IonicPage()
@Component({
  selector: 'page-support',
  templateUrl: 'support.html',
})
export class SupportPage {
  @ViewChild('selectComponent') selectComponent: IonicSelectableComponent;
  data: any = {};
  selectImage: any = [];
  typeSupport: any = [];
  savingFlag: boolean = false;
  spinnerLoader: boolean = false;
  networkType: any = [];
  drList: any = [];
  checkin_id: any;
  cpType: string;

  constructor(public diagnostic: Diagnostic,public Device:Device,public storage: Storage,public modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams, public service: MyserviceProvider, public actionSheetController: ActionSheetController, private camera: Camera, public alertCtrl: AlertController, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {
    // this.service.presentLoading();


  }

  ionViewWillEnter() {
    if (this.navParams.get('checkin_id')) {
      this.checkin_id = this.navParams.get('checkin_id');
      this.data.checkin_id = this.navParams.get('checkin_id');
      this.data.customer_type = this.navParams.get('dr_type');
      console.log(this.data.customer_type)
      if (this.data.customer_type) {
        this.data.customer_name = this.navParams.get('dr_id');
        this.getSupport();
        this.getNetworkType();
      }
    } else if (this.navParams.get('fromPage') == 'distDetail') {
      this.data.customer_type = this.navParams.get('dr_type');
      if (this.data.customer_type) {
        this.data.customer_name = this.navParams.get('dr_id');
        this.getSupport();
        this.getNetworkType();
        console.log(this.navParams.get('dr_id'), "logs");
      }
      console.log()
    }
    else {
      this.getSupport();
      this.getNetworkType();
    }
  }


  getSupport() {
    this.service.addData({}, 'AppSupport/getSupportcategory').then((result) => {

      if (result['statusCode'] == 200) {
        this.typeSupport = result['data'];
        this.service.dismissLoading();
      }
      else {
        this.service.errorToast(result['statusMsg']);
        this.service.dismissLoading();
      }
    });
  }
  getNetworkType() {
    this.service.addData({}, "AppFollowup/allNetworkModule").then((result => {
      if (result['statusCode'] == 200) {
        this.networkType = result['modules'];
        if (this.checkin_id || this.navParams.get('fromPage') == 'distDetail') {
          this.getCustomerData(this.data.customer_type)
        }
      } else {
        this.service.errorToast(result['statusMsg'])
      }
    }))
  }
  getCustomerData(data) {
     
   
    if (data == '1') {
      data='1'
      this.cpType = 'Active'
  }
  if (data == '2') {
    data='1'
    this.cpType = 'Inactive'
  }
 
    let Index = this.networkType.findIndex(row => row.type == data);
    if (Index != -1) {
      this.data.module_name = this.networkType[Index]['module_name']
    }
  
    this.service.addData({ 'dr_type':data,'active_tab': this.cpType }, 'AppOrder/followupCustomer').then((result) => {
      this.drList = result['result'];
    });

  }

  onUploadChange(evt: any) {
    let actionsheet = this.actionSheetController.create({
      title: 'Upload File',
      cssClass: 'cs-actionsheet',

      buttons: [{
        cssClass: 'sheet-m',
        text: 'Camera',
        icon: 'camera',
        handler: () => {
          // this.takePhoto();
          this.cameraModal('camera');
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
        handler: () => {
          this.selectImage = [];
        }
      }]
    });
    actionsheet.present();
  }
  cameraModal(type) {
    let modal = this.modalCtrl.create(CameraModalPage,{'type':type});

    modal.onDidDismiss(data => {
      
      if (data != undefined && data != null) {  
        var image = data;
        this.selectImage.push(image);
    }
    
    
      
    });

    modal.present();
  }
  takePhoto() {
    this.diagnostic.requestCameraAuthorization().then((isAvailable: any) => {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 500,
      targetHeight: 400
    }
    if(this.Device.platform=='Android'){
        cordova.plugins.foregroundService.start('Camera', 'is running');
      }
    this.camera.getPicture(options).then((imageData) => {
      var image = 'data:image/jpeg;base64,' + imageData;
      if(this.Device.platform=='Android'){
      cordova.plugins.foregroundService.stop();
      }
      this.selectImage.push(image);
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
    if(this.Device.platform=='Android'){
      cordova.plugins.foregroundService.stop();
      }
    this.camera.getPicture(options).then((imageData) => {
      var image = 'data:image/jpeg;base64,' + imageData;
      if(this.Device.platform=='Android'){
      cordova.plugins.foregroundService.stop();
      }
      this.selectImage.push(image);
    }, (err) => {
    });
  }).catch((error: any) => {
   
  });
    
  }

  delete_img(index) {
    this.selectImage.splice(index, 1);
  }

  confirmAlert() {
    let alert = this.alertCtrl.create({
      enableBackdropDismiss: false,
      title: "Are you sure !",
      message: "Do you want to save this ticket ?",
      cssClass: 'alert-modal',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.submit()
          }
        }

      ]
    });
    alert.present();
  }
  submit() {
    this.data.image = this.selectImage;
    console.log(this.data.module_name)
    this.data.customer_type = this.data.module_name
    this.savingFlag = true;
    this.spinnerLoader = true;
    let Index = this.typeSupport.findIndex(row => row.id == this.data.type)
    if (Index != -1) {
      this.data.type_name = this.typeSupport[Index]['category_name']
    }
    let customerIndex
    if (this.checkin_id || this.navParams.get('fromPage') == 'distDetail') {
      customerIndex = this.drList.findIndex(row => row.id == this.data.customer_name)
    }
    if (!this.checkin_id && this.navParams.get('fromPage') != 'distDetail') {
      customerIndex = this.drList.findIndex(row => row.id == this.data.customer_name.id)
    }
    if (customerIndex != -1) {
      this.data.customer_id = this.drList[customerIndex]['id']
      this.data.customer_name = this.drList[customerIndex]['display_name']
    }
    this.service.addData({ 'data': this.data }, 'AppSupport/addSupport')
      .then((result) => {

        if (result['statusCode'] == 200) {
          this.spinnerLoader = true;

          this.navCtrl.popTo(SupportListPage);
          this.service.successToast(result['statusMsg']);
          this.savingFlag = false;
        }
        else {
          this.service.errorToast(result['statusMsg']);
          this.savingFlag = false;
        }

      }, error => {
        this.savingFlag = false;

        this.service.Error_msg(error);
        this.service.dismiss();
      });
  }
}
