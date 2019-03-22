import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { EnhancedApiService } from './enhanced_api.service';
import { PrhcApiService } from './prhc_api.service';
import { MWSApiService } from './mws_api.service';
import { RetailersService } from './retailers.service';
import { SegmentApiService } from './segment_api.service';
import { TealiumUtagService } from './utag.service';

@NgModule({
  providers: [
    EnhancedApiService,
    PrhcApiService,
    MWSApiService,
    RetailersService,
    SegmentApiService,
    TealiumUtagService,
  ],
  imports: [
    HttpClientModule,
  ],
})
export class ServicesModule {}
