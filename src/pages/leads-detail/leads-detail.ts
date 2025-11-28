import { Component, AfterViewInit } from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController, ModalController, LoadingController, PopoverController, ToastController } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { Platform } from 'ionic-angular';
import moment from 'moment';
import { PointLocationPage } from '../point-location/point-location';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';
import { ConstantProvider } from '../../providers/constant/constant';
import { TravelPopOverPage } from '../travel-pop-over/travel-pop-over';
import { MainDistributorListPage } from '../sales-app/main-distributor-list/main-distributor-list';
import { SupportPage } from '../support/support';
import { BrandAuditAddPage } from '../brand-audit-add/brand-audit-add';
import { SupportListPage } from '../support-list/support-list';
import { BrandAuditListPage } from '../brand-audit-list/brand-audit-list';
import { PrimaryOrderPage } from '../primary-order/primary-order';
import { SecondaryOrderPage } from '../secondary-order/secondary-order';
import { CheckinListPage } from '../sales-app/checkin-list/checkin-list';
import { AddRetailerPage } from '../add-retailer/add-retailer';
import { ExpenseStatusModalPage } from '../expense-status-modal/expense-status-modal';
import { PriceListPage } from '../price-list/price-list';
import { InventaoryInventaoryPage } from '../inventaory-inventaory/inventaory-inventaory';
import { WalletInfluencerWalletPage } from '../wallet-influencer-wallet/wallet-influencer-wallet';
@IonicPage()
@Component({
  selector: 'page-leads-detail',
  templateUrl: 'leads-detail.html',
})
export class LeadsDetailPage implements AfterViewInit {
  dr_id: any;
  drCode: any;
  distributor_detail: any = [];
  total_checkin: any = [];
  total_order: any = [];
  type: any
  search: any = {}
  currentDate: any;
  date: any
  showRelatedTab: any
  target: any;
  achievement: any;
  image_url: any = ''
  inoviceInfo: any = []
  fourthInfo: any = {};
  thirdInfo: any = {};
  secondInfo: any = {};
  firstInfo: any = {};
  DrType: any = ''
  Mode: any = ''

  constructor(public file: File,
    private fileOpener: FileOpener,
    public platform: Platform,
    public constant: ConstantProvider,
    private transfer: FileTransfer, private app: App, public navCtrl: NavController, private alertCtrl: AlertController, public db: MyserviceProvider, public modalCtrl: ModalController, public navParams: NavParams, public serve: MyserviceProvider, public loadingCtrl: LoadingController, public popoverCtrl: PopoverController, public toastCtrl: ToastController) {


  }

  ionViewWillEnter() {
    this.date = moment(this.date).format('YYYY-MM-DD');
    this.currentDate = moment().format("MMMM YYYY");
    this.image_url = this.constant.upload_url1
    this.DrType = this.navParams.get('dr_type')
    this.Mode = this.navParams.get('Mode')
    console.log(this.Mode)
    console.log(this.DrType, "BTL Activity")
    if (this.navParams.get('dr_id')) {
      this.dr_id = this.navParams.get('dr_id');
    }

    if (this.navParams.get('showRelatedTab') == 'false') {
      this.showRelatedTab = false
    }
    else {
      this.showRelatedTab = true

    }
    this.type = this.navParams.get('type');
    this.dr_detail();

  }


  ngAfterViewInit() {
    // this.platform.ready().then(() => this.loadMap());
  }


  loading: any;
  lodingPersent() {
    this.loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img src="./assets/imgs/gif.svg" class="h55" />`,
    });
    this.loading.present();
  }

 
  close() {
    this.navCtrl.push(MainDistributorListPage);
  }
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(TravelPopOverPage, { 'dr_id': this.dr_id, 'from': 'leads-details', 'dr_code': this.drCode, 'dr_type': this.DrType });

    popover.present({
      ev: myEvent
    });

    popover.onDidDismiss(resultData => {


    })

  }
  dr_detail() {
    this.serve.presentLoading()
    this.serve.addData({ 'Id': this.dr_id, search: this.search,'type':this.DrType }, 'AppCustomerNetwork/distributorDetails').then((result) => {
      if (result['statusCode'] == 200) {
        this.serve.dismissLoading()
        this.distributor_detail = result['result'];
        this.inoviceInfo = result['result']['inoviceInfo']
        this.drCode = this.distributor_detail.dr_code
        this.target = result['total_target'];
        this.achievement = result['total_achivement'];
        this.total_order = result['Primary'];
        this.target = parseInt(this.target)
        this.achievement = parseInt(this.achievement)

        if (this.distributor_detail.name) {
          this.distributor_detail.name = String(this.distributor_detail.name);
        }
      } else {
        this.serve.dismissLoading()
        this.serve.errorToast(result['statusMsg'])
      }
    }, error => {
      this.serve.Error_msg(error);
      this.serve.dismiss();
    }
    );

  }

  checkin_list: any = [];
  load_data: any = "0";
  order_list: any = [];
  update_location(lat, lng, id) {
    this.navCtrl.push(PointLocationPage, { "lat": lat, "lng": lng, "id": id, "type": this.type })
  }
  goToPage(type) {
    if (type == 'ticket') {
      this.navCtrl.push(SupportPage, { 'fromPage': 'distDetail', 'dr_id': this.distributor_detail.id, 'dr_type': this.distributor_detail.type })
    } else {
      this.navCtrl.push(BrandAuditAddPage, { 'fromPage': 'distDetail', 'dr_id': this.distributor_detail.id, 'dr_type': this.distributor_detail.type })

    }
  }
  goToListPage(type) {
    if (type == 'ticket') {
      this.navCtrl.push(SupportListPage, { 'fromPage': type, 'dr_id': this.distributor_detail.id })
    } else {
      this.navCtrl.push(BrandAuditListPage, { 'fromPage': type, 'dr_id': this.distributor_detail.id })

    }
  }

  priceList(){
    this.navCtrl.push(PriceListPage, {'dr_id': this.distributor_detail.id })
  }

  getInventory(){
    this.navCtrl.push(InventaoryInventaoryPage, {'dr_id': this.distributor_detail.id,'name':this.distributor_detail.name,'company_name':this.distributor_detail.company_name,'mobile':this.distributor_detail.mobile })
  }
  gotoWallet(){
    this.navCtrl.push(WalletInfluencerWalletPage, {'dr_id': this.distributor_detail.id})
}


  go_to(type) {

    if (type == 'Primary') {

      this.navCtrl.push(PrimaryOrderPage, { 'comes_from_which_page': 'leads-detail', 'dr_code': this.distributor_detail.dr_code, 'delivery_from': 'Yes', 'dr_id': this.dr_id, 'type': type, 'dr_type': this.DrType,'Mode': this.Mode });

    } else if (type == 'Secondary') {
      this.navCtrl.push(SecondaryOrderPage, { 'comes_from_which_page': 'leads-details', 'dr_code': this.distributor_detail.dr_code, 'delivery_from': (this.DrType == 1 || this.DrType == 3) ? 'Yes' : 'No', 'dr_id': this.dr_id, 'type': 'order', 'dr_type': this.DrType ,'Mode': this.Mode})
    } else if (type == 'Stock') {

      this.navCtrl.push(SecondaryOrderPage, { 'comes_from_which_page': 'leads-details', 'dr_code': this.distributor_detail.dr_code, 'delivery_from': this.DrType == 3 ? 'No' : 'Yes', 'dr_id': this.dr_id, 'type': 'stock', 'dr_type': this.DrType ,'Mode': this.Mode})


    } else if (type == 'Checkin') {

      this.navCtrl.push(CheckinListPage, { 'comes_from_which_page': 'leads-details', 'dr_code': this.distributor_detail.dr_code, 'delivery_from': 'Yes', 'dr_id': this.dr_id, 'type': type, 'dr_type': this.DrType, 'Mode': this.Mode })
    }
  }


  confirmationAlert(type, type_name) {
    let alert = this.alertCtrl.create({
      title: 'Are You Sure?',
      subTitle: 'You Want to convert to ' + type_name,
      cssClass: 'alert-modal',

      buttons: [{
        text: 'No',
        role: 'No',
        handler: () => {
        }
      },
      {
        text: 'Yes',
        cssClass: 'close-action-sheet',
        handler: () => {
          this.changeStatus(type)
        }
      }]
    });
    alert.present();
  }

  changeStatus(type) {
    this.serve.addData({ 'type': type, 'dr_id': this.distributor_detail.id }, 'AppCustomerNetwork/dr_type_update').then((result) => {
      if (result['statusCode'] == 200) {
        this.serve.successToast(result['statusMsg']);
        this.dr_detail();
        this.serve.dismissLoading()
      } else {
        this.serve.dismissLoading()
        this.serve.errorToast(result['statusMsg'])
      }
    }, error => {
      this.serve.Error_msg(error);
      this.serve.dismiss();
    }
    );
  }



  goToEditPage(detail) {
    this.navCtrl.push(AddRetailerPage, { 'type': this.DrType, 'edit_page': true, 'data': detail, 'moduleName': 'Ply Expert' })
  }

 
  AssignUser(e: any) {
    // e.stopPropagation();
    let modal = this.modalCtrl.create(ExpenseStatusModalPage, { 'from': 'customerDetail', 'id': this.distributor_detail.id });
    modal.present();

    modal.onDidDismiss((data) => {
      this.dr_detail()
    })
  }
 

}
