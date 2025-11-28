import { Component } from '@angular/core';
import { ActionSheetController, IonicPage, NavController, NavParams, ViewController, LoadingController, AlertController, Navbar, ModalController, Platform, Nav, App, Events } from 'ionic-angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ViewChild } from '@angular/core';
import { SecondaryOrderMainPage } from '../secondary-order-main/secondary-order-main';
import { SecondaryOrderDetailPage } from '../secondary-order-detail/secondary-order-detail';
import { ConstantProvider } from '../../providers/constant/constant';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { Geolocation,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation';
import { Device } from '@ionic-native/device';
import { Diagnostic } from '@ionic-native/diagnostic';
import { CameraModalPage } from '../camera-modal/camera-modal';
declare let cordova: any;

@IonicPage()
@Component({
  selector: 'page-secondary-order-add',
  templateUrl: 'secondary-order-add.html',
})
export class SecondaryOrderAddPage {
  @ViewChild(Navbar) navBar: Navbar;

  @ViewChild('category') categorySelectable: IonicSelectableComponent;
  @ViewChild('dealerSelectable') dealerSelectable: IonicSelectableComponent;
  @ViewChild('siteSelectable') siteSelectable: IonicSelectableComponent;
  @ViewChild('itemSelectable') itemSelectable: IonicSelectableComponent;
  @ViewChild('selectComponent') selectComponent: IonicSelectableComponent;
  @ViewChild('distributorSelectable') distributorSelectable: IonicSelectableComponent;

  distributorSelected: any = false
  data: any = {};
  form: any = {};
  user_data: any = {};
  btndisable: boolean = false;
  product_type_disable: boolean = false;
  distributorSelect: boolean = false;
  disabledistFromCheckin: boolean = false;
  order_data: any = {};
  type: any = '';
  total_Order_amount: any = '';
  cart_array: any = []
  OrderItem: any = [];
  order_discount: any = 0;
  Distributor_list: any = [];
  checkinData: any = {};
  userType: any;
  itemType: any;
  prod_cat_list;
  showSave = false;
  showEdit = true;
  active: any = {};
  addToListButton: boolean = true;
  ItemGST: any = '';
  Dist_state = ''
  Dr_type = ''
  color_list: any = [];
  brand_list: any = [];
  product: any = {};
  show_price: any = false;
  SpecialDiscountLable: any = ''
  order_total: any = ''
  leave: any = 0;
  temp_product_array: any = [];
  sub_total: any = 0;
  dis_amt: any = 0;
  gst_amount: any = 0;
  net_total: any = 0;
  grand_total: any = 0;
  from_product = false
  filter: any = {};
  userId: any = {};
  product_list: any = [];
  order: any = {};
  qty: any;
  drtype: any;
  checkin_id: any = 0;
  site_id: any = 0;
  idMode: any;
  retailerID: any;
  tmpdata: any = {};
  disableSelect: boolean = false;
  disableSelectFromCheckin: boolean = false;
  add_list: any = [];
  total_qty: any = 0;
  netamount: any = 0;
  total_gst_amount: any = 0;
  new_grand_total: any = 0;
  drList: any = [];
  product_detail: any = {};
  brandList: any = [];
  colorList: any = [];
  selectImage: any = [];
  thicknessList: any = [];
  btnDisableSave: boolean = false;
  btnDisableDraft: boolean = false;
  Dr_Data: any = {};
  search: any;
  categoryId: any;
  thickness_list: any;
  flagtest: any;
  dimension_list: any;
  segment_list: any[];
  sub_category_list: any[];
  flagTest: any;
  items_list: any[];
  testid: any;
  product_resp: boolean;
  warehouseList: any = []
  sizeList: any = []
  productData: any = []
  orderId: any = ''
  Type: any = ''
  header: any = ''
  siteName: any = ''
  transfer_from_enquiry: any = ''
  showSelectType: any = false
  TodayDate = new Date().toISOString().slice(0, 10);
  state: any;
  SiteType: any;
  form1: any;
  district_list: any;
  city_list: any;
  city_list1: any;
  state_list: any;
  id: any;
  site: any;
  disable: boolean = false;
  savingFlag: boolean=false;
  totalPrice: number;
  extraDiscountPercentage: any;
  extra_discount_amount: any;
  priceAfterextraDiscount: any;
  totalGSTApplied: any;
  totalPriceAfterGST: any;
  master_discount: any;
  all_segment_with_discount_list: any;
  discount_percentages: any;
  totalFreightApplied: number;
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public events: Events,
    public loadingCtrl: LoadingController,
    public Device:Device,
    public navParams: NavParams,
    public diagnostic: Diagnostic,
    public viewCtrl: ViewController,
    public locationAccuracy: LocationAccuracy,
    public service: MyserviceProvider,
    public constant: ConstantProvider,
    public toastCtrl: ToastController,
    private alertCtrl: AlertController,
    public geolocation: Geolocation,
    public openNativeSettings: OpenNativeSettings,
    private camera: Camera,
    public actionSheetController: ActionSheetController,
    public storage: Storage,
    public modal: ModalController,
    public platform: Platform,

    public appCtrl: App) {
    this.data.gst_type = 'Gst Paid';
     this.data.product_type='S'
    this.drtype = this.navParams['data'].type;
    this.checkin_id = this.navParams.get('checkin_id');
    this.site_id = this.navParams.get('site_id');
    this.Type = this.navParams.get('type');
    console.log(this.navParams);
    if (this.navParams.get('fromPage') && this.navParams.get('fromPage') == 'DistSecondary' && this.navParams.get('dr_type') == 1) {
      this.data.distributor_id = this.navParams.get('distId')
      this.disableSelect = true
      this.showSelectType == false
    } else if (this.navParams.get('fromPage') && this.navParams.get('fromPage') == 'DistSecondary' && this.navParams.get('dr_type') != 1) {
      this.disableSelect = false

      this.data.type_name = this.navParams.get('distId')
      this.data.networkType = this.navParams.get('dr_type')
      this.get_distributor_list(this.navParams.get('distId'),'')
    }
    if (this.navParams.get('checkin_id') || this.navParams.get('Dist_login') || this.navParams.get('site_id')) {
      console.log("line no 150")
      this.disableSelectFromCheckin = true

      this.retailerID = this.navParams.get('id');

      this.siteName = this.navParams.get('site_name')
      console.log(this.navParams.get('transfer_from_enquiry'));
      this.transfer_from_enquiry = this.navParams.get('transfer_from_enquiry')
      console.log(this.transfer_from_enquiry);

      if (this.navParams.get('dr_type') == 3) {
        this.Type = 'stock'
      } else {
        this.Type = 'order'
      }
      this.tmpdata.id = this.navParams.get('id');
      this.tmpdata.company_name = this.navParams.get('dr_name');
      this.tmpdata.product_name = this.navParams.get('product_name');
      this.data.networkType = this.navParams.get('dr_type')
      this.tmpdata.dr_id = this.navParams.get('dr_id')
      if(this.navParams.get('site_id'))
      {
        this.tmpdata.dr_id = this.navParams.get('site_id')
      }
      // this.site_id = this.navParams.get('site_id');

      this.distributors(this.tmpdata, '');
    } else if (this.navParams.get('order_data') && this.navParams.get('OrderItem')) {
      console.log("line no 173")
      this.retailerID = this.navParams.get('order_data')['id'];
      if (this.navParams.get('order_data')['id']) {
        this.disableSelect = true;
      }
      this.tmpdata.id = this.navParams.get('order_data')['id']
      this.tmpdata.company_name = this.navParams.get('order_data')['company_name']
      this.tmpdata.dr_id = this.navParams.get('order_data')['dr_id']
      this.tmpdata.dr_name = this.navParams.get('order_data')['dist_company_name']


      this.distributors(this.tmpdata, '');


    } else {
      this.distributors('', '');

    }
    if (this.Type == 'order') {
      this.header = 'Secondary Order'
    } else {
      this.header = 'Stock Transfer'
      this.data.customer_type= 1;
      
    }
    this.Dr_Data = this.constant.UserLoggedInData;

    if (this.navParams.get('for_order')) {
      this.checkinData = this.navParams.get('for_order')
      this.data.networkType = this.checkinData.dr_type;
    }

    this.order_data = this.navParams.get("order_data");
    this.OrderItem = this.navParams.get("OrderItem");
    if (this.navParams.get("data")) {
      this.data = this.navParams.get("data");
      if (this.data.from_product == true) {
        this.cart_array = this.navParams.get("cart_array");
        if (this.data.order_data) {
          this.order_data = this.data.order_data;
        }

        this.cart_array.map((item) => {
          this.product = item
        })

      }

    }

    if (this.order_data && this.order_data.order_id) {

      this.user_data = this.order_data;
    }

    this.events.subscribe(('AddOrderBackAction'), (data) => {
      this.backAction()

    })


   



  }
  remove_image(index: number) {
    // Assuming this.image_data is an array of objects with 'image' and 'travelClass' properties
    this.image_data.splice(index, 1);
  }
  showLimit() {
    console.log('Image Data', this.image_data)
    let alert = this.alertCtrl.create({
      title: 'Alert',
      subTitle: "You can upload only 5  images",
      cssClass: 'alert-modal',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: () => {

        }
      }
      ]
    });
    alert.present();
  }
  captureMedia() {
    let actionsheet = this.actionSheetController.create({
      title: "Upload Image",
      cssClass: 'cs-actionsheet',
      buttons: [{
        cssClass: 'sheet-m',
        text: 'Camera',
        icon: 'camera',
        handler: () => {
          // this.takePhoto();
          this.cameraModal('camera');
        }
      },
      {
        cssClass: 'cs-cancel',
        text: 'Cancel',
        role: 'cancel',
        icon: 'cancel',
        handler: () => {

        }
      }
      ]
    });
    actionsheet.present();
  }
  latitude:any
    longitude:any
  pointlocation(){
    this.savingFlag = true;
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(() => {
      let options = { maximumAge: 10000, timeout: 15000, enableHighAccuracy: true };
      this.geolocation.getCurrentPosition(options).then((resp) => {
        console.log('response geolocation', resp);
        this.latitude = resp.coords.latitude;
        this.longitude = resp.coords.longitude;
        this.form.latitude=this.latitude
        this.form.longitude=this.longitude
        console.log(this.form.longitude,"line 316")
        console.log(this.form.latitude,"line 317")
        this.saveSite()
      }).catch((error) => {
        this.service.dismissLoading()
        this.savingFlag = false;
        this.presentConfirm('Turn On Location permisssion !', 'please go to  <strong>Settings</strong> -> Location to turn on <strong>Location permission</strong>')
      });
    },
    error => {
      this.service.dismissLoading()
      this.savingFlag = false;
      this.service.presentToast('Please Allow Location !!')
    });
  }
  presentConfirm(title, msg) {
    let alert = this.alertCtrl.create({
      enableBackdropDismiss: false,
      title: title,
      message: msg,
      cssClass: 'alert-modal',
      buttons: [
        
        {
          text: 'Cancel',
          handler: () => {
          }
        },
        {
          text: 'Settings',
          handler: () => {
            this.openSettings()
          }
        }
      ]
    });
    alert.present();
  }
  openSettings() {
    this.openNativeSettings.open("application_details")
  }
  image_data: any = [];
  image: any = '';
  fileChange(img) {
    this.image_data.push(img);
    this.image = '';
  }
    cameraModal(type) {
      let modal = this.modalCtrl.create(CameraModalPage,{'type':type});
  
      modal.onDidDismiss(data => {
        
        if (data != undefined && data != null) {  
          this.image = data
           if (this.image) {
            
            this.fileChange({ image: this.image });
        }
      }
      
      
        
      });
  
      modal.present();
    }
  takePhoto() {
    this.diagnostic.requestCameraAuthorization().then((isAvailable: any) => {
    console.log('in take photo', this.image_data);
    const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth: 500,
        targetHeight: 400
    };

    if(this.Device.platform=='Android'){
        cordova.plugins.foregroundService.start('Camera', 'is running');
      }
    this.camera.getPicture(options).then((imageData) => {
        this.image = 'data:image/jpeg;base64,' + imageData;
        if(this.Device.platform=='Android'){
      cordova.plugins.foregroundService.stop();
      }

      
        if (this.image) {
            
            this.fileChange({ image: this.image });
        }
    }, (err) => {
        // Handle error
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
  networkType: any = []
  getNetworkType() {
    this.service.addData('', "Dashboard/allNetworkModule").then((result => {
      this.networkType = result['modules'];
    }))
  }
  getSite(data) {
    
    this.service.addData({'search':data}, "AppOrder/existingSiteList").then((result => {
      this.SiteType = result['result'];
      this.disable = true;





    }))
  }
  saveSite() {
    
    this.form.image=this.image_data;
    this.form.FromOrderFlag=1;
    console.log(this.form.image)
    console.log(this.form.mobile_no)
  //   if (!this.form.image && !this.form.mobile_no) {
  //     console.log("inside")
  //     this.service.errorToast("ADD either Mobile No. or Image");
  //     return;
  // }
  console.log(this.form.image.length,"length ")
  console.log(this.form.mobile_no == undefined,"mobile no")
  if (this.form.image.length==0 && this.form.mobile_no == undefined) {
    console.log("inside 2")
    this.savingFlag = false;
    return this.service.errorToast("ADD either Mobile No. or Image");
   
   
}

    console.log(this.form,"line 402")
    this.service.addData(this.form, "AppOrder/addSite").then((result => {
      if (result['statusCode'] == 200) {

        this.data.state = 'Assigned';
        this.getSite('');
        console.log(result['result'].site_id)
        this.data.site = result['result'];
        console.log(this.data.site)
        this.disable = true


        this.service.successToast(result['statusMsg'])
        this.savingFlag = false;
        this.form.name = ""
        this.form.mobile_no = ""
        this.form.address = ""
        this.form.pincode = ""
        this.form.state = ""
        this.form.district = ""
        this.form.city = ""


      }
      else {
        this.service.errorToast(result['statusMsg'])
        this.savingFlag = false;
      }
    }))

  }
  MobileNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }
  }
  get_states() {
    this.service.presentLoading()
    this.service.addData({}, "AppCustomerNetwork/getWorkingStates")
      .then(resp => {
        if (resp['statusCode'] == 200) {
          this.service.dismissLoading()
          this.state_list = resp['state_list'];
        } else {
          this.service.dismissLoading()
          this.service.errorToast(resp['statusMsg']);
        }
      }, error => {
        this.service.Error_msg(error);
        this.service.dismiss();
      })
  }
  getSateteDistrcit() {
    // this.form1.pincode = this.form.pincode;
    console.log(this.form.pincode);
    this.service.addData({ 'pincode': this.form.pincode }, "AppEnquiry/getPostalInfo")
      .then(resp => {
        if (resp['statusCode'] == 200) {

          this.form.state = resp['result'].state_name;
          this.form.district = resp['result'].district_name;
          this.getCityList1();

          this.form.city = resp['result'].city;
          // if (this.form.influencer_detail) {

          //   this.form.state = resp['result'].state_name;
          //   this.form.district = resp['result'].district_name;
          //   this.form.city = resp['result'].district_name;
          // }
        } else {
          this.service.errorToast(resp['statusMsg']);

        }
      },
        err => {
          this.service.errorToast('Something Went Wrong!')
        });

  }
  getCityList1() {
    this.form.city1 = [];

    let state
    let district

    if (this.form.state) {
      state = this.form.state;
    }
    if (this.form.district) {
      district = this.form.district;
    }
  

    this.service.addData({ 'district_name': district, 'state_name': state,'pincode':this.form.pincode }, 'AppCustomerNetwork/get_city_list').then((result) => {
      if (result['statusCode'] == 200) {
        this.city_list1 = result['city'];
      } else {
        this.service.errorToast(result['statusMsg']);

      }


    }, err => {
      this.service.errorToast('Something Went Wrong!')
    });

  }
  get_district() {
    this.service.addData({ "state_name": this.form.state }, "AppCustomerNetwork/getDistrict")
      .then(resp => {
        if (resp['statusCode'] == 200) {
          this.district_list = resp['district_list'];
        } else {
          this.service.errorToast(resp['statusMsg']);
        }
      },
        err => {
          this.service.errorToast('Something Went Wrong!')
        })
  }
  getCityList() {
    this.form.city1 = [];
    this.service.addData({ 'district_name': this.form.district, 'state_name': this.form.state }, 'AppCustomerNetwork/getCity').then((result) => {
      if (result['statusCode'] == 200) {
        this.city_list = result['city'];
      } else {
        this.service.errorToast(result['statusMsg']);

      }


    }, err => {
      this.service.errorToast('Something Went Wrong!')
    });

  }
  searchDealer(event) {
    if (event.text == '') {
      this.distributors('', '');
      
    }
    this.search = event.text;
    let wordSearch = this.search;
    setTimeout(() => {
      if (wordSearch == this.search) {
        if (this.search) {
          this.distributors(this.search, '');
          
          

        }
      }
    }, 500);
  }
  searchDealer1(event) {
    if (event.text == '') {
      this.get_distributor_list(1093,'');
      
    }
    this.search = event.text;
    let wordSearch = this.search;
    setTimeout(() => {
      if (wordSearch == this.search) {
        if (this.search) {
          this.get_distributor_list(1093,this.search);
          
          

        }
      }
    }, 500);
  }
  searchSite(event) {
    if (event.text == '') {
      this.getSite('');
    }
    this.search = event.text;
    let wordSearch = this.search;
    setTimeout(() => {
      if (wordSearch == this.search) {
        if (this.search) {
          this.getSite(this.search);
        }
      }
    }, 500);
  }

  closeDealer() {
    this.dealerSelectable._searchText = '';
  }
  closeSite() {
    this.siteSelectable._searchText = '';
  }

  Distributor: any = []
  distributors(masterSearch, search) {
    this.product_list.length = 0;
    this.data.dimension_list = "";
    this.data.thickness_list = "";
    this.data.items_list = "";
    this.data.sub_category_list = "";
    this.data.category = "";
    this.data.order_type = "";
    this.data.distributor_id = "";
    let customerType
    if (this.Type == 'stock') {
      customerType = '3'
      this.data.networkType = 3
    } else {
      customerType = this.data.networkType
    }

    if (this.navParams.get('checkin_id') || (this.navParams.get('Dist_login')) || this.navParams.get('site_id')) {
      console.log("line no 283")
      this.service.addData({ 'dr_type': customerType, 'customer_type': this.data.customer_type, 'checkin_dr_id': this.navParams.get('id'), 'master_search': masterSearch }, 'AppOrder/followupCustomer').then((result) => {
        if (result['statusCode'] == 200) {
          this.drList = [];
          this.drList = result['result'];
          console.log(this.drList,"dr list")
          this.service.dismissLoading();
          if(this.data.networkType==15){
            console.log("inside if",this.retailerID)
            
            let Index = this.drList.findIndex(row => row.site_id== this.retailerID) 
            if (Index != -1) {
              this.data.type_name = this.drList[Index];
              console.log(this.drList[Index])
              this.get_distributor_list(this.retailerID,'')
            }
          }
          else{
          let Index = this.drList.findIndex(row => row.id == this.retailerID)
          if (Index != -1) {
            this.data.type_name = this.drList[Index];
            console.log(this.drList[Index])
            this.get_distributor_list(this.retailerID,'')
          }
        }
          this.service.dismissLoading();
        } else {
          this.service.dismissLoading();
          this.service.errorToast(result['statusMsg'])
        }

      }, err => {
        this.service.dismissLoading();

      });
    } else {
      console.log("line no 298")
      console.log(this.Dr_Data.type)
      console.log(customerType,"customer type")
      if (this.Dr_Data.type != 1) {
        this.Dr_type;
        this.service.addData({ 'dr_type': customerType, 'customer_type': this.data.customer_type, 'master_search': masterSearch }, 'AppOrder/followupCustomer').then((result) => {
          console.log("line no 646")
          this.drList = [];
          this.drList = result['result'];
          console.log(this.drList,"dr_list")
        });
      } else {
        this.Dr_type
        this.service.addData({ 'dr_type': customerType, 'master_search': masterSearch }, 'AppOrder/assignedDealer').then((result) => {
          this.drList = [];
          this.drList = result['result'];
        });
      }

    }
    this.blankValue()
  }




  ionViewDidLoad() {

    this.get_states();
    this.get_district();
    this.storage.get('user_type').then((userType) => {
      this.userType = userType;
      if (userType == 'OFFICE') {
        this.data.networkType = 3;
        //   this.get_network_list(1)
      }

    });
  }

  ionViewDidEnter() {
    this.sub_total = 0;
    this.dis_amt = 0;
    this.gst_amount = 0;
    this.data.dr_disc = 0;
    this.net_total = 0;
    this.grand_total = 0;
    this.cart_array.map((item) => {
      this.product = item
    })
    this.navBar.backButtonClick = () => {

      this.backAction()

    };
    // this.platform.registerBackButtonAction(() => {
    //   this.backAction()
    // });
    let nav = this.appCtrl.getActiveNav();
    if (nav && nav.getActive()) {
      let activeView = nav.getActive().name;
      let previuosView = '';
      if (nav.getPrevious() && nav.getPrevious().name) {
        previuosView = nav.getPrevious().name;
      }
    }
  }
  get_distributor_list(id ,mastersearch) {
    console.log("line 712")

    let cpType = ''
    let retailer_id
    if (this.navParams.get('checkin_id') || this.navParams.get('site_id')) {
      retailer_id = id
    }
    else if (this.navParams.get('Dist_login')) {
      retailer_id = id
    }
    else if (this.navParams.get('fromPage') && this.navParams.get('fromPage') == 'DistSecondary' && this.navParams.get('dr_type') == 1) {
      retailer_id = id
      this.data.distributor_id = this.navParams.get('distId')
    } else if (this.navParams.get('fromPage') && this.navParams.get('fromPage') == 'DistSecondary' && this.navParams.get('dr_type') != 1) {
      retailer_id = id
    }
    else {
      console.log(id)
      retailer_id = id.id
    }
    if (this.data.customer_type == '1') {
      cpType = 'Active'
    }
    else {
      cpType = ''
    }
    this.service.presentLoading();
    this.service.addData({ 'dealer_id': retailer_id, 'type': this.data.networkType, 'dr_type': this.data.customer_type, 'active_tab': cpType,'master_search': mastersearch }, 'AppOrder/newfollowupCustomer').then((result) => {
      if (result['statusCode'] == 200) {
        this.service.dismissLoading();
        this.Distributor_list = result['result'];
        if (this.Dr_Data.type == 1) {
          let index = this.Distributor_list.findIndex(r => r.id == this.Dr_Data.id);
          this.data.distributor_id = this.Distributor_list[index];
        }
        if (this.navParams.get('fromPage') && this.navParams.get('fromPage') == 'DistSecondary') {
          this.getBrands()
        }
      } else {
        this.service.dismissLoading();
        this.service.errorToast(result['statusMsg'])
      }
    }, err => {
      this.service.dismissLoading();

    });

  }
  getBrands() {

    this.service.addData({}, "AppOrder/brandList")
      .then(resp => {
        if (resp['statusCode'] == 200) {
          this.brandList = resp['result'];
        } else {
          this.service.errorToast(resp['statusMsg'])

        }
      }, err => { })
    this.data.qty = '';
    this.data.size = '';
    this.data.thickness = '';
  }
  getThickness(brandData) {

    this.service.addData({ 'brand': brandData.brand_code }, "AppOrder/productThikness")
      .then(resp => {
        if (resp['statusCode'] == 200) {
          this.thicknessList = resp['result'];
        } else {
          this.service.errorToast(resp['statusMsg'])

        }

      }, err => { })
    this.data.qty = '';
    this.data.size = '';
    this.data.thickness = '';
  }
  getSize(thickness) {
    this.service.addData({ 'brand': this.data.brand.brand_code, "thickness": thickness }, "AppOrder/productSize")
      .then(resp => {
        if (resp['statusCode'] == 200) {
          this.sizeList = resp['result'];

        } else {
          this.service.errorToast(resp['statusMsg'])

        }
      }, err => { })
    this.data.qty = '';
    this.data.size = '';
  }

  getProductData() {
    this.addToListButton = true
    this.service.addData({ 'brand': this.data.brand.brand_code, "thickness": this.data.thickness, "size": this.data.size }, "AppOrder/segmentItems")
      .then(resp => {
        if (resp['statusCode'] == 200) {
          this.productData = resp['result'];
          this.data.product_name = this.productData.product_name
          this.data.product_code = this.productData.product_code
          this.data.weight = this.productData.weight
          if(this.data.product_type=='S'){
            this.data.mrp = this.productData.mrp
        }
        else{
            this.data.mrp = this.productData.mrpSS
        }
          this.data.segment_id = this.productData.category_id
          this.data.segment_name = this.productData.category
          this.data.id = this.productData.id
          this.getProductDiscountData()
        } else {
          this.service.errorToast(resp['statusMsg'])

        }
      }, err => { })
  }

  getProductDiscountData() {
    this.service.addData({ 'brand': this.data.brand.brand_code,'category':this.data.product_type,'dr_id': this.data.distributor_id.id }, "AppOrder/segmentItemsDiscountforsecorder")
        .then(resp => {
            if (resp['statusCode'] == 200) {
                this.master_discount= resp['master_discount'];
                this.all_segment_with_discount_list= resp['all_segment_with_discount_list'];
                this.data.freight = (resp['freight'].freight == null || resp['freight'].freight === '') ? 0 : resp['freight'].freight;

                // if(this.all_segment_with_discount_list[0].discount_1+this.all_segment_with_discount_list[0].discount_2+this.all_segment_with_discount_list[0].discount_3+this.all_segment_with_discount_list[0].discount_4+this.all_segment_with_discount_list[0].discount_5+this.all_segment_with_discount_list[0].discount_6+this.all_segment_with_discount_list[0].discount_7+this.all_segment_with_discount_list[0].discount_8 >0){
                //     this.discount_percentages=resp['all_segment_with_discount_list'][0]
                //     this.data.discount_percentages = [
                //         this.discount_percentages.discount_1,
                //         this.discount_percentages.discount_2,
                //         this.discount_percentages.discount_3,
                //         this.discount_percentages.discount_4,
                //         this.discount_percentages.discount_5,
                //         this.discount_percentages.discount_6,
                //         this.discount_percentages.discount_7,
                //         this.discount_percentages.discount_8
                //     ]; 
                // }
                // else{
                    this.discount_percentages=resp['master_discount'][0];

                     this.data.discount_percentages = [
                        this.discount_percentages.discount_1,
                        this.discount_percentages.discount_2,
                        this.discount_percentages.discount_3,
                        this.discount_percentages.discount_4,
                        this.discount_percentages.discount_5,
                        this.discount_percentages.discount_6,
                        this.discount_percentages.discount_7,
                        this.discount_percentages.discount_8,
                        
                    ];
                // }

                this.addToListButton = false
                
            } else {
                // this.service.errorToast(resp['statusMsg'])

            }
        }, err => { })
}


  backAction() {

    if (this.product_list.length > 0) {
      let alert = this.alertCtrl.create({
        title: 'Are You Sure?',
        subTitle: 'Your Order Data Will Be Lost',
        cssClass: 'alert-modal',

        buttons: [{
          text: 'No',
          role: 'cancel',
          handler: () => {
            this.service.presentToast('Your Data is Safe')
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.navCtrl.pop();
            this.product_list = [];

          }
        }]
      });
      alert.present();
    }
    else {
      this.navCtrl.pop();
    }
  }


  OnlyNumber(event: any) {
    const pattern = /[0-9]+/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }
  }


  blankValue() {
    this.data.qty = '';
    this.data.size = '';
    this.data.thickness = '';
    this.data.brand = '';
    this.disable = false;
    this.data.state = "";
    // this.data.product_type=''


  }
  tonWeight: any = 0
  totalWeight: any = 0


  save_orderalert(type) {
    var str
    if (this.grand_total > 20000000) {
      let alert = this.alertCtrl.create({
        title: 'Max order value reached',
        subTitle: 'Maximum order value is 2 Cr. !',
        cssClass: 'alert-modal',
        buttons: [{
          text: 'Okay',
          role: 'Okay',
          handler: () => {
          }
        },
        ]
      });
      alert.present();
      return
    }
    if (type == 'draft') {
      str = 'You want to save this order as draft ?';
    }
    else {
      str = 'You want to submit this order ?';
    }
    let alert = this.alertCtrl.create({
      title: 'Are You Sure?',
      subTitle: str,
      cssClass: 'alert-modal',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
        }
      },
      {
        text: 'Confirm',
        cssClass: 'close-action-sheet',
        handler: () => {
          this.save_order(type);
        }
      }]
    });
    alert.present();
  }

  item_list: any = [];
  dr_id: any = {};




  onCloseItemList() {
    this.itemSelectable._searchText = '';
  }
 // Helper function to apply successive discounts
applyDiscounts(price, discounts) {
  let discountedPrice = price;
  
  // Apply successive discounts only to the base price
  for (let discount of discounts) {
      if (discount) {
          discountedPrice -= (discountedPrice * (parseFloat(discount) / 100));
      }
  }
  return discountedPrice; // Return price after discounts only
}

// Helper function to apply freight charges
applyFreight(price, freight) {
  const freightAmount = price * (parseFloat(freight) / 100);
  this.totalFreightApplied += freightAmount;
  return price + freightAmount; // Return price after freight only
}

addToList() {
  if (!this.data.product_type) {
      this.service.errorToast("Add Product Category");
      return;
  }

  // Ensure brand is using brand_code
  this.data.brand = this.data.brand.brand_code;

  // Check if the product list already contains an item with the same brand, thickness, and size
  if (this.product_list.length > 0) {
      let existIndex = this.product_list.findIndex(row => row.brand === this.data.brand && row.thickness === this.data.thickness && row.size === this.data.size && row.product_type === this.data.product_type);

      // If product exists, update its quantity and price
      if (existIndex !== -1) {
          this.product_list[existIndex]['qty'] += parseFloat(this.data.qty);
          this.product_list[existIndex]['total_price'] += parseFloat(this.data.mrp) * parseFloat(this.data.qty); // Update total price

          let priceWithDiscount = this.applyDiscounts(parseFloat(this.data.mrp) * parseFloat(this.data.qty), this.product_list[existIndex]['discount_percentages']);
          this.product_list[existIndex]['price_with_discount'] = priceWithDiscount;
          this.product_list[existIndex]['price_with_freight'] = this.applyFreight(priceWithDiscount, this.product_list[existIndex]['freight']);

          this.blankValue();
      } 
      // If product does not exist, add it to the list
      else {
          let total_price = parseFloat(this.data.mrp) * parseFloat(this.data.qty);
          let priceWithDiscount = this.applyDiscounts(total_price, this.data.discount_percentages);

          this.product_list.push({
              'brand': this.data.brand,
              'product_name': this.data.product_name,
              'weight': this.data.weight,
              'product_code': this.data.product_code,
              'product_id': this.data.id,
              'segment_id': this.data.segment_id,
              'segment_name': this.data.segment_name,
              'thickness': this.data.thickness,
              'product_type': this.data.product_type,
              'id': this.data.id,
              'size': this.data.size,
              'qty': parseFloat(this.data.qty),
              'total_price': total_price,
              'discount_percentages': this.data.discount_percentages, 
              'freight': this.data.freight,
              'price_with_discount': priceWithDiscount,
              'price_with_freight': this.applyFreight(priceWithDiscount, this.data.freight)
          });

          this.blankValue();
      }
  } 
  // If product list is empty, add the first product
  else {
      let total_price = parseFloat(this.data.mrp) * parseFloat(this.data.qty);
      let priceWithDiscount = this.applyDiscounts(total_price, this.data.discount_percentages);

      this.product_list.push({
          'brand': this.data.brand,
          'product_name': this.data.product_name,
          'weight': this.data.weight,
          'product_code': this.data.product_code,
          'product_id': this.data.id,
          'segment_id': this.data.segment_id,
          'segment_name': this.data.segment_name,
          'thickness': this.data.thickness,
          'product_type': this.data.product_type,
          'id': this.data.id,
          'size': this.data.size,
          'qty': parseFloat(this.data.qty),
          'total_price': total_price, // Set total price for the first item
          'discount_percentages': this.data.discount_percentages,
          'freight': this.data.freight,
          'price_with_discount': priceWithDiscount,
          'price_with_freight': this.applyFreight(priceWithDiscount, this.data.freight)
      });

      this.blankValue();
  }

  // Reset total quantities, weights, and prices
  this.total_qty = 0;
  this.totalWeight = 0;
  this.totalPrice = 0;

  // Recalculate total quantity, weight, and price
  for (let i = 0; i < this.product_list.length; i++) {
      this.total_qty += parseInt(this.product_list[i]['qty']);
      this.totalPrice += parseFloat(this.product_list[i]['total_price']);
  }

  this.applyExtraDiscounts(this.extraDiscountPercentage || 0);
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
          this.listdelete(i)

        }
      }]
    });
    alert.present();
  }
  listdelete(i) {
    this.product_list.splice(i, 1);
    this.total_qty = 0;
    this.totalWeight = 0;
    this.tonWeight = 0;
    this.totalPrice=0
    this.totalGSTApplied = 0;
   
    this.extra_discount_amount = 0;
    this.priceAfterextraDiscount = 0;
    this.totalPriceAfterGST = 0;
    


    for (let i = 0; i < this.product_list.length; i++) {
      this.total_qty += parseInt(this.product_list[i]['qty']);
      this.totalPrice += parseFloat(this.product_list[i]['total_price']);

    }
        // Reapply extra discounts if applicable
        if (this.extraDiscountPercentage > 0) {
          this.applyExtraDiscounts(this.extraDiscountPercentage);
      } else {
          this.totalPriceAfterGST = this.totalPrice; // Reset to total price if no discounts
      }
    console.log(this.extraDiscountPercentage,"line 602")
    
  }




  save_order(type) {

    if (this.userType == 'Sales User') {
      if (this.data.order_type == undefined) {
        return this.service.errorToast("Please Select Order Type");
      }
    }

    this.btndisable = true;
    this.leave = 1
    this.user_data.type = this.data.networkType;

    if (!this.data.remark && !this.disableSelectFromCheckin) {
      this.btnDisableSave = false;
      this.btndisable = false 
      return this.service.errorToast("Please add remarks");
    }

    if (this.data['type_name'].lead_type == "Lead" && this.data['type_name'].type == "3") {
      this.data.delivery_from = this.data.delivery_from.assign_distributor_id;
    } else {
      this.data.delivery_from = this.data['type_name'].assign_distributor_id;
    }
    if (this.navParams.get('checkin_id') || this.navParams.get('site_id')) {
      this.user_data.checkin_order_type = 'secondary'
      this.data.order_type = 'VISIT ORDER'
    } else {
     
      this.data.order_type = 'PHONE ORDER'

    }
    this.user_data.Disctype = this.type;
    this.user_data.order_discount = this.order_discount;
    this.user_data.gst_type = this.data.gst_type;
    this.user_data.SpecialDiscountLable = this.SpecialDiscountLable;
    if (this.navParams.get('fromPage') && this.navParams.get('fromPage') == 'DistSecondary' && this.navParams.get('dr_type') != 1) {

      this.user_data.dr_id = this.data.type_name;
    } else {
      this.user_data.dr_id = this.data.type_name.id;
    }
    if (this.navParams.get('fromPage') && this.navParams.get('fromPage') == 'DistSecondary' && this.navParams.get('dr_type') == 1) {

      this.user_data.distributor_id = this.data.distributor_id;
    } else {
      this.user_data.distributor_id = this.data.distributor_id.id;

    }

    if (this.navParams.get('checkin_id') || this.navParams.get('Dist_login') || this.navParams.get('site_id')) {
      this.user_data.transfer_from_enquiry = this.transfer_from_enquiry
      console.log(this.user_data.transfer_from_enquiry)
    } else {
      this.user_data.transfer_from_enquiry = this.data.type_name.transfer_from_enquiry
      console.log(this.user_data.transfer_from_enquiry)
    }
    this.user_data.remark = this.data.remark;
    this.user_data.site_id = this.site_id;
    this.user_data.totalPrice = this.totalPrice;
    this.user_data.order_type = this.data.order_type;
   
    if (this.data.distributor_id && this.data.delivery_from)
      this.user_data.distributor_id = this.data.delivery_from;

    var orderData = { 'sub_total': this.netamount, 'dis_amt': this.dis_amt, 'grand_total': this.new_grand_total, 'total_gst_amount': this.total_gst_amount, 'total_qty': this.total_qty,'totalPrice': this.totalPrice, 'net_total': this.netamount }
    if (type == 'draft') {
      this.btnDisableDraft = true;
    }
    if (type == 'submit') {
      this.btnDisableSave = true;
    }

    if(this.data.site){
    this.user_data.site_id = this.data.site.site_id 
       }   
    if (this.user_data.type == '17') {
      this.user_data.site_id = this.data.type_name.site_id
    }

    if(this.user_data.type == '8' || this.user_data.type == '13' )
    {
      if(!this.user_data.site_id){
        this.btnDisableSave = false;
      this.btndisable = false
     return this.service.errorToast("Please add Site"); 
     
    }
  }
  this.user_data.extra_discount_amount = this.extra_discount_amount;
  this.user_data.priceAfterextraDiscount = this.priceAfterextraDiscount;
  this.user_data.totalGSTApplied = this.totalGSTApplied;
  this.user_data.totalPriceAfterGST = this.totalPriceAfterGST;
  this.user_data.extraDiscountPercentage = this.extraDiscountPercentage;

    this.service.addData({ "cart_data": this.product_list, "user_data": this.user_data, "checkin_id": this.checkin_id, image: this.selectImage, "type": this.Type }, "AppOrder/secondaryOrdersAdd").then(resp => {

      if (resp['statusCode'] == 200) {
        this.btnDisableDraft = false;
        this.btnDisableSave = false;
        var toastString = ''
        if (this.user_data.order_status == 'Draft') {
          this.service.successToast(resp['statusMsg'])
        }
        else {
          this.service.successToast(resp['statusMsg'])
        }
        this.navCtrl.popTo(SecondaryOrderMainPage)


      } else {
        this.service.errorToast(resp['statusMsg'])
      }
    }, error => {
      this.btndisable = false;
      this.btnDisableDraft = false;
      this.btnDisableSave = false;
      this.service.Error_msg(error);
      this.service.dismiss();
    });
  }


  resetChannel() {
    this.data.distributor_id = '';
    this.data.product_id = '';
    this.product_list = [];
    this.add_list = [];
    this.brandList = [];
    this.colorList = [];
    this.thicknessList = [];
    this.data.site = "";
    this.data.state = "";
  }

  resetForm() {
    this.data.product_id = '';
    this.product_list = [];
    this.add_list = [];
    this.brandList = [];
    this.colorList = [];
    this.thicknessList = [];
    this.data.site = "";
    this.data.state = "";
  }


  applyExtraDiscounts(extraDiscount) {
    // Reset the values
    this.totalGSTApplied = 0;
    this.extraDiscountPercentage = 0;
    this.extra_discount_amount = 0;
    this.priceAfterextraDiscount = 0;
    this.totalPriceAfterGST = 0;

    // Check if extraDiscount is zero or invalid
    if (extraDiscount === 0 || isNaN(extraDiscount)) {
        console.log("Extra discount is zero or invalid, no discount to apply.");
        // this.totalPriceAfterGST = this.totalPrice; // No change in total price
        this.priceAfterextraDiscount = this.totalPrice

        if (this.data.gst_type == 'Gst Paid') {
          this.totalGSTApplied = this.applyGST(parseFloat(this.priceAfterextraDiscount));
          console.log(this.totalGSTApplied, "line 492");
          this.totalPriceAfterGST = this.priceAfterextraDiscount + this.totalGSTApplied;
          console.log(this.totalPriceAfterGST, "line 494");
      } else {
          this.totalGSTApplied = 0;
          this.totalPriceAfterGST = this.priceAfterextraDiscount;
      }
        return;
    }

    // Set the extra discount percentage
    this.extraDiscountPercentage = extraDiscount;

    // Check if totalPrice is zero or invalid
    if (this.totalPrice === 0 || isNaN(this.totalPrice)) {
        console.log("Total price is zero or invalid, no discount or GST to apply.");
        this.totalPriceAfterGST = 0;
        return;
    }

    console.log(this.totalPrice, "line 479");

    // Calculate discount amount based on total price
    let discountAmount = this.totalPrice * (parseFloat(extraDiscount) / 100);
    this.extra_discount_amount = discountAmount;
    console.log(this.extra_discount_amount, "line 486");

    // Calculate price after applying the extra discount
    this.priceAfterextraDiscount = this.totalPrice - this.extra_discount_amount;
    console.log(this.priceAfterextraDiscount, "line 489");

    // Handle GST logic
    if (this.data.gst_type == 'Gst Paid') {
        this.totalGSTApplied = this.applyGST(parseFloat(this.priceAfterextraDiscount));
        console.log(this.totalGSTApplied, "line 492");
        this.totalPriceAfterGST = this.priceAfterextraDiscount + this.totalGSTApplied;
        console.log(this.totalPriceAfterGST, "line 494");
    } else {
        this.totalGSTApplied = 0;
        this.totalPriceAfterGST = this.priceAfterextraDiscount;
    }

    // Optionally save the order
    // this.save_order();
}


  applyGST(price) {
    let gstAmount = price * (18 / 100);
    return gstAmount; // Return the calculated GST amount
  }


}
