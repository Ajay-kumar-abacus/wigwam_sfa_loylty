import { Component } from '@angular/core';
import { AlertController, IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { ConstantProvider } from '../../providers/constant/constant';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { ViewProfilePage } from '../view-profile/view-profile';
@IonicPage()
@Component({
  selector: 'page-brand-audit-detail',
  templateUrl: 'brand-audit-detail.html',
})
export class BrandAuditDetailPage {
  id:any;
  brandAuditDetail:any ={};
  docImg:any =[];

  data:any ={};
  star:any=''; 
  url:any ='';
  
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public constant: ConstantProvider,  public alertCtrl: AlertController, private service:MyserviceProvider,public modalCtrl:ModalController) {
    this.url = this.constant.upload_url1 + 'brandAudit/';
    this.service.presentLoading();
    
    
    if (this.navParams.get('id')) {
      this.id = this.navParams.get('id');
    }
    if(this.id){
      this.getBrandAuditDetail();
    }
  }
  
  ionViewDidLoad() {
  }
  
  start_rating:any= {};
  

  getBrandAuditDetail() {
    this.service.addData({'id':this.id}, 'AppBrandAudit/getBrandAuditDetail').then((result) => {
      if(result['statusCode'] == 200){
        this.brandAuditDetail = result['data'];
        this.docImg = this.brandAuditDetail.img;

        this.star = this.brandAuditDetail.feedback_star;
        this.service.dismissLoading();
      }
      else{
        this.service.errorToast(result['statusMsg']);
        this.service.dismissLoading();
      }
    },
    er => {
      this.service.dismissLoading();
    });
  }

  

  imageModal(src) {
    this.modalCtrl.create(ViewProfilePage, { "Image": src }).present();
  }
  
}
