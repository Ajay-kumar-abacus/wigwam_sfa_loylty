import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SpareAddPage } from './spare-add';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  declarations: [
    SpareAddPage,
  ],
  imports: [
    IonicPageModule.forChild(SpareAddPage),
    IonicSelectableModule
  ],
})
export class SpareAddPageModule {}
