import { Component } from '@angular/core';
import { IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { ConstantProvider } from '../../../providers/constant/constant';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { MyserviceProvider } from '../../../providers/myservice/myservice';
import { Storage } from '@ionic/storage';
import { LoyaltyGiftGalleryDetailPage } from '../loyalty-gift-gallery-detail/loyalty-gift-gallery-detail';
import { TranslateService } from '@ngx-translate/core';
import * as jwt_decode from "jwt-decode";

@IonicPage()
@Component({
  selector: 'page-loyalty-gift-gallery',
  templateUrl: 'loyalty-gift-gallery.html',
})

export class LoyaltyGiftGalleryPage {
  filter: any = {};
  id: any = '';
  gift_list: any = [];
  balance_point: any = '';
  loading: Loading;
  mode: any = '';
  tokenInfo: any = {};
  lang: any = 'en';
  influencer_point: any = {};
  gift_type: string = "Cash";

  uploadUrl: any
  constructor(public navCtrl: NavController, public navParams: NavParams, public service: MyserviceProvider, public loadingCtrl: LoadingController, public db: DbserviceProvider, public constant: ConstantProvider,public  translate:TranslateService,public storage: Storage) {
    this.mode = this.navParams.get('mode');
    this.uploadUrl = this.constant.upload_url1 + 'gift_gallery/';
    this.lang = this.navParams.get("lang");
    this.translate.setDefaultLang(this.lang);
    this.translate.use(this.lang);
    this.get_user_lang();

    if (this.mode) {
      this.mode = this.mode;
    }
    else {
      this.mode = '';
    }
    this.getGiftList('');
  }

  ionViewDidLoad() {
  }
  ionViewWillEnter() {
  }

  goOnGiftDetail(id, gift_type, range) {
    if (gift_type == 'Cash') {
      if(parseFloat(range) > parseFloat(this.influencer_point)){
        this.service.errorToast('you are not eligible for this gift');
        return
      }
      else{
        this.navCtrl.push(LoyaltyGiftGalleryDetailPage,{'id':id,'gift_type':gift_type,'lang':this.lang})
      }
      // this.navCtrl.push(LoyaltyGiftGalleryDetailPage, { 'id': id })

    }
    else {
      this.navCtrl.push(LoyaltyGiftGalleryDetailPage, { 'id': id ,'gift_type':gift_type,'lang':this.lang})
    }


  }

  doRefresh(refresher) {
    this.getGiftList('');
    refresher.complete();
  }


  total_balance_point: any = 0;

  getGiftList(search) {
    this.filter.limit = 20;
    this.filter.start = 0;
    this.filter.search = search;
    this.filter.redeemable = this.mode;
    this.filter.gift_type = this.gift_type;

    this.service.presentLoading();
    this.service.addData({ 'filter': this.filter }, 'AppGiftGallery/giftGalleryList').then((result) => {
      this.influencer_point = result['wallet_point'];
      this.gift_list = result['gift_master_list'];
      if (result['statusCode'] == 200) {
        this.gift_list = result['gift_master_list'];
        this.service.dismissLoading();
      }
      else {
        this.service.errorToast(result['statusMsg']);
        this.service.dismissLoading();
      }
    }, error => {
      this.service.Error_msg(error);
      this.service.dismiss();
    });
  }

  intVal(arsg) {
    return parseFloat(arsg);
  }

  flag: any = '';
  loadData(infiniteScroll) {
    this.filter.start = this.gift_list.length;
    this.service.addData({ 'filter': this.filter }, 'AppGiftGallery/giftGalleryList').then((r) => {
      if (r == '') {
        this.flag = 1;
      }
      else {
        setTimeout(() => {
          this.gift_list = this.gift_list.concat(r['gift_master_list']);
          infiniteScroll.complete();
        }, 1000);
      }
    }, error => {
      this.service.Error_msg(error);
      this.service.dismiss();
    });
  }

  get_user_lang()
  {
    this.storage.get("token")
    .then(resp=>{
      this.tokenInfo = this.getDecodedAccessToken(resp );
      
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
}
