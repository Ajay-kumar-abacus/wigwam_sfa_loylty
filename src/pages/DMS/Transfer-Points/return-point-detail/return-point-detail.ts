import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MyserviceProvider } from '../../../../providers/myservice/myservice';
import { ConstantProvider } from '../../../../providers/constant/constant';


@IonicPage()
@Component({
    selector: 'page-return-point-detail',
    templateUrl: 'return-point-detail.html',
})
export class ReturnPointDetailPage {
    returnID: any;
    loginDrData: any = {};
    returnPointData: any = {};
    productDetails: any = [];
    inputFieldFlag: boolean[] = [false];
    url: any;
    
    constructor(public navCtrl: NavController, public navParams: NavParams,public service: MyserviceProvider , public constant : ConstantProvider) {

        this.loginDrData = this.constant.UserLoggedInData;
        console.log(this.loginDrData);
        
        if (this.navParams.get('id')) {
            this.returnID = this.navParams.get('id');
            console.log(this.returnID);
            
            this.getReturnPointDetail(this.returnID);
        }
    }
    
    ionViewDidLoad() {
        console.log('ionViewDidLoad ReturnPointDetailPage');
    }
    
    getReturnPointDetail(returnID) {
        console.log(returnID);
        this.service.presentLoading();
        this.service.addData({ "returnID": returnID }, this.loginDrData.type == 3 ? "AppStockTransfer/salesReturnInfluencerDetail" : "AppStockTransfer/salesReturnRetailerDetail").then((result) => {
            console.log(result);
            
            if (result['statusCode'] == 200) {
                this.service.dismissLoading();
                this.returnPointData = result['result'];
                this.productDetails = this.returnPointData['product_detail'];
                console.log(this.productDetails);
                console.log(this.returnPointData);
            } 
            else 
            {
                this.service.dismissLoading();
                this.service.errorToast(result['statusMsg'])
            }
        }, err => {
            this.service.dismissLoading();
        });
    }
    
}
