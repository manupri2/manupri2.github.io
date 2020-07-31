function showScatterPlot() {
    document.getElementById("my_dataviz").innerHTML = "";
    var scatterplot = document.getElementById('scatterplot');
    scatterplot.className = 'active';
    var maptab = document.getElementById('maptab');
    maptab.className = 'inactive';
    var bartab = document.getElementById('bar');
    bartab.className = 'inactive';

    var margin = {top: 40, right: 30, bottom: 100, left: 50},
        width = 1000 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    //Read the data
    d3.csv("https://raw.githubusercontent.com/manupri2/manupri2.github.io/master/USA-Covid19/07-19-2020.csv", function (data) {

        // Add X axis
        var x = d3.scaleLinear()
            .domain([0, 28000])
            .range([0, width - 200]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, 2200])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Color scale: give me a specie name, I return a color
        var color = d3.scaleLinear()
            .domain([0, 2000])
            .range(["#aff05b", "#900c00"]);

        var colorScale = d3.scaleSequential(d3.interpolateRainbow)
            .domain([0, 2000]);

        // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
        // Its opacity is set to 0: we don't see it by default.
        var tooltip = d3.select("#my_dataviz")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "5px")
            .style('position', 'absolute')
            .style("padding", "10px");

        var previous;

        // A function that change this tooltip when the user hover a point.
        // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
        var mouseover = function (d) {
             previous = d3.select(this).style("fill");
            d3.select(this)
                .style('fill', 'slateblue')
                .attr('r', 10);
            tooltip
                .transition()
                .duration(200)
                .style("opacity", 1);
            tooltip.html("<b>State: </b>" + d.Province_State + "<br><b>Incident Rate: </b>" + parseInt(d.Incident_Rate) + "<br><b>Testing Rate: </b>" + parseInt(d.Testing_Rate))
                .style("left", d + "px")
                .style("top", d + "px")
                .style("display", "inline-block")
        };

        // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
        var mouseleave = function (d) {
            d3.select(this)
                .style("fill", previous)
                .attr('r', 5);
            tooltip
                .transition()
                .duration(500)
                .style("opacity", 0)
        };

        // Add dots
        svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) {
                return x(d.Testing_Rate);
            })
            .attr("cy", function (d) {
                return y(d.Incident_Rate);
            })
            .attr("r", 5)
            .style('fill', function (d) {
                return color(d.Incident_Rate);
            })
            .on("mouseover", mouseover)
            .on("mouseleave", mouseleave)
            .transition() // <---- Here is the transition
            .duration(2000);
        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width - 200)
            .attr("y", height - 6)
            .text("Testing Rate");
        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", 6)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text("Incident Rate");
        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .attr("font-weight", 700)
            .text("Incident Rate vs Testing Rate");
        svg.append("text")
            .attr("x", 160)
            .attr("y", 510)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "bold")
            .text("Incident Rate- confirmed cases per 100,000 persons.");
        svg.append("text")
            .attr("x", 200)
            .attr("y", 530)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "bold")
            .text("Testing Rate - Total number of people tested per 100,000 persons.");
        svg.append('line')
            .attr("x1", 600)
            .attr("y1", 50)
            .attr("x2", 750)
            .attr("y2", 50)
            // .style("stroke-dasharray", "5,5")//dashed array for line
            .style("stroke", "black");
        svg.append("text")
            .attr("x", 756)
            .attr("y", 52)
            .text("Incident Rate is not dependent");
        svg.append("text")
            .attr("x", 756)
            .attr("y", 67)
            .text("on Testing Rate. LA has high ");
        svg.append("text")
            .attr("x", 756)
            .attr("y", 82)
            .text("Incident Rate, and ..");
        svg.append('line')
            .attr("x1", 615)
            .attr("y1", 405)
            .attr("x2", 750)
            .attr("y2", 405)
            // .style("stroke-dasharray", "5,5")//dashed array for line
            .style("stroke", "black");
        svg.append("text")
            .attr("x", 756)
            .attr("y", 407)
            .text(".. AK has low incident rate.");
        svg.append("text")
            .attr("x", 756)
            .attr("y", 422)
            .text(" whereas LA and AK have ");
        svg.append("text")
            .attr("x", 756)
            .attr("y", 437)
            .text("almost same Testing Rate.");
        svg.append("text")
            .attr("x", 756)
            .attr("y", 0)
            .text("Hover Over for details!");

    })
}
