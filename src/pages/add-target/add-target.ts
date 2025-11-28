import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController, Loading } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import moment from 'moment';
import { Storage } from '@ionic/storage';
import { IonicSelectableComponent } from 'ionic-selectable';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { TargetPage } from '../target/target';


@IonicPage()
@Component({
  selector: 'page-add-target',
  templateUrl: 'add-target.html',
})
export class AddTargetPage {
  @ViewChild('district_Selectable') district_Selectable: IonicSelectableComponent;

  filter_state_active: any = false;
  filter_district_active: any = false;
  filter_city_active: any = false;
  target_data: any = {};
  filter_active: any = false;
  addToListButton: any = true;
  filter: any = {};
  maxYear: any
  minYear: any
  minMonth: any
  today_date = new Date().toISOString().slice(0, 10);
  state_list: any = []
  district_list: any = [];
  channel_partners: any = [];
  travel_list: any = [];
  loading: Loading;
  userType: any;
  area_list: any = [];
  form1: any = {};
  city_list: any = [];
  travel_plan_detail_for_update: any = [];
  state: any = [];
  customersList: any = [];
  dateWiseCustomersList: any = [];
  partyList: any = []
  travelId: any;
  selectedCustomer: any;
  selectedSupplier: any;
  userId: any;
  date: any = new Date();
  customerList: any = [];
  targetItem: any = [];
  remainingMonths: any = [];
  networList: any = [];
  pageType: any;
  module_name: any = ''
  travelType: any = ''
  assignDistributorList: any = [];
  teamId: any = ''
  salesTargetType: any = ''
  TeamID: any = ''
  buttonDisable: any = ''
  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  user_id: any;
  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    public navParams: NavParams,
    public service: MyserviceProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public dbService: DbserviceProvider) {
    this.minYear = new Date().getFullYear();
    this.maxYear = (new Date().getFullYear() + 10).toString();
    this.minMonth = new Date().getMonth()
    this.salesTargetType = this.navParams.get('salesTargetType')
    this.TeamID = this.navParams.get('teamId')
    this.updateMonths()
    this.getNetworkList()
  }



  ionViewDidEnter() {

    setTimeout(() => {

      // if (this.salesTargetType != 'Primary') {
      //   this.getAssignedDistributor()
      // }
      if (this.salesTargetType == 'Stock Transfer') {
        this.target_data.dr_type = 'Sub Dealer'
        this.get_customerList('Sub Dealer')
      }
    }, 100);

  //   this.storage.get('userId').then((id) => {
  //     if (typeof (id) !== 'undefined' && id) {
  //         this.user_id = id;
  
  //     }
  // });

  }

  refresh() {
    this.target_data.state = [];
    this.target_data.city = [];
    this.target_data.district = [];

  }

  // updateMonths() {

  //   let currentDate = new Date();
  //   let currentMonth = currentDate.getMonth(); // Month index (0-11)
  //   let currentYear = currentDate.getFullYear();
  //   let currentDay = currentDate.getDate();
  //   // Check if the current day is after the 5th
  //   let displayNextMonth = currentDay > 5;


  //   // Calculate next month
  //   let nextMonthIndex = (currentMonth + 1) % 12;
  //   let nextMonthYear = currentYear;
  //   if (nextMonthIndex === 0) {
  //     // If next month is January, increment the year
  //     nextMonthYear++;
  //   }

  //   let currentMonthObj = {
  //     name: this.months[currentMonth],
  //     month: currentMonth + 1, // Adding 1 to make it human-readable (1-12)
  //     year: currentYear
  //   };

  //   let nextMonthObj = {
  //     name: this.months[nextMonthIndex],
  //     month: nextMonthIndex + 1, // Adding 1 to make it human-readable (1-12)
  //     year: nextMonthYear
  //   };

  //   this.remainingMonths = displayNextMonth ? [nextMonthObj] : [currentMonthObj];

  //   // If current date is on or before the 5th, allow selection of current month
  //   if (currentDay <= 5) {
  //     // selectedMonths.push(currentMonthObj);
  //     this.remainingMonths = [currentMonthObj, nextMonthObj];
  //   }
  // }


  //this code is commented for testing purpose
 
  // updateMonths() {

  //   let currentDate = new Date();
  //   let currentMonth = currentDate.getMonth(); // Month index (0-11)
  //   let currentYear = currentDate.getFullYear();
  //   let currentDay = currentDate.getDate();
  //   // Check if the current day is after the 5th
  //   let displayNextMonth = currentDay > 5;

  //   // Calculate next month
  //   let nextMonthIndex = (currentMonth + 1) % 12;
  //   let nextMonthYear = currentYear;
  //   if (nextMonthIndex === 0) {
  //     // If next month is January, increment the year
  //     nextMonthYear++;
  //   }

  //   // Format the month with leading zeros
  //   let formatMonth = (month) => (month < 10 ? '0' : '') + month;

  //   let currentMonthObj = {
  //     name: this.months[currentMonth],
  //     month: formatMonth(currentMonth + 1), // Adding 1 to make it human-readable (01-12)
  //     year: currentYear
  //   };

  //   let nextMonthObj = {
  //     name: this.months[nextMonthIndex],
  //     month: formatMonth(nextMonthIndex + 1), // Adding 1 to make it human-readable (01-12)
  //     year: nextMonthYear
  //   };

  //   this.remainingMonths = displayNextMonth ? [nextMonthObj] : [currentMonthObj];

  //   // If current date is on or before the 5th, allow selection of current month
  //   if (currentDay <= 5) {
  //     // selectedMonths.push(currentMonthObj);
  //     this.remainingMonths = [currentMonthObj, nextMonthObj];
  //   }
  // }

  ////

  //this is testing function need to comment after app got live

  updateMonths() {

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth(); // Month index (0-11)
    let currentYear = currentDate.getFullYear();
    let currentDay = currentDate.getDate();
    // Check if the current day is after the 5th
    let displayNextMonth = currentDay > 5;

    // Calculate next month
    let nextMonthIndex = (currentMonth + 1) % 12;
    let nextMonthYear = currentYear;
    if (nextMonthIndex === 0) {
      // If next month is January, increment the year
      nextMonthYear++;
    }

    // Format the month with leading zeros
    let formatMonth = (month) => (month < 10 ? '0' : '') + month;

    let currentMonthObj = {
      name: this.months[currentMonth],
      month: formatMonth(currentMonth + 1), // Adding 1 to make it human-readable (01-12)
      year: currentYear
    };

    let nextMonthObj = {
      name: this.months[nextMonthIndex],
      month: formatMonth(nextMonthIndex + 1), // Adding 1 to make it human-readable (01-12)
      year: nextMonthYear
    };

    // Include both current month and next month

      this.remainingMonths = [currentMonthObj, nextMonthObj];
    
}
//

  setYear(MonthYearData) {
    console.log(MonthYearData)
    this.target_data.year = MonthYearData.year
  }
  getNetworkList() {
    this.service.addData({}, 'AppEnquiry/networkList').then((result) => {
      if (result['statusCode'] == 200) {
        this.networList = result['result'];
      }
      else {
        this.service.errorToast(result['statusMsg']);
      }

    }, error => {
      this.service.Error_msg(error);
      this.service.dismiss();
    });
  }
  get_customerList(value) {
    
    let cpType = ''
    let header = {}

    if (value == 'Prospect CP') {
      cpType = 'Inactive'
      header = { 'dr_type': '1', 'user_id': this.TeamID, 'active_tab': cpType,'type':this.target_data.dr_type }
    } else if (value == 'Channel Partner') {
      cpType = 'Active'
      header = { 'dr_type': '1', 'user_id': this.TeamID, 'active_tab': cpType ,'type':this.target_data.dr_type}


    }
    else if (value == 'Sub Dealer') {
      cpType = 'Active'
      header = { 'dr_type': '3', 'user_id': this.TeamID, 'active_tab': cpType }


    }
    else if (value == 'Lead') {
      header = { 'dr_type': '15', 'user_id': this.TeamID }
    } else {
      let drType = ''
      let Index = this.networList.findIndex(row => row.module_name == value)

      if (Index != -1) {
        drType = this.networList[Index]['type']
      }

      header = { 'dr_type': drType, 'user_id': this.TeamID }
    }

    this.service.addData(header, 'AppTarget/getProjectionList').then((result) => {

      if (result['statusCode'] == 200) {
        this.partyList = result['result'];

      } else {
        this.service.dismissLoading();
        this.service.errorToast(result['statusMsg'])
      }
    }, err => {
      this.service.dismissLoading();
      this.service.errorToast('Something went wrong')
    });

  
  }

  getAssignedDistributor(value) {
 
    console.log(value)
    this.service.addData({ 'dr_type': value, 'user_id': this.TeamID, 'active_tab': 'Active' }, 'AppTravelPlan/getRetailerList').then((result) => {

      if (result['statusCode'] == 200) {
        this.assignDistributorList = result['result'];

      } else {

        this.service.errorToast(result['statusMsg'])
      }
    }, err => {

      this.service.errorToast('Something went wrong')
    });
  }

  getDatesBetween(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);
    let currentEndDate = new Date(endDate);
    while (currentDate <= currentEndDate) {
      const newDate = { date: moment(new Date(currentDate)).format('YYYY-MM-DD') }
      dates.push(newDate);
      currentDate.setDate(currentDate.getDate() + 1);

    }
    return dates;
  }

  addTargetPlan() {
    if (this.targetItem.length > 0) {
      let existIndex
      existIndex = this.targetItem.findIndex(row => row.dr_id == this.selectedCustomer.id);
      if (existIndex != -1) {
        this.targetItem[existIndex]['target_ton'] = parseInt(this.target_data.target_ton) + parseInt(this.targetItem[existIndex]['target_ton']);
        this.blankValue();
      }
      else {
        this.targetItem.push({
          'month': this.target_data.month.name,
          'year': this.target_data.year,
          'dr_id': this.selectedCustomer.id,
          'dr_name': this.selectedCustomer.display_name,
          'supplier_id': this.salesTargetType != 'Primary' ? this.selectedSupplier.id : '',
          'supplier_name': this.salesTargetType != 'Primary' ? this.selectedSupplier.display_name : '',
          'target_ton': this.target_data.target_ton,
          'dr_type': this.target_data.dr_type
        })
        this.blankValue();
      }
    }
    else {
      this.targetItem.push({
        'month': this.target_data.month.name,
        'year': this.target_data.year,
        'dr_id': this.selectedCustomer.id,
        'dr_name': this.selectedCustomer.display_name,
        'supplier_id': this.salesTargetType != 'Primary' ? this.selectedSupplier.id : '',
        'supplier_name': this.salesTargetType != 'Primary' ? this.selectedSupplier.display_name : '',
        'target_ton': this.target_data.target_ton,
        'dr_type': this.target_data.dr_type
      })
      this.blankValue();
    }

  }


  submitTarget() {
    this.buttonDisable = true
    // this.targetItem.user_id=this.TeamID
    // console.log(this.targetItem.user_id)

    let header = ''
    let payload = {}
    if (this.salesTargetType == 'Visit') {
      header = 'AppTarget/addVisitTarget'
      payload = { 'data': this.target_data, 'month': this.target_data.month.month, 'year': this.target_data.year }
    } else if (this.salesTargetType == 'Primary') {
      header = 'AppTarget/addTarget'
      payload = { 'data': this.targetItem, 'month': this.target_data.month.month, 'year': this.target_data.year ,'user_id':this.TeamID}

    } else if (this.salesTargetType == 'Secondary') { 
      header = 'AppTarget/addSecondaryTarget'
      payload = { 'data': this.targetItem, 'target_type': "order", 'month': this.target_data.month.month, 'year': this.target_data.year,'user_id':this.TeamID }
    } else {
      header = 'AppTarget/addSecondaryTarget'
      payload = { 'data': this.targetItem, 'target_type': "stock", 'month': this.target_data.month.month, 'year': this.target_data.year, 'user_id':this.TeamID }
    }
    this.service.addData(payload, header).then(result => {
      if (result['statusCode'] == 200) {
        this.buttonDisable = false
        // this.service.dismissLoading();
        this.service.successToast(result['statusMsg']);
        this.navCtrl.popTo(TargetPage);
      }
      else {
        this.buttonDisable = false
        // this.service.dismissLoading();
        this.service.errorToast(result['statusMsg']);
      }
    }, error => {
      this.service.Error_msg(error);
      // this.service.dismissLoading();
    })
  }

  checkAlert() {
    let alert = this.alertCtrl.create({
      title: 'Are You Sure?',
      subTitle: 'You want to save',
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
          this.submitTarget()
        }
      }]
    });
    alert.present();
  }
  presentAlert(msg) {
    let alert = this.alertCtrl.create({
      title: 'Alert',
      subTitle: msg,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
          }
        }
      ]
    });
    alert.present();
  }


  totalDistance: any = 0;



  removeWholeCustomerList(i) {
    this.dateWiseCustomersList.splice(i, 1);
    console.log(this.dateWiseCustomersList);
  }

  DeleteItem(i, j) {

    this.targetItem.splice(i, 1);

  }


  blankValue() {
    this.target_data.target_ton = ''
    this.selectedCustomer = ''
    this.selectedSupplier = ''
  }
}
