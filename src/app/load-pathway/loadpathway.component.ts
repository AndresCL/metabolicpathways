import { Component, Output, EventEmitter } from '@angular/core';

// Declaring vars for libraries
declare var escher: any;
declare var d3: any;
declare var Materialize: any;

@Component({
    selector: 'load-pathway',
    templateUrl: 'app/load-pathway/loadpathway.component.html'
})
export class LoadpathwayComponent { 
    
    @Output() jsonLoaded = new EventEmitter();

    // Listen click event
    loadjsonfile($event: any){

        // Emit event to parent
        this.jsonLoaded.emit($event);
    }
}
