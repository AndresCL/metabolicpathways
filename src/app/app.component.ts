import { Component, OnInit } from '@angular/core';


declare var escher: any;
declare var d3: any;

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

            <div class="escher-container">

                <load-pathway></load-pathway>

                <!-- Teal page content  -->
                <h1>My Angular 2 Base App</h1>
                 
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
        
        // called after the constructor and called  after the first ngOnChanges() 
        // Load a JSON file for the map from the network
        d3.json('e_coli_core.Core metabolism.json', function(e: any, data: any) {
            if (e) console.warn(e);
            
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
                enable_tooltips: false,
            };

            escher.Builder(data, null, null, d3.select('#mp_map'), options1);
            console.log("Building escher");
        });

        // function handleFileSelect(evt) {
        //     var files = evt.target.files; // FileList object

        //     // Loop through the FileList and render image files as thumbnails.
        //     for (var i = 0, f; f = files[i]; i++) {

        //     // Only process image files.
        //     if (!f.type.match('image.*')) {
        //         continue;
        //     }

        //     var reader = new FileReader();

        //     // Closure to capture the file information.
        //     reader.onload = (function(theFile) {
        //         return function(e) {
        //         // Render thumbnail.
        //         var span = document.createElement('span');
        //         span.innerHTML = ['<img class="thumb" src="', e.target.result,
        //                             '" title="', escape(theFile.name), '"/>'].join('');
        //         document.getElementById('list').insertBefore(span, null);
        //         };
        //     })(f);

        //     // Read in the image file as a data URL.
        //     reader.readAsDataURL(f);
        //     }
        // }

        // document.getElementById('files').addEventListener('change', handleFileSelect, false);
    }
}

