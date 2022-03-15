# SFC_Infrastructure_Visualization_App

Full-stack web application to visualize service function chaining infrastructure. 

**The original repository content is going to be published to another repository because of organisatorial reasons. The link to this repo will be added tomorrow to this README**

I designed and implemented a visualization system for SFC infrastructure. The project is supposed to become part of an application to simplify operating a P4-SFC network orchestrator without detailed knowledge about the underlying technical frameworks and processes. But the application can be used fo other SFC infrastructure as well.
It is implemented using Angular as an frontend framework, Django as a backend framework, an SQlite database and a REST API connecting everything. The visualization itself is done using the D3.js package and integrated into the frontend framework. The application can be connected to an infrastructure by syncing the database with the corresponding data. The data model is defined in the Django backend and is split into three parts. 
Part one is the "Layer2" data model, that is the corresponding data model to all the layer2 device data and data about links between the devices. "VNFs" relates to all the data about the service functions or virtual network functions in the administrative domain. The "SFCs" data model rcord in the database should contain the data about instantiated SFCs. For further information see examples in network examples.

The data is then visualized in the webapp as shown below:

The visualization is sliced into three parts as well. The overlay network, the underlay network and the SFC representation. The visualization is interactive, leveraging links, tooltips and a reactive network graph representation.

Underlay Visualization:

!["Underlay picture"](https://github.com/coderin42/SFC_Infrastructure_Visualization_App/blob/bb278fda7b7bd29d4686fca38d9b5693ffc4b95b/example%20pictures/Bildschirmfoto%20von%202022-03-11%2017-37-15.png)

Overlay Visualization:

!["Overlay picture"](https://github.com/coderin42/SFC_Infrastructure_Visualization_App/blob/bb278fda7b7bd29d4686fca38d9b5693ffc4b95b/example%20pictures/Bildschirmfoto%20von%202022-03-11%2017-36-20.png)

Service Function Chaining Visualization:

!["SFC picture"](https://github.com/coderin42/SFC_Infrastructure_Visualization_App/blob/bb278fda7b7bd29d4686fca38d9b5693ffc4b95b/example%20pictures/Bildschirmfoto%20von%202022-03-11%2017-38-27.png)
