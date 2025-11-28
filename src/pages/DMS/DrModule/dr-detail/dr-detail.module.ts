import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DrDetailPage } from './dr-detail';

@NgModule({
  declarations: [
    DrDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(DrDetailPage),
  ],
})
export class DrDetailPageModule {}
