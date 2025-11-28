import { Component } from '@angular/core';
import { FileOpener } from '@ionic-native/file-opener';
import { ActionSheetController, AlertController, IonicPage, LoadingController, ModalController, NavController, NavParams, ToastController } from 'ionic-angular';
import { ConstantProvider } from '../../providers/constant/constant';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { SupportListPage } from '../support-list/support-list';
import { Device } from '@ionic-native/device';
import { Diagnostic } from '@ionic-native/diagnostic';
import { CameraModalPage } from '../camera-modal/camera-modal';
declare let cordova:any ;
@IonicPage()
@Component({
  selector: 'page-task-add',
  templateUrl: 'task-add.html',
})
export class TaskAddPage
{
  data:any ={};
  user_id:any ='';
  user_list:any=[];
  userId:any=[]
  selectImage:any=[];
  typeSupport:any =[];
  spinner:boolean = false;
  
  constructor(public diagnostic: Diagnostic,public Device:Device, public modalCtrl: ModalController,public storage: Storage, public navCtrl: NavController, public navParams: NavParams, public service: MyserviceProvider, public actionSheetController: ActionSheetController, private camera: Camera, public alertCtrl: AlertController, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {
    
  }
  
 ionViewWillEnter(){
  this.getuserlist()

 }
  
  getuserlist() {
    this.storage.get('userId').then((id) => {
      this.userId = id;
      this.service.presentLoading();
      this.service.addData({ 'user_id': this.userId }, 'AppTask/allASM').then((result) => {
        if(result['statusCode'] == 200){
          this.user_list = result['asm_id'];
          this.service.dismissLoading();
        }
        else{
          this.service.errorToast(result['statusMsg']);
          this.service.dismissLoading();
        }
        
      }, error => {
        this.service.Error_msg(error)
        this.service.dismissLoading();
      });
    });
  }
  
  
  
  onUploadChange(evt: any) {
    let actionsheet = this.actionSheetController.create({
      title:'Upload File',
      cssClass: 'cs-actionsheet',
      
      buttons:[{
        cssClass: 'sheet-m',
        text: 'Camera',
        icon:'camera',
        handler: () => {
          // this.takePhoto();
          this.cameraModal('camera');
        }
      },
      {
        cssClass: 'sheet-m1',
        text: 'Gallery',
        icon:'image',
        handler: () => {
          this.getImage();
        }
      },
      {
        cssClass: 'cs-cancel',
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          this.selectImage=[];
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
  takePhoto()
  {
    this.diagnostic.requestCameraAuthorization().then((isAvailable: any) => {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth : 500,
      targetHeight : 400
    }
    
    this.camera.getPicture(options).then((imageData) => {
      var image = 'data:image/jpeg;base64,' + imageData;
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
  
  getImage()
  {
    this.diagnostic.requestCameraAuthorization().then((isAvailable: any) => {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum:false
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
  
  delete_img(index){
    this.selectImage.splice(index,1);
  }
  
  
  showAlert(text)
  {
    let alert = this.alertCtrl.create({
      title:'Alert!',
      cssClass:'action-close',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }
  showSuccess(text)
  {
    let alert = this.alertCtrl.create({
      title:'Success!',
      cssClass:'action-close',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }
  
  submit(){
    this.spinner = true;
    let index = this.user_list.findIndex(row=> row.id == this.data.user_id)
    if(index != -1){
      this.data.type = this.user_list[index].user_type;
      this.data.name = this.user_list[index].name;
      this.data.id = this.user_list[index].id;
    }
    this.data.image = this.selectImage;
    this.service.addData({'data':this.data},'AppTask/addTask')
    .then( (result) =>
    {
      if(result['statusCode'] == 200){
        this.navCtrl.popTo(SupportListPage);
        this.spinner = false
        this.service.successToast(result['statusMsg']);
      }
      else{
        this.spinner = false;
        this.service.errorToast(result['statusMsg']);
      }
    },err => {
      this.spinner = false;
      this.service.Error_msg(err);
      this.service.dismiss();
    });
  }
}
