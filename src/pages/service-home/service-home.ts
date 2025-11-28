import { Component } from '@angular/core';
import { AlertController, Events, IonicPage, LoadingController, ModalController, NavController, NavParams, Platform } from 'ionic-angular';
import { ComplaintHistoryPage } from '../complaints/complaint-history/complaint-history';
import { InstallationListPage } from '../installation/installation-list/installation-list';
import { SparePage } from '../spare/spare';
import { LoyaltyProfilePage } from '../loyalty/loyalty-profile/loyalty-profile';
import { LoyaltyAboutPage } from '../loyalty/loyalty-about/loyalty-about';
import { LoyaltyContactPage } from '../loyalty/loyalty-contact/loyalty-contact';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { ConstantProvider } from '../../providers/constant/constant';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { AnnouncementNoticesListPage } from '../announcement-notices-list/announcement-notices-list';
import { ViewProfilePage } from '../view-profile/view-profile';
import { Storage } from '@ionic/storage';
import { ServiceInvoicePage } from '../service-invoice/service-invoice';


@IonicPage()
@Component({
  selector: 'page-service-home',
  templateUrl: 'service-home.html',
})
export class ServiceHomePage {
  
  influencer_detail: any = {}
  loading: any;
  bannerURL: any;
  appbanner: any = [];
  qr_code: any = '';
  influencerUser: any = [];
  uploadurl: any = ''
  skLoading: any = true;
  filter: any = {};
  giftMasterList: any = [];
  contact: any = {}
  
  constructor(public navCtrl: NavController, public events: Events, public modalCtrl: ModalController, public alertCtrl: AlertController,
    public service: MyserviceProvider, public loadingCtrl: LoadingController, public db: DbserviceProvider,public storage: Storage,
    public constant: ConstantProvider, public navParams: NavParams, public platform: Platform,
    public openNativeSettings: OpenNativeSettings,) {
      this.uploadurl = constant.upload_url1 + 'influencer_doc/';
      this.bannerURL = constant.upload_url1 + 'banner/';
    }
    
    ionViewWillEnter() {
      this.influencerDetail();
    }
    
    doRefresh(refresher) {
      this.influencerDetail();
      refresher.complete();
    }
    
    influencerDetail() {
      this.skLoading = true
      this.service.addData({ dr_id: this.constant.UserLoggedInData.id, type: this.constant.UserLoggedInData.type }, 'login/login_data').then((res) => {
        if (res['statusCode'] == 200) {
          this.skLoading = false
          this.influencer_detail = res['loginData']['login_data'];          
        } else {
          this.skLoading = false
          this.service.errorToast(res['statusMsg'])
        }
      }, err => {
      })
    }
    
    openSettings() {
      this.openNativeSettings.open("application_details")
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
    
    imageModal(src) {
      this.modalCtrl.create(ViewProfilePage, { "Image": src }).present();
    }
    
    announcementModal() {
      this.navCtrl.push(AnnouncementNoticesListPage);
    }
    goToComplaint() {
      this.navCtrl.push(ComplaintHistoryPage)
    }
    
    goToSpare() {
      this.navCtrl.push(SparePage)
    }

    goToInvoice() {
      this.navCtrl.push(ServiceInvoicePage)
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
  }
  