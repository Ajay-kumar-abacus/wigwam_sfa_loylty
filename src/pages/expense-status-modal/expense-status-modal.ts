import { Component } from '@angular/core';
import { AlertController, IonicPage, ModalController, NavController, NavParams, ActionSheetController, ToastController, ViewController } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { ContractorModalPage } from '../Contractor-Meet/contractor-modal/contractor-modal';
import { LeadsDetailPage } from '../leads-detail/leads-detail';
import { Device } from '@ionic-native/device';
import { Diagnostic } from '@ionic-native/diagnostic';
import { CameraModalPage } from '../camera-modal/camera-modal';
declare let cordova: any;
@IonicPage()
@Component({
  selector: 'page-expense-status-modal',
  templateUrl: 'expense-status-modal.html',
})
export class ExpenseStatusModalPage {
  selectAuto: boolean = false;
  data: any = {}
  filter: any = {}
  followup_detail: any = {}
  from_page: any = ''
  EventId: any
  image: any = []
  image_data: any = []
  today_date = new Date().toISOString().slice(0, 10);
  max_date = new Date().getFullYear() + 1;
  savingFlag: boolean = false;
  type: any;
  pageType: any;


  constructor(
    public navCtrl: NavController,
    public diagnostic: Diagnostic,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public serve: MyserviceProvider,
    public Device:Device,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    public camera: Camera,
    public alertCtrl: AlertController) {

    this.from_page = this.navParams.get("from");
    this.type = this.navParams.get("type");
    console.log('frompage', this.from_page)
    this.EventId = this.navParams.get("event_id");

    if (this.from_page == 'team') {
      this.data.type = this.navParams.get("type");
    }
    if (this.from_page == 'Target') {
      this.data.id = this.navParams.get("ProjectionId");
      this.data.sale_type = this.navParams.get("sale_type");
      this.data.target_type = this.navParams.get("target_type");
      console.log(this.data.id);
      console.log(this.data.sale_type);
    }
    if (this.type == 'edit') {
      this.data.id = this.navParams.get("ProjectionId");
      this.data.sale_type = this.navParams.get("sale_type");
      this.data.target_type = this.navParams.get("target_type");
      console.log(this.data.id);
      console.log(this.data.sale_type);
    }

    if (this.from_page == 'travel_status') {
      this.data.id = this.navParams.get("travelId");
    }
    if (this.from_page == 'leave') {
      this.data.id = this.navParams.get("leaveId");
    }
    if (this.from_page == 'expense') {
      this.data.id = this.navParams.get("expenseId");
      this.data.type = this.navParams.get("type");
    }
    if (this.from_page == 'ExpenseDateFilter') {
      this.data.date_from = this.navParams.get("filter").date_from;
      this.data.date_to = this.navParams.get("filter").date_to;
    }
    if (this.from_page == 'MyType') {
      this.data.id = this.navParams.get("leaveId");
    }
    if (this.from_page == 'TeamType') {
      this.data.id = this.navParams.get("leaveId");
    }
    if (this.from_page == 'travel') {
      this.data.id = this.navParams.get("travelId");
    }
    if (this.from_page == 'lead_detail') {
      this.data.dr_id = this.navParams.get("leadID");
    }
    if (this.from_page == 'team') {
      this.data.type = this.navParams.get("type");
    }
    if (this.from_page == 'followup') {
      this.data.id = this.navParams.get("follow_up_id");
      this.followup_detail = this.navParams.get("followup_detail")
    }
    if (this.from_page == 'influencer_followup') {
      this.data.type = this.navParams.get("type");
      this.data.dr_type = this.navParams.get("dr_type");
      this.data.dr_id = this.navParams.get("id");
      this.data.id = this.navParams.get("id");
      this.data.dr_name = this.navParams.get("name");
      this.data.dr_type_name = 'enquiry';
      this.data.type_name = 'enquiry';
    }
    if (this.from_page == 'enquiry_status') {
      this.data.dr_id = this.navParams.get("id");
      this.data.type = this.navParams.get("type");
      this.data.converted = this.navParams.get("converted");
      this.data.lead_status = 'Lost'
      if (this.data.type == 'Inprocess') {
        this.data.lead_status = 'Lost'
      }
    }
    if (this.from_page == 'site_status') {
      this.pageType = this.navParams.get("siteStatus");
      if (this.navParams.get("siteStatus") == 'Win-F') {
        this.data.lead_status = 'Win-C'
      }
      else if (this.navParams.get("siteStatus") == 'Open') {
        this.data.lead_status = 'Lost'
      }
      else {
        this.data.siteStatus = this.navParams.get("siteStatus");
      }
      this.data.dr_id = this.navParams.get("id");
      this.data.type = this.navParams.get("type");
      this.selectAuto = this.navParams.get("selectAuto");
    }
    if (this.from_page == 'site_followup') {
      console.log(this.navParams)
      this.data.type = this.navParams.get("type");
      this.data.dr_type = this.navParams.get("dr_type");
      this.data.id = this.navParams.get("id");
      this.data.dr_name = this.navParams.get("name")
      this.data.dr_type_name = 'site';
    }
    if (this.from_page == 'event') {
      this.data = this.navParams.get("eventData");
    }
    if (this.from_page == 'event_status') {

      this.data = this.navParams
      this.data.id = this.navParams.get("eventId");
      this.data.approved_amount = this.navParams.get("total_budget")

    }
    if (this.from_page == 'Enquiry_List' || this.from_page == 'Site_Listing') {
      if (this.from_page == 'Enquiry_List') {
        this.data.enquiry_id = this.navParams.get('id')

      } else {
        this.data.site_id = this.navParams.get('id')

      }

      this.getUserList();
    }
    if (this.from_page == 'customerDetail') {

      this.data.customer_id = this.navParams.get('id')
      this.getUserList();

    }
  }


  ionViewDidLoad() {

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }


  update_status() {
    var func_name
    if (this.from_page == 'expense') {
      func_name = 'AppExpense/updateStatus'
    }
    if (this.from_page == 'expense') {
      func_name = 'AppTravelPlan/updateStatus'
    }
    if (this.from_page == 'leave') {
      func_name = 'AppLeave/statusChange'

    }
    if (this.from_page == 'travel_status') {
      func_name = 'AppTravelPlan/updateStatus'
    }
    if (this.from_page == 'TeamType') {
      func_name = 'AppLeave/statusChange'

    }
    if (this.from_page == 'MyType') {
      func_name = 'AppLeave/statusChange'

    }
    if (this.from_page == 'enquiry_status') {
      func_name = 'AppEnquiry/enquiryStageChange'
    }
    if (this.from_page == 'site_status') {
      func_name = 'AppEnquiry/siteStageChange'
    }
    if (this.from_page == 'Target' && this.type != 'edit') {
      func_name = 'AppTarget/primaryTargetSeniorStatusChange'
    }
    if (this.type == 'edit') {
      func_name = 'AppTarget/updateTarget'
    }
    let updateAlert = this.alertCtrl.create({
      title: 'Confirm',
      message: 'Are you sure ?',
      buttons: [
        { text: 'No', },
        {
          text: 'Yes',
          handler: () => {
            this.serve.addData(this.data, func_name).then((result) => {
              if (result['statusCode'] == 200) {
                this.serve.successToast(result['statusMsg']);
                this.savingFlag = false;
                console.log(result)

                let dr_id = result['dr_id'];
                let dr_type = result['dr_type'];
                if (this.from_page == 'site_status' || this.from_page == 'site_followup') {
                  this.viewCtrl.dismiss(true);
                } else if (dr_id == 0 && this.from_page == 'enquiry_status') {
                  this.viewCtrl.dismiss(true, '');
                } else if (dr_id != 0 && this.from_page == 'enquiry_status' && this.data.lead_status == 'Win') {
                  this.navCtrl.push(LeadsDetailPage, { 'dr_id': dr_id, 'type': 'Dr', 'dr_type': dr_type, "Mode": 'My' })
                  this.viewCtrl.dismiss(true);
                } else {
                  this.viewCtrl.dismiss(true);
                }

              }
              else {
                this.serve.errorToast(result['statusMsg']);
                this.savingFlag = false;
              }
            }, error => {
              this.serve.Error_msg(error);
              this.serve.dismiss();
            });
          }
        }
      ]
    });
    updateAlert.present();
  }
  team: any = []



  ondismiss() {
    {
      var data = this.filter
      this.viewCtrl.dismiss(
        data
      );
    }
  }
  ondismiss1() {
    {
      var data = this.data
      this.viewCtrl.dismiss(
        data
      );
    }
  }



  addFollowup() {
    console.log("Data ", this.data)
    this.savingFlag = true;
    this.serve.addData(this.data, 'AppFollowup/addFollowup').then((result) => {
      if (result['statusCode'] == 200) {
        this.serve.successToast(result['statusMsg']);
        this.savingFlag = false;
        this.viewCtrl.dismiss();
      }
      else {
        this.serve.errorToast(result['statusMsg']);
        this.savingFlag = false;
      }
    }, err => {
    })
  }
  Users: any = []
  getUserList() {
    this.serve.addData({}, 'AppEnquiry/getAllTeamMembers').then((result) => {
      console.log(result)
      if (result['statusCode'] == 200) {
        this.Users = result['asm_id']
      }
      else {
        this.serve.errorToast(result['statusMsg']);
      }
    }, err => {
    })
  }
  change_followup_status() {
    this.serve.addData({ 'Id': this.followup_detail.id, 'Status': this.followup_detail.status, 'followup_date': this.followup_detail.follow_up_date, 'followup_remark': this.followup_detail.followup_remark,'next_date':this.followup_detail.followup_date }, 'AppFollowup/followupUpdate').then((result) => {

      if (result['statusCode'] == 200) {
        this.serve.successToast(result['statusMsg'])
        this.viewCtrl.dismiss(true);

      } else {
        this.serve.errorToast(result['statusMsg'])
      }


    }, error => {
      this.serve.Error_msg(error);
      this.serve.dismissLoading();
    });

  }

  postponedEvent() {
    const requestData = {
      event_id: this.EventId,
      reason: this.data.reason,
      postponedDate: this.data.postponedDate
    };
    this.serve.addData(requestData, "AppEvent/postponeEvent")
      .then((result: any) => {

        if (result['statusCode'] == 200) {
          this.serve.successToast(result['statusMsg'])
          this.viewCtrl.dismiss(true);


        } else {
          this.serve.errorToast(result['statusMsg'])

        }
      })
  }

  openDocument(imageSource) {
    this.modalCtrl.create(ContractorModalPage, { "img": imageSource }).present();
  }
  remove_image(i: any) {
    this.image_data.splice(i, 1);
  }
  captureImage() {
    let actionsheet = this.actionSheetCtrl.create({
      title: "Select Type",
      cssClass: 'cs-actionsheet',

      buttons: [{
        cssClass: 'sheet-m',
        text: 'Camera',
        icon: 'camera',
        handler: () => {
          console.log("Camera Clicked");

          // this.takePhoto();
          this.cameraModal('camera');
        }
      },
      {
        cssClass: 'sheet-m1',
        text: 'Gallery',
        icon: 'image',
        handler: () => {
          console.log("Gallery Clicked");
          this.getImage();
        }
      },
      {
        cssClass: 'cs-cancel',
        text: 'Cancel',
        role: 'cancel',
        icon: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }
      ]
    });
    actionsheet.present();
  }
  getImage() {
    this.diagnostic.requestCameraAuthorization().then((isAvailable: any) => {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false
    }
    if(this.Device.platform=='Android'){
        cordova.plugins.foregroundService.start('Camera', 'is running');
      }
    this.camera.getPicture(options).then((imageData) => {
      this.image = 'data:image/jpeg;base64,' + imageData;
      if(this.Device.platform=='Android'){
      cordova.plugins.foregroundService.stop();
      }

      if (this.image) {
        this.image_data.push(this.image);
      }
    }, (err) => {
      if(this.Device.platform=='Android'){
        cordova.plugins.foregroundService.stop();
      }
    });
  }).catch((error: any) => {
    if(this.Device.platform=='Android'){
      cordova.plugins.foregroundService.stop();
    }
   
  });
  }

  cameraModal(type) {
    let modal = this.modalCtrl.create(CameraModalPage,{'type':type});

    modal.onDidDismiss(data => {
    
      if (data != undefined && data != null) {  
        this.image = data
        this.image_data.push(this.image);
    }
    
    
      
    });

    modal.present();
  }
  takePhoto() {
    this.diagnostic.requestCameraAuthorization().then((isAvailable: any) => {
    this.image = [];

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 500,
      targetHeight: 400
    }
    if(this.Device.platform=='Android'){
        cordova.plugins.foregroundService.start('Camera', 'is running');
      }
    this.camera.getPicture(options).then((imageData) => {
      this.image = 'data:image/jpeg;base64,' + imageData;
      if(this.Device.platform=='Android'){
      cordova.plugins.foregroundService.stop();
      }
      this.image_data.push(this.image);


    });
  }).catch((error: any) => {
    if(this.Device.platform=='Android'){
      cordova.plugins.foregroundService.stop();
    }
   
  });
  }
  change_Event_status() {
    console.log("inside function")
    console.log(this.data.data.status)
    if (this.data.data.status == 'Completed'||this.data.data.status == 'CompletedEvent') {
      if (!this.data.actual_expense) {
        this.serve.errorToast("Enter actual expense !")
        return
      }
      if (this.image_data.length < 1) {
        this.serve.errorToast("Upload Minimum 1 Bill Images ")
        return
      }
      if (!this.data.remark) {
        this.serve.errorToast("Remark is mandatory ")
        return
      }
    }
    if(this.data.data.status == 'CompletedEvent'){
    let updateAlert = this.alertCtrl.create({
      title: 'Confirm',
      message: 'Are you sure ?',
      buttons: [
        { text: 'No', },
        {
          text: 'Yes',
          handler: () => {
            this.data.data.status='Completed'
            this.data.billImages = this.image_data
            this.data.data.actual_expense = this.data.actual_expense
            this.serve.addData(this.data, "AppEvent/eventExpenseupdate")
              .then((result: any) => {

                if (result['statusCode'] == 200) {
                  this.serve.successToast(result['statusMsg'])
                  this.viewCtrl.dismiss(true);

                } else {
                  this.serve.errorToast(result['statusMsg'])
                }
              })
          }
        }
      ]
    });
    updateAlert.present();
  }
  if(this.data.data.status == 'Completed'|| this.navParams.get("tabActiveType") == 'Pending'){
    console.log("inside if")
    let updateAlert = this.alertCtrl.create({
      title: 'Confirm',
      message: 'Are you sure ?',
      buttons: [
        { text: 'No', },
        {
          text: 'Yes',
          handler: () => {
            this.data.billImages = this.image_data
            this.data.data.actual_expense = this.data.actual_expense
            this.serve.addData(this.data, "AppEvent/eventStatusChange")
              .then((result: any) => {

                if (result['statusCode'] == 200) {
                  this.serve.successToast(result['statusMsg'])
                  this.viewCtrl.dismiss(true);

                } else {
                  this.serve.errorToast(result['statusMsg'])
                }
              })
          }
        }
      ]
    });
    updateAlert.present();
  }
  
   
  }
  filterExpense() {
    this.viewCtrl.dismiss(this.data);
  }
  UserData: any = {}
  assignUser() {

    this.data.user_name = this.UserData.name
    this.data.sales_user_id = this.UserData.id
    if (!this.data.user_name) {
      this.serve.errorToast("Select user first")
      return
    }
    this.savingFlag = true;
    let Url = ''
    if (this.from_page == 'Site_Listing') {
      Url = 'AppEnquiry/assignSite'
    } else if(this.from_page == 'customerDetail') {
      Url = 'AppCustomerNetwork/assignCustomer'
    }
    else{
 Url = 'AppEnquiry/assignEnquiry'
    }
    this.serve.addData(this.data, Url).then((result) => {
      if (result['statusCode'] == 200) {
        this.serve.successToast(result['statusMsg']);
        this.savingFlag = false;
        this.viewCtrl.dismiss();
      }
      else {
        this.serve.errorToast(result['statusMsg']);
        this.savingFlag = false;
      }
    }, err => {
    })
  }


  addNewContact() {
    this.savingFlag = true;
    this.serve.addData({ "data": { 'id': this.navParams.get("site_id"), 'contactDetails': [this.data] } }, 'AppEnquiry/addSiteContactPerson')
      .then(resp => {
        if (resp['statusCode'] == 200) {
          this.savingFlag = false;
          this.serve.successToast(resp['statusMsg']);
          this.viewCtrl.dismiss(true);
        } else {
          this.savingFlag = false;
          this.serve.errorToast(resp['statusMsg']);
        }
      }, error => {
        this.savingFlag = false;
        this.serve.Error_msg(error);
      })

  }
  


}