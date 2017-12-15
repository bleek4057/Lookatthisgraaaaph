var theData = [];

var svg;
var width = 600;
var height = 600;
var offset = 60;

var g;

function loadPieChart(mCountMin, mCountMax, sort){
    
    var dic = [];
    var radius = Math.min(width, height) / 2;
    var pie;
    var color = d3.scaleOrdinal(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
    var arc;
    var path;
    var label = d3.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);
    var grandMasters =[];
    var gmSelect
    var tooltip = d3.select("body").append("div").attr("class", "toolTip");
    
    for(let i=0;i<theData.length;i++){
            if(!grandMasters.includes(theData[i].White))
                grandMasters.push(theData[i].White)
            if(!grandMasters.includes(theData[i].Black))
                grandMasters.push(theData[i].Black)
        
    }
    console.log(grandMasters)
    grandMasters.sort();
    grandMasters.shift();
    for(let i=0;i<grandMasters.length;i++){
        gmSelect = document.getElementById("gmSelect");
        let option = document.createElement("option");
        option.text=grandMasters[i];
        gmSelect.add(option);
    }

    var dic = [];
    
    if(sort == 1){ //common opening moves
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
    }

    if(sort == 2){ //Wins by Color
        for(let i = 0; i < theData.length; i++){
            //for(let j = 0; j < theData[i].moves.length && j >= mCountMin && j < mCountMax; j++){
                let n = true;
                for(let k = 0; k < dic.length; k++){
                    if(dic[k].label == theData[i].Result){ 
                        dic[k].value++; 
                        n = false;
                        break;
                    }
                }
                if(n){
                    dic.push({"label": theData[i].Result, "value" : 1});
                }
            //}
        }
    }
    if(sort == 3){
        let selectedGM = gmSelect.options[gmSelect.selectedIndex].text;
        dic.push({"label": "White Win", "value" : 0});
        dic.push({"label": "Black Win", "value" : 0});
        dic.push({"label": "Tie", "value" : 0});
        //console.log(dic)
        //console.log(gmSelect.options[gmSelect.selectedIndex].text)
        for(let i = 0; i < theData.length; i++){
            if(theData[i].White==selectedGM&&theData[i].Result=="1-0"){
                dic[0].value+=1;
                
                //dic[0]
            }
            if(theData[i].Black==selectedGM&&theData[i].Result=="0-1"){
                dic[1].value+=1;
                
                //dic[0]
            }
            if((theData[i].White==selectedGM || theData[i].Black==selectedGM)&&theData[i].Result=="1/2-1/2"){
                dic[2].value+=1;
                
                //dic[0]
            }
        }
    }
    console.log(dic)
    //console.log(dic);
    
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
          .attr("fill", function(d, i) { return color(i%7) })
          .on("mousemove", function(d){
            tooltip
            .style("left", d3.event.pageX - 50 + "px")
            .style("top", d3.event.pageY - 70 + "px")
            .style("display", "inline-block")
            .style("position", "absolute")
            .style("min-width", "80px")
            .style("height", "auto")
            .style("background", "none repeat scroll 0 0 #ffffff")
            .style("padding", "14px")
            .style("text-align", "center")
            //Math.round(price / listprice * 100) / 100;
            .html(function() { 
                if(sort == 1) {
                    return d.data.label + " : " + d.data.value;
                }
                else if(sort == 2){
                    let temp = "";
                    console.log(d.data.label)
                    switch(d.data.label){
                        case "1-0":temp="WHITE";break;
                        case "0-1":temp="BLACK";break;
                        case "1/2-1/2":temp="TIE";break;
                        default :temp="N/A";break;
                    }
                    return temp + ":" + d.data.value
                }
            });
            //.html(d.move + ", Wins: " + (d.win) + ", Losses:" + (d.loss) + ", Draws: " + (d.draw));
            })
            .on("mouseout", function(d){ tooltip.style("display", "none");});

      arc.append("text") //text for each wedge
          .attr("transform", function(d) { 
            var midAngle = d.endAngle < Math.PI ? d.startAngle/2 + d.endAngle/2 : d.startAngle/2  + d.endAngle/2 + Math.PI ;
            return "translate(" + label.centroid(d)[0] + "," + label.centroid(d)[1] + ") rotate(-90) rotate(" + (midAngle * 180/Math.PI) + ")"; })
          .attr("dy", ".35em")
          .attr('text-anchor','middle')
          .text(function(d) { 
            if(sort == 1 && d.data.value >= 1000) { //common openings
                return d.data.label + " : " + d.data.value;
            }
            else if(sort ==2){ //wins
                let temp = "";
                console.log(d.data.label)
                switch(d.data.label){
                    case "1-0":temp="WHITE";break;
                    case "0-1":temp="BLACK";break;
                    case "1/2-1/2":temp="TIE";break;
                    default :temp="N/A";break;
                }
                return temp + ":" + d.data.value
            }
            else if(sort ==3){
                return d.data.label + " : " + d.data.value;
            }
          });
    
    svg.append("text") // title
        .attr("x", 5)
        .attr("y", 20)
        .attr("id", "xAxisText")
        .style("text-anchor", "left")
        .text((d)=>{
            if(sort==1)return "Common Opening Moves"
            if(sort==2)return "Wins By Color"

        });
    if(sort == 1){
        document.getElementById("gInfo").textContent = "This pie chart displays common opening moves that Grandmaster Chess players have used during tournaments. It looks at the first 4 turns that were made during a game and displays the number of times a move was used. This graph would help other Chess players improve because it would show them what opening Grandmasters use to play their games.";
    }
    else if( sort == 2){
        document.getElementById("gInfo").textContent = "This pie chart simply shows what side wins most often. As you can see, at a grandmaster level, it is very benefical to be white and go first. But, also at a grandmaster level, most games end in a tie";
    }
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
    
    var tooltip = d3.select("body").append("div").attr("class", "toolTip");
    
    let maxNum = 0;
    for (let i = 0; i < 8; i++) {
         for (let j = 0; j < 8; j++) {
            if(board[i][j] > maxNum){maxNum = board[i][j]};//determine max, make this better

             let rectangle = g.append("rect")
                             .attr("width", (width/8))
                             .attr("height", (height/8))
                             .attr("x", ((width * i)/8) - (width/2))
                             .attr("y", ((height * j)/8) - (height/2))
                             .attr("fill",returnBoardColor(i,j))
                             .on("mousemove", function(d){
                                              tooltip
                                .style("left", d3.event.pageX - 50 + "px")
                                .style("top", d3.event.pageY - 70 + "px")
                                .style("display", "inline-block")
                                .style("position", "absolute")
                                .style("min-width", "80px")
                                .style("height", "auto")
                                .style("background", "none repeat scroll 0 0 #ffffff")
                                .style("padding", "14px")
                                .style("text-align", "center")
                                .html(board[i][j] + " moves");
                          })
                          .on("mouseout", function(d){ tooltip.style("display", "none");});
             
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
                             .attr("fill","rgba(255,0,0,.75)")
                             .on("mousemove", function(d){
                                              tooltip
                                .style("left", d3.event.pageX - 50 + "px")
                                .style("top", d3.event.pageY - 70 + "px")
                                .style("display", "inline-block")
                                .style("position", "absolute")
                                .style("min-width", "80px")
                                .style("height", "auto")
                                .style("background", "none repeat scroll 0 0 #ffffff")
                                .style("padding", "14px")
                                .style("text-align", "center")
                                .html(board[i][j] + " moves");
                          })
                          .on("mouseout", function(d){ tooltip.style("display", "none");});
                             
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
    
    document.getElementById("gInfo").textContent = "This Heatmap displays what locations on the board pieces from both sides move to the most often during the openning moves of chess games. This would help chess player determine what spots they should either move to get get an advantage.";
    
}

function returnBoardColor(x, y){
    if((x%2 == 0 && y%2 ==0) || (x%2 == 1 && y%2 == 1)){return "rgba(255,255,255,1)";}//white
    else {return "rgba(0,0,0,1)";}//black
}

function loadBarGraph(movesShown){
    //console.log(data);
    //var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 80},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;
  
    var tooltip = d3.select("body").append("div").attr("class", "toolTip");
  
    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleBand().range([height, 0]);

    var g = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        //[move, numMoves, wins, losses, draws]  loss = -1, draw = 0, win = 1
        var dic = [];

        //win, loss, draw
        //var wins = 0; var losses = 0; var draws = 0;

        //Find every game in which this move was used
        for(let i = 0; i < theData.length; i++){
            for(let j = 0; j < theData[i].moves.length; j++){
                let n = true;
                for(let k = 0; k < dic.length; k++){
                    if(dic[k].move == theData[i].moves[j]){
                        dic[k].count++;
                        //console.log("Win: " + data[i].Result);
                        if(theData[i].Result === "0-1"){
                            //console.log(data[i].moves[j] + " 0-1");
                            //win = true;
                            dic[k].win++;
                            //wins++;
                        }else if(theData[i].Result === "1-0"){
                            //console.log(data[i].moves[j] + " 1-0");
                            //loss = true;
                            dic[k].loss++;
                            //losses++;
                        }else if(theData[i].Result === "1/2-1/2"){
                            //console.log(data[i].moves[j] + " 1/2-1/2");
                            //draw = true;
                            dic[k].draw++;
                            //draws++;
                        }

                        //console.log(data[i].moves[j] + " , " + data[i].Result + ", win: " + win);
                        n = false;
                        break;
                    }
                }
                if(n){
                    dic.push({"move": theData[i].moves[j], "count" : 1, "win" : 1, "loss" : 1, "draw" : 1});
                }
            }
        }

    //console.log("wins: " + wins + ", losses: " + losses + ", draws: " + draws );
    dic.sort(function(a, b) { return b.count - a.count; });
    
    /*for(var i = 0; i < 20; i++){
        console.log(dic[i]);
    }*/

    var splicedDic = [];
    spicedDic = dic.splice(0, 20);
    //console.log(spicedDic.length);


    //var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleBand()
        .rangeRound([0, width])
        .paddingInner(0.05)
        .align(0.1);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    var z = d3.scaleOrdinal()
        //Wins, losses, draws
        .range(["#CCCCCC", "#222222", "#797979"]);

      //for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
      
     // if (error) throw error;

    var keys = ["win", "loss", "draw"];

    //data.sort(function(a, b) { return b.total - a.total; });
    x.domain(spicedDic.map(function(d) { return d.move; }));
    y.domain([0, d3.max(spicedDic, function(d) { return d.count; })]); /*.nice();*/
    z.domain(keys);

    g.append("g")
      .selectAll("g")
      .data(d3.stack().keys(keys)(spicedDic))
      .enter().append("g")
        .attr("fill", function(d) { return z(d.key); })
      .selectAll("rect")
      .data(function(d) { return d; })

      .enter().append("rect")
        .attr("x", function(d) { return x(d.data.move); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("width", x.bandwidth())
        
        .on("mousemove", function(d){
              tooltip
                .style("left", d3.event.pageX - 50 + "px")
                .style("top", d3.event.pageY - 70 + "px")
                .style("display", "inline-block")
                .style("position", "absolute")
                .style("min-width", "80px")
                .style("height", "auto")
                .style("background", "none repeat scroll 0 0 #ffffff")
                .style("padding", "14px")
                .style("text-align", "center")
                //Math.round(price / listprice * 100) / 100;
                .html(d.data.move + ", Wins: " + (Math.round(d.data.win / d.data.count * 100)) + "%, Losses: " + (Math.round(d.data.loss / d.data.count * 100)) + "%, Draws: " + (Math.round(d.data.draw / d.data.count * 100)) + "%");
                //.html(d.move + ", Wins: " + (d.win) + ", Losses:" + (d.loss) + ", Draws: " + (d.draw));
          })
          .on("mouseout", function(d){ tooltip.style("display", "none");})

    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis");
    
    document.getElementById("gInfo").textContent = "This bar graph shows the most common moves made by grandmasters and the percentage of games containing those moves that were wins, losses or draws. This provides an interesting look into what moves are the most common and successful.";
    
}


function loadGraph(){
    
    svg.remove("g");
    svg = d3.select("body").append("svg")
        .attr("width", width + offset)
        .attr("height", height  + offset)
        .style('border', '1px solid');
    g = svg.append("g").attr("transform", "translate(" + (width + offset) / 2 + "," + (height + offset) / 2 + ")");
    
    let radios = document.getElementsByName("radio");
    
    for (var i = 0, length = radios.length; i < length; i++)
    {
         if (radios[i].checked)
         {
            switch(radios[i].value){
               case "pie1":
                    loadPieChart(0,6,1);
                    break;
               case "pie2":
                    loadPieChart(0,6,2);
                    break;
               case "pie3":
                    loadPieChart(0,6,3);
                    break;
               case "heat":
                    loadHeatMap(0, 8);
                    break;
               case "bar":
                    loadBarGraph(20);
                    break;
               default:
                    break;
               }
          // only one radio can be logically checked, don't check the rest
          break;
         }
    }
    
    
}

function readData(){
    d3.json("GMallboth.json", function(data){
        theData = data;
        //console.log(theData);
        //loadPieChart(0,6);
        //loadHeatMap(0, 2);
        //loadBarGraph(20, theData);
        loadGraph();
        
    });
}

window.onload = function(){
    svg = d3.select("body").append("svg")
        .attr("width", width + offset)
        .attr("height", height  + offset)
        .style('id', 'graphs')
        .style('stroke','0');
    g = svg.append("g").attr("transform", "translate(" + (width + offset) / 2 + "," + (height + offset) / 2 + ")");
    document.getElementById("radioForm").onclick = function(){loadGraph();};
    readData(); 
};