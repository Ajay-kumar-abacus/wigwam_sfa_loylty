import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Loading, LoadingController } from 'ionic-angular';
import { ComplaintDetailPage} from '../../complaints/complaint-detail/complaint-detail';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { AddNewComplaintPage } from '../add-new-complaint/add-new-complaint';
import { MyserviceProvider } from '../../../providers/myservice/myservice';


/**
* Generated class for the ComplaintHistoryPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-complaint-history',
  templateUrl: 'complaint-history.html',
})
export class ComplaintHistoryPage {
  complaint_list : any=[];
  loading:Loading;
  filter:any={};
  flag:any='';
  count:any=[];
  total_count:any=[];
  data:any={};
  res:any={};
  start: any;
  msg: any;
  comp_id: any;
  dr_id: any;
  complaint_type: any = 'Pending'
  date_created:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public service:DbserviceProvider,public alertCtrl:AlertController,public loadingCtrl:LoadingController,public db: MyserviceProvider)
  {
    console.log(this.navParams);
    this.data.type  =this.navParams.data.type;
    console.log(this.data.type);
    this.presentLoading();
    this.getVisitStatus()

    if (this.navParams.get('dr_id')) {
      this.dr_id = this.navParams.get('dr_id');
    }

  }

  ionViewDidLoad() {
    this.filter.status='Pending';

    // console.log('ionViewDidLoad ComplaintHistoryPage');
  }

  onComplaintdetail(id)
  {
    this.navCtrl.push(ComplaintDetailPage,{'id':id});
  }

  presentLoading()
  {

    this.loading = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  doRefresh(refresher)
  {
    console.log('Begin async operation', refresher);
    this.getComplaintList();
    refresher.complete();
  }





   getComplaintList()
  {
    this.flag=0;
    this.filter.limit = 5;
    this.filter.start=0;
    this.filter.master='';
    this.filter.status= this.complaint_type
    this.db.presentLoading();
    this.db.addData({'filter' : this.filter},'AppServiceTask/serviceComplaintList').then((result) =>
    {
      if(result['statusCode'] == 200){
        // console.log(result);
      this.complaint_list = result['result'];
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

  getVisitStatus()
  {
    this.db.addData({},'AppServiceTask/checkComplaintVisitStatus').then((result) =>
    {
      if(result['statusCode'] == 200){
        this.res = result['data'];
        this.msg = result['msg'];
        if (this.msg == 'Stop') {
          this.comp_id=this.res.complaint_id
          this.goCompalintDetail(this.comp_id)

        } else {
          this.getComplaintList()
        }
      }
      else{
        this.db.errorToast(result['statusMsg']);
      }
    }
    , error => {
      this.db.Error_msg(error);
    }
    );
  }

  loadData(infiniteScroll) {
    this.filter.limit = 5;
    this.filter.start = this.complaint_list.length

    this.db.addData({ 'filter':this.filter}, 'AppServiceTask/serviceComplaintList').then(resp => {
      if (resp['result'] == '') {
        this.flag = 1;
      }
      else {
        setTimeout(() => {
          this.complaint_list = this.complaint_list.concat(resp['result']);
          infiniteScroll.complete();
        }, 1000);
      }
    });
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

  addComplaint() {
    this.navCtrl.push(AddNewComplaintPage);
  }

  goCompalintDetail(id) {
    this.navCtrl.push(ComplaintDetailPage,{ id: id})
  }

}
