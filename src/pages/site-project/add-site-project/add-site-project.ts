import { Component, ViewChild } from '@angular/core';
import { ActionSheetController, AlertController, IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { MyserviceProvider } from '../../../providers/myservice/myservice';
import { SiteProjectListPage } from '../site-project-list/site-project-list';
import { ConstantProvider } from '../../../providers/constant/constant';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Geolocation } from '@ionic-native/geolocation';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { Device } from '@ionic-native/device';
import { Diagnostic } from '@ionic-native/diagnostic';
import { CameraModalPage } from '../../camera-modal/camera-modal';
import { IonicSelectableComponent } from 'ionic-selectable';
declare let cordova: any;
/**
 * Generated class for the AddSitePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-site',
  templateUrl: 'add-site-project.html',
})
export class AddSiteProjectPage {
  @ViewChild('referralSelectable') referralSelectable: IonicSelectableComponent;
  form: any = {}
  district_list: any = []
  district_list1: any = []
  area_list: any = []
  city_list: any = []
  city_list1: any = []
  city_list2: any = []
  isValidNumber: any = {};
  assignedContact: any = {}
  assignedContactsList: any = []
  customerData: any = []
  state_list: any = []
  networList: any = []
  today_date = new Date().toISOString().slice(0, 10);
  savingFlag: boolean = false;
  locationFlag: boolean = false;
  checkin_disabled: boolean = false;
  showInfluencerDetail: boolean = true;
  siteId: any = ''
  TodayDate = new Date().toISOString();
  maxDate = new Date(new Date().getFullYear() + 5, 11, 31).toISOString();
  listItem: any = {};
  influencerArray: any = [];
  transfer_from_enquiry: any;

  virtualLeadSelected: boolean = false;
  userID: any;
  search: any='';





  constructor(public modalCtrl:ModalController,public diagnostic: Diagnostic,public Device:Device,public navCtrl: NavController, public locationAccuracy: LocationAccuracy, public openNativeSettings: OpenNativeSettings, public geolocation: Geolocation, public camera: Camera, public constant: ConstantProvider, public actionSheetCtrl: ActionSheetController, public alertCtrl: AlertController, public navParams: NavParams, public serve: MyserviceProvider) {

    this.form.image_data = []
    console.log('formdata is', this.form)
    this.userID = this.navParams.get('userID')
    console.log(this.userID)
  }
  ionViewDidEnter() {
    this.getNetworkList()
    if (this.navParams.get('checkin_id')) {
      this.form.checkin_id = this.navParams.get('checkin_id')
      this.checkin_disabled = true
      this.form.lead_source = 'Reference'
      this.form.referral_by_type_id = this.navParams.get('dr_type')
      this.form.referral_by_type = this.navParams.get('dr_type_name')
      this.form.referral_by_type = this.navParams.get('dr_type_name')
      this.getNetworkList()
      this.getCustomerData(this.form.referral_by_type_id)
      this.form.referral_by = { 'id': this.navParams.get('dr_id'), 'display_name': this.navParams.get('dr_name') }
      console.log(this.form.referral_by, this.form.referral_by_type_id, "this is from checkin data")
    }
    this.userID = this.navParams.get('userID')
    console.log(this.userID)
  }
  ionViewDidLoad() {
    if (this.navParams.data.from == "EditSitePage") {

      this.siteId = this.navParams.data.id
      this.showInfluencerDetail = false
     
      this.site_detail();


      this.get_states();
    }
    else {
      this.get_district();
      this.get_district_influencer();
   
      this.get_states();
    }
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


  currentLocationData: any = {}

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
  onLeadSourceChange() {
    this.virtualLeadSelected = this.form.lead_source === 'Virtual Lead';
    

  }
  site_detail() {
    this.serve.addData({ 'id': this.siteId, search: '' }, 'AppEnquiry/getSiteDetail').then((result) => {
      if (result['statusCode'] == 200) {
        if (result['data']['assigned_to_influencer_id'] == 0) {
          this.showInfluencerDetail = true;
        }
        if (result['data']['influencerArray'].length > 0) {
          for (let index = 0; index < result['data']['influencerArray'].length; index++) {
            this.influencerArray.push({
              "registered_by_type_id": result['data']['influencerArray'][index].assigned_to_influencer_type,
              "id": result['data']['influencerArray'][index].assigned_to_influencer_id,
              "company_name": result['data']['influencerArray'][index].assigned_to_influencer_name,
              "mobile": result['data']['influencerArray'][index].assigned_to_influencer_mobile,
              "address": '',
              "pincode": '',
              "state": '',
              "district": '',
              "city": ''
            })
          }
        }
        this.form = result['data'];
        this.transfer_from_enquiry=result['data']['transfer_from_enquiry']
        if(this.transfer_from_enquiry){
          this.form.lead_source='Virtual Lead';
          this.checkin_disabled = true
        }


        this.form.owner_address = result['data']['address']
        this.form.owner_state = result['data']['state']
        this.form.owner_district = result['data']['district']
        this.form.owner_pincode = result['data']['pincode']
        this.form.owner_city = result['data']['city']
        if (this.form.owner_state) {
          this.get_district();
          this.getCityList1()
        }

        this.form.referral_by = { "id": this.form.referral_by, 'display_name': this.form.referral_by_name }
        this.form.influencer_id = { "id": this.form.influencer_id, 'display_name': this.form.registered_by_name }
        if (this.form.referral_by_type_id) {

          this.getCustomerData(this.form.referral_by_type_id);
        }

        for (let index = 0; index < this.form.images.length; index++) {
          this.image_data.push(this.form.images[index]['image'])
        }
      }
      else {
        this.serve.errorToast(result['statusMsg']);
      }

    }, error => {
      this.serve.Error_msg(error);
      this.serve.dismiss();
    });
  }
  getNetworkList() {
    this.serve.addData({}, 'AppEnquiry/networkList').then((result) => {
      if (result['statusCode'] == 200) {
        this.networList = result['result'];
      }
      else {
        this.serve.errorToast(result['statusMsg']);
      }

    }, error => {
      this.serve.Error_msg(error);
      this.serve.dismiss();
    });
  }
  getCustomerData(id) {
    let Index = this.networList.findIndex(row => row.type == id)
    if (Index != -1) {
      this.form.referral_by_type = this.networList[Index]['module_name']
    }
    this.serve.addData({ 'type': id,'search':this.search,'limit':'20' }, 'AppEnquiry/drList').then((result) => {

      if (result['statusCode'] == 200) {
        this.customerData = result['distributor'];
        console.log(this.customerData,'customerData');
      }
      else {
        this.serve.errorToast(result['statusMsg']);
        // this.serve.dismissLoading();
      }

    }, error => {
      this.serve.Error_msg(error);
      this.serve.dismiss();
    });
  }
  getRegisterdData(id) {
    let Index = this.networList.findIndex(row => row.type == id)
    if (Index != -1) {
      this.form.registered_by_type = this.networList[Index]['module_name']
    }
    this.serve.addData({ 'type': id }, 'AppEnquiry/drList').then((result) => {

      if (result['statusCode'] == 200) {
        this.customerData = result['distributor'];
      }
      else {
        this.serve.errorToast(result['statusMsg']);
        // this.serve.dismissLoading();
      }

    }, error => {
      this.serve.Error_msg(error);
      this.serve.dismiss();
    });
  }

  MobileNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }
  }

  checkMobileNumber(fieldName: string, event: string) {
    // console.log('fieldname',fieldName);
    // console.log('event',event);
    if (event && event.length == 10) {
      let pattern = /[A-z]| |\W|[!@#\$%\^\&*\)\(+=._-]+/;
      let hasSpace = event.search(pattern);
      if (hasSpace != -1) {
        this.isValidNumber[fieldName] = false;
      } else {
        this.isValidNumber[fieldName] = true;
      }
    } else {
      this.isValidNumber[fieldName] = false;
    }
  }

  get_states() {
    this.serve.presentLoading()
    this.serve.addData({}, "AppCustomerNetwork/getWorkingStates")
      .then(resp => {
        if (resp['statusCode'] == 200) {
          this.serve.dismissLoading()
          this.state_list = resp['state_list'];


        } else {
          this.serve.dismissLoading()
          this.serve.errorToast(resp['statusMsg']);
        }
      }, error => {
        this.serve.Error_msg(error);
        this.serve.dismiss();
      })
  }
  getCityList() {
    this.form.city1 = [];
    this.serve.addData({ 'district_name': this.form.district, 'state_name': this.form.state }, 'AppCustomerNetwork/getCity').then((result) => {
      if (result['statusCode'] == 200) {
        this.city_list = result['city'];
      } else {
        this.serve.errorToast(result['statusMsg']);

      }


    }, err => {
      this.serve.errorToast('Something Went Wrong!')
    });

  }
  getCityList1() {
    this.form.city1 = [];

    let state
    let district

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

    this.serve.addData({ 'district_name': district, 'state_name': state,'pincode':this.form.owner_pincode }, 'AppCustomerNetwork/get_city_list').then((result) => {
      if (result['statusCode'] == 200) {
        this.city_list1 = result['city'];
      } else {
        this.serve.errorToast(result['statusMsg']);

      }


    }, err => {
      this.serve.errorToast('Something Went Wrong!')
    });

  }
  getCityListInfluencer() {
    this.form.city1 = [];

    let state
    let district

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

    this.serve.addData({ 'district_name': this.listItem.district, 'state_name': this.listItem.state,'pincode':this.listItem.pincode }, 'AppCustomerNetwork/get_city_list').then((result) => {
      if (result['statusCode'] == 200) {
        this.city_list2 = result['city'];
      } else {
        this.serve.errorToast(result['statusMsg']);

      }


    }, err => {
      this.serve.errorToast('Something Went Wrong!')
    });

  }
  form1: any = {};

  get_district() {


    let state

    if (this.form.owner_state) {
      state = this.form.owner_state;
    }
    if (this.listItem.state) {
      state = this.listItem.state;
    }


    this.serve.addData({ "state_name": state }, "AppCustomerNetwork/getDistrict")
      .then(resp => {
        if (resp['statusCode'] == 200) {
          this.district_list = resp['district_list'];
        } else {
         // this.serve.errorToast(resp['statusMsg']);
        }
      },
        err => {
         // this.serve.errorToast('Something Went Wrong!')
        })
  }
  get_district_influencer() {


   


    this.serve.addData({ "state_name": this.listItem.state }, "AppCustomerNetwork/getDistrict")
      .then(resp => {
        if (resp['statusCode'] == 200) {
          this.district_list1 = resp['district_list'];
        } else {
         // this.serve.errorToast(resp['statusMsg']);
        }
      },
        err => {
         // this.serve.errorToast('Something Went Wrong!')
        })
  }

  selectarea() {
    this.form1.state = this.form.state;
    this.form1.district = this.form.district;
    this.form1.city = this.form.city;
    this.serve.addData(this.form1, "AppCustomerNetwork/getArea")
      .then(resp => {
        if (resp['statusCode'] == 200) {
          this.area_list = resp['area'];
          this.form.area = '';
        } else {
          this.serve.errorToast(resp['statusMsg']);

        }
      },
        err => {
          this.serve.errorToast('Something Went Wrong!')
        })
  }

  getSateteDistrcit() {
    if (this.form.owner_pincode) {
      this.form1.pincode = this.form.owner_pincode;
    }
    if (this.listItem.pincode) {
      this.form1.pincode = this.listItem.pincode
    }
    this.serve.addData(this.form1, "AppEnquiry/getPostalInfo")
      .then(resp => {
        if (resp['statusCode'] == 200) {
          if (this.form.influencer_detail) {
            this.listItem.state = resp['result'].state_name;
            this.listItem.district = resp['result'].district_name;
            this.getCityList1()
            this.listItem.city = resp['result'].city;

          }
          else {
            this.form.owner_state = resp['result'].state_name;
            this.form.owner_district = resp['result'].district_name;
            this.getCityList1()
            this.form.owner_city = resp['result'].city;
          }
        } else {
          // this.serve.errorToast(resp['statusMsg']);

        }
      },
        err => {
          // this.serve.errorToast('Something Went Wrong!')
        });

  }
  getSateteDistrcit1() {
   
    if (this.listItem.pincode) {
      this.form1.pincode = this.listItem.pincode
    }
    this.serve.addData(this.form1, "AppEnquiry/getPostalInfo")
      .then(resp => {
        if (resp['statusCode'] == 200) {
         
            this.listItem.state = resp['result'].state_name;
            this.listItem.district = resp['result'].district_name;
            this.getCityListInfluencer()
            this.listItem.city = resp['result'].city;

         
        } else {
          // this.serve.errorToast(resp['statusMsg']);

        }
      },
        err => {
          // this.serve.errorToast('Something Went Wrong!')
        });

  }
  videoId: any;
  flag_upload = true;
  flag_play = true;
  image: any = "";
  image_data: any = [];

  fileChange(img) {
    this.image_data.push(img);
    this.image = "";
    this.form.image_data = this.image_data
  }

  remove_image(i: any) {
    this.image_data.splice(i, 1);
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
      this.serve.presentToast('Image Failed to upload');
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





  addToList() {
    if ((this.form.influencer_detail == 'Registered' || this.form.influencer_detail == 'Unregistered') && !this.listItem.registered_by_type_id) {
      this.serve.errorToast('Profile type is required');
      return
    }



    if (this.form.influencer_detail == 'Unregistered' && !this.listItem.company_name) {
      this.serve.errorToast('Influencer name is required');
      return
    }
    if (this.form.influencer_detail == 'Unregistered' && !this.listItem.mobile) {
      this.serve.errorToast('Mobile number is required');
      return
    }
    if (this.form.influencer_detail == 'Unregistered' && !this.listItem.address) {
      this.serve.errorToast('Address is required');
      return
    }
    if (this.form.influencer_detail == 'Unregistered' && !this.listItem.pincode) {
      this.serve.errorToast('Pincode is required');
      return
    }
    if (this.form.influencer_detail == 'Unregistered' && !this.listItem.state) {
      this.serve.errorToast('State is required');
      return
    }
    if (this.form.influencer_detail == 'Unregistered' && !this.listItem.district) {
      this.serve.errorToast('District is required');
      return
    }
    if (this.form.influencer_detail == 'Unregistered' && !this.listItem.city) {
      this.serve.errorToast('City is required');
      return
    }
    if (this.form.influencer_detail == 'Registered' && !this.form.influencer_id) {
      this.serve.errorToast('Select influencer first');
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
        this.serve.errorToast('Already added');
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
    this.serve.successToast('Deleted');
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

  closeDealer() {
        this.referralSelectable._searchText = '';
    }


  saveSite() {
    this.savingFlag = true;
    if (this.form.referral_by) {
      this.form.referral_by_name = this.form.referral_by.display_name
      this.form.referral_by = this.form.referral_by.id
    }

    this.form.address = this.form.owner_address
    this.form.state = this.form.owner_state
    this.form.district = this.form.owner_district
    this.form.pincode = this.form.owner_pincode
    this.form.city = this.form.owner_city
    if (this.form.influencer_detail != 'None') {
      this.form.influencerArray = this.influencerArray;
    }

    this.form.userID = this.userID;
    if(this.siteId){
      this.form.id = this.siteId;
      console.log(this.form)
    }
   
    this.serve.addData({ "data": this.form }, 'AppEnquiry/addSite')
      .then(resp => {
        if (resp['statusCode'] == 200) {
          this.savingFlag = false;
          this.serve.successToast(resp['statusMsg']);
          this.navCtrl.popTo(SiteProjectListPage);

        } else {
          this.savingFlag = false;
          this.serve.errorToast(resp['statusMsg']);
        }
      }, error => {
        this.savingFlag = false;
        this.serve.Error_msg(error);
        this.serve.dismiss();
      })

  }

  updateContactList() {
    console.log(this.assignedContact)
    this.assignedContactsList.push(this.assignedContact);
    this.assignedContact = { contactType: '', contactName: '', contactMobile: '' }
    // this.assignedContact = {}
    console.log(this.assignedContact)

  }

  removeContact(i) {
    this.assignedContactsList.splice(i, 1);
  }

  searchParty(id,event) {
        
        this.search = event.text;
        // let wordSearch = event.text;
        setTimeout(() => {
            // if (wordSearch == this.search) {
            //     if (this.search) {
                    this.getCustomerData(id);
            //     }
            // }
        }, 700);
    }

}
