import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { CoreModule } from '../core/core.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CoreModule,
    PagesRoutingModule
  ]
})
export class PagesModule { }
