import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { HomePage } from '../home/home';
import { MainDistributorListPage } from '../sales-app/main-distributor-list/main-distributor-list';




@IonicPage()
@Component({
  selector: 'page-main-home',
  templateUrl: 'main-home.html',
})
export class MainHomePage {
	items = [
    'Advance Decorative Laminates'
  ];
  networkType: any = []
  constructor(public navCtrl: NavController,public dbservice:DbserviceProvider,public service:MyserviceProvider, public navParams: NavParams) {
    if(this.dbservice.connection=='offline')
    {
      this.dbservice.showOfflineAlert()
      this.navCtrl.setRoot(HomePage)
    }
  }

 ionViewDidEnter(){
  this.getNetworkType()
 }


  getNetworkType() {
    this.service.presentLoading()
      this.service.addData('', "AppCustomerNetwork/distributionNetworkModule").then(result => {
          this.networkType = result['modules'];
          this.service.dismissLoading()
      }, err => {
          this.service.Error_msg(err);
          this.service.dismiss();
      })
  }
  goToMainDistributorListPage(type, module_name) { 


    this.navCtrl.push(MainDistributorListPage, { 'type': type, 'module_name': module_name })


}
}
