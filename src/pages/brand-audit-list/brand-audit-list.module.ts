import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BrandAuditListPage } from './brand-audit-list';

@NgModule({
  declarations: [
    BrandAuditListPage,
  ],
  imports: [
    IonicPageModule.forChild(BrandAuditListPage),
  ],
})
export class BrandAuditListPageModule {}
