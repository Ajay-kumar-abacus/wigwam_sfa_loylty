import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BrandAuditDetailPage } from './brand-audit-detail';

@NgModule({
  declarations: [
    BrandAuditDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(BrandAuditDetailPage),
  ],
})
export class BrandAuditDetailPageModule {}
