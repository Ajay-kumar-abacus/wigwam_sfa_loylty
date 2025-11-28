import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LmsLeadListPage } from './lms-lead-list';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  declarations: [
    LmsLeadListPage,
  ],
  imports: [
    IonicPageModule.forChild(LmsLeadListPage),
    IonicSelectableModule,
  ],
})
export class LmsLeadListPageModule {}
