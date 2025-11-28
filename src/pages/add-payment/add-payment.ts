import { Component } from '@angular/core';
import { AlertController, IonicPage,Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { ServiceInvoiceDetailPage } from '../service-invoice-detail/service-invoice-detail';

/**
* Generated class for the AddPaymentPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-add-payment',
  templateUrl: 'add-payment.html',
})
export class AddPaymentPage {

  formData:any={};
  id:any;
  invoice_no:any;
  complaint_no:any;
  invoice_final_amount:any;
  loading:Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams,public serve: MyserviceProvider,public alertCtrl: AlertController ,public loadingCtrl: LoadingController) {
    console.log(this.navParams);
    this.invoice_final_amount=this.navParams.data.invoice_final_amount
    this.complaint_no= this.navParams.data.complaint_no
    this.invoice_no=this.navParams.data.invoice_no;
    this.id = this.navParams.data.id;
    this.formData.invoice_final_amount=this.invoice_final_amount;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPaymentPage');
  }
// doRefresh(refresher){
//     console.log('Begin async operation', refresher);


//     refresher.complete();
//   }
  AddPayment(){
    console.log(this.formData);
    this.formData.invoice_no=this.invoice_no;
    this.formData.complaint_no=this.complaint_no;
    this.serve.presentLoading();
    this.serve.addData({ "data": this.formData, }, 'AppServiceTask/savePaymentData').then(result => {
      if (result['statusCode'] == 200) {
        this.serve.dismissLoading();
        this.showSuccess("Payment Added Successfully!");
        this.navCtrl.popTo(ServiceInvoiceDetailPage, { id: this.id });
      }
      else {
        this.serve.dismissLoading();
        this.serve.errorToast(result['statusMsg'])
      }
      console.log(result);
    });
  }

  showSuccess(text) {
    let alert = this.alertCtrl.create({
      title: 'Success!',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }
 presentLoading()
  {
    this.loading = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange: true
    });
    this.loading.present();
  }
}
