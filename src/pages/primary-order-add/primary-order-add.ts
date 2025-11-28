import { Component } from '@angular/core';
import { ActionSheetController, IonicPage, NavController, NavParams, ViewController, LoadingController, AlertController, Navbar, ModalController, Platform, Nav, App, Events } from 'ionic-angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ViewChild } from '@angular/core';
import { PrimaryOrderMainPage } from '../primary-order-main/primary-order-main';
import { ConstantProvider } from '../../providers/constant/constant';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Device } from '@ionic-native/device';
import { Diagnostic } from '@ionic-native/diagnostic';
declare let cordova: any;


@IonicPage()
@Component({
    selector: 'page-primary-order-add',
    templateUrl: 'primary-order-add.html',
})
export class PrimaryOrderAddPage {
    @ViewChild(Navbar) navBar: Navbar;
    @ViewChild('itemselectable') itemselectable: IonicSelectableComponent;
    @ViewChild('subCategory') subcatSelectable: IonicSelectableComponent;
    @ViewChild('productCode') prod_codeSelectable: IonicSelectableComponent;
    @ViewChild('selectComponent') selectComponent: IonicSelectableComponent;
    @ViewChild('distributorSelectable') distributorSelectable: IonicSelectableComponent;

    data: any = {};
    form: any = {};
    user_data: any = {};
    city_list1: any = []
    btndisable: boolean = false;
    btndisable2: boolean = false;
    ShowShippingSection: boolean = false;
    product_type_disable: boolean = false;
    selectImage: any = [];
    order_data: any = {};
    productData: any = {};
    special_discount: any = 0;
    type: any = '';
    district_list: any = []
    BillingAddressList: any = []
    cart_array: any = [];
    state_list: any = []
    sub_category_list: any = [];
    order_item: any = [];
    userType: any;
    showSave = false;
    showEdit = true;
    active: any = {};
    items_list: any = [];
    addToListButton: boolean = true;
    ItemGST: any = '';
    order_total: any = '';
    total_Order_amount: any = ''
    Dist_state = ''
    Dr_type = ''
    color_list: any = [];
    category_list: any = [];
    brand_list: any = [];
    product: any = {};
    show_price: any = false;
    SpecialDiscountLable: any = '';
    cash_discount_percent: any = 0;
    cd_value: any = 0;
    ins_value: any = 0;
    tcs_value: any = 0;
    leave: any = 0;
    temp_product_array: any = [];
    distributor_list: any = [];
    grand_amt: any = {};
    sub_total: any = 0;
    dis_amt: any = 0;
    gst_amount: any = 0;
    net_total: any = 0;
    cpType: any = ''
    spcl_dis_amt: any = 0
    grand_total: any = 0;
    order_discount: any = 0;
    sub_total_before_cd: any = 0;
    sub_total_after_cd: any = 0;
    grand_total_before_tcs: any = 0;
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
    itemType: any;
    product_resp: boolean;
    mode = 0;
    distributorlist: any = [];
    drtype: any;
    checkin_id: any = 0;
    idMode: any;
    retailerID: any;
    tmpdata: any = {};
    disableSelect: boolean = false;
    disableSelectFromCheckin: boolean = false;
    add_list: any = [];
    temp_add_list: any = [];
    new_add_list: any = [];
    total_qty: any = 0;
    netamount: any = 0;
    total_gst_amount: any = 0;
    order_grand_total: any = 0;
    drList: any = [];
    product_detail: any = {};
    brandList: any = [];
    thickness_list: any = [];
    dimension_list: any = [];
    segment_list: any = [];
    colorList: any = [];
    thicknessList: any = [];
    warehouseList: any = [];

    btnDisableDraft: boolean = false;
    search: any;
    flagTest: any;
    product_name: any;
    name: any;
    testid: any;
    orderId: any = '';
    loader: boolean = false;
    TodayDate = new Date().toISOString().slice(0, 10);
    max_date = new Date().getFullYear() + 1;
    userMinTone: any;
    state: any;
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


    constructor(
        public navCtrl: NavController,
        public events: Events,
        public loadingCtrl: LoadingController,
        public navParams: NavParams,
        public viewCtrl: ViewController,
        public diagnostic: Diagnostic,
        public service: MyserviceProvider,
        public toastCtrl: ToastController,
        private alertCtrl: AlertController,
        public Device: Device,
        public storage: Storage,
        public modal: ModalController,
        public platform: Platform,
        private camera: Camera,
        public actionSheetController: ActionSheetController,
        public constant: ConstantProvider,
        public appCtrl: App) {

        this.order_item = this.navParams.get('order_item')
        this.order_data = this.navParams.get('order_data')
        this.drtype = this.navParams['data'].type || '';
        this.checkin_id = this.navParams.get('checkin_id')
        this.get_states();

        if (this.navParams.get('from') && this.navParams.get('from') == 'DistPrimary') {
            if (this.navParams.get('dr_code') != "" && this.navParams.get('dr_type') == 1) {
                this.data.networkType = '1'
            } else if (this.navParams.get('dr_code') == "" && this.navParams.get('dr_type') == 1) {
                this.data.networkType = '2'
            } else {
                this.data.networkType = this.navParams.get('dr_type');
            }
            this.distributors('', '')
            this.getBrands();
            this.data.type_name = this.navParams.get('dr_id')
            this.disableSelect = true
        }

        this.product_list = [];
        this.total_qty = 0;
        this.totalWeight = 0;
        this.tonWeight = 0;
        this.totalPrice = 0;
        this.totalDiscount = 0;
        this.totalFreight = 0;
        this.totalPriceQty = 0;
        this.totalPriceBeforeDiscount = 0; // Store total price before discount
        this.totalDiscountApplied = 0; // Store total discount applied
        this.totalPriceAfterGST = 0; // Store total price after GST
        this.totalGSTApplied = 0; // Store total GST applied
        this.totalPriceAfterFreight = 0; // Store total price after freight
        this.totalFreightApplied = 0; // Store total freight applied

    }
    ionViewDidEnter() {
        if (this.navParams.get('checkin_id') || this.navParams.get('Dist_login')) {
            console.log("line 200")
            if (this.navParams.get('dr_code') != "" && this.navParams.get('dr_type') == 1) {
                this.data.networkType = '1'
            } else if (this.navParams.get('dr_code') == "" && this.navParams.get('dr_type') == 1) {
                this.data.networkType = '2'
            } else {
                this.data.networkType = this.navParams.get('dr_type');
            }
            this.disableSelectFromCheckin = true;
            this.drtype = this.navParams.get('order_type');
            this.type = this.navParams.get('dr_type');
            this.data.id = this.navParams.get('id');
            this.data.company_name = this.navParams.get('dr_name');
            this.data.display_name = this.navParams.get('display_name');
            this.distributors(this.data, '')
            this.getBrands()
            this.data.brand = this.data.brand;
        }

        this.navBar.backButtonClick = () => {
            this.backAction()
        };

        let nav = this.appCtrl.getActiveNav();
        if (nav && nav.getActive()) {
            let activeView = nav.getActive().name;
            let previuosView = '';
            if (nav.getPrevious() && nav.getPrevious().name) {
                previuosView = nav.getPrevious().name;
            }
        }
        this.data.variableDiscount = 0
    }


    closeDealer() {
        this.distributorSelectable._searchText = '';
    }
    HideShowShippingAddress(){
        this.ShowShippingSection = !this.ShowShippingSection;
    }

    ionViewDidLoad() {
        this.storage.get('user_type').then((userType) => {
            this.userType = userType;

        });
    }

    getNextDay() {
        let newDate = new Date();
        newDate.setDate(newDate.getDate() + 15);
        return newDate.toISOString().slice(0, 10);



    }
    networkType: any = []

    distributors(data, masterSearch) {

        this.data.category = '';
        this.data.order_type = '';
        this.data.sub_category_list = '';
        this.data.items_list = '';
        this.data.thickness_list = '';
        this.data.dimension_list = '';
        this.product_detail.weight = '';
        this.data.color = '';
        this.product_list.length = 0;
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

        if (this.navParams.get('checkin_id') || this.navParams.get('Dist_login')) {
            this.service.addData({ 'dr_type': type, 'checkin_dr_id': this.navParams.get('id'), 'master_search': masterSearch, 'active_tab': this.cpType }, 'AppOrder/newfollowupCustomer').then((result) => {
                let TemData
                TemData = result['result'];
                console.log(TemData, "this is TemData")
                let Index = TemData.findIndex(row => row.id == data.id);

                if (Index != -1) {
                    console.log(TemData[Index].state, "state")
                    this.drList.push({ id: TemData[Index].id, company_name: TemData[Index].company_name, display_name: TemData[Index].display_name, assigned_warehouse: TemData[Index].assigned_warehouse, state: TemData[Index].state })
                    this.data.type_name = TemData[Index];
                    console.log(this.drList, "dr list")
                }
            });
            setTimeout(() => {
                this.findWarehouse()
            }, 1000);

        } else {
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
        this.data.size = '';
    }
    partyWareHouse: any;
    findWarehouse() {
        console.log(this.data.type_name, 'this.data.type_name');
        let drId = ''
        if (this.navParams.get('checkin_id') || this.navParams.get('Dist_login')) {
            drId = this.data.id
            console.log(drId);
        } else {
            drId = this.data.type_name.id
        }
        let existIndex;
        console.log(this.drList);
        existIndex = this.drList.findIndex(row => row.id == drId);
        console.log(existIndex);
        if (existIndex != -1) {
            this.partyWareHouse = this.drList[existIndex]['assigned_warehouse'];
            this.state = this.drList[existIndex]['state'];
            this.getWarehouse();
        }
        else {
            this.getWarehouse();
        }

        console.log(this.partyWareHouse, 'partyWareHouse');
        console.log(this.state, 'partyWareHouse');

    }


    getWarehouse() {
        this.service.addData({ 'assigned_warehouse': this.partyWareHouse ? this.partyWareHouse : '', 'state': this.state }, "AppOrder/fetchWarehouse")
            .then(resp => {
                if (resp['statusCode'] == 200) {
                    this.warehouseList = resp['result'];
                    console.log(this.warehouseList)
                } else {
                    this.service.errorToast(resp['statusMsg'])

                }
            }, err => { })
    }
    getProductData() {
        this.addToListButton = true
        this.service.addData({ 'brand': this.data.brand.brand_code, "thickness": this.data.thickness, "size": this.data.size }, "AppOrder/segmentItems")
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
                    // this.service.errorToast(resp['statusMsg'])

                }
            }, err => { })
    }
    getProductDiscountData() {
        this.service.addData({ 'brand': this.data.brand.brand_code, 'category': this.data.product_type, 'dr_id': this.data.type_name.id }, "AppOrder/segmentItemsDiscount")
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
                    this.addToListButton = false

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



    Lead_retailer_distributor: any = [];


    save_orderalert(type) {
        var str


        if (type == 'draft') {
            str = 'You want to save this order as draft ?'
            this.btnDisableDraft = true;
        }
        else {
            str = 'You want to submit this order ?'
            this.btndisable = true;
        }
        let alert = this.alertCtrl.create({
            title: 'Are You Sure?',
            subTitle: str,
            cssClass: 'alert-modal',

            buttons: [{
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                    this.btnDisableDraft = false;
                    this.btndisable = false;
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
        // this.data.product_type=''
    }
    tonWeight: any = 0
    totalWeight: any = 0
    totalPriceAfterFreightAndDiscount: any = 0
    totalFreightAmount: any = 0
    totalDiscountAmount: any = 0


    ///////////////NEW FUNCTION///////////////////

    addToList() {
        if (this.data.qty == '' || this.data.qty == null || this.data.qty < 1) {
            this.service.errorToast("Add QTY.");
            return;
        }
        if (!this.data.product_type) {
            this.service.errorToast("Add Product Category");
            return;
        }

        this.data.brand = this.data.brand.brand_code;

        // Reset totals
        this.resetTotals();

        // Calculate total price based on the current data
        const total_price = parseFloat(this.data.mrp) * parseFloat(this.data.qty);

        // Check if the product_list already has the product with the same attributes
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
            // Add new product to the list
            this.addNewProduct(total_price);
        }

        // Calculate totals for all products in the list
        this.calculateTotals();
        console.log("Total price after discounts on each product:", this.totalPrice);
        console.log("Total discount amount:", this.totalDiscount);
        console.log("Total freight amount:", this.totalFreight);
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
        existingProduct.total_price_with_freight = this.applyfreight(existingProduct.total_price, this.data.freight);

        this.blankValue();
    }

    // Helper function to add a new product
    addNewProduct(total_price) {
        console.log(total_price, "line 787")
        console.log(this.applyDiscounts(total_price, this.data.discount_percentages), "line 788")
        const newProduct = {
            brand: this.data.brand,
            product_name: this.data.product_name,
            weight: this.data.weight,
            product_code: this.data.product_code,
            product_price: this.data.mrp,
            product_id: this.data.id,
            segment_id: this.data.segment_id,
            segment_name: this.data.segment_name,
            thickness: this.data.thickness,
            id: this.data.id,
            product_type: this.data.product_type,
            size: this.data.size,
            qty: parseFloat(this.data.qty),
            total_weight: parseFloat(this.data.weight) * parseFloat(this.data.qty),
            total_price_qty: total_price,

            // Apply discounts and include freight in total price
            total_price: this.applyDiscounts(total_price, this.data.discount_percentages),
            total_price_with_freight: this.applyfreight(this.applyDiscounts(total_price, this.data.discount_percentages), this.data.freight),

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
            const PriceAfterFreight = this.applyfreight(productTotalPrice, this.data.freight);
            product.freight_amount = PriceAfterFreight - productTotalPrice;

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
        console.log(price, "line 878")
        console.log(discounts, "line 879")
        let discountedPrice = price;

        // Apply successive discounts only to the base price
        for (let discount of discounts) {
            if (discount) {
                discountedPrice -= (discountedPrice * (parseFloat(discount) / 100));
            }
        }
        console.log(discountedPrice, "line886")

        return discountedPrice; // Return price after discounts only
    }


    // Helper function to apply freight charges
    applyfreight(price, freight) {
        const freightAmount = price * (parseFloat(freight) / 100);
        this.totalFreightApplied += freightAmount;
        return price + freightAmount; // Return price after freight only
    }



    /////NEW FUNCTION END////////////////


    // addToList() {
    //     if (!this.data.product_type) {
    //         this.service.errorToast("Add Product Category");
    //         return;
    //     }

    //     this.data.brand = this.data.brand.brand_code;

    //     // Reset totals
    //     this.resetTotals();

    //     // Check if the product_list already has the product with the same brand, thickness, and size
    //     if (this.product_list.length > 0) {
    //         let existIndex = this.product_list.findIndex(row => row.brand == this.data.brand && row.thickness == this.data.thickness && row.size == this.data.size && row.product_type == this.data.product_type);

    //         // If product exists, update its quantity, weight, and total price
    //         if (existIndex != -1) {
    //             this.product_list[existIndex]['qty'] += parseFloat(this.data.qty);
    //             this.product_list[existIndex]['total_weight'] = parseFloat(this.data.weight) * parseFloat(this.product_list[existIndex]['qty']);
    //             this.product_list[existIndex]['total_price_qty'] = parseFloat(this.product_list[existIndex]['qty']) * parseFloat(this.data.mrp);
    //             this.product_list[existIndex]['total_price'] = this.applyDiscounts(parseFloat(this.product_list[existIndex]['qty']) * parseFloat(this.data.mrp), this.product_list[existIndex]['discount_percentages']);
    //             this.blankValue();
    //         } 
    //         // If product doesn't exist, add it to the list
    //         else {
    //             let total_price = parseFloat(this.data.mrp) * parseFloat(this.data.qty);
    //             this.product_list.push({
    //                 'brand': this.data.brand,
    //                 'product_name': this.data.product_name,
    //                 'weight': this.data.weight,
    //                 'product_code': this.data.product_code,
    //                 'product_price': this.data.mrp,
    //                 'product_id': this.data.id,
    //                 'segment_id': this.data.segment_id,
    //                 'segment_name': this.data.segment_name,
    //                 'thickness': this.data.thickness,
    //                 'id': this.data.id,
    //                 'product_type': this.data.product_type,
    //                 'size': this.data.size,
    //                 'qty': parseFloat(this.data.qty),
    //                 'total_weight': parseFloat(this.data.weight) * parseFloat(this.data.qty),
    //                 'total_price_qty': parseFloat(this.data.mrp) * parseFloat(this.data.qty), // Correct total price calculation
    //                 'total_price': this.applyDiscounts(total_price, this.data.discount_percentages), // Apply discounts to the total price
    //                 'discount_amount': 0, // Initialize discount amount for the new product
    //                 'freight_amount': 0, // Initialize discount amount for the new product
    //                 'discount_percentages': this.data.discount_percentages // Store discount percentages for each product
    //             });
    //             this.blankValue();
    //         }
    //     } 
    //     // If product_list is empty, add the first product
    //     else {
    //         let total_price = parseFloat(this.data.mrp) * parseFloat(this.data.qty);
    //         this.product_list.push({
    //             'brand': this.data.brand,
    //             'product_name': this.data.product_name,
    //             'weight': this.data.weight,
    //             'product_code': this.data.product_code,
    //             'product_price': this.data.mrp,
    //             'product_id': this.data.id,
    //             'segment_id': this.data.segment_id,
    //             'segment_name': this.data.segment_name,
    //             'thickness': this.data.thickness,
    //             'id': this.data.id,
    //             'product_type': this.data.product_type,
    //             'size': this.data.size,
    //             'qty': parseFloat(this.data.qty),
    //             'total_weight': parseFloat(this.data.weight) * parseFloat(this.data.qty),
    //             'total_price_qty': parseFloat(this.data.mrp) * parseFloat(this.data.qty), // Correct total price calculation
    //             'total_price': this.applyDiscounts(total_price, this.data.discount_percentages), // Apply discounts to the total price
    //             'discount_amount': 0, // Initialize discount amount for the first product
    //             'freight_amount': 0, // Initialize discount amount for the first product
    //             'discount_percentages': this.data.discount_percentages // Store discount percentages for the first product
    //         });
    //         this.blankValue();
    //     }

    //     // Calculate totals
    //     for (let i = 0; i < this.product_list.length; i++) {
    //         let discounts = this.product_list[i]['discount_percentages'] || [];
    //         let originalPrice = parseFloat(this.product_list[i]['qty']) * parseFloat(this.data.mrp);

    //         // Apply the discount using the helper function
    //         let productTotalPrice = this.applyDiscounts(originalPrice, discounts);

    //         // Calculate and store the discount amount for this product
    //         let discountAmount = originalPrice - productTotalPrice;

    //         this.product_list[i]['discount_amount'] = discountAmount;
    //         console.log( this.product_list[i]['discount_amount'],"line 811")



    //         let PriceAfterFreight=this.applyfreight(productTotalPrice, this.data.freight);

    //         let freightAmount = PriceAfterFreight-productTotalPrice
    //         this.product_list[i]['freight_amount'] = freightAmount;

    //  // Update product's total price after applying discounts



    //         // Update totals
    //         this.totalDiscount=this.totalDiscount+this.product_list[i]['discount_amount']
    //         this.totalFreight=this.totalFreight+this.product_list[i]['freight_amount']

    //         this.product_list[i]['total_price'] = PriceAfterFreight;


    //         // this.updateTotals(originalPrice, discountAmount, productTotalPrice);

    //         //Total
    //         this.total_qty += parseInt(this.product_list[i]['qty']);
    //         this.totalWeight += parseFloat(this.product_list[i]['total_weight']);
    //         this.totalPrice += parseFloat(this.product_list[i]['total_price']);
    //         this.totalDiscountAmount += parseFloat(this.product_list[i]['discount_amount']);
    //         this.totalFreightAmount += parseFloat(this.product_list[i]['freight_amount']);


    //           // Calculate GST on the productTotalPrice after discount
    //     let gstAmount =  this.totalPrice * (18 / 100);
    //     this.totalGSTApplied = gstAmount;
    //     this.totalPriceAfterGST =  this.totalPrice + gstAmount;



    //     this.tonWeight = parseFloat(this.totalWeight) / 1000; 
    //     this.totalPriceQty += parseFloat(this.product_list[i]['total_price_qty']);


    //     }

    //     console.log("Total price after discounts on each product:", this.totalPrice);
    //     console.log("Total discount amount:", this.totalDiscount);
    //     console.log("Total freight amount:", this.totalFreight);
    //     console.log(this.product_list, "Product list with discount amounts");

    //     this.callToDraft(); 
    // }

    // // Helper function to reset totals
    // resetTotals() {
    //     this.total_qty = 0;
    //     this.totalPrice = 0;
    //     this.totalFreightAmount = 0;
    //     this.totalDiscountAmount = 0;
    //     this.totalWeight = 0;
    //     this.totalPrice = 0;
    //     this.totalDiscount = 0;
    //     this.totalFreight = 0;
    //     this.totalPriceBeforeDiscount = 0;
    //     this.totalDiscountApplied = 0;
    //     this.totalPriceAfterGST = 0;
    //     this.totalGSTApplied = 0;
    //     this.totalPriceAfterFreight = 0;
    //     this.totalFreightApplied = 0;
    // }




    // // Helper function to apply successive discounts
    // applyDiscounts(price, discounts) {
    //     let discountedPrice = price;

    //     // Apply successive discounts only to the base price
    //     for (let discount of discounts) {
    //         if (discount) {
    //             discountedPrice -= (discountedPrice * (parseFloat(discount) / 100));
    //         }
    //     }

    //     return discountedPrice; // Return price after discounts only
    // }
    // applyfreight(price, freight) {
    // let PriceAfterFreight=price


    //         let freightAmount = PriceAfterFreight * (parseFloat(freight) / 100);
    //         this.totalFreightApplied += freightAmount;
    //         PriceAfterFreight = PriceAfterFreight + freightAmount;

    //         console.log(PriceAfterFreight,"price after freight")

    //     return PriceAfterFreight; // Return price after freight only
    // }

    // Helper function to update totals
    // updateTotals(originalPrice, discountAmount, productTotalPrice) {
    //     this.total_qty += parseInt(this.product_list[this.product_list.length - 1]['qty']);
    //     this.totalWeight += parseFloat(this.product_list[this.product_list.length - 1]['total_weight']);
    //     this.totalPrice += parseFloat(this.product_list[this.product_list.length - 1]['total_price']);
    //     this.totalDiscountAmount += parseFloat(this.product_list[this.product_list.length - 1]['discount_amount']);
    //     this.totalFreightAmount += parseFloat(this.product_list[this.product_list.length - 1]['freight_amount']);

    //     console.log( this.totalPrice,"totalPriceAfterFreightAndDiscount")
    //     console.log( this.totalDiscountAmount,"this.totalDiscountAmount")
    //     console.log( this.totalFreightAmount,"this.totalFreightAmount")


    //     // Calculate GST on the productTotalPrice after discount
    //     let gstAmount =  this.totalPrice * (18 / 100);
    //     this.totalGSTApplied = gstAmount;
    //     this.totalPriceAfterGST =  this.totalPrice + gstAmount;



    //     this.tonWeight = parseFloat(this.totalWeight) / 1000; 
    //     this.totalPriceQty += parseFloat(this.product_list[this.product_list.length - 1]['total_price_qty']);

    // }






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
    //     // Remove the selected item from the product list
    //     this.product_list.splice(i, 1);

    //     // Reset total values
    //     this.total_qty = 0;
    //     this.totalWeight = 0;
    //     this.tonWeight = 0;
    //     this.totalPrice = 0; // Initialize total price for recalculation

    //     // Recalculate total values (quantity, weight, ton weight, and price) after item deletion
    //     for (let i = 0; i < this.product_list.length; i++) {
    //         this.total_qty += parseInt(this.product_list[i]['qty']);
    //         this.totalWeight += parseFloat(this.product_list[i]['total_weight']);
    //         this.totalPrice += parseFloat(this.product_list[i]['total_price']); // Accumulate total price for remaining items
    //     }

    //     // Recalculate ton weight based on total weight
    //     this.tonWeight = parseFloat(this.totalWeight) / 1000;

    //     // Call to draft if the list is not empty
    //     if (this.product_list.length) {
    //         this.callToDraft();
    //     }

    //     // Reset warehouse, remark, and estimate delivery date if list is empty
    //     this.data.warehouse = '';
    //     this.data.remark = '';
    //     this.data.estimate_delivery_date = '';
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
        if (this.userType == 'Sales User') {
            if (this.data.order_type == undefined) {
                return this.service.errorToast("Please Select Order Type");
            }
        }
        // if (!this.data.remark) {
        //     this.btndisable = false;
        //     return this.service.errorToast("Please add remarks");
        // }
        if (!this.data.estimate_delivery_date) {
            this.btndisable = false;
            return this.service.errorToast("Please add estimate delivery date");
        }
        if (!this.data.warehouse) {
            this.btndisable = false;
            return this.service.errorToast("Please add Supplier");
        }
           if (!this.data.shipping_address) {
            this.btndisable = false;
            return this.service.errorToast("Please add Shipping Address");
        }
        this.btndisable = true;
        this.leave = 1
        this.user_data.type = this.data.networkType;
        if (this.data['type_name'].lead_type == "Lead" && this.data['type_name'].type == "3") {
            this.data.delivery_from = this.data.delivery_from.id;
        } else {
            this.data.delivery_from = this.data['type_name'].id;
        }
        if (this.navParams.get('checkin_id')) {
            this.user_data.checkin_order_type = 'primary'
            this.data.order_type = 'VISIT ORDER'
        } else {
            this.data.order_type = 'PHONE ORDER'

        }
        if (this.navParams.get('from') && this.navParams.get('from') && this.navParams.get('from') == 'DistPrimary') {

            this.user_data.dr_id = this.data.type_name;
        } else {
            this.user_data.dr_id = this.data.type_name.id;
            this.user_data.transfer_from_enquiry = this.data.type_name.transfer_from_enquiry
        }
        this.user_data.remark = this.data.remark;
        this.user_data.imgarr = this.image_data;
        this.user_data.freight = this.data.freight;
        this.user_data.estimate_delivery_date = this.data.estimate_delivery_date;
        this.user_data.warehouse = this.data.warehouse;
        this.user_data.order_type = this.data.order_type;
        this.user_data.totalWeight = this.totalWeight;
        this.user_data.order_ton_value = this.tonWeight;
        this.user_data.state_ton_value = this.data.type_name.min_ton;
        this.user_data.product_code = this.data.product_code
        this.user_data.totalPrice = this.totalPrice;
        this.user_data.totalFreightAmount = this.totalFreightAmount;
        this.user_data.totalDiscountAmount = this.totalDiscountAmount;
        this.user_data.totalGSTApplied = this.totalGSTApplied;
        this.user_data.totalPriceAfterGST = this.totalPriceAfterGST;
        this.user_data.shipping_address = this.data.shipping_address;


        // var orderData = { 'sub_total': this.netamount, 'dis_amt': this.dis_amt, 'grand_total': this.order_grand_total, 'total_gst_amount': this.total_gst_amount, 'total_qty': this.total_qty, 'net_total': this.netamount, 'special_discount': this.special_discount, 'special_discount_amount': this.spcl_dis_amt }
        // if (this.tonWeight < this.data.type_name.min_ton) {
        //     this.btndisable = false;
        //     this.btndisable = false;
        //     return this.service.errorToast("Minimum order quantity of " + this.data.type_name.min_ton + " tons required");
        // }
        this.service.addData({ "cart_data": this.product_list, 'orderId': this.orderId, "user_data": this.user_data, "checkin_id": this.checkin_id }, "AppOrder/primaryOrdersAdd").then(resp => {
            if (resp['statusCode'] == 200) {
                var toastString = ''
                if (this.user_data.order_status == 'Draft') {
                    this.service.successToast(resp['statusMsg'])
                    this.btnDisableDraft = false;
                    this.btndisable = false;
                }
                else {
                    this.service.successToast(resp['statusMsg'])
                    this.btnDisableDraft = false;
                    this.btndisable = false;
                }

                this.navCtrl.popTo(PrimaryOrderMainPage)

            } else {
                this.service.errorToast(resp['statusMsg']);
                this.btnDisableDraft = false;
                this.btndisable = false;
            }
        },
            error => {
                this.btndisable = false;
                this.btnDisableDraft = false;
                this.btndisable = false;
                this.service.Error_msg(error);
                this.service.dismiss();
            })



    }
    callToDraft() {
        // Check if Sales User and Order Type is not selected
        if (this.userType == 'Sales User') {
            if (this.data.order_type == undefined) {
                return this.service.errorToast("Please Select Order Type");
            }
        }

        // Disable button and set leave flag
        this.btndisable = true;
        this.leave = 1;

        // Set user data fields
        this.user_data.type = this.data.networkType;

        // Set delivery_from based on lead type and type
        if (this.data['type_name'].lead_type == "Lead" && this.data['type_name'].type == "3") {
            this.data.delivery_from = this.data.delivery_from.id;
        } else {
            this.data.delivery_from = this.data['type_name'].id;
        }

        // Determine order type based on parameters
        if (this.navParams.get('checkin_id') || this.navParams.get('Dist_login')) {
            this.data.order_type = 'VISIT ORDER';
        } else {
            this.data.order_type = 'PHONE ORDER';
        }

        // Set dr_id based on the "from" parameter
        if (this.navParams.get('from') && this.navParams.get('from') == 'DistPrimary') {
            this.user_data.dr_id = this.data.type_name;
        } else {
            this.user_data.dr_id = this.data.type_name.id;
        }

        // Populate the user data object with other relevant data
        this.user_data.remark = this.data.remark;
        this.user_data.freight = this.data.freight;
        this.user_data.estimate_delivery_date = this.data.estimate_delivery_date;
        this.user_data.warehouse = this.data.warehouse;
        this.user_data.totalWeight = this.totalWeight;
        this.user_data.order_ton_value = this.tonWeight;
        this.user_data.state_ton_value = this.data.type_name.min_ton;

        // Add total price calculation from the addToList() function
        this.user_data.totalPrice = this.totalPrice;
        this.user_data.totalFreightAmount = this.totalFreightAmount;
        this.user_data.totalDiscountAmount = this.totalDiscountAmount;
        this.user_data.totalGSTApplied = this.totalGSTApplied;
        this.user_data.totalPriceAfterGST = this.totalPriceAfterGST;

        // Set additional order details
        this.user_data.order_status = 'Draft';
        this.user_data.order_type = this.data.order_type;
        this.user_data.product_code = this.data.product_code;

        // Call the service to save the draft
        this.service.addData({
            "cart_data": this.product_list,
            "user_data": this.user_data,
            'orderId': this.orderId,
            "checkin_id": this.checkin_id
        }, "AppOrder/saveToDraftWhenInCall").then(resp => {
            if (resp['statusCode'] == 200) {
                this.orderId = resp['order_id'];
                this.btndisable = false;
            } else {
                this.service.errorToast(resp['statusMsg']);
                this.btndisable = false;
            }
        },
            error => {
                this.btndisable = false;
            });
    }


    FetchBillingAddress(data) {
        this.service.addData({ 'id': data.id }, "AppOrder/fetchPartyAddress")
            .then(resp => {
                if (resp['statusCode'] == 200) {
                    console.log(resp);
                    this.BillingAddressList = resp['dr_address'];
                } else {
                    this.service.errorToast(resp['statusMsg'])
                }
            }, err => { })
    }
    get_states() {
        this.service.presentLoading()
        this.service.addData({}, "AppCustomerNetwork/getStates")
            .then(resp => {
                if (resp['statusCode'] == 200) {
                    this.service.dismissLoading()
                    this.state_list = resp['state_list'];
                } else {
                    this.service.dismissLoading()
                    this.service.errorToast(resp['statusMsg']);
                }
            }, error => {
                this.service.Error_msg(error);
                this.service.dismiss();
            })
    }

    get_district() {
        this.service.addData({ "state_name": this.data.state }, "AppCustomerNetwork/getDistrict")
            .then(resp => {
                if (resp['statusCode'] == 200) {
                    this.district_list = resp['district_list'];
                } else {
                    this.service.errorToast(resp['statusMsg']);
                }
            },
                err => {
                    this.service.errorToast('Something Went Wrong!')
                })
    }
    getCityList1() {
        this.form.city1 = [];
        this.service.addData({ 'district_name': this.data.district, 'state_name': this.data.state, }, 'AppCustomerNetwork/get_city_list').then((result) => {
            if (result['statusCode'] == 200) {
                this.city_list1 = result['city'];
            } else {
                this.service.errorToast(result['statusMsg']);

            }


        }, err => {
            this.service.errorToast('Something Went Wrong!')
        });

    }
    saveShippingAddress(row) {
        this.btndisable2 = true;
        this.service.addData({ 'state': this.data.state, 'district': this.data.district, 'city': this.data.city, 'address': this.data.address, 'id': row.id }, "AppOrder/insertPartyAddress")
            .then(resp => {
                if (resp['statusCode'] == 200) {
                    this.btndisable2 = false;
                    this.service.successToast(resp['statusMsg']);
                    this.FetchBillingAddress(row);
                    this.blank()
                } else {
                    this.btndisable2 = false;
                    this.service.errorToast(resp['statusMsg'])
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
        this.data.shipping_address=''
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
