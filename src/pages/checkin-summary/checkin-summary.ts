import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';

/**
 * Generated class for the CheckinSummaryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-checkin-summary',
  templateUrl: 'checkin-summary.html',
})
export class CheckinSummaryPage {
  checkinList: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public dbService:MyserviceProvider) {
    this.getCheckinList()
  } 

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckinSummaryPage');
  }

  getCheckinList() {
    
    this.dbService.presentLoading();
    this.dbService.addData({}, "AppCheckin/UserCheckinSummary").then(resp => {
      if (resp['statusCode']==200) {
        this.dbService.dismissLoading();
        this.checkinList = resp['result'];
      } else {
        this.dbService.dismissLoading();
        this.dbService.errorToast(resp['statusMsg'])
      }
    }, error => {
      this.dbService.Error_msg(error);
      this.dbService.dismiss();
    })
  }

}
