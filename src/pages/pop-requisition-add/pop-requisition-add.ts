import { Component, ViewChild } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, NavParams, ToastController } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { Storage } from '@ionic/storage';
import { SupportListPage } from '../support-list/support-list';
import { IonicSelectableComponent } from 'ionic-selectable';

@IonicPage()
@Component({
  selector: 'page-pop-requisition-add',
  templateUrl: 'pop-requisition-add.html',
})
export class PopRequisitionAddPage {

  @ViewChild('selectComponent') selectComponent: IonicSelectableComponent;
  data: any = {};
  selectImage: any = [];
  brandList: any = [];
  savingFlag: boolean = false;
  spinnerLoader: boolean = false;
  networkType: any = [];
  drList: any = [];

  checkin_id: any;
  item_list: any;

  constructor(public storage: Storage, public navCtrl: NavController, public navParams: NavParams, public service: MyserviceProvider, public alertCtrl: AlertController, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {


  }



  confirmAlert() {
    let alert = this.alertCtrl.create({
      enableBackdropDismiss: false,
      title: "Are you sure !",
      message: "Do you want to save ?",
      cssClass: 'alert-modal',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.submit()
          }
        }

      ]
    });
    alert.present();
  }
  get_item_list()
  {
      this.service.addData({'type':this.data.gift_type},"AppPopGift/pop_Gift_List")
      .then(resp=>{
          console.log(resp);
          this.item_list = resp['result'];
      },
      err=>
      {
      })
  }
  submit() {
    this.savingFlag = true;
    this.service.addData({ 'data': this.data }, 'AppPopGift/popApprovalRequest')
      .then((result) => {

        if (result['statusCode'] == 200) {
          this.navCtrl.popTo(SupportListPage);
          this.service.successToast(result['statusMsg']);
          this.savingFlag = false;
        }
        else {
          this.service.errorToast(result['statusMsg']);
          this.savingFlag = false;
        }

      }, error => {
        this.savingFlag == false;

        this.service.Error_msg(error);
        this.service.dismiss();
      });
  }
}
