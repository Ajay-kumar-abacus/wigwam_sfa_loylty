import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { VideoPlayer } from '@ionic-native/video-player/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { HomePage } from '../pages/home/home';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { TabsPage } from '../pages/tabs/tabs';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
//  import { AgmCoreModule } from '@agm/core';
import { StatusBar } from '@ionic-native/status-bar';
import { PinchZoomModule } from 'ngx-pinch-zoom';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CoupanCodePageModule } from '../pages/scane-pages/coupan-code/coupan-code.module';
import { ScanPageModule } from '../pages/scane-pages/scan/scan.module';
import { GiftDetailPageModule } from '../pages/gift-gallery/gift-detail/gift-detail.module';
import { GiftListPageModule } from '../pages/gift-gallery/gift-list/gift-list.module';
import { OffersPageModule } from '../pages/offers/offers.module';
import { PointListPageModule } from '../pages/points/point-list/point-list.module';
import { PointDetailPageModule } from '../pages/points/point-detail/point-detail.module';
import { ProfilePageModule } from '../pages/profile/profile.module';
import { MainHomePageModule } from '../pages/main-home/main-home.module';
import { ProductsPageModule } from '../pages/products/products.module';
import { TermsPageModule } from '../pages/terms/terms.module';
import { ProductDetailPageModule } from '../pages/product-detail/product-detail.module';
import { ProductSubdetailPageModule } from '../pages/product-subdetail/product-subdetail.module';
import { TransactionPageModule } from '../pages/transaction/transaction.module';
import { ShippingDetailPageModule } from '../pages/shipping-detail/shipping-detail.module';
import { NotificationPageModule } from '../pages/notification/notification.module';
import { ContactPageModule } from '../pages/contact/contact.module';
import { VideoPageModule } from '../pages/video/video.module';
import { NewsPageModule } from '../pages/news/news.module';
import { NewsDetailPageModule } from '../pages/news-detail/news-detail.module';
import { FeedbackPageModule } from '../pages/feedback/feedback.module';
import { DbserviceProvider } from '../providers/dbservice/dbservice';
import { HttpClientModule } from '@angular/common/http';
import { ConstantProvider } from '../providers/constant/constant';
import { HttpModule } from '@angular/http';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Camera } from '@ionic-native/camera';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { OfferListPageModule } from '../pages/offer-list/offer-list.module';
import { IonicStorageModule } from '@ionic/storage';
import { SafePipe } from '../pipes/safe/safe';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { ViewProfilePageModule } from '../pages/view-profile/view-profile.module';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { ComplaintDetailPageModule } from '../pages/complaints/complaint-detail/complaint-detail.module';
import { AddNewComplaintPageModule } from '../pages/complaints/add-new-complaint/add-new-complaint.module';
import { ComplaintHistoryPageModule } from '../pages/complaints/complaint-history/complaint-history.module';
import { MyCamplaintsPageModule } from '../pages/plumber-camplaints/my-camplaints/my-camplaints.module';
import { PulmberCustomerDetailPageModule } from '../pages/plumber-camplaints/pulmber-customer-detail/pulmber-customer-detail.module';
import { EnquiryPageModule } from '../pages/enquiry/enquiry.module';
import { TaskClosePageModule } from '../pages/task-close/task-close.module';
import { Super30PageModule } from '../pages/super30/super30.module';
import { CancelComplaintPageModule } from '../pages/cancel-complaint/cancel-complaint.module';
import { MediaCapture } from '@ionic-native/media-capture';
import { PointLocationPageModule } from '../pages/point-location/point-location.module';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { Diagnostic } from '@ionic-native/diagnostic';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { EditProfilePageModule } from '../pages/edit-profile/edit-profile.module';
// import { ComplaintRemarksPageModule } from '../pages/complaint-remarks/complaint-remarks.module';
import { AppVersion } from '@ionic-native/app-version';
import { CategoryPageModule } from '../pages/category/category.module';
import { SocialSharing } from '@ionic-native/social-sharing';
// import { SelectRegistrationTypePage } from '../pages/select-registration-type/select-registration-type';
import { SelectRegistrationTypePageModule } from '../pages/select-registration-type/select-registration-type.module';
import { LoginPageModule } from '../pages/login/login.module';
import { LoginserviceProvider } from '../providers/loginservice/loginservice';
import { OtpverifyPageModule } from '../pages/otpverify/otpverify.module';
import { DashboardPageModule } from '../pages/dashboard/dashboard.module';
import { AttendenceserviceProvider } from '../providers/attendenceservice/attendenceservice';
import { CatalougeProvider } from '../providers/catalouge/catalouge';
import { MyserviceProvider } from '../providers/myservice/myservice';
import { GeolocationserviceProvider } from '../providers/geolocationservice/geolocationservice';
import { AddOrderPageModule } from '../pages/add-order/add-order.module';
import { CartDetailPageModule } from '../pages/cart-detail/cart-detail.module';
import { LeadsDetailPageModule } from '../pages/leads-detail/leads-detail.module';
import { LeaveListPageModule } from '../pages/leave-list/leave-list.module';
import { AddLeavePageModule } from '../pages/add-leave/add-leave.module';
import { MainDistributorListPageModule } from '../pages/sales-app/main-distributor-list/main-distributor-list.module';
import { WorkTypeModalPageModule } from '../pages/work-type-modal/work-type-modal.module';
import { AddCheckinPageModule } from '../pages/sales-app/add-checkin/add-checkin.module';
import { CheckinListPageModule } from '../pages/sales-app/checkin-list/checkin-list.module';
import { EndCheckinPageModule } from '../pages/sales-app/end-checkin/end-checkin.module';
import { OrderListPageModule } from '../pages/order-list/order-list.module';
import { AttendencePageModule } from '../pages/attendence/attendence.module';
import { TravelListPageModule } from '../pages/travel-list/travel-list.module';
import { TravelAddPageModule } from '../pages/travel-add/travel-add.module';
import { SearchPageModule } from '../pages/search/search.module';
import { AddDealerPageModule } from '../pages/sales-app/add-dealer/add-dealer.module';
import { EnquiryserviceProvider } from '../providers/enquiryservice/enquiryservice';
import { DistributorDetailPageModule } from '../pages/sales-app/distributor-detail/distributor-detail.module';
import { CustomerOrderPageModule } from '../pages/sales-app/customer-order/customer-order.module';
import { CustomerCheckinPageModule } from '../pages/sales-app/customer-checkin/customer-checkin.module';
import { DistributorListPageModule } from '../pages/sales-app/distributor-list/distributor-list.module';
// import { AddLeadsPage } from '../pages/sales-app/add-leads/add-leads';
import { CheckinDetailPageModule } from '../pages/sales-app/checkin-detail/checkin-detail.module';
import { AddLeadsPageModule } from '../pages/sales-app/add-leads/add-leads.module';
import { OrderDetailPageModule } from '../pages/order-detail/order-detail.module';
import { NewarrivalsPageModule } from '../pages/newarrivals/newarrivals.module';
// import { TimeCounterPipe } from '../pipes/time-counter/time-counter';
// import { OtpverifyPage } from '../pages/otpverify/otpverify';
import { NearestDealerPageModule } from '../pages/nearest-dealer/nearest-dealer.module';
import { VideoCategoryPageModule } from '../pages/video-category/video-category.module';
// import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Network } from '@ionic-native/network';
import { DealerHomePageModule } from '../pages/dealer-home/dealer-home.module';
import { DealerCheckInPageModule } from '../pages/dealer-check-in/dealer-check-in.module';
import { DealerOrderPageModule } from '../pages/dealer-order/dealer-order.module';
// import { DealerDiscountPage } from '../pages/dealer-discount/dealer-discount';
import { DealerDiscountPageModule } from '../pages/dealer-discount/dealer-discount.module';
import { DealerProfilePageModule } from '../pages/dealer-profile/dealer-profile.module';
import { DealerAddorderPageModule } from '../pages/dealer-addorder/dealer-addorder.module';
import { DealerExecutiveAppPageModule } from '../pages/dealer-executive-app/dealer-executive-app.module';
import { DealerExecutiveListPage } from '../pages/dealer-executive-list/dealer-executive-list';
import { DealerExecutiveListPageModule } from '../pages/dealer-executive-list/dealer-executive-list.module';
import { FavoriteProductPage } from '../pages/favorite-product/favorite-product';
import { FavoriteProductPageModule } from '../pages/favorite-product/favorite-product.module';
// import { ExecutivDetailPageModule } from '../pages/executiv-detail/executiv-detail.module';
import { EditNetworkPageModule } from '../pages/sales-app/edit-network/edit-network.module';
import { ExecutiveEditPageModule } from '../pages/executive-edit/executive-edit.module';
import { ExecutivePopoverPageModule } from '../pages/executive-popover/executive-popover.module';
import { ExecutiveOrderDetailPageModule } from '../pages/executive-order-detail/executive-order-detail.module';
// import { CancelationPolicyPage } from '../pages/cancelation-policy/cancelation-policy';
import { CancelationPolicyPageModule } from '../pages/cancelation-policy/cancelation-policy.module';
import { CancelpolicyModalPageModule } from '../pages/cancelpolicy-modal/cancelpolicy-modal.module';
import { FollowupListPageModule } from '../pages/followup-list/followup-list.module';
import { FollowupAddPageModule } from '../pages/followup-add/followup-add.module';
import { ExpenseAddPageModule } from '../pages/expense-add/expense-add.module';
import { ExpenseListPageModule } from '../pages/expense-list/expense-list.module';
import { CatalogueHomePageModule } from '../pages/catalogue-home/catalogue-home.module';
import { ExpenseDetailPageModule } from '../pages/expense-detail/expense-detail.module';
import { AnnouncementListPageModule } from '../pages/announcement/announcement-list/announcement-list.module';
import { AnnouncementDetailPageModule } from '../pages/announcement/announcement-detail/announcement-detail.module';
import { PolicyPageModule } from '../pages/policy/policy.module';
import { SupportPageModule } from '../pages/support/support.module';

import { TravelDetailPageModule } from '../pages/travel-detail/travel-detail.module';
import { ContractorMeetListPageModule } from '../pages/Contractor-Meet/contractor-meet-list/contractor-meet-list.module';
import { ContractorMeetAddPageModule } from '../pages/Contractor-Meet/contractor-meet-add/contractor-meet-add.module';
import { ContractorMeetDetailPageModule } from '../pages/Contractor-Meet/contractor-meet-detail/contractor-meet-detail.module';
import { VisitingCardListPageModule } from '../pages/visiting-card/visiting-card-list/visiting-card-list.module';
import { VisitingCardAddPageModule } from '../pages/visiting-card/visiting-card-add/visiting-card-add.module';
// import { VisitingCardModalPage } from '../pages/visiting-card/visiting-card-modal/visiting-card-modal';
import { LmsLeadListPageModule } from '../pages/sales-app/new-lead/lms-lead-list/lms-lead-list.module';
import { LmsLeadAddPageModule } from '../pages/sales-app/new-lead/lms-lead-add/lms-lead-add.module';
import { LmsLeadDetailPageModule } from '../pages/sales-app/new-lead/lms-lead-detail/lms-lead-detail.module';
import { LmsActivityListPageModule } from '../pages/sales-app/new-lead/lms-lead-activity/lms-activity-list/lms-activity-list.module';
import { LmsActivityAddPageModule } from '../pages/sales-app/new-lead/lms-lead-activity/lms-activity-add/lms-activity-add.module';
import { LmsFollowupAddPageModule } from '../pages/sales-app/new-lead/lms-lead-followup/lms-followup-add/lms-followup-add.module';
import { LmsFollowupListPageModule } from '../pages/sales-app/new-lead/lms-lead-followup/lms-followup-list/lms-followup-list.module';
import { LmsQuotationAddPageModule } from '../pages/sales-app/new-lead/lms-lead-quotation/lms-quotation-add/lms-quotation-add.module';
import { LmsQuotationListPageModule } from '../pages/sales-app/new-lead/lms-lead-quotation/lms-quotation-list/lms-quotation-list.module';
import { PopGiftAddPageModule } from '../pages/sales-app/pop-gift/pop-gift-add/pop-gift-add.module';
import { PopGiftListPageModule } from '../pages/sales-app/pop-gift/pop-gift-list/pop-gift-list.module';
import { PopGiftOutgoingPageModule } from '../pages/sales-app/pop-gift/pop-gift-outgoing/pop-gift-outgoing.module';
// import { ContractorModalPage } from '../pages/Contractor-Meet/contractor-modal/contractor-modal';
import { LmsQuotationDetailPageModule } from '../pages/sales-app/new-lead/lms-lead-quotation/lms-quotation-detail/lms-quotation-detail.module';
import { TargetAchievementPageModule } from '../pages/target-achievement/target-achievement.module';
import { AnnouncementListPage } from '../pages/announcement/announcement-list/announcement-list';
import { AddMultipleContactPageModule } from '../pages/add-multiple-contact/add-multiple-contact.module';
import { ContractorModalPageModule } from '../pages/Contractor-Meet/contractor-modal/contractor-modal.module';
import { ExpensePopoverPageModule } from '../pages/expense-popover/expense-popover.module';
import { ExpenseStatusModalPageModule } from '../pages/expense-status-modal/expense-status-modal.module';
import { MobileLoginPageModule } from '../pages/login-section/mobile-login/mobile-login.module';
import { OtpPageModule } from '../pages/login-section/otp/otp.module';
import { RegistrationPageModule } from '../pages/login-section/registration/registration.module';
import { VisitingCardModalPageModule } from '../pages/visiting-card/visiting-card-modal/visiting-card-modal.module';
import { FollowupDetailPageModule } from '../pages/followup-detail/followup-detail.module';
import { RequirementPageModule } from '../pages/requirement/requirement.module';
import { AddRetailerPageModule } from '../pages/add-retailer/add-retailer.module';
import { RequirementlistPageModule } from '../pages/requirementlist/requirementlist.module';
import { FileOpener } from '@ionic-native/file-opener';
import { WeekconnectionPageModule } from '../pages/weekconnection/weekconnection.module';
import { LoadingCntrlPageModule } from '../pages/loading-cntrl/loading-cntrl.module';
import { DocumentViewer } from '@ionic-native/document-viewer';
import { AttendenceNewPageModule } from '../pages/attendence-new/attendence-new.module';
import { CheckinNewPageModule } from '../pages/checkin-new/checkin-new.module';
import { TravelListNewPageModule } from '../pages/travel-list-new/travel-list-new.module';
import { TravelAddNewPageModule } from '../pages/travel-add-new/travel-add-new.module';
import { TravelEditNewPageModule } from '../pages/travel-edit-new/travel-edit-new.module';
import { UploadFilePageModule } from '../pages/upload-file/upload-file.module';
import { UploadFilePage } from '../pages/upload-file/upload-file';
import { TravelPopOverPageModule } from '../pages/travel-pop-over/travel-pop-over.module';
import { ChangeStatusModelPageModule } from '../pages/change-status-model/change-status-model.module';
import { TravelNewlistPageModule } from '../pages/travel-newlist/travel-newlist.module';
import { TargetPageModule } from '../pages/target/target.module';
import { BillingListPageModule } from '../pages/billing-list/billing-list.module';
import { PrimaryOrderPageModule } from '../pages/primary-order/primary-order.module';
import { PaymentPageModule } from '../pages/payment/payment.module';
import { DealerNetworkPageModule } from '../pages/dealer-network/dealer-network.module';
import { DealerNetworkDetailPageModule } from '../pages/dealer-network-detail/dealer-network-detail.module';
import { InvoiceListPageModule } from '../pages/invoice-list/invoice-list.module';
import { InvoiceDetailPageModule } from '../pages/invoice-detail/invoice-detail.module';
import { LedgerPageModule } from '../pages/ledger/ledger.module';
import { RetailerListPageModule } from '../pages/retailer-list/retailer-list.module';
import { RetailerDetailPageModule } from '../pages/retailer-detail/retailer-detail.module';
import { SecondaryOrderPageModule } from '../pages/secondary-order/secondary-order.module';
import { SchemePageModule } from '../pages/scheme/scheme.module';
import { DashboardNewPageModule } from '../pages/dashboard-new/dashboard-new.module';
import { PrimaryOrderMainPageModule } from '../pages/primary-order-main/primary-order-main.module';
import { SecondaryOrderMainPageModule } from '../pages/secondary-order-main/secondary-order-main.module';
import { PrimaryOrderDetailPageModule } from '../pages/primary-order-detail/primary-order-detail.module';
import { SecondaryOrderDetailPageModule } from '../pages/secondary-order-detail/secondary-order-detail.module';
import { PrimaryOrderAddPageModule } from '../pages/primary-order-add/primary-order-add.module';
import { SecondaryOrderAddPageModule } from '../pages/secondary-order-add/secondary-order-add.module';
import { LoyaltyHomePageModule } from '../pages/loyalty/loyalty-home/loyalty-home.module';
import { LoyaltyPointHistoryPageModule } from '../pages/loyalty/loyalty-point-history/loyalty-point-history.module';
import { LoyaltyProfilePageModule } from '../pages/loyalty/loyalty-profile/loyalty-profile.module';
import { LoyaltyAboutPageModule } from '../pages/loyalty/loyalty-about/loyalty-about.module';
import { LoyaltyContactPageModule } from '../pages/loyalty/loyalty-contact/loyalty-contact.module';
import { LoyaltyGiftGalleryPageModule } from '../pages/loyalty/loyalty-gift-gallery/loyalty-gift-gallery.module';
import { LoyaltyVideoPageModule } from '../pages/loyalty/loyalty-video/loyalty-video.module';
import { LoyaltyRedeemRequestPageModule } from '../pages/loyalty/loyalty-redeem-request/loyalty-redeem-request.module';
import { LoyaltyGiftGalleryDetailPageModule } from '../pages/loyalty/loyalty-gift-gallery-detail/loyalty-gift-gallery-detail.module';
import { LoyaltyGiftTrackerPageModule } from '../pages/loyalty/loyalty-gift-tracker/loyalty-gift-tracker.module';
import { LoyaltyTrackerDetailPageModule } from '../pages/loyalty/loyalty-tracker-detail/loyalty-tracker-detail.module';
import { LoyaltyEnterCouponCodePageModule } from '../pages/loyalty-enter-coupon-code/loyalty-enter-coupon-code.module';
import { LoyaltyCataloguePageModule } from '../pages/loyalty-catalogue/loyalty-catalogue.module';
import { CongratulationsPage } from '../pages/loyalty/congratulations/congratulations';
import { CongratulationsPageModule } from '../pages/loyalty/congratulations/congratulations.module';
import { DistributorSaleTargetPageModule } from '../pages/distributor-sale-target/distributor-sale-target.module';
import { PrimaryAddItemPageModule } from '../pages/primary-add-item/primary-add-item.module';
import { SecondaryAddItemPageModule } from '../pages/secondary-add-item/secondary-add-item.module';
import { SurveyListPageModule } from '../pages/survey/survey-list/survey-list.module';
import { SurveyDetailPageModule } from '../pages/survey/survey-detail/survey-detail.module';
import { BonusPointPageModule } from '../pages/bonus-point/bonus-point.module';
import { InfluencerPointTransferPageModule } from '../pages/influencer-point-transfer/influencer-point-transfer.module';
import { MyInfluencerPageModule } from '../pages/my-influencer/my-influencer.module';
import { MyInfluencerDetailPageModule } from '../pages/my-influencer-detail/my-influencer-detail.module';
import { SupportListPageModule } from '../pages/support-list/support-list.module';
import { SupportDetailPageModule } from '../pages/support-detail/support-detail.module';
import { TaskListPageModule } from '../pages/task-list/task-list.module';
import { TaskAddPageModule } from '../pages/task-add/task-add.module';
import { TaskDetailPageModule } from '../pages/task-detail/task-detail.module';
import { DistributorPopHistoryPageModule } from '../pages/distributor-pop-history/distributor-pop-history.module';
import { SiteDetailPageModule } from '../pages/loyalty/site-detail/site-detail.module';
import { SiteListPageModule } from '../pages/loyalty/site-list/site-list.module';
import { SiteAddPageModule } from '../pages/loyalty/site-add/site-add.module'
import { ScanningPageModule } from '../pages/scanning/scanning.module';
import { OpenNativeSettings } from '@ionic-native/open-native-settings'
import { Device } from '@ionic-native/device'
import { UserTargetPageModule } from '../pages/user-target/user-target.module';
import { PartyTargetPageModule } from '../pages/party-target/party-target.module';
import { ProductSubDetail2PageModule } from '../pages/product-sub-detail2/product-sub-detail2.module';
import { AnnouncementNoticesListPageModule } from '../pages/announcement-notices-list/announcement-notices-list.module';
import { HolidayListPageModule } from '../pages/holiday-list/holiday-list.module';
import { OrderStatusChangePageModule } from '../pages/order-status-change/order-status-change.module';
import { DistributorDealerWalletPageModule } from '../pages/distributor-dealer-wallet/distributor-dealer-wallet.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExpenseAddNewPageModule } from '../pages/expense-add-new/expense-add-new.module';
import { ImagePicker } from '@ionic-native/image-picker';
import { TransferPointsWalletPageModule } from '../pages/DMS/Transfer-Points/transfer-points-wallet/transfer-points-wallet.module';
import { TransferRequestListingPageModule } from '../pages/DMS/Transfer-Points/transfer-request-listing/transfer-request-listing.module';
import { TransferRequestDetailPageModule } from '../pages/DMS/Transfer-Points/transfer-request-detail/transfer-request-detail.module';
import { TransferRequestAddPageModule } from '../pages/DMS/Transfer-Points/transfer-request-add/transfer-request-add.module';
import { SendPointRequestAddPageModule } from '../pages/DMS/Transfer-Points/send-point-request-add/send-point-request-add.module';
import { SendPointRequestListingPageModule } from '../pages/DMS/Transfer-Points/send-point-request-listing/send-point-request-listing.module';
import { PointTransferLedgerPageModule } from '../pages/DMS/Transfer-Points/point-transfer-ledger/point-transfer-ledger.module';
import { StockPageModule } from '../pages/DMS/stock-manage/stock/stock.module';
import { StockDetailPageModule } from '../pages/DMS/stock-manage/stock-detail/stock-detail.module';
import { DrStockPageModule } from '../pages/DMS/DrModule/dr-stock/dr-stock.module';
import { DrDetailPageModule } from '../pages/DMS/DrModule/dr-detail/dr-detail.module';
import { SendPointReqDetailPageModule } from '../pages/DMS/Transfer-Points/send-point-req-detail/send-point-req-detail.module';
import { ReturnPointListingPageModule } from '../pages/DMS/Transfer-Points/return-point-listing/return-point-listing.module';
import { ReturnPointDetailPageModule } from '../pages/DMS/Transfer-Points/return-point-detail/return-point-detail.module';
import { DealerDealerListPageModule } from '../pages/DMS/DrModule/dealer-dealer-list/dealer-dealer-list.module';
import { DrGiftGalleryListingPageModule } from '../pages/DMS/DrGiftGallery/dr-gift-gallery-listing/dr-gift-gallery-listing.module';
import { KriKpaTargetPageModule } from '../pages/kri-kpa-target/kri-kpa-target.module';
import { BackgroundTrackListingPageModule } from '../pages/background-track-listing/background-track-listing.module';
import { BackgroundTrackDetailPageModule } from '../pages/background-track-detail/background-track-detail.module';
import { InspectionPage } from '../pages/inspection/inspection';
import { CloseComplaintPage } from '../pages/close-complaint/close-complaint';
import { CloseInstalltionPage } from '../pages/installation/close-installtion/close-installtion';
import { EditInspectionPage } from '../pages/edit-inspection/edit-inspection';
import { SparePage } from '../pages/spare/spare';
import { CloseComplaintPageModule } from '../pages/close-complaint/close-complaint.module';
import { EditInspectionPageModule } from '../pages/edit-inspection/edit-inspection.module';
import { InspectionPageModule } from '../pages/inspection/inspection.module';
import { SpareAddPageModule } from '../pages/complaints/spare-add/spare-add.module';
import { SparePageModule } from '../pages/spare/spare.module';
import { AddInstallationPageModule } from '../pages/installation/add-installation/add-installation.module';
import { CloseInstalltionPageModule } from '../pages/installation/close-installtion/close-installtion.module';
import { InstallationDetailPageModule } from '../pages/installation/installation-detail/installation-detail.module';
import { InstallationListPageModule } from '../pages/installation/installation-list/installation-list.module';

//------------------------------------------ While production build --------------------------------------------------------------
//  import { BackgroundGeolocation } from 'cordova-background-geolocation-lt';   
 
// --------------------- --------------------- While serve app --------------------------------------------------------------
import BackgroundGeolocation from 'cordova-background-geolocation-lt';   
import { ServiceHomePageModule } from '../pages/service-home/service-home.module';
import { AddPaymentPage } from '../pages/add-payment/add-payment';
import { ServiceInvoicePage } from '../pages/service-invoice/service-invoice';
import { ServiceInvoiceDetailPage } from '../pages/service-invoice-detail/service-invoice-detail';
import { AddinvoicePage } from '../pages/addinvoice/addinvoice';
import { AddPaymentPageModule } from '../pages/add-payment/add-payment.module';
import { ServiceInvoicePageModule } from '../pages/service-invoice/service-invoice.module';
import { ServiceInvoiceDetailPageModule } from '../pages/service-invoice-detail/service-invoice-detail.module';
import { AddinvoicePageModule } from '../pages/addinvoice/addinvoice.module';
import { ProminentDisclosureModalPageModule } from '../pages/prominent-disclosure-modal/prominent-disclosure-modal.module';
import { PrivacyPolicyPageModule } from '../pages/privacy-policy/privacy-policy.module';
import { BrandAuditListPageModule } from '../pages/brand-audit-list/brand-audit-list.module';
import { BrandAuditAddPageModule } from '../pages/brand-audit-add/brand-audit-add.module';
import { BrandAuditDetailPageModule } from '../pages/brand-audit-detail/brand-audit-detail.module';
import { TravelMonthlyAddPageModule } from '../pages/travel-monthly-add/travel-monthly-add.module';
import { AddTargetPageModule } from '../pages/add-target/add-target.module';
import { SiteProjectListPageModule } from '../pages/site-project/site-project-list/site-project-list.module';
import { SiteProjectDetailPageModule } from '../pages/site-project/site-project-detail/site-project-detail.module';
import { AddSiteProjectPageModule } from '../pages/site-project/add-site-project/add-site-project.module';
import { PopRequisitionPageModule } from '../pages/pop-requisition/pop-requisition.module';
import { PopRequisitionAddPageModule } from '../pages/pop-requisition-add/pop-requisition-add.module';
import { Market } from '@ionic-native/market'
import { TargetVsAchievementPageModule } from '../pages/target-vs-achievement/target-vs-achievement.module';
import { CheckinSummaryPageModule } from '../pages/checkin-summary/checkin-summary.module';
import { PriceListPageModule } from '../pages/price-list/price-list.module';
import { CameraModalPageModule } from '../pages/camera-modal/camera-modal.module';
import { CameraPreview } from '@ionic-native/camera-preview';
import { TeamTrackDetailPageModule } from '../pages/team-track-detail/team-track-detail.module';

@NgModule({
    declarations: [
        MyApp,
        HomePage,
        TabsPage,
        SafePipe,
    ],
    imports: [
        CameraModalPageModule,
        AddRetailerPageModule,
        VisitingCardModalPageModule,
        OtpPageModule,
        RegistrationPageModule,
        MobileLoginPageModule,
        ExpenseStatusModalPageModule,
        ExpensePopoverPageModule,
        TravelPopOverPageModule,
        DealerExecutiveAppPageModule,
        TaskClosePageModule,
        EnquiryPageModule,
        BrowserModule, 
        IonicModule.forRoot(MyApp),
        ScanPageModule,
        CoupanCodePageModule,
        GiftDetailPageModule,
        CheckinSummaryPageModule,
        GiftListPageModule,
        OffersPageModule,
        ViewProfilePageModule,
        PointListPageModule,
        PointDetailPageModule,
        ProfilePageModule,
        MainHomePageModule,
        ProductsPageModule,
        TermsPageModule,
        NewarrivalsPageModule,
        TargetVsAchievementPageModule,
        ProductDetailPageModule,
        ProductSubDetail2PageModule,
        AnnouncementListPageModule,
        VideoCategoryPageModule,
        ProductSubdetailPageModule,
        TransactionPageModule,
        ShippingDetailPageModule,
        NotificationPageModule,
        ContactPageModule,
        VideoPageModule,
        NewsPageModule,
        PinchZoomModule,
        NewsDetailPageModule,
        FeedbackPageModule,
        HttpClientModule,
        HttpModule,
        IonicStorageModule.forRoot(),
        OfferListPageModule,
        AddNewComplaintPageModule,
        PriceListPageModule,
        ComplaintDetailPageModule,
        ComplaintHistoryPageModule,
        MyCamplaintsPageModule,
        PulmberCustomerDetailPageModule,
        Super30PageModule,
        CancelComplaintPageModule,
        PointLocationPageModule,
        EditProfilePageModule,
        CategoryPageModule,
        FavoriteProductPageModule,
        WorkTypeModalPageModule,
        LoginPageModule,
        DashboardPageModule,
        AddOrderPageModule,
        CartDetailPageModule,
        LeadsDetailPageModule,
        LeaveListPageModule,
        AddLeavePageModule,
        MainDistributorListPageModule,
        AddCheckinPageModule,
        CheckinListPageModule,
        EndCheckinPageModule,
        OrderListPageModule,
        AttendencePageModule,
        AttendenceNewPageModule,
        NewarrivalsPageModule,
        TravelListPageModule,
        TravelAddPageModule,
        SearchPageModule,
        AddDealerPageModule,
        DistributorDetailPageModule,
        CustomerOrderPageModule,
        CustomerCheckinPageModule,
        DistributorListPageModule,
        NearestDealerPageModule,
        AddLeadsPageModule,
        CheckinDetailPageModule,
        OrderDetailPageModule,
        ExecutiveOrderDetailPageModule,
        DealerHomePageModule,
        DealerCheckInPageModule,
        DealerOrderPageModule,
        DealerDiscountPageModule,
        DealerProfilePageModule,
        DealerAddorderPageModule,
        DealerExecutiveListPageModule,
        LmsQuotationDetailPageModule,
        EditNetworkPageModule,
        ExecutiveEditPageModule,
        ExecutivePopoverPageModule,
        CancelationPolicyPageModule,
        CancelpolicyModalPageModule,
        FollowupListPageModule,
        HolidayListPageModule,
        FollowupAddPageModule,
        ExpenseAddPageModule,
        ExpenseAddNewPageModule,
        ExpenseListPageModule,
        CatalogueHomePageModule,
        ExpenseDetailPageModule,
        AnnouncementNoticesListPageModule,
        AnnouncementDetailPageModule,
        PolicyPageModule,
        SupportPageModule,
        TravelDetailPageModule,
        ContractorMeetListPageModule,
        ContractorMeetAddPageModule,
        ContractorMeetDetailPageModule,
        EnquiryPageModule,
        VisitingCardListPageModule,
        VisitingCardAddPageModule,
        LmsLeadListPageModule,
        LmsLeadAddPageModule,
        LmsLeadDetailPageModule,
        TeamTrackDetailPageModule,
        LmsActivityListPageModule,
        LmsActivityAddPageModule,
        LmsFollowupAddPageModule,
        LmsFollowupListPageModule,
        LmsQuotationAddPageModule,
        LmsQuotationListPageModule,
        PopGiftAddPageModule,
        PopGiftOutgoingPageModule,
        TargetAchievementPageModule,
        AddMultipleContactPageModule,
        SelectRegistrationTypePageModule,
        OtpverifyPageModule,
        ContractorModalPageModule,
        FollowupDetailPageModule,
        RequirementPageModule,
        RequirementlistPageModule,
        WeekconnectionPageModule,
        LoadingCntrlPageModule,
        CheckinNewPageModule,
        TravelListNewPageModule,
        TravelAddNewPageModule,
        TravelEditNewPageModule,
        UploadFilePageModule,
        ChangeStatusModelPageModule,
        TravelNewlistPageModule,
        TargetPageModule,
        BillingListPageModule,
        PrimaryOrderPageModule,
        PaymentPageModule,
        DealerNetworkPageModule,
        DealerNetworkDetailPageModule,
        InvoiceListPageModule,
        InvoiceDetailPageModule,
        LedgerPageModule,
        RetailerListPageModule,
        RetailerDetailPageModule,
        SecondaryOrderPageModule,
        PopGiftListPageModule,
        SchemePageModule,
        DashboardNewPageModule,
        KriKpaTargetPageModule,
        SecondaryOrderMainPageModule,
        PrimaryOrderMainPageModule,
        PrimaryOrderDetailPageModule,
        SecondaryOrderDetailPageModule,
        SecondaryOrderAddPageModule,
        PrimaryOrderAddPageModule,
        LoyaltyHomePageModule,
        LoyaltyPointHistoryPageModule,
        LoyaltyProfilePageModule,
        LoyaltyAboutPageModule,
        LoyaltyContactPageModule,
        BrowserAnimationsModule,
        LoyaltyGiftGalleryPageModule,
        LoyaltyVideoPageModule,
        LoyaltyRedeemRequestPageModule,
        LoyaltyGiftGalleryDetailPageModule,
        LoyaltyGiftTrackerPageModule,
        LoyaltyTrackerDetailPageModule,
        LoyaltyEnterCouponCodePageModule,
        LoyaltyCataloguePageModule,
        CongratulationsPageModule,
        DistributorSaleTargetPageModule,
        SecondaryAddItemPageModule,
        PrimaryAddItemPageModule,
        SurveyListPageModule,
        SurveyDetailPageModule,
        BonusPointPageModule,
        InfluencerPointTransferPageModule,
        MyInfluencerPageModule,
        MyInfluencerDetailPageModule,
        InfluencerPointTransferPageModule,
        SupportListPageModule,
        SupportDetailPageModule,
        TaskAddPageModule,
        TaskListPageModule,
        TaskDetailPageModule,
        DistributorPopHistoryPageModule,
        SiteDetailPageModule,
        SiteListPageModule,
        SiteAddPageModule,
        ScanningPageModule,
        UserTargetPageModule,
        PartyTargetPageModule,
        OrderStatusChangePageModule,
        DistributorDealerWalletPageModule,
        TransferPointsWalletPageModule,
        TransferRequestListingPageModule,
        TransferRequestDetailPageModule,
        TransferRequestAddPageModule,
        SendPointRequestAddPageModule,
        SendPointRequestListingPageModule,
        PointTransferLedgerPageModule,
        DrGiftGalleryListingPageModule,
        StockPageModule,
        StockDetailPageModule,
        DealerDealerListPageModule,
        DrStockPageModule,
        DrDetailPageModule,
        SendPointReqDetailPageModule,
        ReturnPointListingPageModule,
        ReturnPointDetailPageModule,
        BackgroundTrackListingPageModule,
        BackgroundTrackDetailPageModule,
        CloseComplaintPageModule,
        EditInspectionPageModule,
        InspectionPageModule,
        AddNewComplaintPageModule,
        ComplaintDetailPageModule,
        ComplaintHistoryPageModule,
        SpareAddPageModule,
        SparePageModule,
        AddInstallationPageModule,
        CloseInstalltionPageModule,
        InstallationDetailPageModule,
        InstallationListPageModule,
        ProminentDisclosureModalPageModule,
        ServiceHomePageModule,
        AddPaymentPageModule,
        ServiceInvoicePageModule,
        ServiceInvoiceDetailPageModule,
        AddinvoicePageModule,
        PrivacyPolicyPageModule,
        BrandAuditDetailPageModule,
        BrandAuditAddPageModule,
        BrandAuditListPageModule,
        TravelMonthlyAddPageModule,
        AddTargetPageModule,
        SiteProjectListPageModule,
        SiteProjectDetailPageModule,
        AddSiteProjectPageModule,
        PopRequisitionPageModule,
        PopRequisitionAddPageModule,

    ],
    bootstrap: [IonicApp],
    entryComponents: [
        HomePage,
        TabsPage,
        CongratulationsPage,
        AnnouncementListPage,
        UploadFilePage,
        InspectionPage,
        CloseComplaintPage,
        CloseInstalltionPage,
        EditInspectionPage,
        SparePage,
        AddPaymentPage,
        ServiceInvoicePage,
        ServiceInvoiceDetailPage,
        AddinvoicePage
    ],
    providers: [
          TextToSpeech,
         SpeechRecognition,
        CameraPreview,
        StatusBar,
        DbserviceProvider,
        LoginserviceProvider,
        SplashScreen,
        OpenNativeSettings,
        ConstantProvider,
        Geolocation,
        NativeGeocoder,
        BackgroundGeolocation,
        Camera,
        PhotoViewer,
        ImagePicker,
        MediaCapture,
        BarcodeScanner,
        FileTransfer,
        SocialSharing,

        Market,

        Push,
        FileTransferObject,
        File,
        LaunchNavigator,
        Diagnostic,
        AndroidPermissions,
        AppVersion,
        DocumentViewer,
        //sfa
        AttendenceserviceProvider,
        EnquiryserviceProvider,
        CatalougeProvider,
        GeolocationserviceProvider,
        CatalougeProvider,
        MyserviceProvider,
        LocationAccuracy,
        AttendenceserviceProvider,
        InAppBrowser,
        // SQLite,
        VideoPlayer,
        Device,
        // InfiniteScroll,
        Network,
        { provide: ErrorHandler, useClass: IonicErrorHandler },

        // GoogleMaps,
        // DocumentViewer
        FileOpener
    ]
})
export class AppModule { }
