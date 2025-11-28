import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertController, IonicPage, LoadingController, ModalController, NavController, NavParams } from 'ionic-angular';
import { MyserviceProvider } from '../../../providers/myservice/myservice';
import { ConstantProvider } from '../../../providers/constant/constant';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { CloseInstalltionPage } from '../close-installtion/close-installtion';
import { ViewProfilePage } from '../../view-profile/view-profile';

/**
* Generated class for the InstallationDetailPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-installation-detail',
  templateUrl: 'installation-detail.html',
})
export class InstallationDetailPage {

  complaint_id: any = '';
  installtion_detail: any = {};
  installation_remark: any = [];
  complaint_images: any = [];
  closing_image: any = [];
  complaint_media: any = [];
  item_details: any = [];
  loading: any;
  rating_star: any = '';
  star: any = '';
  amount: any = {};
  bannerURL: any;
  installation_type: any = 'Details'
  id: any;
  data: any = {}

  constructor(public sanitizer: DomSanitizer, public navCtrl: NavController, public navParams: NavParams, public serve: DbserviceProvider, public loadingCtrl: LoadingController, public modalCtrl: ModalController, public alertCtrl: AlertController, public db: MyserviceProvider, public constant: ConstantProvider) {

    // console.log(this.navParams);
    this.id = this.navParams.data.id;
    // console.log(this.id);
    this.bannerURL = constant.upload_url1 + 'service_task/';
    this.complaint_id = this.navParams.get('id');
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad InstallationDetailPage');
  }
  ionViewWillEnter() {
    this.getInstallationDetail(this.complaint_id);
  }
  imageModal(src)
    {
      // console.log(src);

      this.modalCtrl.create(ViewProfilePage, {"Image": src}).present();
    }

  // getInstallationDetail(id) {
  //   this.db.presentLoading();
  //   this.db.addData({ 'complaint_id': id }, 'AppServiceTask/serviceInstallationDetail').then(response => {
  //     console.log(response);
  //     this.loading.dismiss();
  //     this.installtion_detail = response['result'];
  //     console.log(this.installtion_detail);
  //     this.item_details = response['result']['add_list'];
  //     console.log(this.item_details);
  //     this.installation_remark = response['result']['log'];

  //     this.complaint_images = response['result']['image'];

  //     this.closing_image = response['result']['closing_image'];
  //     console.log(this.installation_remark);
  //   });

  // }


  getInstallationDetail(id)
  {
    this.db.presentLoading();
    this.db.addData({'complaint_id': id},'AppServiceTask/serviceInstallationDetail').then((response) =>
    {
      if(response['statusCode'] == 200){
      // console.log(response);
      this.installtion_detail = response['result'];
      // console.log(this.installtion_detail);
      this.item_details = response['result']['add_list'];
      // console.log(this.item_details);
      this.installation_remark = response['result']['log'];
      // this.complaint_images = response['result']['image'];
      this.closing_image = response['result']['closing_image'];
      console.log(this.installation_remark);
        this.db.dismissLoading();
      }
      else{
        this.db.errorToast(response['statusMsg']);
        this.db.dismissLoading();
      }
    }, error => {
      this.db.Error_msg(error);
      this.db.dismiss();
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
  goToClose(id, customer_mobile) {
    this.navCtrl.push(this.installtion_detail, { "id": id, "customer_mobile": customer_mobile });
  }

  addRemark() {
    this.db.addData({ "complaint_id": this.id, "msg": this.data.msg }, 'AppServiceTask/addComplaintRemark').then(result => {
      if (result['statusCode'] == 200) {
        this.db.dismissLoading();
        this.showSuccess("Remark Added Successfully!");
        this.navCtrl.popTo(InstallationDetailPage, { id: this.id });
      }
      else {
        this.db.errorToast(result['statusMsg'])
      }
      // console.log(result);

    });
  }
  goToClosePage(id,customer_mobile,closing_type) {
    if (this.installtion_detail.complaint_status == 'Reject' || this.installtion_detail.complaint_status == 'Done') {
    }else{
      this.navCtrl.push(CloseInstalltionPage,{ "id": id ,"customer_mobile":customer_mobile,"closing_type":closing_type});
      this.installation_type = 'Details'
    }

  }
}
