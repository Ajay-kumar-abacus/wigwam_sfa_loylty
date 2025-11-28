import { Component } from '@angular/core';
import { AlertController, Events, IonicPage, LoadingController, ModalController, Navbar, NavController, NavParams, Platform, PopoverController, ToastController } from 'ionic-angular';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { ViewProfilePage } from '../../view-profile/view-profile';
import { DomSanitizer } from '@angular/platform-browser';
import { MyserviceProvider } from '../../../providers/myservice/myservice';
import { InspectionPage } from '../../inspection/inspection';
import { ConstantProvider } from '../../../providers/constant/constant';
import { CloseComplaintPage } from '../../close-complaint/close-complaint';
import { EditInspectionPage } from '../../edit-inspection/edit-inspection';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Geolocation } from '@ionic-native/geolocation';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { SelectRegistrationTypePage } from '../../select-registration-type/select-registration-type';
import { Storage } from '@ionic/storage';
import { SpareAddPage } from '../spare-add/spare-add';
import { AddinvoicePage } from '../../addinvoice/addinvoice';
import { Device } from '@ionic-native/device';

/**
* Generated class for the ComplaintDetailPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-complaint-detail',
  templateUrl: 'complaint-detail.html',
})
export class ComplaintDetailPage {
  complaint_id: any = '';
  complaint_detail: any = {};
  complaint_remark: any = [];
  complaint_images: any = [];
  inspection_images: any = [];
  closing_image: any = [];
  cancel_image: any = [];
  complaint_media: any = [];
  loading: any;
  

  rating_star: any = '';
  star: any = '';
  amount: any = {};
  bannerURL: any;
  complaint_type: any = 'Details'
  id: any;
  showInsepction: any = false
  showClose: any = false
  data: any = {}
  cmp_no: any = {}
  cmp_id: any = {}
  spinnerLoader: boolean = false;
  visit_status: any = {};
  spare_details: any = [];





  constructor(public Device: Device,public sanitizer: DomSanitizer, public navCtrl: NavController, public navParams: NavParams, public serve: DbserviceProvider, public loadingCtrl: LoadingController, public modalCtrl: ModalController, public alertCtrl: AlertController, public db: MyserviceProvider, public constant: ConstantProvider, public locationAccuracy: LocationAccuracy, public events: Events, public storage: Storage, public geolocation: Geolocation, public platform: Platform, public alertrCtl: AlertController, public openNativeSettings: OpenNativeSettings, public popoverCtrl: PopoverController) {

    // console.log(this.navParams);
    this.id = this.navParams.data.id;
    // console.log(this.id);
    this.bannerURL = constant.upload_url1 + 'service_task/';
    this.complaint_id = this.navParams.get('id');

    // this.getVisitStatus();
  }
  ionViewWillEnter() {
    this.getComplaintDetail(this.complaint_id);

  }

  photoURL(url) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  ionViewDidLoad() {

  }

  // presentLoading() {
  //   this.loading = this.loadingCtrl.create({
  //     content: "Please wait...",
  //     dismissOnPageChange: true
  //   });
  //   this.loading.present();
  // }

  doRefresh(refresher)
  {
    console.log('Begin async operation', refresher);
    this.getComplaintDetail(this.id);
    refresher.complete();
  }

  getComplaintDetail(id) {
    this.db.presentLoading();
    this.db.addData({ 'complaint_id': id }, 'AppServiceTask/serviceComplaintDetail').then(response => {

      if (response['statusCode'] == 200) {
        this.db.dismissLoading();
        this.complaint_detail = response['result'];
        this.complaint_remark = response['result']['log'];
        this.complaint_images = response['result']['image'];
        this.inspection_images = response['result']['inspection_image'];
        this.closing_image = response['result']['closing_image'];
        this.spare_details = response['result']['spare_list'];
      } else {
        this.db.errorToast(response['statusMsg'])
        this.db.dismissLoading();
      }
    });

  }
  showSuccess(text) {
    let alert = this.alertCtrl.create({
      title: 'Success!',
      cssClass: 'action-close',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }

  cancelComplaint(test) {

  }
  goToSpareAdd(id, complain_no) {
    this.navCtrl.push(SpareAddPage, { "id": id, "complain_no": complain_no });
  }


  imageModal(src) {
    // console.log(src);

    this.modalCtrl.create(ViewProfilePage, { "Image": src }).present();
  }

  addRemark() {
    this.db.presentLoading();
    this.db.addData({ "complaint_id": this.id, "msg": this.data.msg }, 'AppServiceTask/addComplaintRemark').then(result => {
      if (result['statusCode'] == 200) {
        this.db.dismissLoading();
        this.showSuccess("Remark Added Successfully!");
        this.navCtrl.popTo(ComplaintDetailPage, { id: this.id });
      }
      else {
        this.db.errorToast(result['statusMsg'])
      }
      // console.log(result);

    });
  }

  goToeditInspection(detail) {

    this.navCtrl.push(EditInspectionPage, { "detail": detail });
  }




  GotoInspectionPage(id) {
    if (this.complaint_detail.inspection_status == 'Pending') {

      this.navCtrl.push(InspectionPage, { "id": id });
      this.showInsepction = false
      this.complaint_type = 'Details'

    } else {
      this.showInsepction = true
    }
  }

  goToClosePage(id, customer_mobile, closing_type) {
    if (this.complaint_detail.complaint_status == 'Closed') {
    } else {
      this.navCtrl.push(CloseComplaintPage, { "id": id, "customer_mobile": customer_mobile, "closing_type": closing_type });
      this.complaint_type = 'Details'
    }

  }

   goToInvoicePage(id, customer_mobile, closing_type) {
    if (this.complaint_detail.complaint_status == 'Closed') {
    } else {
      this.navCtrl.push(AddinvoicePage, { "id": id, "customer_mobile": customer_mobile, "closing_type": closing_type });
      this.complaint_type = 'Details'
    }

  }


  // getVisitStatus() {

  //   this.db.addData({}, 'AppServiceTask/getVisitStatus').then(response => {
  //     console.log(response);
  //     this.visit_status = response['result'];

  //   });

  // }

  startVisit(complaint_id, complaint_no) {
    this.cmp_id = complaint_id
    this.cmp_no = complaint_no
    this.platform.ready().then(() => {
      if (this.Device.platform == 'Android') {

        var whiteList = ['com.package.example', 'com.package.example2'];
  
        (<any>window).gpsmockchecker.check(whiteList, (result) => {
          if (result.isMock) {
            let alert = this.alertCtrl.create({
              title: 'Alert!',
              subTitle: 'Please Remove Third Party Location Apps',
              buttons: [
                {
                  text: 'Ok',
                  handler: () => {
                    this.db.addData({ 'app_name': result.mocks[0]['name'], 'package_name': result.mocks[0]['package'] }, 'Login/thirdPartyDisabled').then((result) => {
                      if (result['statusCode'] == 200) {
                        this.storage.set('token', '');
                        this.storage.set('role', '');
                        this.storage.set('displayName', '');
                        this.storage.set('role_id', '');
                        this.storage.set('name', '');
                        this.storage.set('type', '');
                        this.storage.set('token_value', '');
                        this.storage.set('userId', '');
                        this.storage.set('token_info', '');
                        this.constant.UserLoggedInData = {};
                        this.constant.UserLoggedInData.userLoggedInChk = false;
                        this.events.publish('data', '1', Date.now());
                        this.db.errorToast("Your account is blocked");
                        this.navCtrl.setRoot(SelectRegistrationTypePage);
                      } else {
                        this.db.errorToast(result['statusMsg'])
                      }
                    },
                      error => {
                        this.db.Error_msg(error);
                      })
                  }
                }
              ]
            });
            alert.present();
          }
          else {
            let alert = this.alertCtrl.create({
              title: 'Complaint Visit',
              message: 'Do you want to start Visit?',
              cssClass: 'alert-modal',
              buttons: [
                {
                  text: 'No',
                  role: 'cancel',
                  handler: () => {
                  }
                },
                {
                  text: 'Yes',
                  handler: () => {
                    this.startvisit1(this.cmp_id, this.cmp_no)
  
                  }
                }
  
  
              ]
            });
            alert.present();
          }
  
  
        }, error => console.log(error));
      }else {
        let alert = this.alertCtrl.create({
          title: 'Complaint Visit',
          message: 'Do you want to start Visit?',
          cssClass: 'alert-modal',
          buttons: [
            {
              text: 'No',
              role: 'cancel',
              handler: () => {
              }
            },
            {
              text: 'Yes',
              handler: () => {
                this.startvisit1(this.cmp_id, this.cmp_no)

              }
            }


          ]
        });
        alert.present();
      }

    });


  }


  checkin_data: any = []
  startvisit1(cmp_id, cmp_no) {
    this.db.presentLoading()

    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {

        let options = { maximumAge: 10000, timeout: 15000, enableHighAccuracy: true };
        this.geolocation.getCurrentPosition(options).then((resp) => {
          var lat = resp.coords.latitude
          var lng = resp.coords.longitude
          var complaint_no = cmp_no
          var complaint_id = cmp_id
          //  let startTime = 15000
          this.db.addData({ 'latitude': lat, 'longitude': lng, 'complaint_no': complaint_no, 'complaint_id': complaint_id }, 'AppServiceTask/startComplaintVisit').then((result) => {
            if (result['statusCode'] == 200) {
              this.spinnerLoader = false;
              this.db.dismissLoading();
              this.db.successToast(result['statusMsg']);
              this.getComplaintDetail(complaint_id);
            } else {
              this.spinnerLoader = false;
              this.db.errorToast(result['statusMsg'])
              this.db.dismissLoading();
            }
          });
        }).catch((error) => {
          this.db.dismissLoading();
          this.presentConfirm('Turn On Location permisssion !', 'please go to <strong>Settings</strong> -> Location to turn on <strong>Location permission</strong>')
        });
      },
      error => {
        this.db.dismissLoading();
        this.db.errorToast('Allow Location!')
      });
  }
  presentConfirm(title, msg) {
    let alert = this.alertrCtl.create({
      enableBackdropDismiss: false,
      title: title,
      message: msg,
      cssClass: 'alert-modal',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
          }
        },
        {
          text: 'Settings',
          handler: () => {
            this.openSettings()
          }
        }

      ]
    });
    alert.present();
  }
  openSettings() {
    this.openNativeSettings.open("application_details")
  }

  end_visit(visit_id) {
    this.db.presentLoading()
    var visit_id = visit_id
    this.platform.ready().then(() => {

      if (this.Device.platform == 'Android') {
        var whiteList = [];
        (<any>window).gpsmockchecker.check(whiteList, (result) => {
  
          if (result.isMock) {
            let alert = this.alertCtrl.create({
              title: 'Alert!',
              subTitle: 'Please Remove Thirt Party Location Apps',
              buttons: [
                {
                  text: 'Ok',
                  handler: () => {
  
                    this.db.addData({ 'app_name': result.mocks[0]['name'], 'package_name': result.mocks[0]['package'] }, 'Login/thirdPartyDisabled').then((result) => {
                      if (result['statusCode'] == 200) {
                        this.storage.set('token', '');
                        this.storage.set('role', '');
                        this.storage.set('displayName', '');
                        this.storage.set('role_id', '');
                        this.storage.set('name', '');
                        this.storage.set('type', '');
                        this.storage.set('token_value', '');
                        this.storage.set('userId', '');
                        this.storage.set('token_info', '');
                        this.constant.UserLoggedInData = {};
                        this.constant.UserLoggedInData.userLoggedInChk = false;
                        this.events.publish('data', '1', Date.now());
                        this.db.errorToast("Your account is blocked");
                        this.navCtrl.setRoot(SelectRegistrationTypePage);
                      } else {
                        this.db.errorToast(result['statusMsg'])
                      }
                    },
                      error => {
                        this.db.Error_msg(error);
                      })
  
                  }
                }
              ]
            });
            alert.present();
  
          }
          else {
            this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
              () => {
                let options = { maximumAge: 10000, timeout: 15000, enableHighAccuracy: true };
                this.geolocation.getCurrentPosition(options).then((resp) => {
  
                  var lat = resp.coords.latitude
                  var lng = resp.coords.longitude
  
                  this.db.addData({ 'latitude': lat, 'longitude': lng, 'visit_id': visit_id }, 'AppServiceTask/stopComplaintVisit').then((result) => {
                    if (result['statusCode'] == 200) {
                      this.spinnerLoader = false;
                      this.db.dismissLoading();
                      this.db.successToast(result['statusMsg']);
                      this.getComplaintDetail(this.complaint_id);
                    } else {
                      this.spinnerLoader = false;
                      this.db.errorToast(result['statusMsg'])
                      this.db.dismissLoading();
                    }
                  },
                    error => {
                      this.spinnerLoader = false;
                      this.db.Error_msg(error);
                      this.db.dismissLoading();
                    })
  
                }).catch((error) => {
                  this.spinnerLoader = false;
                  this.db.dismissLoading();
                  this.presentConfirm('Turn On Location permisssion !', 'please go to <strong>Settings</strong> -> Location to turn on <strong>Location permission</strong>')
                });
              },
              error => {
                this.spinnerLoader = false;
                this.db.Error_msg(error);
                this.db.dismissLoading();
              });
          }
        }, (error) => this.db.errorToast(error));

      }else {
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
          () => {
            let options = { maximumAge: 10000, timeout: 15000, enableHighAccuracy: true };
            this.geolocation.getCurrentPosition(options).then((resp) => {

              var lat = resp.coords.latitude
              var lng = resp.coords.longitude

              this.db.addData({ 'latitude': lat, 'longitude': lng, 'visit_id': visit_id }, 'AppServiceTask/stopComplaintVisit').then((result) => {
                if (result['statusCode'] == 200) {
                  this.spinnerLoader = false;
                  this.db.dismissLoading();
                  this.db.successToast(result['statusMsg']);
                  this.getComplaintDetail(this.complaint_id);
                } else {
                  this.spinnerLoader = false;
                  this.db.errorToast(result['statusMsg'])
                  this.db.dismissLoading();
                }
              },
                error => {
                  this.spinnerLoader = false;
                  this.db.Error_msg(error);
                  this.db.dismissLoading();
                })

            }).catch((error) => {
              this.spinnerLoader = false;
              this.db.dismissLoading();
              this.presentConfirm('Turn On Location permisssion !', 'please go to <strong>Settings</strong> -> Location to turn on <strong>Location permission</strong>')
            });
          },
          error => {
            this.spinnerLoader = false;
            this.db.Error_msg(error);
            this.db.dismissLoading();
          });
      }

    });
  }
}
