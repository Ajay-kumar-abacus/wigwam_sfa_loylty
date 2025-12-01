import { Component, ViewChild } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ActionSheetController, AlertController, IonicPage, ModalController, Navbar, NavController, NavParams, ToastController } from 'ionic-angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { ConstantProvider } from '../../providers/constant/constant';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { LoyaltyPurchaseListPage } from '../loyalty-purchase-list/loyalty-purchase-list';
import { RegistrationPage } from '../login-section/registration/registration';
import { Storage } from '@ionic/storage';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Device } from '@ionic-native/device';
import { LoyaltyDraftPurchasePage } from '../loyalty-draft-purchase/loyalty-draft-purchase';
import { CameraModalPage } from '../camera-modal/camera-modal';

declare let cordova:any;


/**
* Generated class for the LoyaltyAddPurchasePage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-loyalty-add-purchase',
  templateUrl: 'loyalty-add-purchase.html',
})
export class LoyaltyAddPurchasePage {
  @ViewChild('distributorSelectable') distributorSelectable: IonicSelectableComponent;
  @ViewChild(Navbar) navBar: Navbar;
  data: any = {};
  cityList: any = [];
  influcencersList: any = [];
  contractorList: any = [];

  ItemList:any=[];
  add_list: any = [];
  planDate: any;
  spinner: boolean = false
  userId:any;
  pageName:any;
  productData: any = {};

  filter:any={};
  image: any = '';
  image_data: any = [];
  addToListButton: boolean = false;

  date_from:any;
  part:any=[];
  catList:any=[];
  brandList:any=[];
  thicknessList:any=[];

  type:any;
  against_type:any;
  mode:any='';
  uploadurl: any
  sizeList:any=[];
  dr_id:any;
  inventoryMaxqty:number

  
  already_exsist : boolean = false;
  cartAdded : boolean = false;

  saveFlag : boolean = false;
  today_date = new Date().toISOString()
  max_date = new Date().getFullYear() + 1;
  cartData:any={};
  user_data:any={};
  purchaseCartId: any = '';
  total_qty:number
  earn_point:number;
  divison_name:any={};
  siteImages:any=[];
  influencers_data:any={};
  percentage: number;



 
  constructor(public navCtrl: NavController,public modalCtrl: ModalController,public storage: Storage,public diagnostic: Diagnostic,private camera:Camera, public navParams: NavParams, public serve: MyserviceProvider,public actionSheetController: ActionSheetController,public constant: ConstantProvider
    ,public alertCtrl: AlertController,public toastCtrl: ToastController,public Device:Device) {
    this.uploadurl = constant.influencer_doc;
    this.userId=this.navParams.get("userId");
    this.influencers_data=this.navParams.get("data");

      this.cartData.qty=0;
     
      this.getnetworklist('',this.influencers_data);
      // this.getBrands();
      if(this.constant.UserLoggedInData.loggedInUserType!='Other'){
        this.influencers_data.division_name=this.influencers_data.working_division
      this.getnetworklist('',this.influencers_data);
      this.getContractorlist('')
    
      }
      this.membershipCheckFlag()
    }
    
    ionViewDidLoad() {
    }
  
    ionViewDidEnter(){
      this.navBar.backButtonClick = () => {
        this.backAction()
    };
    }
    
  
    
    categoryList() {
      this.serve.addData({},  'RetailerRequest/category_list').then((result) => {
        if(result['statusCode']==200){
          this.catList = result['category_list'];
          
        }else{
          this.serve.dismissLoading();
          this.serve.errorToast(result['statusMsg'])
        }
      }, err => {
        this.serve.dismissLoading();
        this.serve.errorToast('Something went wrong')
      });
    }

    brandlist(product_id) {
      this.serve.addData({'product_id': product_id.id},  'RetailerRequest/get_brand').then((result) => {
        if(result['statusCode']==200){
          this.brandList = result['brand_list'];
          
        }else{
          this.serve.dismissLoading();
          this.serve.errorToast(result['statusMsg'])
        }
      }, err => {
        this.serve.dismissLoading();
        this.serve.errorToast('Something went wrong')
      });
    }


   

    
    
    productItems(cat_id) {
      this.data.item_name='';
      this.serve.addData({'filter':{'category_id':cat_id}},  'RetailerRequest/product_list').then((result) => {
        if(result['statusCode']==200){
          this.ItemList = result['product_list'];

          for(let i = 0 ;i<this.ItemList.length;i++){
            if(this.ItemList[i].product_name!=""||this.ItemList[i].product_code!=""){
              this.ItemList[i].product_name=this.ItemList[i].product_name+'-'+'('+this.ItemList[i].product_code+')'
            }
          }
          
        }else{
          this.serve.dismissLoading();
          this.serve.errorToast(result['statusMsg'])
        }
      }, err => {
        this.serve.dismissLoading();
        this.serve.errorToast('Something went wrong')
      });
    }

    getthickness(id){
      let index = this.ItemList.findIndex(row => row.id == id)
      if (index != -1) {
        // this.data.point_category_id = this.pointCategories_data[index].id;
        this.data.thickness = this.ItemList[index].thickness;
      }

    }

    getnetworklist(search,influencers_data) {
      this.serve.addData({'division_name':influencers_data.division_name,'search':search,'type':'1'},'AppInfluencerSignup/get_dealer_list').then((result) => {
        
        if(result['statusCode']==200){
          this.influcencersList = result['dealer'];

          for(let i = 0 ;i<this.influcencersList.length;i++){
            if(this.influcencersList[i].company_name==null){
              this.influcencersList[i].company_name='';
          }
          if(this.influcencersList[i].name==null){
              this.influcencersList[i].name='';
          }
          if(this.influcencersList[i].mobile==null){
              this.influcencersList[i].mobile='';
          }
        
            if(this.influcencersList[i].name!=""||this.influcencersList[i].mobile!=""){
              this.influcencersList[i].company_name=this.influcencersList[i].company_name+','+'('+this.influcencersList[i].name+'  '+this.influcencersList[i].mobile+'  '+this.influcencersList[i].division_name+')'
            }
            if(this.influcencersList[i].name==""&& this.influcencersList[i].mobile==""){
              this.influcencersList[i].company_name=this.influcencersList[i].company_name
            }

           
          }
          // if(this.mode){
          //   this.data.dealer_id=this.influcencersList.filter(row=>row.id == this.data.dealer_id)
          //   this.data.dealer_id=this.data.dealer_id[0];
          // }

          
        }else{
          this.serve.dismissLoading();
          this.serve.errorToast(result['statusMsg'])
        }
      }, err => {
        this.serve.dismissLoading();
        this.serve.errorToast('Something went wrong')
      });
    }

     getContractorlist(search) {
      this.serve.addData({'sales_id':this.userId,'search':search},'AppInfluencerSignup/influencer_list').then((result) => {
        
        if(result['statusCode']==200){
          this.contractorList = result['distributors'];

          for(let i = 0 ;i<this.contractorList.length;i++){
            if(this.contractorList[i].company_name==null){
              this.contractorList[i].company_name=''
          }
          if(this.contractorList[i].name==null){
              this.contractorList[i].name=''
          }
          if(this.contractorList[i].mobile==null){
              this.contractorList[i].mobile=''
          }
        
            if(this.contractorList[i].name!=""||this.contractorList[i].mobile!=""){
              this.contractorList[i].company_name=this.contractorList[i].company_name+','+'('+this.contractorList[i].name+'  '+this.contractorList[i].mobile+'  '+this.influcencersList[i].division_name+')'
            }
            if(this.contractorList[i].name==""&& this.contractorList[i].mobile==""){
              this.contractorList[i].company_name=this.contractorList[i].company_name
            }

           
          }
          // if(this.mode){
          //   this.data.dealer_id=this.influcencersList.filter(row=>row.id == this.data.dealer_id)
          //   this.data.dealer_id=this.data.dealer_id[0];
          // }

          
        }else{
          this.serve.dismissLoading();
          this.serve.errorToast(result['statusMsg'])
        }
      }, err => {
        this.serve.dismissLoading();
        this.serve.errorToast('Something went wrong')
      });
    }




  
    
    
    addToList() {
    
      this.cartData.brand=this.productData.brand_code
      
      if(this.add_list.length <=0){
        this.add_list.push(JSON.parse(JSON.stringify(this.cartData)))
        console.log(this.add_list)
        this.cartAdded=true
        this.cartData.qty=''
        this.cartData.brand='';
        this.cartData.thickness='';
        this.cartData.size='';
      }
      else{
        let isExistIndex:any;
        isExistIndex=this.add_list.findIndex(row=>row.product_id==this.cartData.product_id);
        if(isExistIndex == -1){
          this.add_list.push(JSON.parse(JSON.stringify(this.cartData)))
          this.cartAdded=true
          this.cartData.qty='';
          this.cartData.size='';
          this.cartData.brand='';
        this.cartData.thickness='';
        }
        else{

          const newqty =parseInt(this.add_list[isExistIndex].qty)+parseInt(this.cartData.qty)

          if(Number(newqty) > this.inventoryMaxqty){

         this.serve.errorToast("You Cannot add this item qty more than " +this.inventoryMaxqty );
          return
          }
         
            this.add_list[isExistIndex].qty= parseInt(this.add_list[isExistIndex].qty)+parseInt(this.cartData.qty)
          this.cartAdded=true

          this.cartData.qty='';
          this.cartData.size='';
          this.cartData.brand='';
          this.cartData.thickness='';
          this.already_exsist = true
        }


      }

      this.total_qty = this.add_list.reduce((total, item) => total + Number(item.qty), 0);
      this.earn_point = this.add_list.reduce((total, item) => total + Number(item.qty) * Number(item.influencer_point),0);


     
    }
    listdelete(index) {
      this.add_list.splice(index, 1);
      this.serve.errorToast("Deleted");
      this.total_qty = this.add_list.reduce((total, item) => total + Number(item.qty), 0);
      this.earn_point = this.add_list.reduce((total, item) => total + Number(item.qty) * Number(item.influencer_point),0);


     
      if(this.add_list.length==0){
        this.image_data=[];
      }
    }
    
    captureMedia(type) {
      let actionsheet = this.actionSheetController.create({
        title: "Upload Image",
        cssClass: 'cs-actionsheet',
        
        buttons: [{
          cssClass: 'sheet-m',
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            
            
            // this.takeDocPhoto();
              this.cameraModalSupport('camera');
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
          this.data.img_id = this.data.id;



            
          }
        }
      ]
    });
    actionsheet.present();
  }
  
  
  selImages:any=[];
  takeDocPhoto()
{

  this.diagnostic.requestCameraAuthorization().then((isAvailable: any) => {
      
      const options: CameraOptions = {
        quality: 75,
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth : 1050,
        targetHeight : 1000 
      }
      
      console.log(options);
    if(this.Device.platform=='Android'){
    cordova.plugins.foregroundService.start('Wigwam App', 'Camera Service');
    }
      this.camera.getPicture(options).then((imageData) => {        
        this.data.image = 'data:image/jpeg;base64,' + imageData;
        
        if(this.Device.platform=='Android'){
      cordova.plugins.foregroundService.stop();
      }

        this.selImages.push({"image":this.data.image});
        console.log(this.data, 'line number 309');
        
        this.data.image='';
      }, (err) => {
        if(this.Device.platform=='Android'){
      cordova.plugins.foregroundService.stop();
      }

      });
      
      
     
    }).catch((error: any) => {
   
    });
  
}
  getImage() {
    this.diagnostic.requestCameraAuthorization().then((isAvailable: any) => {
    const options: CameraOptions =
    {
      quality: 80,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false,
      cameraDirection: 1,
      correctOrientation: true
    }
    if(this.Device.platform=='Android'){

    cordova.plugins.foregroundService.start('Wigwam App', 'Camera Service');
    }
    this.camera.getPicture(options).then((imageData) => {
      this.data.image = 'data:image/jpeg;base64,' + imageData;
      if(this.Device.platform=='Android'){
      cordova.plugins.foregroundService.stop();
      }

      this.selImages.push({"image":this.data.image});
      
      this.data.image='';
      
      
      
    }, (err) => {
      if(this.Device.platform=='Android'){
      cordova.plugins.foregroundService.stop();
      }

      
    });
  }).catch((error: any) => {
   
  });
  }




  captureSiteImage() {
    let actionsheet = this.actionSheetController.create({
      title: "Upload Image",
      cssClass: 'cs-actionsheet',
      
      buttons: [{
        cssClass: 'sheet-m',
        text: 'Camera',
        icon: 'camera',
        handler: () => {
          
          
          this.takesitePhoto();
        }
      },
      // {
      //   cssClass: 'sheet-m1',
      //   text: 'Gallery',
      //   icon: 'image',
      //   handler: () => {
          
      //     this.getsiteImage();
      //   }
      // },
      {
        cssClass: 'cs-cancel',
        text: 'Cancel',
        role: 'cancel',
        icon: 'cancel',
        handler: () => {
        this.data.img_id = this.data.id;



          
        }
      }
    ]
  });
  actionsheet.present();
}
 cameraModal(type) {
    let modal = this.modalCtrl.create(CameraModalPage,{'type':type});

    modal.onDidDismiss(data => {
      
      if (data != undefined && data != null) {
    

          this.data.site_image = data;
        
    

        this.siteImages.push({"site_image":this.data.site_image});
        console.log(this.data, 'line number 309');
        
        this.data.site_image='';
    }
    
    
      
    });

    modal.present();
  }
   cameraModalSupport(type) {
    let modal = this.modalCtrl.create(CameraModalPage,{'type':type});

    modal.onDidDismiss(data => {
      
      if (data != undefined && data != null) {
          this.data.image=data;
         

         this.data.image = data;
        
        if(this.Device.platform=='Android'){
      cordova.plugins.foregroundService.stop();
      }

        this.selImages.push({"image":this.data.image});
      
        
        this.data.image='';
    }
    
    
      
    });

    modal.present();
  }

takesitePhoto()
{

  this.diagnostic.requestCameraAuthorization().then((isAvailable: any) => {
      
      const options: CameraOptions = {
        quality: 75,
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth : 1050,
        targetHeight : 1000 
      }
      
      console.log(options);
    if(this.Device.platform=='Android'){
    cordova.plugins.foregroundService.start('Wigwam App', 'Camera Service');
    }
      this.camera.getPicture(options).then((imageData) => {        
        this.data.site_image = 'data:image/jpeg;base64,' + imageData;
        
        if(this.Device.platform=='Android'){
      cordova.plugins.foregroundService.stop();
      }

        this.siteImages.push({"site_image":this.data.site_image});
        console.log(this.data, 'line number 309');
        
        this.data.site_image='';
      }, (err) => {
        if(this.Device.platform=='Android'){
      cordova.plugins.foregroundService.stop();
      }

      });
      
      
     
    }).catch((error: any) => {
   
    });
  
}
getsiteImage() {
    this.diagnostic.requestCameraAuthorization().then((isAvailable: any) => {
    const options: CameraOptions =
    {
      quality: 80,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false,
      cameraDirection: 1,
      correctOrientation: true
    }
    if(this.Device.platform=='Android'){

    cordova.plugins.foregroundService.start('Wigwam App', 'Camera Service');
    }
    this.camera.getPicture(options).then((imageData) => {
      this.data.site_image = 'data:image/jpeg;base64,' + imageData;
      if(this.Device.platform=='Android'){
      cordova.plugins.foregroundService.stop();
      }

      this.siteImages.push({"site_image":this.data.site_image});
      
      this.data.site_image='';
      
      
      
    }, (err) => {
      if(this.Device.platform=='Android'){
      cordova.plugins.foregroundService.stop();
      }

      
    });
  }).catch((error: any) => {
   
  });
  }


  old_img:any=[]
  // fileChange(img) {
  //   // this.image_data=[];
  //   console.log(this.image_data)

  //   this.image_data.push({'image':img});
  //   console.log(this.image_data)
    
  //   this.image = '';
  // }
  
  remove_image(i: any) {
    this.selImages.splice(i, 1);
  }

  remove_Siteimage(i: any) {
    this.siteImages.splice(i, 1);
  }
  
  numeric_Number(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }


  // updateDetail() {
  //   this.influencer_detail.edit_profile = 'edit_profile';
  //   console.log(this.influencer_detail)
  //   console.log(this.influencer_detail.state)

  //   this.navCtrl.push(RegistrationPage, { 'data': this.influencer_detail, "mode": 'edit_page' })
  // }


  showLimit(type) {
    let alert = this.alertCtrl.create({
      title: 'Alert',
      subTitle: "You can upload only 5 " +type+ " Images",
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

alertToast(msg){
  const toast = this.toastCtrl.create({
    message: msg,
    duration: 3000
  });
  toast.present();
}


submitDraft(){
  
 
  
  this.spinner = true;
  this.saveFlag = true;
  this.data.parts = this.add_list;
  let calculatedPoint=Number(this.productData.influencer_point) * Number(this.cartData.qty)
   this.cartData.transfer_point = calculatedPoint;
   if(this.constant.UserLoggedInData.loggedInUserType=='Employee'){
    this.data.employee_id = this.userId;
    this.data.influencer_id = this.data.contractor_id.id;
    this.data.influencer_type = this.data.contractor_id.type;

   }
   else{
    this.data.influencer_id = this.constant.UserLoggedInData.id;
    this.data.influencer_type = this.constant.UserLoggedInData.type;

   }
  

  this.data.dealer_mobile = this.data.dealer_id.mobile;
  this.data.dealer_name = this.data.dealer_id.company_name;
  this.data.dealer_id = this.data.dealer_id.id;
  this.data.image = this.selImages?this.selImages:[];

  this.serve.addData({'data':this.data,}, 'AppInfluencer/add_cart').then((result) => {
    
    if(result['statusCode']==200){
      if(result['statusMsg'] == 'Success'){
        this.purchaseCartId = result['purchase_cart_id'];

        this.spinner = false

        this.cartAdded=true
       
        this.serve.successToast(result['statusMsg']);
        this.navCtrl.push(LoyaltyDraftPurchasePage);
      }
      
    }else{
      this.spinner = false
      this.serve.dismissLoading();
      this.serve.errorToast(result['statusMsg'])
    }
  }, err => {
    this.spinner = false
    this.serve.dismissLoading();
    this.serve.errorToast('Something went wrong')
  });
  
  
 }

 membershipCheckFlag() {
  this.serve.presentLoading();
  this.serve.addData({}, 'RetailerRequest/membershipCheckFlag').then((result) => {
    if (result['statusCode'] == 200) {
      this.percentage = result['result']['percentage'];
      console.log( this.percentage,"line 711")
     
      this.serve.dismissLoading();
    }
    else {
      this.serve.errorToast(result['statusMsg']);
      this.serve.dismissLoading();
    }
  });
}


submit(){
  
//   if(!this.selImages.length){
//     let alert = this.alertCtrl.create({
//       title: 'Alert',
//       subTitle: "Upload Invoice Image Is Required!",
//       cssClass: 'alert-modal',
      
//       buttons: [{
//         text: 'Ok',
//         role: 'cancel',
//         handler: () => {
          
//         }
//       }
//     ]
//   });
//   alert.present();
//   return;
  
// }

// if(this.siteImages.length>5){
//   let alert = this.alertCtrl.create({
//     title: 'Alert',
//     subTitle: "Upload 5 Site Image Is Required!",
//     cssClass: 'alert-modal',
    
//     buttons: [{
//       text: 'Ok',
//       role: 'cancel',
//       handler: () => {
        
//       }
//     }
//   ]
// });
// alert.present();
// return;

// }

let alert = this.alertCtrl.create({
  title: 'Save Purchase',
  message: 'Do you want to Submit Purchase?',
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

         
        // if(this.siteImages.length<5){
        //   this.alertToast('Upload Minimum 5 Live Site Image ')
        //   return
        // }
        // if(this.selImages.length<1){
        //   this.alertToast('Upload Minimum 1 Supporting Image ')
        //   return
        // }
        if(this.add_list < 1){
          this.alertToast('Please add one item at least!')
          return
        }
        this.spinner = true;
        this.saveFlag = true;
        this.data.part = this.add_list;
        let calculatedPoint = this.data.part.map(row => row.influencer_point * parseInt(row.qty));
        let basePoints = calculatedPoint.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

        // Now add the membership bonus
        let membershipBonus = this.percentage ? this.percentage / 100 : 0;
        this.data.transfer_point = basePoints * (1 + membershipBonus);
         if(this.constant.UserLoggedInData.loggedInUserType=='Employee'){
          this.data.employee_id = this.userId;
          this.data.influencer_id = this.data.contractor_id.id;
          this.data.influencer_type = this.data.contractor_id.type;

         }
         else{
          this.data.influencer_id = this.constant.UserLoggedInData.id;
          this.data.influencer_type = this.constant.UserLoggedInData.type;

         }
        

        // this.data.dealer_mobile = this.data.dealer_id.mobile;
        // this.data.dealer_name = this.data.dealer_id.company_name;
        let dealerData=this.data.dealer_id
        this.data.dealer_id = this.data.dealer_id.id;
      


        this.data.image = this.selImages?this.selImages:[];
        this.data.site_image = this.siteImages?this.siteImages:[];

        this.serve.addData({'data':this.data}, 'RetailerRequest/add_retailer_request').then((result) => {
          
          if(result['statusCode']==200){
            if(result['statusMsg'] == 'Success'){
              this.spinner = false
              this.serve.successToast(result['statusMsg']);
              this.navCtrl.popTo(LoyaltyPurchaseListPage);
            }
            
          }

          else if(result['statusCode']==500){

            this.serve.errorToast(result['case']['msg'])
            this.spinner = false
             this.saveFlag = false;
             this.data.dealer_id=''
            this.data.dealer_id=dealerData

            this.serve.dismissLoading();
          }
          
          else{
            this.spinner = false
            this.data.dealer_id=''
            this.data.dealer_id=dealerData
            this.serve.dismissLoading();
            this.serve.errorToast(result['statusMsg'])
          }
        }, err => {
          this.spinner = false
          this.serve.dismissLoading();
          this.serve.errorToast('Something went wrong')
        });
        
        
      }
    }
    
  ]
});
alert.present();

}

  onSearch(event) {
    if(event.text.length>3){
      this.getnetworklist(event.text,'')
    }
    else if(!event.text){
      this.getnetworklist('',this.influencers_data)
    }

   
  }
  oncontractorSearch(event) {
    if(event.text.length>3){
      this.getContractorlist(event.text)
    }
    else if(!event.text){
      this.getContractorlist('')
    }

   
  }



  getBrands(dealer_id) {
    this.dr_id = dealer_id.id

    this.serve.addData({'dealer_id':dealer_id.id}, "RetailerRequest/get_brand")
        .then(resp => {
            if (resp['statusCode'] == 200) {
                this.brandList = resp['brand_list'];
            } else {
                this.serve.errorToast(resp['statusMsg'])

            }
        }, err => { })
    this.cartData.qty = '';
    this.cartData.size = '';
    this.cartData.thickness = '';
}
  getThickness(brandData) {

    this.serve.addData({ 'brand': brandData.brand,'dealer_id':this.dr_id }, "AppInfluencer/product_Thickness")
        .then(resp => {
            if (resp['statusCode'] == 200) {
                this.thicknessList = resp['result'];
            } else {
                this.serve.errorToast(resp['statusMsg'])

            }

        }, err => { })
    this.cartData.qty = '';
    this.cartData.size = '';
    this.cartData.thickness = '';
}
getSize(thickness) {
    this.serve.addData({ 'brand': this.cartData.brand.brand, "thickness": thickness,'dealer_id':this.dr_id }, "AppInfluencer/product_Size")
        .then(resp => {
            if (resp['statusCode'] == 200) {
                this.sizeList = resp['result'];
            } else {
                this.serve.errorToast(resp['statusMsg'])

            }
        }, err => { })
    this.cartData.qty = '';
    this.cartData.size = '';
}


getProductData() {
  this.serve.addData({ 'brand': this.cartData.brand.brand, "thickness": this.cartData.thickness, "size": this.cartData.size,'dealer_id':this.dr_id }, "AppOrder/productItems")
      .then(resp => {
          if (resp['statusCode'] == 200) {
              this.productData = resp['result'];
              this.cartData.product_name = this.productData.product_name
              this.cartData.product_code = this.productData.product_code
              this.data.influencer_point = this.productData.influencer_point
              if(this.constant.UserLoggedInData.type=='8' || (this.constant.UserLoggedInData.loggedInUserType=='Employee' && (this.data.contractor_id.type=='8' || this.data.contractor_id.type==8 ))){
              this.cartData.influencer_point = this.productData.ply_expert_point
              }
              if(this.constant.UserLoggedInData.type=='13' || (this.constant.UserLoggedInData.loggedInUserType=='Employee' && (this.data.contractor_id.type=='13' || this.data.contractor_id.type==13)) ){
              this.cartData.influencer_point = this.productData.ambassador_point
              }


              this.cartData.segment_id = this.productData.category_id
              this.cartData.segment_name = this.productData.category
              this.cartData.product_id = this.productData.id

              if(this.constant.UserLoggedInData.type=='8' || (this.constant.UserLoggedInData.loggedInUserType=='Employee' && this.data.contractor_id.type=='8')){
              this.inventoryMaxqty = this.productData.ply_ex_close_qty
              this.cartData.maxqty = this.productData.ply_ex_close_qty

              }
              if(this.constant.UserLoggedInData.type=='13' || (this.constant.UserLoggedInData.loggedInUserType=='Employee' && this.data.contractor_id.type=='13') ){
              this.inventoryMaxqty = this.productData.ambassador_close_qty
              this.cartData.maxqty = this.productData.ambassador_close_qty
              }
            



              this.cartData.brand.brand = this.productData.brand_code;


          } else {
              this.serve.errorToast(resp['statusMsg'])

          }
      }, err => { })
}



checkMatch() {
 

  if (this.cartData.qty !== null) {
   


    if(this.constant.UserLoggedInData.type=='8' || (this.constant.UserLoggedInData.loggedInUserType=='Employee' && (this.data.contractor_id.type=='8' || this.data.contractor_id.type==8))){
      
      if(this.cartData.qty <= this.productData.ply_ex_close_qty){
        this.addToListButton = true;
      }
      else{
        this.serve.errorToast('You cannot Enter Qty more than ' +this.productData.ply_ex_close_qty)
         this.addToListButton = false;
      }

    }
    else{

      if(this.cartData.qty <= this.productData.ambassador_close_qty){
        this.addToListButton = true;
  
      }
      else{
        this.serve.errorToast('You cannot Enter Qty more than ' +this.productData.ambassador_close_qty )
         this.addToListButton = false;
      }
      
    }
   
    
  } else {
    this.addToListButton = false;
   
  }
}





adjustQuantity(change: number) {
  

  const newQuantity = Number(this.cartData.qty) + change;

  // Ensure new quantity does not go below 0 or exceed available inventory
  if (newQuantity >= 0 && newQuantity <= Number(this.inventoryMaxqty)) {
    this.cartData.qty  = newQuantity;
    
  } else {
  

  }
}


gotoDraft(){

  this.user_data.dealer_mobile = this.data.dealer_id.mobile;
        this.user_data.dealer_name = this.data.dealer_id.company_name;
  this.navCtrl.push(LoyaltyDraftPurchasePage,{'userId':this.userId,'cart_data':this.add_list,'user_data': this.user_data})
}


MobileNumber(event: any) {
  const pattern = /[0-9]/;
  let inputChar = String.fromCharCode(event.charCode);
  if (event.keyCode != 8 && !pattern.test(inputChar)) {
    event.preventDefault();
  }
}



backAction() {

  if (this.add_list.length > 0) {
      let alert = this.alertCtrl.create({
          title: 'Are You Sure?',
          subTitle: 'Your Purchase Data Will Be Lost',
          cssClass: 'alert-modal',

          buttons: [{
              text: 'No',
              role: 'cancel',
              handler: () => {
                  this.serve.presentToast('Your Data is Safe')
              }
          },
          {
              text: 'Yes',
              handler: () => {
                  this.navCtrl.pop();
                  this.add_list = [];

              }
          }]
      });
      alert.present();
  }
  else {
      this.navCtrl.pop();
  }
}


}








