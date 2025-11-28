import { Component,ViewChild } from '@angular/core';
import { ActionSheetController, AlertController, IonicPage,Loading, LoadingController, NavController, NavParams, Platform } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { Diagnostic } from '@ionic-native/diagnostic';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { DomSanitizer } from '@angular/platform-browser';
import { Camera } from '@ionic-native/camera';
import { ComplaintDetailPage } from '../complaints/complaint-detail/complaint-detail';
import { IonicSelectableComponent } from 'ionic-selectable';

/**
* Generated class for the AddinvoicePage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-addinvoice',
  templateUrl: 'addinvoice.html',
})
export class AddinvoicePage {

  @ViewChild('distributorSelectable') distributorSelectable: IonicSelectableComponent;
  formData: any = {}
  tmpformData: any = {}

  id: any;
  totalQty: any;
  loading:Loading;
  search: any;
  spare_list = [];
  spare_list_array = [];
  assignedQty: any;
  add_list: any = [];
  spare_part:any;
  savingFlag: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public service: MyserviceProvider, public loadingCtrl: LoadingController, private barcodeScanner: BarcodeScanner, public alertCtrl: AlertController, public serve: MyserviceProvider, public platform: Platform, public openNativeSettings: OpenNativeSettings, public actionSheetController: ActionSheetController, public diagnostic: Diagnostic, public androidPermissions: AndroidPermissions, public dom: DomSanitizer, private camera: Camera) {
    // console.log(this.navParams);
    this.id = this.navParams.data.id;
  }

  ionViewDidLoad() {
    this.formData.discount_amount=0
    this.getSpareParts();
    console.log('ionViewDidLoad AddinvoicePage');
  }


  showSuccess(text) {
    let alert = this.alertCtrl.create({
      title: 'Success!',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }


  addInvoice(){
    this.savingFlag = true;
    this.formData.complaint_id = this.id

    console.log(this.formData);
    this.serve.presentLoading();
    this.serve.addData({ "add_list":this.add_list, "data": this.formData }, 'AppServiceTask/serviceInvoiceAdd').then(result => {
      if (result['statusCode'] == 200) {
        this.savingFlag = false;
        this.serve.dismissLoading();
        this.showSuccess("Invoice Added Successfully!");
        this.navCtrl.popTo(ComplaintDetailPage, { id: this.id });
      }
      else {
        this.savingFlag = false;
        this.serve.dismissLoading();
        this.serve.errorToast(result['statusMsg'])
      }
      console.log(result);
    });

  }

  presentLoading()
  {
    this.loading = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  getSpareParts() {
    this.serve.addData({ 'complaint_id': this.id}, "AppServiceTask/getComplaintInstalledSparePartList")
    .then(resp => {
      if (resp['statusCode'] == 200) {
        this.spare_list = resp['spare_part'];
      }
      else {
        this.serve.errorToast(resp['statusMsg'])
      }
    },
    err => {
    })
  }



  addToList() {

    this.formData.amount=0;
    this.formData.disc=0;
    this.formData.discount_amount=0;
    // this.tmpformData.discount_amount=0;
    // this.tmpformData.final_amount=0;
    this.formData.gst_amount=0;
    this.formData.final_amount=0;


    if (this.add_list.length == 0) {
      this.add_list.push({'amount': this.tmpformData.amount,'discount': this.tmpformData.discount,'mrp': this.tmpformData.mrp,'part_name': this.tmpformData.part_name,'totalQty': this.tmpformData.totalQty ,'part_id':this.tmpformData.part_id, 'discount_amount':this.tmpformData.discount_amount , 'final_amount':this.tmpformData.final_amount, 'part_no':this.tmpformData.part_no});
      console.log(this.add_list);
    }
    else {
      this.add_list.push({'amount': this.tmpformData.amount,'discount': this.tmpformData.discount,'mrp': this.tmpformData.mrp,'part_name': this.tmpformData.part_name,'totalQty': this.tmpformData.totalQty,'part_id':this.tmpformData.part_id, 'discount_amount':this.tmpformData.discount_amount , 'final_amount':this.tmpformData.final_amount, 'part_no':this.tmpformData.part_no});
    }
    console.log(this.add_list);
    console.log(this.tmpformData.amount);
    console.log(this.tmpformData.discount,);



    for (let index = 0; index < this.add_list.length; index++) {

      this.tmpformData.discount_amount += (this.add_list[index].amount)* (parseFloat(this.add_list[index].discount) / 100);


      this.tmpformData.final_amount += (this.add_list[index].amount) - (parseFloat(this.tmpformData.discount_amount));


      this.formData.amount += (this.add_list[index].mrp)*parseFloat(this.add_list[index].totalQty);


      this.formData.discount_amount += (parseFloat(this.add_list[index].totalQty) * parseFloat(this.add_list[index].mrp)) * (parseFloat(this.add_list[index].discount) / 100);

      this.formData.gst_amount = (parseFloat(this.formData.amount) - parseFloat(this.formData.discount_amount)) * (parseFloat('18') / 100);
      this.formData.gst_amount=(this.formData.gst_amount.toFixed(2))


      this.formData.final_amount = (parseFloat(this.formData.amount) - parseFloat(this.formData.discount_amount)) + (parseFloat(this.formData.gst_amount));
      this.formData.final_amount=(this.formData.final_amount.toFixed(2))


    }
    // this.spare_list_array.push({'amount': this.tmpformData.amount,'discount': this.tmpformData.discount,'mrp': this.tmpformData.mrp,'part_name': this.tmpformData.part_name,'totalQty': this.tmpformData.totalQty, 'final_amount': this.tmpformData.final_amount,'discount_amount': this.tmpformData.discount_amount ,'part_no': this.tmpformData.part_no ,'part_id': this.tmpformData.part_id });

    // this.tmpformData.part_id
    // console.log(this.spare_list_array);
    console.log(this.tmpformData.part_id);


    let index = this.spare_list.findIndex(d => d.part_id == this.tmpformData.part_id);
    console.log(index);
    if (index!=-1) {

      this.spare_list.splice(index, 1);
      console.log(this.spare_list);
    }

    this.tmpformData.totalQty='';
    this.tmpformData.mrp='';
    this.tmpformData.discount='';
    this.tmpformData.amount='';
    this.tmpformData.part_name='';


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
  partDetail(id){
    let index = this.spare_list.findIndex(d => d.part_id == id);
    if (index != -1) {
      this.tmpformData.totalQty = this.spare_list[index].totalQty;
      this.tmpformData.mrp = this.spare_list[index].mrp;
      this.tmpformData.part_name = this.spare_list[index].part_name;
      this.tmpformData.part_no = this.spare_list[index].part_no;
      this.tmpformData.part_id = this.spare_list[index].part_id;
      this.tmpformData.discount=0;
      this.tmpformData.amount=this.tmpformData.mrp*this.tmpformData.totalQty- this.tmpformData.discount

      // this.tmpformData.totalQty = this.spare_list[index].totalQty;
    }
  }


  calculate(amount){
    console.log(amount);
    this.formData.subtotal=parseInt(amount)
    this.formData.subtotal=this.formData.subtotal-this.formData.discount_amount
    this.formData.gst_amount=this.formData.subtotal*18/100
    this.formData.gst_amount= (this.formData.gst_amount).toFixed(2)
    this.formData.final_amount=parseInt(this.formData.subtotal)+parseInt(this.formData.gst_amount)
  }

  max() {
    if (parseInt(this.formData.discount_amount) > parseInt(this.formData.amount)) {
      this.serve.errorToast('Discount Should Be Less Then MRP');
      this.formData.discount_amount ='';
    }
  }

  calculation(){

    if (this.tmpformData.discount=='') {
      this.tmpformData.discount=0;
    }

    this.tmpformData.amount = (parseFloat(this.tmpformData.mrp)*parseInt(this.tmpformData.totalQty));

    this.tmpformData.total = (parseFloat(this.tmpformData.mrp)*parseInt(this.tmpformData.totalQty))-(((parseFloat(this.tmpformData.mrp)*parseInt(this.tmpformData.totalQty))/100)*this.tmpformData.discount);

    this.tmpformData.discount_amount = (parseFloat(this.tmpformData.mrp)*parseInt(this.tmpformData.totalQty))* (parseFloat(this.tmpformData.discount) / 100);
    console.log(this.tmpformData.discount_amount )

    this.tmpformData.final_amount = (parseFloat(this.tmpformData.mrp)*parseInt(this.tmpformData.totalQty)) - (parseFloat(this.tmpformData.discount_amount));

    // console.log( this.tmpformData.discount);
    // console.log( this.tmpformData.amount);
    if(parseInt(this.tmpformData.discount)>100){
      this.serve.errorToast('Discount Should Not Be Greater Then 100%');
      this.tmpformData.discount=0;
    }
  }
}
