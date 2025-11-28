import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController, ActionSheetController, Events, ModalController } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { Storage } from '@ionic/storage';
import moment from 'moment';
import { ConstantProvider } from '../../providers/constant/constant';
import { Camera } from '@ionic-native/camera';
import { FileTransfer} from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { FileOpener } from '@ionic-native/file-opener';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Device } from "@ionic-native/device";
import { SecondaryAddItemPage } from '../secondary-add-item/secondary-add-item';
import { OrderStatusChangePage } from '../order-status-change/order-status-change';
declare var DocumentViewer: any;


@IonicPage()
@Component({
    selector: 'page-secondary-order-detail',
    templateUrl: 'secondary-order-detail.html',
})
export class SecondaryOrderDetailPage {
    summary: string = "order";
    order_id: any;
    orderDetail: any = [];
    OrderList: any = [];
    userDetail: any = [];
    order_item_array: any = [];
    pageFrom: any;
    order_id1: any = '';
    currentDate: any = '';
    orderDate: any = '';
    orderDate1: any;
    orderitem: any = []
    retailer_list = []
    dispatch: boolean = false;
    loginData: any = {};
    upload_url: any = '';
    userType: any = '';
    pdfUrl: any;
    globalCollapsible: boolean = false;
    openCollapse: any;
    gst: any;
    discount_amt: any;
    discounted_amt: any;
    gst_amount: any;
    order: any = {};
    order_data: any = {};
    subTotal: any;
    amount: any;
    tag: any;
    show_image: boolean = false;
    pdfLoader:any=false;
    active: any = {};
    order_item_discount: any = {};
    value: any = {};
    user_data: any = {};
    form: any = {};
    today_date = new Date().toISOString().slice(0, 10);
    
    brand_assign: any = [];
    loading: any;
    Type: any = '';
    showButton: boolean=false;
    siteDetail:  any = [];
    activity_list: { remark: string; created_by_name: string; date_created: Date; }[];
    
    constructor(public iab:InAppBrowser, public Device:Device, public navCtrl: NavController, private fileOpener: FileOpener, public events: Events, public constant: ConstantProvider, public modalCtrl: ModalController, public loadingCtrl: LoadingController, public navParams: NavParams, public service: MyserviceProvider, public toastCtrl: ToastController, public alertCtrl: AlertController, public storage: Storage, public actionSheetController: ActionSheetController, public camera: Camera,  public db: DbserviceProvider, public file: File) {
       this.Type = this.navParams.get('type');
        this.summary = 'order';
        this.pdfUrl = this.constant.upload_url1 + 'orderPdf/';
        this.OrderList = [
            '1', '2', '3', '4', '5', '6'
        ]

        this.activity_list = [
            {
              remark: "Completed project review",
              created_by_name: "John Doe",
              date_created: new Date(2024, 2, 15)
            },
            {
                remark: "Completed project review",
                created_by_name: "John Doe",
                date_created: new Date(2024, 2, 15)
              },
              {
                remark: "Completed project review",
                created_by_name: "John Doe",
                date_created: new Date(2024, 2, 15)
              },
              {
                remark: "Completed project review",
                created_by_name: "John Doe",
                date_created: new Date(2024, 2, 15)
              },
              {
                remark: "Completed project review",
                created_by_name: "John Doe",
                date_created: new Date(2024, 2, 15)
              },
              {
                remark: "Completed project review",
                created_by_name: "John Doe",
                date_created: new Date(2024, 2, 15)
              },
            {
              remark: "Meeting with client scheduled",
              created_by_name: "Jane Smith",
              date_created: new Date(2024, 2, 16)
            },
            {
              remark: "Updated project timeline",
              created_by_name: "Mike Johnson",
              date_created: new Date(2024, 2, 17)
            },
            {
              remark: "Submitted quarterly report",
              created_by_name: "Sarah Williams",
              date_created: new Date(2024, 2, 18)
            },
            {
              remark: "Started new project phase",
              created_by_name: "David Brown",
              date_created: new Date(2024, 2, 19)
            }
          ];
        
    }
    ionViewWillEnter() {
        if (this.navParams.get('pageFrom')) {
            this.pageFrom = this.navParams.get('pageFrom');
        }
        else {
            this.pageFrom = 'OrderPage'

        }
        
        
        this.collObject.index = true;
        this.upload_url = this.constant.upload_url2;
        this.storage.get("loginData")
        .then(resp => {
            
            this.loginData = resp;
            
        })
        
        
        this.storage.get('loginType').then((loginType) => {
            
            if (loginType == 'CMS') {
                this.userType = 'notDrLogin'
            }
            else {
                this.userType = 'drLogin'
            }
        });
        
        
        if (this.userType == 'CMS') {
            this.user_data = this.db.tokenInfo;
        }
        else {
            this.user_data = this.constant.UserLoggedInData.all_data;
        }
        
        if (this.navParams.get('order_id')) {
            this.order_id1 = this.navParams.get('order_id');
            this.getOrderDetail(this.order_id1);
        }
        
        this.currentDate = moment().format("YY:MM:DD");
        
        
        
        this.storage.get('order_item_array').then((order_item) => {
            
            if (typeof (order_item) !== 'undefined' && order_item) {
                this.order_item_array = order_item;
                
            }
        });
        
        if (this.navParams.get("id")) {
            this.order_id = this.navParams.get("id");
            if (this.order_id) {
                
                
                this.getOrderDetail(this.order_id);
            }
        }
        
        if (this.navParams.get('customer_order_detail')) {
            this.userDetail = this.navParams.get('customer_order_detail');
            // this.orderDetail = this.navParams.get('customer_order_item');
            this.tag = this.navParams.get('tag');
        }
        
    }
    
    
    ionViewDidLoad() {

       
        
    }
    exportPdf()
    {
        this.pdfLoader=true;
        let id = { 'id': this.order_id }
        this.service.addData(id, "AppOrder/exportSecondaryOrderPdf").then((result) => {
            if (result['statusCode'] == 200) {
                console.log(result)
               
                var upload_url=  this.pdfUrl+result['file_name']
                DocumentViewer.previewFileFromUrlOrPath(
                  function () {
                   
                  }, function (error) 
                  {
                    if (error == 53) 
                    {
                      this.service.Error_msg('No app that handles this file type.');
                    }else if (error == 2)
                    {
                      this.service.Error_msg('Invalid link');
                    }
                  },
                  upload_url ,'pdf', 'application/pdf');
                  setTimeout(() => {
                    this.pdfLoader=false;
                  }, 2000);
                  
            } else {  
                setTimeout(() => {
                }, 700);
                this.service.errorToast(result['statusMsg'])
                this.service.dismissLoading()
                this.pdfLoader=false;
            }
        }
            , err => {
                this.service.errorToast(err)
                this.service.dismissLoading()
                this.pdfLoader=false;
            }
        )
      }
    
    
    getOrderDetail(order_id) {
        this.service.addData({ "Id": order_id }, "AppOrder/secondaryOrderDetail").then((result) => {
            if (result['statusCode']) {
                this.userDetail = result['result'];
                this.orderitem = result['result']['item_details'];
                this.siteDetail = result['result']['site_details'];


   // button disabel code start
              
                const orderCreationTime = new Date(this.userDetail.date_created);
                // Calculate the time difference in milliseconds
                const currentTime = new Date();
                const timeDifference = currentTime.getTime() - orderCreationTime.getTime();
                // Check if one hour has not passed (3600000 milliseconds = 1 hour)
                if (timeDifference < 3600000) {
                 this.showButton = true;
                }

    //button disabel code ends
        
            } else {
                this.service.errorToast(result['statusMsg'])
            }
            
        })
    }
    
    // exportPdf()
    // {
    //     this.pdfLoader=true;
    //     let id = { 'id': this.order_id }
    //     this.service.addData(id, "AppOrder/exportOrderPdf").then((result) => {
    //         if (result['statusCode'] == 200) {
    //             console.log(result)
    //             // return false;
    //             // window.open(this.service.uploadUrl+'orderPdf/'+result['file_name']);
    //             // setTimeout(() => {
    //             // }, 700);
    //             var upload_url=  this.pdfUrl+result['file_name']
    //             if(this.Device.platform=='Android'){
    //             DocumentViewer.previewFileFromUrlOrPath(
    //               function () {
                   
    //               }, function (error) 
    //               {
    //                 if (error == 53) 
    //                 {
    //                   this.service.Error_msg('No app that handles this file type.');
    //                 }else if (error == 2)
    //                 {
    //                   this.service.Error_msg('Invalid link');
    //                 }
    //               },
    //               upload_url ,'dummy', 'application/pdf');
    //               setTimeout(() => {
    //                 this.pdfLoader=false;
    //               }, 2000);
    //             }else{
    //                 this.iab.create(upload_url, '_system')
    //               }
                  
    //         } else {  
    //             setTimeout(() => {
    //             }, 700);
    //             this.service.errorToast(result['statusMsg'])
    //             this.service.dismissLoading()
    //             this.pdfLoader=false;
    //         }
    //     }
    //         , err => {
    //             this.service.errorToast(err)
    //             this.service.dismissLoading()
    //             this.pdfLoader=false;
    //         }
    //     )
    //   }
    
    delete_item(index, id, order_id) {
        
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
                        
                        this.delete_order_item(index, id, order_id);
                    }
                }
            ]
        })
        
        alert.present();
    }
    
    ADD_Item(id) {
        this.orderDetail.map(row => {
            row.discount = row.discount_percent;
        })
        this.navCtrl.push(SecondaryAddItemPage, { "order_item": this.orderitem, "order_data": this.userDetail, 'order_id': this.order_id,'type':this.Type });
    }
    
    delete_order_item(index, id, order_id) {
        
        this.service.presentLoading();
        this.service.addData({ 'id': id }, 'AppOrder/secondaryOrderDeleteItem').then((result) => {
            if (result['statusCode'] == 200) {
                this.orderitem.splice(index, 1);
                this.service.dismissLoading();
                this.service.successToast(result['statusMsg'])
                this.getOrderDetail(this.order_id);
            } else {
                this.service.errorToast(result['statusMsg'])
                this.service.dismissLoading();
            }
        })
    }
    
    collObject: any = {}
    
    
    
    changeStatus() 
    {
        let modal = this.modalCtrl.create(OrderStatusChangePage,{'id':this.userDetail.id, 'order_status':this.userDetail.order_status});
        modal.onDidDismiss(data =>
            {
                this.getOrderDetail(this.order_id);
            });
            
            modal.present();
        }

        addRemark(remark) {
            this.form.remark = remark
            if (this.form.remark == undefined) {
              this.service.errorToast('remarks is required');
              return
            }
            this.service.presentLoading()
            this.service.addData({ "order_id": this.order_id,'remark': remark }, "AppOrder/secondaryOrderChatLogs")
              .then(result => {
                if (result['statusCode'] == 200) {
                  this.form.remark = '';
                  
                  this.service.dismissLoading();
                  this.getOrderDetail(this.order_id);
                }
                else {
                  this.service.dismissLoading();
                  this.service.errorToast(result['statusMsg'])
                }
              },
                err => {
                });
          }
        
    }
    