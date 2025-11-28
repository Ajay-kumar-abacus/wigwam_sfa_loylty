import { Component, ViewChild } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { AlertController, IonicPage, Loading, LoadingController, ModalController, Events, NavController, NavParams, Platform } from 'ionic-angular';
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


@IonicPage()
@Component({
  selector: 'page-loyalty-home',
  templateUrl: 'loyalty-home.html',
})
export class LoyaltyHomePage {
  influencer_detail: any = {}
  loading: Loading;
  bannerURL: any;
  appbanner: any = [];
  qr_code: any = '';
  influencerUser: any = [];
  uploadurl: any = ''
  skLoading: any = true;
  filter: any = {};
  giftMasterList: any = [];
  contact: any = {}

  constructor(public navCtrl: NavController, public events: Events, public modalCtrl: ModalController,
    public storage: Storage, public alertCtrl: AlertController, private barcodeScanner: BarcodeScanner,
    public service: MyserviceProvider, public loadingCtrl: LoadingController, public db: DbserviceProvider,
    public constant: ConstantProvider, public navParams: NavParams, public platform: Platform,
    public openNativeSettings: OpenNativeSettings, public locationAccuracy: LocationAccuracy, public geolocation: Geolocation) {
    this.uploadurl = constant.upload_url1 + 'influencer_doc/';
    this.bannerURL = constant.upload_url1 + 'banner/';
  }

  ionViewWillEnter() {
    this.influencerDetail();
    this.contactDetails();
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
  pointRight: any = {};

  influencerDetail() {
    this.skLoading = true
    this.service.addData({ dr_id: this.constant.UserLoggedInData.id, type: this.constant.UserLoggedInData.type }, 'login/login_data').then((res) => {
      if (res['statusCode'] == 200) {
        this.skLoading = false
        this.influencer_detail = res['loginData']['login_data'];
        this.pointRight = res['loginData'];
        this.getGiftList('');
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


  Scaning() {
    const options: BarcodeScannerOptions = {
      prompt: ""
    };
    this.barcodeScanner.scan(options).then(resp => {
      this.qr_code = resp.text;
      if (resp.text != '') {
        this.service.presentLoading();
        this.service.addData({ 'coupon_code': this.qr_code, }, 'AppCouponScan/couponCodeScan').then((r: any) => {
          if (r['statusCode'] == 200 && r['bonus_point'] > 0) {
            this.service.successToast((r['coupon_point'] + r['bonus_point']) + " points has been added into your wallet");
            this.service.dismissLoading();
            setTimeout(() => {
              this.Scaning()
            }, 800);
          }
          else if (r['statusCode'] == 200) {
            this.service.successToast(r['coupon_point'] + " points has been added into your wallet");
            this.service.dismissLoading();
            setTimeout(() => {
              this.Scaning();
            }, 800);
          }
          else {
            this.service.dismissLoading();
            let Message = r['statusMsg']
            let alert = this.alertCtrl.create({
              enableBackdropDismiss: false,
              title: 'Alert !',
              message: Message,
              cssClass: 'alert-modal',
              buttons: [
                {
                  text: 'Cancel',
                  handler: () => {
                  }
                },
                {
                  text: 'Try Again',
                  handler: () => {
                    this.Scaning()
                  }
                }
              ]
            });
            alert.present();
          }
        }, err => {
          this.service.dismissLoading();
          this.service.Error_msg(err)
        });
      }
      else {
      }
    }, err => {
      console.log(err)
      this.service.dismissLoading()
      this.presentConfirm('Turn On Camera permisssion !', 'please go to <strong>Settings</strong> -> Camera to turn on <strong>Camera permission</strong>')
    })
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
  openSettings() {
    this.openNativeSettings.open("application_details")
  }

  goOnPointeListPage() {
    this.navCtrl.push(LoyaltyPointHistoryPage)
  }

  goToBonusPoint() {
    this.navCtrl.push(BonusPointPage)
  }
  goToSurvey() {
    this.navCtrl.push(SurveyListPage)
  }
  goToProfile() {
    this.navCtrl.push(LoyaltyProfilePage)
  }

  goToAbout() {
    this.navCtrl.push(LoyaltyAboutPage)
  }
  goToContact() {
    this.navCtrl.push(LoyaltyContactPage)
  }
  goToVideo() {
    this.navCtrl.push(LoyaltyVideoPage)
  }
  goToTracker() {
    this.navCtrl.push(LoyaltyGiftTrackerPage)
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
    if (this.giftMasterList.length == 0) {
      this.alertPresent("No Gift Available ")
      return
    }
    else if (this.giftMasterList.length == 1) {
      this.navCtrl.push(LoyaltyGiftGalleryDetailPage, { 'id': this.giftMasterList[0].id })
    } else {
      this.navCtrl.push(LoyaltyGiftGalleryPage)
    }
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
    this.navCtrl.push(LoyaltyCataloguePage)
  }

  goToSupport() {
    this.navCtrl.push(SupportListPage);
  }

  announcementModal() {
    this.navCtrl.push(AnnouncementNoticesListPage);
  }
  imageModal(src) {
    this.modalCtrl.create(ViewProfilePage, { "Image": src }).present();
  }

  goOnProductPage() {
    this.navCtrl.push(ProductsPage, { 'mode': 'home' });
  }

}