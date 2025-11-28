import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { ConstantProvider } from '../../providers/constant/constant';

/**
 * Generated class for the Super30Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-super30',
  templateUrl: 'super30.html',
})
export class Super30Page {

  influcencer_list:any=[];
  loading:Loading;
  uploadurl: any = ''
  lang:'en';

  
  constructor(public navCtrl: NavController, public navParams: NavParams,public service:MyserviceProvider,public loadingCtrl:LoadingController,public constant: ConstantProvider) {
    this.uploadurl = constant.upload_url1 + 'influencer_doc/';

    this.getList();
 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Super30Page');
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
    this.getList(); 
    refresher.complete();
  }
  filter:any={}
  SelfData:any={}
  getList()
    {
     
      this.service.presentLoading();
      this.service.addData({},'AppInfluencer/top_influencer_List').then(result =>
        {
          if(result['statusCode'] == 200){
            this.influcencer_list=result['result'];
            var index = result['result'].findIndex(row=>row.id==this.constant.UserLoggedInData.id);
            console.log(index);
            if(index!=-1)
            {
              this.SelfData.id = result['result'][index].id;
              this.SelfData.index  = index+1
            }
            this.service.dismissLoading();
          }
          else{
            this.service.errorToast(result['statusMsg']);
            this.service.dismissLoading();
          }
          
        }, error => {
          this.service.Error_msg(error);
          this.service.dismiss();
        });
      }

  flag:any='';


  loadData(infiniteScroll)
  {
    console.log('loading');
    
    this.filter.limit=this.influcencer_list.length;
    this.service.addData({},'AppInfluencer/top_influencer_List').then( r =>
      {
        console.log(r);
        if(r['result']=='')
        {
          this.flag=1;
        }
        else
        {
          setTimeout(()=>{
            this.influcencer_list=this.influcencer_list.concat(r['result']);
            console.log('Asyn operation has stop')
            infiniteScroll.complete();
          },1000);
        }
      });
    }

}
