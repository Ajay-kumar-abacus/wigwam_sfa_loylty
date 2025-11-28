import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, LoadingController, AlertController, Loading, Alert, ModalController } from 'ionic-angular';
import { Camera ,CameraOptions} from '@ionic-native/camera';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { TabsPage } from '../../tabs/tabs';
import { MediaCapture, CaptureVideoOptions, MediaFile } from '@ionic-native/media-capture';
import { FileTransfer, FileUploadOptions,FileTransferObject } from '@ionic-native/file-transfer';
import { Diagnostic } from '@ionic-native/diagnostic';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { DomSanitizer } from '@angular/platform-browser';
import { MyserviceProvider } from '../../../providers/myservice/myservice';
import { ComplaintHistoryPage } from '../complaint-history/complaint-history';
import { Device } from '@ionic-native/device';
import { CameraModalPage } from '../../camera-modal/camera-modal';
declare let cordova:any ;

/**
* 
* Generated class for the AddNewComplaintPage page.
*,
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-add-new-complaint',
  templateUrl: 'add-new-complaint.html',
})
export class AddNewComplaintPage {
  form:any = {};
  customerData:any = {};
  loading:Loading;
  isCameraEnabled:boolean= false;
  productArr:any=[];
  districtList:any=[];
  stateList:any=[];
  savingFlag: boolean = false;
  
  
  
  fileChooser: any;
  data:any={};
  constructor(public Device:Device,public navCtrl: NavController,public modalCtrl: ModalController, public navParams: NavParams,public actionSheetController: ActionSheetController, private camera: Camera ,public service:DbserviceProvider,public serve : MyserviceProvider ,public loadingCtrl:LoadingController , public alertCtrl:AlertController, private mediaCapture: MediaCapture ,private transfer: FileTransfer, public diagnostic  : Diagnostic, public androidPermissions: AndroidPermissions,public dom:DomSanitizer) {
    this.data.type  =this.navParams.get('type');
    this.get_states();
    
  }
  
  ionViewDidLoad() {
    // this.getGeo();
    console.log('ionViewDidLoad AddNewComplaintPage');
    this.isCameraAvailable();
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
        
        this.cameraModal('camera');
        // this.takePhoto();
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

    if (data != undefined && data != null) {  
      this.image_data.push(data);  
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
    if(this.image)
    {
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
  if(this.Device.platform=='Android'){
        cordova.plugins.foregroundService.start('Camera', 'is running');
      }
  this.camera.getPicture(options).then((imageData) => {
    this.image= 'data:image/jpeg;base64,' + imageData;
    if(this.Device.platform=='Android'){
      cordova.plugins.foregroundService.stop();
      }
    // this.image=  imageData;
    // this.image= imageData.substr(imageData.lastIndexOf('/') + 1);
    console.log(this.image);
    if(this.image)
    {
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

checkMobile() {      
  if (this.form.mobile.length == 10) {
    this.serve.addData({ 'mobile':this.form.mobile },"AppServiceTask/customerCheck").then((result) => {
      if (result['statusMsg'] == "Exist") {
        this.customerData=result['data']
        console.log(this.customerData);
        this.form=this.customerData
        this.form.mobile=this.customerData.customer_mobile
        this.form.name=this.customerData.customer_name
        this.get_district(this.form.state);
      }
    });
  }
}

saveComplaint(){
  this.form.image = this.image_data?this.image_data:[];
  console.log(this.form);
  
  this.serve.addData( {"data": this.form },'AppServiceTask/serviceComplaintAdd').then(result =>
    {
      console.log(result); 
      this.loading.dismiss();
      this.showSuccess("Complaint Added Successfully!");
      this.navCtrl.setRoot(ComplaintHistoryPage);
    });
    
  }
  
  formData = new FormData();
  
  submit()
  {
    this.presentLoading();
    if(this.videoId){
      this.uploadVideo();
    }else{
      this.saveComplaint();
    }
    
    
  }
  
  
  onGetCaptureVideoPermissionHandler() {
    
    console.log('start');
    
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(
      result => {
        if (result.hasPermission) {
          
          console.log('hello111');
          
          this.capturevideo();
          
        } else {
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(result => {
            if (result.hasPermission) {
              
              console.log('hello222');
              
              this.capturevideo();
              
            }
          });
        }
      },
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
      );
      
      
      
      
    }
    
    capturevideo()
    {
      let options: CaptureVideoOptions = { limit: 1 };
      this.mediaCapture.captureVideo(options)
      .then((videodata: MediaFile[]) => {
        console.log(videodata);
        
        var i, path, len,name;
        for (i = 0, len = videodata.length; i < len; i += 1) 
        {
          path = videodata[i].fullPath;
          name = videodata[i].name;
          // do something interesting with the file
        }
        this.videoId = path;
        this.flag_play = false;
        this.flag_upload = false;
        console.log(videodata);
        
        
      });
    }
    
    remove_video()
    {
      this.videoId='';
    }
    video_data:any=[];
    
    videoChange(video)
    {
      this.video_data.push(video);
      console.log(this.video_data);
      
      
    }
    
    
    
    uploadVideo() 
    {
      
      const fileTransfer: FileTransferObject = this.transfer.create();
      let options1: FileUploadOptions = 
      {
        fileKey: 'video_upload_file',
        fileName: this.videoId,
        headers: {},
        mimeType: "multipart/form-data",
        params: { },
        chunkedMode: false
      }
      console.log(this.videoId);
      console.log(options1);
      console.log('start');
      
      
      
      fileTransfer.upload(this.videoId,"http://phpstack-83335-1970078.cloudwaysapps.com/dd_api/app/uploadVideos.php", options1)
      .then((data :any) => {
        
        var d = JSON.parse(data.response)
        console.log(data.response);
        console.log(data.response.status);
        
        if(d.status == 'Success' ){
          this.form.video_name = d.video_name; 
          this.saveComplaint();
        }
        
        if( d.status== 'Failed' ){
          this.loading.dismiss();
          this.showSuccess("Uploading Failed!");
          
        }
        if( d.status == 'Wrong' ){
          this.loading.dismiss();
          this.showSuccess("Somthing went Wrong!");
        }
      
        
        // this.loading.dismissAll();
        this.flag_upload = true;
        // this.showToast('middle', 'Video is uploaded Successfully!');
      }, (err) => {
        // error
        console.log("vid err");
        console.log(JSON.stringify(err));
        
        alert('err'+ JSON.stringify(err));
      });
      // this.presentLoading();
      
      
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
    
    presentLoading() 
    {
      this.loading = this.loadingCtrl.create({
        content: "Please wait...",
        dismissOnPageChange: true
      });
      this.loading.present();
    }
    
    
    get_states() {
      // this.serve.presentLoading()
      this.serve.addData({}, "AppCustomerNetwork/getWorkingStates")
      .then(resp => {
        if (resp['statusCode'] == 200) {
          this.serve.dismissLoading()
          this.stateList = resp['state_list'];
        } else {
          this.serve.dismissLoading()
          this.serve.errorToast(resp['statusMsg']);
        }
      }, error => {
        this.serve.Error_msg(error);
        this.serve.dismiss();
      })
    }
    
    get_district(state) {
      this.serve.addData({ "state_name":state }, "AppCustomerNetwork/getDistrict")
      .then(resp => {
        if(resp['statusCode'] == 200){
          this.districtList = resp['district_list'];    
        }else{
          this.serve.errorToast(resp['statusMsg']);
        }
      },
      err => {
        this.serve.errorToast('Something Went Wrong!')
      })
    }
    
    
    
    
  }