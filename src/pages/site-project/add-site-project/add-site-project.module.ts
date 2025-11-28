import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddSiteProjectPage } from './add-site-project';
import { IonicSelectableModule } from 'ionic-selectable';
@NgModule({
  declarations: [
    AddSiteProjectPage,
  ],
  imports: [
    IonicPageModule.forChild(AddSiteProjectPage),
    IonicSelectableModule
  ],
})
export class AddSiteProjectPageModule {}
