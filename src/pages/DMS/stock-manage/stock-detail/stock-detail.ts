import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import zingchart from 'zingchart'
import { Chart } from 'chart.js';
import { MyserviceProvider } from '../../../../providers/myservice/myservice';

@IonicPage()
@Component({
  selector: 'page-stock-detail',
  templateUrl: 'stock-detail.html',
})
export class StockDetailPage {
  productData: any = {};
  stockData: any = [];
  return_out: any = [];
  return_in: any = [];
  mainTab: any = 'stock'
  SubTab: any = 'incoming'
  
  
  constructor(public navCtrl: NavController, public navParams: NavParams , public service: MyserviceProvider) {
    
    if (this.navParams.get('productData')) {
      
      this.productData = this.navParams.get('productData');
      console.log(this.productData);
      
      this.getSendPointReqDetail(this.productData.product_id);
      
      setTimeout(() => {
        this.getSalesRetrunDetail(this.productData.product_id);
      }, 200);
    }
  }
  
  ionViewWillEnter(){
    this.getGraph();
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad StockDetailPage');
  }
  
  getGraph(){
    // getEnquiryReport() {
    let myConfig: any = {
      "type": "area",
      "scale-x": {
        "labels": ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"]
      },
      "scale-y": {
        "values": "0:1000000:200000",
        "short": true,
        "short-unit": "K",
        "thousands-separator": ","
      },
      "plot": {
        "aspect": "spline"
      },
      "plotarea": {
        "margin-left": "dynamic"
      },
      "series": [{
        "values": [31342, 596061, 76790, 151630, 75319, 771421, 989312]
      }]
    };
    // myChart.gui = { contextMenu: { visible: false } }
    
    zingchart.render({
      id: 'myChart',
      data: myConfig ,
      height: 400,
    });
    
    // zingchart.render({ id: 'myChart', data: enquiryPieChart, height: 250 })
    // }
  }
  
  getSendPointReqDetail(product_id) {
    console.log(product_id);
    this.service.presentLoading();
    
    this.service.addData({ "product_id": product_id }, "AppStockTransfer/stockDetails").then((result) => {
      console.log(result);
      
      if (result['statusCode'] == 200) {
        this.service.dismissLoading();
        this.stockData = result['result'];
        console.log(this.stockData);
      } else {
        this.service.dismissLoading();
        this.service.errorToast(result['statusMsg'])
      }
    }, err => {
      this.service.dismissLoading();
    });
  }
  
  
  getSalesRetrunDetail(product_id) {
    console.log(product_id);
    this.service.addData({ "product_id": product_id}, "AppStockTransfer/salesReturnPartyList").then((result) => {
      console.log(result);
      
      if (result['statusCode'] == 200) {
        this.return_in = result['return_in'];
        this.return_out = result['return_out'];
        console.log(this.stockData);
      } else {
        this.service.dismissLoading();
        this.service.errorToast(result['statusMsg'])
      }
    }, err => {
      this.service.dismissLoading();
    });
  }
  
}
