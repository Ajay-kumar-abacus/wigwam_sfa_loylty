import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { App, IonicPage, Loading, LoadingController, NavController, NavParams, ToastController } from 'ionic-angular';
import { ConstantProvider } from '../../../providers/constant/constant';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { MyserviceProvider } from '../../../providers/myservice/myservice';
import { RegistrationPage } from '../../login-section/registration/registration';
import { LoyaltyRedeemRequestPage } from '../loyalty-redeem-request/loyalty-redeem-request';
import * as jwt_decode from "jwt-decode";
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-loyalty-gift-gallery-detail',
  templateUrl: 'loyalty-gift-gallery-detail.html',
})
export class LoyaltyGiftGalleryDetailPage {
  gift_id: any = '';
  gift_detail: any = {};
  balance_point: any = '';
  loading: Loading;
  star: any = '';
  rating_star: any = '';
  otp: '';
  offer_balance: any = ''
  karigar_detail: any = {};
  tokenInfo: any = {};
  lang: any = 'en';
  uploadUrl: any;
  influencer_point: any = {};
  data: any = {};
  contact: any = {};
  flag: any;



  constructor(public navCtrl: NavController, public navParams: NavParams, public service: MyserviceProvider, public loadingCtrl: LoadingController, private app: App, public storage: Storage, public db: DbserviceProvider, public constant: ConstantProvider, public toastCtrl: ToastController ,public  translate:TranslateService,) {
    this.gift_id = this.navParams.get('id');
    this.uploadUrl = constant.upload_url1 + 'gift_gallery/';

    this.lang = this.navParams.get("lang");
    
   
    // this.get_user_lang();
    this.service.presentLoading();
    this.getGiftDetail(this.gift_id);

    // this.data.payment_mode='Bank';
  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
    this.data.payment_mode='Bank';
    this.translate.setDefaultLang(this.lang);
    this.translate.use(this.lang);
    this.get_user_lang();

  }



  getGiftDetail(gift_id) {
    this.service.addData({ 'id': gift_id }, 'AppGiftGallery/giftGalleryDetail').then((result) => {
      if (result['statusCode'] == 200) {
        this.service.dismissLoading();
        this.gift_detail = result['gift_master_list'];
        this.influencer_point = result['detail'];

        this.getTdsMsg();

        

        // if(this.influencer_point.country=='India'){
        //   this.data.wallet_no = this.influencer_point.paytm_mobile_no.toString();
        // }
        this.data.cash_point = this.gift_detail.range_start;
        this.data.cash_value = this.gift_detail.point_range_value;

        if (this.influencer_point.kyc_status != 'Verified') {
          this.contactDetails();
        }
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

  getValue(value) {
    if (parseFloat(value) > parseFloat(this.influencer_point.wallet_point)) {
      this.service.errorToast('Insufficient Balance');
      return
    }
   
  }


  contactDetails() {
    this.service.addData({}, 'AppContactUs/contactDetail').then((result) => {
      if (result['statusCode'] == 200) {
        this.contact = result['contact_detail'];
      }
      else {
        this.service.errorToast(result['statusMsg']);
      }
    });
  }

  getTdsMsg() {
    this.service.addData({'influencer_id':this.constant.UserLoggedInData.id}, 'AppGiftGallery/influencer_tds_msg').then((result) => {
      if (result['statusCode'] == 200) {
        this.flag = result['flag'];
      if(this.flag == '1'){
        this.service.errorToast(result['msg']);
        return;
      }
      }
    });
  }

  SendRequest() {

    if (this.gift_detail.gift_type == 'Cash') {
      if (this.data.cash_point == undefined) {
        this.service.errorToast('Please Enter redeem points value');
        return
      }
      if (this.data.cash_point == 0) {
        this.service.errorToast('Please Enter redeem points value');
        return
      }

      if (!this.data.payment_mode) {
        this.service.errorToast('Please Select Payment Mode First');
        return
      }
      //    if (this.data.payment_mode =='UPI' && (this.data.upi_id =='' || this.data.upi_id ==undefined)) {
      //   this.service.errorToast('Please Enter UPI ID First');
      //   return
      // }

      // if ( parseInt(this.data.wallet_no.length)!=10 && this.data.payment_mode!='Bank' ) {
      //   this.service.errorToast('Please Enter 10 Digit Mobile No.');
      //   return
      // }

      if (parseFloat(this.data.cash_point) > parseFloat(this.influencer_point.wallet_point)) {
        this.service.errorToast('Insufficient point in your wallet');
        return
      }
         if (this.influencer_point.pending_gift_count !=0) {
        this.service.errorToast('Your redeem request already in process.');
        return
      }
     
      if (parseFloat(this.data.cash_point) < parseFloat(this.gift_detail.range_start)) {
        this.service.errorToast('You can not redeem less than ' + this.gift_detail.range_start + ' points.');
        return;
      }
     
   
      else {
        this.navCtrl.push(LoyaltyRedeemRequestPage, { 'karigar_id': this.influencer_point.id, 'gift_id': this.gift_id, "mode": "reedeemPoint", 'offer_balance': this.offer_balance, 'cash_point': this.data.cash_point, 'gift_type': 'Cash', 'cash_value': this.data.cash_value, 'payment_mode': this.data.payment_mode, 'upi_id': this.data.upi_id,'lang':this.lang })
      }
    }
    if (parseFloat(this.influencer_point.wallet_point) < parseFloat(this.gift_detail.gift_point)) {
      this.service.errorToast('Insufficient point in your wallet');
      return
    }

    if (this.gift_detail.gift_type == 'Gift') {

      if (this.influencer_point.pending_gift_count !=0) {
        this.service.errorToast('Your redeem request already in process.');
        return
      }

      
      this.navCtrl.push(LoyaltyRedeemRequestPage, { 'karigar_id': this.influencer_point.id, 'gift_id': this.gift_id, "mode": "reedeemPoint", 'offer_balance': this.offer_balance, 'gift_type': 'Gift', 'payment_mode':'Gift', 'upi_id': this.data.upi_id,'lang':this.lang })
    }
    // else{
    // }
  }

  mobileNoCheck(event) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }

  }

  updateBankDetail() {
    this.influencer_point.edit_profile = 'edit_profile';
    this.navCtrl.push(RegistrationPage, { 'data': this.influencer_point, "mode": 'edit_page','lang':this.lang})
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
          // this.translate.use(this.lang);
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
