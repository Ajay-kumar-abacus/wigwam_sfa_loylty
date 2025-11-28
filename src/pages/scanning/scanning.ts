import { Component, ViewChild } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { AlertController, IonicPage, ModalController, NavController, NavParams, Platform } from 'ionic-angular';
import { ConstantProvider } from '../../providers/constant/constant';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { IonicSelectableComponent } from 'ionic-selectable';
import { Geolocation } from '@ionic-native/geolocation';
import { LoyaltyHomePage } from '../loyalty/loyalty-home/loyalty-home';
import { OpenNativeSettings } from '@ionic-native/open-native-settings'
import { DealerHomePage } from '../dealer-home/dealer-home';

@IonicPage()
@Component({
  selector: 'page-scanning',
  templateUrl: 'scanning.html',
})
export class ScanningPage {
  @ViewChild('selectComponent') selectComponent: IonicSelectableComponent;
  product_detail: any ={};
  data:any ={};
  scaninfo: any ={};
  spinnerLoader:boolean = false;
  showDetail:boolean = false
  pageType:any;
  loginDrData: any = {};
  networkList: any = [];
  search: any;
  
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public service: MyserviceProvider,
    public constant: ConstantProvider, public alertCtrl: AlertController,private openNativeSettings: OpenNativeSettings) {
      this.loginDrData = this.constant.UserLoggedInData;
      console.log(this.loginDrData);
      
      this.pageType = this.navParams.get('page_type');
      
      if(this.pageType == 'scan'){
        this.showDetail = true;
        this.product_detail = this.navParams.get('product_detail')
        this.scaninfo = this.product_detail.scaninfo;
      }
      
      if (this.loginDrData.type == 1) {
        this.getNetworkList('');
      }
      
    }
    
    
    showSuccess(text) {
      let alert = this.alertCtrl.create({
        title: 'Success!',
        cssClass: 'action-close',
        subTitle: text,
        buttons: ['OK']
      });
      alert.present();
    }
    
    ionViewDidLoad() {
    }
    
    MobileNumber(event: any) {
      const pattern = /[0-9\+\-\ ]/;
      let inputChar = String.fromCharCode(event.charCode);
      if (event.keyCode != 8 && !pattern.test(inputChar)) {
        event.preventDefault();
      }
    }
    
    searchNetwork(event) {
      if (event.text == '') {
        this.getNetworkList('');
      }
      this.search = event.text;
      let wordSearch = this.search;
      setTimeout(() => {
        if (wordSearch == this.search) {
          if (this.search) {
            this.getNetworkList(this.search);
          }
        }
      }, 500);
    }
    
    getNetworkList(masterSearch) {
      
      this.service.presentLoading();
      this.service.addData({'master_search': masterSearch}, 'AppStockTransfer/assignedCustomer').then((result) => {
        console.log(result);
        
        if (result['statusCode'] == 200) {
          this.service.dismissLoading();
          this.networkList = result['result'];
          console.log(this.networkList);
          
        } else {
          this.service.dismissLoading();
          this.service.errorToast(result['statusMsg'])
        }
      }, err => {
        this.service.dismissLoading();
      });
    }
    
    submit(){
      this.spinnerLoader= true;
      this.service.addData({ 'coupon_code': this.data.code, }, 'AppCouponScan/fetchProduct').then((r: any) => {
        if (r['statusCode'] == 200) {
          let result ;
          result = r['result'];
          if( result != ''){
            this.spinnerLoader= false;
            this.showDetail = true;
            this.product_detail = result;
            this.scaninfo = this.product_detail.scaninfo;
          }
        }
        else {
          this.spinnerLoader= false;
          this.service.errorToast(r['statusMsg']);
        }
      },
      err => {
        this.spinnerLoader= false;
        this.service.Error_msg(err);
      });
    }
    
    returnSubmit(){
      this.spinnerLoader= true;
      this.service.addData({ 'influencer_mobile': this.data.mobile, 'productData' : this.product_detail ,'drData' : this.data.drData }, 'AppCouponScan/scanSalesReturn').then((r: any) => {
        if (r['statusCode'] == 200) {
          let result ;
          result = r['result'];
          if( result != ''){
            this.spinnerLoader= false;
            this.showDetail = true;
            this.navCtrl.push(DealerHomePage);
            this.showSuccess(r['statusMsg']);
          }
        }
        else {
          this.spinnerLoader= false;
          this.service.errorToast(r['statusMsg']);
        }
      },
      err => {
        this.spinnerLoader= false;
        this.service.Error_msg(err);
      });
    }
    
  }
  