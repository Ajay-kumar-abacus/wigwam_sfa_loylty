import { Component } from '@angular/core';
import { AlertController, IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { ConstantProvider } from '../../../../providers/constant/constant';
import { MyserviceProvider } from '../../../../providers/myservice/myservice';
import { ViewProfilePage } from '../../../view-profile/view-profile';

@IonicPage()
@Component({
    selector: 'page-send-point-req-detail',
    templateUrl: 'send-point-req-detail.html',
})
export class SendPointReqDetailPage {
    
    requestID: any;
    sendPointReqData: any = {};
    productDetails: any = [];
    inputFieldFlag: boolean[] = [false];
    url: any;
    
    constructor(public navCtrl: NavController, public constant: ConstantProvider , public navParams: NavParams,public service: MyserviceProvider,public alertCtrl: AlertController, public  modalCtrl:ModalController) {
        this.url = constant.upload_url1 + 'point_transfer_bill/'
        
        if (this.navParams.get('id')) {
            this.requestID = this.navParams.get('id');
            console.log(this.requestID);
            
            this.getSendPointReqDetail(this.requestID);
        }
    }
    
    ionViewDidLoad() {
        console.log('ionViewDidLoad SendPointReqDetailPage');
    }
    
    getSendPointReqDetail(requestID) {
        console.log(requestID);
        this.service.presentLoading();
        this.service.addData({ "requestID": requestID }, "AppStockTransfer/customerRequestDetailForSelf").then((result) => {
            console.log(result);
            
            if (result['statusCode'] == 200) {
                this.service.dismissLoading();
                this.sendPointReqData = result['result'];
                for (let i = 0; i < result['result']['productDetails'].length; i++) {
                    this.productDetails.push(
                        {'product_qty':result['result']['productDetails'][i]['product_qty'], 
                        'product_detail':result['result']['productDetails'][i]['product_detail'], 
                        'id' : result['result']['productDetails'][i]['id'],
                        'product_id' : result['result']['productDetails'][i]['product_id'],
                        'inputFieldFlag':this.inputFieldFlag[i] = false
                    })
                }
                console.log(this.productDetails);
                
                console.log(this.sendPointReqData);
            } else {
                this.service.dismissLoading();
                this.service.errorToast(result['statusMsg'])
            }
        }, err => {
            this.service.dismissLoading();
        });
    }
    
    delete_item(index, id, requestID) {
        
        let alert = this.alertCtrl.create({
            title: 'Confirm ',
            message: 'Are you sure you want to delete this item ?',
            buttons: [
                {
                    text: 'No',
                    handler: () => {
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        
                        this.delete_req_item(index, id, requestID);
                    }
                }
            ]
        })
        
        alert.present();
    }
    
    delete_req_item(index, id, requestID) {
        
        // this.service.presentLoading();
        this.service.addData({ 'productID': id , 'requestID' : requestID }, 'AppStockTransfer/deleteProduct').then((result) => {
            if (result['statusCode'] == 200) {
                this.productDetails.splice(index, 1);
                // this.service.dismissLoading();
                this.service.successToast(result['statusMsg'])
                this.getSendPointReqDetail(this.requestID);
                this.productDetails = [];

            } else {
                this.service.errorToast(result['statusMsg'])
                // this.service.dismissLoading();
            }
        })
    }
    
    getEditfieldEnable(index) {
        this.inputFieldFlag[index] = true;
    }
    
    item_update_data(productDetails) {
        console.log(productDetails);
        
        this.service.addData({ 'requestID': this.requestID, 'data': productDetails}, "AppStockTransfer/updateRetailerPointRequest").then((result) => {
            if (result['statusCode'] == 200) {
                this.getSendPointReqDetail(this.requestID);
                this.productDetails = [];

            }
            
            else {
                this.service.errorToast(result['statusMsg']);
                this.service.dismissLoading();
            }
        }, error => {
            
            this.service.Error_msg(error)
            this.service.dismissLoading();
        });    
    }

    imageModal(src) {
        this.modalCtrl.create(ViewProfilePage, { "Image": src }).present();
      }
}
