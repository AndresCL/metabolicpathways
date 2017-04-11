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
                <load-pathway></load-pathway>
                <color-scheme></color-scheme>
                 
                <div id="mp_map">
                </div>
                <p>
                    <a [routerLink]="['/']">Home</a> |
                    <a [routerLink]="['/about']">About</a>
                </p>
                <router-outlet></router-outlet>
            </div>

        </div>        
        `
})
export class AppComponent implements OnInit{
    public isTestable: boolean = true;

    constructor(){
        //called first time before the ngOnInit()
        
    }

    ngOnInit(){

        console.log("Init!");
        
        // Load a default map
        var self = this;
        d3.json('e_coli_core.Core metabolism.json', function(e: any, data: any) {
            if (e) console.warn(e);
            
            console.log("loading json");
            // ---------------------------------------
            // First map: Just show the map
            // ---------------------------------------

            let tooltips_1 = function (args: any) {
                // Check if there is already text in the tooltip
                if (args.el.childNodes.length === 0) {
                    
                    //console.log(args.state);

                    // If not, add new text
                    var node = document.createTextNode('Node: ')
                    args.el.appendChild(node)
                    
                }
                else{
                    //console.log(args.state);
                }
                // Update the text to read out the identifier biggId
                args.el.childNodes[0].textContent = 'From Node: ' + args.state.biggId + ' to Node:'
            }

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
                enable_tooltips: true,
                tooltip_component: tooltips_1
            };

            // Building escher map
            escher.Builder(data, null, null, d3.select('#mp_map'), options1);
            console.log("Building escher");

            // Counting nodes
            let node_types: Array<number> = [];
            d3.selectAll("#nodes .node").each(function(d: any) {

                if(d.node_type != "midmarker" && d.node_type != "multimarker"){
                    if(node_types[d.node_type] == undefined) node_types[d.node_type]=1; 
                    else node_types[d.node_type]++;
                }

            });

            // Showing statistics as toast
            for (var property in node_types) {
                if (node_types.hasOwnProperty(property)) {
                    
                    // do stuff
                    Materialize.toast(property + ': ' + node_types[property], 6000);
                }
            }

            // Get click on segment group
            
            d3.selectAll(".segment-group").on('click', function(d: any, i: any) {
                console.log("From: " + d.from_node_id);
                console.log("To: " + d.to_node_id);
                console.log(d3.select("#n" + d.from_node_id).node());
                console.log(d3.select("#n" + d.to_node_id).node());
                //console.log(d3.select(this));

                let rootNode = self.findRootNode(d.from_node_id);
                
                // d3.selectAll("#n" + d.to_node_id).each(function(d: any) {
                //     let max_segment = d.connected_segments.length;
                //     console.log(d);
                //     if(d.node_type){

                //     }
                // });
            });
            
        });
        
    }

    // Finds root node for a segment
    findRootNode(from_node_id: string){

        var self = this;
        var origin = "";

        // Open node attributes
        d3.selectAll("#n" + from_node_id).each(function(d: any) {

            // If node type is a multimarker or midmarker
            if(d.node_type == "multimarker" || d.node_type == "midmarker"){
                
                // Explore it segments
                for(let i=0; i<d.connected_segments.length; i++){
                    
                    // Select segment
                    d3.select("#s" + d.connected_segments[i].segment_id).each(function(s: any){
                        console.log("back to node: " + s.from_node_id);
                        
                        // Avoid to call same node again, as its listed on connected_segments
                        if(from_node_id != s.from_node_id){
                            self.findRootNode(s.from_node_id);
                        }
                    });
                }
                
                //findRootNode = false; 
            }
            // If type is metabolite its a starting node
            else if(d.node_type == "metabolite") {

                // Concatenate origin names (Can be more than one, depending on segment)
                if(origin != "") origin = " and/or " + d.big_id;
                else origin = d.big_id;

                // Return value
                return d.big_id;
            }
        });

    }
}

