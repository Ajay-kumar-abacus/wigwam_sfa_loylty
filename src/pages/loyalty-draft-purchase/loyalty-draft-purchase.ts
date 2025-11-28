import { Component } from '@angular/core';
import { ActionSheetController, AlertController, IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ConstantProvider } from '../../providers/constant/constant';
import { Device } from '@ionic-native/device';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';

declare let cordova: any;


/**
 * Generated class for the LoyaltyDraftPurchasePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-loyalty-draft-purchase',
  templateUrl: 'loyalty-draft-purchase.html',
})
export class LoyaltyDraftPurchasePage {
  saveFlag: boolean = false;
  today_date = new Date().toISOString()
  max_date = new Date().getFullYear() + 1;
  data: any = {};
  spinner: boolean = false
  selImages: any = [];
  uploadurl: any
  userId: any;
  lang: any = 'en'
  cart_data: any = []
  user_data: any = {};
  percentage: any;



  constructor(public navCtrl: NavController, public storage: Storage, public diagnostic: Diagnostic, private camera: Camera, public navParams: NavParams, public serve: MyserviceProvider, public actionSheetController: ActionSheetController, public constant: ConstantProvider
    , public alertCtrl: AlertController, public toastCtrl: ToastController, public Device: Device, public translate: TranslateService,) {

    this.translate.setDefaultLang(this.lang);
    this.translate.use(this.lang);

    this.uploadurl = constant.influencer_doc;
    this.userId = this.navParams.get("userId");
    this.cart_data = this.navParams.get("cart_data");
    this.user_data = this.navParams.get("user_data");
    console.log(this.user_data)
    this.membershipCheckFlag();

    //  this.data=this.navParams.get("data");

    console.log(this.cart_data)

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoyaltyDraftPurchasePage');
  }

  membershipCheckFlag() {
    this.serve.presentLoading();
    this.serve.addData({}, 'RetailerRequest/membershipCheckFlag').then((result) => {
      if (result['statusCode'] == 200) {
        this.percentage = result['result'];
       
        this.serve.dismissLoading();
      }
      else {
        this.serve.errorToast(result['statusMsg']);
        this.serve.dismissLoading();
      }
    });
  }

  submit() {

    //   if(!this.selImages.length){
    //     let alert = this.alertCtrl.create({
    //       title: 'Alert',
    //       subTitle: "Upload Bill Image Is Required!",
    //       cssClass: 'alert-modal',

    //       buttons: [{
    //         text: 'Ok',
    //         role: 'cancel',
    //         handler: () => {

    //         }
    //       }
    //     ]
    //   });
    //   alert.present();
    //   return;

    // }

    let alert = this.alertCtrl.create({
      title: 'Save Purchase',
      message: 'Do you want to Submit Purchase?',
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


            this.spinner = true;
            this.saveFlag = true;
            // this.data.part = this.add_list;
            console.log(this.data.part)
            // First, calculate the base points
            let calculatedPoint = this.data.part.map(row => row.influencer_point * parseInt(row.qty));
            let basePoints = calculatedPoint.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

            // Now add the membership bonus
            let membershipBonus = this.percentage ? this.percentage / 100 : 0;

            
            this.data.transfer_point = basePoints * (1 + membershipBonus);
            if (this.constant.UserLoggedInData.loggedInUserType == 'Employee') {
              this.data.employee_id = this.userId;
              this.data.influencer_id = this.data.contractor_id.id;
              this.data.influencer_type = this.data.contractor_id.type;

            }
            else {
              this.data.influencer_id = this.constant.UserLoggedInData.id;
              this.data.influencer_type = this.constant.UserLoggedInData.type;

            }


            this.data.dealer_mobile = this.data.dealer_id.mobile;
            this.data.dealer_name = this.data.dealer_id.company_name;
            this.data.dealer_id = this.data.dealer_id.id;



            this.data.image = this.selImages ? this.selImages : [];
            this.serve.addData({ 'data': this.data }, 'RetailerRequest/add_retailer_request').then((result) => {

              if (result['statusCode'] == 200) {
                if (result['statusMsg'] == 'Success') {
                  this.spinner = false
                  this.serve.successToast(result['statusMsg']);
                  // this.navCtrl.popTo(LoyaltyPurchaseListPage);
                }

              } else {
                this.spinner = false
                this.serve.dismissLoading();
                this.serve.errorToast(result['statusMsg'])
              }
            }, err => {
              this.spinner = false
              this.serve.dismissLoading();
              this.serve.errorToast('Something went wrong')
            });


          }
        }

      ]
    });
    alert.present();

  }


  MobileNumber(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
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


          this.takeDocPhoto();
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
          this.data.img_id = this.data.id;




        }
      }
      ]
    });
    actionsheet.present();
  }
  // takePhoto() {
  //   const options: CameraOptions =
  //   {
  //     quality: 70,
  //     destinationType: this.camera.DestinationType.DATA_URL,
  //     targetWidth: 500,
  //     targetHeight: 400,
  //     cameraDirection: 1,
  //     correctOrientation: true
  //   }
  //   this.camera.getPicture(options).then((imageData) => {
  //     this.data.img_id = '';

  //     this.data.image = 'data:image/jpeg;base64,' + imageData;
  //     console.log(this.image);
  //     this.image_data.push({"image":this.data.image});
  //     console.log(this.image_data,'pushh')
  //     this.data.image= this.image_data;
  //     console.log(this.image)
  //     this.image='';

  //     // if (this.image) {
  //     //   console.log(this.image)
  //     //   this.fileChange(this.image);
  //     // }
  //   },
  //   (err) => {
  //   });
  // }

  takeDocPhoto() {

    this.diagnostic.requestCameraAuthorization().then((isAvailable: any) => {

      const options: CameraOptions = {
        quality: 75,
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth: 1050,
        targetHeight: 1000
      }

      console.log(options);
      if (this.Device.platform == 'Android') {
        cordova.plugins.foregroundService.start('Wigwam App', 'Camera Service');
      }
      this.camera.getPicture(options).then((imageData) => {
        this.data.image = 'data:image/jpeg;base64,' + imageData;

        if (this.Device.platform == 'Android') {
          cordova.plugins.foregroundService.stop();
        }

        this.selImages.push({ "image": this.data.image });
        this.data.images = this.selImages;
        console.log(this.data, 'line number 309');

        this.data.image = '';
      }, (err) => {
        if (this.Device.platform == 'Android') {
          cordova.plugins.foregroundService.stop();
        }

      });



    }).catch((error: any) => {

    });

  }
  getImage() {
    this.diagnostic.requestCameraAuthorization().then((isAvailable: any) => {
      const options: CameraOptions =
      {
        quality: 70,
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        saveToPhotoAlbum: false,
        cameraDirection: 1,
        correctOrientation: true
      }
      if (this.Device.platform == 'Android') {

        cordova.plugins.foregroundService.start('Wigwam App', 'Camera Service');
      }
      this.camera.getPicture(options).then((imageData) => {
        this.data.image = 'data:image/jpeg;base64,' + imageData;
        if (this.Device.platform == 'Android') {
          cordova.plugins.foregroundService.stop();
        }

        this.selImages.push({ "image": this.data.image });
        this.data.images = this.selImages;

        this.data.image = '';



      }, (err) => {
        if (this.Device.platform == 'Android') {
          cordova.plugins.foregroundService.stop();
        }


      });
    }).catch((error: any) => {

    });
  }


  old_img: any = []
  // fileChange(img) {
  //   // this.image_data=[];
  //   console.log(this.image_data)

  //   this.image_data.push({'image':img});
  //   console.log(this.image_data)

  //   this.image = '';
  // }

  remove_image(i: any) {
    this.selImages.splice(i, 1);
  }

  showLimit() {
    let alert = this.alertCtrl.create({
      title: 'Alert',
      subTitle: "You can upload only 6 bill images",
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

  listdelete(index) {
    // this.add_list.splice(index, 1);
    // this.serve.errorToast("Deleted");
    // if(this.add_list.length==0){
    //   this.image_data=[];
    // }
  }



  // goBackWithData() {
  //   this.navCtrl.navigateBack('/page-a', {
  //     state: {
  //       feedback: 'Success',
  //       message: 'Product added successfully!',
  //     },
  //   });
  // }


}
