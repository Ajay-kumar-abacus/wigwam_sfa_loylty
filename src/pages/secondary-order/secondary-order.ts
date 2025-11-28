import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController, ModalController, LoadingController, PopoverController, ToastController } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import moment from 'moment';
import { File } from '@ionic-native/file';
import { ConstantProvider } from '../../providers/constant/constant';
import { TravelPopOverPage } from '../travel-pop-over/travel-pop-over';
import { SecondaryOrderDetailPage } from '../secondary-order-detail/secondary-order-detail';
import { SecondaryOrderAddPage } from '../secondary-order-add/secondary-order-add';

@IonicPage()
@Component({
  selector: 'page-secondary-order',
  templateUrl: 'secondary-order.html',
})
export class SecondaryOrderPage {
  dr_id: any;
  Order_detail: any = [];
  total_checkin: any = [];
  total_order: any = [];
  type: any;
  flag: any;
  search: any = {};
  date: any;
  showRelatedTab: any;
  target: any;
  achievement: any;
  filter: any;
  start: any;
  image_url: any = ''
  OrderType: any
  Order_status_type: any = 'Approved' 
  count: any = {}
  DrType: any;
  drCode: any;
  NavType: any;
  LoginType: any = '';
  header: any = '';
  delivery_from: any = '';
  Mode: any;
  constructor(public file: File,
    public constant: ConstantProvider,
    public navCtrl: NavController, private alertCtrl: AlertController, public db: MyserviceProvider, public modalCtrl: ModalController, public navParams: NavParams, public service: MyserviceProvider, public loadingCtrl: LoadingController, public popoverCtrl: PopoverController, public toastCtrl: ToastController) {
    this.date = moment(this.date).format('YYYY-MM-DD');
    this.LoginType = this.constant.UserLoggedInData.loggedInUserType
    this.image_url = this.constant.upload_url1
    this.DrType = this.navParams.get('dr_type')

    this.delivery_from = this.navParams.get('delivery_from')
    console.log(this.navParams, 'navParams');

    this.NavType = this.navParams.get('from')
    this.Mode = this.navParams.get('Mode')
    this.drCode = this.navParams.get('dr_code');
    if (this.navParams.get('dr_id')) {
      this.dr_id = this.navParams.get('dr_id');
    }
    console.log(this.dr_id, "this is dr id")
    if (this.navParams.get('showRelatedTab') == 'false') {
      this.showRelatedTab = false
    }
    else {
      this.showRelatedTab = true
    }
    this.type = this.navParams.get('type');
    this.Order_detail.orderType = this.type

    if (this.type == 'stock') {
      this.header = 'Stock Transfer'
    } else {
      this.header = "Seconday Order"
    }
    // }

  }

  ionViewWillEnter() {
    this.Secondary_order(this.type);
  }
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(TravelPopOverPage, { 'dr_id': this.dr_id, 'from': 'leads-details', 'dr_code': this.drCode, 'dr_type': this.DrType });

    popover.present({
      ev: myEvent
    });

    popover.onDidDismiss(resultData => {
    })

  }
  loading: any;
  lodingPersent() {
    this.loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img src="./assets/imgs/gif.svg" class="h55" />`,
    });
    this.loading.present();
  }


  Secondary_order(type) {
    this.filter = 20
    this.start = 0
    this.Order_detail.orderType = type
    this.service.presentLoading()
    if (this.constant.UserLoggedInData.id) {
      this.dr_id = this.constant.UserLoggedInData.id
    }
    this.service.addData({ 'dr_id': this.dr_id, 'limit': this.filter, start: this.start, 'Status': this.Order_status_type, 'delivery_from': this.delivery_from, 'order_type': this.type, 'type': this.DrType,'Mode': this.Mode }, 'AppCustomerNetwork/customerSecondaryOrdersInfo').then((result) => {
      if (result['statusCode'] == 200) {
        this.service.dismissLoading()
        this.Order_detail = result['result'];
        this.total_order = result['result']['Order_Info'];
        this.count = result['count']
      } else {
        this.service.errorToast(result['statusMsg'])
        this.service.dismissLoading();
      }
    }, err => {
      this.service.dismissLoading();
    });

  }
  loadData(infiniteScroll) {
    this.start = this.total_order.length
    this.db.addData({ 'dr_id': this.dr_id, 'limit': this.filter, 'start': this.start, 'Status': this.Order_status_type, 'type': this.type,'Mode': this.Mode }, 'AppCustomerNetwork/customerSecondaryOrdersInfo').then(resp => {
      if (resp['result']['Order_Info'] == '') {
        this.flag = 1;
      }
      else {
        setTimeout(() => {
          this.total_order = this.total_order.concat(resp['result']['Order_Info']);
          infiniteScroll.complete();
        }, 1000);
      }
    });
  }


  ionViewDidLeave() {

  }

  goOnOrderDetailFromDrLogin(id) {
    this.navCtrl.push(SecondaryOrderDetailPage, { id: id, login: 'Employee' })
  }

  add_order() {
    console.log(this.dr_id)
    this.navCtrl.push(SecondaryOrderAddPage, { "type": this.type, "fromPage": 'DistSecondary', "distId": this.dr_id, 'dr_type': this.DrType });
  }
}
