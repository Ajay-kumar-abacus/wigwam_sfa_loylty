import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoyaltyGiftGalleryDetailPage } from './loyalty-gift-gallery-detail';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    LoyaltyGiftGalleryDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(LoyaltyGiftGalleryDetailPage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
   
  ],
})
export class LoyaltyGiftGalleryDetailPageModule {}
