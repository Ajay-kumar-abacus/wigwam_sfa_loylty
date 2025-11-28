import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { KriKpaTargetPage } from './kri-kpa-target';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  declarations: [
    KriKpaTargetPage,
  ],
  imports: [
    IonicPageModule.forChild(KriKpaTargetPage),
    IonicSelectableModule
  ],
})
export class KriKpaTargetPageModule {}
