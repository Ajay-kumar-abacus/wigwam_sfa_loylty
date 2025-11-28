import { Component, ViewChild } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { AlertController, IonicPage, Loading, LoadingController, ModalController, Events, NavController, NavParams, Platform, Nav,  } from 'ionic-angular';
import { ConstantProvider } from '../../../providers/constant/constant';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { MyserviceProvider } from '../../../providers/myservice/myservice';
import { BonusPointPage } from '../../bonus-point/bonus-point';
import { LoyaltyCataloguePage } from '../../loyalty-catalogue/loyalty-catalogue';
import { LoyaltyEnterCouponCodePage } from '../../loyalty-enter-coupon-code/loyalty-enter-coupon-code';
import { SupportListPage } from '../../support-list/support-list';
import { SurveyListPage } from '../../survey/survey-list/survey-list';
import { LoyaltyAboutPage } from '../loyalty-about/loyalty-about';
import { LoyaltyContactPage } from '../loyalty-contact/loyalty-contact';
import { LoyaltyGiftGalleryPage } from '../loyalty-gift-gallery/loyalty-gift-gallery';
import { LoyaltyGiftTrackerPage } from '../loyalty-gift-tracker/loyalty-gift-tracker';
import { LoyaltyPointHistoryPage } from '../loyalty-point-history/loyalty-point-history';
import { LoyaltyProfilePage } from '../loyalty-profile/loyalty-profile';
import { LoyaltyVideoPage } from '../loyalty-video/loyalty-video';
import { SiteListPage } from '../site-list/site-list';
import { Storage } from '@ionic/storage';
import { SelectRegistrationTypePage } from '../../select-registration-type/select-registration-type';
import { IonicSelectableComponent } from 'ionic-selectable';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Geolocation } from '@ionic-native/geolocation';
import { AnnouncementNoticesListPage } from '../../announcement-notices-list/announcement-notices-list';
import { ViewProfilePage } from '../../view-profile/view-profile';
import { ProductsPage } from '../../products/products';
import { LoyaltyGiftGalleryDetailPage } from '../loyalty-gift-gallery-detail/loyalty-gift-gallery-detail';
import { ComplaintHistoryPage } from '../../complaints/complaint-history/complaint-history';
import { InstallationListPage } from '../../installation/installation-list/installation-list';
import { SparePage } from '../../spare/spare';
import { LoyaltyPurchaseListPage } from '../../loyalty-purchase-list/loyalty-purchase-list';
import { LoyaltyFaqPage } from '../../loyalty-faq/loyalty-faq';
import { SpinWheelPage } from '../../spin-wheel/spin-wheel';
import { Super30Page } from '../../super30/super30';
import { TranslateService } from '@ngx-translate/core';
import { LoyaltyLanguagePage } from '../../loyalty-language/loyalty-language';
import * as jwt_decode from "jwt-decode";
import zingchart from 'zingchart'
import { LoyaltyMenuPage } from '../../loyalty-menu/loyalty-menu';
import OneSignal from 'onesignal-cordova-plugin';







@IonicPage()
@Component({
  selector: 'page-loyalty-home',
  templateUrl: 'loyalty-home.html',
})
export class LoyaltyHomePage {
  @ViewChild(Nav) nav: Nav;

  influencer_detail: any = {}
  loading: Loading;
  bannerURL: any;
  appbanner: any = [];
  qr_code: any = '';
  influencerUser: any = [];
  uploadurl: any = ''
  skLoading: any = true;
  toggle:boolean = false;


  filter: any = {};
  giftMasterList: any = [];
  contact: any = {}
  lang:any='en';

  bonus_point: number = 7;
  Scan_point: number = 9;
  referral_point: number = 6;
  DigitalReport: any = {};
  influencer_top_rank: any = {}
  notificationToken: any;
  currentStep: number;
  mileStone: any;

  





  constructor(public navCtrl: NavController, public events: Events, public modalCtrl: ModalController,
    public storage: Storage, public alertCtrl: AlertController, private barcodeScanner: BarcodeScanner,
    public service: MyserviceProvider, public loadingCtrl: LoadingController, public db: DbserviceProvider,
    public constant: ConstantProvider, public navParams: NavParams, public platform: Platform,
    public openNativeSettings: OpenNativeSettings, public locationAccuracy: LocationAccuracy, public geolocation: Geolocation,public  translate:TranslateService,) {
    this.uploadurl = constant.upload_url1 + 'influencer_doc/';
    this.bannerURL = constant.upload_url1 + 'banner/';
    this.toggle = this.navParams.get("toggle");

  }

  ionViewWillEnter() {
    this.influencerDetail();
    this.contactDetails();
    this.plyExpertMileStone();
    this.translate.setDefaultLang(this.lang);
    this.translate.use(this.lang);
    this.get_user_lang();
    this.getdigitalReport()

    this.platform.ready().then(() => {
      this.storage.get('onesignaltoken').then((val) => {
          console.log(val, 'this is one signal token');
          this.notificationToken = val;
      });
      setTimeout(() => {
          this.OneSignalInit();
      }, 1500);
  })
    
       
    zingchart.TOUCHZOOM = 'pinch';
    

  }


  getdigitalReport() {
      let apiName = 'AppDashboard/stage_level_wise_enquirycount';
      
      this.service.addData({}, apiName).then((response) => {
        if (response['statusCode'] == 200) {
          this.DigitalReport = response['result'];
          console.log(this.DigitalReport);
    
          let DigitalPieChart: any = {
            type: 'ring',
            backgroundColor: '#fff',
    
            plot: {
              tooltip: {
                backgroundColor: '#000',
                borderWidth: '0px',
                fontSize: '10px',
                sticky: true,
                thousandsSeparator: ',',
              },
              valueBox: {
                type: 'all',
                text: '%npv%',
                placement: 'in',
                fontSize: '8px'
              },
              animation: {
                effect: 2,
                sequence: 4,
                speed: 1000
              },
              backgroundColor: '#FBFCFE',
              borderWidth: '0px',
              slice: 40,
            },
            plotarea: {
              margin: '0px',
              backgroundColor: 'transparent',
              borderRadius: '10px',
              borderWidth: '0px',
            },
    
            series: [
              {
                text: 'wallet',
                values: [this.pointRight.wallet_point],
                backgroundColor: '#007abb',
                lineColor: '#007abb',
                lineWidth: '1px',
                marker: {
                  backgroundColor: '#007abb',
                },
              },
              {
                text: 'InProcess',
                values: [this.pointRight.total_points_earned],
                backgroundColor: '#ff9b00',
                lineColor: '#ff9b00',
                lineWidth: '1px',
                marker: {
                  backgroundColor: '#ff9b00',
                },
              },
              {
                text: 'Win',
                values: [this.pointRight.total_reward_point],
                backgroundColor: '#008000',
                lineColor: '#008000',
                lineWidth: '1px',
                marker: {
                  backgroundColor: '#008000',
                },
              },
              {
                text: 'Lost',
                values: [this.pointRight.total_redeemed_points],
                backgroundColor: '#FF00FF',
                lineColor: '#FF00FF',
                lineWidth: '1px',
                marker: {
                  backgroundColor: '#FF00FF',
                },
              },
             
            
            ],
            noData: {
              text: 'No Selection',
              alpha: 0.6,
              backgroundColor: '#20b2db',
              bold: true,
              fontSize: '10px',
              textAlpha: 0.9,
            },
          };
    
          DigitalPieChart.gui = { contextMenu: { visible: false } };
          zingchart.render({ id: 'DigitalPieChart', data: DigitalPieChart, height: 250 });
        } else {
          // Handle errors
        }
      }, (error) => {
        this.service.Error_msg(error);
        this.service.dismissLoading();
      });
    }



 




  doRefresh(refresher) {
    this.influencerDetail();
    refresher.complete();
  }


  contactDetails() {
    this.service.presentLoading();
    this.service.addData({}, 'AppContactUs/contactDetail').then((result) => {
      if (result['statusCode'] == 200) {
        this.contact = result['contact_detail'];
        
        this.service.dismissLoading();
      }
      else {
        this.service.errorToast(result['statusMsg']);
        this.service.dismissLoading();
      }
    });
  }

  isActive(step: number): boolean {
    return step <= this.currentStep;
  }
  
  isCurrent(step: number): boolean {
    return step === this.currentStep;
  }

  viewDetails() {
    // Navigate to points details page
    this.navCtrl.push(LoyaltyPointHistoryPage,{'lang':this.lang })
  }
  pointRight: any = {};

  influencerDetail() {
    this.skLoading = true
    this.service.addData({ dr_id: this.constant.UserLoggedInData.id, type: this.constant.UserLoggedInData.type }, 'login/login_data').then((res) => {
      if (res['statusCode'] == 200) {
        this.skLoading = false
        this.influencer_detail = res['loginData']['login_data'];
        this.influencer_top_rank = res['loginData']['Top_rank_leader_board'];

        this.pointRight = res['loginData'];
        // this.getGiftList('');
        this.tokenupdateinDB()

      } else {
        this.skLoading = false
        this.service.errorToast(res['statusMsg'])
      }
      if (this.pointRight.login_status == 'Inactive') {
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
        this.navCtrl.setRoot(SelectRegistrationTypePage);
      }
      this.bannerDetail();


     

    }, err => {
    })
  }



  plyExpertMileStone() {
    // this.service.presentLoading();
    this.service.addData({}, 'RetailerRequest/plyExpertMileStone').then((result) => {
      if (result['statusCode'] == 200) {
        this.mileStone = result['result'];
        this.currentStep =this.mileStone.level;
        console.log( this.mileStone,"line 711")
       
       
        // this.service.dismissLoading();
      }
      else {
        this.service.errorToast(result['statusMsg']);
        this.service.dismissLoading();
      }
    });
  }

  bannerDetail() {
    this.service.addData({}, 'AppInfluencer/bannerList').then((result) => {
      if (result['statusCode'] == 200) {
        this.appbanner = result['banner_list'];
      }
      else {
        this.service.errorToast(result['statusMsg']);
      }
    });
  }

  getGiftList(search) {
    this.filter.limit = 50;
    this.filter.start = 0;
    this.filter.search = search;
    this.filter.redeemable = '';
    // this.service.presentLoading();
    this.service.addData({ 'filter': this.filter }, 'AppGiftGallery/giftGalleryList').then((result) => {
      if (result['statusCode'] == 200) {
        this.giftMasterList = result['gift_master_list'];
      }
      else {
        this.service.errorToast(result['statusMsg']);
      }
    }, error => {
      this.service.Error_msg(error);
    });
  }


 


  goTopurchaselist() {
    // if(this.influencer_detail.status=='Pending'){
    //   this.alertPresent("Your current profile status is  <strong class=Pending>“Pending”</strong>. You can see the Purchase only if your profile status is <strong class=Approved>“Approved”</strong>. To know more, you can call us at ",)

    //   return

    // }

    // else if (this.influencer_detail.status == 'Reject') {
    //   this.alertPresent("Your current profile status is  <strong class=Reject>“Reject”</strong>. You can see the Purchase only if your profile status is <strong class=Approved>“Approved”</strong>. To know more, you can call us at ");

    //   return
    // }

    // else if (this.influencer_detail.status == 'Suspect') {
    //   this.alertPresent("Your current profile status is  <strong class=Suspect>“Suspect”</strong>. You can see the Purchase only if your profile status is <strong class=Approved>“Approved”</strong>. To know more, you can call us at ")

    //   return
    // }
    // else if(this.influencer_detail.status=='Approved'){
    // }

    this.navCtrl.push(LoyaltyPurchaseListPage,{'type':this.influencer_detail.type,'login_data':this.influencer_detail,'lang':this.lang })

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


  alertPresent(msg) {
    let alert = this.alertCtrl.create({
      title: '',
      subTitle: msg + `<a href=tel:${this.contact.contact_number}>${this.contact.contact_number}</a>`,
      buttons: [
        {
          text: 'Okay',
          handler: () => {
          }
        }
      ]
    });
    alert.present();
  }




  toggleValue(value){
    if(value == 'false'){
      this.toggle = true;  
    }
    else{
        this.toggle = false;  
    }
}
  openSettings() {
    this.openNativeSettings.open("application_details")
  }

  goOnPointeListPage() {
    this.navCtrl.push(LoyaltyPointHistoryPage,{'lang':this.lang })
  }

  goToHome() {
    this.navCtrl.push(LoyaltyHomePage, { "lang": this.lang })
  }

  goToBonusPoint() {
    this.navCtrl.push(BonusPointPage,{'lang':this.lang })
  }
  goToSurvey() {
    this.navCtrl.push(SurveyListPage,{'lang':this.lang })
  }


  goOnfaqPage() {
    this.navCtrl.push(LoyaltyFaqPage,{"lang":this.lang})
  }
  goToProfile() {
    this.navCtrl.push(LoyaltyProfilePage,{'lang':this.lang })
  }

  goToMenu() {
    this.navCtrl.push(LoyaltyMenuPage,{'lang':this.lang })
  }

  goToAbout() {
    this.navCtrl.push(LoyaltyAboutPage,{'lang':this.lang })
  }
  goToContact() {
    this.navCtrl.push(LoyaltyContactPage,{'lang':this.lang })
  }
  goToVideo() {
    this.navCtrl.push(LoyaltyVideoPage,{'lang':this.lang })
  }
  goToTracker() {
    this.navCtrl.push(LoyaltyGiftTrackerPage,{'lang':this.lang })
  }

  goToComplaint() {
    this.navCtrl.push(ComplaintHistoryPage)
  }
  
  goToInstallation() {
    this.navCtrl.push(InstallationListPage)
  }
  goToSpare() {
    this.navCtrl.push(SparePage)
  }

  goSiteListPage(moduleName, scanRight, pointsRight, type) {
    this.navCtrl.push(SiteListPage, { 'userType': "Influencer", 'moduleName': moduleName, 'scanRight': scanRight, 'type': type, 'pointsRight': pointsRight })
  }

  goToGift() {
    if (this.influencer_detail.status == 'Pending') {
      this.alertPresent("Your current profile status is  <strong class=Pending>“Pending”</strong>. You can see the Redeem Points only if your profile status is <strong class=Approved>“Approved”</strong>. To know more, you can call us at ",)
      return
    }
    else if (this.influencer_detail.status == 'Reject') {
      this.alertPresent("Your current profile status is  <strong class=Reject>“Reject”</strong>. You can see the gift gallery only if your profile status is <strong class=Approved>“Approved”</strong>. To know more, you can call us at ");
      return;
    }
    else {
      this.alertPresent("Your current profile status is  <strong class=Suspect>“Suspect”</strong>. You can see the Redeem Points only if your profile status is <strong class=Approved>“Approved”</strong>. To know more, you can call us at ")
      return
    }

  }

  goToDetail() {
   
      this.navCtrl.push(LoyaltyGiftGalleryPage,{'lang':this.lang })
  }


  goToCoupon() {
    if (this.influencer_detail.status == 'Pending') {
      this.alertPresent("Your current profile status is  <strong class=Pending>“Pending”</strong>. You can only enter the coupon codes when your profile status is <strong class=Approved>“Approved”</strong>. To know more, you can call us at ")
      return
    }

    else if (this.influencer_detail.status == 'Reject') {
      this.alertPresent("Your current profile status is  <strong class=Reject>“Reject”</strong>. You can only enter the coupon codes when your profile status is <strong class=Approved>“Approved”</strong>. To know more, you can call us at ")
      return
    }
    else if (this.influencer_detail.status == 'Suspect') {
      this.alertPresent("Your current profile status is  <strong class=Suspect>“Suspect”</strong>. You can only enter the coupon codes when your profile status is <strong class=Approved>“Approved”</strong>. To know more, you can call us at ")
      return
    }
    else {
      this.navCtrl.push(LoyaltyEnterCouponCodePage, { 'type': '' })
    }
  }

  goOnDigitalcatPage() {
    this.navCtrl.push(LoyaltyCataloguePage,{'lang':this.lang })
  }

  goToSupport() {
    this.navCtrl.push(SupportListPage,{'lang':this.lang });
  }


  goTospin() {
    this.navCtrl.push(SpinWheelPage,{'lang':this.lang })
  }

  Super30Page() {
    this.navCtrl.push(Super30Page,{'lang':this.lang });
  }

  announcementModal() {
    this.navCtrl.push(AnnouncementNoticesListPage);
  }
  imageModal(src) {
    this.modalCtrl.create(ViewProfilePage, { "Image": src }).present();
  }

  goOnProductPage() {
    this.navCtrl.push(ProductsPage, { 'mode': 'home','lang':this.lang  });
  }

  gotoChangeLang(){
    this.navCtrl.push(LoyaltyLanguagePage, {"mode": 'edit_page' ,'lang':this.lang })
  }


  tokenInfo:any={};
get_user_lang()
{
  this.storage.get("token")
  .then(resp=>{
    this.tokenInfo = this.getDecodedAccessToken(resp );
    console.log(this.tokenInfo)
    
    this.service.addData({"login_id":this.tokenInfo.id}, 'Login/userLanguage').then(result => {
      if (result['statusCode'] == 200) {
        this.lang = result['result']['app_language'];
        if(this.lang == "")
        {
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
  try{
    return jwt_decode(token);
  }
  catch(Error){
    return null;
  }
}


OneSignalInit(): void {
  OneSignal.logout()
  setTimeout(() => {

      OneSignal.initialize("8f9d7bb2-b26f-44a1-831d-b4f36379645d"); //this is onesignal app id
      // a10715f5-690e-4dd7-bb64-feae818938e4
      console.log(this.notificationToken, '415');

      if (this.notificationToken) {
          console.log('====================================');
          console.log('updating token');
          console.log('====================================');
          OneSignal.login(this.notificationToken)
      }
      let self = this;
      let myClickListener = async function (event) {
          let notificationData = event;
          console.log('====================================');
          console.log(notificationData);
          //   self.Gotopage(notificationData)
          let page = notificationData.notification.additionalData.page
          let params = notificationData.notification.additionalData
          self.nav.push(page, params);
          console.log('====================================');
      };
      OneSignal.Notifications.addEventListener("click", myClickListener);
      OneSignal.Notifications.requestPermission(true)
  }, 300);
}



tokenupdateinDB(){
  if (this.notificationToken) {
    this.service.addData({"unique_token":this.notificationToken,'influencer_id':this.constant.UserLoggedInData.id}, 'AppInfluencer/updateUnique_token').then(result => {
     console.log(result);
    })
    
  }


}

}