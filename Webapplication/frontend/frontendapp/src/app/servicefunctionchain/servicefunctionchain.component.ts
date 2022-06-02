import { Component, HostListener, OnInit } from '@angular/core';
import * as d3 from 'd3';
import {zoom} from 'd3-zoom';
import { analyzeAndValidateNgModules, ArrayType, flatten, identifierModuleUrl } from '@angular/compiler';

class Vnftype{                                            //define class of different Vnftypes

  public constructor(
  readonly serviceType: string, 
  readonly color: string 
  ){}

}

class SFCtype{                                            //define class of different Vnftypes

  public constructor(
  readonly owner: string, 
  readonly color: string 
  ){}

}

class Hosttype{                                            //define class of different hardwaretypes

  public constructor(
  readonly group: number,
  readonly isSwitch: Boolean,
  readonly color: string 
  ){}

}

@Component({
  selector: 'app-servicefunctionchain',
  templateUrl: './servicefunctionchain.component.html',
  styleUrls: ['./servicefunctionchain.component.css']
})
export class ServicefunctionchainComponent implements OnInit {

  //urls to backend api

  //url to get hardware layer data
  readonly APIUrl = "http://127.0.0.1:8000/layer2";
  //url to get vnf data
  readonly APIUrl2 = "http://127.0.0.1:8000/vnfs";
  
  readonly APIUrl3 = "http://127.0.0.1:8000/sfcs";

  //instantiate svg
  private svg:any;

  //list
  public hostlist : string[] = [];

   //hosttype definition
   public hosttypes : Hosttype[] = [];

  public sfctypes : SFCtype[] = [];





  ngOnInit(): void {
    this.addHosttypes();
  
    var hl= this.hostlist

    var ht = this.hosttypes
    var sfct:SFCtype[] =this.sfctypes
    this.createSvg();

    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var hardwarevalue = urlParams.get('hardware');
    
    //ask for hardwarelayer
    if(hardwarevalue){
      this.drawGraph(hl, ht);
    }
    else{
      this.drawGraph(hl, ht);
    }
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



  private drawGraph(hostlist2:any, hosttypeslist: Hosttype[] ): void {
    
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

 //to assign virtualLinks later
 var virtLinks:any = [];

//access tables
 var tableBody:any = d3.select("#tableBody");
 var tableHead:any = d3.select("#tableHead");
 var tableBodys:any = d3.select("#tableBodys");
 var tableHeads:any = d3.select("#tableHeads");


 //add marker definitions
  svg.append('defs').append('marker')
    .attr("id",'arrowhead')
    .attr('viewBox','-0 -5 10 10') 
     .attr('refX',120) 
     .attr('refY',0)
     .attr('orient','auto')
        .attr('markerWidth',10)
        .attr('markerHeight',10)
        .attr('xoverflow','visible')
    .append('svg:path')
    .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
    .attr('fill', 'blue')
    .style('stroke','none');

    svg.append('defs').append('marker')
    .attr("id",'arrowhead2')
    .attr('viewBox','-0 -5 10 10') 
     .attr('refX',-100) 
     .attr('refY',0)
     .attr('orient','auto')
        .attr('markerWidth',10)
        .attr('markerHeight',10)
        .attr('xoverflow','visible')
    .append('svg:path')
    .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
    .attr('fill', 'blue')
    .style('stroke','none');


     

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
  //.force("charge", d3.forceManyBody().strength(-200).distanceMax(70))
  //.force("x", d3.forceX(svg.attr("width")/2).strength(1))
  //.force("y", d3.forceY(svg.attr("height")/2))
   .force("center", d3.forceCenter(svg.attr("width")/2, svg.attr("height")/2))
   .force("collision", d3.forceCollide().radius(140));


  //get data from backend framework

  //get hardware layer data

  d3.json(this.APIUrl).then((response:any) => {

  //get virtual network function data
  d3.json(this.APIUrl2).then((response2:any) => {
   

  // reference data  
  const vnfgraph = response2[0].Network;
  var graph:any = response[0].Network;
  var graphorigin:any = graph.nodes;

  //create list with all the hosts with vnfs
  var hostlist = new Set<string>();


  //fill the list with hosts
  vnfgraph.nodes.forEach(function(d:any){
    hostlist.add(d.vnf_host);
  });


  //myown array includes element
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






  //get url params and change information display
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
  
  
    d3.select("#hardwaretable").append("h3").text("hardware:");
    d3.select("#hardwaretable").append("pre").append("text").text(vnfnodedata);
    d3.select("#vnflist").append("h3").text("SF instances:");
    d3.select("#vnflist").append("ul").attr("id", "unvnflist").attr("class", "nav flex-column");
  
  }
    
    }

     //functions to update tables around svg
 
          
          //function to update first table
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

       updateTable(graph.nodes);
       updateTablehead(graph.nodes);


  //add x and y coordinates
  graph.nodes.forEach(function(d:any){
    d.x = graph.nodes.length-d.index/graph.nodes.length*1000;//Math.random()* 1000;
    d.y = d.index/graph.nodes.length*1000;
   });

  //push hosts to list
  graph.nodes.forEach(function(d:any){
     hostlist2.push(d.id.toString()); });

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




  vnfgraph['nodes'].forEach((element:any) => {
    var vnfhostname: string = element.vnf_host.toString()
    hostvnfcount[hostlist2.indexOf(vnfhostname)] = hostvnfcount[hostlist2.indexOf(vnfhostname)]+1

  });




  //way to calculate virtual links between hardware nodes

   //variables to do calculation
   let myhostlist:any = Array.from(hostlist);
   var virtuallinksum:number = 0;



  //function to calculate
  function addVirtualLinks(){
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

    //define essential parts of graph visualization

    //define links between hardware
    var link = zoomArea
    .selectAll("line")
    .data(newgraph.links)
    .enter().append("line")
      .attr("stroke", "grey")
      .attr("value", function(d:any) {return d.value; })
      .attr("stroke-width", function(d:any) { if(d.value !== 13000){return d.value*0.1; }else{return 1;}}).style("opacity", 0);

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


    //selects hosttypes by group and add visualisation qualities per type, very similar to the function on the other visualization layers, but without isSwitch Option
    //because only vnfhosts are visualized
    function appendvisible(){

    var nodewidth:any = 100;
    var nodeheight:any = 60;

    //default, if there is no hosttype for a host defined
    node.append("rect").attr("id", function(d:any) { return ("rect"+d.id.toString()) } )
    .attr("width", nodewidth*2)
      .attr("height", function(d:any) { return nodeheight +  32*(hostvnfcount[hostlist2.indexOf(d.id)]-1)} )
      .attr('x', -(nodewidth/2) )
      .attr('y', -(nodewidth/2)+7)
      .attr('rx', (nodewidth/20) )
      .attr('ry', (nodewidth/20) )
      .style("stroke-width", 2)
      .style('fill', "grey")
      .style('stroke', "black");

      var title:any =  node.append("text").text("typenotdeclared")
      .attr("text-anchor", "middle")
      .style("font-size", function(d:any) { return (nodewidth*1.4/("typenotdeclared".length)) + "px"; })
      .attr('x', +0 ).attr('y', -(nodewidth/6)+7 )
          .style('stroke', 'black'); 


    //visualize hosts for very hosttype from the hosttypelist
    for (let i = 0; i < hosttypeslist.length; i++){
        
      d3.selectAll("a.group"+hosttypeslist[i].group).selectAll("rect").remove();
      d3.selectAll("a.group"+hosttypeslist[i].group).selectAll("text").remove();

      d3.selectAll("a.group"+hosttypeslist[i].group).append("rect").attr("id", function(d:any) { return ("rect"+d.id.toString()) } )
      .attr("width", nodewidth*2)
      .attr("height", function(d:any) { return nodeheight +   32*(Math.ceil(hostvnfcount[hostlist2.indexOf(d.id)]/2)-1)} )
        .attr('x', -(nodewidth/2) )
        .attr('y', -(nodeheight/2)+7 )
        .attr('rx', (nodewidth/20) )
        .attr('ry', (nodewidth/20) )
        .style("stroke-width", 2)
        .style('fill', hosttypeslist[i].color)
        .style('stroke', 'black');
  
        d3.selectAll("a.group"+hosttypeslist[i].group).append("rect").attr("id", function(d:any) { return ("rectfront"+d.id.toString()) } ).attr("class", function(d:any) { return ("rectfrontgroup"+d.group.toString()) } )
      .attr("width", 40)
      .attr("height", function(d:any) { return nodeheight +   32*(Math.ceil(hostvnfcount[hostlist2.indexOf(d.id)]/2)-1)} )
        .attr('x', -90 )
        .attr('y', -30 +7).attr('rx', 5 )
        .attr('ry', 5 )
        .style("stroke-width", 2)
        .style('fill', hosttypeslist[i].color)
        .style('stroke', 'black');
        
      d3.selectAll("a.group"+hosttypeslist[i].group).append("text").style("fill", "black")
      .attr("dx","+0.5em").style("font-size", "13px")
      .attr("x", -90).attr("y", -0+7)
      .attr("opacity", "1")
      .text("host");


      //rect with information about the host: the name and the mpls_label
      var actualrectlink:any = d3.selectAll("a.group"+hosttypeslist[i].group).append("a").attr("xlink:href",  function(d:any) { return (window.location.origin +'/underlay'+ '?device=' + d.id) });

      
        var title:any = actualrectlink.append("text") .attr('x', -nodewidth/2)
        .attr('y', -15+7).attr("width", nodewidth).style("text-overflow", "clip");

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
      

  
    
    }

    //call function
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
          .on("start", startdragging)
          .on("drag", whiledragging)
          .on("end", enddragging));   

  
  

    //functions from above are called
    geturlparams(); 
    updateTableheads(vnfgraph.nodes);
    updateTables(vnfgraph.nodes);

    vnfgraph['nodes'].forEach((element:any) => {
      var vnfhostname: string = element.vnf_host.toString()
      hostvnfcount[hostlist2.indexOf(vnfhostname)] = hostvnfcount[hostlist2.indexOf(vnfhostname)]+1

    });

  


      vnfgraph['nodes'].forEach((element:any) => {

        //choosing the host of the vnf for the placement
        var vnfhostname: string = element.vnf_host.toString()
        //var height:number = +d3.select("a#"+vnfhostname).select("rect").attr('height');
        var width:number = +d3.select("a#"+vnfhostname).select("rect").attr('width');
        //var vnfn:any= hostvnfcount[hostlist2.indexOf(vnfhostname)];
        var vnfindex:number = hostvnfindex[hostlist2.indexOf(vnfhostname)];
       
        //xcoord for the placement of the vnf viz
        var xcoord:any = -width/4+4;
        if ((vnfindex+1) % 2 == 0){xcoord = (-width/4+width/2)+1} //placement left, right of vnfs

        //which vnf of vnf is placed and where
        hostvnfindex[hostlist2.indexOf(vnfhostname)] = hostvnfindex[hostlist2.indexOf(vnfhostname)]+1;
      

    //add vnfrect
    var vnfrectlink:any = d3.select("a#"+vnfhostname).append("a").attr("xlink:href",  function(d:any) { return (window.location.origin +'/overlay'+ '?device=' + element.id) }).attr("id", "a"+element.id);
        
    var vnfrect:any = vnfrectlink.append("rect").attr("width", (width/2)-6).attr("id", function(d:any) { return "rect" +element.id.toString() } ).attr("class", "vnfrect")
    .attr("height", 30)
    .attr('x', xcoord)
    .attr('y', (+32*Math.floor(vnfindex/2))-3+7 )
    .attr('rx', 2 )                          // -4 because rects were to close to border of hostrect
    .attr('ry', 2 )
    //.attr('r', 20)
    .style('fill', 'white')
    .style("stroke-width", 2)
    .style('stroke', 'black');


    var title:any = vnfrectlink.append("text") .attr('x', xcoord)//.style("font-size", "15px")
    .attr('y', (+32*Math.floor(vnfindex/2))+15-4+7 ).attr("width", (width/2)-6).style("text-overflow", "clip");

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
       // .style("font-size", "4px")
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
          d3.selectAll(".vnfrect").style("fill", "white");
      
  
        });


      

        

        //place tooltip on mouseover corresponding vnf

        vnfrect.on("mouseover", function(d:any, i:any) {
          vnfrect.transition().style("fill", "yellow");

          var nodeelem:any = document.getElementById("rect"+i.id);
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
           
            //d3.select(i).transition().duration(10).style("fill", "red");

            
        }).on("mouseout", function(d:any, i:any) {vnfrect.transition().style("fill", "white")});


        title.on("mouseover", function(d:any, i:any) {
          vnfrect.transition().style("fill", "yellow");

          var nodeelem:any = document.getElementById(i.id);
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
           

            
        }).on("mouseout", function(d:any, i:any) {vnfrect.transition().style("fill", "white")});
   });




  //get SFC data for visualization   
   d3.json(this.APIUrl3).then((response3:any) => {

    const sfclist = response3[0].SFCList;
    const sfcs = sfclist.SFCs;
    
  
    function getvnfids(sfcid:any){
      var vnfids:any = [];
      sfcs.forEach(
        
        function(d:any){if (d.id==sfcid){
          var vnflist:any = d.vnfs;
          for(var i = 0;i<vnflist.length; i++){
            vnfids.push(vnflist[i].id);

  
          }
  
      
      }
      else{}
      });
      return vnfids;
  
    }
  
  
  
    //function to update sidetable 
    function updateSidetable() {
  
      var refreshLink:any =d3.select("a#Refresh").attr("target", "_self").attr("href", window.location.origin +'/sfc');
  
      sfcs.forEach(function(d:any){
      
        var listentry:any = unsortedlist.append("li").attr("class", "nav-item").attr("id", function(){return "li"+d.id;});
      
      
        var hyperlink:any =listentry.append("a").attr("role","button").attr("class", "nav-link")
        .attr("id", function(){return "hyperlink"+d.id})
      .attr("href",  function() { 
        var queryString = window.location.search;
        var urlParams = new URLSearchParams(queryString);
        if(queryString){
          var urlParams = new URLSearchParams(queryString);
          var hdvalue:any =urlParams.get('hardware');
          if(hdvalue){
            return (window.location.origin+ '/sfc?hardware=true&servicefunctionchain='+d.id);
          }
          else{
            return (window.location.origin+ '/sfc?servicefunctionchain='+d.id);
  
  
          }}
    
        else{
  
          return (window.location.origin+ '/sfc?servicefunctionchain='+d.id);
  
        }
      
      });
  
        
        hyperlink.append("span").attr("data-feather","file-text");
                    
        d3.select("a#hyperlink"+d.id).text("sfc, id:"+d.id);
      
      });
      }
      
      
      updateSidetable();



      function shuffle(array:any) {
        var currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
        return array;
      }
  
  
      function geturlparams(){
  
        var queryString = window.location.search;
        var urlParams = new URLSearchParams(queryString);
        var sfcid = urlParams.get('servicefunctionchain');
  
       
  
  
        if(sfcid){
  
          var vnfidlist:any = getvnfids(sfcid);

          console.log(vnfidlist)
      
          graph.nodes.forEach(function(d:any){
   
            d3.selectAll("a#"+d.id).style("opacity", 0.2);
   
          });

  
  
      //update tables, when the SFC is chosen
      var sfcnodedata:any = "";
      
      sfcs.forEach(
        
        function(d:any){if (d.id==sfcid){
          sfcnodedata=JSON.stringify(d, undefined, 2);
      
      }
      else{}
      });
      
      
        d3.select("#sfctable").append("h3").text("service function chain instantiation");
        d3.select("#sfctable").append("pre").append("text").text(sfcnodedata);
        d3.select("#vnflist").append("h3").text("SF instances:");
        d3.select("#vnflist").append("ul").attr("id", "unvnflist").attr("class", "nav flex-column");
      
       
        for(var i = 0; i < vnfidlist.length; i++){
          var ll:any = vnfidlist[i];

          
  
          var listentry:any = d3.select("#unvnflist").append("li").attr("class", "nav-item").attr("id", function(){return "li"+ll+i;});
  
          var hyperlink:any =listentry.append("a").attr("role","button").attr("class", "nav-link")
          .attr("id", function(){return "hyperlink"+ll+i})
        .attr("href",  function() { return (window.location.origin +'/overlay'+ '?device=' + ll) });
          
          hyperlink.append("span").attr("data-feather","file-text");
                
          d3.select("a#hyperlink"+ll+i).text("sfi, id:"+ll.toString());
  
        }
        var listentryparagraph1:any = d3.select("#unvnflist").append("li").attr("class", "nav-item").append("p");
  
        d3.select("#vnflist").append("h3").text("hardwarelist:");
        d3.select("#vnflist").append("ul").attr("id", "unvnflist2").attr("class", "nav flex-column");
  
          
        for(var i = 0; i < vnfidlist.length; i++){
          var llnode:any;
          var secnode:any;

          vnfgraph.nodes.forEach(function(d:any){
            if( d.id ===vnfidlist[i]){
            llnode =d;
          }
          if(d.id ===vnfidlist[i+1]){
            secnode =d;
          }; 
        });


  
          var ll:any = llnode.vnf_host;
          var ss:any = secnode.vnf_host;
          var llid:any = llnode.id;
  
          var listentry:any = d3.select("#unvnflist2").append("li").attr("class", "nav-item").attr("id", function(){return "li"+ll+llid+i;});
  
          d3.selectAll("a#"+ll).style("opacity", 1);
          d3.selectAll("rect#rect"+llid).style("stroke","blue").style("stroke-width", "3px");

          d3.selectAll("a#a"+llid).append("rect") .attr('x', -0)//.style("font-size", "15px")
          .attr('y', +10).attr("width", 20).attr("height", 20).style("fill", "white").style("stroke", "blue");

          //numbering Patch
          var titletest:any = d3.selectAll("a#a"+llid).append("text") .attr('x', -0)//.style("font-size", "15px")
          .attr('y', +26).attr("width", +0).style("text-overflow", "clip");

          var title1:any =titletest.append("tspan").text(i+1)
          .attr("dx", "0.2em").style("font-size", "20px").style("fill", "blue");
          
         

          var pathlinks:any = newgraph.links.filter(function(d:any){return d.value==13000;});
      


          //function to calculate a pathlist and later highlight it
          function getPathlist(source:any, target:any, list:any){

            var directlinklist:any = pathlinks.filter(function(d:any){return d.target.id===target&&d.source.id===source});

            if(directlinklist.length!==0){
              list.push(source);
              list.push(target);
              return list;

            }

            else{


              var linkfromlist:any = shuffle(pathlinks.filter(function(d:any){return d.source.id===source&&(!myownincludes(list,d.target.id ))}));
              console.log("linksfrom source list:");
              console.log(linkfromlist);

              

              if(linkfromlist.length!==0){


                for (var ind:any = 0;ind<linkfromlist.length; ind++){
                  var targetid:any = linkfromlist[ind].target.id;
                  console.log("source is: " +source+ " target is: "+targetid);
                  var listo:any = list;
            
                  listo.push(source);
                  listo.push(targetid);

                  console.log("dorecursion with this list:");
                  console.log(listo);

                  var doRecursion: any = getPathlist(targetid, target, listo);
                  if(doRecursion.length!==0){
                    console.log("if recursion found path, return it:");
                    console.log(doRecursion);
                    return doRecursion;
                  }
                  else{
                    listo.pop();
                    listo.pop();
                  }
               

                }

                console.log("if nothing was found");
                listo=[];
                list=[];
                return [];

              }

              else{
                
                return [];
  
              }

            }

          }

          if(i!==vnfidlist.length-1&&!(ll===ss)){
          var testtest:any= getPathlist(ll, ss, []);
          console.log(testtest);





          var sfclinks:any = link.filter(function(d:any){
            for (var y:any = 0; y<testtest.length-1; y=y+2){
              if(d.source.id===testtest[y]&&d.target.id===testtest[y+1]){
                return true;

              }
            }
            
              return false;
            
          });



           

          sfclinks.attr("stroke", "blue").style("fill", "blue").style("stroke-width", "2px").attr('marker-end','url(#arrowhead)').attr('marker-start','url(#arrowhead2)').style("opacity", 1);


          }
        
  
          
          var hyperlink:any =listentry.append("a").attr("role","button").attr("class", "nav-link")
          .attr("id", function(){return "hyperlink"+ll+llid+i})
        .attr("href",  function() { return (window.location.origin +'/underlay'+ '?device=' + ll) });
          
          hyperlink.append("span").attr("data-feather","file-text");
        
          
        
          d3.select("a#hyperlink"+ll+llid+i).text("sfi, id:"+llid.toString()+", host:"+ll.toString());
  
        }
        var listentryparagraph:any = d3.select("#unvnflist2").append("li").attr("class", "nav-item").append("p");
    
      }
        
        }
      
        //call function
        geturlparams();
  
  
        }).catch((err:any) => {
          // Handle err
          throw err;
        });  
   

  

          }).catch((err:any) => {
            // Handle err
            throw err;
          });  

      
      

}).catch((err:any) => {
  // Handle err
  throw err;
});  


//define dragfunctions (inspired by a tutorial how to d3-graph-simulation)

function startdragging(event:any, d:any) {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function whiledragging(event:any, d:any) {
  d.fx = event.x;
  d.fy = event.y;
}

function enddragging(event:any,d:any) {
  if (!event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

}









































































}








































