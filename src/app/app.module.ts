import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ROUTING } from './app.routes';
import { AppComponent } from './app.component';
import { LoadpathwayComponent } from './load-pathway/loadpathway.component';


@NgModule({
    imports: [ BrowserModule, ROUTING ],
    declarations: [
        AppComponent,
        LoadpathwayComponent
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }

