import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';

/**
 * Generated class for the SparePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-spare',
  templateUrl: 'spare.html',
})
export class SparePage {

  spare_list = [];
  filter:any={};


  constructor(public navCtrl: NavController, public navParams: NavParams, public serve: MyserviceProvider,public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    this.getSpareParts();
  }

  doRefresh(refresher) 
  {
    this.getSpareParts();
    refresher.complete();
  }
  getSpareParts() {

    this.serve.addData({'search':this.filter.search}, "AppServiceTask/getAssignedParts")
      .then(resp => {
        if (resp['statusCode'] == 200) {
          this.spare_list = resp['assign_part'];
          console.log(this.spare_list);
          this.serve.dismissLoading();


        } else {
          this.serve.errorToast(resp['statusMsg'])
          this.serve.dismiss();

        }
      },
        err => {
        })
  }

  flag:any='';
  loadData(infiniteScroll) {
    this.filter.limit = 5;
    this.filter.start = this.spare_list.length
    
    this.serve.addData({ 'filter':this.filter}, 'AppServiceTask/getAssignedParts').then(resp => {
      if (resp['result'] == '') {
        this.flag = 1;
      }
      else {
        setTimeout(() => {
          this.spare_list = this.spare_list.concat(resp['result']);
          infiniteScroll.complete();
        }, 1000);
      }
    });
  }


}
