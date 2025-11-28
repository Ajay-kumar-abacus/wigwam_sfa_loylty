import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MyserviceProvider } from '../../../../providers/myservice/myservice';


@IonicPage()
@Component({
  selector: 'page-point-transfer-ledger',
  templateUrl: 'point-transfer-ledger.html',
})
export class PointTransferLedgerPage {
  account_list:any= [];
  limit = 20
  start = 0

  
  
  constructor(public navCtrl: NavController, public navParams: NavParams,public service: MyserviceProvider) {
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad PointTransferLedgerPage');
    this.get_ledger()
  }
  
  get_ledger()
  {
    this.limit = 20
    this.start = 0
    this.service.presentLoading()
    this.service.addData({},"AppCustomerNetwork/ledgerListing").then(result=>
      {
        console.log(result);
        if(result['statusCode']==200){
          this.account_list = result['result']
          this.service.dismissLoading()
        }else{
          this.service.dismissLoading()
          this.service.errorToast(result['statusMsg'])
        }
      }, error => {
        this.service.Error_msg(error);
        this.service.dismiss();
      })
    }
    
  }
  