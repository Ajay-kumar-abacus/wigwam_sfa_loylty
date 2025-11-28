import { Component, ViewChild } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { MyserviceProvider } from '../../../../providers/myservice/myservice';
import { IonicSelectableComponent } from 'ionic-selectable';
import { TransferRequestListingPage } from '../transfer-request-listing/transfer-request-listing';
import { ConstantProvider } from '../../../../providers/constant/constant';
import { ReturnPointListingPage } from '../return-point-listing/return-point-listing';


@IonicPage()
@Component({
    selector: 'page-transfer-request-add',
    templateUrl: 'transfer-request-add.html',
})
export class TransferRequestAddPage {
    @ViewChild('dealerSelectable') dealerSelectable: IonicSelectableComponent;
    
    data: any = {};
    form: any = {};
    add_list: any = [];
    networkList:any =[];
    tempdrData:any =[];
    drList: any = [];
    // drData: any = [];
    productList: any = [];
    Submit_button: boolean = false
    spinnerLoader: boolean = false
    loginDrData: any = {};
    search: any;
    type:any={};
    
    constructor(public navCtrl: NavController, public constant: ConstantProvider,public navParams: NavParams,public service: MyserviceProvider,public alertCtrl: AlertController) {
        this.loginDrData = this.constant.UserLoggedInData;
        console.log(this.loginDrData);
        
        if (this.navParams.get('type')) {
            this.data.type = this.navParams.get('type');
            console.log(this.data.type);
        }
        else
        {
            this.data.type = 'Transfer';
            console.log(this.data.type);
        }
        
        
        this.getNetworkList('');
        
        setTimeout(() => {
            this.getProductList('');
        }, 800);
    }
    
    ionViewDidLoad() {
        console.log('ionViewDidLoad TransferRequestAddPage');
    }
    
    MobileNumber(event: any) {
        const pattern = /[0-9\+\-\ ]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) {
            event.preventDefault();
        }
    }
    
    searchNetwork(event) {
        if (event.text == '') {
            this.getNetworkList('');
        }
        this.search = event.text;
        let wordSearch = this.search;
        setTimeout(() => {
            if (wordSearch == this.search) {
                if (this.search) {
                    this.getNetworkList(this.search);
                }
            }
        }, 500);
    }
    
    getNetworkList(masterSearch) {
        console.log(masterSearch);
        console.log(this.loginDrData.type);
        
        if (this.loginDrData.type == 3) {
            console.log('1');
            
            if (masterSearch.length == 10) {
                
                // this.service.presentLoading();
                this.service.addData({'master_search': masterSearch}, 'AppStockTransfer/assignedCustomer').then((result) => {
                    console.log(result);
                    
                    if (result['statusCode'] == 200) {
                        this.service.dismissLoading();
                        if(result['result'] != ''){
                            this.tempdrData = result['result'][0];
                            console.log(this.tempdrData);
                            if (this.data.type == 'Transfer') {
                                this.data.drData = this.tempdrData.mobile_no
                                console.log(this.data.drData);
                            }
                            else
                            {
                                this.data.drData = this.tempdrData
                                console.log(this.data.drData);
                            }
                            
                        }
                        else
                        {
                            this.service.errorToast('Not Exist')
                        }
                        
                        
                    } else {
                        this.service.dismissLoading();
                        this.service.errorToast(result['statusMsg'])
                    }
                }, err => {
                    this.service.dismissLoading();
                });
            }
        }
        else
        {
            // this.service.presentLoading();
            this.service.addData({'master_search': masterSearch}, 'AppStockTransfer/assignedCustomer').then((result) => {
                console.log(result);
                
                if (result['statusCode'] == 200) {
                    this.service.dismissLoading();
                    this.networkList = result['result'];
                    console.log(this.networkList);
                    
                } else {
                    this.service.dismissLoading();
                    this.service.errorToast(result['statusMsg'])
                }
            }, err => {
                this.service.dismissLoading();
            });
            
        }
        
    }
    
    searchProduct(event) {
        if (event.text == '') {
            this.getProductList('');
        }
        this.search = event.text;
        let wordSearch = this.search;
        setTimeout(() => {
            if (wordSearch == this.search) {
                if (this.search) {
                    this.getProductList(this.search);
                }
            }
        }, 500);
    }
    
    getProductList(masterSearch) {
        
        // this.service.presentLoading();
        this.service.addData({'master_search': masterSearch}, this.data.type == 'Transfer' ? 'AppStockTransfer/fetchNonScannedProduct' : 'AppStockTransfer/fetchProduct').then((result) => {
            console.log(result);
            
            if (result['statusCode'] == 200) {
                // this.service.dismissLoading();
                this.productList = result['result'];
                console.log(this.productList);
                
                for (let index = 0; index < this.productList.length; index++) {
                    this.productList[index].display_name = this.productList[index].product_name + " - " + this.productList[index].product_code
                }
                
            } else {
                // this.service.dismissLoading();
                this.service.errorToast(result['statusMsg'])
            }
        }, err => {
            // this.service.dismissLoading();
        });
    }
    
    addToList() {
        console.log(this.data);
        console.log(this.add_list);
        let newData
        newData = this.data;
        if (this.add_list.length == 0) {
            console.log('1');
            
            this.add_list.push({'product':newData.product, 'qty':newData.qty, 'transferPoints':newData.transferPoints});
            
            console.log(newData, 'newData');
            console.log(this.add_list, 'newData');
        }
        else
        {
            let existIndex = this.add_list.findIndex(row => (row.product.id == this.data['product']['id']));
            console.log(existIndex);
            
            if (existIndex != -1) {
                // console.log('1');
                this.service.errorToast('Already same product added to items')
                console.log( typeof newData.qty);
                
                // this.add_list[existIndex].qty=parseInt(this.add_list[existIndex].qty)+parseInt(newData.qty);
                // this.add_list[existIndex].transferPoints = parseInt(this.add_list[existIndex].transferPoints)+parseInt(newData.transferPoints);
                
                
            }
            else
            {
                console.log('1');
                this.add_list.push({'product':newData.product, 'qty':newData.qty, 'transferPoints':newData.transferPoints});
            }
            
        }
        this.data.product = '';
        this.data.qty = '';
        this.data.transferPoints = '';
        
        console.log(this.add_list);
    }
    
    
    
    DeleteItem(i) {
        let alert = this.alertCtrl.create({
            title: 'Are You Sure?',
            subTitle: 'Your Want To Delete This Item ',
            cssClass: 'alert-modal',
            
            buttons: [{
                text: 'No',
                role: 'cancel',
                handler: () => {
                }
            },
            {
                text: 'Yes',
                handler: () => {
                    this.add_list.splice(i, 1);
                    
                }
            }]
        });
        alert.present();
    }
    
    submitTransferRequest() {
        console.log(this.data);
        console.log(this.add_list);
        
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
                        this.data.requestItems = this.add_list
                        
                        if(this.data.type == 'Transfer')
                        {
                            if (this.loginDrData.type == 1) {
                                this.service.addData({ 'data': this.data }, 'AppStockTransfer/sendCustomerPoints').then((result) => {
                                    if (result['statusCode'] == 200) {
                                        this.spinnerLoader = true
                                        this.Submit_button = true
                                        this.service.successToast(result['statusMsg'])
                                        this.navCtrl.popTo(TransferRequestListingPage);
                                    } else {
                                        this.spinnerLoader = false
                                        this.Submit_button = false
                                        this.service.errorToast(result['statusMsg'])
                                    }
                                }, error => {
                                    this.Submit_button = false
                                    this.spinnerLoader = false
                                    this.service.Error_msg(error);
                                    this.service.dismiss();
                                });
                            }
                            
                            else
                            {
                                this.service.addData({ 'data': this.data }, 'AppStockTransfer/sendInfluencerPoints').then((result) => {
                                    if (result['statusCode'] == 200) {
                                        this.spinnerLoader = true
                                        this.Submit_button = true
                                        this.service.successToast(result['statusMsg'])
                                        this.navCtrl.popTo(TransferRequestListingPage);
                                    } else {
                                        this.spinnerLoader = false
                                        this.Submit_button = false
                                        this.service.errorToast(result['statusMsg'])
                                    }
                                }, error => {
                                    this.Submit_button = false
                                    this.spinnerLoader = false
                                    this.service.Error_msg(error);
                                    this.service.dismiss();
                                });
                            }
                            
                        }
                        else
                        {
                            console.log(this.data.type);
                            
                            this.service.addData({ 'data': this.data }, this.loginDrData.type == 3 ? 'AppStockTransfer/salesReturnInfluencer' : 'AppStockTransfer/salesReturnRetailer').then((result) => {
                                if (result['statusCode'] == 200 && result['statusMsg'] == 'Success') {
                                    this.spinnerLoader = true
                                    this.Submit_button = true
                                    this.service.successToast(result['statusMsg'])
                                    this.navCtrl.popTo(ReturnPointListingPage);
                                } else {
                                    this.spinnerLoader = false
                                    this.Submit_button = false
                                    this.service.errorToast(result['statusMsg'])
                                }
                            }, error => {
                                this.Submit_button = false
                                this.spinnerLoader = false
                                this.service.Error_msg(error);
                                this.service.dismiss();
                            });
                        }
                        
                    }
                }
                
            ]
        });
        alert.present();
        
    }
    
    getfieldsClear()
    {
        this.data.qty = '';
        this.data.transferPoints = '';
    }
    
    getPointCalculation(data)
    {
        console.log(data);
        console.log(data.product.dealer_point);
        console.log(data.product.influencer_point);
        console.log(data.qty);
        if (this.loginDrData.type == 3) {
            console.log('In Con. 1');
            
            this.data.transferPoints = data.product.influencer_point * data.qty;
        }
        else
        {
            console.log('In Con. 2');
            this.data.transferPoints = data.product.dealer_point * data.qty;
        }
        
        console.log(this.data.transferPoints);
        if (this.data.transferPoints == 0) {
            // this.service.errorToast('Selected Product Point Value is 0');
            this.data.transferPoints = '';
            console.log(this.data.transferPoints);
            
        }
        
    }
    
    stockCheck()
    {
        console.log(this.data);
        console.log(this.data.product.current_stock);
        
        if (this.data.qty > this.data.product.current_stock) {
            this.service.errorToast('Less Stock!, Current Stock of this product is ' + this.data.product.current_stock)
            this.data.qty = '';
            this.data.transferPoints = '';
        }
    }
}
