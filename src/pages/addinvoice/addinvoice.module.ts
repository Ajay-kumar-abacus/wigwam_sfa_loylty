import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddinvoicePage } from './addinvoice';

@NgModule({
  declarations: [
    AddinvoicePage,
  ],
  imports: [
    IonicPageModule.forChild(AddinvoicePage),
  ],
})
export class AddinvoicePageModule {}
