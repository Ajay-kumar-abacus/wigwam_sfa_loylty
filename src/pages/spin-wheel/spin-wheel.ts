import { Component } from '@angular/core';
import { AlertController, IonicPage, Loading, LoadingController, NavController, NavParams, ViewController } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { ConstantProvider } from '../../providers/constant/constant';
import { MyserviceProvider } from '../../providers/myservice/myservice';
// import { TranslateService } from '@ngx-translate/core';
// import { NativeAudio } from '@ionic-native/native-audio/ngx';


@IonicPage()
@Component({
  selector: 'page-spin-wheel',
  templateUrl: 'spin-wheel.html',
})
export class SpinWheelPage {

  loading: Loading;
  private spinning: boolean = false;
  private wheel: HTMLElement;
  private arrow: HTMLElement;
  points:any;
  deg_value_sction8:any;


  // loading: any;
  karigar_id: any = '';
  spin_val1 = 22.5;
  spin_val2 = 337.5;
  spin_val3 = 292.5;
  spin_val4 = 247.5;
  spin_val5 = 202.5;
  spin_val6 = 157.5;
  spin_val7 = 112.5;
  spin_val8 = 67.5;

  spin_val:any=[]
  pointSlab:any=[]

  
  
  // spin_val[1] = 22.5;
  // spin_val[8] = 67.5;
  // spin_val[7] = 112.5;
  // spin_val[6] = 157.5;
  // spin_val[5] = 202.5;
  // spin_val[4] = 247.5;
  // spin_val[3] = 292.5;
  // spin_val[2] = 337.5;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public service: MyserviceProvider, public alertCtrl: AlertController, public loadingCtrl: LoadingController,public constant: ConstantProvider) {
    this.karigar_id = this.navParams.get('karigar_id');
    this.spin_val.push('');
    this.spin_val.push(this.spin_val1);
    this.spin_val.push(this.spin_val2)
    this.spin_val.push(this.spin_val3)
    this.spin_val.push(this.spin_val4)
    this.spin_val.push(this.spin_val5)
    this.spin_val.push(this.spin_val6)
    this.spin_val.push(this.spin_val7)
    this.spin_val.push(this.spin_val8)
      console.log(this.spin_val);

    // private nativeAudio: NativeAudio,

      this.pointSlab.push({'value':1, 'slice_number':1 })
      this.pointSlab.push({'value':5, 'slice_number':2 })
      this.pointSlab.push({'value':11, 'slice_number':3 })
      this.pointSlab.push({'value':21, 'slice_number':4 })
      this.pointSlab.push({'value':34, 'slice_number':5})
      this.pointSlab.push({'value':35, 'slice_number':6 })
      this.pointSlab.push({'value':41, 'slice_number':7 })
      this.pointSlab.push({'value':50, 'slice_number':8 })



  }

  ionViewDidLoad() {
    this.wheel = document.getElementById('wheel');
    // this.arrow = this.wheel.querySelector('ion-icon');
    this.karigar_id = this.navParams.get('karigar_id');
    // this.getSpinWin();
    // this.presentLoading();
  }
 

  spinWheel() {
    if (!this.spinning) {
      this.spinning = true;
      let rndnum = Math.random();
      let randomDegree = Math.floor(rndnum * 9);
      if (randomDegree == 0){
       randomDegree = 1;
      }
      const rotation = 360 * 10; // Increased to rotate 10 full cycles
      let spnwhl = (randomDegree * 45) - 22.5;

      // Reset wheel properties for new spin
      this.wheel.style.transition = 'none';
      this.wheel.style.transform = 'rotate(180deg)';


      let deg_value = this.spin_val[randomDegree]+36000;
      console.log(deg_value);

      // this.arrow.style.display = 'none';

      setTimeout(() => {
        // Apply animation properties after reset
        this.wheel.style.transition = 'transform 6s cubic-bezier(0.1, 2.7, 0.58, 1)'; // 6s animation
        this.wheel.style.transform = `rotate(${deg_value}deg)`; //this.wheel.style.transform = `rotate(${spnwhl}deg`;

        setTimeout(() => {
          this.spinning = false;
          this.wheel.style.transition = 'none';
          // this.arrow.style.display = 'block';
          this.points = Math.floor(randomDegree);
          console.log(this.points)
          if(this.points){
            console.log(this.pointSlab)
            let Index = this.pointSlab.findIndex(row => row.slice_number === this.points)
            console.log(Index)

          if (Index !== -1) {
            let matchedValue = this.pointSlab[Index].value
            console.log(matchedValue);
            this.getSpinWin(matchedValue);
          } else {
            console.log("No matching slice_number found.");
          }
        }
         
          // alert(`You Win ${points } Points` );
        }, 7000); // Stop spinning after 6 seconds
      });
    }
  }


  getSpinWin(points) {

    this.service.addData({ 'influencer_id': this.constant.UserLoggedInData.id, 'points': points,'influencer_type':'influencer' }, 'AppInfluencer/spin_and_win').then((result) => {
      if (result['statusCode'] == 200) {
        this.showSuccess('', `<img src="assets/imgs/sucess.gif"  alt="cancel"> <p>You Won ${points} Points</p>`);
      }


      else if(result['case'] == 'influencer_already_spin'){
        this.showAlert("You can spin only once in a Month.");
    }

      else {
        this.service.errorToast(result['statusMsg']);
      }
    }, error => {
      this.service.Error_msg(error);
    });
    // this.service.addData({ 'influencer_id': this.constant.UserLoggedInData.id, 'points': points,'influencer_type':'influencer'}, 'AppInfluencer/spin_and_win')
    //   .then((r) => {
    //     // this.loading.dismiss();
    //     // this.otp=r['otp'];

    //     if (r['status'] == 'karigar_already_spin') {
    //       this.showAlert('Karigar Already Spin ');
       
    //       return;
    //     }
    //     else if (r['status'] == 'success') {

    //       this.showSuccess('', `<img src="assets/imgs/sucess.gif"  alt="cancel"> <p>You Won ${points} Points</p>`);

    //       return;
    //     }


    //     else if (r['status'] == 'karigar_not_exist') {
    //       this.showAlert("Karigar Not Exist");
         
    //       return;
    //     }

    //     else if (r['status'] == 'you_are_not_eligible_to_spin') {    

    //       this.showAlert("You are not eligible to spin");
    
    //       return;
    //     }

    //   });
  }


  showAlert(text) {
    let alert = this.alertCtrl.create({
      title: 'Alert!',
      cssClass: 'action-close',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }
  showSuccess(text, img) {
    let alert = this.alertCtrl.create({
      title: 'Success!',
      cssClass: 'action-close',
      message: img,
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }

  presentLoading() {
    this.loading = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange: false
    });
    this.loading.present();
  }







}
