import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContractorMeetListPage } from './contractor-meet-list';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  declarations: [
    ContractorMeetListPage,
  ],
  imports: [
    IonicPageModule.forChild(ContractorMeetListPage),
    IonicSelectableModule
  ],
})
export class ContractorMeetListPageModule { }
