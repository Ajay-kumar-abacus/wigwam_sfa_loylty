import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoyaltyFaqPage } from '../loyalty-faq/loyalty-faq';
import { LoyaltyProfilePage } from '../loyalty/loyalty-profile/loyalty-profile';
import { LoyaltyAboutPage } from '../loyalty/loyalty-about/loyalty-about';
import { LoyaltyContactPage } from '../loyalty/loyalty-contact/loyalty-contact';
import { LoyaltyLanguagePage } from '../loyalty-language/loyalty-language';
import { SpinWheelPage } from '../spin-wheel/spin-wheel';
import { LoyaltyVideoPage } from '../loyalty/loyalty-video/loyalty-video';
import { LoyaltyGiftTrackerPage } from '../loyalty/loyalty-gift-tracker/loyalty-gift-tracker';
import { Super30Page } from '../super30/super30';
import { SupportListPage } from '../support-list/support-list';
import { LoyaltyGiftGalleryDetailPage } from '../loyalty/loyalty-gift-gallery-detail/loyalty-gift-gallery-detail';
import { LoyaltyGiftGalleryPage } from '../loyalty/loyalty-gift-gallery/loyalty-gift-gallery';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { LoyaltyCataloguePage } from '../loyalty-catalogue/loyalty-catalogue';
import { LoyaltyPointHistoryPage } from '../loyalty/loyalty-point-history/loyalty-point-history';
import { ProductsPage } from '../products/products';

/**
 * Generated class for the LoyaltyMenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-loyalty-menu',
  templateUrl: 'loyalty-menu.html',
})
export class LoyaltyMenuPage {
  toggle = true;
  lang:any;
  giftMasterList:any=[];
  filter:any={};

  constructor(public navCtrl: NavController, public navParams: NavParams, private  translate:TranslateService, public alertCtrl: AlertController,public service: MyserviceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoyaltyMenuPage');
  }

  toggleValue(value){
    if(value == 'false'){
      this.toggle = true;  
    }
    else{
        this.toggle = false;  
    }
}

goOnfaqPage() {
  this.navCtrl.push(LoyaltyFaqPage,{"lang":this.lang})
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

 goOnProductPage() {
    this.navCtrl.push(ProductsPage, { 'mode': 'home','lang':this.lang  });
  }

goToSpin() {
  this.navCtrl.push(SpinWheelPage)
}

goToVideo() {
  this.navCtrl.push(LoyaltyVideoPage)
}
goToTracker() {
  this.navCtrl.push(LoyaltyGiftTrackerPage)
}

 goOnPointeListPage() {
    this.navCtrl.push(LoyaltyPointHistoryPage,{'lang':this.lang })
  }

Super30Page() {
  this.navCtrl.push(Super30Page);
}

goToSupport() {
  this.navCtrl.push(SupportListPage);
}



gotoChangeLang(){
  this.navCtrl.push(LoyaltyLanguagePage, {"mode": 'edit_page' ,'lang':this.lang })
}

 goToDetail() {
      this.navCtrl.push(LoyaltyGiftGalleryPage,{'lang':this.lang })
    
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


  alertPresent(msg) {
    let alert = this.alertCtrl.create({
      title: '',
      subTitle: msg,
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


  goOnDigitalcatPage() {
      this.navCtrl.push(LoyaltyCataloguePage,{'lang':this.lang })
    }

}
