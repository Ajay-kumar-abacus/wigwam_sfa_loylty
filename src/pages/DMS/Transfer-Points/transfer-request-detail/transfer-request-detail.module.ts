import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransferRequestDetailPage } from './transfer-request-detail';

@NgModule({
  declarations: [
    TransferRequestDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(TransferRequestDetailPage),
  ],
})
export class TransferRequestDetailPageModule {}
