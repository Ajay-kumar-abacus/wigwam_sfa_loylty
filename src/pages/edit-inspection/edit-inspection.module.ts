import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditInspectionPage } from './edit-inspection';

@NgModule({
  declarations: [
    EditInspectionPage,
  ],
  imports: [
    IonicPageModule.forChild(EditInspectionPage),
  ],
})
export class EditInspectionPageModule {}
