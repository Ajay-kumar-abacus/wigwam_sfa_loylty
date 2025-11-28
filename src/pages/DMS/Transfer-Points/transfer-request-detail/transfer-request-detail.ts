import { Component } from '@angular/core';
import { AlertController, IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { ConstantProvider } from '../../../../providers/constant/constant';
import { MyserviceProvider } from '../../../../providers/myservice/myservice';
import { ViewProfilePage } from '../../../view-profile/view-profile';
import { TransferRequestListingPage } from '../transfer-request-listing/transfer-request-listing';


@IonicPage()
@Component({
    selector: 'page-transfer-request-detail',
    templateUrl: 'transfer-request-detail.html',
})
export class TransferRequestDetailPage {
    requestID: any;
    transferRequestsDetail: any = {};
    productDetails: any = [];
    data: any = {};
    inputFieldFlag: boolean[] = [false];
    savingFlag: boolean = false;
    url: any;
    
    
    constructor(public constant: ConstantProvider , public navCtrl: NavController, public navParams: NavParams,public service: MyserviceProvider,public alertCtrl: AlertController , public  modalCtrl:ModalController) {
        this.url = constant.upload_url1 + 'point_transfer_bill/'
        
        if (this.navParams.get('id')) {
            this.requestID = this.navParams.get('id');
            console.log(this.requestID);
            
            this.getTransferRequestsDetail(this.requestID);
        }
        
    }
    
    
    
    
    ionViewDidLoad() {
        console.log('ionViewDidLoad TransferRequestDetailPage');
    }
    
    MobileNumber(event: any) {
        const pattern = /[0-9\+\-\ ]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) {
            event.preventDefault();
        }
    }
    
    getTransferRequestsDetail(requestID) {
        console.log(requestID);
        console.log(this.productDetails);
        
        this.service.presentLoading();
        this.service.addData({ "requestID": requestID }, "AppStockTransfer/customerPointsRequestDetail").then((result) => {
            console.log(result);
            
            if (result['statusCode'] == 200) {
                this.service.dismissLoading();
                this.transferRequestsDetail = result['result'];
                for (let i = 0; i < result['result']['productDetails'].length; i++) {
                    this.productDetails.push(
                        {'product_qty':result['result']['productDetails'][i]['product_qty'], 
                        'product_detail':result['result']['productDetails'][i]['product_detail'], 
                        'id' : result['result']['productDetails'][i]['id'],
                        'product_id' : result['result']['productDetails'][i]['product_id'],
                        'inputFieldFlag':this.inputFieldFlag[i] = false})
                    }
                    
                    console.log(this.transferRequestsDetail);
                    console.log(this.productDetails);
                    // ------//
                    this.data.requestStatus = 'Approved';
                    console.log(this.data);
                    
                    // ------//
                    
                } else {
                    this.service.dismissLoading();
                    this.service.errorToast(result['statusMsg'])
                }
            }, err => {
                this.service.dismissLoading();
            });
        }
        
        ChangeRequestStatus(tempData,transferRequestsDetail) {
            console.log(tempData);
            let alert = this.alertCtrl.create({
                title: 'Save !',
                message: 'Do you want to Save this ?',
                cssClass: 'alert-modal',
                buttons: [
                    {
                        text: 'No',
                        role: 'cancel',
                        handler: () => {}
                    },
                    {
                        text: 'Yes',
                        handler: () => {
                            var data = {'formData': tempData , 'transferRequestsDetail' : transferRequestsDetail}
                            console.log(this.data);
                            this.service.addData({ data }, "AppStockTransfer/approveRequest").then((result) => {
                                console.log(result);
                                
                                if (result['statusCode'] == 200 && result['statusMsg'] == 'Success') {
                                    this.transferRequestsDetail = result['result'];
                                    this.navCtrl.popTo(TransferRequestListingPage);
                                    this.service.successToast(result['statusMsg'])
                                } else {
                                    this.service.dismissLoading();
                                    this.service.errorToast(result['statusMsg'])
                                }
                            }, err => {
                                this.service.dismissLoading();
                            });
                        }
                    }
                ]
            });
            alert.present();
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
                    this.getTransferRequestsDetail(this.requestID);
                    this.productDetails = [];
                    
                } else {
                    this.service.errorToast(result['statusMsg'])
                    // this.service.dismissLoading();
                }
            })
        }
        
        getEditfieldEnable(index) {
            console.log(index);
            
            this.inputFieldFlag[index] = true;
        }
        
        item_update_data(productDetails,index) {
            console.log(productDetails);
            
            this.service.addData({ 'requestID': this.requestID, 'data': productDetails}, "AppStockTransfer/updateDistributorPointTransferRequest").then((result) => {
                if (result['statusCode'] == 200 && result['statusMsg'] == 'Success') {
                    this.inputFieldFlag[index] = false;                
                    this.getTransferRequestsDetail(this.requestID);
                    this.productDetails = [];
                    
                }
                
                else {
                    this.service.errorToast(result['statusMsg']);
                    this.service.dismissLoading();
                    this.getTransferRequestsDetail(this.requestID);
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
    