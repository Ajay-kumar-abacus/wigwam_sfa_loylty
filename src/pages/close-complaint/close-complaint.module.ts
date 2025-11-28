import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CloseComplaintPage } from './close-complaint';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  declarations: [
    CloseComplaintPage,
  ],
  imports: [
    IonicPageModule.forChild(CloseComplaintPage),
    IonicSelectableModule
  ],
})
export class CloseComplaintPageModule {}
