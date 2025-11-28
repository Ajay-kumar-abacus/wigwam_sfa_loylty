import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, AlertController, Navbar, ModalController, Platform, Nav, App, Events, ActionSheetController } from 'ionic-angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { OrderListPage } from '../order-list/order-list';
import { ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { CartDetailPage } from '../cart-detail/cart-detail';
import { ViewChild } from '@angular/core';
import { ProductsPage } from '../products/products';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { PrimaryOrderDetailPage } from '../primary-order-detail/primary-order-detail';
import { toArray } from 'rxjs/operator/toArray';
import { Device } from '@ionic-native/device';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ConstantProvider } from '../../providers/constant/constant';
declare let cordova: any;
@IonicPage()
@Component({
    selector: 'page-primary-add-item',
    templateUrl: 'primary-add-item.html',
})
export class PrimaryAddItemPage {
    @ViewChild(Navbar) navBar: Navbar;
    @ViewChild('itemselectable') itemselectable: IonicSelectableComponent;
    @ViewChild('subCategory') subcatSelectable: IonicSelectableComponent;
    @ViewChild('productCode') prod_codeSelectable: IonicSelectableComponent;
    @ViewChild('selectComponent') selectComponent: IonicSelectableComponent;
    @ViewChild('distributorSelectable') distributorSelectable: IonicSelectableComponent;
    distributorSelected: any = false
    categoryList: any = [];
    data: any = {};
    form: any = {};
    catCode_List: any = [];
    segment_list2: any = [];
    // total_item_discount: any =[]
    user_state: any = '';
    autocompleteItems: any = [];
    order_detail: any = {};
    user_data: any = {};
    itemType: any = {};
    disable_marka: boolean = false;
    btndisable: boolean = false;
    btndisable2: boolean = false;
    disable_transport: boolean = false;
    order_data: any = {};
    special_discount: any = 0;
    type: any = '';
    order_id: any = '';
    cart_array: any = []
    adddMoreItem: any = false
    order_item: any = [];
    checkinData: any = {};
    userType: any;
    prod_cat_list;
    sub_total_before_cd: any = 0;
    cd_value: any = 0;
    sub_total_after_cd: any = 0;
    ins_value: any = 0;
    grand_total_before_tcs: any = 0;
    tcs_value: any = 0;
    order_grand_total: any = 0;
    showSave = false;
    showEdit = true;
    active: any = {};
    addToListButton: boolean = true;
    ItemGST: any = '';
    Dist_state = ''
    Dr_type = '';
    search: any
    total_Order_amount: any = ''
    order_total: any = ''
    color_list: any = [];
    brand_list: any = [];
    product: any = {};
    show_price: any = false;
    SpecialDiscountLable: any = ''
    leave: any = 0;
    district_list: any = []
    BillingAddressList: any = []
    temp_product_array: any = [];
    cash_discount_percent: any = 0;
    distributor_list: any = [];
    grand_amt: any = {};
    sub_total: any = 0;
    dis_amt: any = 0;
    gst_amount: any = 0;
    orderEditFlag: any = false;
    net_total: any = 0;
    spcl_dis_amt: any = 0
    grand_total: any = 0;
    order_gst: any = 0;
    distributor_network_list: any = [];
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
    distributorlist: any = [];
    drtype: any;
    checkin_id: any = 0;
    idMode: any;
    retailerID: any;
    city_list1: any = [];
    state_list: any = []
    tmpdata: any = {};
    disableSelect: boolean = false;
    disableSelectFromCheckin: boolean = false;
    temp_add_list: any = [];
    new_add_list: any = [];
    total_qty: any = 0;
    netamount: any = 0;
    tcs_percent: any = 0;
    fixedBrand: any = [];
    total_gst_amount: any = 0;
    order_discount: any = 0;
    new_grand_total: any = 0;
    drList: any = [];
    product_detail: any = {};
    brandList: any = [];
    colorList: any = [];
    lastGstPercent: any = 0;
    thicknessList: any = []
    warehouseList: any = []
    productData: any = {}
    tonWeight: any = 0
    totalWeight: any = 0
    orderId: any = ''
    order_status: any = ''
    warhouse_data: any;
    totalPrice: number;
    master_discount: any;
    all_segment_with_discount_list: any;
    discount_percentages: any;
    totalDiscount: number;
    totalPriceQty: number;
    freight: any;
    totalPriceBeforeDiscount: number;
    totalDiscountApplied: number;
    totalPriceAfterGST: number;
    totalGSTApplied: number;
    totalPriceAfterFreight: number;
    totalFreightApplied: number;
    totalFreight: number;
    totalDiscountAmount: number;
    totalFreightAmount: number;
    constructor(
        public navCtrl: NavController,
        public events: Events,
        public loadingCtrl: LoadingController,
        public navParams: NavParams,
        public viewCtrl: ViewController,
        public diagnostic: Diagnostic,
        public service1: MyserviceProvider,
        public toastCtrl: ToastController,
        private alertCtrl: AlertController,
        public storage: Storage,
        public Device: Device,
        private camera: Camera,
        public modal: ModalController,
        public platform: Platform,
        public constant: ConstantProvider,
        public actionSheetController: ActionSheetController,
        public service: DbserviceProvider,
        public db: MyserviceProvider,
        public appCtrl: App) {
        console.log(navParams);

        this.order_status = this.navParams.get('order_status');
        this.order_item = this.navParams.get('order_item')
        this.order_data = this.navParams.get('order_data')
        this.drtype = this.navParams['data'].type;
        this.checkin_id = this.navParams.get('checkin_id');
        this.get_states()

        if (this.navParams.get('order_data') && this.navParams.get('order_item')) {
            console.log('in');

            this.disableSelect = true
            this.tmpdata.company_name = this.navParams.get('order_data')['company_name']
            this.tmpdata.id = this.navParams.get('order_data')['dr_id']
            this.order_id = this.navParams.get('order_data')['order_id']
            this.distributors(this.tmpdata)
            this.getBrands();
            this.FetchBillingAddress()

        }
        if (this.order_item && this.order_item.length > 0) {
            console.log("inside detail api call")
            this.db.addData({ "Id": this.navParams.get('order_data')['id'], 'order_status': this.order_status }, "AppOrder/primaryOrdersDetail").then((result) => {
                this.order_detail = result['result'];
                console.log(this.order_detail);
                console.log(this.order_detail.order_total, "line164");
                console.log(this.order_detail.assigned_warehouse);
                this.getWarehouse(this.order_detail.assigned_warehouse)
                this.product_list = result['result']['item_details'];
                this.data.product_type = this.product_list[0].product_type
                console.log(this.data.product_type, "line 169")
                this.order_id = this.navParams.get('order_data')['id']
                console.log(this.order_id, this.navParams.get('order_data')['id'], "this is order id")
                this.data.shipping_address = this.order_detail.shipping_address
                this.order_detail.item_details.forEach((item) => {
                    const discountString = item.discount_percentages; // Access the discount_percentages string
                    item.discount_percentages = discountString.split(',').map(Number); // Convert to array of numbers and store in item
                });
            });
        }
        if (this.order_data && this.order_item) {

            console.log(this.order_data, "line 174")

            this.total_Order_amount = 0
            this.total_qty = parseFloat(this.order_data.total_order_qty);
            this.tonWeight = parseFloat(this.order_data.weight);
            console.log(this.order_data.totalPrice, "line 176")
            console.log(this.order_detail.order_total, "line 177")
            this.totalPrice = parseFloat(this.order_data.order_total);
            this.totalWeight = parseFloat(this.order_data.weight) * 1000;
            this.totalGSTApplied = this.order_data.totalGSTApplied;
            this.totalPriceAfterGST = this.order_data.totalPriceAfterGST;
            this.data.estimate_delivery_date = this.order_data.estimate_delivery_date;
            this.data.warehouse = this.order_data.warehouse;


            this.data.remark = this.order_data.order_create_remark;

        }
    }
    ionViewDidEnter() {

        this.navBar.backButtonClick = () => {
            this.backAction();
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
        console.log(this.order_data);

    }
    networkType: any = []

    distributors(data) {
        this.data.type_name = []
        this.data.segment = {}
        this.navParams.get('checkin_id')
        if ((this.navParams.get('order_item')) || (this.navParams.get('order_data')) || this.navParams.get('checkin_id')) {
            this.drList.push({ id: data.id, company_name: data.company_name })
            this.data.type_name = this.drList[0]
        } else {
            this.Dr_type
            this.service1.addData({ 'dr_type': data }, 'AppOrder/newfollowupCustomer').then((result) => {
                this.drList = result['result'];
            });
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

    getBrands() {

        this.service1.addData({}, "AppOrder/brandList")
            .then(resp => {
                if (resp['statusCode'] == 200) {
                    this.brandList = resp['result'];
                } else {
                    this.service1.errorToast(resp['statusMsg'])

                }
            }, err => { })
    }
    getThickness(brandData) {

        this.service1.addData({ 'brand': brandData.brand_code }, "AppOrder/productThikness")
            .then(resp => {
                if (resp['statusCode'] == 200) {
                    this.thicknessList = resp['result'];
                } else {
                    this.service1.errorToast(resp['statusMsg'])

                }

            }, err => { })
    }
    getSize(thickness) {
        this.service1.addData({ 'brand': this.data.brand.brand_code, "thickness": thickness }, "AppOrder/productSize")
            .then(resp => {
                if (resp['statusCode'] == 200) {
                    this.sizeList = resp['result'];
                    this.getWarehouse(this.order_detail.assigned_warehouse)
                } else {
                    this.service1.errorToast(resp['statusMsg'])

                }
            }, err => { })
    }
    getWarehouse(warehouse) {
        console.log(warehouse);
        this.service1.addData({ 'assigned_warehouse': warehouse ? warehouse : '', 'state': this.order_detail.state }, "AppOrder/fetchWarehouse")
            .then(resp => {
                if (resp['statusCode'] == 200) {
                    this.warehouseList = resp['result'];
                } else {
                    this.service1.errorToast(resp['statusMsg'])

                }
            }, err => { })
    }



    FetchBillingAddress() {
        this.service1.addData({ 'id': this.tmpdata.id }, "AppOrder/fetchPartyAddress")
            .then(resp => {
                if (resp['statusCode'] == 200) {
                    console.log(resp);
                    this.BillingAddressList = resp['dr_address'];
                } else {
                    this.service1.errorToast(resp['statusMsg'])
                }
            }, err => { })
    }
    get_states() {
        this.service1.presentLoading()
        this.service1.addData({}, "AppCustomerNetwork/getStates")
            .then(resp => {
                if (resp['statusCode'] == 200) {
                    this.service1.dismissLoading()
                    this.state_list = resp['state_list'];
                } else {
                    this.service1.dismissLoading()
                    this.service1.errorToast(resp['statusMsg']);
                }
            }, error => {
                this.service1.Error_msg(error);
                this.service1.dismiss();
            })
    }

    get_district() {
        this.service1.addData({ "state_name": this.data.state }, "AppCustomerNetwork/getDistrict")
            .then(resp => {
                if (resp['statusCode'] == 200) {
                    this.district_list = resp['district_list'];
                } else {
                    this.service1.errorToast(resp['statusMsg']);
                }
            },
                err => {
                    this.service1.errorToast('Something Went Wrong!')
                })
    }
    getCityList1() {
        this.form.city1 = [];
        this.service1.addData({ 'district_name': this.data.district, 'state_name': this.data.state, }, 'AppCustomerNetwork/get_city_list').then((result) => {
            if (result['statusCode'] == 200) {
                this.city_list1 = result['city'];
            } else {
                this.service1.errorToast(result['statusMsg']);

            }


        }, err => {
            this.service1.errorToast('Something Went Wrong!')
        });

    }
    saveShippingAddress() {
        this.btndisable2 = true;
        this.service1.addData({ 'state': this.data.state, 'district': this.data.district, 'city': this.data.city, 'address': this.data.address, 'id': this.tmpdata.id }, "AppOrder/insertPartyAddress")
            .then(resp => {
                if (resp['statusCode'] == 200) {
                    this.btndisable2 = false;
                    this.service1.successToast(resp['statusMsg']);
                    this.FetchBillingAddress();
                    this.blank()
                } else {
                    this.btndisable2 = false;
                    this.service1.errorToast(resp['statusMsg'])
                }
            }, err => {
                this.btndisable2 = false;
            })
    }
    blank() {
        this.data.state = '';
        this.data.district = '';
        this.data.city = '';
        this.data.address = '';
        this.data.shipping_address = ''
    }
    getProductData() {
        this.service1.addData({ 'brand': this.data.brand.brand_code, "thickness": this.data.thickness, "size": this.data.size }, "AppOrder/segmentItems")
            .then(resp => {
                if (resp['statusCode'] == 200) {
                    this.productData = resp['result'];
                    this.data.product_name = this.productData.product_name
                    this.data.product_code = this.productData.product_code
                    this.data.weight = this.productData.weight
                    if (this.data.product_type == 'S') {
                        this.data.mrp = this.productData.mrp
                    }
                    else {
                        this.data.mrp = this.productData.mrpSS
                    }
                    this.data.segment_id = this.productData.category_id
                    this.data.segment_name = this.productData.category
                    this.data.id = this.productData.id
                    this.getProductDiscountData()
                } else {
                    this.service1.errorToast(resp['statusMsg'])

                }
            }, err => { })
    }
    getProductDiscountData() {
        this.service1.addData({ 'brand': this.data.brand.brand_code, 'category': this.data.product_type, 'dr_id': this.tmpdata.id }, "AppOrder/segmentItemsDiscount")
            .then(resp => {
                if (resp['statusCode'] == 200) {
                    this.master_discount = resp['master_discount'];
                    this.all_segment_with_discount_list = resp['all_segment_with_discount_list'];
                    this.data.freight = (resp['freight'].freight == null || resp['freight'].freight === '') ? 0 : resp['freight'].freight;

                    if (this.all_segment_with_discount_list[0].discount_1 + this.all_segment_with_discount_list[0].discount_2 + this.all_segment_with_discount_list[0].discount_3 + this.all_segment_with_discount_list[0].discount_4 + this.all_segment_with_discount_list[0].discount_5 + this.all_segment_with_discount_list[0].discount_6 + this.all_segment_with_discount_list[0].discount_7 + this.all_segment_with_discount_list[0].discount_8 > 0) {
                        this.discount_percentages = resp['all_segment_with_discount_list'][0]
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
                    else {
                        this.discount_percentages = resp['master_discount'][0];

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

                } else {
                    // this.service.errorToast(resp['statusMsg'])

                }
            }, err => { })
    }


    backAction() {
        if (this.product_list.length > 0) {
            let alert = this.alertCtrl.create({
                title: 'Are You Sure?',
                subTitle: 'Your Order Data Will Be Lost ',
                cssClass: 'alert-modal',
                buttons: [{
                    text: 'No',
                    role: 'cancel',
                    handler: () => {
                        this.service1.presentToast('Your Data is Safe')
                    }
                },
                {
                    text: 'Yes',
                    cssClass: 'close-action-sheet',
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
            console.log('Array Blank');
        }
    }


    onKeyUp(x) {
        console.log(x);
        if (x.key != '') {
            this.mode = 1;
        }
    }

    test(test) {
        console.log(test);
    }


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
        if (type == 'save') {
            str = 'You want to save this order as draft ?'
        }
        else {
            str = 'You want to submit this order ?'
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
                    this.save_order(type)
                }
            }]
        });
        alert.present();
    }
    segmentFilter: any;

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

    // addToList() {
    //     if (!this.data.product_type) {
    //         this.service1.errorToast("Add Product Category")
    //         return
    //       }
    //     this.data.brand = this.data.brand.brand_code
    //     if (this.product_list.length > 0) {
    //             let existIndex
    //             existIndex = this.product_list.findIndex(row => row.brand == this.data.brand && row.thickness == this.data.thickness && row.size == this.data.size && row.product_type == this.data.product_type);
    //             if (existIndex != -1) {
    //                 this.product_list[existIndex]['qty'] += parseFloat(this.data.qty);
    //                 this.product_list[existIndex]['total_weight'] = parseFloat(this.data.weight)* parseFloat(this.product_list[existIndex]['qty']) 
    //                 this.product_list[existIndex]['total_price'] = parseFloat(this.product_list[existIndex]['qty']) * parseFloat(this.data.mrp);
    //                 this.blankValue();
    //             }
    //             else {
    //                 this.product_list.push({ 
    //                  'brand': this.data.brand,
    //                  'product_name': this.data.product_name,
    //                  'weight': this.data.weight,
    //                  'product_code': this.data.product_code, 
    //                  'product_id': this.data.id, 
    //                  'segment_id': this.data.segment_id, 
    //                  'segment_name': this.data.segment_name, 
    //                  'thickness': this.data.thickness, 
    //                  'product_type': this.data.product_type,
    //                  'id': this.data.id, 
    //                  'size': this.data.size, 
    //                  'qty': parseFloat(this.data.qty),
    //                  'total_weight': parseFloat(this.data.weight)* parseFloat(this.data.qty),
    //                  'total_price': parseFloat(this.data.mrp) * parseFloat(this.data.qty) 

    //                 })

    //                 this.blankValue();
    //             }
    //     }
    //     else {
    //         this.product_list.push({ 
    //             'brand': this.data.brand,
    //             'product_name': this.data.product_name,
    //             'weight': this.data.weight,
    //             'product_code': this.data.product_code, 
    //             'product_id': this.data.id, 
    //             'segment_id': this.data.segment_id, 
    //             'segment_name': this.data.segment_name, 
    //             'thickness': this.data.thickness, 
    //             'product_type': this.data.product_type,
    //             'id': this.data.id, 
    //             'size': this.data.size, 
    //             'qty': parseFloat(this.data.qty) ,
    //             'total_weight': parseFloat(this.data.weight)* parseFloat(this.data.qty),
    //             'total_price': parseFloat(this.data.mrp) * parseFloat(this.data.qty)
    //          })
    //         this.blankValue();
    //     }

    //     this.total_qty = 0;
    //     this.tonWeight = 0;
    //     this.totalWeight = 0;

    //     for (let i = 0; i < this.product_list.length; i++) {
    //         this.total_qty +=  parseInt(this.product_list[i]['qty']);
    //         this.totalWeight +=  parseFloat(this.product_list[i]['total_weight'])
    //         this.totalPrice += parseFloat(this.product_list[i]['total_price']);
    //         this.tonWeight =  parseFloat(this.totalWeight) / 1000

    //     }

    //     this.callToDraft();

    // }
    // addToList() {
    //     if (!this.data.product_type) {
    //         this.service1.errorToast("Add Product Category");
    //         return;
    //     }

    //     this.data.brand = this.data.brand.brand_code;

    //     if (this.product_list.length > 0) {
    //         let existIndex = this.product_list.findIndex(row =>
    //             row.brand == this.data.brand &&
    //             row.thickness == this.data.thickness &&
    //             row.size == this.data.size &&
    //             row.product_type == this.data.product_type
    //         );

    //         // If the product exists in the list, update the quantity, weight, and recalculate total price with discounts
    //         if (existIndex != -1) {
    //             this.product_list[existIndex]['qty'] += parseFloat(this.data.qty);
    //             this.product_list[existIndex]['total_weight'] = parseFloat(this.data.weight) * parseFloat(this.product_list[existIndex]['qty']);

    //             let originalPrice = parseFloat(this.product_list[existIndex]['qty']) * parseFloat(this.data.mrp);
    //             this.product_list[existIndex]['total_price'] = this.applyDiscounts(originalPrice, this.data.discount_percentages);

    //             this.blankValue();
    //         } else {
    //             let total_price = parseFloat(this.data.mrp) * parseFloat(this.data.qty);
    //             total_price = this.applyDiscounts(total_price, this.data.discount_percentages); // Apply discounts

    //             this.product_list.push({
    //                 'brand': this.data.brand,
    //                 'product_name': this.data.product_name,
    //                 'weight': this.data.weight,
    //                 'product_code': this.data.product_code,
    //                 'product_id': this.data.id,
    //                 'segment_id': this.data.segment_id,
    //                 'segment_name': this.data.segment_name,
    //                 'thickness': this.data.thickness,
    //                 'product_type': this.data.product_type,
    //                 'id': this.data.id,
    //                 'size': this.data.size,
    //                 'qty': parseFloat(this.data.qty),
    //                 'total_weight': parseFloat(this.data.weight) * parseFloat(this.data.qty),
    //                 'total_price': total_price // Total price after applying discounts
    //             });

    //             this.blankValue();
    //         }
    //     } else {
    //         let total_price = parseFloat(this.data.mrp) * parseFloat(this.data.qty);
    //         total_price = this.applyDiscounts(total_price, this.data.discount_percentages); // Apply discounts

    //         this.product_list.push({
    //             'brand': this.data.brand,
    //             'product_name': this.data.product_name,
    //             'weight': this.data.weight,
    //             'product_code': this.data.product_code,
    //             'product_id': this.data.id,
    //             'segment_id': this.data.segment_id,
    //             'segment_name': this.data.segment_name,
    //             'thickness': this.data.thickness,
    //             'product_type': this.data.product_type,
    //             'id': this.data.id,
    //             'size': this.data.size,
    //             'qty': parseFloat(this.data.qty),
    //             'total_weight': parseFloat(this.data.weight) * parseFloat(this.data.qty),
    //             'total_price': total_price // Total price after applying discounts
    //         });

    //         this.blankValue();
    //     }

    //     // Reset totals
    //     this.total_qty = 0;
    //     this.tonWeight = 0;
    //     this.totalWeight = 0;
    //     this.totalPrice = 0; // Initialize total price

    //     // Recalculate totals based on the updated list
    //     for (let i = 0; i < this.product_list.length; i++) {
    //         this.total_qty += parseInt(this.product_list[i]['qty']);
    //         this.totalWeight += parseFloat(this.product_list[i]['total_weight']);
    //         this.totalPrice += parseFloat(this.product_list[i]['total_price']);
    //         this.tonWeight = parseFloat(this.totalWeight) / 1000;
    //     }

    //     this.callToDraft();
    // }

    // applyDiscounts(price, discounts) {
    //     console.log(price, "Original price before discounts");

    //     // Initialize discountedPrice with the original price
    //     let discountedPrice = price;

    //     // Apply each discount percentage to the discounted price
    //     for (let discount of discounts) {
    //         if (discount) {
    //             console.log(`Applying ${discount}% discount`);
    //             discountedPrice -= (discountedPrice * (parseFloat(discount) / 100));
    //             console.log(discountedPrice, "Price after applying discount");
    //         }
    //     }

    //     // If freight exists, calculate freight as a percentage and add to the discounted price
    //     if (this.product_detail.freight) {
    //         let freightAmount = discountedPrice * (parseFloat(this.product_detail.freight) / 100);
    //         discountedPrice += freightAmount; // Add freight to the total price
    //         console.log(freightAmount, "Freight amount added");
    //     }

    //     // Apply 18% GST to the final discounted price (including freight)
    //     let gstAmount = discountedPrice * (18 / 100);
    //     discountedPrice += gstAmount;
    //     console.log(gstAmount, "GST amount added");

    //     console.log(discountedPrice, "Final price after discounts, freight, and GST");

    //     // Return the final discounted price
    //     return discountedPrice;
    // }

    addToList() {
        this.orderEditFlag = true
        if (!this.data.product_type) {
            this.service1.errorToast("Add Product Category");
            return;
        }

        this.data.brand = this.data.brand.brand_code;

        // Reset totals before recalculating
        this.resetTotals();

        // Calculate total price based on the current data
        const total_price = parseFloat(this.data.mrp) * parseFloat(this.data.qty);

        // Check if the product_list already contains the product with the same attributes
        const existIndex = this.product_list.findIndex(row =>
            row.brand === this.data.brand &&
            row.thickness === this.data.thickness &&
            row.size === this.data.size &&
            row.product_type === this.data.product_type
        );

        if (existIndex !== -1) {
            // Update existing product details
            this.updateProduct(existIndex, total_price);
        } else {
            // Add a new product to the list
            this.addNewProduct(total_price);
        }

        // Recalculate totals for all products in the list
        this.calculateTotals();

        console.log("Total price after discounts on each product:", this.totalPrice);
        console.log("Total discount amount:", this.totalDiscountAmount);
        console.log("Total freight amount:", this.totalFreightAmount);
        console.log(this.product_list, "Product list with discount amounts");

        this.callToDraft();
    }

    // Helper function to update existing product
    updateProduct(index, total_price) {
        const existingProduct = this.product_list[index];
        existingProduct.qty += parseFloat(this.data.qty);
        existingProduct.total_weight = parseFloat(this.data.weight) * existingProduct.qty;
        existingProduct.total_price_qty = existingProduct.qty * parseFloat(this.data.mrp);

        // Apply discounts to the total price and include freight
        existingProduct.total_price = this.applyDiscounts(existingProduct.total_price_qty, existingProduct.discount_percentages);
        existingProduct.total_price_with_freight = this.applyFreight(existingProduct.total_price, this.data.freight);

        this.blankValue();
    }

    // Helper function to add a new product
    addNewProduct(total_price) {
        const newProduct = {
            brand: this.data.brand,
            product_name: this.data.product_name,
            weight: this.data.weight,
            product_code: this.data.product_code,
            product_id: this.data.id,
            segment_id: this.data.segment_id,
            segment_name: this.data.segment_name,
            thickness: this.data.thickness,
            product_type: this.data.product_type,
            id: this.data.id,
            size: this.data.size,
            qty: parseFloat(this.data.qty),
            total_weight: parseFloat(this.data.weight) * parseFloat(this.data.qty),
            total_price_qty: total_price,

            // Apply discounts and include freight in total price
            total_price: this.applyDiscounts(total_price, this.data.discount_percentages),
            total_price_with_freight: this.applyFreight(this.applyDiscounts(total_price, this.data.discount_percentages), this.data.freight),

            discount_amount: 0,
            freight_amount: 0,
            discount_percentages: this.data.discount_percentages
        };
        this.product_list.push(newProduct);
        this.blankValue();
    }

    // Helper function to calculate totals for all products
    calculateTotals() {
        for (let product of this.product_list) {
            const discounts = product.discount_percentages || [];
            const originalPrice = product.qty * parseFloat(this.data.mrp);
            const productTotalPrice = this.applyDiscounts(originalPrice, discounts);

            // Calculate and store the discount amount for this product
            product.discount_amount = originalPrice - productTotalPrice;

            // Apply freight charges
            const priceAfterFreight = this.applyFreight(productTotalPrice, this.data.freight);
            product.freight_amount = priceAfterFreight - productTotalPrice;

            // Update totals
            this.updateTotalValues(product);

            // Calculate GST
            this.totalGSTApplied = this.totalPrice * (18 / 100);
            this.totalPriceAfterGST = this.totalPrice + this.totalGSTApplied;
        }
    }

    // Helper function to update total values
    updateTotalValues(product) {
        this.total_qty += parseInt(product.qty);
        this.totalWeight += parseFloat(product.total_weight);
        this.totalPrice += parseFloat(product.total_price_with_freight); // Update to include freight in total price
        this.totalDiscountAmount += parseFloat(product.discount_amount);
        this.totalFreightAmount += parseFloat(product.freight_amount);
        this.tonWeight = this.totalWeight / 1000;
    }

    // Helper function to reset totals
    resetTotals() {
        this.total_qty = 0;
        this.totalPrice = 0;
        this.totalFreightAmount = 0;
        this.totalDiscountAmount = 0;
        this.totalWeight = 0;
        this.totalDiscount = 0;
        this.totalFreight = 0;
        this.totalPriceBeforeDiscount = 0;
        this.totalDiscountApplied = 0;
        this.totalPriceAfterGST = 0;
        this.totalGSTApplied = 0;
        this.totalPriceAfterFreight = 0;
        this.totalFreightApplied = 0;
    }

    // Helper function to apply successive discounts
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
    applyFreight(price, freight) {
        const freightAmount = price * (parseFloat(freight) / 100);
        this.totalFreightApplied += freightAmount;
        return price + freightAmount; // Return price after freight only
    }





    // DeleteItem(i) {
    //     let alert = this.alertCtrl.create({
    //         title: 'Are You Sure?',
    //         subTitle: 'Your Want To Delete This Item ',
    //         cssClass: 'alert-modal',

    //         buttons: [{
    //             text: 'No',
    //             role: 'cancel',
    //             handler: () => {
    //             }
    //         },
    //         {
    //             text: 'Yes',
    //             handler: () => {
    //                 this.listdelete(i)

    //             }
    //         }]
    //     });
    //     alert.present();
    // }
    // listdelete(i) {
    //     this.product_list.splice(i, 1);
    //     this.total_qty = 0;
    //     this.totalWeight = 0;
    //     this.tonWeight = 0;


    //     for (let i = 0; i < this.product_list.length; i++) {
    //         this.total_qty +=  parseInt(this.product_list[i]['qty']);
    //         this.totalWeight +=  parseFloat(this.product_list[i]['total_weight'])
    //         this.tonWeight =  parseFloat(this.totalWeight) / 1000
    //     }
    //     console.log( this.total_qty)
    //     console.log( this.totalWeight)
    //     console.log( this.tonWeight)
    //     if(this.product_list.length){

    //         this.callToDraft();
    //       }
    //       this.data.warehouse = ''
    //       this.data.remark = ''
    //       this.data.estimate_delivery_date = ''
    // }
    DeleteItem(i) {
        let alert = this.alertCtrl.create({
            title: 'Are You Sure?',
            subTitle: 'Do you want to delete this item?',
            cssClass: 'alert-modal',

            buttons: [{
                text: 'No',
                role: 'cancel',
                handler: () => {
                    // No action needed on cancel
                }
            },
            {
                text: 'Yes',
                handler: () => {
                    this.listdelete(i);
                }
            }]
        });
        alert.present();
    }

    listdelete(i) {
        // Remove the selected item from the product list
        this.product_list.splice(i, 1);

        // Reset totals
        this.resetTotals1();

        // Recalculate total values (quantity, weight, ton weight, and price) after item deletion
        for (let j = 0; j < this.product_list.length; j++) {
            let product = this.product_list[j];

            // Accumulate totals
            this.total_qty += parseInt(product['qty']);
            this.totalWeight += parseFloat(product['total_weight']);
            this.totalPrice += parseFloat(product['total_price']); // Use the updated total price after applying discounts

            this.totalDiscountAmount += parseFloat(product['discount_amount']);
            this.totalFreightAmount += parseFloat(product['freight_amount']);
        }

        // Recalculate ton weight based on total weight
        this.tonWeight = parseFloat(this.totalWeight) / 1000;

        // Call to draft if the list is not empty
        if (this.product_list.length) {
            this.callToDraft();
        } else {
            // Reset warehouse, remark, and estimate delivery date if the list is empty
            this.data.warehouse = '';
            this.data.remark = '';
            this.data.estimate_delivery_date = '';
        }
    }

    // Helper function to reset totals
    resetTotals1() {
        this.total_qty = 0;
        this.totalWeight = 0;
        this.totalPrice = 0; // Initialize total price for recalculation
        this.totalDiscount = 0; // Reset any other relevant totals if needed
        this.totalFreight = 0; // Reset any other relevant totals if needed
        this.totalPriceAfterGST = 0; // Reset any other relevant totals if needed
        this.totalGSTApplied = 0; // Reset any other relevant totals if needed
        this.totalDiscountAmount = 0; // Reset any other relevant totals if needed
        this.totalFreightAmount = 0; // Reset any other relevant totals if needed
    }



    save_order(type) {
        this.btndisable = true;
        this.leave = 1
        this.user_data.type = this.data.networkType;
        this.user_data.order_status = 'Pending';
        if (this.data['type_name'].lead_type == "Lead" && this.data['type_name'].type == "3") {
            this.data.delivery_from = this.data.delivery_from.id;
        } else {
            this.data.delivery_from = this.data['type_name'].id;
        }
        // if(!this.data.remark){
        //     this.btndisable = false
        //     return this.service1.errorToast("Please add remarks");
        // }
        if (!this.data.estimate_delivery_date) {
            this.btndisable = false

            return this.service1.errorToast("Please add estimate delivery date");
        }
        if (!this.data.shipping_address) {
            this.btndisable = false;
            return this.service1.errorToast("Please add Shipping Address");
        }
        if (!this.data.warehouse) {
            this.btndisable = false

            return this.service1.errorToast("Please add Supplier");
        }
        if (this.user_data.type == "3") {
            if (!this.data.delivery_from) {
                let toast = this.toastCtrl.create({
                    message: 'Please Select Distributor!',
                    duration: 3000
                });
                toast.present();
                return;
            }
            this.user_data.distributor_id = this.data.delivery_from
        }


        this.user_data.dr_id = this.data.type_name.id
        this.user_data.remark = this.data.remark;
        this.user_data.estimate_delivery_date = this.data.estimate_delivery_date;
        this.user_data.warehouse = this.data.warehouse;
        this.user_data.imgarr = this.image_data;
        this.user_data.totalPrice = this.totalPrice;
        this.user_data.totalFreightAmount = this.totalFreightAmount;
        this.user_data.totalDiscountAmount = this.totalDiscountAmount;
        this.user_data.totalGSTApplied = this.totalGSTApplied;
        this.user_data.totalPriceAfterGST = this.totalPriceAfterGST;
        this.user_data.shipping_address = this.data.shipping_address;
        if (this.data.distributor_id && this.data.delivery_from)
            this.user_data.distributor_id = this.data.delivery_from


        this.service1.addData({ "cart_data": this.product_list, "user_data": this.user_data, "orderId": this.order_id }, "AppOrder/primaryOrderAddItem").then(resp => {
            if (resp['statusCode'] == 200) {
                this.service1.successToast(resp['statusMsg'])
                this.navCtrl.popTo(PrimaryOrderDetailPage);

            } else {
                this.service1.errorToast(resp['statusMsg'])
            }
        })


    }

    callToDraft() {
        if (this.userType == 'Sales User') {
            if (this.data.order_type == undefined) {
                return this.service1.errorToast("Please Select Order Type");
            }
        }
        this.btndisable = true;
        this.leave = 1
        this.user_data.type = this.data.networkType;
        if (this.data['type_name'].lead_type == "Lead" && this.data['type_name'].type == "3") {
            this.data.delivery_from = this.data.delivery_from.id;
        } else {
            this.data.delivery_from = this.data['type_name'].id;
        }
        if (this.navParams.get('checkin_id') || this.navParams.get('Dist_login')) {
            this.data.order_type = 'VISIT ORDER'
        } else {
            this.data.order_type = 'PHONE ORDER'

        }
        this.user_data.dr_id = this.data.type_name.id
        this.user_data.remark = this.data.remark;
        this.user_data.estimate_delivery_date = this.data.estimate_delivery_date;
        this.user_data.warehouse = this.data.warehouse;
        this.user_data.totalWeight = this.totalWeight;
        this.user_data.order_ton_value = this.tonWeight;
        this.user_data.state_ton_value = this.order_detail.party_min_weight;
        // Add total price calculation from the addToList() function
        this.user_data.totalPrice = 0; // Initialize total price

        // Loop through the product list to accumulate total price
        for (let i = 0; i < this.product_list.length; i++) {
            this.user_data.totalPrice += parseFloat(this.product_list[i]['total_price']);
        }

        this.user_data.order_status = 'Draft';
        this.user_data.order_type = this.data.order_type;
        this.user_data.product_code = this.data.product_code;
        if (this.data.distributor_id && this.data.delivery_from)
            this.user_data.distributor_id = this.data.delivery_from
        this.service1.addData({ "cart_data": this.product_list, "user_data": this.user_data, 'orderId': this.orderId, "checkin_id": this.checkin_id }, "AppOrder/saveToDraftWhenInCall").then(resp => {
            if (resp['statusCode'] == 200) {
                this.orderId = resp['order_id'];
                this.btndisable = false;

            } else {
                this.service1.errorToast(resp['statusMsg']);
                this.btndisable = false;
            }
        },
            error => {
                this.btndisable = false;
            });
    }


    image: any = '';
    image_data: any = [];
    captureMedia() {
        let actionsheet = this.actionSheetController.create({
            title: "Upload Image",
            cssClass: 'cs-actionsheet',
            buttons: [{
                cssClass: 'sheet-m',
                text: 'Camera',
                icon: 'camera',
                handler: () => {
                    this.takePhoto();
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


    takePhoto() {
        this.diagnostic.requestCameraAuthorization().then((isAvailable: any) => {
            console.log('in take photo', this.image_data)
            const options: CameraOptions = {
                quality: 100,
                destinationType: this.camera.DestinationType.DATA_URL,
                targetWidth: 500,
                targetHeight: 400

            }
            // this.service.dismiss();
            if (this.Device.platform == 'Android') {
                cordova.plugins.foregroundService.start('Camera', 'is running');
            }
            this.camera.getPicture(options).then((imageData) => {
                this.image = 'data:image/jpeg;base64,' + imageData;
                if (this.Device.platform == 'Android') {
                    cordova.plugins.foregroundService.stop();
                }

                if (this.image) {
                    this.fileChange(this.image);
                }
            }, (err) => {
                if (this.Device.platform == 'Android') {
                    cordova.plugins.foregroundService.stop();
                }
            });
        }).catch((error: any) => {
            if (this.Device.platform == 'Android') {
                cordova.plugins.foregroundService.stop();
            }

        });
    }

    getImage() {
        this.diagnostic.requestCameraAuthorization().then((isAvailable: any) => {
            const options: CameraOptions = {
                quality: 100,
                destinationType: this.camera.DestinationType.DATA_URL,
                sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
                saveToPhotoAlbum: false
            }
            if (this.Device.platform == 'Android') {
                cordova.plugins.foregroundService.start('Camera', 'is running');
            }
            this.camera.getPicture(options).then((imageData) => {
                this.image = 'data:image/jpeg;base64,' + imageData;
                if (this.Device.platform == 'Android') {
                    cordova.plugins.foregroundService.stop();
                }
                if (this.image) {
                    this.fileChange(this.image);
                }
            }, (err) => {
                if (this.Device.platform == 'Android') {
                    cordova.plugins.foregroundService.stop();
                }
            });
        }).catch((error: any) => {
            if (this.Device.platform == 'Android') {
                cordova.plugins.foregroundService.stop();
            }

        });
    }



    fileChange(img) {
        // this.image_data=[];
        this.image_data.push(img);

        this.image = '';
    }

    remove_image(i: any) {
        this.image_data.splice(i, 1);
    }
    showLimit() {
        console.log('Image Data', this.image_data)
        let alert = this.alertCtrl.create({
            title: 'Alert',
            subTitle: "You can upload only 15 bill images",
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
}
