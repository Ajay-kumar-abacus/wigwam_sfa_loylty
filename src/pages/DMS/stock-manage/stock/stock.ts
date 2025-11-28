import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MyserviceProvider } from '../../../../providers/myservice/myservice';
import { StockDetailPage } from '../stock-detail/stock-detail';


@IonicPage()
@Component({
  selector: 'page-stock',
  templateUrl: 'stock.html',
})
export class StockPage {
  stockListing: any = [];
  stockCounts: any = [];
  ActiveTab: any = 'in_stock'
  filter: any = {}

  constructor(public navCtrl: NavController, public navParams: NavParams,public service: MyserviceProvider) {
  }

  ionViewWillEnter() 
  {
    this.getStockList(this.ActiveTab);
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad StockPage');
  }

  doRefresh(refresher) 
  {
    console.log('Begin async operation', refresher);
    this.getStockList(this.ActiveTab); 
    refresher.complete();
  }
  
  goOnStockDetail(productData) {
    this.navCtrl.push(StockDetailPage , {"productData" : productData});
  }
  
  getStockList(ActiveTab) {
    console.log(ActiveTab);
    console.log(this.filter.master_search);
    
    this.service.presentLoading();
    
    this.service.addData({ActiveTab : ActiveTab , master_search : this.filter.master_search}, 'AppStockTransfer/stockListing').then((result) => {
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
