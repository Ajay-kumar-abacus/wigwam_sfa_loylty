import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from 'ionic-angular';
import { EnquiryserviceProvider } from '../../providers/enquiryservice/enquiryservice';
import { Storage } from '@ionic/storage';
import { ExecutiveOrderDetailPage } from '../executive-order-detail/executive-order-detail';
import moment from 'moment';
import { ConstantProvider } from '../../providers/constant/constant';
import { ViewProfilePage } from '../view-profile/view-profile';
import { BackgroundTrackDetailPage } from '../background-track-detail/background-track-detail';

@IonicPage()
@Component({
  selector: 'page-background-track-listing',
  templateUrl: 'background-track-listing.html',
})
export class BackgroundTrackListingPage {
  userId:any;
  data:any={};
  usersDataCount:any={};
  updatedData:any={};
  filter:any={};
  validateForm: FormGroup;
  type:any;
  user_list:any=[];
  assignUserList:any=[];
  brand:any=[];
  brandList:any=[];
  salesUserList:any=[];
  countryList:any=[];
  state_list:any=[];
  district_list:any = [];
  city_list:any=[];
  upload_url:any
  todayDate: string;

  constructor(
               public navCtrl: NavController, 
               public navParams: NavParams,
               public service:MyserviceProvider,
               public loadingCtrl: LoadingController,
               public formBuilder: FormBuilder,
               public db:EnquiryserviceProvider,
               public modalCtrl: ModalController,
               public storage:Storage,
               public toastCtrl: ToastController,
               public constant : ConstantProvider) 
  {
    this.upload_url = this.constant.upload_url1 + 'profile/'
    const today = new Date();
  this.todayDate = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  }

  ionViewDidLoad() 
  {
    this.getuserlist('Present')
    this.get_user()
  }
  get_user() {
    this.storage.get('userId').then((id) => {
      this.userId = id;
    this.service.addData({ 'user_id': this.userId }, "AppAttendence/getAllAsm")
    .then(result => {
      if(result['statusCode']==200){
        this.assignUserList = result['asm_id'];
      }else{
        this.service.errorToast(result['statusMsg'])
      }
    }, error => {
      this.service.Error_msg(error);
      this.service.dismiss();
    })
  })
  }
  getuserlist(tab) {
    
   this.service.presentLoading()
      
      this.filter.tab = tab
      this.filter.user_id = this.data.id
      this.service.addData(this.filter, 'AppAttendence/getTeamAttendanceToday').then((result) => {
        if (result['statusCode'] == 200) {
          this.usersDataCount = result['header_count']
          // this.user_list = result['attendance'];
               // Filter attendance data by attendence_status
      this.user_list = result['attendance'].filter(user => user.user_data.attendence_status == this.filter.tab);
        
      console.log(this.user_list,"line 90")
          this.service.dismissLoading()
          console.log(this.filter,"line 88")
        } else {
          this.service.errorToast(result['statusMsg'])
          this.service.dismissLoading()

        }
      }, err => {
        this.service.Error_msg(err);
        this.service.dismiss();
      });
   

  }
  doRefresh(refresher) {
    if (this.filter)
      this.filter = {}
    this.getuserlist('Present')
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }
  GoToDetail(data){
    console.log(data,"this is data")
    let dateData
    if(this.filter.date == ""){
      dateData = new Date()
    }else{
      dateData = this.filter.date
      this.navCtrl.push(BackgroundTrackDetailPage, { 'from':'teamMember','userDetail': data,'date':moment(dateData).format('yyyy-MM-DD')})
    }
   
  }
  refresh(){
    this.filter = {}
    this.data = {}
    this.getuserlist('Present')
  }
  imageModal(src) {
    this.modalCtrl.create(ViewProfilePage, { "Image": src }).present();
  }
}
