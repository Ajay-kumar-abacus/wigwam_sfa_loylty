import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InspectionPage } from './inspection';

@NgModule({
  declarations: [
    InspectionPage,
  ],
  imports: [
    IonicPageModule.forChild(InspectionPage),
  ],
})
export class InspectionPageModule {}
