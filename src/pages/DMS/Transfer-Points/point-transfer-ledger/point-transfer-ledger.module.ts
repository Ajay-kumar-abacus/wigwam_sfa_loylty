import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PointTransferLedgerPage } from './point-transfer-ledger';

@NgModule({
  declarations: [
    PointTransferLedgerPage,
  ],
  imports: [
    IonicPageModule.forChild(PointTransferLedgerPage),
  ],
})
export class PointTransferLedgerPageModule {}
