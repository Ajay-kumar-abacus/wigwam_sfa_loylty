import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AttendenceserviceProvider } from '../../../providers/attendenceservice/attendenceservice';

import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { MyserviceProvider } from '../../../providers/myservice/myservice';
import { IonicSelectableComponent } from 'ionic-selectable';


@IonicPage()
@Component({
  selector: 'page-contractor-meet-add',
  templateUrl: 'contractor-meet-add.html',
})
export class ContractorMeetAddPage {
  @ViewChild('selectComponent') selectComponent: IonicSelectableComponent;
  dealer: any = [];
  data: any = {};
  id: any;
  isValidNumber: any = false;
  state_list: any = [];
  spinner: boolean = false;
  user_data: any = {};
  checkin_id: any;
  followup_data: any = {};
  drList: any = []
  order: any = 'for event'
  today_date = new Date().toISOString().slice(0, 10);
  max_date = new Date().getFullYear() + 1;
  per_plumber_budget: any = 0;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public db: MyserviceProvider, public attendence_serv: AttendenceserviceProvider, public navParams: NavParams, public service: DbserviceProvider, public service1: MyserviceProvider) {
    // this.getNetworkType()
    // this.get_per_plumber_budget();


    if (this.navParams.get('dr_type') && this.navParams.get('dr_name') && this.navParams.get('checkinUserID')) {
      this.checkin_id = this.navParams.get('checkin_id');
      this.id = this.navParams.get('checkinUserID');

    }
    else {
      this.id = navParams.data.created_by;

    }
  }

  ionViewDidLoad() {
    this.get_states();
    // this.get_network_list()

    if (this.navParams.get('pageType') && this.navParams.get('pageType') == 'edit') {
      this.data = this.navParams.get('eventData');
      this.data.per_plumber_budget = this.data.per_person
    }

  }
  get_network_list(type) {

    this.service1.addData({ 'dr_type': type, 'active_tab': 'Active' }, 'AppEvent/getAssignDistributor').then((result) => {
      if (result['statusCode'] == 200) {
        this.drList = result['distributor_arr'];
        if (this.navParams.get('pageType') && this.navParams.get('pageType') == 'edit') {
          let index
          index = this.drList.findIndex(row => row.id == this.data.dr_id)
          if (index != -1) {
            this.data.dealer_id = this.drList[index];
          }
        }
      } else {
        this.service1.errorToast(result['statusMsg'])
      }
    });

  }
  Order_list() {
    console.log("called")
  }

  checkMobileNumber(event) {
    console.log(event);
    if (event && event.length == 10) {
      let pattern = /[A-z]| |\W|[!@#\$%\^\&*\)\(+=._-]+/;
      let hasSpace = event.search(pattern);
      if (hasSpace != -1) {
        this.isValidNumber = false;
        return false;
      }
      this.isValidNumber = true;
    } else {
      this.isValidNumber = false;
    }
  }
  getSateteDistrcit() {

    this.service1.addData({ 'pincode': this.data.pincode }, "AppCustomerNetwork/getStateDistict")
      .then(resp => {
        if (resp['statusCode'] == 200) {

          this.data.state = resp['result'].state_name;
          this.data.city = resp['result'].city;
        } else {
          this.service1.errorToast(resp['statusMsg']);

        }
      },
        err => {
          this.service1.errorToast('Something Went Wrong!')
        });

  }
  get_states() {
    this.service1.presentLoading()
    this.service1.addData({}, "AppEvent/getStatesEvent")
      .then(resp => {
        if (resp['statusCode'] == 200) {
          this.service1.dismissLoading()
          this.state_list = resp['state_list'];
        } else {
          this.service1.dismissLoading()
          this.service1.errorToast(resp['statusMsg']);
        }
      }, error => {
        this.service1.Error_msg(error);
        this.service1.dismiss();
      })
  }
  get_dealers() {
    this.service1.addData({ 'login_id': this.id }, 'AppEvent/getAllDealers').then((response) => {
      if (response['statusCode'] == 200) {
        this.dealer = response;
      } else {
        this.service1.errorToast(response['statusMsg'])
      }

    }, er => {
      this.service1.dismissLoading();
      this.service1.errorToast('Something went wrong')
    });
  }

  get_per_plumber_budget() {
    this.service1.presentLoading();
    this.service1.addData({}, 'AppEvent/perPlumberBudgets').then((response) => {
      if (response['statusCode'] == 200) {
        this.service1.dismissLoading();
        this.data.per_plumber_budget = response['budget']['budget'];
        console.log(this.data.per_plumber_budget)
      } else {
        this.service1.dismissLoading();
        this.service1.errorToast(response['statusMsg'])
      }
    }, er => {
      this.service1.dismissLoading();
      this.service1.errorToast('Something went wrong')
    });
  }

  calculateBudget() {
    this.data.total_budget = parseFloat(this.data.total_member) * parseFloat(this.data.per_plumber_budget);
  }


  number_checker(event: any) {


    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
    if (this.data.event_type == 'In-shop Meet' || this.data.event_type == 'Nukkad Meet') {
      this.data.per_plumber_budget = 100
      this.calculateBudget();
    }

  }
  budget_number_checker() {
    // console.log(event,"this is Event")
    const enteredValue = parseInt(this.data.per_plumber_budget.length);
    if (this.data.event_type == 'In-shop Meet' || this.data.event_type == 'Nukkad Meet' && enteredValue === 3) {

      if (parseInt(this.data.per_plumber_budget) > 100) {

        this.service1.errorToast("Max ₹100 per invitee is allowed ")
        this.data.per_plumber_budget = ""
      }
    }
    this.calculateBudget();
  }
  blankValue() {
    this.data.dealer_id = '';
    this.data.state = '';
    this.data.city = '';
    this.data.total_member = '';
    this.data.per_plumber_budget = '';
    this.data.expense_sharing = '';
    this.data.espense_sharing_cp = '';
    this.data.expense_sharing_amount = '';
    this.data.date_of_meeting = '';
    this.data.total_budget = '';
  }
  submit() {
    this.spinner = true;
    this.data.total_budget = parseFloat(this.data.total_member) * parseFloat(this.data.per_plumber_budget);

    this.service1.addData({ 'data': this.data }, 'AppEvent/addEvent').then((response) => {
      if (response['statusCode'] == 200) {
        this.spinner = false;
        this.service1.successToast(response['statusMsg']);
        this.navCtrl.pop();
      } else {
        this.spinner = false;
        this.service1.dismissLoading();
        this.service1.errorToast(response['statusMsg'])
      }
    }, error => {
      this.service1.Error_msg(error);
      this.spinner = false
      this.service1.dismissLoading();
    });
    // this.navCtrl.push(ContractorMeetListPage);
  }



  showSuccess(text) {
    let alert = this.alertCtrl.create({
      title: 'Success!',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }

}
