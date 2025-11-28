import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SelectRegistrationTypePage } from '../select-registration-type/select-registration-type';
import { Storage } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { LoginPage } from '../login/login';
/**
 * Generated class for the PrivacyPolicyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-privacy-policy',
  templateUrl: 'privacy-policy.html',
})
export class PrivacyPolicyPage {
  spinner:any=false;
  data:any={}
  constructor(public storage: Storage, private iab: InAppBrowser, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrivacyPolicyPage');
  }

  goTo(){
    this.storage.set('userPermission', 'true');
    this.navCtrl.push(LoginPage);
  } 

  openPrivacyPolicy(){
    this.iab.create('https://wigwamply.com/privacy-policy', '_system')
  }

}
