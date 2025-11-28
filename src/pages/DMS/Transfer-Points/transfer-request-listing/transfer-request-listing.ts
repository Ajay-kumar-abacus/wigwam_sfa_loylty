import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TransferRequestDetailPage } from '../transfer-request-detail/transfer-request-detail';
import { TransferRequestAddPage } from '../transfer-request-add/transfer-request-add';
import { MyserviceProvider } from '../../../../providers/myservice/myservice';

/**
* Generated class for the TransferRequestListingPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
    selector: 'page-transfer-request-listing',
    templateUrl: 'transfer-request-listing.html',
})
export class TransferRequestListingPage {
    transferReqList: any = [];
    transferReqCounts: any = [];
    ActiveTab: any = 'Pending'
    filter: any = {}


    constructor(public navCtrl: NavController, public navParams: NavParams,public service: MyserviceProvider) {
    }
    
    ionViewWillEnter() 
    {
        this.getTransferRequestList(this.ActiveTab);
    }
    
    ionViewDidLoad() {
        console.log('ionViewDidLoad TransferRequestListingPage');
    }
    
    doRefresh(refresher) 
    {
        console.log('Begin async operation', refresher);
        this.getTransferRequestList(this.ActiveTab); 
        refresher.complete();
    }
    
    goToTransferReqyestDetail(id) {
        this.navCtrl.push(TransferRequestDetailPage, { id: id});
    }
    
    goToSendPoints() {
        this.navCtrl.push(TransferRequestAddPage);
    }
    
    getTransferRequestList(ActiveTab) {
        console.log(ActiveTab);
        console.log(this.filter.master_search);
        
        
        this.service.presentLoading();
        
        this.service.addData({ActiveTab : ActiveTab , master_search : this.filter.master_search}, 'AppStockTransfer/customerPointsRequestListing').then((result) => {
            console.log(result);
            
            if (result['statusCode'] == 200) {
                this.service.dismissLoading();
                this.transferReqList = result['result'];
                this.transferReqCounts = result['count'];
                console.log(this.transferReqList);
                
            } else {
                this.service.dismissLoading();
                this.service.errorToast(result['statusMsg'])
            }
        }, err => {
            this.service.dismissLoading();
        });
    }
    
}
