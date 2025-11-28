import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { IonicSelectableComponent } from 'ionic-selectable';
import { RetailerListPage } from '../retailer-list/retailer-list';
/**
 * Generated class for the AddRetailerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-add-retailer',
  templateUrl: 'add-retailer.html',
})
export class AddRetailerPage {
  @ViewChild('distributorSelectable') distributorSelectable: IonicSelectableComponent;
  @ViewChild('district_Selectable') district_Selectable: IonicSelectableComponent;


  savingFlag: boolean = false;
  Modulename: any = '';
  Type: any = '';
  edit_page: boolean = false
  userID: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public serve: MyserviceProvider, public toastCtrl: ToastController, public loadingCtrl: LoadingController, private alertCtrl: AlertController) {
    console.log(this.navParams, "this is navparams data")
    this.Modulename = this.navParams.get('moduleName');
    this.Type = this.navParams.get('type')
    this.userID = this.navParams.get('userID')
    console.log(this.userID)
  } 

  ionViewDidLoad() {
    this.get_states();
    this.get_district();
    this.get_distributor('')
    this.get_division()


    setTimeout(() => {
      if (this.navParams.get('data')) {
        this.form = this.navParams.get('data');
        this.edit_page = this.navParams.get('edit_page');
        console.log(this.edit_page, 'edit_page');

        this.form.dob = this.form.date_of_birth
        this.form.doa = this.form.date_of_anniversary
        this.get_district();
        this.getCityList1();
      }
    }, 100);


  }
  form: any = {};
  state_list: any = [];
  division_list: any = [];
  district_list: any = [];
  distributor_list: any = [];

  user_data: any = {};
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
  get_division() {
    
    this.serve.addData({'city':this.form.city}, "AppCustomerNetwork/getAllDivison")
      .then(resp => {
        if (resp['statusCode'] == 200) {
          
          this.division_list = resp['data'];
          
          this.form.division_name = [this.division_list[0].division_name];
        } else {
         
          this.serve.errorToast(resp['statusMsg']);
        }
      }, error => {
        this.serve.Error_msg(error);
        this.serve.dismiss();
      })
  }
  get_distributor(search) {
    this.serve.addData({ 'dr_type': 1, 'type_name': "Distributor", "checkin_type": "checkin",'search':search }, 'AppCheckin/getNetworkList').then((resp) => {
      if (resp['statusCode'] == 200) {
        this.distributor_list = resp['result'];
      } else {
        this.serve.errorToast(resp['statusMsg']);

      }
    }, err => {
      this.serve.errorToast('Something Went Wrong!')
    })

  }
  city_list: any[]
  city_list1: any[]
  area_list: any[]

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
    this.serve.addData({ 'district_name': this.form.district, 'state_name': this.form.state,'pincode':this.form.pincode }, 'AppCustomerNetwork/get_city_list').then((result) => {
      if (result['statusCode'] == 200) {
        this.city_list1 = result['city'];
      } else {
        this.serve.errorToast(result['statusMsg']);

      }


    }, err => {
      this.serve.errorToast('Something Went Wrong!')
    });

  }
  form1: any = {};

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
    this.form1.pincode = this.form.pincode;

    this.serve.addData(this.form1, "AppCustomerNetwork/getStateDistict")
      .then(resp => {
        if (resp['statusCode'] == 200) {

          this.form.state = resp['result'].state_name;
          this.form.district = resp['result'].district_name;
          this.getCityList1()
          this.form.city = resp['result'].city;
          this.get_division()
          
        } else {
          this.serve.errorToast(resp['statusMsg']);

        }
      },
        err => {
          this.serve.errorToast('Something Went Wrong!')
        });

  }

  validateMobileUniqueness() {
    const numberMap = new Map();
    const fields = [
        { value: this.form.mobile, name: 'Mobile' },
        { value: this.form.altNumber, name: 'Alt Number' },
        { value: this.form.altNumber2, name: 'Alt Number 2' },
        { value: this.form.altNumber3, name: 'Alt Number 3' }
    ];

    for (const field of fields) {
        if (field.value && field.value.trim() !== '') {
            if (numberMap.has(field.value)) {
                this.serve.errorToast(`Duplicate number found: ${field.value} appears in both ${numberMap.get(field.value)} and ${field.name}`);
                return false;
            }
            numberMap.set(field.value, field.name);
        }
    }
    return true;
}

  save_retailer() {
    this.savingFlag = true;
    console.log(this.Type, "")
    if (!this.form.id && this.Type == 3) {
      if (!this.form.assign_dr_id) {
        this.serve.errorToast('Please Select Distributor!')
      }
    }
    if (this.Type == 8) {
      this.form.company_name = this.form.name
    }
    this.form.userID = this.userID;
    this.form.type_id = this.Type;
    this.serve.addData({ "data": this.form }, "AppCustomerNetwork/addDealer")
      .then(resp => {
        if (resp['statusCode'] == 200) {
          this.savingFlag = false;
          this.serve.successToast(resp['statusMsg']);
          this.navCtrl.popTo(RetailerListPage);

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
  get_district() {
    this.serve.addData({ "state_name": this.form.state }, "AppCustomerNetwork/getDistrict")
      .then(resp => {
        if (resp['statusCode'] == 200) {
          this.district_list = resp['district_list'];
        } else {
          this.serve.errorToast(resp['statusMsg']);
        }
      },
        err => {
          this.serve.errorToast('Something Went Wrong!')
        })
  }
  checkExist = false
  MobileNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }
  }

}
