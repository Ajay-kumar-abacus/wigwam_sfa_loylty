
import { Component, } from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController, ModalController, LoadingController, PopoverController, ToastController } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import moment from 'moment';
import { File } from '@ionic-native/file';
import { ConstantProvider } from '../../providers/constant/constant';
import { TravelPopOverPage } from '../travel-pop-over/travel-pop-over';
import { PrimaryOrderDetailPage } from '../primary-order-detail/primary-order-detail';
import { PrimaryOrderAddPage } from '../primary-order-add/primary-order-add';

@IonicPage()
@Component({
  selector: 'page-primary-order',
  templateUrl: 'primary-order.html',
})
export class PrimaryOrderPage {
  dr_id: any;
  Order_detail: any = [];
  total_checkin: any = [];
  total_order: any = [];
  type: any
  filter: any = {};
  search: any;
  start: any;
  limit: any;
  date: any
  flag: any = '';
  showRelatedTab: any
  target: any;
  achievement: any;
  image_url: any = ''
  LoginType: any = ''
  OrderType: any
  count: any = {}
  order_status: any = 'Pending'
  DrType: any = ''
  drCode: any;
  delivery_from: any;
  Mode: any;
  constructor(public file: File,
    public constant: ConstantProvider,
    private app: App, public navCtrl: NavController, private alertCtrl: AlertController, public db: MyserviceProvider, public modalCtrl: ModalController, public navParams: NavParams, public service: MyserviceProvider, public loadingCtrl: LoadingController, public popoverCtrl: PopoverController, public toastCtrl: ToastController) {
    this.date = moment(this.date).format('YYYY-MM-DD');
    this.DrType = this.navParams.get('dr_type')
    this.drCode = this.navParams.get('dr_code')
    this.dr_id = this.navParams.get('dr_id');
    this.Mode = this.navParams.get('Mode');
    this.delivery_from = this.navParams.data.delivery_from;
    this.LoginType = this.constant.UserLoggedInData.loggedInUserType
  }

  ionViewWillEnter() {
    this.Order_list();
  }



  presentPopover(myEvent) {

    let popover = this.popoverCtrl.create(TravelPopOverPage, { 'dr_id': this.dr_id, 'from': 'leads-details', 'dr_code': this.drCode, 'dr_type': this.DrType });

    popover.present({
      ev: myEvent
    });

    popover.onDidDismiss(resultData => {
    })

  }
  Order_list() {

    this.service.presentLoading()
    if (this.constant.UserLoggedInData.id) {
      this.dr_id = this.constant.UserLoggedInData.id
    }
    this.limit = 20;
    this.start = 0;
    this.service.addData({ 'dr_id': this.dr_id, 'limit': this.limit, 'start': this.start, 'Status': this.order_status, 'delivery_from': this.delivery_from, 'filter': this.filter,'Mode':this.Mode }, 'AppCustomerNetwork/customerPrimaryOrdersInfo').then((result) => {
      if (result['statusCode'] == 200) {
        this.service.dismissLoading()
        this.Order_detail = result['result'];
        this.total_order = result['result']['Order_Info'];
        this.count = result['count']
        this.start = this.Order_detail.length;
      } else {
        this.service.errorToast(result['statusMsg'])
        this.service.dismissLoading()
      }

    });

  }
  doRefresh(refresher) {
    this.start = 0
    this.filter.master = '';
    this.filter.date = '';
    this.Order_list()
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }
  loadData(infiniteScroll) {
    this.start = this.total_order.length
    this.service.addData({ 'dr_id': this.dr_id, search: this.search, 'limit': this.limit, 'start': this.start, 'Status': this.order_status,'Mode':this.Mode }, 'AppCustomerNetwork/customerPrimaryOrdersInfo').then(result => {
      if (result['result']['Order_Info'] == '') {
        this.flag = 1;
      }
      else {
        setTimeout(() => {
          this.total_order = this.total_order.concat(result['result']['Order_Info']);
          infiniteScroll.complete();
        }, 1000);
      }
    });
  }
  goOnOrderDetail(id) {
    this.navCtrl.push(PrimaryOrderDetailPage, { id: id, order_status: this.order_status })
  }
  add_order() {
    this.navCtrl.push(PrimaryOrderAddPage, { 'dr_id': this.dr_id, 'from': 'DistPrimary', 'dr_code': this.drCode, 'dr_type': this.DrType });
  }
}
