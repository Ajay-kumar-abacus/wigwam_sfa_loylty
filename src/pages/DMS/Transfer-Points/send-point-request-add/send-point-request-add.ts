import { Component, ViewChild } from '@angular/core';
import { ActionSheetController, AlertController, IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { MyserviceProvider } from '../../../../providers/myservice/myservice';
import { SendPointRequestListingPage } from '../send-point-request-listing/send-point-request-listing';
import { IonicSelectableComponent } from 'ionic-selectable';
import { ConstantProvider } from '../../../../providers/constant/constant';
import { Camera,CameraOptions } from '@ionic-native/camera';
import { Device } from '@ionic-native/device';
import { Diagnostic } from '@ionic-native/diagnostic';
import { CameraModalPage } from '../../../camera-modal/camera-modal';
declare let cordova:any ;
@IonicPage()
@Component({
    selector: 'page-send-point-request-add',
    templateUrl: 'send-point-request-add.html',
})
export class SendPointRequestAddPage {
    @ViewChild('dealerSelectable') dealerSelectable: IonicSelectableComponent;
    
    networkList: any = [];
    search: any;
    productList: any = [];
    data: any = {};
    form: any = {};
    Submit_button: boolean = false
    spinnerLoader: boolean = false
    loginDrData: any = {};
    selectImage:any=[];
    add_list: any = [];
    
    
    
    
    constructor(public diagnostic: Diagnostic,public Device:Device,public navCtrl: NavController, public navParams: NavParams,public service: MyserviceProvider,public alertCtrl: AlertController,public constant: ConstantProvider,public actionSheetController: ActionSheetController, private camera: Camera,public modalCtrl: ModalController) {
        
        this.loginDrData = this.constant.UserLoggedInData;
        console.log(this.loginDrData);
        
        this.getNetworkList('');
        
        setTimeout(() => {
            this.getProductList('');
        }, 800);
    }
    
    ionViewDidLoad() {
        console.log('ionViewDidLoad SendPointRequestAddPage');
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
        
        // this.service.presentLoading();
        this.service.addData({'master_search': masterSearch}, 'AppStockTransfer/assignedDistributors').then((result) => {
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
        this.service.addData({'master_search': masterSearch}, 'AppStockTransfer/fetchNonScannedProduct').then((result) => {
            console.log(result);
            
            if (result['statusCode'] == 200) {
                this.service.dismissLoading();
                this.productList = result['result'];
                console.log(this.productList);
                
                for (let index = 0; index < this.productList.length; index++) {
                    this.productList[index].display_name = this.productList[index].product_name + " - " + this.productList[index].product_code
                }
                
            } else {
                this.service.dismissLoading();
                this.service.errorToast(result['statusMsg'])
            }
        }, err => {
            this.service.dismissLoading();
        });
    }
    
    addToList() {
        console.log(this.data);
        console.log(this.add_list);
        let newData
        newData = this.data;
        if (this.add_list.length == 0) {
            console.log('1');
            
            this.add_list.push({'product':newData.product, 'qty':newData.qty, 'requested_points':newData.requested_points});
            
            console.log(newData, 'newData');
            console.log(this.add_list, 'newData');
        }
        else
        {
            let existIndex = this.add_list.findIndex(row => (row.product.id == this.data['product']['id']));
            console.log(existIndex);
            
            if (existIndex != -1) {
                // console.log('1');
                // this.service.errorToast('Already same product added to items')
                console.log( typeof newData.qty);
                
                this.add_list[existIndex].qty=parseInt(this.add_list[existIndex].qty)+parseInt(newData.qty);
                this.add_list[existIndex].requested_points = parseInt(this.add_list[existIndex].requested_points)+parseInt(newData.requested_points);
                
                
            }
            else
            {
                console.log('1');
                this.add_list.push({'product':newData.product, 'qty':newData.qty, 'requested_points':newData.requested_points});
            }
            
        }
        this.data.product = '';
        this.data.qty = '';
        this.data.requested_points = '';
        
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
        this.data.image = this.selectImage;
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
                        this.service.addData({ 'data': this.data }, 'AppStockTransfer/distributorPointTransferRequest').then((result) => {
                            if (result['statusCode'] == 200) {
                                this.spinnerLoader = true
                                this.Submit_button = true
                                this.service.successToast(result['statusMsg'])
                                this.navCtrl.popTo(SendPointRequestListingPage);
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
                
            ]
        });
        alert.present();
        
    }
    
    MobileNumber(event: any) {
        const pattern = /^[0-9+\- ]+$/;
        // const pattern = /[0-9\+\-\ ]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }
    }
    
    getfieldsClear()
    {
        this.data.qty = '';
        this.data.requested_points = '';
    }
    
    getPointCalculation(data)
    {
        console.log(data);
        console.log(data.product.dealer_point);
        console.log(data.qty);
        
        this.data.requested_points = data.product.dealer_point * data.qty;
        console.log(this.data.requested_points);
        if (this.data.requested_points == 0) {
            this.service.errorToast('Selected Product Point Value is 0')
            this.data.requested_points = '';
            console.log(this.data.requested_points);
            
        }
        
    }
    
    onUploadChange(evt: any) {
        let actionsheet = this.actionSheetController.create({
            title:'Upload File',
            cssClass: 'cs-actionsheet',
            
            buttons:[{
                cssClass: 'sheet-m',
                text: 'Camera',
                icon:'camera',
                handler: () => {
                    this.cameraModal('camera');
                    // this.takePhoto();
                }
            },
            {
                cssClass: 'sheet-m1',
                text: 'Gallery',
                icon:'image',
                handler: () => {
                    this.getImage();
                }
            },
            {
                cssClass: 'cs-cancel',
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                    this.selectImage=[];
                }
            }]
        });
        actionsheet.present();
    }

      cameraModal(type) {
        let modal = this.modalCtrl.create(CameraModalPage,{'type':type});
    
        modal.onDidDismiss(data => {
          console.log(data)
          if (data != undefined && data != null) {
            this.selectImage.push(data);
        }
        
        
          
        });
    
        modal.present();
      }
    takePhoto()
    {
        this.diagnostic.requestCameraAuthorization().then((isAvailable: any) => {
        const options: CameraOptions = {
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            targetWidth : 500,
            targetHeight : 400
        }
        if(this.Device.platform=='Android'){
        cordova.plugins.foregroundService.start('Camera', 'is running');
      }
        this.camera.getPicture(options).then((imageData) => {
            var image = 'data:image/jpeg;base64,' + imageData;
            if(this.Device.platform=='Android'){
      cordova.plugins.foregroundService.stop();
      }
            this.selectImage.push(image);
        }, (err) => {
            if(this.Device.platform=='Android'){
                cordova.plugins.foregroundService.stop();
              }
        });
    }).catch((error: any) => {
        if(this.Device.platform=='Android'){
            cordova.plugins.foregroundService.stop();
          }
   
    });
    }
    
    getImage()
    {
        this.diagnostic.requestCameraAuthorization().then((isAvailable: any) => {
        const options: CameraOptions = {
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            saveToPhotoAlbum:false
        }
        if(this.Device.platform=='Android'){
        cordova.plugins.foregroundService.start('Camera', 'is running');
      }
        this.camera.getPicture(options).then((imageData) => {
            var image = 'data:image/jpeg;base64,' + imageData;
            if(this.Device.platform=='Android'){
      cordova.plugins.foregroundService.stop();
      }
            this.selectImage.push(image);
        }, (err) => {
            if(this.Device.platform=='Android'){
                cordova.plugins.foregroundService.stop();
              }
        });
    }).catch((error: any) => {
        if(this.Device.platform=='Android'){
            cordova.plugins.foregroundService.stop();
          }
   
    });
    }
    
    delete_img(index){
        this.selectImage.splice(index,1);
    }
    
}
