import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, AlertController, LoadingController } from 'ionic-angular';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { VideoPlayer } from '@ionic-native/video-player/ngx';
import { ModalController } from 'ionic-angular';
import { MyserviceProvider } from '../../../providers/myservice/myservice';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { ConstantProvider } from '../../../providers/constant/constant';
import { ContractorModalPage } from '../contractor-modal/contractor-modal';
import { ExpenseStatusModalPage } from '../../expense-status-modal/expense-status-modal';
import { ContractorMeetAddPage } from '../contractor-meet-add/contractor-meet-add';
import { ExpenseDetailPage } from '../../expense-detail/expense-detail';
import * as moment from 'moment/moment';
import { Device } from '@ionic-native/device';
import { CameraModalPage } from '../../camera-modal/camera-modal';
declare let cordova: any;
@IonicPage()
@Component({
  selector: 'page-contractor-meet-detail',
  templateUrl: 'contractor-meet-detail.html',
})
export class ContractorMeetDetailPage {

  data: any = {};
  prod_id: any = '';
  id: any = '';
  data1: any = {};
  today_date: any
  allcount: any = [];
  ParticipantData: any = []
  start: any = 0;
  details: any = {};
  formData = new FormData();
  rootUrl2 = this.constant.rootUrl2;
  
  img_url: any = '';
  TabType: any;
  prodstatus: any;
  data2: any = {};
  participentsLength: any = {};
  image: any = [];
  imageData: any = [];
  image_data: any = [];
  complete_C_M_participants = [];
  participatsArray = [];
  giftList = [];
  checkin_id: any
  checkin_data: any
  MeetType: any
  currentDate: any
  addToListDisable: boolean = false
  hideData: boolean = false
  distributor_list: any;
  filter: any = {};
  search: any;
  form1: any={};
  city_list1: any;
  district_list: any;
  state_list: any;



  constructor(public Device:Device,public alertCtrl: AlertController, public camera: Camera, public navCtrl: NavController, public actionSheetCtrl: ActionSheetController, public navParams: NavParams, public modalCtrl: ModalController, public service1: MyserviceProvider, public service: DbserviceProvider, public serve: DbserviceProvider, public constant: ConstantProvider, private videoPlayer: VideoPlayer, public loadingCtrl: LoadingController) {
    this.today_date = new Date().toISOString().slice(0, 10);
    this.checkin_data = this.navParams.get('data');
    this.img_url = constant.upload_url1 + 'event_file/'
    this.prod_id = this.navParams.get('meeting_id');
    this.TabType = 1
    this.prodstatus = this.navParams.get('status');
    this.MeetType = this.navParams.get('meet_Type')


    if (this.navParams.get('dr_type') && this.navParams.get('dr_name') && this.navParams.get('checkinUserID')) {
      this.checkin_id = this.navParams.get('checkin_id');
      this.id = this.navParams.get('checkinUserID');
    }
    this.getContractorMeetDetail();
    this.get_district();
    this.get_states()
  }
  ionViewWillEnter() {
    this.currentDate = moment().format("YYYY-MM-DD")
    this.getGiftData()
  }
  ionViewDidLoad() {
    this.prod_id = this.navParams.get('meeting_id');


  }

  isWithinRange(date: string): boolean {
    const plannedDate = moment(date);
    const beforeRange = moment(this.currentDate).subtract(7, 'days');
    const afterRange = moment(this.currentDate).add(7, 'days');
    // console.log(plannedDate.isBetween(beforeRange, afterRange, 'day', '[]'))
    return plannedDate.isBetween(beforeRange, afterRange, 'day', '[]'); // '[]' includes both start and end dates
   
}
  get_list(event) {
    this.service1.addData({ 'search': event, event_id: this.prod_id }, 'AppEvent/party_list').then((response) => {
      if (response['statusCode'] == 200) {
        this.service1.dismissLoading();
        this.distributor_list = response['result'];
        this.service1.dismissLoading()
      } else {
        this.service1.dismissLoading()

        this.service1.errorToast(response['statusMsg'])
      }

    }, error => {
      this.service1.Error_msg(error);
      this.service1.dismiss();
    });

  }


  searchData(event) {
    this.search = event.text;
    let wordSearch = this.search;
    setTimeout(() => {
      if (wordSearch == this.search) {
        if (this.search) {
          this.get_list(this.search);
        }
      }
    }, 100);
  }




  Add_list() {
    let Index = this.distributor_list.findIndex(row => row.id == this.data1.participant_id.id);
    if (Index !== -1) {
      this.data1.participent_mobile = this.distributor_list[Index].mobile;
      this.data1.participent_name = this.distributor_list[Index].name;
      this.addParticipants();
    }
  }


  getContractorMeetDetail() {
    this.service1.presentLoading()
    this.service1.addData({ event_id: this.prod_id }, 'AppEvent/eventDetail').then((response) => {
      if (response['statusCode'] == 200) {
        this.service1.dismissLoading();
        this.details = response['result'];
        this.participatsArray = this.details.participents
        this.participentsLength = this.details.participents.length;
        if (this.details.event_type == 'Architects Meet') {
          this.data2.send_gift = 'No'
        }
        this.details.expense_sharing_amount_percentage = (parseInt(this.details.total_budget) * parseInt(this.details.expense_sharing_amount)) / 100

        this.service1.dismissLoading()
      } else {
        this.service1.dismissLoading()

        this.service1.errorToast(response['statusMsg'])
      }

    }, error => {
      this.service1.Error_msg(error);
      this.service1.dismiss();
    });
  }
  getGiftData() {
    this.service1.addData({}, 'AppEvent/btlGift').then((response) => {
      if (response['statusCode'] == 200) {
        this.giftList = response['result'];
      } else {
        this.service1.errorToast(response['statusMsg'])
      }

    }, error => {
      this.service1.Error_msg(error);
      this.service1.dismiss();
    });
  }

  EventPostponed(type) {
    console.log(type)
    if (type) {
      let modal = this.modalCtrl.create(ExpenseStatusModalPage, { 'from': type, 'event_id': this.prod_id });
      modal.onDidDismiss(data => {
        this.getContractorMeetDetail();
      });
      modal.present();

    }

  }

  openDocument(imageSource) {
    this.modalCtrl.create(ContractorModalPage, { "img": imageSource }).present();
  }

  editEventPlan() {
    this.navCtrl.push(ContractorMeetAddPage, { event_id: this.prod_id, 'pageType': 'edit', 'eventData': this.details });
  }
  statusModal(from) {
    console.log(from, "this is from")
    let modal = this.modalCtrl.create(ExpenseStatusModalPage, { 'from': from, 'id': this.prod_id, 'tabActiveType': this.prodstatus, 'total_budget': this.details.total_budget });

    modal.onDidDismiss(data => {
      this.navCtrl.pop()
    });

    modal.present();
  }

  deletePerson(id, index) {
    let updateAlert = this.alertCtrl.create({
      title: 'Delete',
      message: 'Are you sure ?',
      buttons: [
        { text: 'No', },
        {
          text: 'Yes',
          handler: () => {
            this.service1.addData({ 'id': id }, 'AppEvent/deleteEventParticipent').then((response) => {
              if (response['statusCode'] == 200) {
                this.participatsArray.splice(index, 1)

                this.service1.successToast(response['statusMsg'])
                this.getContractorMeetDetail()
              } else {

                this.service1.errorToast(response['statusMsg'])
                this.getContractorMeetDetail()
              }

            }, er => {

              this.service1.errorToast('Something went wrong')
            });
          }
        }
      ]
    });
    updateAlert.present();
  }


  addParticipants() {
    let arr = []

    this.addToListDisable = true
    if (this.ParticipantData.length == 0) {
      arr.push(this.data1)
      this.ParticipantData = arr
      this.service1.addData({ 'event_id': this.prod_id, 'contact_list': [this.data1] }, 'AppEvent/addContactToEvent').then((response) => {
        this.data1.participent_mobile = '';
        this.data1.participent_name = '';
        if (response['statusCode'] == 200) {
          this.service1.successToast(response['statusMsg'])
          this.addToListDisable = false
          this.getContractorMeetDetail();

        } else {
          this.addToListDisable = false
          this.service1.errorToast(response['statusMsg'])
          this.getContractorMeetDetail();
        }
      }, err => {
        this.service1.dismissLoading();
        this.service1.errorToast('Something went wrong')
      })
    } else {
      let mobileIndex = this.participatsArray.findIndex(row => row.participent_mobile == this.data1.participent_mobile);
      if (mobileIndex === -1) {
        this.service1.addData({ 'event_id': this.prod_id, 'contact_list': [this.data1] }, 'AppEvent/addContactToEvent').then((response) => {
          this.data1.participent_mobile = '';
          this.data1.participent_name = '';
          this.getContractorMeetDetail();

          if (response['statusCode'] == 200) {
            this.service1.successToast(response['statusMsg'])
            this.addToListDisable = false

          } else {
            this.service1.errorToast(response['statusMsg'])
            this.addToListDisable = false
          }
        })
      } else {

        this.service1.errorToast('"Mobile Number Already Exist!"')
        this.data1.participent_mobile = '';
        this.data1.participent_name = '';
        this.addToListDisable = false
      }
    }

  }

  name(event: any) {
    const pattern = /[A-Z\+\-\a-z ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }
  }

    cameraModal(type) {
      let modal = this.modalCtrl.create(CameraModalPage,{'type':'camera'});
  
      modal.onDidDismiss(data => {
     
        if (data != undefined && data != null) {
          this.image=data;

          this.service1.addData({ 'image': this.image, 'event_id': this.prod_id, 'type': type }, 'AppEvent/uploadEventFile')
          .then((result: any) => {
            if (result['statusCode'] == 200) {
              this.getContractorMeetDetail();
              if (type == 'event') {
                this.TabType = 2
              } else if (type == 'bill') {
                this.TabType = 3
              }
            } else {
              this.service1.errorToast(result['statusMsg'])
            }
          }, err => {
            this.service1.errorToast('Something went wrong')
           
          })
  
  
      }
      
      
        
      });
  
      modal.present();
    }

  takePhoto(type) {
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
      this.service1.addData({ 'image': this.image, 'event_id': this.prod_id, 'type': type }, 'AppEvent/uploadEventFile')
        .then((result: any) => {
          if (result['statusCode'] == 200) {
            this.getContractorMeetDetail();
            if (type == 'event') {
              this.TabType = 2
            } else if (type == 'bill') {
              this.TabType = 3
            }
          } else {
            this.service1.errorToast(result['statusMsg'])
          }
        }, err => {
          this.service1.errorToast('Something went wrong')
          if(this.Device.platform=='Android'){
            cordova.plugins.foregroundService.stop();
          }
        })

    }, (err) => {
      this.service1.presentToast('Image Failed to upload');
      if(this.Device.platform=='Android'){
        cordova.plugins.foregroundService.stop();
      }

    });
  }

  getImage(type) {
    this.image = [];

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
        this.image_data.push(this.image)
      }
      this.service1.addData({ 'image': this.image, 'event_id': this.prod_id, 'type': type }, 'AppEvent/uploadEventFile')
        .then((result: any) => {
          if (result['statusCode'] == 200) {
            this.getContractorMeetDetail();
          } else {
            this.service1.errorToast(result['statusMsg'])
          }
        }, err => {
          this.service1.errorToast('Something went wrong')
          if(this.Device.platform=='Android'){
            cordova.plugins.foregroundService.stop();
          }
        })


    });
  }

  // presentActionSheet(type) {
  //   const actionSheet = this.actionSheetCtrl.create({
  //     title: 'Upload images from here',
  //     buttons: [
  //       {
  //         text: 'Camera',
  //         icon: 'camera',
  //         handler: () => {

  //           this.takePhoto(type);

  //         }
  //       }, {
  //         text: 'Cancel',
  //         role: 'cancel',
  //         handler: () => {

  //         }
  //       }
  //     ]
  //   });
  //   actionSheet.present();

  // }

  goToExpenseDetail() {
    this.navCtrl.push(ExpenseDetailPage, { 'id': this.details.expense_id });
  }
  EventData: any = {}
  submitbutton(status) {
    if(status == 'Completed' ||status == 'CompletedEvent'){
    if (status == 'Completed' || status == 'CompletedEvent') {

      // if (!this.isWithinRange(this.details.date_of_meeting)) {
      //   this.service1.errorToast(" meetings Expired")
      //   return
      // }
      if (!this.isWithinRange(this.details.date_of_meeting)) {
        this.service1.errorToast("This BTL Activity is expired ")
        return
      }
      if (this.participentsLength <= 0) {
        this.service1.errorToast("Add Participants First ")
        return
      }
      if (this.details.uploads.length < 5) {
        this.service1.errorToast("Upload Minimum 5 BTL Activity Images ")
        return
      }
      let Index = this.giftList.findIndex(row => row.pop_id == this.data2.pop_id)
      if (Index != -1) {
        this.data2.pop_name = this.giftList[Index]['item_name']
      }
    }

    this.data2.id = this.prod_id;
    this.data2.status = status;
    this.data2.btl = this.participatsArray
    this.data2.btl_type = this.details.event_type
    this.EventData.data = this.data2
    const modal = this.modalCtrl.create(ExpenseStatusModalPage, { 'from': 'event', 'eventData': this.EventData });

    modal.onDidDismiss(data => {
      if (data == true) {
        this.navCtrl.pop();
      }
    });

    modal.present();
  }
  if(status == 'status'){

    let updateAlert = this.alertCtrl.create({
      title: 'Confirm',
      message: 'Are you sure ?',
      buttons: [
        { text: 'No', },
        {
          text: 'Yes',
          handler: () => {
            // if (this.isWithinRange(this.details.date_of_meeting)) {
            //   this.service1.errorToast("Can only create meetings for today")
            //   return
            // }
            if (!this.isWithinRange(this.details.date_of_meeting)) {
              this.service1.errorToast("This BTL Activity is expired ")
              return
            }
            if (this.participentsLength <= 0) {
              this.service1.errorToast("Add Participants First ")
              return
            }
            if (this.details.uploads.length < 5) {
              this.service1.errorToast("Upload Minimum 5 BTL Activity Images ")
              return
            }
            let Index = this.giftList.findIndex(row => row.pop_id == this.data2.pop_id)
            if (Index != -1) {
              this.data2.pop_name = this.giftList[Index]['item_name']
            }
            this.data2.id = this.prod_id;
            this.data2.status = 'Completed';
            this.data2.btl = this.participatsArray
            this.data2.btl_type = this.details.event_type
            this.EventData.data = this.data2

            this.service1.addData({ 'id': this.details.created_by, 'name': this.details.created_by_name, 'data': this.data2 },"AppEvent/statusWithoutExpense")
              .then((result: any) => {

                if (result['statusCode']==200) {
                  this.navCtrl.pop();

                }else{
                      this.service1.errorToast(result['statusMsg'])
                      this.getContractorMeetDetail()
                }
              })
          }
        }
      ]
    });
    updateAlert.present();
  }
  }

  delete_image(id, index) {
    let updateAlert = this.alertCtrl.create({
      title: 'Delete',
      message: 'Are you sure ?',
      buttons: [
        { text: 'No', },
        {
          text: 'Yes',
          handler: () => {

            this.service1.addData({ "id": id }, "AppEvent/deleteEventImage")
              .then(resp => {
                if (resp['statusCode'] == 200) {
                  this.service1.successToast(resp['statusMsg'])
                  this.details.uploads.splice(index, 1);
                  this.getContractorMeetDetail();
                } else {
                  this.service1.errorToast(resp['statusMsg'])
                }
              }, err => {
                this.service1.errorToast('Something went wrong')
              })
          }
        }
      ]
    });
    updateAlert.present();
  }


  getSateteDistrcit() {
    this.form1.pincode = this.data1.pincode;

    this.service1.addData(this.form1, "AppCustomerNetwork/getStateDistict")
      .then(resp => {
        if (resp['statusCode'] == 200) {

          this.data1.state = resp['result'].state_name;
          this.data1.district = resp['result'].district_name;
          this.getCityList1()
          this.data1.city = resp['result'].city;
       
          
        } else {
          this.service1.errorToast(resp['statusMsg']);

        }
      },
        err => {
          this.service1.errorToast('Something Went Wrong!')
        });

  }

  getCityList1() {
    this.data1.city1 = [];
    this.service1.addData({ 'district_name': this.data1.district, 'state_name': this.data1.state,'pincode':this.data1.pincode }, 'AppCustomerNetwork/get_city_list').then((result) => {
      if (result['statusCode'] == 200) {
        this.city_list1 = result['city'];
      } else {
        this.service1.errorToast(result['statusMsg']);

      }


    }, err => {
      this.service1.errorToast('Something Went Wrong!')
    });

  }

  get_district() {
    this.service1.addData({ "state_name": this.data1.state }, "AppCustomerNetwork/getDistrict")
      .then(resp => {
        if (resp['statusCode'] == 200) {
          this.district_list = resp['district_list'];
        } else {
          this.service1.errorToast(resp['statusMsg']);
        }
      },
        err => {
          this.service1.errorToast('Something Went Wrong!')
        })
  }
  get_states() {
 
    this.service1.addData({}, "AppCustomerNetwork/getWorkingStates")
      .then(resp => {
        if (resp['statusCode'] == 200) {
        
          this.state_list = resp['state_list'];
        } else {
        
          this.service1.errorToast(resp['statusMsg']);
        }
      }, error => {
        this.service1.Error_msg(error);
        this.service1.dismiss();
      })
  }
}