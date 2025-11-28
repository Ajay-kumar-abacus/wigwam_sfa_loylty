import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InstallationListPage } from './installation-list';

@NgModule({
  declarations: [
    InstallationListPage,
  ],
  imports: [
    IonicPageModule.forChild(InstallationListPage),
  ],
})
export class InstallationListPageModule {}
