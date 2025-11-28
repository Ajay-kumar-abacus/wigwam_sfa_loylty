import { Component, ViewChild } from '@angular/core';
import { IonicPage, LoadingController, ModalController, AlertController, NavController, NavParams, PopoverController } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { Storage } from '@ionic/storage';
import { TravelAddNewPage } from '../travel-add-new/travel-add-new';
import { TravelEditNewPage } from '../travel-edit-new/travel-edit-new';
import { UploadFilePage } from '../upload-file/upload-file';
import { TravelPopOverPage } from '../travel-pop-over/travel-pop-over';
import { ChangeStatusModelPage } from '../change-status-model/change-status-model';
import { AttendenceserviceProvider } from '../../providers/attendenceservice/attendenceservice';
import { IonicSelectableComponent } from 'ionic-selectable';
import { TravelAddPage } from '../travel-add/travel-add';
import { TravelDetailPage } from '../travel-detail/travel-detail';
import { TravelMonthlyAddPage } from '../travel-monthly-add/travel-monthly-add';
import moment from 'moment';
@IonicPage()
@Component({
  selector: 'page-travel-list-new',
  templateUrl: 'travel-list-new.html',
})
export class TravelListNewPage {
  @ViewChild('selectComponent') selectComponent: IonicSelectableComponent;

  currentMonth: any;
  currentYear: any;
  monthNames: string[];
  date: any;
  UserId: any;
  travelType: any = 'daily';
  currentMonth_no: any;
  daysInThisMonth: any = [];
  daysInLastMonth: any = [];
  daysInNextMonth: any = [];
  counts: any = {};
  travel_data: any = []
  percentages: any = 0;
  userId: any
  TeamId: any
  dateArray: any = [];
  travelViewType: any = 'My';
  travelPlanStatus: any = 'Pending';
  travelPlanCount: any = {};
  teamCount = 0;
  pending_travel: any
  asm_id: any;
  staticdaysInThisMonth: any = [];
  data: any;
  filter: any = {}
  selectData: any = {}
  todayDate: any;
  today_date: any;
  page_type: any;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public serve: MyserviceProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public storage: Storage,
    public modalCtrl: ModalController,
    public attendence_serv: AttendenceserviceProvider,
    public popoverCtrl: PopoverController
  ) {

    this.serve.presentLoading()

    this.storage.get('team_count').then((team_count) => {
      this.teamCount = team_count;
    });


    for (let i = 1; i <= 30; i++) {
      this.staticdaysInThisMonth[i] = i;
    }
    console.log(this.navParams.get('page_type'))
    this.page_type=this.navParams.get('page_type')
    if(this.navParams.get('page_type') == 'mjp')
    {
      console.log("page type mjp")
    this.travelType='month';
    this.getTravelData(this.travelType);
    }

  }

  ionViewWillEnter() {
    this.today_date = moment().format('YYYY-MM-DD');
    this.storage.get('userId').then((id) => {
      if (this.navParams.get('view_type') == 'Team') {
        this.travelViewType = "Team";
        this.userId = '';
        this.getUserList();
        // this.getTravelData(this.travelType);
      }
    

      this.getTravelData(this.travelType);

    });


    this.date = new Date();
    this.monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();
    this.currentMonth_no = this.date.getMonth();

    this.pending_travel = this.navParams.get('from');
    if (this.navParams.get('from') == 'pendingtravel') {
      this.asm_id = this.navParams.get('asm_id')
      this.currentMonth_no = parseInt(this.navParams.get('month_name')) - 1
      this.currentYear = parseInt(this.navParams.get('year'))
      this.getTravelData(this.travelType)
    }
    this.storage.get('team_count').then((team_count) => {
      this.teamCount = team_count;
    });

    if (this.travelViewType == 'My') {
      this.storage.get('userId').then((id) => {
        this.userId = id;
        this.getTravelData(this.travelType);
      });
    }
    else {

      this.getUserList();
    }


  }






  getTravelData(travel_type) {
    // this.serve.presentLoading()
    // if (this.travelViewType == 'My' || this.selectData.team) {
      if (this.navParams.get('view_type') == 'Team') {
        this.userId = '';
      }
    this.filter.limit = 20;
    this.filter.start = 0;
    if (this.selectData.team && this.travelViewType == 'Team') {
      this.filter.team_id = this.selectData.team.id;
      this.userId = this.selectData.team.id;
      this.TeamId = this.selectData.team.id;
      this.filter.team = this.selectData.team.name;
    }
    this.data = { 'status': this.travelPlanStatus, 'Mode': this.travelViewType, 'User_id': this.userId, 'filter': this.filter, 'travel_type': travel_type }
    this.serve.addData(this.data, 'AppTravelPlan/getTravleData').then((result) => {
      if (result['statusCode'] == 200) {
        this.serve.dismissLoading()
        this.travel_data = result['travel_data'];
        this.travelPlanCount = result;
        for (let i = 0; i < this.travel_data.length; i++) {
          const monthIndex = this.travel_data[i]['month'] - 1;

          if (monthIndex >= 0 && monthIndex < this.monthNames.length) {
            this.travel_data[i]['month_name'] = this.monthNames[monthIndex]
          } else {
            console.log('Invalid Month');
          }
        }
      } else {
        this.serve.dismissLoading();
        this.serve.errorToast(result['statusMsg'])
      }

    }, error => {
      this.serve.Error_msg(error);
      this.serve.dismissLoading();
    });
    // }

  }

  doRefresh(refresher) {

    this.getTravelData(this.travelType);
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }







  announcementModal() {
    const modal = this.modalCtrl.create(UploadFilePage);
    modal.onDidDismiss(data => {
      this.getTravelData(this.travelType);
    });
    modal.present();
  }

  changeStatusModel() {
    const modal = this.modalCtrl.create(ChangeStatusModelPage, {
      userId: this.userId, 'currentMonth': this.currentMonth, 'currentYear': this.currentYear
    });
    modal.onDidDismiss(data => {
      this.getTravelData(this.travelType);
    });
    modal.present();
  }

  user_list: any = []
  getUserList() {
    this.serve.addData({}, "AppTravelPlan/getAllAsm").then(resp => {
      this.user_list = resp['asm_id'];
      this.serve.dismissLoading();
      this.travelViewType='Team'
      this.getTravelData(this.travelType)
    },
      err => {
        this.serve.dismissLoading()
      })
  }


  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(TravelPopOverPage, { 'from': 'Travel','type':this.travelType});
    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss(resultData => {
      if (resultData) {
        this.travelPlanCount = ''
        this.travelViewType = resultData.TabStatus;
        if (this.travelViewType == 'Team') {
          this.userId = undefined;
          this.getUserList();
        } else {
          this.selectData = {};
          this.filter = {};
          this.storage.get('userId').then((id) => {
            this.userId = id;
            this.getTravelData(this.travelType);
          });
        }
      }
    })

  }



  goOnAddTravel() {
    if (this.travelType == 'month') {
      this.navCtrl.push(TravelMonthlyAddPage, { 'teamId': this.userId })

    } else {
      this.navCtrl.push(TravelAddPage, { 'teamId': this.userId })

    }
  }
  deleteTravelPlan(e, i, id) {

    let alert = this.alertCtrl.create({
      title: 'Are You Sure?',
      subTitle: 'You want to delete this travel plan',
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
          e.stopPropagation()
          this.travel_data.splice(i, 1)
          this.data = { 'id': id }
          this.serve.addData(this.data, 'AppTravelPlan/deleteIndividualTravelPlan').then((result) => {
            if (result['statusCode'] == 200) {
              this.serve.dismissLoading()
              this.serve.successToast(result['statusMsg'])
              this.getTravelData(this.travelType);
            } else {
              this.serve.dismissLoading();
              this.serve.errorToast(result['statusMsg'])
              this.getTravelData(this.travelType);
            }

          }, error => {
            this.serve.Error_msg(error);
            this.serve.dismissLoading();
          });
        }
      }]
    });
    alert.present();


  }
  goOnDetailTravel(id, dateFrom, userId,working_days, plan_updated) {
 
    console.log(userId);
    this.navCtrl.push(TravelDetailPage, { 'id': id, 'travelMode': this.travelViewType, 'working_days': working_days, 'plan_updated': plan_updated, 'user_id':userId, 'date': dateFrom, 'travel_type': this.travelType })

  }

}
