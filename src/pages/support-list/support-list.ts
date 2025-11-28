import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { SupportDetailPage } from '../support-detail/support-detail';
import { SupportPage } from '../support/support';

/**
* Generated class for the SupportListPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-support-list',
  templateUrl: 'support-list.html',
})
export class SupportListPage {
  supportData:any =[];
  activeTab:string ='Pending';
  filter:any={};
  Frompage:any=''
  Dr_id:any=''
  
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private service: MyserviceProvider) {
    this.service.presentLoading();
   this.Frompage = this.navParams.get('fromPage')
   this.Dr_id = this.navParams.get('dr_id')
  }

  
  ionViewDidEnter(){
    this.get_support_list(this.activeTab)
  }
  
  get_support_list(tab) {
    this.filter.limit=20;
    this.filter.start=0;
    let header
    if(this.Frompage == 'ticket'){
      header = {'status':tab, 'filter' : this.filter ,'customer_id':this.Dr_id}
    }else{
      header = {'status':tab, 'filter' : this.filter}
    }
    this.service.addData(header, 'AppSupport/getSupportList').then((result) => {
      if(result['statusCode'] == 200){
        this.supportData = result['data'];
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
    
    
    
    
    flag:any=0;
    loadData(infiniteScroll)
    {
      this.filter.start=this.supportData.length;
      let header
      if(this.Frompage == 'ticket'){
        header = {'status':this.activeTab, 'filter' : this.filter ,'customer_id':this.Dr_id}
      }else{
        header = {'status':this.activeTab, 'filter' : this.filter}
      }
      this.service.addData(header,'AppSupport/getSupportList').then( (r) =>
      {
        console.log(r)
        if(r=='')
        {
          this.flag=1;
        }
        else
        {
          setTimeout(()=>{
            this.supportData=this.supportData.concat(r['data']);
            infiniteScroll.complete();
          },1000);
        }
      }, error => {
        this.service.Error_msg(error);
        this.service.dismiss();
      });
    }
    
    doRefresh(refresher) {
      this.get_support_list(this.activeTab)
      setTimeout(() => {
        refresher.complete();
      }, 1000);
    }
    
    
    goToSupportAdd(){
      this.navCtrl.push(SupportPage)
    }
    support_detail(id){
      this.navCtrl.push(SupportDetailPage,{'id':id})
    }
  }
  