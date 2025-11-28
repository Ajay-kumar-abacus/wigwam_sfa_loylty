import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { LoyaltyHomePage } from '../loyalty/loyalty-home/loyalty-home';
import * as jwt_decode from "jwt-decode";






@IonicPage()
@Component({
  selector: 'page-loyalty-language',
  templateUrl: 'loyalty-language.html',
})
export class LoyaltyLanguagePage {
  
  data:any={};
  registerType: any = '';
  tokenName:any='';
  loginType:any='';
  token:any='';
  lang:any='en';
  mode:any;
  chs_lng:any=""
    no:any=""
    yes:any=""
    sure:any=""

  
  constructor(public navCtrl: NavController, 
      public navParams: NavParams,
      public loadingCtrl: LoadingController,
      private  translate:TranslateService,
    public serve: MyserviceProvider,
    public alertCtrl: AlertController,
      public storage: Storage) 
      {
        this.registerType = this.navParams.get('registerType');
        this.mode = this.navParams.get('mode');
        this.get_user_lang()



      }
      
      ionViewDidLoad() {
      }
      
      goToRegisterPage()
      {
          this.navCtrl.push(LoginPage,{'registerType':this.data.registerType});
      }
      
      // goToHome() {
      //     // go to the MyPage component
      //     this.navCtrl.push(CatalogueHomePage);
      // }


      set_lang()
      {
          this.translate.use(this.lang);
      }

      continue()
      {
          console.log(this.lang);
          this.navCtrl.push(LoginPage,{"lang":this.lang,'registerType':this.registerType});
      }

      update_lang()
    {
        this.translate.get("Change Language")
        .subscribe(resp=>{
            this.chs_lng = resp;
        })
        
        this.translate.get("No")
        .subscribe(resp=>{
            this.no = resp;
        })
        this.translate.get("Yes")
        .subscribe(resp=>{
            this.yes = resp;
        })
        this.translate.get("Do you want to change the language?")
        .subscribe(resp=>{
            this.chs_lng = resp;
        })
        let updateAlert = this.alertCtrl.create({
            title: this.chs_lng,
            message: this.sure,
            buttons: [
                {
                    text: this.no, 
                },
                {
                    text: this.yes,
                    handler: () => {
                      this.serve.addData({ "lan": this.lang }, 'Login/changeLanguage').then(result => {
                        if (result['statusCode'] == 200) {
                          this.navCtrl.push(LoyaltyHomePage);

                        }
                        else {
                          this.serve.errorToast(result['statusMsg']);
                          this.serve.dismissLoading();
                        }
                      })
                    } 
                }
            ]
        });
        updateAlert.present();
    }

    tokenInfo:any={};
    get_user_lang()
    {
      this.storage.get("token")
      .then(resp=>{
        this.tokenInfo = this.getDecodedAccessToken(resp );
        console.log(this.tokenInfo)
        
        this.serve.addData({"login_id":this.tokenInfo.id}, 'Login/userLanguage').then(result => {
          if (result['statusCode'] == 200) {
            this.lang = result['result']['app_language'];
            if(this.lang == "")
            {
              this.lang = "en";
            }
            this.translate.use(this.lang);
          }
          else {
            this.serve.errorToast(result['statusMsg']);
            this.serve.dismissLoading();
          }
        })
      })
    }

   
    getDecodedAccessToken(token: string): any {
      try{
        return jwt_decode(token);
      }
      catch(Error){
        return null;
      }
    }
      
  }