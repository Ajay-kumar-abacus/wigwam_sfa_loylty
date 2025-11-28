import { Component } from '@angular/core';
import { AlertController, IonicPage, ModalController, NavController, NavParams, ToastController } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { TravelAddPage } from '../travel-add/travel-add';
import { Storage } from '@ionic/storage';
import { ExpenseStatusModalPage } from '../expense-status-modal/expense-status-modal';
import moment from 'moment';
import { TravelMonthlyAddPage } from '../travel-monthly-add/travel-monthly-add';
/**
 * Generated class for the TravelDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-travel-detail',
  templateUrl: 'travel-detail.html',
})
export class TravelDetailPage {
  dateTile: any = 'Pending';
  today = new Date().toISOString().slice(0, 10);
  travelId: any;
  detail: any = [];
  date_from: any = {};
  date_to: any = {};
  userId: any = '';
  travelPlanDetail: any = [];
  travel_area_list: any = [];
  date: any = new Date();
  dateArray: any = [];
  activeDate: any;
  selectedDate: any;
  monthNames: any;
  travelPlanInfo: any = {}
  travel_dr_list: any = [];
  travelMode: any = '';
  travel_type: any = '';
  travelData: any = {};
  travelVisitDate: any = {}
  working_days: any;
  plan_updated: any;
  hideEdit: boolean = false;
  constructor(
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public db: MyserviceProvider,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController) {
    this.monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.travelId = this.navParams.get('id');
    this.userId = this.navParams.get('user_id');
    this.travelMode = this.navParams.get('travelMode');
    this.travel_type = this.navParams.get('travel_type');
    this.plan_updated = this.navParams.get('plan_updated');
    this.working_days = this.navParams.get('working_days');
    this.activeDate = this.navParams.get('date');
    console.log(this.activeDate);

  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
    this.today = moment(this.today).format('YYYY-MM-DD');
    this.getTravelDetail();
  }


  goOnTravelAdd() {
    console.log(this.detail);

    this.navCtrl.push(TravelAddPage, { 'data': this.detail })
  }

  getTravelDetail() {
    // this.db.show_loading();
    console.log('detail function')
    this.db.addData({ 'travelId': this.travelId, 'User_id': this.userId, 'date': this.activeDate }, "AppTravelPlan/travelPlanDetail").then(resp => {
      if (resp['statusCode'] == 200) {
        this.travelPlanDetail = resp['result']['tarvel_plan_detail_list'];
        this.travelPlanInfo = resp['result']['tarvel_plan_detail'];
        this.travelData = resp['result']['travel_data'];
        this.travelVisitDate = resp['result']['travel_data_date'];
        this.travelPlanDetail.map((row) => {
          row.customerId = row.dr_id
        });

        const monthIndex = this.travelPlanInfo.month - 1;

        if (monthIndex >= 0 && monthIndex < this.monthNames.length) {
          this.travelPlanInfo.month_name = this.monthNames[monthIndex]
        } else {
          console.log('Invalid Month');
        }

        this.dateArray = resp['result']['dateArray'];
        if ((this.travelPlanInfo.date_from < this.today) && this.travel_type == 'daily') {
          this.hideEdit = true
        }

        this.db.dismiss();
      } else {
        console.log('error occured');
        this.db.dismiss();
      }

    }, err => {
      console.log(err)
      this.db.dismiss()
    })
  }

  changeStatusModal(from) {
    console.log("this is functin", from)
    let modal = this.modalCtrl.create(ExpenseStatusModalPage, { 'from': from, 'travelId': this.travelId });

    modal.onDidDismiss(data => {
      this.getTravelDetail()
    });

    modal.present();
  }

  editTravelPlan() {
    if (this.travel_type == 'daily') {

      this.navCtrl.push(TravelAddPage, { 'travelId': this.travelId, 'pageType': 'edit', 'teamId': this.userId, 'date': this.activeDate, 'customerList': this.travelPlanDetail });
    } else {
      this.navCtrl.push(TravelMonthlyAddPage, { 'travelId': this.travelId, 'pageType': 'edit', 'userId': this.userId, 'plan_updated': this.plan_updated, 'month': this.travelPlanInfo.month_name, 'year': this.travelPlanInfo.year, 'stateDistrictList': this.travelPlanDetail });
      console.log(this.travelPlanInfo.month_name, this.travelPlanInfo.year)
    }
  }

  removeTravelPlan(travel_id) {

    let updateAlert = this.alertCtrl.create({
      title: 'Delete',
      message: 'Are you sure ?',
      buttons: [
        { text: 'No', },
        {
          text: 'Yes',
          handler: () => {
            this.db.addData({ 'id': travel_id, 'date': this.activeDate }, "AppTravelPlan/deleteIndividualTravelPlan").then(resp => {
              if (resp['statusCode'] == 200) {
                this.db.successToast(resp['statusMsg'])
                this.db.dismiss();
                this.getTravelDetail();
              } else {
                this.db.errorToast(resp['statusMsg'])
                this.db.dismiss();
              }
            }, err => {
              this.db.Error_msg(err);
              this.db.dismiss()
            })

          }
        }
      ]
    });
    updateAlert.present();


  }
}
