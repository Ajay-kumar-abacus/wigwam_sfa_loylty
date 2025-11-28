import { Component, ViewChild } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { MyserviceProvider } from '../../../providers/myservice/myservice';
import { ComplaintDetailPage } from '../complaint-detail/complaint-detail';
import { IonicSelectableComponent } from 'ionic-selectable';

/**
 * Generated class for the SpareAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-spare-add',
  templateUrl: 'spare-add.html',
})
export class SpareAddPage {

  @ViewChild('distributorSelectable') distributorSelectable: IonicSelectableComponent;
  form: any = {}
  data = {};
  spare_list = [];
  savingFlag: boolean = false;
  addToListButton: boolean = false;
  add_list: any = [];
  spareData: any = {};
  id: any;
  assignedQty: any;
  complain_no: any;
  search: any;
  assigned_qty:any;


  constructor(public navCtrl: NavController, public navParams: NavParams, public serve: MyserviceProvider, public alertCtrl: AlertController) {
    console.log(this.navParams);
    this.id = this.navParams.data.id;
    this.complain_no = this.navParams.data.complain_no;
    this.getSpareParts('');
  }

  ionViewDidLoad() {
  }

  getSpareParts(id) {
    this.serve.addData({ 'search': this.search }, "AppServiceTask/getAssignedParts")
      .then(resp => {
        if (resp['statusCode'] == 200) {
          this.spare_list = resp['assign_part'];
          // this.assignedQty=this.spare_list[0]['assigned_qty']
          // if (id) {
          //   let index = this.spare_list.findIndex(d => d.part_id == id);
          //   if (index != -1) {
          //     this.spareData.part_id = this.spare_list[index].part_id;
          //     this.spareData.part_no = this.spare_list[index].part_no;
          //     this.spareData.part_name = this.spare_list[index].part_name;
          //     this.spareData.assigned_qty = this.spare_list[index].assigned_qty;
          //   }
          // }
        } else {
          this.serve.errorToast(resp['statusMsg'])
        }
      },
        err => {
        })
  }

  closeDealer() {
    this.distributorSelectable._searchText = '';
  }
  searchSpare(data, event) {
    if (event.text == '') {
      this.getSpareParts('');
    }
    this.search = event.text;
    let wordSearch = this.search;
    setTimeout(() => {
      if (wordSearch == this.search) {
        if (this.search) {
          this.getSpareParts(this.search);
        }
      }
    }, 500);
  }

  max() {
    // console.log(this.spareData.assigned_qty);
    console.log(this.spareData.part_id);


    if (parseInt(this.spareData.qty) > parseInt(this.spareData.part_id.assigned_qty)){
      this.serve.errorToast('Qty Should Be Less Then Assigned Qty');
      this.spareData.qty = 0
    }
  }

  DeleteItem(i) {
    let alert = this.alertCtrl.create({
      title: 'Are You Sure?',
      subTitle: 'You want to delete this item',
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
          this.add_list.splice(i, 1);

        }
      }]
    });
    alert.present();
  }

  addToList() {
    if (this.add_list.length == 0) {
      this.add_list.push({ 'part_id': this.spareData.part_id.part_id, 'part_name': this.spareData.part_id.part_name, 'part_no': this.spareData.part_id.part_no, 'qty': this.spareData.qty, });
    }
    else {
      let existIndex = this.add_list.findIndex(row => (row.part_id == this.spareData['part_id']['part_id']));
      if (existIndex != -1) {
        this.add_list[existIndex].qty = this.spareData.qty
      }
      else {
        this.add_list.push({ 'part_id': this.spareData.part_id.part_id, 'part_name': this.spareData.part_id.part_name, 'part_no': this.spareData.part_id.part_no, 'qty': this.spareData.qty, });
      }
    }
    this.spareData.qty = '';
    this.spareData.part_id = '';
  }


  saveInstallation() {
    this.savingFlag = true;
    this.spareData.add_list = this.add_list
    this.spareData.complaint_id = this.id
    this.spareData.complaint_no = this.complain_no
    this.serve.addData({ "data": this.spareData }, "AppServiceTask/saveComplaintSparePart")
      .then(resp => {
        if (resp['statusCode'] == 200) {
          this.savingFlag = false;
          this.serve.successToast(resp['statusMsg']);
          this.navCtrl.popTo(ComplaintDetailPage);

        } else {
          this.savingFlag = false;
          this.serve.errorToast(resp['statusMsg']);
        }
      }, error => {
        this.savingFlag = false;
        this.serve.Error_msg(error);
        this.serve.dismiss();
      })
  }

}
