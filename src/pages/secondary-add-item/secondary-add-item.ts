import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, AlertController, Navbar, ModalController, Platform, Nav, App, Events } from 'ionic-angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ViewChild } from '@angular/core';
import { SecondaryOrderDetailPage } from '../secondary-order-detail/secondary-order-detail';



@IonicPage()
@Component({
  selector: 'page-secondary-add-item',
  templateUrl: 'secondary-add-item.html',
})
export class SecondaryAddItemPage {
  @ViewChild(Navbar) navBar: Navbar;

  @ViewChild('category') categorySelectable: IonicSelectableComponent;
  @ViewChild('itemSelectable') itemSelectable: IonicSelectableComponent;
  @ViewChild('productCode') prod_codeSelectable: IonicSelectableComponent;
  @ViewChild('selectComponent') selectComponent: IonicSelectableComponent;
  @ViewChild('distributorSelectable') distributorSelectable: IonicSelectableComponent;

  drList: any = [];
  brandList: any = [];
  colorList: any = [];
  total_Order_amount: any = '';
  product_detail: any = {};
  data: any = {};
  form: any = {};
  order_id: any = ''
  user_data: any = {};
  disable_marka: boolean = false;
  addToListButton: boolean = true;
  btndisable: boolean = false;
  order_data: any = {};
  type: any = '';
  order_total: any = '';
  order_grand_total: any = '';
  cart_array: any = []
  order_item: any = [];
  fixedBrand: any = [];
  Distributor_list: any = [];
  checkinData: any = {};
  userType: any;
  itemType: any;
  showSave = false;
  showEdit = true;
  active: any = {};
  ItemGST: any = '';
  Dist_state = ''
  Dr_type = ''
  color_list: any = [];
  brand_list: any = [];
  product: any = {};
  SpecialDiscountLable: any = ''
  leave: any = 0;
  distributor_list: any = [];
  sub_total: any = 0;
  dis_amt: any = 0;
  gst_amount: any = 0;
  net_total: any = 0;
  spcl_dis_amt: any = 0
  grand_total: any = 0;
  order_gst: any = 0;
  order_discount: any = 0;
  from_product = false
  filter: any = {};
  no_rec: any = {};
  userId: any = {};
  product_list: any = [];
  order: any = {};
  flag: any = {};
  sizeList: any = [];
  qty: any;
  product_resp: boolean;
  mode = 0;
  drtype: any;
  checkin_id: any = 0;
  idMode: any;
  retailerID: any;
  tmpdata: any = {};
  disableSelect: boolean = false;
  disableSelectFromCheckin: boolean = false;
  add_list: any = [];
  total_qty: any = 0;
  netamount: any = 0;
  total_gst_amount: any = 0;
  total_discount_amount: any = 0;
  new_grand_total: any = 0;
  btnDisableSave: boolean = false;
  btnDisableDraft: boolean = false;
  lastdiscountPercent: any = 0;
  lastGstPercent: any = 0;
  search: any;
  orderId: any = ''
  Type: any = ''
  thicknessList: any = []
  warehouseList: any = []

  productData: any = []
  totalPrice: number;
  extra_discount_amount: number;
  priceAfterextraDiscount: any;
  totalGSTApplied: number;
  totalPriceAfterGST: number;
  extraDiscountPercentage: any;
  totalFreightApplied: number;
  master_discount: any;
  all_segment_with_discount_list: any;
  discount_percentages: any;
  constructor(
    public navCtrl: NavController,
    public events: Events,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public viewCtrl: ViewController
    , public service: MyserviceProvider,
    public toastCtrl: ToastController,
    private alertCtrl: AlertController,
    public storage: Storage,
    public modal: ModalController,
    public platform: Platform,
    public db: MyserviceProvider,
    public appCtrl: App) {
    this.data.gst_type = 'Gst Paid';
    this.drtype = this.navParams['data'].type;
    this.Type = this.navParams.get('type');
    if (this.navParams.get('order_data') && this.navParams.get('order_item')) {
      this.disableSelect = true;
      this.retailerID = this.navParams.get('order_data')['id'];
      this.tmpdata.id = this.navParams.get('order_data')['id']
      this.tmpdata.company_name = this.navParams.get('order_data')['company_name']
      this.tmpdata.dr_id = this.navParams.get('order_data')['dr_id'];
      this.tmpdata.dr_name = this.navParams.get('order_data')['dist_company_name']

      this.distributors(this.tmpdata);
      this.get_distributor_list(this.tmpdata)
    } else {
      this.distributors('hello')
    }
    if (this.navParams.get('dr_type') && this.navParams.get('dr_name') && this.navParams.get('order_type')) {
      if (this.navParams.get('checkin_id')) {
        this.disableSelectFromCheckin = true;
      }
      this.drtype = this.navParams.get('order_type');
      this.data.networkType = this.navParams.get('dr_type');
      this.data.company_name = this.navParams.get('dr_name');
      this.data.id = this.navParams.get('id');
      // this.get_distributor_list(this.data.type_name);
      this.distributors(this.data);
    }

    if (this.navParams.get('for_order')) {
      this.checkinData = this.navParams.get('for_order')
      this.data.networkType = this.checkinData.dr_type;
    }

    this.order_data = this.navParams.get("order_data");
    this.order_item = this.navParams.get("order_item");

    if (this.order_data && this.order_item) {
      this.getBrands()
      for (let i = 0; i < this.order_item.length; i++) {
        this.order_item[i].total_amount = this.order_item[i].total_amount
        this.order_item[i].amount = this.order_item[i].sub_total;
      }
      this.totalPrice = parseFloat(this.order_data.order_total);
      this.total_qty = parseFloat(this.order_data.total_order_qty);
      this.total_gst_amount = parseFloat(this.order_data.order_gst);
      this.total_Order_amount = parseFloat(this.order_data.order_total);
      this.order_discount = parseFloat(this.order_data.order_discount);
      this.order_total = parseFloat(this.order_data.order_grand_total);
      this.total_gst_amount = parseFloat(this.order_data.order_gst);
      this.new_grand_total = parseFloat(this.order_data.order_grand_total);
      this.extraDiscountPercentage = parseFloat(this.order_data.extraDiscountPercentage);
      this.data.estimate_delivery_date = this.order_data.estimate_delivery_date;
      this.data.warehouse = this.order_data.warehouse;
      this.data.remark = this.order_data.order_create_remark;
    }
    if (this.order_item && this.order_item.length > 0) {
      this.service.addData({ "Id": this.navParams.get('order_data')['id'] }, "AppOrder/secondaryOrderDetail").then((result) => {
        this.product_list = result['result']['item_details'];
        this.data.discount = result['result']['extraDiscountPercentage'];

        this.product_list.forEach((item) => {
          const discountString = item.discount_percentages; // Access the discount_percentages string
          item.discount_percentages = discountString.split(',').map(Number); // Convert to array of numbers and store in item
        });
        if(result['result']['totalGSTApplied']==0){
         this.data.gst_type == 'Gst Extra'
        }
        console.log(this.extraDiscountPercentage)
        this.data.product_type=this.product_list[0].product_type
        this.order_id = this.navParams.get('order_data')['id']


      })
    }


    if (this.navParams.get("data")) {
      this.data = this.navParams.get("data");
      if (this.data.from_product == true) {
        this.cart_array = this.navParams.get("cart_array");
        if (this.data.order_data) {
          this.order_data = this.data.order_data;
        }

        this.cart_array.map((item) => {
          this.product = item
        })

      }

    }

    if (this.order_data && this.order_data.order_id) {

      this.user_data = this.order_data;
    }

    this.events.subscribe(('AddOrderBackAction'), (data) => {
      this.backAction()

    })

  }
  networkType: any = []
  getNetworkType() {
    this.service.addData('', "Dashboard/allNetworkModule").then((result => {
      this.networkType = result['modules'];
    }))
  }
  distributors(data) {
    if (this.navParams.get('order_item') && this.navParams.get('order_data')) {
      this.drList.push({ id: data.id, company_name: data.company_name })
      this.data.type_name = this.drList[0]
    } else if (this.navParams.get('checkin_id')) {
      this.service.addData({ 'dr_type': '3' }, 'AppOrder/followupCustomer').then((result) => {
        this.drList = result['result'];
        let Index = this.drList.findIndex(row => row.id == this.retailerID)
        if (Index != -1) {
          this.data.type_name = this.drList[Index]
          this.get_distributor_list('data')
        } else {
        }

      });

    } else {
      this.Dr_type
      this.service.addData({ 'dr_type': '3' }, 'AppOrder/followupCustomer').then((result) => {
        this.drList = result['result'];
      });
    }
  }


  get_distributor_list(name) {

    // this.data.type_name.distributor = []
    if (this.navParams.get('order_item') && this.navParams.get('order_data')) {
      this.Distributor_list.push({ id: name.dr_id, company_name: name.dr_name })
      this.data.distributor_id = this.Distributor_list[0]
    } else {
      this.service.addData({ 'dealer_id': name.id }, 'AppOrder/newfollowupCustomer').then((result) => {
        this.drList = result['result'];
        if (result['statusCode'] == 200) {
          this.Distributor_list = result['distributor_arr']
        } else {
          this.service.errorToast(result['statusMsg'])
        }
      })
    }
  }
  ionViewDidLoad() {
    this.storage.get('user_type').then((userType) => {
      if (userType == 'OFFICE') {
        this.data.networkType = 3;
        this.userType = userType
      }

    });
  }

  ionViewDidEnter() {

    this.sub_total = 0;
    this.dis_amt = 0;
    this.gst_amount = 0;
    this.net_total = 0;
    this.spcl_dis_amt = 0
    this.grand_total = 0;
    this.order_gst = 0;
    this.cart_array.map((item) => {
      this.product = item

    })
    //     }    
    // }

    this.navBar.backButtonClick = () => {

      this.backAction()

    };
    this.platform.registerBackButtonAction(() => {
      this.backAction()
    });
    let nav = this.appCtrl.getActiveNav();
    if (nav && nav.getActive()) {
      let activeView = nav.getActive().name;
      let previuosView = '';
      if (nav.getPrevious() && nav.getPrevious().name) {
        previuosView = nav.getPrevious().name;
      }
    }
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
  }
  getSize(thickness) {
    this.service.addData({ 'brand': this.data.brand.brand_code, "thickness": thickness }, "AppOrder/productSize")
      .then(resp => {
        if (resp['statusCode'] == 200) {
          this.sizeList = resp['result'];

        } else {
          this.service.errorToast(resp['statusMsg'])

        }
      }, err => { })
    this.data.qty = '';
  }

  getProductData() {
    this.service.addData({ 'brand': this.data.brand.brand_code, "thickness": this.data.thickness, "size": this.data.size }, "AppOrder/segmentItems")
      .then(resp => {
        if (resp['statusCode'] == 200) {
          this.productData = resp['result'];
          this.getProductDiscountData()
          this.data.product_name = this.productData.product_name
          this.data.product_code = this.productData.product_code
          this.data.weight = this.productData.weight
          if(this.data.product_type=='S'){
            this.data.mrp = this.productData.mrp
        }
        else{
            this.data.mrp = this.productData.mrpSS
        }
          this.data.segment_id = this.productData.category_id
          this.data.segment_name = this.productData.category
          this.data.id = this.productData.id

         
        } else {
          this.service.errorToast(resp['statusMsg'])

        }
      }, err => { })
  }

  getProductDiscountData() {
    this.service.addData({ 'brand': this.data.brand.brand_code,'category':this.data.product_type,'dr_id': this.order_data.delivery_from}, "AppOrder/segmentItemsDiscountforsecorder")
        .then(resp => {
            if (resp['statusCode'] == 200) {
                this.master_discount= resp['master_discount'];
                this.all_segment_with_discount_list= resp['all_segment_with_discount_list'];
                this.data.freight = (resp['freight'].freight == null || resp['freight'].freight === '') ? 0 : resp['freight'].freight;

                // if(this.all_segment_with_discount_list[0].discount_1+this.all_segment_with_discount_list[0].discount_2+this.all_segment_with_discount_list[0].discount_3+this.all_segment_with_discount_list[0].discount_4+this.all_segment_with_discount_list[0].discount_5+this.all_segment_with_discount_list[0].discount_6+this.all_segment_with_discount_list[0].discount_7+this.all_segment_with_discount_list[0].discount_8 >0){
                //     this.discount_percentages=resp['all_segment_with_discount_list'][0]
                //     this.data.discount_percentages = [
                //         this.discount_percentages.discount_1,
                //         this.discount_percentages.discount_2,
                //         this.discount_percentages.discount_3,
                //         this.discount_percentages.discount_4,
                //         this.discount_percentages.discount_5,
                //         this.discount_percentages.discount_6,
                //         this.discount_percentages.discount_7,
                //         this.discount_percentages.discount_8
                //     ]; 
                // }
                // else{
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
                // }
                
            } else {
                // this.service.errorToast(resp['statusMsg'])

            }
        }, err => { })
}


  backAction() {

    if (this.product_list.length > 0) {
      let alert = this.alertCtrl.create({
        title: 'Are You Sure?',
        subTitle: 'Your Order Data Will Be Lost',
        cssClass: 'alert-modal',

        buttons: [{
          text: 'No',
          role: 'cancel',
          handler: () => {
            this.service.presentToast('Your Data is Safe')
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.navCtrl.pop();
            this.product_list = [];

          }
        }]
      });
      alert.present();
    }
    else {
      this.navCtrl.pop();
    }
  }


  OnlyNumber(event: any) {
    const pattern = /[0-9]+/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }
  }


  blankValue() {
    this.data.qty = '';
    this.data.size = '';
    this.data.thickness = '';
    this.data.brand = '';
    // this.data.product_type='';
  }
  tonWeight: any = 0
  totalWeight: any = 0


  save_orderalert(type) {
    var str
    if (this.grand_total > 20000000) {
      let alert = this.alertCtrl.create({
        title: 'Max order value reached',
        subTitle: 'Maximum order value is 2 Cr. !',
        cssClass: 'alert-modal',
        buttons: [{
          text: 'Okay',
          role: 'Okay',
          handler: () => {
          }
        },
        ]
      });
      alert.present();
      return
    }
    if (type == 'draft') {
      str = 'You want to save this order as draft ?';
    }
    else {
      str = 'You want to submit this order ?';
    }
    let alert = this.alertCtrl.create({
      title: 'Are You Sure?',
      subTitle: str,
      cssClass: 'alert-modal',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
        }
      },
      {
        text: 'Confirm',
        cssClass: 'close-action-sheet',
        handler: () => {
          this.save_order(type);
        }
      }]
    });
    alert.present();
  }

  item_list: any = [];
  dr_id: any = {};




  onCloseItemList() {
    this.itemSelectable._searchText = '';
  }


//   addToList() {
//     // Check if product category is selected
//     if (!this.data.product_type) {
//         this.service.errorToast("Add Product Category");
//         return;
//     }

//     // Ensure brand is using brand_code
//     this.data.brand = this.data.brand.brand_code;

//     // Check if the product list already contains an item with the same brand, thickness, size, and product type
//     if (this.product_list.length > 0) {
//         let existIndex = this.product_list.findIndex(row => 
//             row.brand == this.data.brand && 
//             row.thickness == this.data.thickness && 
//             row.size == this.data.size &&
//             row.product_type == this.data.product_type
//         );

//         // If product exists, update its quantity and price
//         if (existIndex != -1) {
//             this.product_list[existIndex]['qty'] += parseFloat(this.data.qty);
//             this.product_list[existIndex]['total_price'] = parseFloat(this.product_list[existIndex]['qty']) * parseFloat(this.data.mrp); // Update total price
//             this.blankValue();
//         } 
//         // If product does not exist, add it to the list
//         else {
//             this.product_list.push({
//                 'brand': this.data.brand,
//                 'product_name': this.data.product_name,
//                 'weight': this.data.weight,
//                 'product_code': this.data.product_code,
//                 'product_id': this.data.id,
//                 'segment_id': this.data.segment_id,
//                 'segment_name': this.data.segment_name,
//                 'product_type': this.data.product_type,
//                 'thickness': this.data.thickness,
//                 'id': this.data.id,
//                 'size': this.data.size,
//                 'qty': parseFloat(this.data.qty),
//                 'total_price': parseFloat(this.data.qty) * parseFloat(this.data.mrp) // Calculate total price
//             });
//             this.blankValue();
//         }
//     } 
//     // If product list is empty, add the first product
//     else {
//         this.product_list.push({
//             'brand': this.data.brand,
//             'product_name': this.data.product_name,
//             'weight': this.data.weight,
//             'product_code': this.data.product_code,
//             'product_id': this.data.id,
//             'segment_id': this.data.segment_id,
//             'segment_name': this.data.segment_name,
//             'product_type': this.data.product_type,
//             'thickness': this.data.thickness,
//             'id': this.data.id,
//             'size': this.data.size,
//             'qty': parseFloat(this.data.qty),
//             'total_price': parseFloat(this.data.qty) * parseFloat(this.data.mrp) // Set total price for the first item
//         });
//         this.blankValue();
//     }

//     // Reset total values
//     this.total_qty = 0;
//     this.totalWeight = 0;
//     this.totalPrice = 0; // Initialize total price

//     // Recalculate total quantity, weight, and price
//     for (let i = 0; i < this.product_list.length; i++) {
//         this.total_qty += parseInt(this.product_list[i]['qty']);
//         // this.totalWeight += parseFloat(this.product_list[i]['weight']) * this.product_list[i]['qty'];
//         this.totalPrice += parseFloat(this.product_list[i]['total_price']); // Sum up total price for all products
//     }

   
//     this.applyExtraDiscounts(this.extraDiscountPercentage || 0);

//   console.log(this.extraDiscountPercentage, "line 574");
//   console.log(this.totalPrice, "line 575");
// }

applyDiscounts(price, discounts) {
  let discountedPrice = price;
  
  // Apply successive discounts only to the base price
  for (let discount of discounts) {
      if (discount) {
          discountedPrice -= (discountedPrice * (parseFloat(discount) / 100));
      }
  }
  return discountedPrice; // Return price after discounts only
}

// Helper function to apply freight charges
applyfreight(price, freight) {
  const freightAmount = price * (parseFloat(freight) / 100);
  this.totalFreightApplied += freightAmount;
  return price + freightAmount; // Return price after freight only
}

addToList() {
  // Check if product category is selected
  if (!this.data.product_type) {
      this.service.errorToast("Add Product Category");
      return;
  }

  // Ensure brand is using brand_code
  this.data.brand = this.data.brand.brand_code;

  // Variables for repeated use
  const qty = parseFloat(this.data.qty);
  const mrp = parseFloat(this.data.mrp);
  const total_price = qty * mrp;

  // Apply discounts to calculate the discounted price
  const price_with_discount = this.applyDiscounts(total_price, this.data.discount_percentages || []);

  // Apply freight charges to the discounted price
  const price_with_freight = this.applyfreight(price_with_discount, this.data.freight || 0);

  // Function to create new product entry
  const createNewProduct = () => {
      return {
          'brand': this.data.brand,
          'product_name': this.data.product_name,
          'weight': this.data.weight,
          'product_code': this.data.product_code,
          'product_id': this.data.id,
          'segment_id': this.data.segment_id,
          'segment_name': this.data.segment_name,
          'product_type': this.data.product_type,
          'thickness': this.data.thickness,
          'id': this.data.id,
          'size': this.data.size,
          'qty': qty,
          'discount_percentages': this.data.discount_percentages, 
          'freight': this.data.freight,
          'total_price': total_price, // Set total price for the item without discounts or freight
          'price_with_discount': price_with_discount, // Set price after discount
          'price_with_freight': price_with_freight // Set price after applying freight
      };
  };

  // Check if the product list already contains an item with the same brand, thickness, size, and product type
  const existIndex = this.product_list.findIndex(row => 
      row.brand === this.data.brand && 
      row.thickness === this.data.thickness && 
      row.size === this.data.size &&
      row.product_type === this.data.product_type
  );

  // If product exists, update its quantity, total price, and prices with discount and freight
  if (existIndex !== -1) {
      const existingProduct = this.product_list[existIndex];
      existingProduct.qty += qty;
      existingProduct.total_price = existingProduct.qty * mrp; // Update total price without discount or freight
      existingProduct.price_with_discount = this.applyDiscounts(existingProduct.total_price, existingProduct.discount_percentages); // Update price after discount
      existingProduct.price_with_freight = this.applyfreight(existingProduct.price_with_discount, existingProduct.freight); // Update price after freight
  } 
  // If product does not exist, add it to the list
  else {
      this.product_list.push(createNewProduct());
  }

  // Reset form values
  this.blankValue();

  // Reset total values
  this.total_qty = 0;
  this.totalWeight = 0;
  this.totalPrice = 0;
  // this.totalDiscountedPrice = 0;
  // this.totalPriceWithFreight = 0; // Initialize total price with freight

  // Recalculate total quantity, weight, price, and freight
  this.product_list.forEach(product => {
      this.total_qty += product.qty;
      // Uncomment the line below if you need to calculate total weight
      // this.totalWeight += parseFloat(product.weight) * product.qty;
      this.totalPrice += product.total_price; // Sum up total price without discount or freight
      // this.totalDiscountedPrice += product.price_with_discount; // Sum up price after discount
      // this.totalPriceWithFreight += product.price_with_freight; // Sum up price after freight
  });

  // Apply extra discounts if applicable
  this.applyExtraDiscounts(this.extraDiscountPercentage || 0);

  console.log(this.extraDiscountPercentage, "line 574");
  // console.log(this.totalPriceWithFreight, "line 575");
}



  DeleteItem(i) {
    let alert = this.alertCtrl.create({
      title: 'Are You Sure?',
      subTitle: 'Your Want To Delete This Item ',
      cssClass: 'alert-modal',

      buttons: [{
        text: 'No',
        role: 'cancel',
        handler: () => {
        }
      },
      {
        text: 'Yes',
        handler: () => {
          this.listdelete(i)

        }
      }]
    });
    alert.present();
  }
  listdelete(i) {
    this.product_list.splice(i, 1);
    this.total_qty = 0;
    this.totalWeight = 0;
    this.tonWeight = 0;
    this.totalPrice=0
    this.totalGSTApplied = 0;
   
    this.extra_discount_amount = 0;
    this.priceAfterextraDiscount = 0;
    this.totalPriceAfterGST = 0;
    


    for (let i = 0; i < this.product_list.length; i++) {
      this.total_qty += parseInt(this.product_list[i]['qty']);
      this.totalPrice += parseFloat(this.product_list[i]['total_price']);

    }
        // Reapply extra discounts if applicable
        if (this.extraDiscountPercentage > 0) {
          this.applyExtraDiscounts(this.extraDiscountPercentage);
      } else {
          this.totalPriceAfterGST = this.totalPrice; // Reset to total price if no discounts
      }
    console.log(this.extraDiscountPercentage,"line 602")
    
  }


  save_order(type) {


    this.btndisable = true;
    this.leave = 1
    this.user_data.type = this.data.networkType;
    if (this.data['type_name'].lead_type == "Lead" && this.data['type_name'].type == "3") {
      this.data.delivery_from = this.data.delivery_from.assign_distributor_id;
    } else {
      this.data.delivery_from = this.data['type_name'].assign_distributor_id;
    }
    // if (!this.data.remark) {
    //   this.btnDisableSave = false;
    //   return this.service.errorToast("Please add remarks");
    // }

    if (this.data['type_name'].lead_type == "Lead" && this.data['type_name'].type == "3") {
      this.data.delivery_from = this.data.delivery_from.assign_distributor_id;
    } else {
      this.data.delivery_from = this.data['type_name'].assign_distributor_id;
    }
    if (this.navParams.get('checkin_id') || this.navParams.get('Dist_login')) {
      this.data.order_type = 'VISIT ORDER'
    } else {
      this.data.order_type = 'PHONE ORDER'

    }
    this.user_data.totalPrice = this.totalPrice;
    this.user_data.order_discount = this.order_discount;
    this.user_data.special_discount_amount = this.spcl_dis_amt;
    this.user_data.Disctype = this.type;
    this.user_data.gst_type = this.data.gst_type;
    this.user_data.SpecialDiscountLable = this.SpecialDiscountLable
    this.user_data.dr_id = this.data.type_name.id
    this.user_data.distributor_id = this.data.distributor_id.id
    this.user_data.remark = this.data.remark
    if (this.data.distributor_id && this.data.delivery_from)
      this.user_data.distributor_id = this.data.delivery_from

    var orderData = { 'sub_total': this.netamount, 'dis_amt': this.dis_amt, 'grand_total': this.new_grand_total, 'total_gst_amount': this.total_gst_amount, 'total_qty': this.total_qty, 'net_total': this.netamount }

    if (type == 'draft') {
      this.btnDisableDraft = true;
    }
    if (type == 'submit') {
      this.btnDisableSave = true;
    }
    if (this.user_data.type == '17') {
      this.user_data.site_id = this.data.type_name.site_id
    }
    this.user_data.extra_discount_amount = this.extra_discount_amount;
    this.user_data.priceAfterextraDiscount = this.priceAfterextraDiscount;
    this.user_data.totalGSTApplied = this.totalGSTApplied;
    this.user_data.totalPriceAfterGST = this.totalPriceAfterGST;
    this.user_data.extraDiscountPercentage = this.extraDiscountPercentage;

    this.service.addData({ "cart_data": this.product_list, "user_data": this.user_data, "orderId": this.order_id }, "AppOrder/secondaryOrderAddItem").then(resp => {
      if (resp['statusCode'] == 200) {
        this.btnDisableDraft = false;
        this.btnDisableSave = false;
        var toastString = ''
        this.service.successToast(resp['statusMsg'])
        if (this.navParams.get('dr_type') && this.navParams.get('dr_name') && this.navParams.get('order_type')) {
          this.navCtrl.pop();
        }
        else {
          this.navCtrl.popTo(SecondaryOrderDetailPage)
        }

        this.service.presentToast(toastString)
      } else {
        this.btnDisableDraft = false;
        this.btnDisableSave = false;
        this.service.successToast(resp['statusMsg'])
      }
    }, error => {
      this.btndisable = false;
      this.btnDisableDraft = false;
      this.btnDisableSave = false;
      this.service.Error_msg(error);
      this.service.dismiss();
    })


  }



  editRate(id, index) {
    this.active[index] = Object.assign({ 'qty': "1" });
    this.showSave = true;
    this.idMode = id;
    this.product_list[index].edit_true = false;
  }


  updateRate(editedRate, index) {
    this.idMode = 0;
    this.active = {};
    this.product_list[index].edit_true = true;
  }


  applyExtraDiscounts(extraDiscount) {
    // Reset the values
    this.totalGSTApplied = 0;
    this.extraDiscountPercentage = 0;
    this.extra_discount_amount = 0;
    this.priceAfterextraDiscount = 0;
    this.totalPriceAfterGST = 0;

    console.log(extraDiscount,"line 710")

    // Check if extraDiscount is zero or invalid
    if (extraDiscount === 0 || isNaN(extraDiscount)) {
        console.log("Extra discount is zero or invalid, no discount to apply.");
        // this.totalPriceAfterGST = this.totalPrice; // No change in total price
        this.priceAfterextraDiscount = this.totalPrice

        if (this.data.gst_type == 'Gst Paid') {
          this.totalGSTApplied = this.applyGST(parseFloat(this.priceAfterextraDiscount));
          console.log(this.totalGSTApplied, "line 492");
          this.totalPriceAfterGST = this.priceAfterextraDiscount + this.totalGSTApplied;
          console.log(this.totalPriceAfterGST, "line 494");
      } else {
          this.totalGSTApplied = 0;
          this.totalPriceAfterGST = this.priceAfterextraDiscount;
      }
        return;
    }

    // Set the extra discount percentage
    this.extraDiscountPercentage = extraDiscount;

    // Check if totalPrice is zero or invalid
    if (this.totalPrice === 0 || isNaN(this.totalPrice)) {
        console.log("Total price is zero or invalid, no discount or GST to apply.");
        this.totalPriceAfterGST = 0;
        return;
    }

    console.log(this.totalPrice, "line 479");

    // Calculate discount amount based on total price
    let discountAmount = this.totalPrice * (parseFloat(extraDiscount) / 100);
    this.extra_discount_amount = discountAmount;
    console.log(this.extra_discount_amount, "line 486");

    // Calculate price after applying the extra discount
    this.priceAfterextraDiscount = this.totalPrice - this.extra_discount_amount;
    console.log(this.priceAfterextraDiscount, "line 489");

    // Handle GST logic
    if (this.data.gst_type == 'Gst Paid') {
        this.totalGSTApplied = this.applyGST(parseFloat(this.priceAfterextraDiscount));
        console.log(this.totalGSTApplied, "line 492");
        this.totalPriceAfterGST = this.priceAfterextraDiscount + this.totalGSTApplied;
        console.log(this.totalPriceAfterGST, "line 494");
    } else {
        this.totalGSTApplied = 0;
        this.totalPriceAfterGST = this.priceAfterextraDiscount;
    }

    // Optionally save the order
    // this.save_order();
}


  applyGST(price) {
    let gstAmount = price * (18 / 100);
    return gstAmount; // Return the calculated GST amount
  }

}

