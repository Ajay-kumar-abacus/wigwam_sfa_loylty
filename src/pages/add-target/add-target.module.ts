import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddTargetPage } from './add-target';
import { IonicSelectableModule } from 'ionic-selectable';
@NgModule({
  declarations: [
    AddTargetPage,
  ],
  imports: [
    IonicPageModule.forChild(AddTargetPage),
    IonicSelectableModule
  ],
})
export class AddTargetPageModule {}
