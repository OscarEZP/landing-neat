import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ToolbarComponent} from './toolbar.component/toolbar.component';
import {MatToolbarModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatToolbarModule
  ],
  exports: [
    ToolbarComponent
  ],
  declarations: [ ToolbarComponent ],
})
export class NavigationModule { }
