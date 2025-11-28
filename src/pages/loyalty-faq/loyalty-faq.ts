

import { Component } from '@angular/core';
import { IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { ConstantProvider } from '../../providers/constant/constant';

import { DbserviceProvider } from '../../providers/dbservice/dbservice';

/**
 * Generated class for the LoyaltyFaqPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-loyalty-faq',
  templateUrl: 'loyalty-faq.html',
})
export class LoyaltyFaqPage {

  // about_data:any={};
  url:any;
  question_list_faq:any=[];
  
  tokenInfo:any={};
  lang:any='en';
  
  constructor(public navCtrl: NavController, public navParams: NavParams,public serv:DbserviceProvider, public service:MyserviceProvider , public constant : ConstantProvider) {
    // this.url = constant.upload_url1+'about/';
    // this.aboutDetail();
    this.get_question();    
  }
  
  
  ionViewDidLoad() {
  }
  


  get_question() {
    this.service.addData({}, 'AppInfluencer/get_Question').then((result) => {
      // if (result['statusCode'] == 200) {
        this.question_list_faq = result['question_list'];
      // }
      // else {
      //   this.service.errorToast(result['statusMsg']);
      // }
    });
    
  }



  doRefresh(refresher) {
    this.get_question()
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }




}
