import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Navbar, Platform, AlertController, Select, Events, ModalController } from 'ionic-angular';
import { MyserviceProvider } from '../../../providers/myservice/myservice'
import { ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { IonicSelectableComponent } from 'ionic-selectable';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';
import { EndCheckinPage } from '../end-checkin/end-checkin';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { Diagnostic } from '@ionic-native/diagnostic';
import { ConstantProvider } from '../../../providers/constant/constant';
import { SelectRegistrationTypePage } from '../../select-registration-type/select-registration-type';
import { Device } from '@ionic-native/device';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { CameraModalPage } from '../../camera-modal/camera-modal';


declare let cordova:any ;
@IonicPage()
@Component({
  selector: 'page-add-checkin',
  templateUrl: 'add-checkin.html',
})
export class AddCheckinPage {

  @ViewChild('selectComponent') selectComponent: IonicSelectableComponent;
  @ViewChild('selectActivities') selectRef: Select;
  @ViewChild(Navbar) navBar: Navbar;
  userPincode: any
  userPincodeCheck = true;
  showAdd = false;
  savingFlag = false;
  data: any = {};
  distributor_list: any = [];
  distribution_data: any = [];
  Activities: any = [];
  form: any = {};
  listItem: any = {};
  addNewDealer: any = false;
  spinnerLoader: boolean = false;
  distributorList: any = [];
  checkin_data: any = [];
  state_list: any = [];
  division_list: any = [];
  filter: any = []
  filter_category_active: any = false;
  filter_active: any = false;
  AddCheckinForm: FormGroup;
  load_data: any = "0";
  limit = 0;
  hideList: boolean = true
  AddRetailer: boolean = false
  AddLead: boolean = false
  flag: any = '';
  image: any = '';
  district_list: any = [];
  district_list1: any = [];
  customerData: any = [];
  customer_type: any = {};
  pagefrom: any;
  newData: any = {};
  city_list: any = [];
  city_list1: any = [];
  city_list2: any = [];
  networList: any = [];
  influencerArray: any = [];
  TodayDate = new Date().toISOString();
  maxDate = new Date(new Date().getFullYear() + 5, 11, 31).toISOString();
  startimage: any="";
 
  checkinCameraFlag: number = 0;
  tempTypeName: any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public Device:Device,
    public constant: ConstantProvider,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public service: MyserviceProvider,
    public toastCtrl: ToastController,
    public camera: Camera,
    public formBuilder: FormBuilder,
    public modalCtrl: ModalController,
    
    public diagnostic: Diagnostic,
    public platform: Platform,
    public events: Events,
    public locationAccuracy: LocationAccuracy,
    public openNativeSettings: OpenNativeSettings,
    public geolocation: Geolocation, public storage: Storage) {

    this.data = {};
    
console.log(this.influencerArray.length,"length")

this.checkinCameraFlag = this.navParams.get('checkinCameraFlag');
       console.log(this.checkinCameraFlag,"this is flag")
    if (this.navParams.get('data')) {
      console.log(this.navParams.get('data'),"this data")
      this.distribution_data = this.navParams.get('data');
      
      this.data.type = this.distribution_data.type;
      this.data.dr_id = this.distribution_data.id;
      this.data.type_name = { 'company_name': this.distribution_data.company_name };
      this.type_name.company_name = this.distribution_data.company_name;
      this.type_name.name = this.distribution_data.name;
      this.type_name.mobile = this.distribution_data.mobile;
    }
    this.AddCheckinForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      mobile: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])]
    })

  }
  userType: any;
  ionViewDidLoad() {
    this.getNetworkType()
   
    // this.getCityList();
    // this.get_distributor()
    this.storage.get('user_type').then((userType) => {
      if (userType == 'OFFICE') {
        this.data.type = 3;
        this.get_network_list(this.data.type, '')
        this.userType = userType
      }

    });


  }


  loading: any;
  networkType: any = []
  otherType: any = []

  getNetworkType() {
    this.service.presentLoading()
    this.service.addData({}, "AppCheckin/allNetworkModule").then((result => {
      if (result['statusCode'] == 200) {
        this.networkType = result['modules'];
        this.service.dismissLoading()
      } else {
        this.service.dismissLoading()
        this.service.errorToast(result['statusMsg'])
      }
    }))
  }
  category_list: any = []

  typeboolean: any


  get_distributor(search) {
    this.service.presentLoading();
    this.service.addData({ checkin_type: "checkin", dr_type: 1, type_name: "Distributor",'search':search }, 'AppCheckin/getNetworkList').then((resp) => {
      if (resp['statusCode'] == 200) {
        this.distributor_list = resp['result'];
        this.service.dismissLoading();

      } else {
        this.service.dismissLoading();
        this.service.errorToast(resp['statusMsg']);
      }
    }, err => {
      this.service.dismissLoading();
      this.service.errorToast('Something Went Wrong!')
    })

  }

  test(data) {
    this.data.type = data;
    this.string = undefined
    this.get_network_list(data, '') 
    this.typeboolean = false

  }
  getCustomerData(id)
  {
    let Index = this.networList.findIndex(row => row.type == id)
    if(Index != -1){
      this.form.referral_by_type = this.networList[Index]['module_name']
    }
    this.service.addData({'type':id},'AppEnquiry/drList').then((result)=>{
      
      if(result['statusCode'] == 200){
        this.customerData = result['distributor'];
      }
      else{
        this.service.errorToast(result['statusMsg']);
        // this.serve.dismissLoading();
      }
      
    }, error => {
      this.service.Error_msg(error);
      this.service.dismiss();
    });
  }
  getNetworkList()
  {
    this.service.addData({},'AppEnquiry/networkList').then((result)=>{
      if(result['statusCode'] == 200){
        this.networList = result['result'];
      }
      else{
        this.service.errorToast(result['statusMsg']);
      }
      
    }, error => {
      this.service.Error_msg(error);
      this.service.dismiss();
    });
  }
  getRegisterdData(id)
  {
    let Index = this.networList.findIndex(row => row.type == id)
    if(Index != -1){
      this.form.registered_by_type = this.networList[Index]['module_name']
    }
    this.service.addData({'type':id},'AppEnquiry/drList').then((result)=>{
      
      if(result['statusCode'] == 200){
        this.customerData = result['distributor'];
      }
      else{
        this.service.errorToast(result['statusMsg']);
        // this.serve.dismissLoading();
      }
      
    }, error => {
      this.service.Error_msg(error);
      this.service.dismiss();
    });
  }
  updateStatusBasedOnDate() {
    const selectedDate = new Date(this.form.estimate_delivery_date);
    const currentDate = new Date();

    const differenceInDays = Math.floor(
      (selectedDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (differenceInDays <= 20) {
      this.form.priority = 'Hot';
    } else if (differenceInDays <= 40) {
      this.form.priority = 'Warm';
    } else {
      this.form.priority = 'Cold';
    }
  }
  image_data: any = [];

  fileChange(img) {
    this.image_data.push(img);
    this.image = "";
    this.form.image_data = this.image_data
  }

  remove_image(i: any) {
    this.image_data.splice(i, 1);
  }
  remove_startimage(i: any) {
    this.startimage="";
  }
  takePhotoStart(type) {
    let modal = this.modalCtrl.create(CameraModalPage,{'type':type});

    modal.onDidDismiss(data => {
  
      if (data != undefined && data != null) {  
        this.startimage = data  
     
      
    }
    
    
      
    });

    modal.present();
  }
   takePhotoStartnew(type,formdata) {
    let modal = this.modalCtrl.create(CameraModalPage,{'type':type});

    modal.onDidDismiss(data => {
     
      if (data != undefined && data != null) {  
        this.startimage = data  
   
        this.startvisit(formdata)
        // this.startVisitAlert(formdata)
        this.savingFlag = true
         

      
    }
    
    
      
    });

    modal.present();
  }

  cameraModal(type) {
    let modal = this.modalCtrl.create(CameraModalPage,{'type':type});

    modal.onDidDismiss(data => {
    
      if (data != undefined && data != null) {  
        this.image = data  
        if (this.image) {
          this.image_data.push(this.image)
          this.image = "";
          this.form.image_data = this.image_data
        }
    }
    
    
      
    });

    modal.present();
  }
  takePhoto() {
    this.diagnostic.requestCameraAuthorization().then((isAvailable: any) => {
    this.image = [];
    
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 500,
      targetHeight: 400
    }
    if(this.Device.platform=='Android'){
        cordova.plugins.foregroundService.start('Camera', 'is running');
      }
    this.camera.getPicture(options).then((imageData) => {
      this.image = 'data:image/jpeg;base64,' + imageData;
      if(this.Device.platform=='Android'){
      cordova.plugins.foregroundService.stop();
      }
      
      if (this.image) {
        this.image_data.push(this.image)
        this.image = "";
        this.form.image_data = this.image_data
      }

    }, (err) => {
      this.service.presentToast('Image Failed to upload');
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

  distributor_network_list: any = [];
  string: any = {}
  search: any = {}
  object_data: any = {}
  get_network_list(network_type, search) {
    this.data.type_name = {};
    let index = this.networkType.findIndex(row => row.type == network_type);
    if (index != -1) {
      this.newData.distribution_type = this.networkType[index].distribution_type;
      this.newData.module_name = this.networkType[index].module_name;
      this.newData.type = this.networkType[index].type;
    }
    if (network_type != 'Other') {
      let String = ''
      if (!this.string) {
        let String = ''
      } else {
        String = this.string.value
      }
      if (this.newData.type == 1 || this.newData.type == 8 || this.newData.type == 13 || this.newData.type == 14 || this.newData.type == 16 || this.newData.type == 15) {
        this.showAdd = true
      } else {
        this.showAdd = false
      }
      this.service.addData({ 'dr_type': Number(this.data.type), 'type_name': this.newData.distribution_type, 'checkin_type': 'checkin', 'filter': this.string,'search':search }, 'AppCheckin/getNetworkList').then((result) => {
        this.distributor_network_list = result['result'];
        this.object_data.display_name = 'Add New Retailer'
        this.object_data.new_counter = 'TRUE'
        for (let i = 0; i < this.distributor_network_list.length; i++) {
          // this.distributor_network_list[i] =  this.object_data
          if(this.newData.type == 1){
          this.distributor_network_list[i].display_name = this.distributor_network_list[i].display_name + '  ' + '(' + this.distributor_network_list[i].customer_type+ ')';
        }
          if ((this.distributor_network_list[i].display_name == null || this.distributor_network_list[i].display_name == '') && (this.distributor_network_list[i].name != "" || this.distributor_network_list[i].mobile != "")) {
            this.distributor_network_list[i].display_name = this.distributor_network_list[i].display_name + '  ' + '(' + this.distributor_network_list[i].customer_type + ')';
            this.distributor_network_list[i].display_name = this.distributor_network_list[i].name + '  ' + '(' + this.distributor_network_list[i].mobile + ')'+ '  ' + '(' + this.distributor_network_list[i].customer_type + ')';
          }
        }
        this.filter = []
        this.open();
      });
    }
  }
  MobileNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }
  }

  save_retailer() {
    this.savingFlag = true
    // if (this.newData.type == 8 ||this.newData.type == 13 || this.newData.type == 14 ) {
    //   if (!this.form.assign_dr_id) {
    //     this.service.errorToast('Please Select Distributor!')
    //   }
    // this.form.assign_dr_id = this.form.assign_dr_id.id
    // }
    if(this.newData.type == 8){
      this.form.company_name = this.form.name
    }

    this.form.display_name = this.form.company_name + "-" + this.form.name + "-" + this.form.mobile
    this.form.type_id = this.newData.type;
    this.service.addData({ "data": this.form }, "AppCheckin/addDealer")
      .then(resp => {
        if (resp['statusCode'] == 200) {
         
          this.form.dr_id = resp['result']['dr_id']
          this.form.display_name = this.form.company_name + "-" + this.form.name + "-" + this.form.mobile
          this.form.dr_type = this.newData.type
          this.form.dr_type_name = this.newData.module_name
          this.form.mobile = this.newData.module_name
          this.form.new_counter = "TRUE"
          this.form.type_name = this.newData.distribution_type
          // this.startVisitAlert(this.form)
             if(this.checkinCameraFlag==1){
       this.takePhotoStartnew('camera', this.form)
          }
          else{
              this.startvisit(this.form)
          }
        } else {
          this.savingFlag = false
          this.service.errorToast(resp['statusMsg']);
        }
      },
        error => {
          this.service.Error_msg(error);
          this.savingFlag = false
        })
  }

  saveSite(){

    this.savingFlag = true;
    // this.form.referral_by_name = this.form.ownerName
    // this.form.referral_by = this.form.referral_by.id
    if (this.form.referral_by && this.form.referral_by.id) {
      this.form.referral_by = this.form.referral_by.id;
  } else {
      // Handle the case where referral_by or its id property is undefined
      console.error("Referral information is missing or incomplete.");
  }
    if(this.form.influencer_detail == 'Registered'){
      this.form.influencer_name = this.form.influencer_id.display_name
      this.form.influencer_id = this.form.influencer_id.id
    }
    if (this.form.influencer_detail != 'None') {
      this.form.influencerArray = this.influencerArray;
    }
 
    this.service.addData({ "data": this.form }, 'AppCheckin/addSite')
      .then(resp => {
        if (resp['statusCode'] == 200) {
          this.savingFlag = false;
          this.form.dr_id = resp['dr_id']
          this.form.company_name = this.form.ownerName
          this.form.dr_name = this.form.ownerName
          this.form.mobile = this.form.ownerMobile
          this.form.display_name = this.form.ownerName
          this.form.dr_type = this.newData.type
          this.form.dr_type_name = this.newData.module_name
          this.form.mobile = this.newData.module_name
          this.form.new_counter = "TRUE"
          this.form.type_name = this.newData.distribution_type
          this.form.type_id = this.newData.type;
        
          // this.startVisitAlert(this.form)
          console.log(this.checkinCameraFlag,"this is flag")
         if(this.checkinCameraFlag==1){
 this.takePhotoStartnew('camera', this.form)
          }
          else{
              this.startvisit(this.form)
          }
         

        } else {
          this.savingFlag = false;
          this.service.errorToast(resp['statusMsg']);
        }
      }, error => {
        this.savingFlag = false;
        this.service.Error_msg(error);
        this.service.dismiss();
      })
   
  }
  addToList() {
    if ((this.form.influencer_detail == 'Registered' || this.form.influencer_detail == 'Unregistered') && !this.listItem.registered_by_type_id) {
      this.service.errorToast('Profile type is required');
      return
    }



    if (this.form.influencer_detail == 'Unregistered' && !this.listItem.company_name) {
      this.service.errorToast('Influencer name is required');
      return
    }
    if (this.form.influencer_detail == 'Unregistered' && !this.listItem.mobile) {
      this.service.errorToast('Mobile number is required');
      return
    }
    if (this.form.influencer_detail == 'Unregistered' && !this.listItem.address) {
      this.service.errorToast('Address is required');
      return
    }
    if (this.form.influencer_detail == 'Unregistered' && !this.listItem.pincode) {
      this.service.errorToast('Pincode is required');
      return
    }
    if (this.form.influencer_detail == 'Unregistered' && !this.listItem.state) {
      this.service.errorToast('State is required');
      return
    }
    if (this.form.influencer_detail == 'Unregistered' && !this.listItem.district) {
      this.service.errorToast('District is required');
      return
    }
    if (this.form.influencer_detail == 'Unregistered' && !this.listItem.city) {
      this.service.errorToast('City is required');
      return
    }
    if (this.form.influencer_detail == 'Registered' && !this.form.influencer_id) {
      this.service.errorToast('Select influencer first');
      return
    }


    if (this.influencerArray.length > 0) {
      let Index = this.influencerArray.findIndex(row => row.mobile == (this.form.influencer_detail == 'Registered' ? this.form.influencer_id.mobile : this.listItem.mobile))
      if (Index == -1) {
        this.influencerArray.push(this.form.influencer_detail == 'Registered' ? this.form.influencer_id :
          {
            "registered_by_type_id": this.listItem.registered_by_type_id,
            "company_name": this.listItem.company_name,
            "mobile": this.listItem.mobile,
            "address": this.listItem.address,
            "pincode": this.listItem.pincode,
            "state": this.listItem.state,
            "district": this.listItem.district,
            "city": this.listItem.city
          });

        this.blankValue();

      }
      else {
        this.service.errorToast('Already added');
        return
      }
    }
    else {
      this.influencerArray.push(this.form.influencer_detail == 'Registered' ? this.form.influencer_id :
        {
          "registered_by_type_id": this.listItem.registered_by_type_id,
          "company_name": this.listItem.company_name,
          "mobile": this.listItem.mobile,
          "address": this.listItem.address,
          "pincode": this.listItem.pincode,
          "state": this.listItem.state,
          "district": this.listItem.district,
          "city": this.listItem.city
        });
      this.blankValue();
    }
  }
  deleteItem(i) {
    this.influencerArray.splice(i, 1);
    this.service.successToast('Deleted');
  }
  blankValue() {
    this.form.influencer_id = '';
    this.listItem.company_name = '';
    this.listItem.mobile = '';
    this.listItem.address = '';
    this.listItem.city = '';
    this.listItem.state = '';
    this.listItem.district = '';
    this.listItem.pincode = '';

  }
  onAddPort(event) {
    this.get_distributor('')
    if(this.newData.type == 15){
      this.AddLead = true

    }else{

      this.AddRetailer = true
    }
     this.getNetworkList()
    this.get_states();
    this.get_division();
    this.get_district();
    this.get_district_influencer();
    this.selectComponent.close();
  }
  open() {
    this.selectComponent.open();
  }
  load: any = "0";
  type_name: any = {};

  other_name: any = '';
  dr_name: any
  other(name, type_name) {
    this.hideList = false
    this.type_name = type_name;
    this.load = "1";
    this.dr_name = name
   
  }


  checkExist = false
  error: any



  startVisitAlert(newRetailer) {
    this.spinnerLoader = true;
    this.platform.ready().then(() => {
      if(this.Device.platform=='Android'){
      var whiteList = [];

      (<any>window).gpsmockchecker.check(whiteList, (result) => {
        if (result.isMock) {
          let alert = this.alertCtrl.create({
            title: 'Alert!',
            subTitle: 'Please Remove Third Party Location Apps',
            buttons: [
              {
                text: 'Ok',
                handler: () => {
                  this.service.addData({ 'app_name': result.mocks[0]['name'], 'package_name': result.mocks[0]['package'] }, 'Login/thirdPartyDisabled').then((result) => {
                    if (result['statusCode'] == 200) {
                      this.storage.set('token', '');
                      this.storage.set('role', '');
                      this.storage.set('displayName', '');
                      this.storage.set('role_id', '');
                      this.storage.set('name', '');
                      this.storage.set('type', '');
                      this.storage.set('token_value', '');
                      this.storage.set('userId', '');
                      this.storage.set('token_info', '');
                      this.constant.UserLoggedInData = {};
                      this.constant.UserLoggedInData.userLoggedInChk = false;
                      this.events.publish('data', '1', Date.now());
                      this.service.errorToast("Your account is blocked");
                      this.navCtrl.setRoot(SelectRegistrationTypePage);
                    } else {
                      this.service.errorToast(result['statusMsg'])
                    }
                  },
                    error => {
                      this.service.Error_msg(error);
                    })
                }
              }
            ]
          });
          alert.present();
        }
        else {
         this.startvisit(newRetailer)
        }



      }, (error) => console.log(error));
    }else{
      this.startvisit(newRetailer)

    }
    });


  }
  startvisit(newRetailer){
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(() => {

      let options = { maximumAge: 10000, timeout: 15000, enableHighAccuracy: true };
      this.geolocation.getCurrentPosition(options).then((resp) => {


        var lat = resp.coords.latitude
        var lng = resp.coords.longitude

        if (this.distribution_data == '') {
          if (newRetailer != 'blank') {
            this.data.dr_id = newRetailer.dr_id;
            this.data.dr_name = newRetailer.dr_name;
            this.data.dr_type_name = newRetailer.dr_type_name;
            this.data.mobile = newRetailer.mobile;
            this.data.new_counter = newRetailer.new_counter;
            this.data.display_name = newRetailer.display_name;
          } else {
            this.data.dr_id = this.data.type_name.id;
            this.data.dr_name = this.data.type_name.name;
            this.data.new_counter = this.data.type_name.new_counter;
            this.data.display_name = this.data.type_name.display_name;
            this.data.mobile = this.data.type_name.mobile;
            this.data.dr_type_name = this.newData.module_name;
              this.tempTypeName=this.data.type_name
            this.data.type_name = this.newData.distribution_type;
          }
          this.data.lat = lat;
          this.data.lng = lng;
      
            
    
          this.service.addData({ 'lat': this.data.lat, 'lng': this.data.lng,'mobile':this.data.mobile, 'dr_type_name': this.data.dr_type_name, 'type_name': this.data.type_name, 'dr_type': this.data.type, 'activity_type': this.data.activity_type, 'dr_id': this.data.dr_id, 'new_counter': this.data.new_counter, 'display_name': this.data.display_name,'other_name': this.form.display_name ,'start_image':this.startimage }, 'AppCheckin/startVisitNew').then((result) => {

            if (result['statusCode'] == 200) {
              this.spinnerLoader = false;

              if (this.navCtrl.getViews().length >= 2) {
                this.navCtrl.remove(1, 1, { animate: false })
                // this.navCtrl.pop({ animate: false })
                this.navCtrl.push(EndCheckinPage, { 'data': this.checkin_data });
              }
              this.navCtrl.push(EndCheckinPage, { 'data': this.checkin_data });
              this.service.dismissLoading();
              this.service.successToast(result['statusMsg']);
              this.savingFlag = false
            }
            else {
                this.data.type_name= this.tempTypeName
              this.spinnerLoader = false;
              this.service.dismissLoading();
              this.service.errorToast(result['statusMsg'])
              this.savingFlag = false
            }

          }, error => {
              this.data.type_name= this.tempTypeName
            this.spinnerLoader = false;
            this.service.Error_msg(error);
            this.service.dismissLoading();
            this.savingFlag = false
          });
        }

      }).catch((error) => {
        this.spinnerLoader = false;
        this.service.dismissLoading();
        // this.presentConfirm('Turn On Location permisssion !', 'please go to <strong>Settings</strong> -> Location to turn on <strong>Location permission</strong>')
        this.geolocation.watchPosition(options).subscribe((resp) => {
          var lat = resp.coords.latitude
          var lng = resp.coords.longitude
          if (this.distribution_data == '') {
            if (newRetailer != 'blank') {
              this.data.dr_id = newRetailer.dr_id;
              this.data.dr_name = newRetailer.dr_name;
              this.data.dr_type_name = newRetailer.dr_type_name;
              this.data.mobile = newRetailer.mobile;
              this.data.new_counter = newRetailer.new_counter;
              this.data.display_name = newRetailer.display_name;
            } else {
              this.data.dr_id = this.data.type_name.id;
              this.data.dr_name = this.data.type_name.name;
              this.data.new_counter = this.data.type_name.new_counter;
              this.data.display_name = this.data.type_name.display_name;
              this.data.mobile = this.data.type_name.mobile;
              this.data.dr_type_name = this.newData.module_name;
                this.tempTypeName=this.data.type_name
              this.data.type_name = this.newData.distribution_type;
            }
            this.data.lat = lat;
            this.data.lng = lng;
            // this.data.type
            console.log(this.data,"this is data 2");
            console.log(this.data.type_name,"this is data 2");

            this.service.addData({ 'lat': this.data.lat, 'lng': this.data.lng,'mobile':this.data.mobile, 'dr_type_name': this.data.dr_type_name, 'type_name': this.data.type_name, 'dr_type': this.data.type, 'activity_type': this.data.activity_type, 'dr_id': this.data.dr_id, 'new_counter': this.data.new_counter, 'display_name': this.data.display_name,'other_name': this.form.display_name,'start_image':this.startimage  }, 'AppCheckin/startVisitNew').then((result) => {
              if (result['statusCode'] == 200) {
                this.spinnerLoader = false;
                if (this.navCtrl.getViews().length >= 2) {
                  this.navCtrl.remove(1, 1, { animate: false })
                  this.navCtrl.pop({ animate: false })
                }
                this.navCtrl.push(EndCheckinPage, { 'data': this.checkin_data });
                this.service.dismissLoading();
                this.service.successToast(result['statusMsg']);
                this.savingFlag = false
              }
              else {
                  this.data.type_name= this.tempTypeName
                this.spinnerLoader = false;
                this.service.dismissLoading();
                this.service.errorToast(result['statusMsg'])
                this.savingFlag = false
              }
            }, error => {
                this.data.type_name= this.tempTypeName
              this.spinnerLoader = false;
              this.service.Error_msg(error);
              this.service.dismissLoading();
              this.savingFlag = false
            });
          }

        } , err=>{
          this.presentConfirm('Turn On Location permisssion !', JSON.stringify(error));
          this.savingFlag = false
          
        })
      });
    },
      error => {
          this.data.type_name= this.tempTypeName
        this.spinnerLoader = false;
        this.service.dismissLoading();
        this.service.errorToast('Allow Location Permission')
        this.savingFlag = false
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
  form1: any = {};

  // getSateteDistrcit() {
  //   if (this.form.pincode.length == 6) {
  //     this.form1.pincode = this.form.pincode;
  //     this.service.addData(this.form1, "AppCustomerNetwork/getStateDistict")
  //       .then(resp => {
  //         if (resp['statusCode'] == 200) {
  //           this.form.state = resp['result'].state_name;
  //           this.form.district = resp['result'].district_name;
  //           this.form.city = resp['result'].city;
  //         } else {
  //           this.service.errorToast(resp['statusMsg']);
  //         }
  //       },
  //         err => {
  //           this.service.errorToast('Something Went Wrong!')
  //         });
  //   }

  // }
  getSateteDistrcit() {
    if(this.form.pincode){
      this.form1.pincode = this.form.pincode;
    }
    if (this.form.owner_pincode) {
      this.form1.pincode = this.form.owner_pincode;
    }
    if (this.listItem.pincode) {
      this.form1.pincode = this.listItem.pincode
    }
    this.service.addData(this.form1, "AppEnquiry/getPostalInfo")
      .then(resp => {
        if (resp['statusCode'] == 200) {
          if (this.form.influencer_detail) {
            this.listItem.state = resp['result'].state_name;
            this.listItem.district = resp['result'].district_name;
            this.getCityList1()
            // this.getCityList2()
            this.listItem.city = resp['result'].city;
            this.get_division()
          }
          else {
            this.form.owner_state = resp['result'].state_name;
            this.form.owner_district = resp['result'].district_name;
            this.getCityList1()
           
            this.form.owner_city = resp['result'].city;
            this.form.state = resp['result'].state_name;
            this.form.district = resp['result'].district_name;
            // this.getCityList2()
            this.form.city = resp['result'].city;
            this.get_division()

          }
        } else {

          // this.service.errorToast(resp['statusMsg']);

        }
      },
        err => {
          // this.service.errorToast('Something Went Wrong!')
        });

  }
  getSateteDistrcit1() {
    if (this.listItem.pincode) {
      this.form1.pincode = this.listItem.pincode
    }
    this.service.addData(this.form1, "AppEnquiry/getPostalInfo")
      .then(resp => {
        if (resp['statusCode'] == 200) {
          
            this.listItem.state = resp['result'].state_name;
            this.listItem.district = resp['result'].district_name;
            this.getCityListInfluencer()
            
            
            this.listItem.city = resp['result'].city;
        
        } else {

          // this.service.errorToast(resp['statusMsg']);

        }
      },
        err => {
          // this.service.errorToast('Something Went Wrong!')
        });

  }
  getCityList1() {
    this.form.city1 = [];

    let state
    let district
    let pincode

    if (this.form.state) {
      state = this.form.state;
    }
    if (this.form.district) {
      district = this.form.district;
    }
    if (this.form.pincode) {
      pincode = this.form.pincode;
    }
    if (this.form.owner_pincode) {
      pincode = this.form.owner_pincode;
    }
    if (this.form.owner_state) {
      state = this.form.owner_state;
    }
    if (this.form.owner_district) {
      district = this.form.owner_district;
    }
    if (this.listItem.state) {
      state = this.listItem.state;
    }
    if (this.listItem.district) {
      district = this.listItem.district;
    }

    this.service.addData({ 'district_name': district, 'state_name': state,'pincode':pincode }, 'AppCustomerNetwork/get_city_list').then((result) => {
      if (result['statusCode'] == 200) {
        this.city_list1 = result['city'];
      } else {
        this.service.errorToast(result['statusMsg']);

      }


    }, err => {
      this.service.errorToast('Something Went Wrong!')
    });

  }
  getCityList2() {
    this.form.city1 = [];

    this.service.addData({ 'district_name': this.form.district, 'state_name': this.form.state,'pincode':this.form.pincode }, 'AppCustomerNetwork/get_city_list').then((result) => {
      if (result['statusCode'] == 200) {
        this.city_list1 = result['city'];
      } else {
        this.service.errorToast(result['statusMsg']);

      }


    }, err => {
      this.service.errorToast('Something Went Wrong!')
    });

  }
  getCityListInfluencer() {
    this.form.city1 = [];

    this.service.addData({ 'district_name': this.listItem.district, 'state_name': this.listItem.state,'pincode':this.listItem.pincode }, 'AppCustomerNetwork/get_city_list').then((result) => {
      if (result['statusCode'] == 200) {
        this.city_list2 = result['city'];
      } else {
        this.service.errorToast(result['statusMsg']);

      }


    }, err => {
      this.service.errorToast('Something Went Wrong!')
    });

  }
  get_states() {
    this.service.addData({}, "AppCustomerNetwork/getWorkingStates")
      .then(resp => {
        if (resp['statusCode'] == 200) {
          this.state_list = resp['state_list'];
        } else {
        }
      }, error => {
        this.service.Error_msg(error);
      })
  }
  searchParty(text){
    console.log(text,"text")
    if(text !=''){
  this.get_network_list(this.data.type,text);
    }
    
  }

  
  get_division() {
    this.service.addData({'city':this.form.city}, "AppCustomerNetwork/getAllDivison")
      .then(resp => {
        if (resp['statusCode'] == 200) {
          this.division_list = resp['data'];
          if(this.division_list.length>0){
            this.form.division_name=[this.division_list[0].division_name];
          }
          
        } else {
        }
      }, error => {
        this.service.Error_msg(error);
      })
  }

  get_district1() {



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
  get_district_influencer(){
    this.service.addData({ "state_name": this.listItem.state }, "AppCustomerNetwork/getDistrict")
          .then(resp => {
            if (resp['statusCode'] == 200) {
              this.district_list1 = resp['district_list'];
            } else {
              this.service.errorToast(resp['statusMsg']);
            }
          },
            err => {
              this.service.errorToast('Something Went Wrong!')
            })

  }

  get_district() {
    let state
        if (this.form.state) {
          state = this.form.state;
        }
        if (this.listItem.state) {
          state = this.listItem.state;
        }
        if (this.form.owner_state) {
          state = this.form.owner_state;
        }
    
    
        this.service.addData({ "state_name": state }, "AppCustomerNetwork/getDistrict")
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

}
