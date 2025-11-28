import { Component,ViewChild } from '@angular/core';
import { NavController,Nav, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
// import { ProfilePage } from '../profile/profile';
// import { MobileLoginPage } from '../login-section/mobile-login/mobile-login';
import { CatalogueHomePage } from '../catalogue-home/catalogue-home';
// import { ProductsPage } from '../products/products';
// import { CategoryPage } from '../category/category';
// import { DealerProfilePage } from '../dealer-profile/dealer-profile';
// import { DealerHomePage } from '../dealer-home/dealer-home';
import { DashboardPage } from '../dashboard/dashboard';
import { ConstantProvider } from '../../providers/constant/constant';
import { EnquiryPage } from '../enquiry/enquiry';
// import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HttpInterceptingHandler } from '@angular/common/http/src/module';
import { AttendenceserviceProvider } from '../../providers/attendenceservice/attendenceservice';
import { LoyaltyHomePage } from '../loyalty/loyalty-home/loyalty-home';
import { LoyaltyPointHistoryPage } from '../loyalty/loyalty-point-history/loyalty-point-history';
import { LoyaltyCataloguePage } from '../loyalty-catalogue/loyalty-catalogue';
import { LoyaltyContactPage } from '../loyalty/loyalty-contact/loyalty-contact';
import { LoyaltyProfilePage } from '../loyalty/loyalty-profile/loyalty-profile';
import { SupportListPage } from '../support-list/support-list';
// import { TranslateService } from '@ngx-translate/core';


import * as jwt_decode from "jwt-decode";
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { LoyaltyGiftGalleryPage } from '../loyalty/loyalty-gift-gallery/loyalty-gift-gallery';
import { LoyaltyPurchaseListPage } from '../loyalty-purchase-list/loyalty-purchase-list';
import { LoyaltyMenuPage } from '../loyalty-menu/loyalty-menu';



@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage 
{
  index:any='';
  userType:any='';
  login:any;
  tokenInfo: any = {};
  lang: any = 'en';


  @ViewChild(Nav) nav: Nav;
  rootPage:any;

  tab1Root = LoyaltyHomePage;
  tab5Root =  LoyaltyMenuPage;
  tab2Root = LoyaltyPointHistoryPage;
  tab3Root = LoyaltyPurchaseListPage;
  tab4Root = LoyaltyGiftGalleryPage;
 

  constructor( 
              public storage: Storage,
              public navParams: NavParams, 
              public service:MyserviceProvider, 
              public navCtrl: NavController,
              public constant:ConstantProvider,
              // public  translate:TranslateService,
              
              ) 
  {
    console.log(constant);
    this.lang = this.navParams.get("lang");
 
    
    
    // storage.get('token').then((val) => {
    //   console.log(val);
    //   if(val == '' || val == null || val == undefined)
    //   {
    //     this.rootPage = MobileLoginPage;
    //     // this.nav.setRoot(MobileLoginPage);
    //   }else{
         

    //     if(this.index=='5')
    //     {
    //       console.log('index 5');
          
    //     this.navCtrl.setRoot(ProfilePage);
    //     // this.rootPage = ProfilePage;
    //     return;

    //     }
    //     // this.navCtrl.setRoot(HomePage);

    //     this.rootPage = CatalogueHomePage;

    //   }
    // });


    if(this.constant.UserLoggedInData.userLoggedInChk==false || (!this.constant.UserLoggedInData))
    {
      console.log('in UserLoggedInData');
      this.rootPage = CatalogueHomePage;
    }
    // else if(this.constant.UserLoggedInData.loggedInUserType == 'Employee')
    // {
    //   this.userType = 'Employee'
    //   this.rootPage = DashboardPage;
    //   console.log(this.userType);
    // }
    // else if(this.constant.UserLoggedInData.loggedInUserType == 'DrLogin')
    // {
    //   this.userType = 'DrLogin'
    //   this.rootPage = DealerHomePage;
    //   console.log(this.userType);
    // }

  }

  // get_user_lang()
  // {
  //   this.storage.get("token")
  //   .then(resp=>{
  //     this.tokenInfo = this.getDecodedAccessToken(resp );
      
  //     this.service.addData({"login_id":this.tokenInfo.id}, 'Login/userLanguage').then(result => {
  //       if (result['statusCode'] == 200) {
  //         this.lang = result['result']['app_language'];
  //         if(this.lang == "")
  //         {
  //           this.lang = "en";
  //         }
  //         // this.translate.use(this.lang);
  //       }
  //       else {
  //         this.service.errorToast(result['statusMsg']);
  //         this.service.dismissLoading();
  //       }
  //     })
  //   })
  // }
  // getDecodedAccessToken(token: string): any {
  //   try{
  //     return jwt_decode(token);
  //   }
  //   catch(Error){
  //     return null;
  //   }
  // }

  


 
}
