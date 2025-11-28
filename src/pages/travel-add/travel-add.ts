import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController, Loading } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import moment from 'moment';
import { Storage } from '@ionic/storage';
import { TravelListPage } from '../travel-list/travel-list';
import { DashboardPage } from '../dashboard/dashboard';
import { IonicSelectableComponent } from 'ionic-selectable';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { TravelListNewPage } from '../travel-list-new/travel-list-new';
import { AddRetailerPage } from '../add-retailer/add-retailer';
import { AddSiteProjectPage } from '../site-project/add-site-project/add-site-project';


@IonicPage()
@Component({
  selector: 'page-travel-add',
  templateUrl: 'travel-add.html',
})
export class TravelAddPage {
  @ViewChild('district_Selectable') district_Selectable: IonicSelectableComponent;
  filter_state_active: any = false;
  filter_district_active: any = false;
  filter_city_active: any = false;
  travel_data: any = {};
  filter_active: any = false;
  filter: any = {};

  nextDate: any;
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
  userId: any;
  date: any = new Date();
  customerList: any = [];
  NewDateArray: any = [];
  pageType: any;
  module_name: any = ''
  travelType: any = ''
  teamId: any = ''
  DrType: any = ''
  followupList: any = ''
  cpType: any = ''
  today_date = new Date().toISOString().slice(0, 10);
  search: any;
  prospect_CP_count: any;
  open_lead_count: any;


  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    public navParams: NavParams,
    public service: MyserviceProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public dbService: DbserviceProvider) {
    let currentDate = new Date()
    currentDate.setDate(currentDate.getDate() + 1);
    this.nextDate = currentDate.toISOString().slice(0, 10);
    console.log(this.nextDate);
    this.travelId = this.navParams.get('travelId');
    this.travel_data.travelId = this.navParams.get('travelId');
    // this.userId = this.navParams.get('userId');
    
    
    
    this.pageType = this.navParams.get('pageType');
    this.travelType = this.navParams.get('travelType');
    this.teamId = this.navParams.get('teamId');
    this.travel_data.date_from = this.navParams.get('date');
    this.customerList = this.navParams.get('customerList');
   
    console.log(this.teamId)
    if (this.navParams.get('customerList')) {
      this.customerList.map((row) => {
        row.customerType = row.travel_type;
      })

      this.dateWiseCustomersList.push({ 'date': this.travel_data.date_from, 'customers': this.customerList });


      console.log(this.dateWiseCustomersList, 'dateWiseCustomersList');

    }
    this.getCustomerCount(); 

  }
  ionViewWillEnter() {
    if (this.travel_data.dr_type) {
      this.get_customerList(this.travel_data.dr_type, '')
    }
  }
  ionViewDidLoad() {
    this.getNetworkType()


    this.storage.get('user_type').then((userType) => {
      this.userType = userType

    });


    console.log(this.travel_data);
  }
  cpVisitExist: any = false
  areaVisitExist: any = false
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
  addNewCustomer(type) {
    if (type == 15) {
      this.navCtrl.push(AddSiteProjectPage, {'userID':this.teamId})
    } else {
      if(this.DrType ==  '2'){
        this.DrType = '1'
        console.log("inside if",this.DrType)
      }
      console.log("outside  if",this.DrType)
      this.navCtrl.push(AddRetailerPage, { 'type': this.DrType, 'moduleName': this.travel_data.dr_type ,'userID':this.teamId})
    }
  }
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


  blankForm() {
    this.travel_data.date_to = '';
    this.travel_data.travel_day = '';
    this.selectedCustomer = {};
    this.travel_data.dr_type = ''
    this.dateWiseCustomersList = []
  }
  getFollowupList() {

    this.filter.limit = 20;
    this.filter.start = 0;

    this.service.addData({ 'Date': this.travel_data.date_from, 'Status': 'Upcoming', 'Mode': 'My', 'filter': this.filter,'from_page':'POA' }, 'AppFollowup/followupListInfo').then((result) => {

      if (result['statusCode'] = 200) {
        this.service.dismissLoading();
        this.followupList = result['result'];


      } else {
        this.service.dismissLoading();
        this.service.errorToast(result['statusMsg'])
      }

    }, error => {
      this.service.Error_msg(error);
      this.service.dismissLoading();
    })

  }
  getCustomerCount() {

   

    this.service.addData({ }, 'AppEvent/CPandLeadopenCount').then((result) => {

      if (result['statusCode'] = 200) {
        this.service.dismissLoading();
        this.open_lead_count = result['result']['open_lead_count'];
        this.prospect_CP_count = result['result']['prospect_CP_count'];


      } else {
        this.service.dismissLoading();
        this.service.errorToast(result['statusMsg'])
      }

    }, error => {
      this.service.Error_msg(error);
      this.service.dismissLoading();
    })

  }
  getDstrictList() {


    this.service.addData({ 'state_name': this.travel_data.state }, 'TravelPlan/district_list').then((result) => {
      console.log(result);
      this.district_list = result;
    }, err => {

    });
  }


  refresh() {
    this.travel_data.state = [];
    this.travel_data.city = [];
    this.travel_data.district = [];

    // this.getChannelPartner()
  }

  update_travel_plan() { }
  get_customerList(value, event) {
    let drType = ''
    let Index = this.networkType.findIndex(row => row.module_name == value)
    if (Index != -1) {
      drType = this.networkType[Index]['type']
      console.log("inside if")
    } else {
      drType = '2'
      console.log("inside else")
    }
    this.DrType = drType
    if (this.DrType == '1') {
      drType = '1'
      this.cpType = 'Active'
    } else if (this.DrType == '2') {
      drType = '1'
      this.cpType = 'Inactive'
    } else {
      this.cpType = ''
    }
    this.service.addData({ 'dr_type': drType, 'search': event, 'user_id': this.teamId, 'active_tab': this.cpType }, 'AppTravelPlan/getRetailerList').then((result) => {

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


  searchData(event) {
    console.log('test');
    this.search = event.text;
    let wordSearch = this.search;
    setTimeout(() => {
      if (wordSearch == this.search) {
        if (this.search) {
          this.get_customerList(this.travel_data.dr_type, this.search);
        }
      }
    }, 100);
  }

  addTravelPlan() {
    const datesBetween = this.getDatesBetween(this.travel_data.date_from, this.travel_data.date_to);
    this.NewDateArray = datesBetween
    const allDates = this.NewDateArray.map(item => item.date);
    const selectedDates = this.dateWiseCustomersList.map(item => item.date);
    const nonSelectedDates = allDates.filter(date => !selectedDates.includes(date));

    if (nonSelectedDates.length > 0) {
      // console.error("These dates were not selected:", nonSelectedDates);
      let alert = this.alertCtrl.create({
        title: 'Alert !',
        subTitle: "Please make plans for all selected dates!",
        cssClass: 'alert-modal',

        buttons: [
          {
            text: 'Ok',

          }]
      });
      alert.present();
      return

    } else {



      let header = '';

      if (this.travelId) {
        header = 'AppTravelPlan/travelPlanEdit';
      } else {
        header = 'AppTravelPlan/addTravelPlan';
      }

      this.service.presentLoading();
      this.travel_data.travel_item_data = this.dateWiseCustomersList[0].customers;
      this.travel_data.date_to = this.travel_data.date_from;
      this.travel_data.travel_type = 'daily';
      if (this.teamId != '') {
        this.travel_data.user_id = this.teamId;
      }

      this.service.addData(this.travel_data, header).then(result => {
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

  customerAddToList(dateWiseData) {
    console.log(dateWiseData,"line 378")
    console.log(dateWiseData.dr_id)

    if (!dateWiseData.dr_id) {
      this.service.errorToast("Please Select Customer")
      return;
    }

    let newData = []
    newData = dateWiseData;

    console.log(newData, 'newData');

    for (let i = 0; i < dateWiseData.length; i++) {
      this.totalDistance += dateWiseData[i]['distance'];
    }

    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var d = new Date(this.travel_data.date_from);
    var dayName = days[d.getDay()];

    let index = this.dateWiseCustomersList.findIndex(row => row.date == this.travel_data.date_from);
    let index3 = this.partyList.findIndex(row => row.id == dateWiseData.dr_id);
    if (index3 != -1) {
      if(this.partyList[index3].company_name!=''){
        dateWiseData.company_name = this.partyList[index3].company_name;
      }else{
        dateWiseData.company_name = this.partyList[index3].name;
      }
     
    }

    if (index == -1) {
      this.dateWiseCustomersList.push({ date: this.travel_data.date_from, day: dayName, totalDistance: this.totalDistance, customers: [dateWiseData] });
      this.blankValue();
    } else {
      let index2 = this.dateWiseCustomersList[index].customers.findIndex(row => row.dr_id == dateWiseData.dr_id);
      if (index2 == -1) {
        this.dateWiseCustomersList[index].customers.push(dateWiseData);
        this.blankValue();
      } else {
        let alert = this.alertCtrl.create({
          title: 'Alert',
          message: this.dateWiseCustomersList[index].customers[index2].company_name + '<br/>' + 'Already Added For ' + this.dateWiseCustomersList[index].date,
          cssClass: 'travelAlert',
          buttons: [
            {
              cssClass: 'attendanceAlertBtn',
              text: 'Okay',
              handler: () => {
                this.blankValue();
              }
            }
          ]
        });
        alert.present();
      }


    }


    let Customersdata = []
    Customersdata = this.dateWiseCustomersList[0].customers
    for (let index = 0; index < this.followupList.length; index++) {

      for (let jindex = 0; jindex < Customersdata.length; jindex++) {
        if (this.followupList[index].dr_id == Customersdata[jindex].dr_id) {
          this.followupList[index]['checked'] = true;
        }
      }
    }

  }

  removeWholeCustomerList(i) {
    this.dateWiseCustomersList.splice(i, 1);
    for (let index = 0; index < this.followupList.length; index++) {
      this.followupList[index]['checked'] = false

    }
  }

  removeCustomer(i, j, dr_id) {
    this.dateWiseCustomersList[i].customers.splice(j, 1);
    let Index = this.followupList.findIndex(row => row.dr_id == dr_id)
    if (Index != -1) {
      this.followupList[Index]['checked'] = false
    }
    console.log(this.followupList, "this is follow up")
    if (this.dateWiseCustomersList[i].customers.length == 0) {
      this.dateWiseCustomersList.splice(i, 1);
      for (let index = 0; index < this.followupList.length; index++) {
        this.followupList[index]['checked'] = false

      }
    }
  }

  // checkValidation(dateFrom, dateTo) {
  //   this.dateWiseCustomersList =[]
  //   if (dateFrom != undefined && dateTo != undefined && dateFrom != '' && dateTo != '') {
  //     this.service.addData({ 'date_from': dateFrom, 'date_to': dateTo }, 'AppTravelPlan/travelExistenceCheck').then((result) => {
  //       if (result['statusCode'] == 200) { } else {
  //         let alert = this.alertCtrl.create({
  //           title: 'Alert',
  //           message: result['statusMsg'],
  //           cssClass: 'travelAlert',
  //           buttons: [
  //             {
  //               cssClass: 'attendanceAlertBtn',
  //               text: 'Okay',
  //               handler: () => {
  //                 this.travel_data.date_from = '';
  //                 this.travel_data.date_to = '';
  //               }
  //             }
  //           ]
  //         });
  //         alert.present();
  //       }
  //     });
  //   }
  // }

  blankValue() {

    console.log(this.userId, 'this.userId');


    if (this.userId) {
      this.travel_data.customerType = '';
      this.selectedCustomer = '';
    }
    else {
      // this.travel_data.date_from = '';
      this.travel_data.customerType = '';
      this.selectedCustomer = '';
    }


  }
}
