import { Component } from '@angular/core';
import { App, Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { TranslateService } from '@ngx-translate/core';


@IonicPage()
@Component({
  selector: 'page-cancelation-policy',
  templateUrl: 'cancelation-policy.html',
})
export class CancelationPolicyPage {
  net:any='';
  spinner:any = false;
  lang:any;


  constructor(public navCtrl: NavController, public navParams: NavParams,private app:App,public serv: MyserviceProvider,public events: Events,public  translate:TranslateService,) {
    this.translate.setDefaultLang(this.lang);
    this.translate.use(this.lang);
    events.subscribe('state', (data) => {
      console.log(data);
      if(data=='online'){
        this.reload();
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationPage');
    this.net=this.navParams.get('net');
    console.log(this.net);
   
    
  }

 

  reload(){
    if( this.serv.isInternetConnection==false){
     this.spinner = true;
    }
    else{
      this.spinner = false;
      this.navCtrl.pop()
    }
  }
}
