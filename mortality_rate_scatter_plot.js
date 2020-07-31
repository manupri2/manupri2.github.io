function showMortalityRateScatterPlot() {
    document.getElementById("my_dataviz").innerHTML = "";
    var scatterplot = document.getElementById('scatterplot');
    scatterplot.className = 'inactive';
    var maptab = document.getElementById('maptab');
    maptab.className = 'active';
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
    d3.csv("https://raw.githubusercontent.com/manupri2/manupri2.github.io/master/07-19-2020.csv", function (data) {

        // Add X axis
        var x = d3.scaleLinear()
            .domain([0, 24])
            .range([0, width - 200]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, 10])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Color scale: give me a specie name, I return a color
        var color = d3.scaleLinear()
            .domain([0, 10])
            .range(["#aff05b", "#900c00"]);

        var colorScale = d3.scaleSequential(d3.interpolateRainbow)
            .domain([0, 10]);

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

        // A function that change this tooltip when the user hover a point.
        // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
        var mouseover = function (d) {
            tooltip
                .transition()
                .duration(200)
                .style("opacity", 1)
        };

        var mousemove = function (d) {
            tooltip
                .html("<b>State: </b>" + d.Province_State + "<br><b>Mortality Rate: </b>" + Math.round(d.Mortality_Rate * 10) / 10 + "<br><b>Hospitalization Rate: </b>" + Math.round(d.Hospitalization_Rate * 10) / 10)
                .style("left", (d3.event.pageX) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
                .style("top", (d3.event.pageY) + "px")
                .style("display", "inline-block")
        };

        // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
        var mouseleave = function (d) {
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
                return x(d.Hospitalization_Rate);
            })
            .attr("cy", function (d) {
                return y(d.Mortality_Rate);
            })
            .attr("r", function (d) {
                console.log(d.Hospitalization_Rate);
                return d.Hospitalization_Rate === "" ? 0 : 5;
            })
            .style('fill', function (d) {
                return color(d.Mortality_Rate);
            })
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);
        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width - 200)
            .attr("y", height - 6)
            .text("Hospitalization Rate");
        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", 6)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text("Mortality Rate");
        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .attr("font-weight", 700)
            .text("Mortality Rate vs Hospitalization Rate");
        svg.append("text")
            .attr("x", 230)
            .attr("y", 510)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "bold")
            .text("Mortality Rate- Number recorded deaths * 100/ Number confirmed cases.");
        svg.append("text")
            .attr("x", 290)
            .attr("y", 530)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "bold")
            .text("Hospitalization Rate - Total number of people hospitalized * 100/ Number of confirmed cases");
        svg.append('line')
            .attr("x1", 675)
            .attr("y1", 38)
            .attr("x2", 734)
            .attr("y2", 38)
            // .style("stroke-dasharray", "5,5")//dashed array for line
            .style("stroke", "black");
        svg.append("text")
            .attr("x", 736)
            .attr("y", 42)
            .text("States with higher hospitalization");
        svg.append("text")
            .attr("x", 736)
            .attr("y", 57)
            .text("rates may have higher Mortality");
        svg.append("text")
            .attr("x", 736)
            .attr("y", 72)
            .text("Rates");
        svg.append("text")
            .attr("x", 700)
            .attr("y", 200)
            .attr("text-anchor", "start")
            .style("font-size", "16px")
            .text("Hover Over for details!");

    })
}
