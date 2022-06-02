import { Component, Host, HostListener, OnInit } from '@angular/core';
import * as d3 from 'd3';
import {zoom} from 'd3-zoom';



//define class of different Hosttypes
class Hosttype{                                            

  public constructor(
  readonly group: number,
  readonly isSwitch: Boolean,
  readonly color: string 
  ){}

}

@Component({
  selector: 'app-underlay',
  templateUrl: './underlay.component.html',
  styleUrls: ['./underlay.component.css']
})


export class UnderlayComponent implements OnInit {

  //urls to backend api

  //url to get hardware layer data
  readonly APIUrl = "http://127.0.0.1:8000/layer2";
  //url to get service function instance data
  readonly APIUrl2 = "http://127.0.0.1:8000/vnfs";
  
  //instantiate svg
  private svg:any;


  //list
  public hostlist : string[] = [];

  //hosttype definition
  public hosttypes : Hosttype[] = [];


  ngOnInit(): void {
    this.addHosttypes();
    var hl= this.hostlist

    var ht = this.hosttypes
    this.createSvg();
    this.drawGraph(hl, ht);

  }
  
  //add all hosttypes over here
  private addHosttypes(){
    let host1 = new Hosttype(1, false, "lightblue");
    this.hosttypes.push(host1);

    let host2 = new Hosttype(2, false, "lightgrey");
    this.hosttypes.push(host2);

    let switch7 = new Hosttype(7, true, "blue");
    this.hosttypes.push(switch7);

    let switch17 = new Hosttype(17, true, "grey");
    this.hosttypes.push(switch17);




  }

  //function that creates vector graphic
  private createSvg(): void {

    this.svg = d3.select("svg#network")
    .attr("pointer-events", "all");
   
  }




  //function that draws visualization
  private drawGraph(hostlist:any, hosttypeslist: Hosttype[] ): void {

  //reference vector graphic
  var svg = this.svg;

  //to get x and y etc for the svg to determine borders
  var svgelem:any = document.getElementById("network");
  var svgrect = svgelem.getBoundingClientRect();

  //for the tooltip get 
  var tool1elem:any = document.getElementById("tooltip");
  var tool1rect = tool1elem.getBoundingClientRect();
 

  //space where jsonstring is displayed
  var unsortedlist:any = d3.select("#ull");


     
  //instance zoomvariables and define zoomArea
  var zoomfactor:any = 1;
  var zoomx:any = 1;

  //box around the network graph to enable zooming ability
  var zoomContainer:any = svg.call(d3.zoom().on("zoom", function (event:any) {
       function transform(t:any) {
          return function(d:any) {
            return "translate(" + t.apply(d) + ")";
          };
        }
    zoomContainer.attr("transform", event.transform);
    zoomfactor= event.transform.k;
    zoomx= event.transform.x;
    zoomx= event.transform.y;

  }))
  .append("g");


  
  //definition of the simulation and its forces
  var simulation:any = d3.forceSimulation()
  .force("link", d3.forceLink().id(function(d:any) { return d.id; }).distance(100).strength(0.01))
  .force("charge", d3.forceManyBody().strength(-20))
   .force("center", d3.forceCenter(svg.attr("width")/2, svg.attr("height")/2))
   .force("collision", d3.forceCollide().radius(110));


  //get hardware layer data from backend framework api
  d3.json(this.APIUrl).then((response:any) => {
  
    // reference data
    var graph:any = response[0].Network;
    var graphorigin:any = graph.nodes;




//function to update sidetable 
function updateSidetable() {

  var refreshLink:any =d3.select("a#Refresh").attr("target", "_self").attr("href", window.location.origin +'/underlay');

  graph.nodes.forEach(function(d:any){
  
    var listentry:any = unsortedlist.append("li").attr("class", "nav-item bg-light").attr("id", function(){return "li"+d.id;});
    var hyperlink:any =listentry.append("a").attr("role","button").attr("class", "nav-link")
    .attr("id", function(){return "hyperlink"+d.id})
  .attr("href",  function() { return (window.location.origin +'/underlay'+ '?device=' + d.id) });
    
    hyperlink.append("span").attr("data-feather","file-text");

    d3.select("a#hyperlink"+d.id).text("hardware, id:"+d.id);
   
  });
  }
  
  //call function
  updateSidetable();




  //access hardware table
  var tableBody:any = d3.select("#tableBody");
  var tableHead:any = d3.select("#tableHead");
  
  //update table content
  function updateTable(data:any) {
  
    var rows:any = tableBody.selectAll("tr").data(data);
    rows.exit().remove();
    rows = rows.enter().append("tr").merge(rows);
  
    var cells = rows.selectAll("td")
      .data(function(d:any, i:any) {
        return Object.values(d);
      });
    cells.exit().remove();
    cells.enter().append("td")
      .text(function(d:any) {
        return d;
      });
    cells.text(function(d:any) {
      return d;
    });
  }

  //update tableheading
  function updateTablehead(dd:any) {
   var datat:any = dd[1];
    var rows:any = tableHead.append("tr");
    rows.exit().remove();
    rows = rows.enter().append("tr").merge(rows);
  
    var header:any = rows.selectAll("th").data(Object.keys(datat));

    header.exit().remove();
    header.enter().append("th")
      .text(function(d:any) {
        return d;
      });
    header.text(function(d:any) {
      return d;
    });
  }



  //get url params to select device
  function geturlparams(){

        var queryString = window.location.search;
        var urlParams = new URLSearchParams(queryString);
        var device = urlParams.get('device');
        if(device){
       
        var vnfnodedata:any = "";
      
        graphorigin.forEach(
        
        function(d:any){if (d.id==device){
          vnfnodedata=JSON.stringify(d, undefined, 2);
      
      }
      else{}
      });
      
        // access hardware table
        d3.select("#hardwaretable").append("h3").text("hardware:");
        d3.select("#hardwaretable").append("pre").append("text").text(vnfnodedata);
        d3.select("#vnflist").append("h3").text("SF instances:");
        d3.select("#vnflist").append("ul").attr("id", "unvnflist").attr("class", "nav flex-column");
      
      }
        
  }

  //call functions
  updateTable(graph.nodes);
  updateTablehead(graph.nodes);
  geturlparams(); 
  


  //add x and y coordinates to spawn network nodes
  graph.nodes.forEach(function(d:any){
     d.x = graph.nodes.length-d.index/graph.nodes.length*1000;
     d.y = d.index/graph.nodes.length*1000;
    });

  
  
   
  //add links between nodes/vnf hosts
  var link = zoomContainer
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
      .attr("stroke", "grey")
      .attr("stroke-width", function(d:any) { return d.value*0.1; });

  // add hyperlinks to vnf hosts/nodes    
  var node = zoomContainer
    .selectAll("a")
    .data(graph.nodes)
    .enter().append("a")
    .attr("id", function(d:any) { return d.id })
    .attr("class", function(d:any) { return ("group"+d.group.toString()) })
    .attr("xlink:href",  function(d:any) { return (window.location.origin +'/underlay'+ '?device=' + d.id) });


  //select hosttypes (hardware device types) by group and add visualisation qualities per type
  function appendvisible(){

    var nodewidth:any = 100;
    var nodeheight:any = 60;

    //add default visualization
    node.append("rect").attr("id", function(d:any) { return ("rect"+d.id.toString()) } )
    .attr("width", nodewidth)
      .attr("height", nodeheight)
      .attr('x', -(nodewidth/2) )
      .attr('y', -(nodewidth/2) ).attr('rx', (nodewidth/20) )
      .attr('ry', (nodewidth/20) )
      .style("stroke-width", 2)
      .style('fill', "grey")
      .style('stroke', "black");

      node.append("text").attr("id", function(d:any) { return ("title2"+d.id.toString()) } )
      .text("typenotdeclared")
      .attr("text-anchor", "middle")
      .style("font-size", function(d:any) { return (nodewidth*1.4/("typenotdeclared".length)) + "px"; })
      .attr('x', +0 ).attr('y', -(nodewidth/6)-12 )
          .style('stroke', 'black');

      node.append("text").attr("id", function(d:any) { return ("title"+d.id.toString()) } )
      .text(function(d:any) { return ("id: "+d.id.toString().substring(0,6)+"...") })
      .attr("text-anchor", "middle")
      .style("font-size", function(d:any) { return (nodewidth*1.4/("typenotdeclared".length)) + "px"; })
      .attr('x', +0 ).attr('y', -(nodewidth/6) )
          .style('stroke', 'black'); 

    // add specialized visualization
    for (let i = 0; i < hosttypeslist.length; i++){
      if(hosttypeslist[i].isSwitch===false){
        
      d3.selectAll("a.group"+hosttypeslist[i].group).selectAll("rect").remove();
      d3.selectAll("a.group"+hosttypeslist[i].group).selectAll("text").remove();

      d3.selectAll("a.group"+hosttypeslist[i].group).append("rect").attr("id", function(d:any) { return ("rect"+d.id.toString()) } )
      .attr("width", nodewidth)
        .attr("height", nodeheight)
        .attr('x', -(nodewidth/2) )
        .attr('y', -(nodeheight/2) ).attr('rx', (nodewidth/20) )
        .attr('ry', (nodewidth/20) )
        .style("stroke-width", 2)
        .style('fill', hosttypeslist[i].color)
        .style('stroke', 'black');
  
        d3.selectAll("a.group"+hosttypeslist[i].group).append("rect").attr("id", function(d:any) { return ("rectfront"+d.id.toString()) } ).attr("class", function(d:any) { return ("rectfrontgroup"+d.group.toString()) } )
      .attr("width", 30)
        .attr("height", 60)
        .attr('x', -80 )
        .attr('y', -30 ).attr('rx', 5 )
        .attr('ry', 5 )
        .style("stroke-width", 2)
        .style('fill', hosttypeslist[i].color)
        .style('stroke', 'black');
  
        
  
      d3.selectAll("a.group"+hosttypeslist[i].group).append("text").attr("id", function(d:any) { return ("title"+d.id.toString()) } ).style("fill", "black")
      .attr("dx","+0.1em").style("font-size", "13px")
      .attr("x", -80).attr("y", -0)
      .attr("opacity", "1")
      .text("host");
 
      var hostnodelink:any = d3.selectAll("a.group"+hosttypeslist[i].group).append("a").attr("xlink:href",  function(d:any) { return (window.location.origin +'/underlay'+ '?device=' + d.id) });



      var title:any = hostnodelink.append("text") .attr('x', -nodewidth/2)
      .attr('y', -15).attr("width", nodewidth).style("text-overflow", "clip");

      title.append("tspan").text( function(d:any) { var hn:any = d.hostname.toString();
        if(hn.length>13){
        return (hn.substring(0,13)+"... "); }
        else{return hn;}} )
        .attr('x', -nodewidth/2).style("font-size", "13px")
      .attr("dx", "0.5em")
      .attr("dy", "0.2em")
      .attr("height", 30);


      title.append("tspan").text( function(d:any) { var hn:any = d.id.toString();
        if(hn.length>8){
        return ("id: "+hn.substring(0,8)+"... "); }
        else{return "id: "+hn;}} ).style("font-size", "13px")
      .attr("dx", "0.5em")
      .attr('x', -nodewidth/2)
   
      .attr("dy", "1.2em")
      .attr("height", 30);
    
    }
      
      //special visualization for the devices that are iSwitch===true
      else{

        d3.selectAll("a.group"+hosttypeslist[i].group).selectAll("rect").remove();
        d3.selectAll("a.group"+hosttypeslist[i].group).selectAll("text").remove();

        d3.selectAll("a.group"+hosttypeslist[i].group).append("rect").attr("id", function(d:any) { return ("rect"+d.id.toString()) } ).attr("class", function(d:any) { return ("rectgroup"+d.group.toString()) } )
        .attr("width", 100)
        .attr("height", 30)
        .attr('x', -50 )
        .attr('y', -15 ).attr('rx', 5 )
        .attr('ry', 5 )
        .style("stroke-width", 2)
        .style('fill', hosttypeslist[i].color)
        .style('stroke', 'black');
    
        d3.selectAll("a.group"+hosttypeslist[i].group).append("text").attr("id", function(d:any) { return ("title"+d.id.toString()) } ).style("fill", "white").style("text-decoration-line", 'underline').style("text-decoration-style", "dotted")
        .attr("dx","-1.5em").attr("dy","+0.2em").style("font-size", "20px")
        .attr("x", -0).attr("y", -0)
        .attr("opacity", "1")
        .text("switch");

      }
    }

    
  } 

  //call function
  appendvisible();

  
    //start simulation
      simulation
      .nodes(graph.nodes)
      .on("tick", update);

      simulation.force("link")
      .links(graph.links);
      

    //update x and y of the visualized elements
    function update() {

      link
        .attr("x1", function(d:any) { return d.source.x; })
        .attr("y1", function(d:any) { return d.source.y; })
        .attr("x2", function(d:any) { return d.target.x; })
        .attr("y2", function(d:any) { return d.target.y; });     

      node 
        .attr("transform", function(d:any) { return "translate(" + d.x + "," + d.y + ")"}); 
        
      }   

      
    node.call(d3.drag()
          .on("start", draggingstart)
          .on("drag", whiledragged)
          .on("end", afterdragging));   

  
         
          
    //request backend api for vnf data
    d3.json(this.APIUrl2).then((response2:any) => {

      const vnfgraph = response2[0].Network;
      const tableheader = vnfgraph.nodes[0];

     
      // access vnf data tables
      var tableBodys:any = d3.select("#tableBodys");
      var tableHeads:any = d3.select("#tableHeads");
      
      
      //fill vnf table
      function updateTables(data:any) {
      
        var rows:any = tableBodys.selectAll("tr").data(data);
        rows.exit().remove();
        rows = rows.enter().append("tr").merge(rows);
      
        var cells = rows.selectAll("td")
          .data(function(d:any, i:any) {
            return Object.values(d);
          });
        cells.exit().remove();
        cells.enter().append("td")
          .text(function(d:any) {
              if (typeof d ==="string" || typeof d ==="number"){
                return d;
               }
               else{
                 return "available";
               }
             });
      }
    

      //update vnf table heads
      function updateTableheads(dd:any) {
        var datat:any = dd[1];
         var rows:any = tableHeads.append("tr");
         rows.exit().remove();
         rows = rows.enter().append("tr").merge(rows);
       
         var header:any = rows.selectAll("th").data(Object.keys(datat));
     
         header.exit().remove();
         header.enter().append("th")
           .text(function(d:any) {
             return d;
           });
         header.text(function(d:any) {
           return d;
         });
        
       }



      //add vnfs of host list with hyperlinks to overlay visualization
       function geturlparamsvnfhostid(){

        var queryString = window.location.search;
        var urlParams = new URLSearchParams(queryString);
        var device:any = urlParams.get('device');

        if(device){

        d3.select("rect#rect"+device).style("stroke-width", 2).style("fill", "yellow");
        d3.select("rect#rectfront"+device).style("stroke-width", 2).style("fill", "yellow");


        vnfgraph['nodes'].forEach((element:any) => {
          var vnfhostname: string = element.vnf_host.toString();
          if(vnfhostname===device.toString()){

            var listentry:any = d3.select("#unvnflist").append("li").attr("class", "nav-item").attr("id", function(){return "li"+element.id;});
  
  

            var hyperlink:any =listentry.append("a").attr("role","button").attr("class", "nav-link")
            .attr("id", function(){return "hyperlink"+element.id})
          .attr("href",  function() { return (window.location.origin +'/overlay'+ '?device=' + element.id) });
            
            hyperlink.append("span").attr("data-feather","file-text");          
            d3.select("a#hyperlink"+element.id).text("sfi, id:"+element.id);
          }
  
        });}

       }


    

    // call functions
    svg.on("tick", updateTableheads(vnfgraph.nodes));
    svg.on("tick", updateTables(vnfgraph.nodes));
    svg.on("tick", geturlparamsvnfhostid());
           
    


    // access tooltip and change it on interaction with the network graph visualization

    svg.on("mousemove", function(d:any){
      d3.select("#tooltip")
      .style("visibility", "hidden");

      d3.select("#tooltip2")
      .style("visibility", "hidden");
    });


        node.on("mouseover", function(d:any, i:any) {

          //get bounding rect
          var nodeelem:any = document.getElementById(i.id);
          var noderect = nodeelem.getBoundingClientRect();

          //define tooltip position
          d3.select("#tooltip")
          .style("position", "fixed")
            .style("left", (Math.min(Math.max((noderect['x']+150),(svgrect['left'])), (svgrect['right']-tool1rect['width'])))+"px")
            .style("top", (Math.min(Math.max((noderect['y']+50),(svgrect['top'])), (svgrect['bottom']-tool1rect['height'])))+"px")
            .transition()
            .style("visibility", "visible");
         


          // Values shown in tooltip
          d3.select("#series").text(i.MAC_address);
          d3.select('#xval').text(i.mpls_label);
          d3.select('#yval').text(i.id);
          d3.select("#rect"+i.id).style("stroke", "yellow");
          d3.select("#rectfront"+i.id).style("stroke", "yellow");

        //after selection   
        }).on("mouseout", function(d:any, i:any) {  d3.select("#rect"+i.id).style("stroke", "black");
        d3.select("#rectfront"+i.id).style("stroke", "black");});
  

          }).catch((err:any) => {
            // Handle err
            throw err;
          });  

      
      

}).catch((err:any) => {
  // Handle err
  throw err;
});  



//dragging functionality

//function that defines the activity at the draggingstartpoint
function draggingstart(event:any, d:any) {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

//function that defines the activity of the visualization while an element is being dragged
function whiledragged(event:any, d:any) {
  d.fx = event.x;
  d.fy = event.y;
}

//when the dragging ends:
function afterdragging(event:any,d:any) {
  if (!event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

}


}























































































