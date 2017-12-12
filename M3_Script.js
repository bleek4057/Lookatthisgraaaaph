var theData = [];

var svg;
var width = 600;
var height = 600;
var offset = 60;

var g;


function loadPieChart(mCountMin, mCountMax){
    
    var dic = [];
    var radius = Math.min(width, height) / 2;
    var pie;
    var color = d3.scaleOrdinal(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
    var arc;
    var path;
    var label = d3.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);
    
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
                if(theData[i].moves[j] == "O-O" && j%2 == 0){board[6][0]++;} //white castle king side
                else if(theData[i].moves[j] == "O-O" && j%2 == 1){board[6][7]++;}//black castle king side
                else if(theData[i].moves[j] == "O-O-O" && j%2 == 0){board[2][0]++;}//white castle queen side
                else if(theData[i].moves[j] == "O-O-O" && j%2 == 1){board[2][7]++;}//black castle king side
            }
            else{ //normal move
                let xPos = -1;
                let yPos = -1;
                for(let k = 1; k < theData[i].moves[j].length; k++){
                    if(!isNaN(parseInt(theData[i].moves[j].charAt(k)))){ //checks to see if it is a number
                        xPos = theData[i].moves[j].charCodeAt(k-1)-97;//ascii for a is 97
                        yPos = 7-(parseInt(theData[i].moves[j].charAt(k))-1);
                        board[xPos][yPos]++;
                        break;
                    }
                }
            }
            
        }
    }
    
    //lines
    svg.append("line").attr("x1", offset/2).attr("y1", offset/2).attr("x2", width + offset/2).attr("y2", offset/2).attr("stroke-width", 1).attr("stroke", "black");//top
    svg.append("line").attr("x1", offset/2).attr("y1", height + offset/2).attr("x2", width + offset/2).attr("y2", height + offset/2).attr("stroke-width", 1).attr("stroke", "black");//bottom
    svg.append("line").attr("x1", offset/2).attr("y1", offset/2).attr("x2", offset/2).attr("y2", height + offset/2).attr("stroke-width", 1).attr("stroke", "black");//left
    svg.append("line").attr("x1", width + offset/2).attr("y1", offset/2).attr("x2", width + offset/2).attr("y2", height + offset/2).attr("stroke-width", 1).attr("stroke", "black");//right
    
    let maxNum = 0;
    for (let i = 0; i < 8; i++) {
         for (let j = 0; j < 8; j++) {
            if(board[i][j] > maxNum){maxNum = board[i][j]};//determine max, make this better

             let rectangle = g.append("rect")
                             .attr("width", (width/8))
                             .attr("height", (height/8))
                             .attr("x", ((width * i)/8) - (width/2))
                             .attr("y", ((height * j)/8) - (height/2))
                             .attr("fill",returnBoardColor(i,j));
             
         }
    }
    
    console.log(maxNum);
    console.log(board);
    
    for (let i = 0; i < 8; i++) {//visualize board
         for (let j = 0; j < 8; j++) {
             let w = Math.ceil((width/8) * (board[i][j]/maxNum));
             let h = Math.ceil((height/8) * (board[i][j]/maxNum));
             let x = Math.floor(((width * i)/8) + (((width/8)-w)/2)) - (width/2);
             let y = Math.floor(((height * j)/8) + (((height/8)-h)/2)) - (height/2);
             let rectangle = g.append("rect")
                             .attr("width", w)
                             .attr("height", h)
                             .attr("x", x)
                             .attr("y", y)
                             .attr("fill","rgba(255,0,0,.75)");
         }
    }
    
    //x-axis labels
    for(let i = 8; i >= 1; i--){
        svg.append("text") //  x-axis labels
            .attr("x", ((i*width)/8))
            .attr("y", height + (offset*3/4))
            .attr("id", "xAxisText")
            .style("text-anchor", "left")
            .text(String.fromCharCode(i + 96));
        
        svg.append("text") // y-axis labels
            .attr("x", offset/4)
            .attr("y", (height + offset) - ((i*height)/8))
            .attr("id", "xAxisText")
            .style("text-anchor", "left")
            .text(i);
    }  
}

function returnBoardColor(x, y){
    if((x%2 == 0 && y%2 ==0) || (x%2 == 1 && y%2 == 1)){return "rgba(255,255,255,1)";}//white
    else {return "rgba(0,0,0,1)";}//black
}

function readData(){
    d3.json("GMallboth(5%).json", function(data){
        theData = data;
        //console.log(data);
        console.log(theData);
        //loadPieChart(0, 2);
        loadHeatMap(0, 2);
        
    });
}

window.onload = function(){
    svg = d3.select("body").append("svg")
        .attr("width", width + offset)
        .attr("height", height  + offset)
        .style('border', '1px solid');
    g = svg.append("g").attr("transform", "translate(" + (width + offset) / 2 + "," + (height + offset) / 2 + ")");
    readData(); 
};