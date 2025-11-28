import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ConstantProvider } from '../../providers/constant/constant';
import { Storage } from '@ionic/storage';
import { MyserviceProvider } from '../../providers/myservice/myservice';



/**
 * Generated class for the PurchaseUpdateStatusModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-purchase-update-status-modal',
  templateUrl: 'purchase-update-status-modal.html',
})
export class PurchaseUpdateStatusModalPage {
  data:any={};
  otpspinner: boolean = false;
  
  otp_value: any = false;

  spinner: boolean = false;

  saveFlag: boolean = false;
  sendFlag: boolean = false;

  statusData:any={};
  type:any;
  otp: any = '';



  maxtime: any = 30;
    maxTime: any = 0;
    time: boolean = false;
    timer: any;

    
  constructor(public navCtrl: NavController, public navParams: NavParams,  public constant: ConstantProvider,private Storage: Storage,public viewCtrl: ViewController, public serve: MyserviceProvider, public alertCtrl: AlertController,) {


      this.data.id = this.navParams.get("id");
      this.data.status = this.navParams.get("status");
      this.data.point = this.navParams.get("point");
      this.data.userId = this.navParams.get("userId");
      this.data.dealer_mobile = this.navParams.get("dealer_mobile");
      this.data.influencer_id = this.navParams.get("influencer_id");


      if(this.data.status!='Reject'){
      this.getOtpDetail('',this.data.id);


      }



  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PurchaseUpdateStatusModalPage');
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
    this.serve.addData({'id':id,'status': this.data.status,'otp':this.otp}, 'RetailerRequest/generate_otp').then((result) => {

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
    if(this.data.purchase_otp.length==6){

      if (this.data.purchase_otp == this.otp) {
        this.otp_value = true;
      }

      else if(this.data.purchase_otp.length==6 && this.data.purchase_otp != this.otp){
        this.serve.errorToast('Wrong OTP')

      }
      else{

        this.otp_value = false;

      }

    }
    else{
      this.otp_value = false;


    }



   



   
  }



  updateStatus(){
    if (this.data.status == 'Reject' && !this.data.reason){
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



              if(!this.data.purchase_otp && this.data.status!='Reject'){
                this.serve.errorToast('OTP IS REQUIRED');

                return;
              }



              
              this.statusData.status_updated_by = this.data.userId;;
              this.statusData.id = this.data.id;
              this.statusData.point_value = this.data.point;
              this.statusData.status = this.data.status;
              this.statusData.status_reason = this.data.reason;
              this.statusData.verify_otp=this.data.purchase_otp
              this.statusData.influencer_id=this.data.influencer_id

              this.saveFlag = true;
              this.spinner=true;
              this.serve.addData({ 'data': this.statusData}, 'RetailerRequest/updateRequestStatus').then((result) => {
                if(result['statusCode']==200){
                  if(result['statusMsg']=='Success'){
                    this.serve.successToast(result['statusMsg']);
                    this.serve.dismissLoading();
                    let data  = {'value':'true'}
                     this.viewCtrl.dismiss(data);
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











  dismiss() {
    this.viewCtrl.dismiss();
  }





}
