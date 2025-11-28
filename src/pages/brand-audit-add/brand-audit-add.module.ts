import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BrandAuditAddPage } from './brand-audit-add';
import { IonicSelectableModule } from 'ionic-selectable';
@NgModule({
  declarations: [
    BrandAuditAddPage,
  ],
  imports: [
    IonicPageModule.forChild(BrandAuditAddPage),
    IonicSelectableModule
  ],
})
export class BrandAuditAddPageModule {}
