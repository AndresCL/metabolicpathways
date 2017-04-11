import { Component } from '@angular/core';

// Declaring vars for libraries
declare var escher: any;
declare var d3: any;
declare var Materialize: any;

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

            let reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = (function(theFile) {
                
                return function(evt: any) {

                    console.log(evt);

                    // Load uploaded json in variable
                    let json = JSON.parse(evt.target.result);
                        
                    console.log("loading json");
                    // ---------------------------------------
                    // First map: Just show the map
                    // ---------------------------------------

                    let options1 = {
                        // Just show the zoom buttons
                        menu: 'zoom',
                        // use the smooth pan and zoom option
                        use_3d_transform: true,
                        // No editing in this map
                        enable_editing: true,
                        // No keyboard shortcuts 
                        enable_keys: false,
                        // No tooltips
                        enable_tooltips: true
                    };

                    escher.Builder(json, null, null, d3.select('#mp_map'), options1);
                    console.log("Building escher");

                    // Counting nodes
                    let node_types: Array<number> = [];
                    d3.selectAll("#nodes .node").each(function(d: any) {

                        if(node_types[d.node_type] == undefined) node_types[d.node_type]=1; 
                        else node_types[d.node_type]++;

                    });

                    // Showing statistics as toast
                    for (var property in node_types) {
                        if (node_types.hasOwnProperty(property)) {
                            
                            // do stuff
                            Materialize.toast(property + ': ' + node_types[property], 6000);
                        }
                    }

                    d3.selectAll(".segment-group").on('click', function(d: any, i:any) {
                        console.log("From: " + d.from_node_id);
                        console.log("To: " + d.to_node_id);
                        console.log(d3.select("#n" + d.from_node_id).node());
                        console.log(d3.select("#n" + d.to_node_id).node());
                        //console.log(d3.select(this));
                    });

                };
            
            })(f);

            // Read in the json file as text.
            reader.readAsText(f);
        }
    

    } 
}
