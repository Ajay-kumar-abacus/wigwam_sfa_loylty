import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, PopoverController, ToastController, ModalController } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { ConstantProvider } from '../../providers/constant/constant';
import { Storage } from '@ionic/storage';
import { TravelPopOverPage } from '../travel-pop-over/travel-pop-over';
import { LoadingController } from 'ionic-angular';
import { Chart } from 'chart.js';
import moment from 'moment';
import { IonicSelectableComponent } from 'ionic-selectable';
import zingchart from 'zingchart'
import { ExpenseStatusModalPage } from '../expense-status-modal/expense-status-modal';
import { AddTargetPage } from '../add-target/add-target';
import { TravelMonthlyAddPage } from '../travel-monthly-add/travel-monthly-add';


/**
 * Generated class for the TargetPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-target',
  templateUrl: 'target.html',
})
export class TargetPage {
  @ViewChild('selectComponent') selectComponent: IonicSelectableComponent;
  @ViewChild('barCanvas') private barCanvas: ElementRef;
  @ViewChild('doughnutCanvas') private doughnutCanvas: ElementRef;
  // @ViewChild('lineCanvas') private lineCanvas: ElementRef;
  activeTab: string = "active";
  salesActiveTab: string = "active1";

  index: any = 0
  LoginType: any = this.constant.UserLoggedInData
  visitHidden: boolean = false;
  salesHidden: boolean = true;
  visit_date: any = []
  filteruser: any;
  visit_completed: any = []
  sale_type: any = 'Primary'
  target_list: any = []
  target_category: any = []
  allDatesData: any = []
  target_achieve: any = []
  total_target: any = []
  requiredRate: any = []
  target_not_achieved: any = []
  target_status: any = 'In Process'
  visit_target: any = {}
  barChart: any;
  doughnutChart: any;
  dataVisible: any = false;
  lineChart: any;
  date: any = new Date();
  monthNames: any = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  balance: any = [];
  current_month: any = this.date.getMonth();
  current_year: any = this.date.getFullYear();
  current_month_name: any = this.monthNames[this.date.getMonth()];
  month_array: any = [];
  target_Type: any = 'My';
  teamCount: any = 0;
  // userId: any;
  user_list: any = []
  primaryTragetArray: any = []
  data: any = {};
  Navtype: any = ''
  Dr_id: any
  From: any = this.navParams.get('comes_from_which_page');
  user_data: any;
  assigned_orderType: any;
  type_target: string;
  liveMonth: any;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public constant: ConstantProvider, public navParams: NavParams, public popoverCtrl: PopoverController, public serve: MyserviceProvider, private loadingCtrl: LoadingController, public storage: Storage, public toastCtrl: ToastController, public modalCtrl: ModalController,) {

    if (this.navParams.get('view_type') == 'Team') {
      this.target_Type = "Team";
      this.getuserlist('AppTarget/getAsm')
      // this.Target(this.sale_type);
    }
    this.liveMonth=this.current_month
  }


  ionViewDidEnter() {
    this.Target(this.sale_type)
    this.storage.get('team_count').then((team_count) => { this.teamCount = team_count; });
    this.getSalesMonthArray();
    this.getEnquiryReport()
  }

  ionViewWillEnter() {


    zingchart.render({ id: 'targetPieChart', data: this.targetPieChart, height: 250 });
  }

  getSalesMonthArray() {
    for (let i = -3; i <= 3; i++) {
      let month = new Date(this.current_year, this.current_month + i, 1).getMonth();
      let year = new Date(this.current_year, this.current_month + i, 1).getFullYear();
      this.month_array.push({
        'month': month,
        'year': year,
        'month_name': this.monthNames[month]
      });
    }
  }
  addTarget() {
    this.navCtrl.push(AddTargetPage, { 'salesTargetType': this.sale_type, 'teamId': this.data.id })
  }
  addMJP() {
    this.navCtrl.push(TravelMonthlyAddPage, { 'teamId': this.data.id })
  }
  // Target(target) {
  //   this.serve.presentLoading();
  //   let header = {}
  //   if (target == 'Secondary') {
  //     header = { 'Mode': this.target_Type, 'target_type': 'order', 'Type': target, 'User_id': this.data.id, 'Month': this.current_month + 1, 'Year': this.current_year }
  //     this.type_target = 'order'
  //   } else if (target == 'Stock Transfer') {
  //     header = { 'Mode': this.target_Type, 'target_type': 'stock', 'Type': 'Secondary', 'User_id': this.data.id, 'Month': this.current_month + 1, 'Year': this.current_year }
  //     this.type_target = 'stock'
  //   } else {
  //     header = { 'Mode': this.target_Type, 'Type': target, 'User_id': this.data.id, 'Month': this.current_month + 1, 'Year': this.current_year }
  //   }
  //   this.serve.addData(header, 'AppTarget/targetList')
  //     .then((result) => {
  //       if (result['statusCode'] == 200) {
  //         this.target_list = result['result']['data']
  //         this.primaryTragetArray = result['result']['data_array']
  //         this.serve.dismissLoading()
  //       } else {
  //         this.serve.dismissLoading()
  //         this.serve.errorToast(result['statusMsg'])
  //       }
  //     }, error => {
  //       this.serve.dismissLoading()
  //       this.serve.Error_msg(error);
  //     });
  // }
  Target(target) {
    // this.serve.presentLoading();
    let header = {};
    let paddedMonth;
    if (this.current_month + 1 < 10) {
        paddedMonth = '0' + (this.current_month + 1);
    } else {
        paddedMonth = '' + (this.current_month + 1);
    }

    if (target == 'Secondary') {
        header = { 'Mode': this.target_Type, 'target_type': 'order', 'Type': target, 'User_id': this.data.id, 'Month': paddedMonth, 'Year': this.current_year };
        this.type_target = 'order';
    } else if (target == 'Stock Transfer') {
        header = { 'Mode': this.target_Type, 'target_type': 'stock', 'Type': 'Secondary', 'User_id': this.data.id, 'Month': paddedMonth, 'Year': this.current_year };
        this.type_target = 'stock';
    } else {
        header = { 'Mode': this.target_Type, 'Type': target, 'User_id': this.data.id, 'Month': paddedMonth, 'Year': this.current_year };
    }

    this.serve.addData(header, 'AppTarget/targetList')
        .then((result) => {
            if (result['statusCode'] == 200) {
                this.target_list = result['result']['data'];
                this.primaryTragetArray = result['result']['data_array'];
                this.serve.dismissLoading();
            } else {
              this.target_list=[]
              this.primaryTragetArray=[]
                this.serve.dismissLoading();
                this.serve.errorToast(result['statusMsg']);
            }
        }, error => {
            this.serve.dismissLoading();
            this.serve.Error_msg(error);
        });
}


  statusModal(id, type) {
    if (type == 'edit') {
      let modal = this.modalCtrl.create(ExpenseStatusModalPage, { 'ProjectionId': id, 'from': 'Target', 'sale_type': this.sale_type, 'target_type': this.type_target, 'type': 'edit' });
      modal.onDidDismiss(data => {
        // this.navCtrl.pop();
        this.Target(this.sale_type);


      });


      modal.present();
    }
    else {

      let modal = this.modalCtrl.create(ExpenseStatusModalPage, { 'ProjectionId': id, 'from': 'Target', 'sale_type': this.sale_type, 'target_type': this.type_target });

      modal.onDidDismiss(data => {
        // this.navCtrl.pop();
        this.Target(this.sale_type);


      });


      modal.present();
    }
  }

  deleteTravelPlan(e, i, id) {

    let alert = this.alertCtrl.create({
      title: 'Are You Sure?',
      subTitle: 'You want to delete this Target / Projection',
      cssClass: 'alert-modal',

      buttons: [{
        text: 'No',
        role: 'cancel',
        handler: () => {

        }
      },
      {
        text: 'Yes',
        handler: () => {
          e.stopPropagation()
          this.primaryTragetArray.splice(i, 1)
          this.data = { 'id': id, 'type': this.sale_type }
          this.serve.addData(this.data, 'AppTarget/deleteTarget').then((result) => {
            if (result['statusCode'] == 200) {
              this.serve.dismissLoading()
              this.serve.successToast(result['statusMsg'])
              this.data.id='';
              this.Target(this.sale_type);
            } else {
              this.serve.dismissLoading();
              this.serve.errorToast(result['statusMsg'])
              this.Target(this.sale_type);
            }

          }, error => {
            this.serve.Error_msg(error);
            this.serve.dismissLoading();
          });
        }
      }]
    });
    alert.present();


  }
  getEnquiryReport() {
    // let apiName = ''
    // if (this.primaryDashboard) {
    //   apiName = 'AppDashboard/userEnquiryReport'
    // } else if (this.secondaryDashboard) {
    //   apiName = 'AppDashboard/userEnquirySecondaryReport'
    // }
    // this.service.addData({}, apiName).then((response) => {
    //   if (response['statusCode'] == 200) {
    //     this.enquiryReport = response['data']

    let enquiryPieChart: any = {
      type: 'ring',
      backgroundColor: '#fff',

      plot: {
        tooltip: {
          backgroundColor: 'black',
          borderWidth: '0px',
          fontSize: '10px',
          sticky: true,
          text: '%t<br/>%v',
          thousandsSeparator: ',',
        },
        valueBox:
        {
          type: 'all',
          text: '%npv%',
          placement: 'out',
          fontSize: '10px'
        },

        animation: {
          effect: 2,
          sequence: 3,
          speed: 6000,
          delay: "1500"
        },
        backgroundColor: '#FBFCFE',
        borderWidth: '0px',

        slice: 30,
      },
      plotarea: {
        margin: '0px',
        backgroundColor: 'transparent',
        borderRadius: '10px',
        borderWidth: '0px',
      },
      series: [
        {
          text: 'Target',
          values: [this.target_list.target],

          backgroundColor: '#ff4441',
          lineColor: '#ff4441',
          lineWidth: '1px',
          marker: {
            backgroundColor: '#ff4441',
          },
        },
        {
          text: 'Achievement',
          values: [this.target_list.achieved],
          backgroundColor: '#67a21e',
          lineColor: '#67a21e',
          lineWidth: '1px',
          marker: {
            backgroundColor: '#67a21e',
          },
        }
      ],
      noData: {
        text: 'No Selection',
        alpha: 0.6,
        backgroundColor: '#20b2db',
        bold: true,
        fontSize: '10px',
        textAlpha: 0.9,
      },
    };

    enquiryPieChart.gui = { contextMenu: { visible: false } }
    zingchart.render({ id: 'enquiryPieChart', data: enquiryPieChart, height: 250 })


    // }, error => {
    //   this.service.Error_msg(error);
    //   this.service.dismissLoading()
    // })
  }

  getuserlist(api_name) {
    this.serve.presentLoading()
    this.storage.get('userId').then((id) => {
      this.serve.addData({ 'user_id': id, 'type': this.sale_type }, api_name).then((result) => {
        if (result['statusCode'] == 200) {
          this.serve.dismissLoading()
          this.user_list = result['asm_id'];
          this.Target(this.sale_type)

        } else {
          this.serve.dismissLoading()
          this.serve.errorToast(result['statusMsg'])
        }
      }, err => {
        this.serve.dismissLoading()
        this.serve.errorToast('Something went wrong')
      });
    });
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(TravelPopOverPage, this.From == 'Travel-pop' ? { 'from': 'leads-details' } : { 'from': 'Target' });
    popover.present({ ev: myEvent });

    popover.onDidDismiss(resultData => {
      if (resultData) {
        this.target_Type = resultData.TabStatus;
        if (this.target_Type == 'My') {
          this.dataVisible = false;
        } else {
          this.dataVisible = true;
        }


        (this.target_Type != 'My') ? this.getuserlist('AppTarget/getAsm') : (console.log('asdf'), this.data = {}, this.Target(this.sale_type))

      }
    })
  }

  targetPieChart: any = {
    "type": "pie",
    "plotarea": {
      "margin": "40",
    },
    "scale": {
      "sizeFactor": 1
    },
    "plot": {
      "valueBox": {
        "visible": true,
        "fontSize": 12,
        "anchor": "c",
        "fontFamily": "Lucida Sans Unicode",
        "text": "%plot-text<br><span style='font-size:12px;font-weight:bold;color:%color;'>%node-percent-value%</span><br><span style='font-size:10px;color:%color;'>%v</span>",
        "color": "#333",
        "placement": "center",
        "borderWidth": 0,
        "backgroundColor": "none",
        'short': true
      },
      "refAngle": 270,
      "angleStart": 270,
      "detach": false,
      "slice": "100%",
      "totals": [200],
      "animation": {
        "speed": 1000,
        "effect": 2,
        "method": 0
      },
      "hoverState": {
        "visible": false
      }
    },

    "series": [
      {
        "size": "100%",
        "values": [150],
        "backgroundColor": "#67a21e",
        "borderWidth": 10,
        "borderColor": "#67a21e",
        "angleStart": 270,
        "-angleEnd": 270,
        "text": "Achieved"
      }
    ],
    "tooltip": {
      "x": 80,
      "y": 80,
      "width": 100,
      "fontSize": 12,
      "padding": 30,
      "anchor": "c",
      "fontFamily": "Lucida Sans Unicode",
      "text": "%plot-text<br><span style='font-size:12px;font-weight:bold;color:%color;'>%node-percent-value%</span><br><span style='font-size:10px;color:%color;'>%v</span>",
      "color": "#333",
      "align": "center",
      "borderWidth": 0,
      "backgroundColor": "none",

    },
    "shapes": [
      {
        "type": "pie",
        "flat": true,
        "x": 80,
        "y": 80,
        "backgroundColor": "#67a21e",
        "alpha": 0.25,
        "size": 45,
        "slice": 35,
        "placement": "bottom"
      },

    ]
  };

  doRefresh(refresher) {

    (this.target_Type != 'My') ? this.getuserlist('AppTarget/getAsm') : (console.log('asdf'), this.data = {}, this.Target(this.sale_type))


    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }
}   