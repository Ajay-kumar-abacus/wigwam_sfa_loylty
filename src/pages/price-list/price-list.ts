import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';

/**
 * Generated class for the PriceListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-price-list',
  templateUrl: 'price-list.html',
})
export class PriceListPage {

  data: any = {};
  brandList: any= [];
  drList: any = [];
  thicknessList: any = [];
  productData: any = [];
  comparisonList: any = [];
  Dr_type = ''
  cpType: any = ''
  loader: boolean = false;
    master_discount: any;
    all_segment_with_discount_list: any;
    discount_percentages: any;
    Dr_id: any;
    search: any;
    view_type: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public service: MyserviceProvider,) {
    this.getBrands(); 
    this.Dr_id = this.navParams.get('dr_id')
    this.view_type = this.navParams.get('view_type')
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PriceListPage');
  }

  blankData(){
    this.data.brand=''
    this.data.thickness=''
    this.comparisonList=[]
  }
  


distributors(data, masterSearch) {

    this.data.category = '';
    this.data.order_type = '';
    this.data.sub_category_list = '';
    this.data.items_list = '';
    this.data.thickness_list = '';
    this.data.dimension_list = '';
    // this.product_detail.weight = '';
    this.data.color = '';
    // this.product_list.length = 0;
    this.data.segment = {}
    let type
    if (this.data.networkType == '1') {
        type = '1'
        this.cpType = 'Active'
    }
    if (this.data.networkType == '2') {
        type = '1'
        this.cpType = 'Inactive'
    }
    if (this.data.networkType == '7') {
        type = '7'
        this.cpType = ''
    }

  
        this.Dr_type
        this.loader = true;
        this.service.addData({ 'dr_type': type, 'master_search': masterSearch, 'active_tab': this.cpType }, 'AppOrder/newfollowupCustomer').then((result) => {
            if (result['statusCode'] == 200) {
                this.loader = false;
                this.drList = result['result'];

                if (this.navParams.get('from') && this.navParams.get('from') == 'DistPrimary') {
                    let existIndex
                    existIndex = this.drList.findIndex(row => row.id == this.data.type_name);
                    if (existIndex != -1) {
                        this.data.type_name.min_ton = this.drList[existIndex]['min_ton']
                    }
                }
            } else {
                this.loader = false;
                this.service.errorToast(result['statusMsg'])
            }
        });
    
}

searchDealer(data, event) {
    let type
    if (this.data.networkType == '1') {
        type = '1'
        this.cpType = 'Active'
    }
    if (this.data.networkType == '2') {
        type = '1'
        this.cpType = 'Inactive'
    }
    if (this.data.networkType == '7') {
        type = '7'
        this.cpType = ''
    }
    if (event.text == '') {
        this.distributors(type, '');
    }
    this.search = event.text;
    let wordSearch = this.search;
    setTimeout(() => {
        if (wordSearch == this.search) {
            if (this.search) {
                this.distributors(type, this.search);
            }
        }
    }, 500);
}




  getBrands() {

    this.service.addData({}, "AppOrder/brandList")
        .then(resp => {
            if (resp['statusCode'] == 200) {
                this.brandList = resp['result'];
            } else {
                this.service.errorToast(resp['statusMsg'])

            }
        }, err => { })
    this.data.qty = '';
    this.data.size = '';
    this.data.thickness = '';
    this.comparisonList=[]
}
getThickness(brandData) {

    this.service.addData({ 'brand': brandData.brand_code }, "AppOrder/productThikness")
        .then(resp => {
            if (resp['statusCode'] == 200) {
                this.thicknessList = resp['result'];
            } else {
                this.service.errorToast(resp['statusMsg'])

            }

        }, err => { })
    this.data.qty = '';
    this.data.size = '';
    this.data.thickness = '';
}
getProductListForComparison() {
    this.comparisonList = [];
    this.service.addData({ 'brand': this.data.brand.brand_code, "thickness": this.data.thickness }, "AppOrder/allsegmentitems")
        .then(resp => {
            if (resp['statusCode'] == 200) {
                let productDataList = resp['result'];  // Assuming multiple products are returned

                // Loop through the product data to calculate prices and create comparison array
                for (let productData of productDataList) {
                    // Set MRP based on product type
                    let productMRP = (this.data.product_type == 'S') ? productData.mrp : productData.mrpSS;

                    // Set quantity to 1 for price comparison
                    let quantity = 1;

                    // Calculate total price before discounts
                    let total_price_before_discounts = productMRP * quantity;

                    // Apply discounts and calculate prices with and without GST
                    let priceWithoutGST = this.applyDiscounts(total_price_before_discounts, this.data.discount_percentages || [], false);
                    let priceWithGST = this.applyDiscounts(total_price_before_discounts, this.data.discount_percentages || [], true);

                    // Construct the comparison data for each product
                    this.comparisonList.push({
                        'product_name': productData.product_name,
                        'product_code': productData.product_code,
                        'size': productData.size,  // Assuming 'size' is available in the response
                        'weight': productData.weight,
                        'mrp': productMRP,
                        'total_price_without_gst': priceWithoutGST,  // Price without GST
                        'total_price_with_gst': priceWithGST,  // Price with GST
                        'qty': 1  // Quantity is always 1 for comparison
                    });
                }

                console.log(this.comparisonList, "Product comparison list with price, size, and GST details");

            } else {
                this.service.errorToast(resp['statusMsg']);
            }
        }, err => {
            console.error(err);
        });
}

applyDiscounts(price, discounts, includeGST) {
    let discountedPrice = price;

    // Apply discounts if available
    for (let discount of discounts) {
        if (discount) {
            discountedPrice -= (discountedPrice * (parseFloat(discount) / 100));
        }
    }

    // Optionally add freight charges
    if (this.data.freight) {
        let freightAmount = discountedPrice * (parseFloat(this.data.freight) / 100);
        discountedPrice += freightAmount;
    }

    // Add GST if includeGST is true
    if (includeGST) {
        let gstAmount = discountedPrice * (18 / 100);  // Assuming 18% GST
        discountedPrice += gstAmount;
    }

    return discountedPrice;
}



getProductDiscountData() {
    this.service.addData({ 'brand': this.data.brand.brand_code,'category':this.data.product_type,'dr_id': this.Dr_id ? this.Dr_id : this.data.type_name.id}, "AppOrder/segmentItemsDiscount")
        .then(resp => {
            if (resp['statusCode'] == 200) {
                this.master_discount= resp['master_discount'];
                this.all_segment_with_discount_list= resp['all_segment_with_discount_list'];
                this.data.freight = (resp['freight'].freight == null || resp['freight'].freight === '') ? 0 : resp['freight'].freight;

                if(this.all_segment_with_discount_list[0].discount_1+this.all_segment_with_discount_list[0].discount_2+this.all_segment_with_discount_list[0].discount_3+this.all_segment_with_discount_list[0].discount_4+this.all_segment_with_discount_list[0].discount_5+this.all_segment_with_discount_list[0].discount_6+this.all_segment_with_discount_list[0].discount_7+this.all_segment_with_discount_list[0].discount_8 >0){
                    this.discount_percentages=resp['all_segment_with_discount_list'][0]
                    this.data.discount_percentages = [
                        this.discount_percentages.discount_1,
                        this.discount_percentages.discount_2,
                        this.discount_percentages.discount_3,
                        this.discount_percentages.discount_4,
                        this.discount_percentages.discount_5,
                        this.discount_percentages.discount_6,
                        this.discount_percentages.discount_7,
                        this.discount_percentages.discount_8
                    ]; 
                }
                else{
                    this.discount_percentages=resp['master_discount'][0];

                     this.data.discount_percentages = [
                        this.discount_percentages.discount_1,
                        this.discount_percentages.discount_2,
                        this.discount_percentages.discount_3,
                        this.discount_percentages.discount_4,
                        this.discount_percentages.discount_5,
                        this.discount_percentages.discount_6,
                        this.discount_percentages.discount_7,
                        this.discount_percentages.discount_8,
                        
                    ];
                }

              this.getProductListForComparison()
                
            } else {
                // this.service.errorToast(resp['statusMsg'])

            }
        }, err => { })
}

}
