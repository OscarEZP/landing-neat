import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Modules
import { AccessModule } from './access/access.module';
import { ContentModule } from './content/content.module';
import { LayoutModule } from './layout/layout.module';
import { AppRoutingModule } from './app-routing.module';

// Components
import { AppComponent } from './app.component';

// Services
import { AuthService } from './access/_services/auth.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AccessModule,
    ContentModule,
    LayoutModule,
    AppRoutingModule
  ],
  providers: [AuthService],
  schemas: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
