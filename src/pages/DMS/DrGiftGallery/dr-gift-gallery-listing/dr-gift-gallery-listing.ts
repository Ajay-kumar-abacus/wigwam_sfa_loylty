import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { MyserviceProvider } from '../../../../providers/myservice/myservice';
import moment from 'moment';
import { ConstantProvider } from '../../../../providers/constant/constant';
@IonicPage()
@Component({
  selector: 'page-dr-gift-gallery-listing',
  templateUrl: 'dr-gift-gallery-listing.html',
})
export class DrGiftGalleryListingPage {
  giftType:any='Gift'
  filter:any={};
  gift_list:any=[];
  total_point:any ={};
  today_date:any=new Date()
  uploadUrl:any




  constructor(public navCtrl: NavController, public navParams: NavParams,public service:MyserviceProvider,public loadingCtrl:LoadingController,public constant:ConstantProvider) {
    this.uploadUrl =this.constant.upload_url1+'gift_gallery/';
    this.today_date = moment().format("Y-M-D");
    this.getGiftList('');


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DrGiftGalleryListingPage');
  }
  typeofValue(value){
    if(isNaN(value)){
      return value;
    }else{
      return 'to '+value+' Points'
    }
  }
  doRefresh(refresher) 
  {
    this.getGiftList(''); 
    refresher.complete();
  }
  total_balance_point:any=0;

  getGiftList(search, type:any='Gift')
  {
    this.filter.limit=20;
    this.filter.start=0;
    this.filter.search=search;
    // this.filter.redeemable = this.mode;
    this.service.presentLoading();

    this.service.addData({'filter' : this.filter, 'gift_type':type},'AppGiftGallery/giftGalleryList').then( (result) =>
    {
      this.total_point=result['wallet_point'];
      this.gift_list=result['gift_master_list'];
      
      if(result['statusCode'] == 200){
        this.gift_list=result['gift_master_list'];
        this.service.dismissLoading();
      }
      else{
        this.service.errorToast(result['statusMsg']);
        this.service.dismissLoading();
      }
    }, err => {
        this.service.Error_msg(err);
        this.service.dismissLoading();
    });
  }

  flag:any='';
  loadData(infiniteScroll)  
  {
    this.filter.start=this.gift_list.length;
    
    this.service.addData({'filter' : this.filter, gift_type:'Gift'},'AppGiftGallery/giftGalleryList').then( (r) =>
    {
      if(r=='')
      {
        this.flag=1;
      }
      else
      {
        setTimeout(()=>{
          this.gift_list=this.gift_list.concat(r['gift_master_list']);
          infiniteScroll.complete();
        },1000);
      }
    }, err => {
      this.service.Error_msg(err);
      this.service.dismissLoading();
  });
  }

}
