import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { AddPaymentPage } from '../add-payment/add-payment';

/**
* Generated class for the ServiceInvoiceDetailPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-service-invoice-detail',
  templateUrl: 'service-invoice-detail.html',
})
export class ServiceInvoiceDetailPage {
  id:any;
  complaint_id:any;
  invoice_detail:any={};
  type:any;
  add_list:any=[];
  constructor(public navCtrl: NavController, public navParams: NavParams, public serve: DbserviceProvider,public db: MyserviceProvider) {
    console.log(this.navParams);

    this.id = this.navParams.data.id;
    // this.complaint_id = this.navParams.get('id');
    // console.log(this.complaint_id );

  }

  ionViewDidLoad() {
    this.getInvoiceDetail(this.id);
    console.log('ionViewDidLoad ServiceInvoiceDetailPage');
  }

  doRefresh(refresher){
    console.log('Begin async operation', refresher);
    this.getInvoiceDetail(this.id);
    refresher.complete();
  }

  getInvoiceDetail(id) {
    this.db.presentLoading();
    this.db.addData({ 'invoice_id': id }, 'AppServiceTask/serviceInvoiceDetail').then(response => {

      if (response['statusCode'] == 200) {
        console.log(response);

        this.db.dismissLoading();
        this.invoice_detail = response['result'];
        this.invoice_detail.type=response['result']['type']
        this.invoice_detail.status = response['result']['status']
        this.add_list=response['result']['add_list']
        console.log(this.invoice_detail);

      }
      else {
        this.db.errorToast(response['statusMsg'])
        this.db.dismissLoading();
      }
    });

  }

  gotoPayment(invoice_no ,complaint_no,invoice_final_amount){
    console.log(invoice_no);

    this.navCtrl.push(AddPaymentPage, {"invoice_no": invoice_no ,"complaint_no": complaint_no ,"invoice_final_amount": invoice_final_amount  });

  }

}
