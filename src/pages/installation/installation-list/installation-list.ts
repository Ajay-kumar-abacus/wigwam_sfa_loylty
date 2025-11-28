import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { AddInstallationPage } from '../add-installation/add-installation';
import { MyserviceProvider } from '../../../providers/myservice/myservice';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { InstallationDetailPage } from '../installation-detail/installation-detail';

/**
* Generated class for the InstallationListPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-installation-list',
  templateUrl: 'installation-list.html',
})
export class InstallationListPage {
  
  installation_list : any=[];
  loading:any;
  filter:any={};
  flag:any='';
  count:any=[];
  total_count:any=[];
  data:any={};
  start: any;
  dr_id: any;
  installtion_type: any = 'Pending'
  
  constructor(public navCtrl: NavController, public navParams: NavParams,public service:DbserviceProvider,public alertCtrl:AlertController,public loadingCtrl:LoadingController,public db: MyserviceProvider) {
    
    this.installationList()
    
  }
  
  ionViewDidLoad() {
    this.filter.status='Pending';
    console.log('ionViewDidLoad InstallationListPage');
  }
  add_page(){
    this.navCtrl.push(AddInstallationPage, { "type": '' });
  }
  
  doRefresh(refresher) 
  {
    this.installationList();
    refresher.complete();
  }
  showSuccess(text)
  {
    let alert = this.alertCtrl.create({
      title:'Success!',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }
  installationList()
  {
    this.flag=0;
    this.filter.limit = 20;
    this.filter.start=0;
    this.filter.master='';
    this.filter.status= this.installtion_type;
    this.db.presentLoading();
    this.db.addData({'filter': this.filter},'AppServiceTask/serviceInstallationList').then(resp=>{
      if(resp['statusCode'] == 200){
        console.log(resp);
        this.installation_list = resp['result'];
        this.count = resp['tab_count'];
        this.total_count = resp['tab_count'];
        this.db.dismissLoading();
      }
      else {
        this.db.errorToast(resp['statusMsg'])
        this.db.dismissLoading();
      }
    },error => {
      this.db.Error_msg(error);
      this.db.dismiss();
    });
  }
  
  loadData(infiniteScroll) {
    this.filter.limit = 10;
    this.filter.start = this.installation_list.length
    this.db.addData({ 'filter':this.filter}, 'AppServiceTask/serviceInstallationList').then(resp => {
      if (resp['result'] == '') {
        this.flag = 1;
      }
      else {
        setTimeout(() => {
          this.installation_list = this.installation_list.concat(resp['result']);
          infiniteScroll.complete();
        }, 1000);
      }
    });
  }
  
  
  
  
  goInstallationDetail(id) {
    this.navCtrl.push(InstallationDetailPage,{ id: id})
  }
  
}
