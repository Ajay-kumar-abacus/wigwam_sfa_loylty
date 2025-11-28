import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SiteProjectListPage } from './site-project-list';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  declarations: [
    SiteProjectListPage,
  ],
  imports: [
    IonicPageModule.forChild(SiteProjectListPage),
    IonicSelectableModule
  ],
})
export class SiteProjectListPageModule { }
