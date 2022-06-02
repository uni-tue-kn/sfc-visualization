import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { UnderlayComponent } from './underlay/underlay.component';
import { OverlayComponent } from './overlay/overlay.component';
import { ServicefunctionchainComponent } from './servicefunctionchain/servicefunctionchain.component';
import { StartpageComponent } from './startpage/startpage.component';

@NgModule({
  declarations: [
    AppComponent,
    UnderlayComponent,
    OverlayComponent,
    ServicefunctionchainComponent,
    StartpageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
