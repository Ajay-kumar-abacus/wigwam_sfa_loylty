import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReturnPointDetailPage } from './return-point-detail';

@NgModule({
  declarations: [
    ReturnPointDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ReturnPointDetailPage),
  ],
})
export class ReturnPointDetailPageModule {}
