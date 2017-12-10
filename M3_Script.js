var theData = [];

var svg;
var width = 600;
var height = 600;
var radius = Math.min(width, height) / 2;
var g;

var pie;

var color = d3.scaleOrdinal(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var arc;

var path;

var label = d3.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);


function loadPieChart(mCountMin, mCountMax){
    
    var dic = [];
    
    for(let i = 0; i < theData.length; i++){
        for(let j = 0; j < theData[i].moves.length && j >= mCountMin && j < mCountMax; j++){
            let n = true;
            for(let k = 0; k < dic.length; k++){
                if(dic[k].label == theData[i].moves[j]){ 
                    dic[k].value++; 
                    n = false;
                    break;
                }
            }
            if(n){
                dic.push({"label": theData[i].moves[j], "value" : 1});
            }
        }
    }
    
    console.log(dic);
    
    //create pie chart
    
     pie = d3.pie()
        .sort(null)
        .value(function(d) { return +d.value; });
    
    arc = g.selectAll(".arc")
        .data(pie(dic))
        .enter().append("g")
          .attr("class", "arc");
    
    path = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(100);
    
      arc.append("path") //shape of wedge
          .attr("d", path)
          .attr("fill", function(d, i) { return color(i%7) });

      arc.append("text") //text for each wedge
          .attr("transform", function(d) { 
            var midAngle = d.endAngle < Math.PI ? d.startAngle/2 + d.endAngle/2 : d.startAngle/2  + d.endAngle/2 + Math.PI ;
            return "translate(" + label.centroid(d)[0] + "," + label.centroid(d)[1] + ") rotate(-90) rotate(" + (midAngle * 180/Math.PI) + ")"; })
          .attr("dy", ".35em")
          .attr('text-anchor','middle')
          .text(function(d) { return d.data.label + " : " + d.data.value; });
    
    svg.append("text") // title
        .attr("x", 5)
        .attr("y", 20)
        .attr("id", "xAxisText")
        .style("text-anchor", "left")
        .text("Common Opening Moves");
}

function loadHeatMap(mCountMin, mCountMax) {
    
    var board = new Array();

    for (let i = 0; i < 8; i++) {//create new board
         board[i] = new Array();
         for (let j = 0; j < 8; j++) {
            board[i][j] = 0;
         }
    }

    
    for(let i = 0; i < theData.length; i++){ //use moves
        for(let j = 0; j < theData[i].moves.length && j >= mCountMin && j < mCountMax; j++){
        
            if(theData[i].moves[j] == "O-O" || theData[i].moves[j] == "O-O-O"){ //castling
                if(theData[i].moves[j] == "O-O" && j%2 == 0){board[0][6]++;} //white castle king side
                else if(theData[i].moves[j] == "O-O" && j%2 == 1){board[7][6]++;}//black castle king side
                else if(theData[i].moves[j] == "O-O-O" && j%2 == 0){board[0][2]++;}//white castle queen side
                else if(theData[i].moves[j] == "O-O-O" && j%2 == 1){board[7][2]++;}//black castle king side
            }
            else{ //normal move
                let xPos = -1;
                let yPos = -1;
                for(let k = 1; k < theData[i].moves[j].length; k++){
                    if(!isNaN(parseInt(theData[i].moves[j].charAt(k)))){ //checks to see if it is a number
                        xPos = theData[i].moves[j].charAt(k-1);
                        yPos = parseInt(theData[i].moves[j].charAt(k));
                        board[yPos][xPos]++;
                        break;
                    }
                }
            }
            
        }
    }
    
}

function readData(){
    d3.json("GMallboth(5%).json", function(data){
        theData = data;
        console.log("HIT")
        console.log(data);
        console.log(theData);
        loadPieChart(0, 8);
        
        
    });
}

window.onload = function(){
    svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .style('border', '1px solid');
    g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    readData(); 
};