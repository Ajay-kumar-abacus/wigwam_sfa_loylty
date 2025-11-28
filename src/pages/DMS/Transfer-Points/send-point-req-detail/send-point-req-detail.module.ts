import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendPointReqDetailPage } from './send-point-req-detail';

@NgModule({
  declarations: [
    SendPointReqDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(SendPointReqDetailPage),
  ],
})
export class SendPointReqDetailPageModule {}
