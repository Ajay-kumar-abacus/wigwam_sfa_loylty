import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, LoadingController, AlertController, Loading, Alert } from 'ionic-angular';
import { Camera ,CameraOptions} from '@ionic-native/camera';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { TabsPage } from '../../tabs/tabs';
import { MediaCapture, CaptureVideoOptions, MediaFile } from '@ionic-native/media-capture';
import { FileTransfer, FileUploadOptions,FileTransferObject } from '@ionic-native/file-transfer';
import { Diagnostic } from '@ionic-native/diagnostic';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { DomSanitizer } from '@angular/platform-browser';
import { PointLocationPage } from '../../point-location/point-location';
import { MyserviceProvider } from '../../../providers/myservice/myservice';
import { InstallationListPage } from '../installation-list/installation-list';

/**
 * Generated class for the AddInstallationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-installation',
  templateUrl: 'add-installation.html',
})
export class AddInstallationPage {

  districtList:any=[];
  stateList:any=[];
  form:any={}
  savingFlag: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,public actionSheetController: ActionSheetController, private camera: Camera ,public service:DbserviceProvider,public serve : MyserviceProvider ,public loadingCtrl:LoadingController , public alertCtrl:AlertController, private mediaCapture: MediaCapture , public diagnostic  : Diagnostic, public androidPermissions: AndroidPermissions,public dom:DomSanitizer) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddInstallationPage');
  }

  get_district(state) {
    this.serve.addData({ "state_name":state }, "AppCustomerNetwork/getDistrict")
    .then(resp => {
        if(resp['statusCode'] == 200){
            this.districtList = resp['district_list'];    
        }else{
            this.serve.errorToast(resp['statusMsg']);
        }
    },
    err => {
        this.serve.errorToast('Something Went Wrong!')
    })
}

get_states() {
  // this.serve.presentLoading()
  this.serve.addData({}, "AppCustomerNetwork/getWorkingStates")
    .then(resp => {
      if (resp['statusCode'] == 200) {
        this.serve.dismissLoading()
        this.stateList = resp['state_list'];
      } else {
        this.serve.dismissLoading()
        this.serve.errorToast(resp['statusMsg']);
      }
    }, error => {
      this.serve.Error_msg(error);
      this.serve.dismiss();
    })
}
  saveComplaint() {
    this.savingFlag = true;
    if (!this.form.id) {
      if (!this.form.assign_dr_id) {
        this.serve.errorToast('Please Select Distributor!')
      }
    }
    this.form.type_id = 3;
    this.serve.addData({ "data": this.form }, "AppCustomerNetwork/addDealer")
      .then(resp => {
        if (resp['statusCode'] == 200) {
          this.savingFlag = false;
          this.serve.successToast(resp['statusMsg']);
          this.navCtrl.popTo(InstallationListPage);

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
