import { Component, ElementRef, ViewChild, } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MapPage } from '../map/map';
import { TreatmentPage } from '../treatment/treatment';
import { DataServiceProvider } from '../../providers/data-service';
import { RoutingProvider } from '../../providers/routing';
import { NextStepsPage } from '../next-steps/next-steps';


/**
 * Generated class for the ImagingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 
@IonicPage()
@Component({
  selector: 'page-imaging',
  templateUrl: 'imaging.html',
})
export class ImagingPage {
cards: any;//the cards are the data type that is displayed on the html page 
Spinner: Boolean=true;//Set the spinner to be true and shown untill the content has finished loading 
show: Boolean=false;//Have the div be hidden untill the data has loaded and the spinner disapears 
results: Boolean=false;//a Boolean showing if there are no results reruned from the calculations 
display: String="There are no routes available from your location please call local health services for more information";//The message to display if there are no results 

tPACards:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public Data: DataServiceProvider,//set constructor so the page can access the routing and data provider 
    public Routes: RoutingProvider) {
   

 
    Array.prototype.Min = function(attrib: any) {
      return this.reduce(function(prev, curr){
          return prev[<any>attrib] < curr[<any>attrib] ? prev : curr;
      });
    };
   
    function compareDijkstra( a, b ) {
        if ( a.DijkstraDurationFromStart < b.DijkstraDurationFromStart ){
          return -1;
        }
        if ( a.DijkstraDurationFromStart > b.DijkstraDurationFromStart ){
          return 1;
        }
        return 0;
      }


    var EVTarr = [];
    var tPAarr = [];



    var myGraph = new Graph(  this.Data );
    
    myGraph.BuildGraph();

    console.log("")
    console.log("GRAPH:");
    console.log(myGraph);
    console.log("")
    console.log("GRAPH NODES:")
    console.log(myGraph.Nodes);
    console.log("")
    console.log("GRAPH EDGES:")
    console.log(myGraph.Edges);

    console.log("TB to REDLAKE:");
    console.log(myGraph.get_edge ('MED_TBRHSC', 'MED_AGH'));

    myGraph.Dijkstra(this.Data.StartLoc.id);
    console.log(myGraph);
    console.log(myGraph.GetNode('MED_TBRHSC'));

    console.log("Individual edges:");

    
    //console.log(myGraph.get_edge ('MED_REDLAKE', 'MED_MARYBERGLUND'));
    //console.log(myGraph.get_edge ('MED_MARYBERGLUND', 'R081'));
    //console.log(myGraph.get_edge ('R081', 'CYQT'));
    //console.log(myGraph.get_edge ('CYQT', 'CTB2'));
    //console.log(myGraph.get_edge ('CTB2', 'MED_TBRHSC'));


    for (let i = 0; i < myGraph.Nodes.length; i++){
        //console.log(i);
        if(myGraph.Nodes[i].telestroke==true) {
            tPAarr.push(myGraph.Nodes[i]);
        }
        if(myGraph.Nodes[i].evt==true) {
            EVTarr.push(myGraph.Nodes[i]);
        }
    }
 
    tPAarr.sort( compareDijkstra );
    EVTarr.sort( compareDijkstra );

    console.log(tPAarr);
    console.log(EVTarr);
    this.tPACards=tPAarr;
 this.Data.tPARoutes=tPAarr;
 this.Data.EVTRoutes=EVTarr;


  }
 async ionViewWillLoad(){// part of the ionic lifecycle that will start before the page is about to load 
 var dat=await this.pageSetup();// wait for the calls to the routing provider to perform its actions and return the data 
 console.log(this.Data.StartLoc);

 if(dat.length==0)//If there are no results returned it will set the results to true and display the message 
 {
this.results=true;
 }
 else{//if there are results set the cards to be displayed as the data returned by the setup function 
   this.cards=dat;
   this.Spinner=false;//disable the spinner so it stops 
   this.show=true;//enable the content div to be shown with the results once loaded 
  }
 
}



async pageSetup()
{
  var DrivingRoutes;//set a variable to be filled with the data 
  await this.Routes.getRoutes("bTelestroke").then(data =>{//Search for all driving routes to telestroke centers which at the moment are the only places to get imaging 
   DrivingRoutes=data;//set the imageroutes to be the data returned by the function 
 });
 
 await this.Routes.nearestLocations();//wait for a function that gets the closest airport and helipad to the start and end locations 
 var FlightRoutes;//assign another variable for the total collection of card information 
  await this.Routes.getFlights(DrivingRoutes).then(distances =>{//get the information on the flights from the routing provider 
FlightRoutes=distances;//set the totalcard variable with the information from the flights 
 });
 var imgroutes=this.Routes.addRoutes(DrivingRoutes,FlightRoutes);//combines the flight information and the driving information into one list 
 imgroutes=this.Routes.masterSort(imgroutes);//Sort the combined list of flight and driving information to have the shortest amount of time first 
 imgroutes= this.Routes.SetColour(imgroutes);//Set the colour of each of the options for arrival green if able to make it for tPA yellow if able to make it for EVT and red if not able to make it in usual recovery time 
 //console.log(imgroutes);//used to view the final list that is passed to the back reenable to show full information passed 
 return imgroutes;//return the final list of sorted information ready to be displayed 
}

  goToRoute(DriveDat){//if the route is a simple driving one
    this.Data.ComplexRoute=false;//set complexroute to false so it will do a driving route 
    this.Data.Destination=DriveDat;//set the destination with the card information passed in 
    this.navCtrl.push(NextStepsPage);//go to the map page to show the route 
  }


  ComplexRoute(FlightDat)// if the route selected is a more complex flying route with driving sections to get to the airports or helipads 
  {
    this.Data.ComplexRoute=true;//set complexroute to be true so the mapping page knows to do a route with flying and driving 
    this.Data.Destination=FlightDat;//set the destination to be the card that has been selected 
    this.navCtrl.push(NextStepsPage);//go to the map page to show the results 
  }


  GoToTreatment(){// if the user selects to view the treatment options they will click the button and call this function 
    this.navCtrl.push(TreatmentPage);//go to the treatment options page 
  }
  
  
}







  // ==================================================================================================
  function HaversineDistance(coords1, coords2   ) {
    let radlat1 = Math.PI * coords1[0]/180;
    let radlat2 = Math.PI * coords2[0]/180;
    let radlon1 = Math.PI * coords1[1]/180;
    let radlon2 = Math.PI * coords2[1]/180;
    let theta = coords1[1]-coords2[1];
    let radtheta = Math.PI * theta/180;
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180/Math.PI;
    dist = dist * 60 * 1.1515;
    dist = dist * 1.609344; // km
    dist = dist * 1000; // turn km into meters
    return dist;
  }
  
  
  
  
      //**********************************************************************************************
      class Node {
        Edges: any[];
        helipad: boolean;
        airport: boolean;
        road: boolean;
          constructor(){
              this.Edges = [];
              this.helipad = false;
              this.airport = false;
              this.road = false;
          }
          id;
          name;
  
          Address;
  
          lat;
          lng;
  
 
          previousNode = null;
          NextNodes = [];
  
          // Dijkstra Variables 
          DijkstraDurationFromStart = null;
          DijkstraPreviousNode = null;
  
 
          SetLat(x) {
              this.lat = x;
          }
          GetLat(){
              return this.lat;
          }
          SetLatLng(x,y){
              this.lat = x;
              this.lng = y;
          }
          SetLng(x) {
              this.lng = x;
          }
          GetLng(){
              return this.lng;
          }
 
          AddEdge(x){
              this.Edges.push (x);
          }
          RemoveEdge(x){
              for (let i = 0; i < this.Edges.length; i++) {
                  if (this.Edges[i].endNodes.includes(x) === true  ) {
  
                  }
              }
          }
          ReturnFinalPath(x) {
  
          }
          ReturnFinalDistance(x){
  
          }
      } // end Node class
      
      //**********************************************************************************************
  
      class Edge  {
        id;
        distance;  // distance in metres
        duration;  // duration in seconds only
        // road = false;
        // helicopter = false;
        // airplane = false;
        type = "road";
        endNodes = [];
    } // end Edge class
  
    //**********************************************************************************************
  
    class Graph  {

      directionsService = new google.maps.DirectionsService();
        constructor(public Data: DataServiceProvider){
          console.log("Creating Graph Object");
        }
        
        StartLocation = null;
        DestinationLocation = null;
  
        A_Star_results = null;
        Results_arr = [];
        iterator_obj = null;
  
        nodeIDCounter = 0;
        edgeIDCounter = 0;
        Nodes = [];
        Edges = [];
  
        StartNode = null;
        DestinationNode = null;
  
        //DijkstraStartNode = null;
        DijkstraGoalNode = null;
        DijkstraDuration = null;
        DijkstraDistance = null;
        
        DrawDijkstraResults(end ) {
          //console.log(G.Nodes);
          console.log("Starting to Draw Dijkstra");

          //let end = "MED_TBRHSC";
          //let start = "MED_UPSALA";

          //let StartNode = this.GetNode(start);
          //this.DijkstraStartNode = StartNode;
          //let EndNode = this.GetNode(end);

          //this.DijkstraDuration = 0;
          //this.DijkstraDistance = 0;

          let CurrentNode = this.GetNode(end);
          console.log("CurrentNode.DijkstraPreviousNode:" + CurrentNode.DijkstraPreviousNode);
          while (CurrentNode.DijkstraPreviousNode !== null) {
              console.log("looping...");
              //console.log("this.DijkstraDuration: " + this.DijkstraDuration);
              let CurrentEdge = this.get_edge(CurrentNode.name,CurrentNode.DijkstraPreviousNode.name);

              if (CurrentEdge.type === "road") {
                  console.log("drawing road route...");
                  console.log("ROAD: " + this.EstDrivingDuration(this.get_edge_distance(CurrentNode.name ,CurrentNode.DijkstraPreviousNode.name)));
                  //this.DijkstraDuration = this.DijkstraDuration + this.EstDrivingDuration(this.get_edge_distance(CurrentNode.name ,CurrentNode.DijkstraPreviousNode.name)) ;
                  this.requestDirections(
                      {lat: CurrentNode.GetLat(),lng: CurrentNode.GetLng() },
                      {lat: CurrentNode.DijkstraPreviousNode.GetLat(),lng: CurrentNode.DijkstraPreviousNode.GetLng() }
                      );

              } else if (CurrentEdge.type === "plane" ){
                  console.log("drawing air plane route...");
                  console.log("plane: " + this.EstPlaneDuration(this.get_edge_distance(CurrentNode.name ,CurrentNode.DijkstraPreviousNode.name)));
                  //this.DijkstraDuration = this.DijkstraDuration + this.EstPlaneDuration(this.get_edge_distance(CurrentNode.name ,CurrentNode.DijkstraPreviousNode.name)) ;
                  this.DrawFlightPath(
                      {lat: CurrentNode.GetLat(),lng: CurrentNode.GetLng() },
                      {lat: CurrentNode.DijkstraPreviousNode.GetLat(),lng: CurrentNode.DijkstraPreviousNode.GetLng() },
                      true);

              }  else if (CurrentEdge.type === "helicopter") {
                  console.log("drawing air helicopter route...");
                  console.log("helicopter: " + this.EstHelicopterDuration(this.get_edge_distance(CurrentNode.name ,CurrentNode.DijkstraPreviousNode.name)));
                  //this.DijkstraDuration = this.DijkstraDuration + this.EstHelicopterDuration(this.get_edge_distance(CurrentNode.name ,CurrentNode.DijkstraPreviousNode.name)) ;
                 this.DrawFlightPath(
                      {lat: CurrentNode.GetLat(),lng: CurrentNode.GetLng() },
                      {lat: CurrentNode.DijkstraPreviousNode.GetLat(),lng: CurrentNode.DijkstraPreviousNode.GetLng() },
                      true);
              }
              //console.log("this.DijkstraDuration: " + (this.DijkstraDuration) );
              CurrentNode = CurrentNode.DijkstraPreviousNode;
          }


          //map.setCenter({lat: 50.856499293272854, lng: -87.89515385691308});
          this.Data.map.setZoom(3);
          //console.log("this.DijkstraDuration:" + this.DijkstraDuration);
          //document.getElementById("txtDist").value = (this.DijkstraDuration)/60 /60  ;
          console.log("Done Drawing Dijkstra");
          return true;
      }
     requestDirections(start, end ) {
         var google;
        this.directionsService.route({
            origin: start,
            destination: end,
            travelMode: google.maps.DirectionsTravelMode.DRIVING
        }, function(result) {
            this.renderDirections(result);
        });
    }
  renderDirections(result) {
      let directionsRenderer = new google.maps.DirectionsRenderer({suppressMarkers: true});

      directionsRenderer.setMap(this.Data.map);
      directionsRenderer.setDirections(result);
  }
       DrawFlightPath (a,b, SolidLine = false) {
        let flightPlanCoordinates = [a,b];
        console.log(flightPlanCoordinates);
        // Define a symbol using SVG path notation, with an opacity of 1.
        let lineSymbol = { // Define a symbol using SVG path notation, with an opacity of 1.
            path: 'M 0,-1 0, 1',
            strokeOpacity: 1,
            scale: 1.5
        };

        let flightPath = null;
        //console.log("AA");
        if (SolidLine === true) {
            flightPath = new google.maps.Polyline({
                path: flightPlanCoordinates,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
            });
        } else {
            flightPath = new google.maps.Polyline({
                path: flightPlanCoordinates,
                geodesic: true,
                strokeOpacity: 0,
                icons: [{
                    icon: lineSymbol,
                    offset: '0',
                    repeat: '10px'
                }],
                map: this.Data.map
            });
        }
        //console.log("XX");
        flightPath.setMap(this.Data.map);
        //console.log("ZZ");
    }

        EstPlaneDuration(distance) {
            //console.log("calling EstPlaneDuration");
            //console.log("distance: " + distance);
            let x = distance;
            let calc =   (9.901e-08 *(x**2)) + (0.002161 *x) + 0.1569;
            //console.log("plane calc: " + calc + " for distance: " + distance);
            return (calc);
        }
  
        EstHelicopterDuration(distance) {
            //console.log("calling EstHelicopterDuration");
            //console.log("distance: " + distance);
            let x = distance;
            let calc = (1.377e-06 *(x**2)) +(  0.003636*x) + 0.09594;
            //console.log("heli calc: " + calc);
            return (calc);
        }
  
        EstDrivingDuration(distance) {
            //console.log("calling EstDrivingDuration");
            //console.log("distance: " + distance);
            let x = distance;
            let calc;
            calc = ((0.04043 * x + 184.5)/60) /1.4;
            //console.log("driving calc: " + calc);
            return (calc);
  
        }
  
        BuildGraph() {
            console.log("Building Graph....");
            console.log("Adding Nodes");
            this.AddNodes();
             
            console.log("Adding Edges");
            this.AddEdges();
            console.log("Done Building Graph.");
  
            //console.log(this.Nodes.length);
            return true;
        }
  
        ResetGraph() {
            this.StartLocation = null;
            this.DestinationLocation = null;
  
            this.A_Star_results = null;
            this.Results_arr = [];
            this.iterator_obj = null;
  
            this.nodeIDCounter = 0;
            this.edgeIDCounter = 0;
            this.Nodes = [];
            this.Edges = [];
        }
  
  
        AddNodes() {
            console.log("--------------------------------------------");
            console.log("called AddNodes()");
            this.nodeIDCounter = 0;
            this.Nodes=[];
            // ADD NODES ********************************************************************
            for (let i = 0; i < this.Data.AllMedicalCenters.length; i++){
                //console.log(this.Data.AllMedicalCenters[i].id);
                this.AddNode(this.Data.AllMedicalCenters[i].id);
                this.GetNode(this.Data.AllMedicalCenters[i].id).SetLatLng(this.Data.AllMedicalCenters[i].lat, this.Data.AllMedicalCenters[i].lng);
                this.GetNode(this.Data.AllMedicalCenters[i].id).road = true;
                this.GetNode(this.Data.AllMedicalCenters[i].id).helipad = false;
                this.GetNode(this.Data.AllMedicalCenters[i].id).airport = false;
                this.GetNode(this.Data.AllMedicalCenters[i].id).airport = false;
                if(this.Data.AllMedicalCenters[i].bTelestroke==true)
                {
                  this.GetNode(this.Data.AllMedicalCenters[i].id).telestroke = true;
                }
                else{
                  this.GetNode(this.Data.AllMedicalCenters[i].id).telestroke = false;
                }

                if(this.Data.AllMedicalCenters[i].bRegionalStrokeCentre==true)
                {
                  this.GetNode(this.Data.AllMedicalCenters[i].id).evt = true;
                }
                else{
                  this.GetNode(this.Data.AllMedicalCenters[i].id).evt = false;
                }
            }
  
            // TODO: database should have 'ident' properties changed to 'id' properties
            for (let i = 0; i < this.Data.AllLandingSites.length; i++){
                //console.log("i:" + i);
                //console.log(this.Data.AllLandingSites[i] );
                this.AddNode(this.Data.AllLandingSites[i].ident);
                this.GetNode(this.Data.AllLandingSites[i].ident).SetLatLng(this.Data.AllLandingSites[i].lat, this.Data.AllLandingSites[i].lng);
                if (this.Data.AllLandingSites[i].type.toUpperCase() === "HELIPAD") {
                    this.GetNode(this.Data.AllLandingSites[i].ident).road = true;
                    this.GetNode(this.Data.AllLandingSites[i].ident).airport = false;
                    this.GetNode(this.Data.AllLandingSites[i].ident).helipad = true;
                }
                else if (this.Data.AllLandingSites[i].type.toUpperCase() === "AIRPORT") {
                    this.GetNode(this.Data.AllLandingSites[i].ident).road = true;
                    this.GetNode(this.Data.AllLandingSites[i].ident).airport = true;
                    this.GetNode(this.Data.AllLandingSites[i].ident).helipad = true;
                }
                else {
                    console.log("ERROR!! SHOULD NEVER SEE THIS!..!  ---->  " + this.Data.AllLandingSites[i].type);
                }
            }
            console.log("Total number of Nodes: " + this.Nodes.length);
            console.log(this.Nodes);
            console.log("Done adding Nodes to Graph");
            console.log("--------------------------------------------");
            this.Data.nodes=this.Nodes;
        }
  
        AddEdges() {
            console.log("--------------------------------------------");
            console.log("called AddEdges()");
            console.log(this.Data.AllLandingSites);
            console.log(this.Data.AllLandingSites.length);
            this.edgeIDCounter = 0;
            this.Edges=[];
            
            // ADD EDGES********************************************************************
            for (let i = 0; i < this.Data.AllLandingSites.length-1; i++) {
                for (let j = i+1; j < this.Data.AllLandingSites.length; j++) {
                    //console.log(i + " " + j);
                    let HavDist =  HaversineDistance(  // HANDLE HELICOPTERS
                        [this.Data.AllLandingSites[i].lat, this.Data.AllLandingSites[i].lng],
                        [this.Data.AllLandingSites[j].lat, this.Data.AllLandingSites[j].lng]
                    );
  
  
                    // All landing sites are connected by helicopter edges....  only airports can handle planes...
                    this.add_edge(this.Data.AllLandingSites[i].ident, this.Data.AllLandingSites[j].ident,
                        HavDist,
                        this.EstHelicopterDuration(HavDist),
                        "helicopter");
  
                    if (this.Data.AllLandingSites[i].type.toUpperCase === "AIRPORT" && this.Data.AllLandingSites[j].type.toUpperCase === "AIRPORT") {
                        this.add_edge(this.Data.AllLandingSites[i].ident, this.Data.AllLandingSites[j].ident,
                            HavDist,
                            this.EstPlaneDuration(HavDist),
                            "plane");
                    }
                }
            }
   
            console.log("Next, the driving data from Google:");
            console.log(" this.Data.AllDrivingData: ");
            console.log(this.Data.AllDrivingData);
            for (let i = 0; i < this.Data.AllDrivingData.length-1; i++){
              //console.log(this.Data.AllDrivingData[i].from + "  --  " + this.Data.AllDrivingData[i].to);
    
                //console.log ("From: " + this.Data.AllDrivingData[i].from + ", To: " + this.Data.AllDrivingData[i].to + ", Distance: " + this.Data.AllDrivingData[i].distanceMetres + ", Duration: " + this.Data.AllDrivingData[i].durationSeconds);
  
                this.add_edge(this.Data.AllDrivingData[i].from, this.Data.AllDrivingData[i].to,
                    this.Data.AllDrivingData[i].distanceMetres,
                    this.Data.AllDrivingData[i].durationSeconds,
                    "road")
            }
            this.Data.edges=this.Edges;
            console.log("Done adding Edges");
            console.log("--------------------------------------------");
        }
  
        SetHForAllNodes(){
            for (let i = 0; i < this.Nodes.length; i++){
                this.Nodes[i].SetH(HaversineDistance(
                    [this.Nodes[i].lat,this.Nodes[i].lng],
                    [this.DestinationNode.lat, this.DestinationNode.lng])
                );
            }
        }
  
        SetStartAndDestination(s,d){
            this.StartNode = this.GetNode(s);
            this.DestinationNode = this.GetNode(d);
  
            this.SetHForAllNodes();
        }
  
  
        BuildMedList() {
            let t = [];
            for (let i = 0; i < 30 ; i++ ) {
                for (let j = i+1; j < 31; j++) {
                    t.push([this.Data.AllMedicalCenters[i], this.Data.AllMedicalCenters[j]]);
  
                }
            }
            console.log(t);
            console.log(JSON.stringify(t));
            return  ;
        }
   
        Dijkstra(start ) { // DO NOT TOUCH... IT WORKS
            console.log("Starting Dijkstra Shortest Path Finding Algorithm");
            console.log("Starting Node: " + start);
            console.log(this.Nodes);
  
            //console.log(end);
  
            this.StartNode = this.GetNode(start);
            //this.DestinationNode = this.GetNode(end);
  
  
          //  let end = "MED_UPSALA";
          //  let start = "MED_TBRHSC";
  
            let StartNode = this.GetNode(start);
            //let EndNode = this.GetNode(end);
  
            let visited = [];
            let unvisited = [];
  
            console.log("Start Node:");
            console.log (this.StartNode);
            //console.log("Destination Node: " ) ;
            //console.log (EndNode);
  
            for (let i = 0; i < this.Nodes.length; i++){
                this.Nodes[i].DijkstraDurationFromStart = Number.POSITIVE_INFINITY;
                unvisited.push(this.Nodes[i]);
            }
            
            this.StartNode.DijkstraDurationFromStart = 0;
            //unvisited.sortBy("DijkstraDurationFromStart");
  
            //let NodesToCheck = this.neighbors(this.StartNode);
            //console.log(NodesToCheck);
  
            //unvisited.push (this.StartNode);
  
            while (unvisited.length > 0 ) {
              //  console.log("--- --- --- ------------");
  
              
                let currentNode =  unvisited.Min("DijkstraDurationFromStart"); // sort to find shortest duration
               
              //  console.log("currentNode:");
               // console.log(currentNode);
  
                unvisited = unvisited.filter(function(item) {
                    return item !== currentNode
                });
  
                let CurNodesNeighbours = this.neighbors(currentNode); // find neighbours of this node
  
                for (let i = 0; i < visited.length; i++) {
                    CurNodesNeighbours = CurNodesNeighbours.filter(function(item) {
                        return item !== visited[i]
                    });
                }
               // console.log("CurNodesNeighbours:");
               // console.log(CurNodesNeighbours);
  
                for (let i = 0; i < CurNodesNeighbours.length; i++) { // for each neighbour...
                   // console.log("CurNodesNeighbours:");
                   // console.log(CurNodesNeighbours[i]);
                    let tempCurNodeToNeighbourDist = currentNode.DijkstraDurationFromStart + this.get_edge_duration(currentNode,CurNodesNeighbours[i]); //... calculate the distance
                    if (tempCurNodeToNeighbourDist < CurNodesNeighbours[i].DijkstraDurationFromStart  ){
                        CurNodesNeighbours[i].DijkstraDurationFromStart = tempCurNodeToNeighbourDist;
                        CurNodesNeighbours[i].DijkstraPreviousNode = currentNode;
                    }
  
                }
  
                visited.push(currentNode);
  
               // console.log("unvisited:" ) ;
               // console.log(unvisited);
  
            }
   
            //console.log("EndNode:");
            //console.log(EndNode);
            //console.log("StartNode:");
            //console.log(StartNode);
        }
   
   
        GetNode (y) {
            return this.Nodes[this.Nodes.findIndex(x => x.name === y)];
        }
  
        adjacent (x, y) {  //: tests whether there is an edge from the vertex x to the vertex y;
            for (let i = 0; i < this.Edges.length; i++){
                if ((this.Edges[i].endNodes[0] === x && this.Edges[i].endNodes[1] === y ) ||
                    (this.Edges[i].endNodes[0] === y && this.Edges[i].endNodes[1] === x))  {
                    return true;
                }
            }
            return false;
        }
  
        neighborsTEST(x) {  //: lists all vertices y such that there is an edge from the vertex x to the vertex y;
            //console.log("In Neighbors(x):");
            // console.log(x.name);
            let temp = [];
            for (let i = 0; i < this.Edges.length; i++){
                // console.log(this.Edges[i].endNodes);
                if (this.Edges[i].endNodes[0] === x) {
                    temp.push(this.Edges[i]);
                }
                else if(this.Edges[i].endNodes[1] === x) {
                    temp.push(this.Edges[i]);
                }
            }
            //console.log ("Neighbors for (" + x.name + ") are: " + temp) ;
            return temp;
        }
  
  
        neighbors(x) {  //: lists all vertices y such that there is an edge from the vertex x to the vertex y;
            //console.log("In Neighbors(x):");
            // console.log(x.name);
            let temp = [];
            for (let i = 0; i < this.Edges.length; i++){
                // console.log(this.Edges[i].endNodes);
                if (this.Edges[i].endNodes[0] === x.name) {
                    temp.push(this.GetNode(this.Edges[i].endNodes[1]));
                }
                else if(this.Edges[i].endNodes[1] === x.name) {
                    temp.push(this.GetNode(this.Edges[i].endNodes[0]));
                }
            }
            //console.log ("Neighbors for (" + x.name + ") are: " + temp) ;
            return temp;
        }
  
        // updateAllFValues(){
        //     for (let i = 0; i < this.Nodes.length; i++) {
        //         this.Nodes[i].GetF();
        //     }
        // }
  
        AddNode(name) {  //: adds the vertex x, if it is not there;
  
            this.nodeIDCounter ++;
            let newNode = new Node( );
            newNode.id = this.nodeIDCounter;
            newNode.name = name;
            newNode.helipad = false;
            newNode.airport = false;
            newNode.road = true;    // by default, everything is connected to the road
            this.Nodes.push (newNode);
        }
  
        removeNodeByName(value){  //removes the vertex x, if it is there;
  
            // data = data.filter(function (item) {
            //     return !(item.id === 1);
            // });
  
            // this.Nodes = this.Nodes.filter(function (item) {
            //     return !(item.id === value)
            // });
            this.Nodes = this.Nodes.filter(function (item) {
                return !(item.name === value)
            });
  
            console.log( "Remove node: " +  value );
  
            // for (let i  = this.Nodes.length-1; i >= 0 ; i--) {
            //     if (this.Nodes[i].id === value || this.Nodes[i].name === value) {
            //         console.log(i & " gggggggggggg " & value);
            //         this.Nodes.splice(i,1);
            //     }
            // }
        }
  
        printNodeNames() {
            console.log("Node Names: ");
            for (let i = 0; i < this.Nodes.length; i++ ) {
                console.log(this.Nodes[i].name  );
            }
        }
  
        printEdges(){
            for (let i = 0; i < this.Edges.length; i++) {
                console.log("From: " + this.Edges[i].endNodes[0] + ", To: " + this.Edges[i].endNodes[1]);
            }
        }
  
        get_edge(x,y) {
            //console.log("Calling get_edge()");
            for (let i = 0; i < this.Edges.length; i++) {
                //console.log(this.Edges[i].endNodes[0].name + " " + this.Edges[i].endNodes[1].name)
                if ((this.Edges[i].endNodes[0] === x && this.Edges[i].endNodes[1] === y) ||
                    (this.Edges[i].endNodes[0] === y && this.Edges[i].endNodes[1] === x)) {
                    return this.Edges[i];
                }
            }
            return false;
        }
  
        // get_total_AStar_distance() {
        //     let total = 0;
        //     for (let i = 0; i < this.RouteNames.length-1; i++) {
        //         //  console.log (this.RouteNames[i] + " " + this.RouteNames[i+1]  + " --> " + this.get_edge_distance(this.RouteNames[i], this.RouteNames[i+1] ) );
        //         total  = total + this.get_edge_distance(this.RouteNames[i], this.RouteNames[i+1] )
        //     }
        //     return total;
        // }
  
        //add_edge( x, y, dist, type){ //adds the edge from the vertex x to the vertex y, if it is not there;
        add_edge( x, y, distance, duration, type){ //adds the edge from the vertex x to the vertex y, if it is not there;
             //console.log("Nodes length " + this.Nodes.length)
            // console.log("x:" + x + " , " + this.Nodes.filter( Node  => (Node.name === x)).length);
             //console.log("y:" + y + " , " + this.Nodes.filter( Node  => (Node.name === y)).length);
            // console.log("Nodes length " + this.Nodes.length)
            //console.log("add_edge()... From: " + x + ", To: " + y + ", Dist: " + dist);
  
            if (this.Nodes.filter( Node  => (Node.name === x)).length > 0 &&
                this.Nodes.filter( Node  => (Node.name === y)).length > 0) { // The two end nodes exist...
  
                if (this.adjacent(x,y) === true) { // There exists an edge between these nodes, update that edge...
                    let t = this.get_edge(x,y);
  
                    if (duration < t.duration) {
                      //  console.log("New Lowest duration for this edge. Updating duration");
                        t.duration = duration;
                        t.distance = distance;
                        t.type = type;
                    } else {
                    //    console.log(" ");
                        // do nothing...
                    }
  
                } else { // There is no edge, create a new edge...
  
                    let newEdge = new Edge();
  
                    this.edgeIDCounter++;
                    newEdge.id = this.edgeIDCounter;
  
                    newEdge.type = type;
                    newEdge.endNodes.push(x);
                    newEdge.endNodes.push(y);
                    newEdge.distance = distance;
                    newEdge.duration = duration;
  
                    this.Edges.push (newEdge);
  
                }
  
            } else {
  
                console.log("Node(s) not found. Can not add edge between them.");
                console.log("X: " + x + ", Y: " + y);
            }
        }
  
        remove_edge(x, y) {//: removes the edge from the vertex x to the vertex y, if it is there;
            for (let i = this.Edges.length-1; i > 0; i--){
                if ((this.Edges[i].endNodes[0] === x && this.Edges[i].endNodes[1] === y) ||
                    (this.Edges[i].endNodes[0] === y && this.Edges[i].endNodes[1] === x)) {
                    this.Edges.splice(i, 1);
                }
            }
        }
  
        get_edge_distance(x,y) {
            //console.log("Calling get_edge_distance()");
            let minDist = -1;
            for (let i = 0; i < this.Edges.length; i++) {
                //console.log(this.Edges[i].endNodes[0].name + " " + this.Edges[i].endNodes[1].name)
                if ((this.Edges[i].endNodes[0] === x && this.Edges[i].endNodes[1] === y) ||
                    (this.Edges[i].endNodes[0] === y && this.Edges[i].endNodes[1] === x)) {
                    if (minDist < 0) {
                        minDist = this.Edges[i].distance;
                    } else {
                        if (minDist > this.Edges[i].distance) {
                            minDist = this.Edges[i].distance;
                        }
                    }
                }
            }
            if (minDist === -1) {
                return false;
            } else {
                return minDist;
            }
  
        }
  
        set_edge_distance(x, y, d) {// sets the value associated with the edge (x, y) to v.
            console.log("Calling set_edge_distance()");
            for (let i = 0; i < this.Edges.length-1; i++) {
                //console.log(this.Edges[i].endNodes[0].name + " " + this.Edges[i].endNodes[1].name)
                if ((this.Edges[i].endNodes[0] === x && this.Edges[i].endNodes[1] === y) ||
                    (this.Edges[i].endNodes[0] === y && this.Edges[i].endNodes[1] === x)) {
                    this.Edges[i].distance = d;
                    console.log("Edge distance changed");
                    return;
                }
            }
            console.log("No Edge found. No change made");
            return false;
        }
  
        get_edge_duration(x,y) {
            // console.log("Calling get_edge_duration()");
            for (let i = 0; i < this.Edges.length; i++) {
                //console.log(this.Edges[i].endNodes[0].name + " " + this.Edges[i].endNodes[1].name)
                if ((this.Edges[i].endNodes[0] === x.name && this.Edges[i].endNodes[1] === y.name) ||
                    (this.Edges[i].endNodes[0] === y.name && this.Edges[i].endNodes[1] === x.name)) {
                    return this.Edges[i].duration;
  
                }
            }
            return false;
        }
        set_edge_duration(x, y, t) {// sets the value associated with the edge (x, y) to v.
            // console.log("Calling set_edge_duration()");
            for (let i = 0; i < this.Edges.length; i++) {
                //console.log(this.Edges[i].endNodes[0].name + " " + this.Edges[i].endNodes[1].name)
                if ((this.Edges[i].endNodes[0] === x && this.Edges[i].endNodes[1] === y) ||
                    (this.Edges[i].endNodes[0] === y && this.Edges[i].endNodes[1] === x)) {
                    this.Edges[i].duration = t;
                    // console.log("Edge duration changed.");
                    return;
                }
            }
            console.log("No Edge found. No change made.");
            return false;
        }
  
        get_edge_type(x,y) {
            console.log("Calling get_edge_type()");
            for (let i = 0; i < this.Edges.length-1; i++) {
                //console.log(this.Edges[i].endNodes[0].name + " " + this.Edges[i].endNodes[1].name)
                if ((this.Edges[i].endNodes[0] === x && this.Edges[i].endNodes[1] === y) ||
                    (this.Edges[i].endNodes[0] === y && this.Edges[i].endNodes[1] === x)) {
                    return this.Edges[i].type;
                }
            }
            return false;
        }
        set_edge_type(x, y, t) {// sets the value associated with the edge (x, y) to v.
            console.log("Calling set_edge_type()");
            for (let i = 0; i < this.Edges.length-1; i++) {
                //console.log(this.Edges[i].endNodes[0].name + " " + this.Edges[i].endNodes[1].name)
                if ((this.Edges[i].endNodes[0] === x && this.Edges[i].endNodes[1] === y) ||
                    (this.Edges[i].endNodes[0] === y && this.Edges[i].endNodes[1] === x)) {
                    this.Edges[i].type = t;
                    console.log("Edge type changed.");
                    return;
                }
            }
            console.log("No Edge found. No change made.");
            return false;
        }
  
  
    } // end Graph class
  
  
  
    
  
  
  