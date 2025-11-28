import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MyserviceProvider } from '../../../../providers/myservice/myservice';
import { TransferRequestAddPage } from '../transfer-request-add/transfer-request-add';
import { ReturnPointDetailPage } from '../return-point-detail/return-point-detail';
import { ConstantProvider } from '../../../../providers/constant/constant';


@IonicPage()
@Component({
  selector: 'page-return-point-listing',
  templateUrl: 'return-point-listing.html',
})
export class ReturnPointListingPage {
  returnList: any = [];
  returnCounts: any = [];
  ActiveTab: any = 'Transfer'
  filter: any = {}
  loginDrData: any = {}
  
  constructor(public navCtrl: NavController, public navParams: NavParams,public service: MyserviceProvider, public constant : ConstantProvider) {
    this.loginDrData = this.constant.UserLoggedInData;
    console.log(this.loginDrData);
  }
  
  ionViewWillEnter() 
  {
    this.getReturnList(this.ActiveTab);
  }
  
  doRefresh(refresher) 
  {
    console.log('Begin async operation', refresher);
    this.getReturnList(this.ActiveTab); 
    refresher.complete();
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad ReturnPointListingPage');
  }
  
  getReturnList(ActiveTab) {
    console.log(ActiveTab);
    console.log(this.filter.master_search);
    
    this.service.presentLoading();
    
    this.service.addData({ActiveTab : ActiveTab , master_search : this.filter.master_search}, this.loginDrData.type == 3 ? 'AppStockTransfer/salesReturnInfluencerListing' : 'AppStockTransfer/salesReturnRetailerListing').then((result) => {
      console.log(result);
      
      if (result['statusCode'] == 200) {
        this.service.dismissLoading();
        this.returnList = result['result'];
        this.returnCounts = result['count'];
        console.log(this.returnList);
        
      } else {
        this.service.dismissLoading();
        this.service.errorToast(result['statusMsg'])
      }
    }, err => {
      this.service.dismissLoading();
    });
  }
  
  goToReturnPointRequestAdd() {
    this.navCtrl.push(TransferRequestAddPage , {'type' : 'Return'});
  }
  
  goOnReturnPointReqDetail(id)
  {
    this.navCtrl.push(ReturnPointDetailPage , {id : id});
  }
  
}
