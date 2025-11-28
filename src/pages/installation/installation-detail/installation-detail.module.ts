import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InstallationDetailPage } from './installation-detail';

@NgModule({
  declarations: [
    InstallationDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(InstallationDetailPage),
  ],
})
export class InstallationDetailPageModule {}
