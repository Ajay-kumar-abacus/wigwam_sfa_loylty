import { Component, ViewChild } from '@angular/core';
import { AlertController, IonicPage, LoadingController, ModalController, NavController, NavParams, PopoverController, ToastController } from 'ionic-angular';
import moment from 'moment';
import { AttendenceserviceProvider } from '../../providers/attendenceservice/attendenceservice';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { Storage } from '@ionic/storage';
import { LoyaltyAddPurchasePage } from '../loyalty-add-purchase/loyalty-add-purchase';
import { ExpenseStatusModalPage } from '../expense-status-modal/expense-status-modal';
import { LoyaltyPurchaseDetailPage } from '../loyalty-purchase-detail/loyalty-purchase-detail';
import { ConstantProvider } from '../../providers/constant/constant';
import { RegistrationPage } from '../login-section/registration/registration';
import { PurchaseUpdateStatusModalPage } from '../purchase-update-status-modal/purchase-update-status-modal';



/**
* Generated class for the LoyaltyPurchaseListPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-loyalty-purchase-list',
  templateUrl: 'loyalty-purchase-list.html',
})
export class LoyaltyPurchaseListPage {
  today_date = new Date().toISOString().slice(0, 10);
  today = new Date().toISOString().slice(0, 10);
  requestList: any = [];
  tomorrow_data : any
  userId: any;
  teamCount: any;
  requestSend: any = false;
  user_data: any = {};
  see_more_button: any = 0;
  filter: any = {};
  complete_count: any;
  pending_count: any;
  load_data: any = 0;
  otp_value: any = false;
  activeTab:string;
  upcoming_count: any;
  spinner: boolean = false;
  otpspinner: boolean = false;

  saveFlag: boolean = false;
  sendFlag: boolean = false;

  statusData:any={};
  type:any;
  otp: any = '';
  verify_data:any={};
  maxtime: any = 30;
    maxTime: any = 0;
    time: boolean = false;
    timer: any;

  purchaseType:any;
  tabCount:any={};
  influencerPurchase:any;
  influencer_detail:any={};
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public popoverCtrl: PopoverController,
    public serve: MyserviceProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public storage: Storage,
    public attendence_serv: AttendenceserviceProvider,
    public modalCtrl : ModalController,
    public constant: ConstantProvider,
    ) {
      this.type=this.navParams.get("type");
      this.purchaseType=this.navParams.get("purchaseType");

      this.today = moment(this.today).add(1, 'days').format('YYYY-MM-DD');
    }
    
    ionViewWillEnter() {
      this.influencer_detail=this.navParams.get('login_data');
      this.userId=this.navParams.get("login_id");
      this.activeTab = 'Pending';
      this.getrequest();
    }
    
    goOnAddpurchase() {
      this.navCtrl.push(LoyaltyAddPurchasePage, {'data':this.influencer_detail,'type':this.type,'userId':this.userId})
    }
    id: any;
    getrequest() {
      this.filter.limit=20;
      this.filter.start=0; 
      this.filter.status= this.activeTab
      this.serve.presentLoading();
     
      this.filter.influencer_type=this.influencerPurchase;

      if(this.constant.UserLoggedInData.loggedInUserType!='Other'){
      this.filter.employee_id = this.userId;
      }
      else{

        this.filter.login_id = this.constant.UserLoggedInData.id;

      }


      this.load_data = 0
      this.serve.addData({'filter':this.filter}, 'RetailerRequest/get_retailer_request').then((result) => {
        if(result['statusCode']==200){
          this.serve.dismissLoading();
          this.requestList = result['request_list'];
          this.tabCount = result['count'];
          this.requestSend = true
          this.load_data = 1;
           this.filter={};
        }else{
          this.serve.dismissLoading();
          this.serve.errorToast(result['statusMsg'])
          this.filter={};

        }
        
      }, error => {
        this.serve.Error_msg(error);
        this.serve.dismissLoading();
        this.filter={};

      })
    }
    
    go_to_Purchase_detail(id,influencer_id) {
      this.navCtrl.push(LoyaltyPurchaseDetailPage, { 'id': id,'type':this.type,'influencer_id':influencer_id,'userId':this.userId})
    }

 
    
    updateStatus(id, status, reason,points,otp){
      if (status == 'Reject' && !reason){
        this.serve.errorToast('Reason field is required');
        return;
      }
      
      // else if(status == 'Approved' && !points){
      //   this.serve.errorToast('Points field is required');
      //   return;
      // }
      else{
        const confirm = this.alertCtrl.create({
          title: 'Are you sure?',
          message: 'You want to change status!',
          buttons: [
            {
              text: 'No',
              handler: () => {
              }
            },
            {
              text: 'Yes',
              handler: () => {



                if(!this.verify_data.purchase_otp){
                  this.serve.errorToast('OTP IS REQUIRED');

                  return;
                }



                
                this.statusData.status_updated_by = this.userId;;
                this.statusData.id = id;
                this.statusData.point_value = points;
                this.statusData.status = status;
                this.statusData.status_reason = reason;
                this.statusData.verify_otp=this.verify_data.purchase_otp
                this.saveFlag = true;
                this.spinner=true;
                this.serve.addData({ 'data': this.statusData}, 'RetailerRequest/updateRequestStatus').then((result) => {
                  if(result['statusCode']==200){
                    if(result['statusMsg']=='Success'){
                      this.serve.successToast(result['statusMsg']);
                      this.getrequest();
                      this.serve.dismissLoading();
                      this.saveFlag = false;
                        this.otp_value=false

                       this.spinner=false;
                    }
                    else{
                      this.serve.errorToast(result['statusMsg'])
                      this.saveFlag = false;
                      this.spinner=false;
                      this.otp_value=false

                    }
                    
                  }else{
                    this.serve.dismissLoading();
                    this.serve.errorToast(result['statusMsg'])
                    this.saveFlag = false;
                    this.spinner=false;
                    this.otp_value=false

                  }
                  
                }, error => {
                  this.serve.Error_msg(error);
                  this.serve.dismissLoading();
                  this.spinner=false;
                     this.otp_value=false


                })
                
              }
            }
          ]
        });
        confirm.present();
      }
      
    }

    
    StartTimer() {
      this.timer = setTimeout((x) => {
        if (this.maxtime <= 0) { }
        this.maxTime -= 1;
  
        if (this.maxTime > 0) {
          this.time = true;
          this.StartTimer();
        }
        else {
          this.maxtime = 30;
          this.time = false;
        }
      }, 1000);
    }

    getOtpDetail(type,id) {
      if (type == 'resend') {
        this.maxTime = 30;
        this.otp_value=false
        this.StartTimer();
      }
      this.sendFlag=true
      this.otpspinner=true
      this.otp = Math.floor(100000 + Math.random() * 900000);
      this.serve.addData({'id':id,'status': 'Validated','otp':this.otp}, 'RetailerRequest/generate_otp').then((result) => {

        if(result['statusCode']==200){
            this.serve.successToast(result['statusMsg']);
            // this.sendFlag = false;
             this.otpspinner=false;
             this.time = false;            
       
          
        }else{
          this.serve.dismissLoading();
          this.serve.errorToast(result['statusMsg'])
          this.sendFlag = false;
          this.otpspinner=false;
        }
        
      }, error => {
        this.serve.Error_msg(error);
        this.serve.dismissLoading();
        this.otpspinner=false;


      })
        
      


       
    
    }


    otpvalidation() {

      if(this.verify_data.purchase_otp.length==6){

        if (this.verify_data.purchase_otp == this.otp) {
          this.otp_value = true;
        }

        else if(this.verify_data.purchase_otp.length==6 && this.verify_data.purchase_otp != this.otp){
          this.serve.errorToast('Wrong OTP')

        }
        else{
  
          this.otp_value = false;
  
        }

      }
     



     
    }
    
    flag:any='';
    loadData(infiniteScroll)
    {
      this.filter.start=this.requestList.length;
      this.filter.limit=20;
    
      this.filter.status= this.activeTab
      if(this.constant.UserLoggedInData.loggedInUserType!='Other'){
        this.filter.employee_id = this.userId;
        }
        else{
          this.filter.login_id = this.constant.UserLoggedInData.id;
        }

      this.serve.addData({ 'Date': this.filter.date, 'filter':this.filter}, 'RetailerRequest/get_retailer_request').then( (r) =>
      {
        if(r['request_list']=='')
        {
          this.flag=1;
          this.filter={};
        }
        else
        {
          setTimeout(()=>{
            this.requestList=this.requestList.concat(r['request_list']);
            this.filter={};
            infiniteScroll.complete();
          },1000);
        }
      }, error => {
        this.serve.Error_msg(error);
        this.serve.dismiss();
        this.filter={};

      });
    }
    doRefresh(refresher) {
      
      this.getrequest()
      setTimeout(() => {
        refresher.complete();
      }, 1000);
    }


    updateDetail() {
      this.influencer_detail.edit_profile = 'edit_profile';
      this.navCtrl.push(RegistrationPage, { 'data': this.influencer_detail, "mode": 'edit_page' })
    }

    updatestatus(id,status,point){

        let workTypeModal = this.modalCtrl.create(PurchaseUpdateStatusModalPage, { 'id':id,'status':status,'point':point,'userId':this.userId });

        workTypeModal.onDidDismiss(data => {
          this.getrequest();

          
        });

        workTypeModal.present();




    }
    
    
  }
  