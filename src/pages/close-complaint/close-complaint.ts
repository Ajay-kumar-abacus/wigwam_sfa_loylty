import { Component, ViewChild } from '@angular/core';
import { ActionSheetController, AlertController, IonicPage,Loading, LoadingController, NavController, NavParams, Platform } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { IonicSelectableComponent } from 'ionic-selectable';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { ComplaintDetailPage } from '../complaints/complaint-detail/complaint-detail';
import { DomSanitizer } from '@angular/platform-browser';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Observable } from 'rxjs';
import { Device } from '@ionic-native/device';
declare let cordova:any ;


/**
* Generated class for the CloseComplaintPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-close-complaint',
  templateUrl: 'close-complaint.html',
})
export class CloseComplaintPage {
  @ViewChild('selectComponent') selectComponent: IonicSelectableComponent
  @ViewChild('distributorSelectable') distributorSelectable: IonicSelectableComponent;

  formData: any = {}
  data: any = {}
  qr_code: any = '';
  sendOTP: boolean = false
  Otp_verify: boolean = false
  OTP_flag: boolean = false
  isDisabled: boolean = true
  
  mobile_number: any = {};
  btnDisableSave: boolean = false;
  btnDisableDraft: boolean = false;
  id: any;
  customer_mobile: any;
  closing_type: any;
  btndisable: boolean = false;
  isCameraEnabled: boolean = false;
  otp: any = {}
  search: any;
  dealer_list: any = [];
  row: any;


  prv_otp:any=0;
  mobile_no:any=0;
  loading:Loading;
  resendActiveClass:any=false;



  constructor(public Device:Device,public navCtrl: NavController, public navParams: NavParams, public service: MyserviceProvider, public loadingCtrl: LoadingController, private barcodeScanner: BarcodeScanner, public alertCtrl: AlertController, public serve: MyserviceProvider, public platform: Platform, public openNativeSettings: OpenNativeSettings, public actionSheetController: ActionSheetController, public diagnostic: Diagnostic, public androidPermissions: AndroidPermissions, public dom: DomSanitizer, private camera: Camera) {
    console.log(this.navParams);
    this.id = this.navParams.data.id;
    this.customer_mobile = this.navParams.data.customer_mobile;
    this.closing_type = this.navParams.data.closing_type;
    console.log(this.id);
    console.log(this.customer_mobile);
    console.log(this.closing_type);
    this.getDealerList('');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CloseComplaintPage');
    this.prv_otp = this.navParams.get('otp');
    this.time_counter();
  }

  countDown;
  counter = 30*60;
  tick = 1000;
  time_counter()
  {
    this.countDown = Observable.timer(0, this.tick)
    .take(this.counter)
    .map(() => {--this.counter;
      if(this.counter == 0)
      {
        this.prv_otp = Math.floor(100000 + Math.random() * 900000);
      }
    })
  }



  getDealerList(id){
    console.log(id);

    this.service.addData ({ },'AppServiceTask/dealerList').then( r =>
      {
        console.log(r);
        this.dealer_list=r['dealer'];
        // // this.karigar_id=r['id'];
        console.log(this.dealer_list);

      });
      if(id){
        let index= this.dealer_list.findIndex(d=> d.id==id);
        if(index!=-1){
          this.formData.dealer_id= this.dealer_list[index].id;
          this.formData.dealer_name= this.dealer_list[index].name;
          this.formData.company_name= this.dealer_list[index].company_name;
          this.formData.dealer_mobile= this.dealer_list[index].mobile;
        }
        console.log(this.formData.dealer_id);
        console.log(this.formData.dealer_name);
        console.log(this.formData.dealer_mobile);

      }
    }

    // getDealerList(search, id) {
    //   console.log(id);
    //   console.log(search)

    //   this.service.addData({ 'search': search }, 'AppServiceTask/dealerList').then(r => {
    //     console.log(r);
    //     this.dealer_list = r['dealer'];
    //     // // this.karigar_id=r['id'];
    //     console.log(this.dealer_list);

    //   });
    //   if (id) {
    //     let index = this.dealer_list.findIndex(d => d.id == id);
    //     if (index != -1) {
    //       this.formData.dealer_id = this.dealer_list[index].id;
    //       this.formData.dealer_name = this.dealer_list[index].name;
    //       this.formData.dealer_company_name = this.dealer_list[index].company_name;
    //       this.formData.dealer_mobile = this.dealer_list[index].mobile;
    //     }
    //     console.log(this.formData.dealer_id);
    //     console.log(this.formData.dealer_name);
    //     console.log(this.formData.dealer_company_name);
    //     console.log(this.formData.dealer_mobile);

    //   }
    // }


    closeDealer() {
      this.distributorSelectable._searchText = '';
    }
    // searchDealer(data, event) {
    //   console.log(event.text);
    //   console.log(data)

    //   if (event.text == '') {
    //     this.getDealerList('',0);
    //   }
    //   this.search = event.text;
    //   let wordSearch = this.search;
    //   setTimeout(() => {
    //     if (wordSearch == this.search) {
    //       if (this.search) {
    //         this.getDealerList(this.search, '');
    //       }
    //     }
    //   }, 500);
    // }
    Scaning() {
      this.platform.ready().then(() => {
        const options: BarcodeScannerOptions = {
          prompt: ""
        };
        this.barcodeScanner.scan(options).then(resp => {
          console.log(resp.text);

          this.formData.new_serial_no = resp.text;


        }, err => {
          console.log(err)
          this.serve.dismissLoading()
          this.selectComponent.close()
          this.presentConfirm('Turn On Camera permisssion !', 'please go to <strong>Settings</strong> -> Camera to turn on <strong>Camera permission</strong>')
        })

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
          // title:"Upload",
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

        this.takePhoto();
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
    // this.image=  imageData;
    // this.image= imageData.substr(imageData.lastIndexOf('/') + 1);
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
    // this.image=  imageData;
    // this.image= imageData.substr(imageData.lastIndexOf('/') + 1);
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




image_data: any = [];


fileChange(img) {

  this.image_data.push({ "image": img });
  console.log(this.image_data);
  this.image = '';
}

remove_image(i: any) {
  this.image_data.splice(i, 1);
}

MobileNumber(event: any) {
  const pattern = /[0-9\+\-\ ]/;
  let inputChar = String.fromCharCode(event.charCode);
  if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }
}

send_otp() {
  this.presentLoading();
  this.maxTime=30;
  this.StartTimer();
  if(this.counter == 0)
  {
    this.counter = 30*60;;
    this.time_counter();
  }
  console.log('send otp')
  console.log(this.customer_mobile, 'customer_mobile');
  console.log(this.formData)
  if (this.mobile_number == 8287803853) {
    console.log('if')
    this.formData.otp = 123456;
    this.btndisable = true;

  }
  else {
    this.formData.otp = Math.floor(100000 + Math.random() * 900000);
    // this.form.otp = 123456;
  }
  let data = { 'phone': this.customer_mobile, 'otp': this.formData.otp }
  this.service.addData(data, 'AppServiceTask/sendOtp').then((result) => {
    this.otp = result['otp']
    console.log(this.otp);
    if (result['statusCode'] == 200) {
      console.log("inside the api")
      this.Otp_verify = true
      console.log(this.Otp_verify);
      this.OTP_flag = true
      this.sendOTP = true
      this.loading.dismiss();
    }
    else {
      this.loading.dismiss();
      this.serve.errorToast(result['statusMsg'])
    }
  })
  this.resendActiveClass=true;
  setTimeout(()=>{
    this.resendActiveClass=false;
  },30000);

}
verify_otp(value) {
  // console.log(value);

  // console.log(this.data.otp);
  console.log('confirm otp', value)
  if (value.length == 6) {
    if (this.otp == this.data.otp) {
      // console.log('if case')

      this.OTP_flag = true
      this.isDisabled = false
      // this.service.successToast('OTP Verified Succesfully')

      //    this.btndisable=true
    }
    else {
      this.isDisabled = true

      this.service.errorToast('Please Enter Correct OTP.')

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


getdealer(id, name) {
  console.log(id);
  console.log(name);

  // this.formData.name=this.dealer_list.name;

}


closeComplaint() {
  this.formData.complaint_id = this.id
  // this.formData.name=this.dealer_list.name;
  //  this.formData.mobile=this.dealer_list.mobile

  this.formData.closing_type = this.closing_type

  this.formData.image = this.image_data ? this.image_data : [];
  console.log(this.formData);
  this.serve.presentLoading();
  this.serve.addData({ "data": this.formData, }, 'AppServiceTask/complaintStatus').then(result => {
    if (result['statusCode'] == 200) {
      this.serve.dismissLoading();
      this.showSuccess("Complaint Closed Successfully!");
      this.navCtrl.popTo(ComplaintDetailPage, { id: this.id });
    }
    else {
      this.serve.errorToast(result['statusMsg'])
    }
    console.log(result);
  });
}


maxtime:any=30;
maxTime:any = 0;
hidevalue:boolean = false;
timer:any;
StartTimer()
{
  this.timer = setTimeout((x) =>
  {
    if(this.maxtime <= 0) { }
    this.maxTime -= 1;

    if(this.maxTime>0){
      this.hidevalue = true;
      this.StartTimer();
    }
    else{
      this.maxtime = 30;
      this.hidevalue = false;
    }
  }, 1000);
}


// resendOtp()
// {
//   this.presentLoading();
//   this.maxTime=30;
//   this.StartTimer();
//   if(this.counter == 0)
//   {
//     this.counter = 30*60;;
//     this.time_counter();
//   }
//   console.log('send otp')
//   console.log(this.customer_mobile, 'customer_mobile');
//   console.log(this.formData)
//   if (this.mobile_number == 8287803853) {
//     console.log('if')
//     this.formData.otp = 123456;
//     this.btndisable = true;

//   }
//   else {
//     this.formData.otp = Math.floor(100000 + Math.random() * 900000);
//     // this.form.otp = 123456;
//   }
//   let data = { 'phone': this.customer_mobile, 'otp': this.formData.otp }
//   this.service.addData(data, 'AppServiceTask/sendOtp').then((result) => {
//     this.otp = result['otp']
//     console.log(this.otp);
//     if (result['statusCode'] == 200) {
//       console.log("inside the api")
//       this.Otp_verify = true
//       console.log(this.Otp_verify);
//       this.OTP_flag = true
//       this.sendOTP = true
//       this.loading.dismiss();
//     }
//     else {
//       this.loading.dismiss();
//       this.serve.errorToast(result['statusMsg'])
//     }
//   })
//   this.resendActiveClass=true;
//   setTimeout(()=>{
//     this.resendActiveClass=false;
//   },30000);
// }


presentLoading()
{
  this.loading = this.loadingCtrl.create({
    content: "Please wait...",
    dismissOnPageChange: true
  });
  this.loading.present();
}


}
