import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { ConstantProvider } from '../../providers/constant/constant';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { TravelPopOverPage } from '../travel-pop-over/travel-pop-over';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the KriKpaTargetPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-kri-kpa-target',
  templateUrl: 'kri-kpa-target.html',
})
export class KriKpaTargetPage {
  filter: any = {};
  targetData: any = {};
  teamCount: any = '';
  userId: any;
  user_list: any = [];
  totalWeightAge: number = 0;
  totalScore: number=0;
  target_Type: any = 'My';
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public storage: Storage,
    public service: MyserviceProvider, public popoverCtrl: PopoverController) {
    this.getKRIKPAData();
  }


  ionViewDidLoad() {
    this.storage.get('team_count').then((team_count) => {
      this.teamCount = team_count;
    });
    console.log('ionViewDidLoad KriKpaTargetPage');
  }

  getKRIKPAData() {
    this.service.presentLoading();
    this.service.addData({ 'filter': this.filter, 'target_type': this.target_Type }, 'AppTarget/UserKRIData').then((result) => {
      if (result['statusCode'] == 200) {
        this.service.dismissLoading();
        this.targetData = result['result'];
        for (let i = 0; i < this.targetData.kra.length; i++) {
          this.totalWeightAge += this.targetData.kra[i].weightage;
          this.totalScore += this.targetData.kra[i].score;
        }
      } else {
        this.service.errorToast(result['statusMsg']);
        this.service.dismissLoading();
      }
    }, error => {
      this.service.Error_msg(error);
      this.service.dismissLoading();
    });
  }

  getSpaceFullName(name) {
    return name.replaceAll('_', ' ');
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(TravelPopOverPage, { 'from': 'kra_kpi', });
    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss(resultData => {
      if (resultData) {
        this.target_Type = resultData.TabStatus;
        this.getUserList();

      }
    })

  }

  getUserList() {
    this.storage.get('userId').then((id) => {
      this.userId = id;
      this.service.addData({ 'user_id': this.userId }, 'AppExpense/allASM').then((result) => {
        if (result['statusCode'] == 200) {
          this.user_list = result['asm_id'];
        } else {
          this.service.errorToast(result['statusMsg'])
        }
      }, err => {
        this.service.Error_msg(err);
      });
    });
  }


}
