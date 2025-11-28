import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MyserviceProvider } from '../../../../providers/myservice/myservice';


@IonicPage()
@Component({
    selector: 'page-transfer-points-wallet',
    templateUrl: 'transfer-points-wallet.html',
})
export class TransferPointsWalletPage {
    pointsDetail:any= [];
    transactionsDetail:any= [];
    ActiveTab: any = 'recieved_transaction'
    transactionCounts: any = [];
    
    
    constructor(public navCtrl: NavController, public navParams: NavParams,public service: MyserviceProvider) {
        this.getPointsDetail()
        setTimeout(() => {
            this.gettransactionsDetail(this.ActiveTab);
        }, 1000);
    }
    
    ionViewDidLoad() {
        console.log('ionViewDidLoad TransferPointsWalletPage');
    }
    
    ionViewWillEnter() 
    {
    }
    
    
    getPointsDetail()
    {
        this.service.presentLoading()
        this.service.addData({},"AppCustomerNetwork/pointsWallet").then(result=>{
            console.log(result);
            if(result['statusCode']==200){
                this.pointsDetail = result['result']
                console.log(this.pointsDetail);
                
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
    
    gettransactionsDetail(ActiveTab)
    {
        console.log(ActiveTab);
        this.service.presentLoading()
        this.service.addData({ActiveTab : ActiveTab},"AppCustomerNetwork/tranferRecievedPointsDetail").then(result=>{
            console.log(result);
            if(result['statusCode']==200){
                this.transactionsDetail = result['result']
                this.transactionCounts = result['count'];
                console.log(this.transactionsDetail);
                
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
