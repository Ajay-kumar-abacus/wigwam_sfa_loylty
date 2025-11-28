import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServiceInvoiceDetailPage } from './service-invoice-detail';

@NgModule({
  declarations: [
    ServiceInvoiceDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ServiceInvoiceDetailPage),
  ],
})
export class ServiceInvoiceDetailPageModule {}
