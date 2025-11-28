import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SupportPage } from './support';
import { IonicSelectableModule } from 'ionic-selectable';
@NgModule({
  declarations: [
    SupportPage,
  ],
  imports: [
    IonicPageModule.forChild(SupportPage),
    IonicSelectableModule
  ],
})
export class SupportPageModule {}
