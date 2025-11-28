import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoyaltyDraftPurchasePage } from './loyalty-draft-purchase';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    LoyaltyDraftPurchasePage,
  ],
  imports: [
    IonicPageModule.forChild(LoyaltyDraftPurchasePage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
})
export class LoyaltyDraftPurchasePageModule {}
