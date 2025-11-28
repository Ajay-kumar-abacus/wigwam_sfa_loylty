import { Component } from '@angular/core';
import { IonicPage, Loading, LoadingController, NavController, NavParams, Platform } from 'ionic-angular';
import { ConstantProvider } from '../../providers/constant/constant';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Device } from "@ionic-native/device";
// import { LogLevel } from 'onesignal-cordova-plugin';
declare var DocumentViewer: any;

@IonicPage()
@Component({
  selector: 'page-loyalty-catalogue',
  templateUrl: 'loyalty-catalogue.html',
})


export class LoyaltyCataloguePage {
  pdfData:any=[];
  url:any;
  filter:any={};
  isInfoVisible: boolean[] = [false]
  catalogue_type: any = 'Brochures'
  // count: any = {}
  pageCount: any={};
  
  // private document: DocumentViewer,
  constructor(public iab:InAppBrowser, public Device:Device,public navCtrl: NavController, public platform: Platform, public navParams: NavParams, public service:MyserviceProvider,public constant:ConstantProvider) {
    this.url = constant.upload_url1+'doc_catalogue/';
    this.getData();
  }
  
  ionViewWillEnter(){
  }
  
  ionViewDidLoad() {
  }
  
  doRefresh(refresher) 
  {
    this.catalogue_type = 'Brochures'
    this.getData();
    refresher.complete();
  }
  
  getData()
  {
    this.filter.limit=20;
    this.filter.start=0;
    this.service.presentLoading();
    this.service.addData({'filter' : this.filter,"catalogue_type": this.catalogue_type},'AppCateloge/documentCatalogueList').then((result) =>
    {
      if(result['statusCode'] == 200){
        this.pdfData = result['doc_list'];
        this.pageCount = result['count'];
        console.log(this.pageCount);
        
        this.service.dismissLoading();
      }
      else{
        this.service.errorToast(result['statusMsg']);
        this.service.dismissLoading();
      }
    }, error => {
      this.service.Error_msg(error);
      this.service.dismiss();
    });
  }
  flag:any='';
  loadData(infiniteScroll)
  {
    this.filter.start=this.pdfData.length;
    
    this.service.addData({'filter' : this.filter},'AppCateloge/documentCatalogueList').then( (result) =>
    {
      if(result=='')
      {
        this.flag=1;
      }
      else
      {
        setTimeout(()=>{
          this.pdfData=this.pdfData.concat(result['doc_list']);
          infiniteScroll.complete();
        },1000);
      }
    }, error => {
      this.service.Error_msg(error);
      this.service.dismiss();
    });
  }
  
  openCatelogue(url, i)
  {
    if(this.Device.platform=='Android'){
    this.isInfoVisible[i] = true;
    var upload_url=  url
    DocumentViewer.previewFileFromUrlOrPath(
      function () {
       
      }, function (error) 
      {
        if (error == 53) 
        {
          this.service.Error_msg('No app that handles this file type.');
        }else if (error == 2)
        {
          this.service.Error_msg('Invalid link');
        }
      },
      upload_url ,'pdf', 'application/pdf');
      setTimeout(() => {
        this.isInfoVisible[i] = false;
      }, 2000);
    }else{
      this.iab.create(url, '_system')
    }
    }
    
  }