import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ActionSheetController, AlertController, ToastController, ModalController } from 'ionic-angular';
import * as moment from 'moment/moment';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ExpenseListPage } from '../expense-list/expense-list';
import { AttendenceserviceProvider } from '../../providers/attendenceservice/attendenceservice';
import { ConstantProvider } from '../../providers/constant/constant';
import { NgForm } from '@angular/forms';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';
import { Device } from '@ionic-native/device';
import { Diagnostic } from '@ionic-native/diagnostic';
import { CameraModalPage } from '../camera-modal/camera-modal';

declare let cordova: any;

@IonicPage()
@Component({
  selector: 'page-expense-add-new',
  templateUrl: 'expense-add-new.html',
})
export class ExpenseAddNewPage {
  item: any = [];
  expense: any = {};
  formData = new FormData();
  travelForm: any = {};
  travelInfo: any = [];
  hotelForm: any = {};
  hotelInfo: any = [];
  foodForm: any = {};
  foodInfo: any = [];
  localConvForm: any = {};
  localConvForm1: any = {};
  localConvForm1Data: any = {};
  Submit_button: boolean = false
  spinnerLoader: boolean = false
  localConvInfo: any = [];
  miscExpForm: any = {};
  miscExpInfo: any = [];
  allowanceData: any = {};
  allowancecar: any = [];
  allowancebike: any = [];
  show_amount_input: any = true
  roleId: any = ''
  expand_local: any = false;
  expand_travel: any = false;
  expand_food: any = false;
  expand_hotel: any = false;
  expand_misc: any = false;
  today_date = new Date().toISOString().slice(0, 10);
  form: any;
  hotelamount: any = [];
  allowancehotelamount: any = [];
  foodamount: any = [];
  allowancefoodamount: any = [];
  localamount: any = [];
  localamount1: any = [];
  allowanceta: any = [];
  user_data: any;
  km: any = [];
  city_list: any = [];
  search: any;
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public Device:Device,
    public navParams: NavParams,
    public diagnostic: Diagnostic,
    public attendence_serv: AttendenceserviceProvider,
    public imagePicker: ImagePicker,
    public serve: MyserviceProvider,
    public events: Events,
    public storage: Storage,
    private camera: Camera,
    public toastCtrl: ToastController,
    public actionSheetController: ActionSheetController,
    public alertCtrl: AlertController,
    public device: Device,
    public constant: ConstantProvider) {
      this.getCityList('')
    this.expense.expType = 'Outstation Travel';
    this.expense.totalAmt = 0;

    this.storage.get('role_id').then((roleId) => {
      if (typeof (roleId) !== 'undefined' && roleId) {
        this.roleId = roleId;
      }
    });

    this.storage.get('displayName').then((displayName) => {
      if (typeof (displayName) !== 'undefined' && displayName) {
        this.expense.userName = displayName;
      }
    });

    setTimeout(() => {
      this.getallowanceData();
    }, 500);
    if (this.navParams.get('data')) {
      this.expense = this.navParams.get('data');
      this.expense.expType = this.expense.expenseType;

      if (this.expense.expType == 'Outstation Travel') {
        this.image_data = []




      }
    }


  }


  getallowanceData() {
    this.expense.expType = 'Outstation Travel';
    this.serve.presentLoading();
    this.serve.addData({ 'roleId': this.roleId }, 'AppExpense/travelMode').then((result) => {
      if (result['statusCode'] == 200) {
        this.serve.dismissLoading();
        this.allowanceData = result['expense'];
        this.localConvForm.modeOfTravel = 'Public Vehicle'
      } else {
        this.serve.dismissLoading();
        this.serve.errorToast(result['statusMsg'])
      }
    }, error => {
      this.serve.Error_msg(error);
      this.serve.dismissLoading();
    })
  }


  blankValue() {
    this.travelForm.travelClass = '';
    this.travelForm.distance = '';
    this.travelForm.travelAmount = '';
    this.travelForm.remark = '';
    this.travelForm.locationfrom = '';
    this.travelForm.locationto = '';
    this.travelForm.city='';


  }
  blankClassValue() {
    this.travelForm.distance = '';
    this.travelForm.travelAmount = '';
  }

  blankValueLocalConveyance() {
    this.localConvForm1.travelClass = '';
    this.localConvForm1.date = '';
    this.localConvForm1.distance = '';
    this.localConvForm1.amount = '';

    this.localConvForm.travelClass = '';
    this.localConvForm.date = '';
    this.localConvForm.distance = '';
    this.localConvForm.amount = '';
  }
  blankClassValueLocalConveyance() {
    this.localConvForm1.distance = '';
    this.localConvForm1.amount = '';
    // this.localConvForm.distance = '';
    this.localConvForm.amount = '';
  }

  calculateTravelAmount3() {
    if (this.localConvForm1.travelClass == 'Car') {
      this.show_amount_input = true
      this.allowancecar = parseInt(this.allowanceData.car);
      this.localamount = parseInt(this.localConvForm1.amount);
      this.localConvForm1.caramount = this.allowanceData.car
      this.localConvForm1.bikeamount = this.allowanceData.bike
      this.localConvForm1.amount = parseInt(this.localConvForm1.distance) * parseFloat(this.allowanceData.car);
    } else if (this.localConvForm1.travelClass == 'Bike') {
      this.show_amount_input = true
      this.allowancebike = parseInt(this.allowanceData.bike);
      this.localConvForm1.amount = parseInt(this.localConvForm1.distance) * parseFloat(this.allowanceData.bike);
      this.localamount1 = parseInt(this.localConvForm1.amount);
    }
    else if (this.localConvForm.travelClass == 'Car') {
      this.show_amount_input = true
      this.allowancecar = parseInt(this.allowanceData.car);
      this.localConvForm.amount = parseInt(this.localConvForm.distance) * parseFloat(this.allowanceData.car);
    } else if (this.localConvForm.travelClass == 'Bike') {
      this.show_amount_input = true
      this.allowancebike = parseInt(this.allowanceData.bike);
      this.localConvForm.amount = parseInt(this.localConvForm.distance) * parseFloat(this.allowanceData.bike);
    } else if (this.travelForm.travelMode == 'Car' && this.travelForm.arrivalDistance) {
      this.show_amount_input = true
      this.allowancecar = parseInt(this.allowanceData.car);
      this.localConvForm1.caramount = this.allowanceData.car
      this.travelForm.arrivalAmount = parseInt(this.travelForm.arrivalDistance) * parseFloat(this.allowanceData.car);
    } else if (this.travelForm.travelMode == 'Car' && this.travelForm.depatureDistance) {
      this.show_amount_input = true
      this.allowancecar = parseInt(this.allowanceData.car);
      this.localConvForm1.caramount = this.allowanceData.car
      this.travelForm.depatureAmount = parseInt(this.travelForm.depatureDistance) * parseFloat(this.allowanceData.car);
    }
    else {
      this.show_amount_input = false
      this.allowanceta = parseInt(this.allowanceData.ta);
      this.local = parseInt(this.localConvForm1.amount);
    }
  }
  CheckAllowance() {
    console.log("hyy");
  
    const validateAllowance = (allowanceType, allowanceValue) => {
      if (this.travelForm.travelAmount > allowanceValue) {
        this.serve.errorToast(
          `${this.travelForm.travelClass} amount can't be greater than ${allowanceValue}`
        );
        this.travelForm.travelAmount = '';
        return true;
      }
      return false;
    };
  
    const { travelClass, travelAmount, city } = this.travelForm;
    const { cityType } = city;
    const allowanceData = this.allowanceData;
  
    if (travelClass == 'Logding') {
      if (
        (cityType == 'Other' && validateAllowance('LogdingAllowance', allowanceData.LoadgingAllowance)) ||
        (cityType == 'Metro' && validateAllowance('LogdingAllowanceMetro', allowanceData.LoadgingAllowanceMetro)) ||
        (cityType == 'Aclass' && validateAllowance('LogdingAllowanceAclass', allowanceData.LoadgingAllowanceAclass))
      ) {
        return;
      }
    }
  
    if (travelClass == 'Boarding') {
      if (
        (cityType == 'Other' && validateAllowance('BoardingAllowance', allowanceData.BoardingAllowance)) ||
        (cityType == 'Metro' && validateAllowance('BoardingAllowanceMetro', allowanceData.BoardingAllowanceMetro)) ||
        (cityType == 'Aclass' && validateAllowance('BoardingAllowanceAclass', allowanceData.BoardingAllowanceAclass))
      ) {
        return;
      }
    }
  
    if (travelClass == 'Miscellaneous') {
      if (
        (cityType == 'Other' && validateAllowance('OOPAllowance', allowanceData.OOPAllowance)) ||
        (cityType == 'Metro' && validateAllowance('OOPAllowanceMetro', allowanceData.OOPAllowanceMetro)) ||
        (cityType == 'Aclass' && validateAllowance('OOPAllowanceAclass', allowanceData.OOPAllowanceAclass))
      ) {
        return;
      }
    }
  }
  

  calculateTravelAmount2() {
    if (this.travelForm.travelClass == 'Car') {
      this.show_amount_input = true
      this.allowancecar = parseInt(this.allowanceData.car);
      this.localamount = parseInt(this.travelForm.amount);
      this.travelForm.caramount = this.allowanceData.car
      this.travelForm.bikeamount = this.allowanceData.bike
      this.travelForm.travelAmount = parseInt(this.travelForm.distance) * parseFloat(this.allowanceData.car);
    } else if (this.travelForm.travelClass == 'Bike') {
      this.show_amount_input = true
      this.allowancebike = parseInt(this.allowanceData.bike);
      this.travelForm.travelAmount = parseInt(this.travelForm.distance) * parseFloat(this.allowanceData.bike);
      this.localamount1 = parseInt(this.travelForm.travelAmount);
    }
    else {
      this.show_amount_input = false
      this.allowanceta = parseInt(this.allowanceData.ta);
      this.local = parseInt(this.travelForm.travelAmount);
    }
  }



  // addToList() {

  //   if (!this.travelForm.travelClass) {
  //     this.serve.errorToast('Select mode of travelling first')
  //     return
  //   }
  //   if ((this.travelForm.travelClass == 'Bike' || this.travelForm.travelClass == 'Car') && !this.travelForm.distance) {
  //     this.serve.errorToast('Enter distance(kM) ')
  //     return
  //   }
  //   if (!this.travelForm.travelAmount) {
  //     this.serve.errorToast('Enter amount')
  //     return
  //   }
  //   if (parseFloat(this.travelForm.travelAmount) <= 0) {
  //     this.serve.errorToast('Enter amount cannot be 0')
  //     return
  //   }


  //   if (this.item.length > 0) {
  //     let existIndex
  //     existIndex = this.item.findIndex(row => row.modeOfTravel == this.travelForm.travelClass);
  //     if (existIndex != -1) {
  //       this.serve.errorToast(this.travelForm.travelClass + " mode of traveling is already added")
  //       return
  //       // this.item[existIndex]['amount'] += parseFloat(this.travelForm.travelAmount);
  //       // this.blankValue();
  //     }
  //     else {
  //       this.item.push({ 'modeOfTravel': this.travelForm.travelClass, 'remark': this.travelForm.remark, 'amount': parseFloat(this.travelForm.travelAmount), 'distance': this.travelForm.distance ? this.travelForm.distance : '0' })
  //       console.log(this.item, 'item array value');

  //       this.blankValue();
  //     }
  //   }
  //   else {
  //     this.item.push({ 'modeOfTravel': this.travelForm.travelClass, 'remark': this.travelForm.remark, 'amount': parseFloat(this.travelForm.travelAmount), 'distance': this.travelForm.distance ? this.travelForm.distance : '0' })
  //     this.blankValue();
  //   }
  //   this.expense.totalAmt = 0
  //   for (let i = 0; i < this.item.length; i++) {
  //     this.expense.totalAmt += parseInt(this.item[i]['amount']);
  //   }
  //  getCityList}
  getCityList(search) {
    // this.search=search
    console.log(search)
    this.serve.addData({'search':search}, 'AppExpense/get_cross_City_list').then((result) => {
      if (result['statusCode'] == 200) {
        this.city_list = result['city'];
      } else {
        this.serve.errorToast(result['statusMsg']);
      }

    }, err => {

    });
  }
  addToList() {
    if (!this.travelForm.travelClass) {
        this.serve.errorToast('Select Expense type first');
        return;
    }

    if ((this.travelForm.locationfrom === this.travelForm.locationto)&&(  this.travelForm.travelClass == 'Tolltax' || this.travelForm.travelClass == 'Taxi'|| this.travelForm.travelClass == 'Bus'|| this.travelForm.travelClass == 'Train' || this.travelForm.travelClass == 'Flight')) {
      this.serve.presentToast('Location From and Location To cannot be the same');
      return;
    }
    if ((this.travelForm.travelClass == 'Bike' || this.travelForm.travelClass == 'Car') && !this.travelForm.distance) {
        this.serve.errorToast('Enter distance(kM)');
        return;
    }
    if (!this.travelForm.travelAmount) {
        this.serve.errorToast('Enter amount');
        return;
    }
    if (!this.travelForm.city && this.travelForm.travelClass == 'Auto') {
      this.serve.errorToast('Enter City');
      return;
  }
   
    if (parseFloat(this.travelForm.travelAmount) <= 0) {
        this.serve.errorToast('Enter amount cannot be 0');
        return;
    }

    // Check if the selected travel class requires document upload
    const isDocumentRequired = ['Flight', 'Train', 'Bus', 'Taxi','Auto','Logding','Boarding','Tolltax','Miscellaneous'].includes(this.travelForm.travelClass);

    // Filter image_data based on the current travel class
    const currentImageData = this.image_data.filter(image => image.travelClass === this.travelForm.travelClass);

    if (isDocumentRequired && currentImageData.length === 0) {
        this.serve.errorToast('Upload document for ' + this.travelForm.travelClass + ' mode of traveling');
        return;
    }

    if (this.item.length > 0) {
        let existIndex = this.item.findIndex(row => row.modeOfTravel == this.travelForm.travelClass);
        if (existIndex != -1) {
            this.serve.errorToast(this.travelForm.travelClass + " mode of traveling is already added");
            return;
        } else {
            this.item.push({
                'modeOfTravel': this.travelForm.travelClass,
                'remark': this.travelForm.remark,
                'loactionfrom':this.travelForm.locationfrom,
                'locationto': this.travelForm.locationto,
                'city': this.travelForm.city,
                'amount': parseFloat(this.travelForm.travelAmount),
                'distance': this.travelForm.distance ? this.travelForm.distance : '0',
                'imageData': currentImageData
            });
            console.log(this.item, 'item array value');
            this.blankValue();
        }
    } else {
        this.item.push({
            'modeOfTravel': this.travelForm.travelClass,
            'remark': this.travelForm.remark,
            'loactionfrom':this.travelForm.locationfrom,
            'locationto': this.travelForm.locationto,
            'city': this.travelForm.city,
            'amount': parseFloat(this.travelForm.travelAmount),
            'distance': this.travelForm.distance ? this.travelForm.distance : '0',
            'imageData': currentImageData
        });
        this.blankValue();
    }
    this.expense.totalAmt = 0;
    for (let i = 0; i < this.item.length; i++) {
        this.expense.totalAmt += parseInt(this.item[i]['amount']);
    }
}



  listdelete(i) {
    this.expense.totalAmt = 0;
    this.item.splice(i, 1);
    for (let i = 0; i < this.item.length; i++) {
      this.expense.totalAmt += parseInt(this.item[i]['amount']);
    }
  }





  local: any = [];



  videoId: any;
  flag_upload = true;
  flag_play = true;
  image: any = '';
  image_data: any = [];

  fileChange(img) {
    this.image_data.push(img);
    this.image = '';
  }

  // remove_image(i: any) {
  //   this.image_data.splice(i, 1);
  // }
  remove_image(index: number, travelClass: string) {
    // Assuming this.image_data is an array of objects with 'image' and 'travelClass' properties
    this.image_data.splice(index, 1);
  
    // Update any other logic related to the removal of images
  
    // Optional: If needed, you can update the 'item' array to remove the image associated with the removed travelClass
    const itemIndex = this.item.findIndex(item => item.modeOfTravel === travelClass);
    if (itemIndex !== -1) {
      this.item[itemIndex].imageData = this.item[itemIndex].imageData.filter(img => img.travelClass !== travelClass);
    }
  }
  
  showLimit() {
    console.log('Image Data', this.image_data)
    let alert = this.alertCtrl.create({
      title: 'Alert',
      subTitle: "You can upload only 5 bill images",
      cssClass: 'alert-modal',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: () => {

        }
      }
      ]
    });
    alert.present();
  }
  
  submitExpense() {

    if (this.item < 0) {
      this.serve.presentToast('Add at least one mode of travle');
      return;
    }
    // if (this.travelForm.locationfrom === this.travelForm.locationto) {
    //   this.serve.presentToast('Location From and Location To cannot be the same');
    //   return;
    // }
    // if (this.expense.expType == 'Local Conveyance') {
    //   this.spinnerLoader = true
    //   this.Submit_button = true
    //   this.expense.billImage = this.image_data;
    //   this.expense.localConv1 = this.localConvForm1;
    //   this.expense.date_from = this.localConvForm1.date;
    //   this.expense.date_to = this.localConvForm1.date_to;
    //   this.expense.localConvAmt1 = this.localConvForm1.amount;
    //   this.expense.localConvfoodAmt1 = this.localConvForm1.food_expense_amount || '0';
    //   this.expense.miscellaneousDetail = this.localConvForm1.miscellaneous_detail;
    //   this.expense.miscellaneousAmount = this.localConvForm1.miscellaneous_amount || '0';
    //   this.expense.totalAmt = Number(this.localConvForm1.amount) + Number(this.expense.localConvfoodAmt1) + Number(this.expense.miscellaneousAmount);
    // } else if (this.expense.expType == 'Outstation Travel') {
    //   this.spinnerLoader = true
    //   this.Submit_button = true
    //   this.expense.billImage = this.image_data;
    //   this.expense.travel = this.travelInfo;
    //   this.expense.hotel = this.hotelInfo;
    //   this.expense.food = this.foodInfo;
    //   this.expense.localConv = this.localConvInfo;
    //   this.expense.miscExp = this.miscExpInfo;
    // }


    this.spinnerLoader = true
    this.Submit_button = true;
    this.expense.modeItem = this.item
    this.serve.addData({ 'expenseData': this.expense}, 'AppExpense/submitExpense').then((result) => {
      if (result['statusCode'] == 200) {
        this.spinnerLoader = false
        this.Submit_button = false
        this.serve.successToast(result['statusMsg'])
        this.navCtrl.popTo(ExpenseListPage);
      } else {
        this.spinnerLoader = false
        this.Submit_button = false
        this.serve.errorToast(result['statusMsg']);
      }
    }, error => {
      this.Submit_button = false;
      this.spinnerLoader = false;
      this.navCtrl.popTo(ExpenseListPage);
      this.serve.Error_msg(error);
      // this.serve.dismiss();
    });
  }



  captureMediaMultiple(event) {
    console.log(event);
    let files = event.target.files;
    console.log(files)
    if (files) {
      for (let file of files) {
        console.log("in for");
        let reader = new FileReader();
        console.log(this.image_data);

        reader.onload = (e: any) => {
          this.image_data.push(e.target.result);
          console.log(this.image_data);
        }
        reader.readAsDataURL(file);
      }
    }


  }

  caputureUsingImagePicker() {
    const options: ImagePickerOptions = {
      maximumImagesCount: 6,
      quality: 100,
      outputType: 1,
      width: 600,
      height: 600
    }
    this.imagePicker.requestReadPermission().then((result) => {
      if (result == false) {
        this.imagePicker.requestReadPermission();
      } else {
        this.imagePicker.getPictures(options).then((results) => {
          for (var i = 0; i < results.length; i++) {
            this.image = 'data:image/jpeg;base64,' + results[i];
            if (this.image) {
              this.fileChange(this.image);
            }
          }
        }, (err) => {
          console.log(err);
          this.serve.errorToast(err);
        });
      }
    })

  }

  // captureMedia() {
  //   let actionsheet = this.actionSheetController.create({
  //     title: "Upload Image",
  //     cssClass: 'cs-actionsheet',

  //     buttons: [
  //       {
  //         cssClass: 'sheet-m1',
  //         text: 'Gallery',
  //         icon: 'image',
  //         handler: () => {
  //           this.getImage();
  //         }
  //       },
  //       {
  //         cssClass: 'cs-cancel',
  //         text: 'Cancel',
  //         role: 'cancel',
  //         icon: 'cancel',
  //         handler: () => {

  //         }
  //       }
  //     ]
  //   });
  //   actionsheet.present();
  // }
  captureMedia() {
    let actionsheet = this.actionSheetController.create({
      title: "Upload Image",
      cssClass: 'cs-actionsheet',
      buttons: [{
        cssClass: 'sheet-m',
        text: 'Camera',
        icon: 'camera',
        handler: () => {
          // this.takePhoto();
          this.cameraModal('camera');
        }
      },
      {
        cssClass: 'sheet-m1',
        text: 'Gallery',
        icon: 'image',
        handler: () => {
          this.getImage();
        }
      },
      {
        cssClass: 'cs-cancel',
        text: 'Cancel',
        role: 'cancel',
        icon: 'cancel',
        handler: () => {

        }
      }
      ]
    });
    actionsheet.present();
  }
  // takePhoto() {
  //   console.log('in take photo', this.image_data)
  //   const options: CameraOptions = {
  //     quality: 100,
  //     destinationType: this.camera.DestinationType.DATA_URL,
  //     targetWidth: 500,
  //     targetHeight: 400

  //   }
  //   // this.service.dismiss();
  //   if(this.Device.platform=='Android'){
      //   cordova.plugins.foregroundService.start('Camera', 'is running');
      // }
  //   this.camera.getPicture(options).then((imageData) => {
  //     this.image = 'data:image/jpeg;base64,' + imageData;
  //     if(this.Device.platform=='Android'){
      // cordova.plugins.foregroundService.stop();
      // }

  //     if (this.image) {
  //       this.fileChange(this.image);
  //     }
  //   }, (err) => {
  //   });
  // }

  cameraModal(type) {
    let modal = this.modalCtrl.create(CameraModalPage,{'type':type});

    modal.onDidDismiss(data => {
     
      if (data != undefined && data != null) {  
        this.image = data
        if (this.image) {
          // Assuming this.image_data is an array of objects with a 'travelClass' property
          this.fileChange({ image: this.image, travelClass: this.travelForm.travelClass });
      }
    }
    
    
      
    });

    modal.present();
  }
  takePhoto() {
    this.diagnostic.requestCameraAuthorization().then((isAvailable: any) => {
    console.log('in take photo', this.image_data);
    const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        // targetWidth: 700,
        // targetHeight: 600
    };

    if(this.Device.platform=='Android'){
        cordova.plugins.foregroundService.start('Camera', 'is running');
      }
    this.camera.getPicture(options).then((imageData) => {
        this.image = 'data:image/jpeg;base64,' + imageData;
        if(this.Device.platform=='Android'){
      cordova.plugins.foregroundService.stop();
      }

        if (this.image) {
            // Assuming this.image_data is an array of objects with a 'travelClass' property
            this.fileChange({ image: this.image, travelClass: this.travelForm.travelClass });
        }
    }, (err) => {
        // Handle error
        if(this.Device.platform=='Android'){
          cordova.plugins.foregroundService.stop();
        }
    });
  }).catch((error: any) => {
    if(this.Device.platform=='Android'){
      cordova.plugins.foregroundService.stop();
    }
   
  });
}


  // getImage() {
  //   const options: CameraOptions =
  //   {
  //     quality: 100,
  //     destinationType: this.camera.DestinationType.DATA_URL,
  //     mediaType: this.camera.MediaType.PICTURE,
  //     sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
  //     saveToPhotoAlbum: false,
  //     cameraDirection: 1,
  //     correctOrientation: true,
  //   }
  //   if(this.Device.platform=='Android'){
      //   cordova.plugins.foregroundService.start('Camera', 'is running');
      // }
  //   this.camera.getPicture(options).then((imageData) => {
  //     this.image = 'data:image/jpeg;base64,' + imageData;
  //     if(this.Device.platform=='Android'){
      // cordova.plugins.foregroundService.stop();
      // }
  //     if (this.image) {
  //       this.fileChange(this.image);
  //     }
  //   }, (err) => {
  //   });




  // }
  getImage() {
    this.diagnostic.requestCameraAuthorization().then((isAvailable: any) => {
    const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        mediaType: this.camera.MediaType.PICTURE,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        saveToPhotoAlbum: false,
        cameraDirection: 1,
        correctOrientation: true,
    };

    if(this.Device.platform=='Android'){
        cordova.plugins.foregroundService.start('Camera', 'is running');
      }
    this.camera.getPicture(options).then((imageData) => {
        this.image = 'data:image/jpeg;base64,' + imageData;
        if(this.Device.platform=='Android'){
      cordova.plugins.foregroundService.stop();
      }
        if (this.image) {
            // Assuming this.image_data is an array of objects with a 'travelClass' property
            this.fileChange({ image: this.image, travelClass: this.travelForm.travelClass });
        }
    }, (err) => {
        // Handle error
        if(this.Device.platform=='Android'){
          cordova.plugins.foregroundService.stop();
        }
    });
  }).catch((error: any) => {
    if(this.Device.platform=='Android'){
      cordova.plugins.foregroundService.stop();
    }
   
  });
}


  submitNewExpense() {
    let alert = this.alertCtrl.create({
      title: 'Save Expense',
      message: 'Do you want to Save this Expense?',
      cssClass: 'alert-modal',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {


          }
        },
        {
          text: 'Yes',
          handler: () => {
            if (!this.expense.claimDate && this.expense.expType == 'Outstation Travel') {
              this.serve.errorToast('Claim Date Is Required');
              return;
            }

            if (this.miscExpForm.amount == undefined || this.miscExpForm.amount == '') {
              this.miscExpForm.amount = 0;
            }

            this.expense.totalAmt += parseInt(this.miscExpForm.amount);
            this.submitExpense()
          }
        }

      ]
    });
    alert.present();
  }

  getYesterday() {
    // let newDate = new Date();
    // newDate.setDate(newDate.getDate() - 1);
    // return newDate.toISOString().slice(0, 10);

    let newDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
    return newDate;

    // shortcut
    //  var yesterday = new Date(Date.now() - 864e5); // 864e5 == 86400000 == 24*60*60*1000
    //  console.log(yesterday);
    // return yesterday.toISOString().slice(0, 10)
  }
  getLastMonthDate() {
    let sixtyDaysBackDate = moment().subtract(40, 'days').format('YYYY-MM-DD');
    return sixtyDaysBackDate;
}
}
