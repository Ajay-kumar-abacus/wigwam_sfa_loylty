import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController, Loading } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { Storage } from '@ionic/storage';
import { IonicSelectableComponent } from 'ionic-selectable';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { TravelListNewPage } from '../travel-list-new/travel-list-new';



@IonicPage()
@Component({
  selector: 'page-travel-monthly-add',
  templateUrl: 'travel-monthly-add.html',
})
export class TravelMonthlyAddPage {
  @ViewChild('district_Selectable') district_Selectable: IonicSelectableComponent;
  filter_state_active: any = false;
  filter_district_active: any = false;
  filter_city_active: any = false;
  today_date = new Date().toISOString().slice(0, 10);
  maxYear: any
  minYear: any
  minMonth: any
  travel_data: any = {};
  filter_active: any = false;
  filter: any = {};
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
  selectedState: any;
  selectedDistrict: any;
  selectedCity: any;
  userId: any;
  date: any = new Date();
  NewDateArray: any = [];
  remainingMonths: any = [];
  stateDistrictList: any = [];
  monthlyData: any = {};
  pageType: any;
  module_name: any = ''
  travelType: any = ''
  workingDays: any = ''
  totalVisitDays: any
  teamId: any
  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
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
    this.travelId = this.navParams.get('travelId');
    this.monthlyData.travelId = this.navParams.get('travelId');
    this.userId = this.navParams.get('userId');
    this.pageType = this.navParams.get('pageType');
    this.travelType = this.navParams.get('travelType');
    console.log(this.navParams.get('stateDistrictList'), 'this.navParams.');

    if (this.navParams.get('stateDistrictList')) {
      this.stateDistrictList = this.navParams.get('stateDistrictList');
    }
    this.travel_data.month = this.navParams.get('month');

   
    this.travel_data.year = this.navParams.get('year');
    console.log(this.travel_data.month + " "+this.travel_data.year)
    // if(this.navParams.get('month')){
    //   this.setYear(this.travel_data.month + " "+this.travel_data.year)
    // }
    const monthIndex = new Date(`${this.travel_data.month} 1, ${this.travel_data.year}`).getMonth();
    this.getWorkingDays(monthIndex + 1,this.travel_data.year)
    console.log(this.navParams.get('month'), this.navParams.get('year'))
    this.totalVisitDays = this.navParams.get('plan_updated');
    if (this.navParams.get('teamId')) {
      this.teamId = this.navParams.get('teamId');
    } else {
      this.teamId = this.navParams.get('userId');
    }
    console.log(this.teamId)

  }

  ionViewDidLoad() {

    this.get_states()
    this.updateMonths()
    // this.getWorkingDays()
    this.storage.get('user_type').then((userType) => {
      this.userType = userType

    });


  }


  cpVisitExist: any = false
  areaVisitExist: any = false
  networkType: any = []
  otherType: any = []

  getTravelPlan(date) {

    this.service.show_loading();
    this.service.addData({ 'travel_date': date }, 'TravelPlan/get_travelPlan').then((result) => {
      console.log(result);
      this.travel_list = result;
      this.service.dismiss();

    }, err => {
      this.loading.dismiss()

    })
  }

  get_states() {
    this.service.addData({'user_id':this.teamId}, "AppTravelPlan/getStatesTravel")
      .then(resp => {
        if (resp['statusCode'] == 200) {
          this.state_list = resp['state_list'];
        } else {
          this.service.errorToast(resp['statusMsg']);
        }
      }, error => {
        this.service.Error_msg(error);
      })
  }
  getDstrictList(stateData) {
    this.service.addData({ 'state_name': stateData.state_name }, 'AppTravelPlan/getDistrictTravel').then((result) => {
      if (result['statusCode'] == 200) {
        this.district_list = result['district_list'];
      } else {
        this.service.errorToast(result['statusMsg']);
      }

    }, err => {

    });
  }
  // getCityList() {
  //   this.service.addData({ 'state_name': this.selectedState.state_name }, 'AppTravelPlan/getCityTravel').then((result) => {
  //     if (result['statusCode'] == 200) {
  //       this.city_list = result['city'];
  //     } else {
  //       this.service.errorToast(result['statusMsg']);
  //     }

  //   }, err => {

  //   });
  // }
  getCityList() {
    this.service.addData({ 'state_name': this.selectedState.state_name ,'user_id':this.teamId}, 'AppTravelPlan/get_cross_City').then((result) => {
      if (result['statusCode'] == 200) {
        this.city_list = result['city'];
      } else {
        this.service.errorToast(result['statusMsg']);
      }

    }, err => {

    });
  }
  getWorkingDays(month,year) {
    this.service.addData({'month':month,'year':year}, 'AppTravelPlan/getWorkingDays').then((result) => {
      if (result['statusCode'] == 200) {
        this.workingDays = result['working_days'];
      } else {
        this.service.errorToast(result['statusMsg']);
      }

    }, err => {

    });
  }

  updateMonths() {

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth(); // Month index (0-11)
    let currentYear = currentDate.getFullYear();

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    // Calculate next month
    let nextMonthIndex = (currentMonth + 1) % 12;
    let nextMonthYear = currentYear;
    if (nextMonthIndex === 0) {
      // If next month is January, increment the year
      nextMonthYear++;
    }

    let currentMonthObj = {
      name: monthNames[currentMonth],
      month: currentMonth + 1, // Adding 1 to make it human-readable (1-12)
      year: currentYear
    };

    let nextMonthObj = {
      name: monthNames[nextMonthIndex],
      month: nextMonthIndex + 1, // Adding 1 to make it human-readable (1-12)
      year: nextMonthYear
    };

    this.remainingMonths = [currentMonthObj, nextMonthObj];
  }
  refresh() {
    this.travel_data.state = [];
    this.travel_data.city = [];
    this.travel_data.district = [];
  }

  setYear(MonthYearData) {
    console.log(MonthYearData)

    this.travel_data.year = MonthYearData.year
    const monthIndex = new Date(`${this.travel_data.month.name} 1, ${this.travel_data.year}`).getMonth();
    this.getWorkingDays(monthIndex + 1,this.travel_data.year)
  }
  addTravelPlan() {
    const monthIndex = new Date(`${this.travel_data.month.name} 1, ${this.travel_data.year}`).getMonth();

    if (this.totalVisitDays > this.workingDays) {
      let alert = this.alertCtrl.create({
        title: 'Alert Total Working Days' + this.workingDays + ' !',
        subTitle: "Visit Days cannot exceed the total number of working days in this current month!",
        cssClass: 'alert-modal',

        buttons: [
          {
            text: 'Ok',

          }]
      });
      alert.present();
      return

    }
    else if (this.totalVisitDays < this.workingDays) {
      let alert = this.alertCtrl.create({
        title: 'Alert Total Working Days' + this.workingDays + ' !',
        subTitle: "Visit Days cannot less then total number of working days in this current month!",
        cssClass: 'alert-modal',

        buttons: [
          {
            text: 'Ok',

          }]
      });
      alert.present();
      return

    }
    else {

      let header = '';

      if (this.travelId) {
        header = 'AppTravelPlan/travelPlanEdit';
      } else {
        header = 'AppTravelPlan/addTravelPlan';
      }

      this.service.presentLoading();

      this.monthlyData.travel_type = 'month';
      this.monthlyData.travel_item_data = this.stateDistrictList;
      this.monthlyData.month = monthIndex + 1;
      this.monthlyData.year = this.travel_data.year;
      if (this.teamId != '') {
        this.monthlyData.user_id = this.teamId;
      }

      this.service.addData(this.monthlyData, header).then(result => {
        if (result['statusCode'] == 200) {
          this.service.dismissLoading();
          this.service.successToast(result['statusMsg']);
          this.navCtrl.popTo(TravelListNewPage);
        } else {
          this.service.dismissLoading();
          this.service.errorToast(result['statusMsg']);
        }
      }, error => {
        this.service.Error_msg(error);
        this.service.dismissLoading();
      })
    }
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
          this.addTravelPlan();
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

  customerAddToList() {
    if (this.stateDistrictList.length > 0) {
      let existIndex
      existIndex = this.stateDistrictList.findIndex(row => row.state === this.selectedState.state_name && row.city === this.selectedCity.city,);
      console.log(existIndex, "this is index")
      if (existIndex != -1) {
        this.stateDistrictList[existIndex]['visit_days'] = parseInt(this.stateDistrictList[existIndex]['visit_days']) + parseInt(this.travel_data.visit_days);
        this.blankValue();
        console.log("inif")
      }
      else {
        this.stateDistrictList.push({ 'state': this.selectedState.state_name, 'city': this.selectedCity.city, 'visit_days': this.travel_data.visit_days })
        this.blankValue();
        console.log("inelse")

      }
    }
    else {
      this.stateDistrictList.push({ 'state': this.selectedState.state_name, 'city': this.selectedCity.city, 'visit_days': this.travel_data.visit_days })
      this.blankValue();
      console.log("first time")
    }

    this.totalVisitDays = 0;


    for (let i = 0; i < this.stateDistrictList.length; i++) {
      this.totalVisitDays += parseInt(this.stateDistrictList[i]['visit_days']);
    }


    console.log(this.stateDistrictList, '');


  }



  removeWholeList() {
    this.stateDistrictList = []
  }
  removeRow(i) {
    this.totalVisitDays = 0
    this.stateDistrictList.splice(i, 1);
    for (let i = 0; i < this.stateDistrictList.length; i++) {
      this.totalVisitDays += parseInt(this.stateDistrictList[i]['visit_days']);
    }
  }


  blankValue() {
    if (this.userId) {
      this.selectedState = '';
      this.selectedDistrict = '';
      this.selectedCity = '';
      this.travel_data.visit_days = '';
    }
    else {
      this.selectedState = '';
      this.selectedDistrict = '';
      this.selectedCity = '';
      this.travel_data.visit_days = '';
    }
  }
}
