import { Component ,ViewChild} from '@angular/core';
import { ActionSheetController, AlertController, IonicPage, LoadingController, ModalController, NavController, NavParams, Platform } from 'ionic-angular';
import { MyserviceProvider } from '../../../providers/myservice/myservice';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { Diagnostic } from '@ionic-native/diagnostic';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Camera,CameraOptions } from '@ionic-native/camera';
import { DomSanitizer } from '@angular/platform-browser';
import { IonicSelectableComponent } from 'ionic-selectable';
import { InstallationDetailPage } from '../installation-detail/installation-detail';
import { CameraModalPage } from '../../camera-modal/camera-modal';

/**
 * Generated class for the CloseInstalltionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-close-installtion',
  templateUrl: 'close-installtion.html',
})
export class CloseInstalltionPage {
  @ViewChild('selectComponent') selectComponent: IonicSelectableComponent
  formData:any={}
  data:any={}
  qr_code: any = '';
  sendOTP:boolean=false
  Otp_verify:boolean=false
  OTP_flag:boolean=false
  isDisabled:boolean=true
  mobile_number: any = {};
  btnDisableSave: boolean = false;
  btnDisableDraft: boolean = false;
  id: any;
  customer_mobile: any;
  closing_type: any;
  btndisable: boolean = false;
  isCameraEnabled:boolean= false;
  otp:any={}


  constructor(public navCtrl: NavController, public modalCtrl: ModalController ,public navParams: NavParams,public service: MyserviceProvider,public loadingCtrl: LoadingController,public alertCtrl: AlertController,public serve : MyserviceProvider,public platform: Platform,public openNativeSettings: OpenNativeSettings,public actionSheetController: ActionSheetController, public diagnostic  : Diagnostic, public androidPermissions: AndroidPermissions,public dom:DomSanitizer,private camera: Camera) {
    console.log(this.navParams);
    this.id  =this.navParams.data.id;
    this.customer_mobile  =this.navParams.data.customer_mobile;
    this.closing_type  =this.navParams.data.closing_type;
    console.log(this.id);
    console.log(this.customer_mobile);
    console.log(this.closing_type);
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad CloseInstalltionPage');
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
  
  showAlert(text) {
    let alert = this.alertCtrl.create({
      title:'Alert!',
      cssClass:'action-close',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }
  
  isCameraAvailable()
  {
    this.diagnostic.isCameraPresent()
    .then((isAvailable : any) =>
    {
      this.isCameraEnabled = true;
    })
    .catch((error :any) =>
    {
      console.dir('Camera is:' + error);
    });
  }
  
  
  
  captureMedia()
  {
    if(this.videoId)
    {
      this.captureImageVideo();
    }
    else
    {
      let actionsheet = this.actionSheetController.create({
        title:"Upload",
        cssClass: 'cs-actionsheet',
        
        buttons:[{
          cssClass: 'sheet-m',
          text: 'Image',
          icon:'camera',
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
          icon:'cancel',
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


captureImageVideo()
{
  let actionsheet = this.actionSheetController.create({
    title:"Complaint Media",
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
      icon:'cancel',
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
        console.log(data)
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

image:any='';
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
  this.camera.getPicture(options).then((imageData) => {
    this.image = 'data:image/jpeg;base64,' + imageData;
    // this.image=  imageData;
    // this.image= imageData.substr(imageData.lastIndexOf('/') + 1);
    console.log(this.image);
    if(this.image)
    {
      this.fileChange(this.image);
    }
  }, (err) => {
  });
}).catch((error: any) => {
   
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
  this.camera.getPicture(options).then((imageData) => {
    this.image= 'data:image/jpeg;base64,' + imageData;
    // this.image=  imageData;
    // this.image= imageData.substr(imageData.lastIndexOf('/') + 1);
    console.log(this.image);
    if(this.image)
    {
      this.fileChange(this.image);
    }
  }, (err) => {
  });
}).catch((error: any) => {
   
});
}

videoId: any;
flag_upload = true;
flag_play = true;
// getVideo()
// {
//   this.fileChooser.open()
//   .then(uri => {
//     this.videoId = uri;
//     this.flag_play = false;
//     this.flag_upload = false;
//   })
//   .catch(e => console.log(e));
// }




image_data:any=[];


fileChange(img)
{
  
  this.image_data.push({"image":img});
  console.log(this.image_data);
  this.image = '';
}

remove_image(i:any)
{
  this.image_data.splice(i,1);
}

MobileNumber(event: any) 
{
  const pattern = /[0-9\+\-\ ]/;
  let inputChar = String.fromCharCode(event.charCode);
  if (event.keyCode != 8 && !pattern.test(inputChar)) 
  {event.preventDefault(); }
}

send_otp(){
  console.log('send otp')
  console.log(this.customer_mobile,'customer_mobile');
  console.log(this.formData)
  if (this.mobile_number==8287803853) {
    console.log('if')
    this.formData.otp = 123456;
    this.btndisable = true;
    
  }
  else {
    this.formData.otp = Math.floor(100000 + Math.random() * 900000);
    // this.form.otp = 123456;
  }
  let data={'phone':this.customer_mobile,'otp':this.formData.otp}
  this.service.addData(data, 'AppServiceTask/sendOtp').then((result) => {
    this.otp=result['otp']
    console.log(this.otp);
    if (result['statusCode'] == 200) {
      console.log("inside the api")
      this.Otp_verify=true
      console.log(this.Otp_verify);
      this.OTP_flag=true
      this.sendOTP=true
    }
    else {
      this.serve.errorToast(result['statusMsg'])
    }
  })
  
}
verify_otp(value){
  console.log(value);
  
  console.log(this.data.otp);
  console.log('confirm otp',value)
  if(value.length ==6){
    if(this.otp==this.data.otp){
      console.log('if case')
      
      this.OTP_flag=true
      this.isDisabled=false
      // this.service.successToast('OTP Verified Succesfully')
 
      //    this.btndisable=true
    }
    else{
      this.isDisabled=true

      this.service.errorToast('Please Enter Correct OTP.')
      
    }
  }
  
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

closeComplaint(){
  
  
  this.formData.complaint_id=this.id
  this.formData.closing_type=this.closing_type
  this.formData.image = this.image_data?this.image_data:[];
  console.log(this.formData);
  
  this.serve.addData( {"data": this.formData, },'AppServiceTask/complaintStatus').then(result =>
    {
      if (result['statusCode'] == 200) {
        this.serve.dismissLoading();
        this.showSuccess("Installation Closed Successfully!");
        this.navCtrl.popTo(InstallationDetailPage,{ id: this.id});
      }
      else {
        this.serve.errorToast(result['statusMsg'])
      }
      console.log(result); 
    });
  }

}
