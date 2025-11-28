import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServiceInvoicePage } from './service-invoice';

@NgModule({
  declarations: [
    ServiceInvoicePage,
  ],
  imports: [
    IonicPageModule.forChild(ServiceInvoicePage),
  ],
})
export class ServiceInvoicePageModule {}
