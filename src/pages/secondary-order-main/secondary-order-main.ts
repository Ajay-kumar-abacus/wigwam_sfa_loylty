import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController, Navbar, Platform, Nav, App, PopoverController } from 'ionic-angular';
import { SecondaryOrderDetailPage } from '../secondary-order-detail/secondary-order-detail';

import { MyserviceProvider } from '../../providers/myservice/myservice';
// import { OrderTypeModalPage } from '../order-type-modal/order-type-modal';
import { ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ConstantProvider } from '../../providers/constant/constant';
import moment from 'moment';
import { SecondaryOrderAddPage } from '../secondary-order-add/secondary-order-add';
import { TravelPopOverPage } from '../travel-pop-over/travel-pop-over';
@IonicPage()
@Component({
    selector: 'page-secondary-order-main',
    templateUrl: 'secondary-order-main.html',
})
export class SecondaryOrderMainPage {

    @ViewChild(Navbar) navBar: Navbar;
    @ViewChild(Nav) nav: Nav;
    user_id: any = 0;
    date: any
    target_Type: any = 'My'
    order_type: any = '';
    searchData: any = '';
    tabSelected: any
    start: any = 0;
    limit: any = 10;
    flag: any = '';
    user_data: any = {};
    filter: any = {}
    count: any = {}
    userId: any;
    order_list: any = [];
    sendRequest: any = false;
    today_secondary_amount: any = 0;
    order_status: any = 'Pending'
    Type: any = ''
    header: any = ''
    site_id: any = ''
    teamCount: any;
    constructor(
        private app: App,
        public navCtrl: NavController,
        public constant: ConstantProvider,
        public loadingCtrl: LoadingController,
        public navParams: NavParams,
        public db: MyserviceProvider,
        public popoverCtrl: PopoverController,
        public modalCtrl: ModalController,
        public storage: Storage,
        public platform: Platform,
        public appCtrl: App) {
        this.date = moment(this.date).format('YYYY-MM-DD');
        this.userId = navParams.get('userId')
        this.site_id = navParams.get('site_id')
        this.Type = this.navParams.get('type')
    }

    ionViewWillEnter() {
        this.storage.get('team_count').then((team_count) => {
            this.teamCount = team_count;
        });
        this.get_orders()
        this.searchData = this.navParams.get("dr_name");
         if( this.Type == 'order'){
            this.header = 'Secondary Order'
         }else{
            this.header = 'Stock Transfer'
         }
        if (this.searchData) {
            // this.filter.order_status='Pending'
            this.order_type = this.navParams.get("type");

            this.filter.master = this.searchData;
            // this.get_orders();
            this.order_type = this.navParams.get("type");
        }
        else {
            // this.filter.order_status='Pending'
            this.order_type = this.navParams.get("type");


            // this.get_orders();
            this.order_type = this.navParams.get("type");
        }


    }

    change_tab(type) {
        this.order_type = type;
        this.order_list = [];
        this.start = 0;
        this.filter = {};
        this.get_orders();
    }
    presentPopover(myEvent) {
        let popover = this.popoverCtrl.create(TravelPopOverPage, { 'from': 'SecondaryOrd' });

        popover.present({
            ev: myEvent
        });

        popover.onDidDismiss(resultData => {


            if (resultData) {
                this.target_Type = resultData.TabStatus;

                this.get_orders()

            }
        })

    }

    get_orders() {
        this.limit = 20
        this.start = 0
        this.filter.type = this.order_type;
        if(this.site_id || this.site_id != ''){
          this.filter.site_id = this.site_id
        }
        this.sendRequest = false
        this.db.presentLoading();
        this.order_list = [];
        this.db.addData({ "Status": this.order_status, "Mode": this.target_Type, 'filter': this.filter,"type":this.Type }, "AppOrder/secondaryOrdersList").then(resp => {
            if (resp['statusCode'] == 200) {
                this.db.dismissLoading();
                this.order_list = resp['result']['result'];
                this.count = resp['count'];
                this.today_secondary_amount = resp['total_secondary_amount'];
                this.flag = ''
                this.start = this.order_list.length
                if (this.order_list.length > 0) {
                    this.order_list.map((item) => {
                        item.order_grand_total = Math.round(item.order_grand_total);
                    })
                }
                // this.order_list.map((item)=>{
                //     item.order_grand_total = Math.round(item.order_grand_total);
                // })
                // if(!this.filter.master)
                this.sendRequest = true
            }
            else {
                this.db.dismissLoading()
                this.db.errorToast(resp['statusMsg'])
                this.sendRequest = true;
            }
        }, err => {
            this.db.dismissLoading()
            this.db.errToasr()
        })
      
    }

    loadData(infiniteScroll) {
        this.start = this.order_list.length;
        this.filter.type = this.order_type;

        this.db.addData({ "Status": this.order_status, 'limit': this.limit, 'start': this.start, "Mode": this.target_Type, 'filter': this.filter,"type":this.Type  }, "AppOrder/secondaryOrdersList").then((r) => {
            if (r['result']['result'] == '') {
                this.flag = 1;
            }
            else {
                setTimeout(() => {
                    this.order_list = this.order_list.concat(r['result']['result']);
                    infiniteScroll.complete();
                }, 1000);
            }
        });
    }

    get_orderssearch() {
        this.start = 0

        this.db.addData({ "Status": this.order_status, "Mode": this.target_Type, 'filter': this.filter }, "AppOrder/secondaryOrdersList").then(resp => {
            if (resp['statusCode'] == 200) {
                this.order_list = resp['result']['result'];
                this.count = resp['count'];
                this.today_secondary_amount = resp['total_secondary_amount'];
                this.order_list.map((item) => {
                    item.order_grand_total = Math.round(item.order_grand_total);
                })
            } else {
                this.db.errorToast(resp['statusMsg'])
            }
        }, err => {
        })
    }



    goOnOrderDetail(id) {
        this.navCtrl.push(SecondaryOrderDetailPage, { id: id, login: 'Employee' })
    }

    goOnOrderDetailFromDrLogin(id) {
        this.navCtrl.push(SecondaryOrderDetailPage, { id: id ,'type':this.Type})
    }

    doRefresh(refresher) {
        this.start = 0
        this.filter.master = '';
        // this.filter.date = '';
        this.get_orders()
        setTimeout(() => {
            refresher.complete();
        }, 1000);
    }

    add_order() {
        this.navCtrl.push(SecondaryOrderAddPage, { "type": this.Type });
    }

    ionViewDidLeave() {
        let nav = this.app.getActiveNav();


        if (nav && nav.getActive()) {
            let activeView = nav.getActive().name;


            let previuosView = '';


            if (nav.getPrevious() && nav.getPrevious().name) {
                previuosView = nav.getPrevious().name;
            }

            if ((previuosView == 'AddOrderPage')) {
                this.navCtrl.popToRoot();
            }
        }
    }
}

