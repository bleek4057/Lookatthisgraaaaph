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