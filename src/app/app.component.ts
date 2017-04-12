import { Component, OnInit } from '@angular/core';

// Declaring vars for libraries
declare var escher: any;
declare var d3: any;
declare var Materialize: any;

@Component({
    selector: 'app-component',
    template: `
        <nav>
            <div class="nav-wrapper layout-margin">
            <a href="#" class="brand-logo">
                <img src="https://app.genialis.com/assets/images/genialis_logo.png" width="24" height="24">
            </a>
            <a ui-sref="base.default" href="/lexogen/">
                <span class="gen-title">Genialis Demo</span>
            </a>
            <a ui-sref="base.default" href="/lexogen/">
                <span class="gen-subtitle">Metabolic Pathways</span> 
            </a>
            <ul id="nav-mobile" class="right hide-on-med-and-down">
                <li><a href="sass.html">Sass</a></li>
                <li><a href="badges.html">Components</a></li>
                <li><a href="collapsible.html">JavaScript</a></li>
            </ul>
            </div>
        </nav>

        <div class="row gen-main container"> 

            <div class="visualizations-header">
                <h1 class="md-display-1 gen-title">Visualization</h1>
            </div>

            <div class="gen-container">

                <!-- Toolbox -->
                <load-pathway (jsonLoaded)="loadjson($event)"></load-pathway>
                <color-scheme></color-scheme>
                 
                <div id="mp_map">
                </div>
                
                <router-outlet></router-outlet>
            </div>

        </div>        
        `
})
export class AppComponent implements OnInit{
    public isTestable: boolean = true;
    public escher_options: any = {
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

    constructor(){}

    ngOnInit(){

        // Load a default map
        var self = this;
        d3.json('e_coli_core.Core metabolism.json', function(e: any, data: any) {
            if (e) console.warn(e);

            // Build escher with data
            self.escher_build(data);
            
        });
        
    }

    escher_build(data: any){
        
        var self = this;

        // Building escher map
        escher.Builder(data, null, null, d3.select('#mp_map'), this.escher_options);
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
                
                // Show statistics in toast
                Materialize.toast(property + ': ' + node_types[property], 6000);
            }
        }

        // Get click on segment group
        d3.selectAll(".segment-group").on('click', function(d: any, i: any) {

            // Getting root/end nodes as array, as it could be more than one on each case
            let rootNode, endNode, from_node_id, to_node_id;

            // If we are finding root node and we are already on it
            if(d.from_node_coefficient < 0 && d.reversibility == false){
                from_node_id = d.from_node_id; 
            }
            // If reversible lets find the other way
            else if(d.reversibility == true){
                from_node_id = d.to_node_id; 
            }
            // Otherwise we send to node id
            else from_node_id = d.from_node_id;

            rootNode = self.findRootNode(d.segment_id, from_node_id, [], []).join(" - ");

            // If we are finding end node and we are already on it
            if(d.to_node_coefficient > 0 && d.reversibility == false) {
                to_node_id = d.to_node_id;
            }
            // If reversible lets find the other way
            else if(d.reversibility == true){
                to_node_id = d.from_node_id;
            }
            // Else
            else to_node_id = d.to_node_id;

            endNode = self.findEndNode(from_node_id, d.segment_id, to_node_id, [], []).join(" - ");

            let html = 'From Node: ' + rootNode + ', To: ' + endNode;

            Materialize.toast(html, 15000);
        });
    }

    // On change event from template
    loadjson(evt: any) {
       
        var self = this;

        var files = evt.target.files; // FileList object

        // Loop through the FileList and render image files as thumbnails.
        for (var i = 0, f; f = files[i]; i++) {

            let reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = (function(theFile) {
                
                return function(evt: any) {

                    // Load uploaded json in variable
                    let json = JSON.parse(evt.target.result);

                    // Build escher with data
                    self.escher_build(json);

                };
            
            })(f);

            // Read in the json file as text.
            reader.readAsText(f);
        }
    

    } 

    // Finds end node for a segment
    findEndNode(from_node_id: number, segment_id: number, to_node_id: string, 
                visited_segments: Array<string> = [], endNodes: Array<string>): Array<string>{

        var self = this;

        // Open node attributes
        d3.selectAll("#n" + to_node_id).each(function(d: any) {

            // If node type is a multimarker or midmarker
            if(d.node_type == "multimarker" || d.node_type == "midmarker"){
                
                // Explore it segments
                for(let i=0; i<d.connected_segments.length; i++){
                    
                    // Select segment
                    d3.select("#s" + d.connected_segments[i].segment_id).each(function(s: any){
                        
                        // Avoid to call same node again, as its listed on connected_segments
                        if(!visited_segments.includes(s.segment_id)){
                            
                            console.log("going to segment: " + s.segment_id);
                            visited_segments.push(s.segment_id);

                            // Call to iterate in possible other node segments
                            endNodes = self.findEndNode(from_node_id, s.segment_id, s.to_node_id, 
                                                            visited_segments, endNodes);
                        
                        }
                    });
                }
            }
            // If type is metabolite its a starting node
            else { //if(d.node_type == "metabolite") {

                if(!endNodes.includes(d.bigg_id) && d.node_id != from_node_id){
                    endNodes.push(d.bigg_id);
                }
            }
        });

        // Return end nodes array
        return endNodes;

    }

    // Finds root nodes for a segment
    findRootNode(segment_id: number, from_node_id: string, visited_segments: Array<string> = [], rootNodes: Array<string>): Array<string>{

        var self = this;

        // Open node attributes
        d3.selectAll("#n" + from_node_id).each(function(d: any) {

            // If node type is a multimarker or midmarker
            if(d.node_type == "multimarker" || d.node_type == "midmarker"){
                console.log("Visiting node: " + d.node_id);

                // Explore it segments 
                for(let i=0; i<d.connected_segments.length; i++){
                    
                    // Select segment
                    d3.select("#s" + d.connected_segments[i].segment_id).each(function(s: any){
                        

                        // Avoid to call same node again, as its listed on connected_segments
                        if(!visited_segments.includes(s.segment_id)){
                            console.log("going to segment: " + s.segment_id);
                            visited_segments.push(s.segment_id);

                            // Call to iterate in possible other node segments
                            rootNodes = self.findRootNode(s.segment_id, s.from_node_id, visited_segments, rootNodes);
                        }
                    });
                }
            }
            // If type is metabolite its a starting node
            else { //if(d.node_type == "metabolite") {

                if(!rootNodes.includes(d.bigg_id)){
                    rootNodes.push(d.bigg_id);
                }
            }
        });

        // Return root nodes array
        return rootNodes;

    }
}

