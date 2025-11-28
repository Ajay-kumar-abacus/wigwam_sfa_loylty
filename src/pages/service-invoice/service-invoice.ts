import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { ServiceInvoiceDetailPage } from '../service-invoice-detail/service-invoice-detail';
@IonicPage()
@Component({
  selector: 'page-service-invoice',
  templateUrl: 'service-invoice.html',
})
export class ServiceInvoicePage {

  invoice_list : any=[];
  loading:any;
  filter:any={};
  flag:any='';
  count:any=[];
  total_count:any=[];
  data:any={};
  start: any;
  dr_id: any;
  date_created:any;
  status:any='Pending';

  constructor(public navCtrl: NavController, public navParams: NavParams,public service:DbserviceProvider,public alertCtrl:AlertController,public loadingCtrl:LoadingController,public db: MyserviceProvider)
  {
    console.log(this.navParams);
    this.data.type  =this.navParams.data.type;
    console.log(this.data.type);
    this.presentLoading();
    this.getInvoiceList()

    if (this.navParams.get('dr_id')) {
      this.dr_id = this.navParams.get('dr_id');
    }

  }

  doRefresh(refresher)
  {
    console.log('Begin async operation', refresher);
    this.getInvoiceList();
    refresher.complete();
  }
  // onComplaintdetail(id)
  // {
  //   this.navCtrl.push(ServiceInvoiceDetailPage,{'id':id});
  // }
  presentLoading()
  {
    this.loading = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  getInvoiceList()
  {
    this.flag=0;
    this.filter.limit = 5;
    this.filter.start=0;
    this.filter.master='';
    this.filter.status=this.status;
    this.db.presentLoading();
    this.db.addData({'filter' : this.filter},'AppServiceTask/serviceInvoiceList').then((result) =>
    {
      if(result['statusCode'] == 200){
        console.log(result);
        this.invoice_list = result['result'];
        this.invoice_list.status = result['result']['status']
        this.count = result['count'];
        this.total_count = result['tab_count'];
        this.db.dismissLoading();
      }
      else{
        this.db.errorToast(result['statusMsg']);
        this.db.dismissLoading();
      }
    }
    , error => {
      this.db.Error_msg(error);
      this.db.dismiss();
    }
    );
  }
  goinvoiceDetail(id) {
    this.navCtrl.push(ServiceInvoiceDetailPage,{ id: id})
  }
  loadData(infiniteScroll) {
    this.filter.limit = 5;
    this.filter.start = this.invoice_list.length

    this.db.addData({ 'filter':this.filter}, 'AppServiceTask/serviceInvoiceList').then(resp => {
      console.log('load')

      if (resp['result'] == '') {
        console.log('load')
        this.flag = 1;
      }
      else {
        setTimeout(() => {
          this.invoice_list = this.invoice_list.concat(resp['result']);
          infiniteScroll.complete();
        }, 1000);
      }
    });
  }
}
