import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Navbar, Events, AlertController, PopoverController } from 'ionic-angular';
import { AddCheckinPage } from '../add-checkin/add-checkin';
import { MyserviceProvider } from '../../../providers/myservice/myservice';
import { EndCheckinPage } from '../end-checkin/end-checkin';
import { CheckinDetailPage } from '../checkin-detail/checkin-detail';
import moment from 'moment';
import { DashboardPage } from '../../dashboard/dashboard';
import { ViewChild } from '@angular/core';
import { AttendenceserviceProvider } from '../../../../src/providers/attendenceservice/attendenceservice';
import { ExpensePopoverPage } from '../../expense-popover/expense-popover';
import { ConstantProvider } from '../../../providers/constant/constant';
import { TravelPopOverPage } from '../../travel-pop-over/travel-pop-over';
// import { ExpensePopoverPage } from '../expense-popover/expense-popover';



/**
* Generated class for the CheckinListPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-checkin-list',
  templateUrl: 'checkin-list.html',
})
export class CheckinListPage {
  @ViewChild(Navbar) navBar: Navbar;

  date: any;
  limit: any;
  start: any;
  flag: any = '';
  checkinClicked: boolean;
  enterCheckinDetail: boolean = true;
  val: any = '';
  checkinType: any = "My";
  previous_checkin: any = [];
  checkin_id: any = ''
  checkin_data: any = [];
  addCheckinDisable: boolean = false;
  LoginType: any = '';
  DrType: any = '';
  drCode: any = '';
  dr_id: any = '';
  Mode: any;
  constructor(public alertCtrl: AlertController, public popoverCtrl: PopoverController, public attendence_serv: AttendenceserviceProvider, public constant: ConstantProvider, public navCtrl: NavController, public navParams: NavParams, public serve: MyserviceProvider, public loadingCtrl: LoadingController, public events: Events) {
    this.LoginType = this.constant.UserLoggedInData.loggedInUserType
    this.DrType = this.navParams.get('dr_type')
    this.drCode = this.navParams.get('dr_code')
    this.dr_id = this.navParams.get('dr_id');
    this.Mode = this.navParams.get('Mode');
    console.log(this.Mode)
  }

  ionViewWillEnter() {


    this.checkinClicked = false;
    this.checkin_list();
    this.date = moment(this.date).format('YYYY-MM-DD');
  }
  ionViewDidLoad() {
  }

  ionViewDidEnter() {
    this.events.publish('current_page', 'Dashboard');
  }






  today_checkin: any = [];


  search: any = {};

  load_data: any = "0";


  presentPopover(myEvent) {

    let popover = this.popoverCtrl.create(TravelPopOverPage, { 'dr_id': this.dr_id, 'from': 'leads-details', 'dr_code': this.drCode, 'dr_type': this.DrType });

    popover.present({
      ev: myEvent
    });

    popover.onDidDismiss(resultData => {
    })

  }

  checkin_list() {
    this.serve.presentLoading()

    if (this.search.check_in_date != null) {
      this.search.check_in_date = moment(this.search.check_in_date).format('YYYY-MM-DD');
    }
    this.limit = 20
    this.start = 0
    this.serve.addData({ 'dr_id': this.dr_id, 'limit': this.limit, 'start': this.start ,'Mode':this.Mode}, 'AppCustomerNetwork/checkinList').then((result) => {
      if (result['statusCode'] == 200) {
        this.today_checkin = result['today_checkin'];
        this.previous_checkin = result['result'];
        this.serve.dismissLoading()
      } else {
        this.serve.errorToast(result['statusMsg'])
        this.serve.dismissLoading()
      }
    }, error => {
      this.serve.Error_msg(error);
      this.serve.dismiss();
    });
  }



  loadData(infiniteScroll) {
    this.start = this.previous_checkin.length;
    this.serve.addData({ 'dr_id': this.dr_id, 'limit': this.limit, 'start': this.start ,'Mode':this.Mode}, 'AppCustomerNetwork/checkinList').then(result => {
      if (result['result'] == '') {
        this.flag = 1;
      }
      else {
        setTimeout(() => {
          this.previous_checkin = this.previous_checkin.concat(result['result']);
          infiniteScroll.complete();
        }, 1000);
      }
    });
  }

  addCheckin() {
    this.navCtrl.push(AddCheckinPage)
  }

  end_visit(checkin_id) {

    this.navCtrl.push(EndCheckinPage, { 'data': this.checkin_data });
  }

  checkin_detail(checkin_id) {

    this.checkinClicked = true;

    this.serve.addData({ 'checkin_id': checkin_id }, 'Checkin/checkin_detail').then((result) => {
      if (result) {
        this.navCtrl.push(CheckinDetailPage, { 'data': result });
      }
    })

  }


  goBack() {

    this.navCtrl.push(DashboardPage);
  }


  doRefresh(refresher) {

    this.checkin_list();
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }



}
