import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SendPointRequestAddPage } from '../send-point-request-add/send-point-request-add';
import { MyserviceProvider } from '../../../../providers/myservice/myservice';
import { SendPointReqDetailPage } from '../send-point-req-detail/send-point-req-detail';


@IonicPage()
@Component({
  selector: 'page-send-point-request-listing',
  templateUrl: 'send-point-request-listing.html',
})
export class SendPointRequestListingPage {
  requestList: any = [];
  requestCounts: any = [];
  ActiveTab: any = 'Pending'
  filter: any = {}
  

  constructor(public navCtrl: NavController, public navParams: NavParams,public service: MyserviceProvider) {
  }
  
  ionViewWillEnter() 
  {
    this.getRequestList(this.ActiveTab);
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad TransferRequestListingPage');
  }
  
  doRefresh(refresher) 
  {
    console.log('Begin async operation', refresher);
    this.getRequestList(this.ActiveTab); 
    refresher.complete();
  }
  
  goToSendPointRequest() {
    this.navCtrl.push(SendPointRequestAddPage);
  }
  
  getRequestList(ActiveTab) {
    console.log(ActiveTab);
    console.log(this.filter.master_search);
    
    this.service.presentLoading();
    
    this.service.addData({ActiveTab : ActiveTab , master_search : this.filter.master_search}, 'AppStockTransfer/customerRequestListingForSelf').then((result) => {
      console.log(result);
      
      if (result['statusCode'] == 200) {
        this.service.dismissLoading();
        this.requestList = result['result'];
        this.requestCounts = result['count'];
        console.log(this.requestList);
        
      } else {
        this.service.dismissLoading();
        this.service.errorToast(result['statusMsg'])
      }
    }, err => {
      this.service.dismissLoading();
    });
  }

  goOnSendPointReqDetail(id)
  {
    this.navCtrl.push(SendPointReqDetailPage , {id : id});
  }

  
  
  // loadData(infiniteScroll) {
  //   this.start = this.requestList.length;
  //   this.filter.type = this.order_type;
    
  //   this.db.addData({ 'ActiveTab' : ActiveTab, 'limit': this.limit, 'start': this.start, "Mode": this.target_Type, 'filter': this.filter }, "AppStockTransfer/customerRequestListingForSelf").then((r) => {
  //     if (r['result']['result'] == '') {
  //       this.flag = 1;
  //     }
  //     else {
  //       setTimeout(() => {
  //         this.requestList = this.requestList.concat(r['result']['result']);
  //         infiniteScroll.complete();
  //       }, 1000);
  //     }
  //   });
  // }
  
}
