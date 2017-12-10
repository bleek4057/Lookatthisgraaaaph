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

function loadBarGraph(movesShown, data){
    console.log(data);
    var svg = d3.select("svg"),
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
        var wins = 0; var losses = 0; var draws = 0;

        //Find every game in which this move was used
        for(let i = 0; i < data.length; i++){
            for(let j = 0; j < data[i].moves.length; j++){
                let n = true;

                let win = false;
                let loss = false;
                let draw = false;

                for(let k = 0; k < dic.length; k++){
                    if(dic[k].move == data[i].moves[j]){
                        dic[k].count++;
                        //console.log("Win: " + data[i].Result);
                        if(data[i].Result === "0-1"){
                            //console.log(data[i].moves[j] + " 0-1");
                            win = true;
                            dic[k].win++;
                            wins++;
                        }else if(data[i].Result === "1-0"){
                            //console.log(data[i].moves[j] + " 1-0");
                            loss = true;
                            dic[k].loss++;
                            losses++;
                        }else if(data[i].Result === "1/2-1/2"){
                            //console.log(data[i].moves[j] + " 1/2-1/2");
                            draw = true;
                            dic[k].draw++;
                            draws++;
                        }

                        //console.log(data[i].moves[j] + " , " + data[i].Result + ", win: " + win);
                        n = false;
                        break;
                    }
                }
                if(n){
                    dic.push({"move": data[i].moves[j], "count" : 1, "win" : 1, "loss" : 1, "draw" : 1});
                }
            }
        }

    console.log("wins: " + wins + ", losses: " + losses + ", draws: " + draws );
    dic.sort(function(a, b) { return b.count - a.count; });
    
    /*for(var i = 0; i < 20; i++){
        console.log(dic[i]);
    }*/

    var splicedDic = [];
    spicedDic = dic.splice(0, 20);
    console.log(spicedDic.length);


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
        .attr("height", function(d) { console.log(d); /*return y(d.count) - y(d.data.win);*/return y(d[0]) - y(d[1]); })
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

}
function readData(){
    d3.json("GMallboth(5%).json", function(data){
        theData = data;
        /*console.log("HIT")
        console.log(data);
        console.log(theData);*/
        loadBarGraph(20, theData);
        
        
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