import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams, PopoverController } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { TravelPopOverPage } from '../travel-pop-over/travel-pop-over';
import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';
import { ExpenseStatusModalPage } from '../expense-status-modal/expense-status-modal';
import zingchart from 'zingchart'
/**
 * Generated class for the TargetVsAchievementPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-target-vs-achievement',
  templateUrl: 'target-vs-achievement.html',
})
export class TargetVsAchievementPage {
  target_list: any={};
  target_Type: any='My';
  sale_type: any = 'Primary'
  user_list: any;
  data: any = {};
  teamCount: any = 0;
  count: any;
  date: any = new Date();
  monthNames: any = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  current_month: any = this.date.getMonth();
  current_year: any = this.date.getFullYear();
  current_month_name: any = this.monthNames[this.date.getMonth()];
  month_array: any = [];
  filter: any={};
  projection_data: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public serve: MyserviceProvider,public popoverCtrl: PopoverController,public storage: Storage,public modalCtrl: ModalController) {
    
    // if (this.navParams.get('view_type') == 'Team') {
    //   this.target_Type = "Team";
    //   this.targetList(this.target_Type);
    // }
    this.targetList();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TargetVsAchievementPage');
    this.storage.get('team_count').then((team_count) => { this.teamCount = team_count; });
    // this.targetList();
  }
  ionViewDidEnter() {
    // this.targetList();
    this.getSalesMonthArray();
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

  targetList(){
    this.serve.presentLoading();
    let paddedMonth;
    if (this.current_month + 1 < 10) {
        paddedMonth = '0' + (this.current_month + 1);
    } else {
        paddedMonth = '' + (this.current_month + 1);
    }
     this.serve.addData({'Mode':this.target_Type,'User_id':this.data.id,'data':this.filter}, 'AppTarget/target_achievement_List')
        .then((result) => {
            if (result['statusCode'] == 200) {
              this.serve.dismissLoading();
                this.target_list = result['target_list'][0];
                this.count = result['count'];
                console.log(this.target_list)
                console.log(this.target_list.primary_target)
                
            } else {
                this.serve.dismissLoading();
                this.serve.errorToast(result['statusMsg']);
            }
        }, error => {
            this.serve.dismissLoading();
            this.serve.Error_msg(error);
        });
  }
  
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(TravelPopOverPage, { 'from': 'Target' });
    popover.present({ ev: myEvent });

    popover.onDidDismiss(resultData => {
      console.log(this.target_Type)
      if (resultData) {

       
        this.target_Type = resultData.TabStatus;
        (this.target_Type != 'My') ? this.getuserlist('AppTarget/getAsm') : (console.log('asdf'), this.data = {}, this.targetList())

      }
    })
  }
  QuarterSet(){
   

      let modal = this.modalCtrl.create(ExpenseStatusModalPage, { 'from': 'TargetVsAchievement'});

      modal.onDidDismiss(data => { 
        
        this.filter=data

        this.targetList();


      });


      modal.present();
    
  }
  getuserlist(api_name) {
    this.serve.presentLoading()
    this.storage.get('userId').then((id) => {
      this.serve.addData({ 'user_id': id, 'type': this.sale_type }, api_name).then((result) => {
        if (result['statusCode'] == 200) {
          this.serve.dismissLoading()
          this.user_list = result['asm_id'];

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


  getReport() {
        
      console.log("hello")
              let ProspectCpPieChart: any = {
                type: 'ring',
                backgroundColor: '#fff',
        
                plot: {
                  tooltip: {
                    backgroundColor: '#000',
                    borderWidth: '0px',
                    fontSize: '10px',
                    sticky: true,
                    thousandsSeparator: ',',
                  },
                  valueBox: {
                    type: 'all',
                    text: '%npv%',
                    placement: 'in',
                    fontSize: '8px'
                  },
                  animation: {
                    effect: 2,
                    sequence: 4,
                    speed: 1000
                  },
                  backgroundColor: '#FBFCFE',
                  borderWidth: '0px',
                  slice: 40,
                },
                plotarea: {
                  margin: '0px',
                  backgroundColor: 'transparent',
                  borderRadius: '10px',
                  borderWidth: '0px',
                },
        
                series: [
                 
                  {
                    text: 'Open',
                    // values: [this.projection_data.target],
                    values: [5000],
                    backgroundColor: '#06870d',
                    lineColor: '#06870d',
                    lineWidth: '1px',
                    marker: {
                      backgroundColor: '#06870d',
                    },
                  },
                  {
                    text: 'Converted Sub-dealer',
                    // values: [this.projection_data.achieved],
                    values: [2000],
                    backgroundColor: '#ff4441',
                    lineColor: '#ff4441',
                    lineWidth: '1px',
                    marker: {
                      backgroundColor: '#ff4441',
                    },
                  },
                  
                  
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
        
              ProspectCpPieChart.gui = { contextMenu: { visible: false } };
              setTimeout(() => {
                  zingchart.render({ id: 'ProspectCpPieChart', data: ProspectCpPieChart, height: 185 });
              }, 1000);
      
        }

}
