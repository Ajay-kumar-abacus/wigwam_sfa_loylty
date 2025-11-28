import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { PopRequisitionAddPage } from '../pop-requisition-add/pop-requisition-add';



@IonicPage()
@Component({
  selector: 'page-pop-requisition',
  templateUrl: 'pop-requisition.html',
})
export class PopRequisitionPage {
  PopRequisitionData: any = [];
  activeTab: string = 'Pending';
  filter: any = {};
  Frompage: any = ''
  Dr_id: any = ''


  constructor(public navCtrl: NavController, public navParams: NavParams, private service: MyserviceProvider) {

  }


  ionViewDidEnter() {
    this.getPopRequisitionList(this.activeTab)
  }

  getPopRequisitionList(tab) {
    this.filter.limit = 20;
    this.filter.start = 0;
    this.filter.status = tab;
    this.service.presentLoading()
    this.service.addData(this.filter, 'AppPopGift/popRequestList').then((result) => {
      if (result['statusCode'] == 200) {
        this.PopRequisitionData = result['data'];
        this.service.dismissLoading();
      }
      else {
        this.service.errorToast(result['statusMsg']);
        this.service.dismissLoading();
      }
    }, error => {
      this.service.Error_msg(error);
      this.service.dismiss();
    });
  }




  flag: any = '';
  loadData(infiniteScroll) {
    this.filter.start = this.PopRequisitionData.length;
    this.filter.status = this.activeTab;
    this.service.addData(this.filter, 'AppPopGift/popRequestList').then((r) => {
      if (r == '') {
        this.flag = 1;
      }
      else {
        setTimeout(() => {
          this.PopRequisitionData = this.PopRequisitionData.concat(r['data']);
          infiniteScroll.complete();
        }, 1000);
      }
    }, error => {
      this.service.Error_msg(error);
      this.service.dismiss();
    });
  }

  doRefresh(refresher) {
    this.getPopRequisitionList(this.activeTab)
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }


  goPopRequisitionAdd() {
    this.navCtrl.push(PopRequisitionAddPage)
  }
}
