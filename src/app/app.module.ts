import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RectangleComponent } from './components/rectangle/rectangle.component';
import { CanvasComponent } from './canvas/canvas.component';
import { MushafPageComponent } from './canvas/mushaf-page/mushaf-page.component';

@NgModule({
  declarations: [
    AppComponent,
    RectangleComponent,
    CanvasComponent,
    MushafPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
