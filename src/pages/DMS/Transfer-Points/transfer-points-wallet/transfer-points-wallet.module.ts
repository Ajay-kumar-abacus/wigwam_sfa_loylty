import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransferPointsWalletPage } from './transfer-points-wallet';

@NgModule({
  declarations: [
    TransferPointsWalletPage,
  ],
  imports: [
    IonicPageModule.forChild(TransferPointsWalletPage),
  ],
})
export class TransferPointsWalletPageModule {}
