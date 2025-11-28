import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { MyserviceProvider } from '../../../providers/myservice/myservice';
import { AddRetailerPage } from '../../add-retailer/add-retailer';
import { RetailerDetailPage } from '../../retailer-detail/retailer-detail';
import { TravelPopOverPage } from '../../travel-pop-over/travel-pop-over';
import { AddSiteProjectPage } from '../add-site-project/add-site-project';
import { Storage } from '@ionic/storage';
import { SiteProjectDetailPage } from '../site-project-detail/site-project-detail';
import moment from 'moment';
import { ModalController } from 'ionic-angular';
import { ExpenseStatusModalPage } from '../../expense-status-modal/expense-status-modal';

/**
 * Generated class for the SiteListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@IonicPage()
@Component({
  selector: 'page-site-list',
  templateUrl: 'site-project-list.html',
})
export class SiteProjectListPage {
  siteList = []
  date: any
  search: any;
  activeTab: string = "Open";
  subActiveTab: any = "Pending";
  flag: any;
  Type: any = 'My';
  status: any = ''
  filter: any = {};
  selectData: any = {}
  limit: any;
  start: any;
  statusCount: any;
  teamCount: any = 0;
  load_data: any;
  sort: any = ''
  DrType: any = '3';
  userId: any;
  teamMemberId: any;
  list_type: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController, public serve: MyserviceProvider, private alertController: AlertController, public storage: Storage, public modalCtrl: ModalController,) {
    this.date = moment(this.date).format('YYYY-MM-DD');

  }


  ionViewDidEnter() {
    this.getSiteList();
    this.serve.presentLoading();

  }

  ionViewWillEnter() {
    this.storage.get('team_count').then((team_count) => {
      this.teamCount = team_count;
    });
  }


  error_msg: any = ''
  presentAlert() {
    let alert = this.alertController.create({
      title: 'Alert',
      subTitle: this.error_msg,
      buttons: ['Dismiss']
    });
    alert.present();
  }
  data_status: boolean;

  getSiteList() {
    this.load_data = 0;
    this.limit = 20
    this.start = 0
    this.siteList = [];
    this.filter.subtype = this.subActiveTab;
    this.filter.sort = this.sort;


    if (this.selectData.team && this.Type == 'Team') {
      this.teamMemberId = this.selectData.team.id
      this.filter.team_id = this.selectData.team.id;
      this.filter.team = this.selectData.team.name;
    }
   let apiName
    if(this.list_type=='created_by'){
      apiName="AppEnquiry/getSiteList_created_by"
    }else{
      apiName="AppEnquiry/getSiteList"
    }

    this.serve.addData({ 'type': this.activeTab, 'User_id': this.teamMemberId, 'Mode': this.Type, filter: this.filter, status: this.status, 'Master_Search': this.search, 'limit': this.limit, 'start': this.start }, apiName).then(resp => {
      if (resp['statusCode'] == 200) {
        // this.data_status = resp['status']
        this.statusCount = { lost_count: resp['lost_count'], open_count: resp['open_count'], winc_count: resp['winc_count'], winf_count: resp['winf_count'] };
        this.siteList = resp['dr_list'].map(item => this.ensureStringFields(item));
        this.start = this.siteList.length;
        this.serve.dismissLoading()
        if (!this.siteList.length) {
          this.load_data = 1;
        }
      } else {
        this.serve.errorToast(resp['statusMsg'])
        this.serve.dismissLoading()
      }
    }, error => {
      this.serve.Error_msg(error);
      this.serve.dismiss();
    })

  }

  ensureStringFields(item: any): any {
    return {
        ...item,
        ownerName: String(item.ownerName || ''),
    };
}
  presentPopover(myEvent, from) {
    let popover = this.popoverCtrl.create(TravelPopOverPage, { 'from': from, 'dr_type': this.DrType, Type: this.Type });

    popover.present({
      ev: myEvent
    });

    popover.onDidDismiss(resultData => {
      console.log(resultData, 'resultData');

      if (resultData) {
        this.Type = resultData.TabStatus;
        this.list_type = resultData.list_type;
        if (resultData.TabStatus == 'Team') {
          this.getUserList();
        }
        this.sort = resultData.sort
        this.getSiteList()
      }
    })

  }
  loadData(infiniteScroll) {
    this.start = this.siteList.length
    this.filter.subtype = this.subActiveTab;
    let apiName
    if(this.list_type=='created_by'){
      apiName="AppEnquiry/getSiteList_created_by"
    }else{
      apiName="AppEnquiry/getSiteList"
    }
    this.serve.addData({ 'type': this.activeTab, 'Mode': this.Type, filter: this.filter, status: this.status, 'Master_Search': this.search, 'limit': this.limit, 'start': this.start },apiName ).then(resp => {
      if (resp['dr_list'] == '') {
        this.flag = 1;
      }
      else {
        setTimeout(() => {
          this.siteList = this.siteList.concat(resp['dr_list']);
          infiniteScroll.complete();
        }, 1000);
      }
    }, error => {
      this.serve.Error_msg(error);
      this.serve.dismiss();
    });
  }
  doRefresh(refresher) {
    if (this.search)
      this.search = {}
    this.getSiteList()
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }
  addSite() {
    this.navCtrl.push(AddSiteProjectPage)
  }
  goToSiteDetail(id) {
    this.navCtrl.push(SiteProjectDetailPage, { 'id': id, 'actionType': this.Type })
  }
  AssignUser(e: any, id) {
    e.stopPropagation();
    let modal = this.modalCtrl.create(ExpenseStatusModalPage, { 'from': 'Site_Listing', 'id': id });
    modal.present();

    modal.onDidDismiss((data) => {
      this.getSiteList()
    })
  }
  user_list: any = [];

  getUserList() {
    this.storage.get('userId').then((id) => {
      this.userId = id;
      this.serve.addData({ 'user_id': this.userId }, 'AppExpense/allASM').then((result) => {
        if (result['statusCode'] == 200) {
          this.serve.dismiss();
          this.user_list = result['asm_id'];
        } else {
          this.serve.dismiss();
          this.serve.errorToast(result['statusMsg'])
        }
      }, err => {
        this.serve.Error_msg(err);
        this.serve.dismiss();
      });
    });
  }
}
