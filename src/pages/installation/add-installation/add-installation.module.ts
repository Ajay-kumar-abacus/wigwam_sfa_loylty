import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddInstallationPage } from './add-installation';

@NgModule({
  declarations: [
    AddInstallationPage,
  ],
  imports: [
    IonicPageModule.forChild(AddInstallationPage),
  ],
})
export class AddInstallationPageModule {}
