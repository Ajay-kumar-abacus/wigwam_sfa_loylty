import { Component, ViewChild } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Storage } from '@ionic/storage';
import { ActionSheetController, AlertController, App, Events, IonicPage, Loading, LoadingController, ModalController, Nav, NavController, NavParams, } from 'ionic-angular';
import { ConstantProvider } from '../../../providers/constant/constant';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { MyserviceProvider } from '../../../providers/myservice/myservice';
import { RegistrationPage } from '../../login-section/registration/registration';
import { SelectRegistrationTypePage } from '../../select-registration-type/select-registration-type';
import { Diagnostic } from '@ionic-native/diagnostic';
import { TranslateService } from '@ngx-translate/core';
import * as jwt_decode from "jwt-decode";
import OneSignal from 'onesignal-cordova-plugin';


/**
* Generated class for the LoyaltyProfilePage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-loyalty-profile',
  templateUrl: 'loyalty-profile.html',
})


export class LoyaltyProfilePage {

  @ViewChild(Nav) nav: Nav;
  karigar_detail: any = {};
  loading: Loading;
  edit: any = '';
  edit1: any = '';
  lang: any = 'en';
  upload_url: any = ''
  tokenInfo: any = {};
  constructor(public diagnostic: Diagnostic,public navCtrl: NavController, public app: App, public navParams: NavParams, public service: MyserviceProvider, public loadingCtrl: LoadingController, public storage: Storage, public events: Events, public actionSheetController: ActionSheetController, private camera: Camera, public alertCtrl: AlertController, public modalCtrl: ModalController, public db: DbserviceProvider, private socialSharing: SocialSharing, public constant: ConstantProvider,public  translate:TranslateService) {
    this.upload_url = constant.influencer_doc;
    this.translate.setDefaultLang(this.lang);
    this.translate.use(this.lang);
    this.get_user_lang()

    this.getKarigarDetail();
  }


  title: any = ""
  no: any = ""
  yes: any = ""
  content: any = ""


  logout() {
    let alert = this.alertCtrl.create({
      title: 'Logout!',
      message: 'Are you sure you want Logout?',
      buttons: [
        {
          text: 'No',
          handler: () => {
          }
        },
        {
          text: 'Yes',
          handler: () => {
            OneSignal.logout();
            this.storage.set('onesignaltoken', '');
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
            this.service.successToast(" Logout Successfully ");
            this.navCtrl.setRoot(SelectRegistrationTypePage);

          }
        }
      ]
    })

    alert.present();

  }



  cam: any = "";
  gal: any = "";
  cancl: any = "";
  ok: any = "";
  upl_file: any = "";
  save_succ: any = "";
  sales_User_detail:any={};
  ionViewDidLoad() {
    this.cam = "Camera"
    this.gal = "Gallery"
    this.cancl = "Cancel"
    this.ok = "OK"
    this.upl_file = "Upload File"
    this.save_succ = "Registered Successfully"
  }

  ionViewWillEnter() {
  }
  language: any = [];
  getKarigarDetail() {
    this.service.presentLoading();
    this.service.addData({}, 'AppInfluencer/influencerDetail').then((result) => {
      if (result['statusCode'] == 200) {
        this.karigar_detail = result['detail'];
        

        this.service.dismissLoading();
      }
      else {
        this.service.errorToast(result['statusMsg']);
        this.service.dismissLoading();
      }
    }, error => {
      this.service.Error_msg(error);
      this.service.dismissLoading();
    });
  }

  openeditprofile() {
    let actionsheet = this.actionSheetController.create({
      title: "Profile photo",
      cssClass: 'cs-actionsheet',

      buttons: [{
        cssClass: 'sheet-m',
        text: this.cam,
        icon: 'camera',
        handler: () => {
          this.takePhoto();
        }
      },
      {
        cssClass: 'sheet-m1',
        text: this.gal,
        icon: 'image',
        handler: () => {
          this.getImage();
        }
      },
      {
        cssClass: 'cs-cancel',
        text: this.cancl,
        role: 'cancel',
        handler: () => {
        }
      }]
    });
    actionsheet.present();
  }
  takePhoto() {
    this.diagnostic.requestCameraAuthorization().then((isAvailable: any) => {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 500,
      targetHeight: 400,
      cameraDirection: 1,
      correctOrientation: true
    }

    this.camera.getPicture(options).then((imageData) => {
      this.karigar_detail.profile = 'data:image/jpeg;base64,' + imageData;
      if (this.karigar_detail.profile) {
        this.uploadImage(this.karigar_detail.profile);
      }
    }, (err) => {
    });
  }).catch((error: any) => {
   
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
    this.camera.getPicture(options).then((imageData) => {
      this.karigar_detail.profile = 'data:image/jpeg;base64,' + imageData;
      if (this.karigar_detail.profile) {
        this.uploadImage(this.karigar_detail.profile);
      }
    }, (err) => {
    });
  }).catch((error: any) => {
   
  });
  }
  uploadImage(profile) {
    this.service.addData({ 'profile': profile }, 'AppInfluencer/updateProfilePic').then((r) => {
      if (r['statusCode'] == 200) {
        this.service.successToast(r['statusMsg'])
        this.getKarigarDetail()
      } else {
        this.service.errorToast(r['statusMsg'])
      }
    });
  }

  ref_code: any = "";
  ShareApp() {
    if (this.karigar_detail.referral_code != "") {
      this.ref_code = ' and use my Code *' + this.karigar_detail.referral_code + '* to get points back in your wallet'
    }
    this.socialSharing.share('Hey There ! here is an awesome app Wigwam Ply   ..Give it a try market://details?id=com.basiq.wigwamply&hl=en' + this.ref_code).then(() => {
    }).catch((e) => {
      this.service.errorToast('Something Went wrong , Please Try Again Later')
    });
  }

  updateProfile(edit_type) {
    this.karigar_detail.edit_profile = 'edit_profile';
    this.karigar_detail.edit_type = edit_type;

    this.navCtrl.push(RegistrationPage, { 'data': this.karigar_detail, "mode": 'edit_page', })
  }


  MobileNumber(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }


  get_user_lang() {
    this.storage.get("token")
      .then(resp => {
        this.tokenInfo = this.getDecodedAccessToken(resp);
        console.log(this.tokenInfo)

        this.service.addData({ "login_id": this.tokenInfo.id }, 'Login/userLanguage').then(result => {
          if (result['statusCode'] == 200) {
            this.lang = result['result']['app_language'];
            if (this.lang == "") {
              this.lang = "en";
            }
            this.translate.use(this.lang);
          }
          else {
            this.service.errorToast(result['statusMsg']);
            this.service.dismissLoading();
          }
        })
      })
  }


  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    }
    catch (Error) {
      return null;
    }
  }


}
