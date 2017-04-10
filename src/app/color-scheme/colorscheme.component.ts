import { Component } from '@angular/core';

declare var jQuery:any;

@Component({
    selector: 'color-scheme',
    templateUrl: 'app/color-scheme/colorscheme.component.html'
})
export class ColorschemeComponent { 

    // On change event handler
    switchcolor(checked: boolean){
        
        if(checked){
            jQuery("svg.escher-svg .segment").css('stroke', 'green');
            jQuery("svg.escher-svg .arrowhead").css('stroke', 'green');
        }
        else{
            jQuery("svg.escher-svg .segment").css('stroke', '#334E75');
            jQuery("svg.escher-svg .arrowhead").css('stroke', '#334E75');
        }

    }
}