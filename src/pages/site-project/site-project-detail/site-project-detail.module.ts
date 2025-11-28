import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SiteProjectDetailPage } from './site-project-detail'; 

@NgModule({
  declarations: [
    SiteProjectDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(SiteProjectDetailPage),
  ],
})
export class SiteProjectDetailPageModule {}
