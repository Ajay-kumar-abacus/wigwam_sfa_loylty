import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { SupportDetailPage } from '../support-detail/support-detail';
import { SupportPage } from '../support/support';
import { BrandAuditAddPage } from '../brand-audit-add/brand-audit-add';
import { BrandAuditDetailPage } from '../brand-audit-detail/brand-audit-detail';


@IonicPage()
@Component({
  selector: 'page-brand-audit-list',
  templateUrl: 'brand-audit-list.html',
})
export class BrandAuditListPage {
  brandAuditData:any =[];
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
    this.getBrandAuditList()
  }
  
  getBrandAuditList() {
    this.filter.limit=20;
    this.filter.start=0;
    let header
    if(this.Frompage == 'audit'){
      header = {'filter' : this.filter ,'customer_id':this.Dr_id}
    }else{
      header = {'filter' : this.filter}
    }
    this.service.addData(header, 'AppBrandAudit/getBrandAuditList').then((result) => {
      if(result['statusCode'] == 200){
        this.brandAuditData = result['data'];
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
      this.filter.start=this.brandAuditData.length;
      let header
      if(this.Frompage == 'audit'){
        header = {'filter' : this.filter ,'customer_id':this.Dr_id}
      }else{
        header = {'filter' : this.filter}
      }
      this.service.addData(header,'AppBrandAudit/getBrandAuditList').then( (r) =>
      {
        if(r=='')
        {
          this.flag=1;
        }
        else
        {
          setTimeout(()=>{
            this.brandAuditData=this.brandAuditData.concat(r['data']);
            infiniteScroll.complete();
          },1000);
        }
      }, error => {
        this.service.Error_msg(error);
        this.service.dismiss();
      });
    }
    
    doRefresh(refresher) {
      this.getBrandAuditList()
      setTimeout(() => {
        refresher.complete();
      }, 1000);
    }
    
    
    goToBrandAuditAdd(){
      this.navCtrl.push(BrandAuditAddPage)
    }
    support_detail(id){
      this.navCtrl.push(BrandAuditDetailPage,{'id':id})
    }
  }
  