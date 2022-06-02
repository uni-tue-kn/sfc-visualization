import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {ServicefunctionchainComponent} from './servicefunctionchain/servicefunctionchain.component';
import { UnderlayComponent } from './underlay/underlay.component';
import { OverlayComponent } from './overlay/overlay.component';
import { StartpageComponent } from './startpage/startpage.component';


const routes: Routes = [
{path:'sfc',component:ServicefunctionchainComponent},
{path:'underlay',component:UnderlayComponent},
{path:'overlay',component:OverlayComponent},
{path:'start', component:StartpageComponent},
{path:'',redirectTo:'start', pathMatch: 'full' }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
