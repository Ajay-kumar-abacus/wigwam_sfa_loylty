import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MyserviceProvider } from '../../../../providers/myservice/myservice';


@IonicPage()
@Component({
  selector: 'page-dr-stock',
  templateUrl: 'dr-stock.html',
})
export class DrStockPage {
  drData : any = {};
  stockListing: any = [];
  stockCounts: any = [];
  ActiveTab: any = 'in_stock'
  filter: any = {}
  
  constructor(public navCtrl: NavController, public navParams: NavParams , public service: MyserviceProvider) {
    
    if (this.navParams.get('drData')) {
      
      this.drData = this.navParams.get('drData');
      console.log(this.drData);
    }
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad DrStockPage');
  }

  ionViewWillEnter() 
  {
    this.getDRStockList(this.ActiveTab);
  }
  
  doRefresh(refresher) 
  {
    console.log('Begin async operation', refresher);
    this.ActiveTab='in_stock'
    this.getDRStockList('in_stock'); 
    refresher.complete();
  }
  
  getDRStockList(ActiveTab) {
    console.log(ActiveTab);
    console.log(this.filter.master_search);
    
    this.service.presentLoading();
    
    this.service.addData({ActiveTab : ActiveTab , master_search : this.filter.master_search , 'retailer_id' : this.drData.dr_id}, 'AppStockTransfer/dr_stock_listing').then((result) => {
      console.log(result);
      
      if (result['statusCode'] == 200) {
        this.service.dismissLoading();
        this.stockListing = result['result'];
        this.stockCounts = result['count'];
        console.log(this.stockListing);
        
      } else {
        this.service.dismissLoading();
        this.service.errorToast(result['statusMsg'])
      }
    }, err => {
      this.service.dismissLoading();
    });
  }
  
}
