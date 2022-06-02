import { Component, HostListener, OnInit } from '@angular/core';
import * as d3 from 'd3';
import {zoom} from 'd3-zoom';
//import  'd3-jetpack/essentials';
import { analyzeAndValidateNgModules, identifierModuleUrl } from '@angular/compiler';


//define class of different Vnftypes
class Vnftype{                                            

  public constructor(
  readonly serviceType: string, 
  readonly color: string 
  ){}

}

//define class of different hosttypes
class Hosttype{                                            

  public constructor(
  readonly group: number,
  readonly isSwitch: Boolean,
  readonly color: string 
  ){}

  }


@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.css']
})



export class OverlayComponent implements OnInit {

  //urls to backend api

  //url to get hardware layer data
  readonly APIUrl = "http://127.0.0.1:8000/layer2";
  //url to get vnf data
  readonly APIUrl2 = "http://127.0.0.1:8000/vnfs";
  
  //instantiate svg
  private svg:any;

  //public vnftypes : Vnftype[] = [];

  //list
  public hostlist2 : string[] = [];

  //hosttype definition
  public hosttypes : Hosttype[] = [];




  ngOnInit(): void {
   

    this.addHosttypes();
    var hl= this.hostlist2

    var ht = this.hosttypes
    this.createSvg();
    this.drawOverlayGraph(hl, ht);


  }



  //add all hosttypes over here
  private addHosttypes(){
  let host1 = new Hosttype(1, false, "lightblue");
  this.hosttypes.push(host1);

  let host2 = new Hosttype(2, false, "lightgrey");
  this.hosttypes.push(host2);

  let switch7 = new Hosttype(7, true, "blue");
  this.hosttypes.push(switch7);


  }

  

  private createSvg(): void {

    this.svg = d3.select("svg#network")
    .attr("pointer-events", "all");
   
  }



  private drawOverlayGraph(hostlist2:any, hosttypeslist: Hosttype[] ): void {
   
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


  //function includes
  function myownincludes(array:any, element:any){

    for(var i:number = 0; i<array.length; i++){
      if (array[i]===element){
        return true;
      }
      else{

      }

    }
    return false;
  }



     
  //instance zoomvariables and define zoomArea
  var zoomfactor:any = 1;
  var zoomx:any = 1;

  var zoomArea:any = svg.call(d3.zoom().on("zoom", function (event:any) {
       function transform(t:any) {
          return function(d:any) {
            return "translate(" + t.apply(d) + ")";
          };
        }
    zoomArea.attr("transform", event.transform);
    zoomfactor= event.transform.k;
    zoomx= event.transform.x;
    zoomx= event.transform.y;

  }))
  .append("g");



  //definition of the simulation and its forces
  var simulation:any = d3.forceSimulation()
  .force("link", d3.forceLink().id(function(d:any) { return d.id; }).distance(130).strength(0.01))
  .force("charge", d3.forceManyBody().strength(-20))
   .force("center", d3.forceCenter(svg.attr("width")/2, svg.attr("height")/2))
   .force("collision", d3.forceCollide().radius(140));

   

  //get data from backend framework

  //get hardware layer data
  d3.json(this.APIUrl).then((response:any) => {

  //get virtual network function data
  d3.json(this.APIUrl2).then((response2:any) => {
    
  // reference data
    var graph:any = response[0].Network;
    var graphorigin:any = graph.nodes;
    const vnfgraph = response2[0].Network;


    //create list with all the hosts with vnfs
    var hostlist = new Set<string>();

    //fill the list with hosts
    vnfgraph.nodes.forEach(function(d:any){
      hostlist.add(d.vnf_host);
    });


  

    //push hosts to list
    graph.nodes.forEach(function(d:any){
       hostlist2.push(d.id.toString()); });
    
    //newnodes: only vnfhosts are visualized on the overlay level
    var newnodes:any =graph.nodes.filter(function(d:any){return hostlist.has(d.id);});
    var newlinks:any = graph.links.filter(function(d:any){return hostlist.has(d.target) && hostlist.has(d.source);})
    var newgraph:any = graph;

    const tableheader = vnfgraph.nodes[0];

    var hostvnfcount :number[] = [];
    var hostvnfindex :number[] = [];

    for(var i:number=0; i<hostlist2.length; i++){
      hostvnfcount.push(0);
    }

    for(var i:number=0; i<hostlist2.length; i++){
      hostvnfindex.push(0);
    }
    // access vnf info table
    var tableBodys:any = d3.select("#tableBodys");
    var tableHeads:any = d3.select("#tableHeads");

    // fill hostvnfcount
    vnfgraph['nodes'].forEach((element:any) => {
      var vnfhostname: string = element.vnf_host.toString()
      hostvnfcount[hostlist2.indexOf(vnfhostname)] = hostvnfcount[hostlist2.indexOf(vnfhostname)]+1

    });



   //way to calculate virtual links between hardware nodes

    //variables to do calculation
    let myhostlist:any = Array.from(hostlist);
    var virtuallinksum:number = 0;



    //reference table with hardware info and update them
    var tableBody:any = d3.select("#tableBody");
    var tableHead:any = d3.select("#tableHead");
  
    //update hardware table
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

  //update hardware table head
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


    //functions from above are called
    updateTable(graph.nodes);
    updateTablehead(graph.nodes);
    
    //function to calculate virtual links: a virtual link exists, if vnfhosts are connected directly or over non-vnfhosts to each other
    function addVirtualLinks(){
    
    //first I create a table for the connections and fill a place with true, if there is a connection between nodes in the network
    var chart:boolean[][]=[];
    
    for (let i = 0; i < myhostlist.length; i++) {
      var chartline: boolean[]=[];
      for (let j = 0; j < myhostlist.length; j++) {
        chartline.push(false);
      }
      chart.push(chartline);
     
    }

    for (let i = 0; i < myhostlist.length; i++) {
      var thislinksto:any = graph.links.filter(function(d:any){return d.target==myhostlist[i] ;})


      function recursiveto(linksto:any, index:any, nolooplist:any){
        if(linksto){
        linksto.forEach(function(d:any){if( hostlist.has(d.source) && d.source!==myhostlist[index]){
          chart[index][myhostlist.indexOf(d.source)]=true;
          chart[myhostlist.indexOf(d.source)][index]=true; //because links can be not directed


        }
        else{if(d.source!==myhostlist[index]&&!(myownincludes(nolooplist, d.source))){
          var noloopo:any = nolooplist;
          noloopo.push(d.source);
          recursiveto(graph.links.filter(function(dd:any){return dd.target===d.source ;}), index, noloopo);}
      else{}}


      }
      );}
      else{}
    }
    recursiveto(thislinksto, i, []);
 
    
    }

    // then I read out my table and add virtual links
    for (let i = 0; i < myhostlist.length; i++) {
      for (let j = 0; j < myhostlist.length; j++) {
        if (chart[i][j]){
          console.log('{"source": "'+myhostlist[i].toString()+'" , "target": "'+myhostlist[j].toString()+'" , "value": 10}');
          var js:any = '{"source": "'+myhostlist[j].toString()+'" , "target": "'+myhostlist[i].toString()+'" , "value":13000}';
          newgraph.links.push(JSON.parse(js));
          virtuallinksum = virtuallinksum +1;

        }
      }
    }



    }    


    addVirtualLinks();

 //add x and y coordinates
 graph.nodes.forEach(function(d:any){
  d.x = graph.nodes.length-d.index/graph.nodes.length*1000;//Math.random()* 1000;
  d.y = d.index/graph.nodes.length*1000;
 });


    //define essential parts of graph visualization

    //define links between hardware
    var link = zoomArea
    .selectAll("line")
    .data(newgraph.links)
    .enter().append("line")
      .attr("stroke", "grey")
      .attr("value", function(d:any) {return d.value; })
      .attr("stroke-width", function(d:any) { if(d.value !== 13000){return d.value*0.1; }else{return 1;}});

    //remove original links and only use virtual links computed above
    link.filter(function(d:any){return d.value!=13000;}).remove()



    //define hardwarenodes
    var node = zoomArea
    .selectAll("a")
    .data(newnodes)
    .enter().append("a")
    .attr("id", function(d:any) { return d.id })
    .attr("class", function(d:any) { return ("group"+d.group.toString()) })
    .attr("xlink:href",  function(d:any) { return (window.location.origin +'/underlay'+ '?device=' + d.id) });




    //select hosttypes by group and add visualisation qualities per type, same as in underlay network, but isSwitch can be ignored, because there is no Switch in newnodes
    function appendvisible(){

    var nodewidth:any = 100;
    var nodeheight:any = 60;

    node.append("rect").attr("id", function(d:any) { return ("rect"+d.id.toString()) } )
    .attr("width", nodewidth*2)
      .attr("height", function(d:any) { return nodeheight +  32*(hostvnfcount[hostlist2.indexOf(d.id)]-1)} )
      .attr('x', -(nodewidth/2) )
      .attr('y', -(nodewidth/2) ).attr('rx', (nodewidth/20) )
      .attr('ry', (nodewidth/20) )
      .style("stroke-width", 2)
      .style('fill', "grey")
      .style('stroke', "black");

      var title:any =  node.append("text").text("typenotdeclared")
      .attr("text-anchor", "middle")
      .style("font-size", function(d:any) { return (nodewidth*1.4/("typenotdeclared".length)) + "px"; })
      .attr('x', +0 ).attr('y', -(nodewidth/6) )
          .style('stroke', 'black'); 


    for (let i = 0; i < hosttypeslist.length; i++){

      console.log(hosttypeslist[i].color);
      if(hosttypeslist[i].isSwitch===false){
        
      d3.selectAll("a.group"+hosttypeslist[i].group).selectAll("rect").remove();
      d3.selectAll("a.group"+hosttypeslist[i].group).selectAll("text").remove();

      d3.selectAll("a.group"+hosttypeslist[i].group).append("rect").attr("id", function(d:any) { return ("rect"+d.id.toString()) } )
      .attr("width", nodewidth*2)
      .attr("height", function(d:any) { return nodeheight +   32*(Math.ceil(hostvnfcount[hostlist2.indexOf(d.id)]/2)-1)} )
        .attr('x', -(nodewidth/2) )
        .attr('y', -(nodeheight/2) ).attr('rx', (nodewidth/20) )
        .attr('ry', (nodewidth/20) )
        .style("stroke-width", 2)
        .style('fill', hosttypeslist[i].color)
        .style('stroke', 'black');
  
        d3.selectAll("a.group"+hosttypeslist[i].group).append("rect").attr("id", function(d:any) { return ("rectfront"+d.id.toString()) } ).attr("class", function(d:any) { return ("rectfrontgroup"+d.group.toString()) } )
      .attr("width", 40)
      .attr("height", function(d:any) { return nodeheight +   32*(Math.ceil(hostvnfcount[hostlist2.indexOf(d.id)]/2)-1)} )
        .attr('x', -90 )
        .attr('y', -30 ).attr('rx', 5 )
        .attr('ry', 5 )
        .style("stroke-width", 2)
        .style('fill', hosttypeslist[i].color)
        .style('stroke', 'black');
  
        
  
      d3.selectAll("a.group"+hosttypeslist[i].group).append("text").style("fill", "black")
      .attr("dx","+0.5em").style("font-size", "13px")
      .attr("x", -90).attr("y", -0)
      .attr("opacity", "1")
      .text("host");

      var actualrectlink:any = d3.selectAll("a.group"+hosttypeslist[i].group).append("a").attr("xlink:href",  function(d:any) { return (window.location.origin +'/underlay'+ '?device=' + d.id) });



        var title:any = actualrectlink.append("text") .attr('x', -nodewidth/2)//.style("font-size", "15px")
        .attr('y', -15).attr("width", nodewidth).style("text-overflow", "clip");

        title.append("tspan").text( function(d:any) { var hn:any = d.hostname.toString();
          if(hn.length>9){
          return (hn.substring(0,9)+"... "); }
          else{return hn;}} )
        .attr("dx", "0.2em")
        .attr("dy", "0.2em")
        .attr("height", 30);


        title.append("tspan").text( function(d:any) { var hn:any = d.mpls_label.toString();
          if(hn.length>6){
          return ("label: "+hn.substring(0,6)+"... "); }
          else{return "label: "+hn;}} )
        .attr("dx", "0.5em")
        .style("font-weight", "bold")
        .attr("height", 30);
      }
      

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
    
        d3.selectAll("a.group"+hosttypeslist[i].group).append("text").style("fill", "white").style("text-decoration-line", 'underline').style("text-decoration-style", "dotted")
        .attr("dx","-1.5em").attr("dy","+0.2em").style("font-size", "20px")
        .attr("x", -0).attr("y", -0)
        .attr("opacity", "1")
        .text("switch");

      }
    }
    }

    appendvisible();



  
    //start simulation and update it
    simulation
    .nodes(graph.nodes)
    .on("tick", update);

    simulation.force("link")
    .links(graph.links);


    //update x and y
    function update() {

      link
        .attr("x1", function(d:any) { return d.source.x; })
        .attr("y1", function(d:any) { return d.source.y; })
        .attr("x2", function(d:any) { return d.target.x; })
        .attr("y2", function(d:any) { return d.target.y; });     

      node
       
        .attr("transform", function(d:any) { return "translate(" + d.x + "," + d.y + ")"}); 
        
      }   

    //activate drag functionality on nodes
    node.call(d3.drag()
          .on("start", dragstart)
          .on("drag", whiledragging)
          .on("end", dragend));   

   
          


    //functions to update tables around svg

    //function to update table 
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
    
    //function to update tableheads
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
       
    //function to update sidetable 
    function updateSidetable() {

  vnfgraph.nodes.forEach(function(d:any){
  
    var refreshLink:any =d3.select("a#Refresh").attr("target", "_self").attr("href", window.location.origin +'/overlay');
  
    var listentry:any = unsortedlist.append("li").attr("class", "nav-item").attr("id", function(){return "li"+d.id;});
  
  
    var hyperlink:any =listentry.append("a").attr("role","button").attr("class", "nav-link")
    .attr("id", function(){return "hyperlink"+d.id})
  .attr("href",  function() { return (window.location.origin +'/overlay'+ '?device=' + d.id) });
    
    hyperlink.append("span").attr("data-feather","file-text");
    
    d3.select("a#hyperlink"+d.id).text("sfi, id:"+d.id);
   
  });
    }

    //call functions
    updateSidetable();
    updateTableheads(vnfgraph.nodes);
    updateTables(vnfgraph.nodes);

           
    


    //virtual network function/service function visualisation is added
    vnfgraph['nodes'].forEach((element:any) => {

        //choosing the host of the vnf for the placement
        var vnfhostname: string = element.vnf_host.toString()
        var width:number = +d3.select("a#"+vnfhostname).select("rect").attr('width');
        var vnfindex:number = hostvnfindex[hostlist2.indexOf(vnfhostname)];
       
        //xcoord for the placement of the vnf viz
        var xcoord:any = -width/4+4;
        if ((vnfindex+1) % 2 == 0){xcoord = (-width/4+width/2)+1} //placement left, right of vnfs

        //which vnf of vnf is placed and where
        hostvnfindex[hostlist2.indexOf(vnfhostname)] = hostvnfindex[hostlist2.indexOf(vnfhostname)]+1;

        
      
      //add vnfrect
        var vnfrectlink:any = d3.select("a#"+vnfhostname).append("a").attr("xlink:href",  function(d:any) { return (window.location.origin +'/overlay'+ '?device=' + element.id) });
        
        var vnfrect:any = vnfrectlink.append("rect").attr("width", (width/2)-6).attr("id", function(d:any) { return "rect" +element.id.toString() } ).attr("class", "vnfrect")
        .attr("height", 30)
        .attr('x', xcoord)
        .attr('y', (+32*Math.floor(vnfindex/2))-3 ).attr('rx', 2 )                          // -3 because rects were to close to border of hostrect
        .attr('ry', 2 )
        .style("stroke-width", 2)
        .style("fill", "white")
        .style('stroke', 'black');

        //vnfrect title
        var title:any = vnfrectlink.append("text") .attr('x', xcoord)
        .attr('y', (+32*Math.floor(vnfindex/2))+15-4 ).attr("width", (width/2)-6).style("text-overflow", "clip");

        var title1:any =title.append("tspan").text( function(d:any) { var hn:any = element.applicationName.toString();
          if(hn.length>15){
          return (hn.substring(0,15)+"... "); }
          else{return hn;}} )
        .attr("dx", "0.2em").style("font-size", "10px")
        .attr('x', xcoord)
        .attr("height", 30);
     

         var title2:any =title.append("tspan").text( function(d:any) { var hn:any = element.id.toString();
          if(hn.length>3){
          return ("id: "+hn.substring(0,3)+"... "); }
          else{return "id: "+hn;}} )
        .attr("dx", "0.2em").style("font-size", "10px")
        .attr("dy", "1.2em").attr('x', xcoord)
        .attr("height", 30);

        var title3:any =title.append("tspan").text( function(d:any) { var hn:any = element.vnf_label.toString();
          if(hn.length>6){
          return ("label: "+hn.substring(0,6)+"... "); }
          else{return "label: "+hn;}} )
        .attr("dx", "0.5em").style("font-size", "10px").style("font-weight", "bold")
      
        .attr("height", 30);      


        //several interactive mouse events for the vnfs
        svg.on("mousemove", function(d:any){
          d3.select("#tooltip")
          .style("visibility", "hidden");
          d3.selectAll(".vnfrect").style("stroke", "black");
      
  
        });


      

        

        //tooltip on mouseover elements
        vnfrect.on("mouseover", function(d:any, i:any) {
          vnfrect.transition().style("stroke", "yellow");

          var nodeelem:any = document.getElementById("rect"+i.id);
          var noderect = nodeelem.getBoundingClientRect();

          d3.select("#tooltip")
          .style("position", "fixed")
            .style("left", (Math.min(Math.max((noderect['x']+200),(svgrect['left'])), (svgrect['right']-tool1rect['width'])))+"px")
            .style("top", (Math.min(Math.max((noderect['y']+100),(svgrect['top'])), (svgrect['bottom']-tool1rect['height'])))+"px")
            .transition()
            .style("visibility", "visible");
         


          //fill tooltips with corresponding parameters
          d3.select("#series").text(vnfhostname);
          d3.select('#xval').text(element.serviceType);
          d3.select('#vnportval').text(element.virtual_network_port).style("color", "blue");
          d3.select('#yval').text(element.id);

            
        }).on("mouseout", function(d:any, i:any) {vnfrect.transition().style("stroke", "black")});


        title.on("mouseover", function(d:any, i:any) {
          vnfrect.transition().style("stroke", "yellow");

          var nodeelem:any = document.getElementById(i.id);
          var noderect = nodeelem.getBoundingClientRect();

          d3.select("#tooltip")
          .style("position", "fixed")
         
            .style("left", (Math.min(Math.max((noderect['x']+200),(svgrect['left'])), (svgrect['right']-tool1rect['width'])))+"px")
            .style("top", (Math.min(Math.max((noderect['y']+100),(svgrect['top'])), (svgrect['bottom']-tool1rect['height'])))+"px")

            .transition()
            .style("visibility", "visible");
         



          d3.select("#series").text(vnfhostname);
          d3.select('#xval').text(element.serviceType);
            
            d3.select('#yval').text(element.id);
           

            
        }).on("mouseout", function(d:any, i:any) {vnfrect.transition().style("stroke", "black")});




    });
   
   //get url params to react to selection
   function geturlparams(){

    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var device = urlParams.get('device');
    if(device){

      

    //highlight selected element
    d3.select("rect#rect"+device).style("fill", "yellow");
    var vnfnodedata:any = "";
    var thishost:any;
    var thisip:any;
    var thisport:any;

  
    var datab:any;
    
    //reference data for selected vnfs
    vnfgraph.nodes.forEach(
    
    function(d:any){if (d.id==device){
      thishost = d.vnf_host;
      thisip = d.ip_address;
      thisport = d.virtual_network_port;
      datab = d;
     
  
    }
    else{}
    });

 


  
  //Prepare JSON-Data chart for highlighted vnf
  //chop x and y param away, crop at virtual network port entry

    vnfnodedata=JSON.stringify(datab, undefined, 2).split('"virtual_network_port":')[0];
    vnfnodedata =vnfnodedata.slice(0, -1);
    vnfnodedata= vnfnodedata+' "virtual_network_port": "'+thisport+'"'+'\n'+'}';
  
    d3.select("#vnftable").append("h3").text("service function instance");
    d3.select("#vnftable").append("pre").append("text").text(vnfnodedata);
    d3.select("#hardwarelist").append("h3").text("hardware");
    var unl:any=d3.select("#hardwarelist").append("ul").attr("class", "nav flex-column");
    var linklink:any = unl.append("li").attr("class", "nav-item").append("a").attr("role","button").attr("class", "nav-link").attr("href",  function() { return (window.location.origin +'/underlay'+ '?device=' + thishost) });
    
    linklink.append("span").attr("data-feather","file-text");
    linklink.text(thishost);
  
  }
    
    }
  

    geturlparams();

          }).catch((err:any) => {
            // Handle err
            throw err;
          });  

      
      

}).catch((err:any) => {
  // Handle err
  throw err;
});  



//activities on drag

function dragstart(event:any, d:any) {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function whiledragging(event:any, d:any) {
  d.fx = event.x;
  d.fy = event.y;
}

function dragend(event:any,d:any) {
  if (!event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

  }

  
}















