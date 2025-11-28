import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConstantProvider } from '../../../../providers/constant/constant';
import { StockDetailPage } from '../../stock-manage/stock-detail/stock-detail';
import { DrStockPage } from '../dr-stock/dr-stock';

/**
* Generated class for the DrDetailPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-dr-detail',
  templateUrl: 'dr-detail.html',
})
export class DrDetailPage {
  
  drData: any = {};
  user_data:any={};
  
  constructor(public navCtrl: NavController, public navParams: NavParams,public constant:ConstantProvider) {
    this.user_data = this.constant.UserLoggedInData;
    console.log(this.user_data);
    
    
    if (this.navParams.get('drData')) {
      
      this.drData = this.navParams.get('drData');
      console.log(this.drData);
    }
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad DrDetailPage');
  }
  
  getStock()
  {
    this.navCtrl.push(DrStockPage,{'drData': this.drData})
  }
  
}
