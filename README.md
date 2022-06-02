# SFC_Infrastructure_Visualization_App

**Full-stack web application to visualize service function chaining infrastructure.**

I designed and implemented a visualization system for SFC infrastructure. The project is supposed to become part of an application to simplify operating a P4-SFC network orchestrator without detailed knowledge about the underlying technical frameworks and processes. But the application can be used for other SFC infrastructure as well.

**The application is part of my bachelor thesis published in this repository.**

https://github.com/coderin42/SFC_Infrastructure_Visualization_App/blob/e4f2b6eeceb6407c06669030f8e98352f8433b52/Abschlussarbeit.pdf

**Application Architecture:**

!["Application structure picture"](https://github.com/coderin42/SFC_Infrastructure_Visualization_App/blob/ad756949eaf2e1dabdbf4bf9136edd858be95d3c/webappimplementation.png)

It is implemented using Angular as an frontend framework, Django as a backend framework, an SQlite database and a REST API connecting frontend and backend. The visualization itself is done using the D3.js package and integrated into the frontend framework. The application can be connected to an infrastructure by syncing the database with the corresponding data. The data model is defined in the Django backend and is split into three parts. 
Part one is the "Layer2" data model. That is the corresponding data model to all the layer2 device data and data about links between the devices. "VNFs" relates to all the data about the service functions or virtual network functions in the administrative domain. The "SFCs" data model rcord in the database should contain the data about instantiated SFCs. For further information see examples in network examples.

**The data is visualized in the webapp as shown below:**

The visualization is sliced into three parts as well. The overlay network, the underlay network and the SFC representation. The visualization is interactive, leveraging links, tooltips and a reactive network graph representation. The visualization is always rendered on refreshing the page with the latest data from the database. Conveniently, a refresh button at each visualization part brings you back to a refreshed view without any selected items.

**Underlay Visualization:**

!["Underlay picture"](https://github.com/coderin42/SFC_Infrastructure_Visualization_App/blob/bb278fda7b7bd29d4686fca38d9b5693ffc4b95b/example%20pictures/Bildschirmfoto%20von%202022-03-11%2017-37-15.png)

This part of the visualization includes hardware and vnf tables, links to every visualized device on the site and a zoomable and draggable interactive network graph visualization. If a node in this graph is clicked or a corresponding link the node is highlighted in the visualization and specific data is displayed below. Including a list with hosted vnfs on the device and a link to them that leads to a selected representation of this vnf at the overlay visualization part. There is also a tooltip showing important information about the network nodes on mouseover.

**Overlay Visualization:**

!["Overlay picture"](https://github.com/coderin42/SFC_Infrastructure_Visualization_App/blob/bb278fda7b7bd29d4686fca38d9b5693ffc4b95b/example%20pictures/Bildschirmfoto%20von%202022-03-11%2017-36-20.png)

The overlay visualization part has a sidebar with links to all the known vnfs in the network, a network graph representation only containing the vnf_hosts, virtual links between them and selectable vnf representations that are deployed on them. The network graph is again zoomable, draggable and interactive. An included tooltip is showing important information about the vnfs on mouseover. When a vnf is selected, detailed data about is can be seen below. Including a link to the selected representation of its host on the underlay part of the visualization.

**Service Function Chaining Visualization:**

!["SFC picture"](https://github.com/coderin42/SFC_Infrastructure_Visualization_App/blob/bb278fda7b7bd29d4686fca38d9b5693ffc4b95b/example%20pictures/Bildschirmfoto%20von%202022-03-11%2017-38-27.png)

The SFC visualization includes a sidebar with selectable links to the different SFCs and a graph visualization of only the vnf_hosts. When a SFC is selected by clicking a link to a SFC, a SF path between SFs/vnfs specified from the SFC data is highlighted and shown by using directive arrows. Additional data about the SFC instantiation is shown below including a list of the vnfs in the correct order, their hosts in the correct order and the entire JSON-formatted data about the SFC instantiation. The JSON-formatted data is printed indented to ensure readability. Again a included tooltip is showing important information about the vnfs on mouseover. And a click on a vnf representation leads to the selected representation of the vnf on the overlay visualization view.
