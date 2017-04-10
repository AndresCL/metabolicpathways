import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ROUTING } from './app.routes';
import { AppComponent } from './app.component';
import { LoadpathwayComponent } from './load-pathway/loadpathway.component';
import { ColorschemeComponent } from './color-scheme/colorscheme.component';


@NgModule({
    imports: [ BrowserModule, ROUTING ],
    declarations: [
        AppComponent,
        LoadpathwayComponent,
        ColorschemeComponent
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }

