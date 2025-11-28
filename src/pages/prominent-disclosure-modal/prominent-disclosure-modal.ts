import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';
/**
 * Generated class for the ProminentDisclosureModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-prominent-disclosure-modal',
  templateUrl: 'prominent-disclosure-modal.html',
})
export class ProminentDisclosureModalPage {
  fromType:any = ''
  constructor(public navCtrl: NavController,private iab: InAppBrowser ,public Storage : Storage , public viewcontrol: ViewController, public navParams: NavParams) {
    this.fromType = this.navParams.get('fromType');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProminentDisclosureModalPage');
  }
  close(){
    let data = false
    this.viewcontrol.dismiss(data);
  }
  accepted(){
    this.Storage.set('prominentModal',true)
    let data = true
    this.viewcontrol.dismiss(this.fromType);
  }
  openPrivacyPolicy(){
    this.iab.create('https://wigwamply.com/privacy-policy', '_system')
  }
}
