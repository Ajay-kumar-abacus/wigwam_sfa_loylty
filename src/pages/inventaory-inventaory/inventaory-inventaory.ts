import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';

/**
 * Generated class for the InventaoryInventaoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-inventaory-inventaory',
  templateUrl: 'inventaory-inventaory.html',
})
export class InventaoryInventaoryPage {
  productData = [
    {
      product_name: "Premium Headphones",
      product_code: "PH-001",
      Category: "Electronics",
      cs: 45,
      pr: 20
    },
    {
      product_name: "Organic Coffee Beans",
      product_code: "OCB-232",
      Category: "Food & Beverage",
      cs: 120,
      pr: 50
    },
    {
      product_name: "Wireless Keyboard",
      product_code: "WK-104",
      Category: "Computer Accessories",
      cs: 35,
      pr: 15
    },
    {
      product_name: "Running Shoes",
      product_code: "RS-789",
      Category: "Sports Equipment",
      cs: 67,
      pr: 30
    },
    {
      product_name: "Smartphone Case",
      product_code: "SC-455",
      Category: "Mobile Accessories",
      cs: 210,
      pr: 100
    }
  ];

  userDetail = {
    company_name: 'TechCorp',
    name: 'John Doe',
    mobile: '1234567890'
  };
  id: any;
  tab_type: any='Ply Expert';
  Dr_id: any;
  limit: number;
  start: number;
  filter: { dealer_id: string; warehouse_type: any; limit: number; start: number; };
  constructor(public navCtrl: NavController, public navParams: NavParams,public service: MyserviceProvider) {
    this.Dr_id = this.navParams.get('dr_id')
    console.log(this.Dr_id)
    this.getInventory()
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InventaoryInventaoryPage');
  }

  getInventory(){
    this.limit =20
    this.start = 0
          this.service.presentLoading()
          this.filter={ "dealer_id": this.Dr_id ,'warehouse_type': this.tab_type,'limit':this.limit,'start':this.start,}

          this.service.addData({'filter':this.filter}, "AppCustomerNetwork/get_inventory_list_dealer_wise").then((result) => {
              if (result['statusCode'] == 200) {
                  this.productData = result['inventory_list'];
                  
  
                  this.service.dismissLoading()
                 
  
  
              } else {
                  this.service.errorToast(result['statusMsg'])
                  this.service.dismissLoading()
  
              }
          },
              err => {
                  this.service.errorToast(err)
                  this.service.dismissLoading()
              })
      }


      loadData(infiniteScroll) {
        this.start = this.productData.length;
        this.limit =20
      
        this.filter={ "dealer_id": this.Dr_id ,'warehouse_type': this.tab_type,'limit':this.limit,'start':this.start,}

        this.service.addData({'filter':this.filter}, "AppCustomerNetwork/get_inventory_list_dealer_wise").then((result) => {
          if (result['statusCode'] == 200) {
                setTimeout(() => {
                      this.productData =  this.productData.concat(result['inventory_list']);
                    infiniteScroll.complete();
                }, 1000);
            }
        });
    }

}
