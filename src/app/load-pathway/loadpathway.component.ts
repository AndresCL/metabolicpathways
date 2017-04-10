import { Component } from '@angular/core';

// Declaring vars for libraries
declare var escher: any;
declare var d3: any;

@Component({
    selector: 'load-pathway',
    templateUrl: 'app/load-pathway/loadpathway.component.html'
})
export class LoadpathwayComponent { 
    
    // On change event from template
    loadjsonfile(evt: any) {
       
        var files = evt.target.files; // FileList object

        // Loop through the FileList and render image files as thumbnails.
        for (var i = 0, f; f = files[i]; i++) {

            var reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = (function(theFile) {
                
                return function(evt: any) {

                    console.log(evt);

                    // Load uploaded json in variable
                    var json = JSON.parse(evt.target.result);
                        
                    console.log("loading json");
                    // ---------------------------------------
                    // First map: Just show the map
                    // ---------------------------------------

                    var options1 = {
                        // Just show the zoom buttons
                        menu: 'zoom',
                        // use the smooth pan and zoom option
                        use_3d_transform: true,
                        // No editing in this map
                        enable_editing: false,
                        // No keyboard shortcuts 
                        enable_keys: false,
                        // No tooltips
                        enable_tooltips: false
                    };

                    escher.Builder(json, null, null, d3.select('#mp_map'), options1);
                    console.log("Building escher");

                };
            
            })(f);

            // Read in the json file as text.
            reader.readAsText(f);
        }
    

    } 
}
