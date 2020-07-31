function showCases() {
    document.getElementById("my_dataviz").innerHTML = "";
    var maptab = document.getElementById('maptab');
    maptab.className = 'inactive';
    var scatterplottab = document.getElementById('scatterplot');
    scatterplottab.className = 'inactive';
    var bartab = document.getElementById('bar');
    bartab.className = 'active';
    // document.getElementById("my_dataviz").innerHTML += "<br><br><label for=\"cases\">Cases:</label><select name=\"cases\" id=\"cases\"><option value=\"Confirmed\">Confirmed Cases</option><option value=\"Deaths\">Number Of Deaths</option><option value=\"Active\">Active Cases</option>";
    var allGroup = ["Confirmed Cases", "Deaths", "Active Cases", "Recovered Cases", "People Tested", "People Hospitalized"];
    var dropDown = d3.select("#my_dataviz")
        .append("select")
        .attr("id", "drop-down")
        .style("margin-top", 20)
        .style("margin-left", 40);
    dropDown.selectAll("option")
        .data(allGroup)
        .enter()
        .append("option")
        .text(function (d) {
            return d;
        })
        .attr("value", function (d) {
            return d;
        });

    showConfirmedCases();
    dropDown.on("change", function (d) {
        // recover the option that has been chosen
        var selectedOption = this.value;
        console.log('Selected option %s' % selectedOption);
        if (selectedOption === "Deaths") {
            showDeaths()
        } else if (selectedOption === "Confirmed Cases") {
            showConfirmedCases()
        } else if (selectedOption === "Active Cases") {
            showActiveCases()
        } else if (selectedOption === "Recovered Cases") {
            showRecoveredCases()
        } else if (selectedOption === "People Tested") {
            showPeopleTested()
        } else if (selectedOption === "People Hospitalized") {
            showPeopleHospitalized()
        }

    });
}

function showDeaths() {
    d3.selectAll("svg").remove();
    // set the dimensions and margins of the graph
    var margin = {top: 40, right: 30, bottom: 150, left: 65},
        width = 1000 - margin.left - margin.right,
        height = 650 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

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
        tooltip.html("<strong>State: </strong>" + d.Province_State + "<br><strong>Deaths: </strong>" + d.Deaths + "<br><strong>Confirmed: </strong>" + d.Confirmed
            + "<br><strong>Active: </strong>" + parseInt(d.Active))
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

    // Parse the Data
    d3.csv("https://raw.githubusercontent.com/manupri2/manupri2.github.io/master/USA-Covid19/07-19-2020.csv", function (error, data) {
        if (error) throw error;

        data.sort(function (a, b) {
            return b.Deaths - a.Deaths;
        });
        // X axis
        var x = d3.scaleBand()
            .range([0, width])
            .domain(data.map(function (d) {
                return d.Deaths === "" ? null : d.Province_State;
            }))
            .padding(0.2);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

// Add Y axis
        var y = d3.scaleLinear()
            .domain([0, 35000])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        //color
        var color = d3.scaleLinear()
            .domain([0, 35000])
            .range(["#aff05b", "#900c00"]);

        // Bars
        svg.selectAll("mybar")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", function (d) {
                return x(d.Province_State);
            })
            .on("mouseover", mouseover)
            .on("mouseleave", mouseleave)
            .transition() // <---- Here is the transition
            .duration(2000)
            .attr("y", function (d) {
                return y(d.Deaths);
            })
            .attr("width", x.bandwidth())
            .attr("height", function (d) {
                return height - y(d.Deaths);
            })
            .style('fill', function (d) {
                return color(d.Deaths);
            });
        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height - 6)
            .text("US States");
        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "middle")
            .attr("x", -height / 2)
            .attr("y", -20)
            .attr("dy", "-2em")
            .attr("transform", "rotate(-90)")
            .text("Number of Deaths");
        svg.append("text")
            .attr("x", 645)
            .attr("y", 65)
            .attr("text-anchor", "start")
            .style("font-size", "16px")
            .text("Highest number of Deaths: 32,495");
        svg.append("text")
            .attr("x", 645)
            .attr("y", 80)
            .attr("text-anchor", "start")
            .style("font-size", "16px")
            .text("Lowest number of Deaths: 2");
        svg.append("text")
            .attr("x", 645)
            .attr("y", 30)
            .attr("text-anchor", "start")
            .style("font-size", "16px")
            .text("Hover-over for details:");
        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .attr("font-weight", 700)
            .text("Number of Deaths in each US State");
        svg.append("text")
            .attr("x", 180)
            .attr("y", 550)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "bold")
            .text("Deaths - Aggregated Death case count for the state.");

        return svg;
    })
}

function showConfirmedCases() {
    d3.selectAll("svg").remove();
    // set the dimensions and margins of the graph
    var margin = {top: 40, right: 30, bottom: 150, left: 65},
        width = 1000 - margin.left - margin.right,
        height = 650 - margin.top - margin.bottom;


    // append the svg object to the body of the page
    var svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

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
        tooltip.html("<strong>State: </strong>" + d.Province_State + "<br><strong>Confirmed: </strong>" + d.Confirmed + "<br><strong>Deaths: </strong>" + d.Deaths
            + "<br><strong>Active: </strong>" + parseInt(d.Active))
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

    // Parse the Data
    d3.csv("https://raw.githubusercontent.com/manupri2/manupri2.github.io/master/USA-Covid19/07-19-2020.csv", function (error, data) {
        if (error) throw error;

        data.sort(function (a, b) {
            return b.Confirmed - a.Confirmed;
        });
        // X axis
        var x = d3.scaleBand()
            .range([0, width])
            .domain(data.map(function (d) {
                return d.Confirmed === "" ? null : d.Province_State;
            }))
            .padding(0.2);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

// Add Y axis
        var y = d3.scaleLinear()
            .domain([0, 450000])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        //color
        var color = d3.scaleLinear()
            .domain([0, 450000])
            .range(["#aff05b", "#900c00"]);

        var texts = svg.selectAll("mytexts")
            .data(data)
            .enter()
            .append("text");

        // Bars
        svg.selectAll("mybar")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", function (d) {
                return x(d.Province_State);
            })
            .on("mouseover", mouseover)
            .on("mouseleave", mouseleave)
            .transition() // <---- Here is the transition
            .duration(2000)
            .attr("y", function (d) {
                return y(d.Confirmed);
            })
            .attr("width", x.bandwidth())
            .attr("height", function (d) {
                return height - y(d.Confirmed);
            })
            .style('fill', function (d) {
                return color(d.Confirmed);
            });
        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height - 6)
            .text("US States");
        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "middle")
            .attr("x", -height / 2)
            .attr("y", -20)
            .attr("dy", "-2em")
            .attr("transform", "rotate(-90)")
            .text("Confirmed Cases");
        svg.append("text")
            .attr("x", 640)
            .attr("y", 30)
            .attr("text-anchor", "start")
            .style("font-size", "16px")
            .text("Hover-over for details:");
        svg.append("text")
            .attr("x", 640)
            .attr("y", 65)
            .attr("text-anchor", "start")
            .style("font-size", "16px")
            .text("Highest number of Confirmed cases: 406,807");
        svg.append("text")
            .attr("x", 640)
            .attr("y", 80)
            .attr("text-anchor", "start")
            .style("font-size", "16px")
            .text("Lowest number of Confirmed cases: 37");
        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .attr("font-weight", 700)
            .text("Confirmed Cases in each US State");
        svg.append("text")
            .attr("x", 200)
            .attr("y", 550)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "bold")
            .text("Confirmed Cases - Aggregated confirmed case count for the state.");
        return svg;
    });
}

function showActiveCases() {
    d3.selectAll("svg").remove();
    // set the dimensions and margins of the graph
    var margin = {top: 40, right: 30, bottom: 150, left: 65},
        width = 1000 - margin.left - margin.right,
        height = 650 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

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
        tooltip.html("<strong>State: </strong>" + d.Province_State + "<br><strong>Active: </strong>" + parseInt(d.Active) + "<br><strong>Confirmed: </strong>" + d.Confirmed
            + "<br><strong>Deaths: </strong>" + parseInt(d.Deaths))
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

    // Parse the Data
    d3.csv("https://raw.githubusercontent.com/manupri2/manupri2.github.io/master/USA-Covid19/07-19-2020.csv", function (error, data) {
        if (error) throw error;

        data.sort(function (a, b) {
            return b.Active - a.Active;
        });
        // X axis
        var x = d3.scaleBand()
            .range([0, width])
            .domain(data.map(function (d) {
                return d.Active === "" ? null : d.Province_State;
            }))
            .padding(0.2);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

// Add Y axis
        var y = d3.scaleLinear()
            .domain([0, 400000])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        //color
        var color = d3.scaleLinear()
            .domain([0, 400000])
            .range(["#aff05b", "#900c00"]);

        // Bars
        svg.selectAll("mybar")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", function (d) {
                return x(d.Province_State);
            })
            .on("mouseover", mouseover)
            .on("mouseleave", mouseleave)
            .transition() // <---- Here is the transition
            .duration(2000)
            .attr("y", function (d) {
                return y(d.Active);
            })
            .attr("width", x.bandwidth())
            .attr("height", function (d) {
                return height - y(d.Active);
            })
            .style('fill', function (d) {
                return color(d.Active);
            });
        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height - 6)
            .text("US States");
        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "middle")
            .attr("x", -height / 2)
            .attr("y", -20)
            .attr("dy", "-2em")
            .attr("transform", "rotate(-90)")
            .text("Active Cases");
        svg.append("text")
            .attr("x", 645)
            .attr("y", 65)
            .attr("text-anchor", "start")
            .style("font-size", "16px")
            .text("Highest number of Active Cases: 379,191");
        svg.append("text")
            .attr("x", 645)
            .attr("y", 80)
            .attr("text-anchor", "start")
            .style("font-size", "16px")
            .text("Lowest number of Active Cases: 6");
        svg.append("text")
            .attr("x", 645)
            .attr("y", 30)
            .attr("text-anchor", "start")
            .style("font-size", "16px")
            .text("Hover-over for details:");
        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .attr("font-weight", 700)
            .text("Active Cases in each US State");
        svg.append("text")
            .attr("x", 320)
            .attr("y", 550)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "bold")
            .text("Active - Aggregated confirmed cases that have not been resolved (Active = Confirmed - Recovered - Deaths).");

        return svg;
    })
}

function showRecoveredCases() {
    d3.selectAll("svg").remove();
    // set the dimensions and margins of the graph
    var margin = {top: 40, right: 30, bottom: 150, left: 65},
        width = 1000 - margin.left - margin.right,
        height = 650 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

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
        tooltip.html("<strong>State: </strong>" + d.Province_State + "<br><strong>Recovered: </strong>" + d.Recovered + "<br><strong>Confirmed: </strong>" + d.Confirmed
            + "<br><strong>Active: </strong>" + parseInt(d.Active) + "<br><strong>Deaths: </strong>" + parseInt(d.Deaths))
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

    // Parse the Data
    d3.csv("https://raw.githubusercontent.com/manupri2/manupri2.github.io/master/USA-Covid19/07-19-2020.csv", function (error, data) {
        if (error) throw error;

        data.sort(function (a, b) {
            return b.Recovered - a.Recovered;
        });
        // X axis
        var x = d3.scaleBand()
            .range([0, width])
            .domain(data.map(function (d) {
                return d.Recovered === "" ? null : d.Province_State;
            }))
            .padding(0.2);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

// Add Y axis
        var y = d3.scaleLinear()
            .domain([0, 180000])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        //color
        var color = d3.scaleLinear()
            .domain([0, 180000])
            .range(["#aff05b", "#900c00"]);

        // Bars
        svg.selectAll("mybar")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", function (d) {
                return x(d.Province_State);
            })
            .on("mouseover", mouseover)
            .on("mouseleave", mouseleave)
            .transition() // <---- Here is the transition
            .duration(2000)
            .attr("y", function (d) {
                return y(d.Recovered);
            })
            .attr("width", x.bandwidth())
            .attr("height", function (d) {
                return height - y(d.Recovered);
            })
            .style('fill', function (d) {
                return color(d.Recovered);
            });
        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height - 6)
            .text("US States");
        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "middle")
            .attr("x", -height / 2)
            .attr("y", -20)
            .attr("dy", "-2em")
            .attr("transform", "rotate(-90)")
            .text("Recovered Cases");
        svg.append("text")
            .attr("x", 635)
            .attr("y", 65)
            .attr("text-anchor", "start")
            .style("font-size", "16px")
            .text("Highest number of Recovered Cases: 172,936");
        svg.append("text")
            .attr("x", 635)
            .attr("y", 80)
            .attr("text-anchor", "start")
            .style("font-size", "16px")
            .text("Lowest number of Recovered Cases: 29");
        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .attr("font-weight", 700)
            .text("Number of Recovered Cases in each US State");
        svg.append("text")
            .attr("x", 180)
            .attr("y", 550)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "bold")
            .text("Recovered - Aggregated Recovered case count for the state.");
        svg.append("text")
            .attr("x", 635)
            .attr("y", 30)
            .attr("text-anchor", "start")
            .style("font-size", "16px")
            .text("Hover-over for details:");

        return svg;
    })
}

function showPeopleTested() {
    d3.selectAll("svg").remove();
    // set the dimensions and margins of the graph
    var margin = {top: 40, right: 30, bottom: 150, left: 75},
        width = 1000 - margin.left - margin.right,
        height = 650 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

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
        tooltip.html("<strong>State: </strong>" + d.Province_State + "<br><strong>People Tested: </strong>" + d.People_Tested + "<br><strong>Confirmed: </strong>" + d.Confirmed
            + "<br><strong>Active: </strong>" + parseInt(d.Active) + "<br><strong>Deaths: </strong>" + parseInt(d.Deaths))
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

    // Parse the Data
    d3.csv("https://raw.githubusercontent.com/manupri2/manupri2.github.io/master/USA-Covid19/07-19-2020.csv", function (error, data) {
        if (error) throw error;

        data.sort(function (a, b) {
            return b.People_Tested - a.People_Tested;
        });
        // X axis
        var x = d3.scaleBand()
            .range([0, width])
            .domain(data.map(function (d) {
                return d.People_Tested === "" ? null : d.Province_State;
            }))
            .padding(0.2);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

// Add Y axis
        var y = d3.scaleLinear()
            .domain([0, 6500000])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        //color
        var color = d3.scaleLinear()
            .domain([0, 6500000])
            .range(["#aff05b", "#900c00"]);

        // Bars
        svg.selectAll("mybar")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", function (d) {
                return x(d.Province_State);
            })
            .on("mouseover", mouseover)
            .on("mouseleave", mouseleave)
            .transition() // <---- Here is the transition
            .duration(2000)
            .attr("y", function (d) {
                return y(d.People_Tested);
            })
            .attr("width", x.bandwidth())
            .attr("height", function (d) {
                return height - y(d.People_Tested);
            })
            .style('fill', function (d) {
                return color(d.People_Tested);
            });
        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height - 6)
            .text("US States");
        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "middle")
            .attr("x", -height / 2)
            .attr("y", -30)
            .attr("dy", "-2em")
            .attr("transform", "rotate(-90)")
            .text("People Tested");
        svg.append("text")
            .attr("x", 625)
            .attr("y", 65)
            .attr("text-anchor", "start")
            .style("font-size", "16px")
            .text("Highest number of People Tested: 6,286,852");
        svg.append("text")
            .attr("x", 625)
            .attr("y", 80)
            .attr("text-anchor", "start")
            .style("font-size", "16px")
            .text("Lowest number of People Tested: 6,884");
        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .attr("font-weight", 700)
            .text("Number of People Tested in each US State");
        svg.append("text")
            .attr("x", 200)
            .attr("y", 550)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "bold")
            .text("People_Tested - Total number of people who have been tested.");
        svg.append("text")
            .attr("x", 625)
            .attr("y", 30)
            .attr("text-anchor", "start")
            .style("font-size", "16px")
            .text("Hover-over for details:");

        return svg;
    })

}

function showPeopleHospitalized() {
    d3.selectAll("svg").remove();
    // set the dimensions and margins of the graph
    var margin = {top: 40, right: 30, bottom: 150, left: 65},
        width = 1000 - margin.left - margin.right,
        height = 650 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

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
        tooltip .html("<strong>State: </strong>" + d.Province_State + "<br><strong>Hospitalized: </strong>" + d.People_Hospitalized + "<br><strong>People Tested: </strong>" + d.People_Tested + "<br><strong>Confirmed: </strong>" + d.Confirmed
                + "<br><strong>Active: </strong>" + parseInt(d.Active) + "<br><strong>Deaths: </strong>" + parseInt(d.Deaths))
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

    // Parse the Data
    d3.csv("https://raw.githubusercontent.com/manupri2/manupri2.github.io/master/USA-Covid19/07-19-2020.csv", function (error, data) {
        if (error) throw error;

        data.sort(function (a, b) {
            return b.People_Hospitalized - a.People_Hospitalized;
        });
        // X axis
        var x = d3.scaleBand()
            .range([0, width])
            .domain(data.map(function (d) {
                return d.People_Hospitalized === "" ? null : d.Province_State;
            }))
            .padding(0.2);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

// Add Y axis
        var y = d3.scaleLinear()
            .domain([0, 90000])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        //color
        var color = d3.scaleLinear()
            .domain([0, 90000])
            .range(["#aff05b", "#900c00"]);

        // Bars
        svg.selectAll("mybar")
            .data(data)
            .enter()
            .append("rect")
            // .filter(function(d) { return d.People_Hospitalized !== ""; })
            .attr("x", function (d) {
                return x(d.Province_State);
            })
            .on("mouseover", mouseover)
            .on("mouseleave", mouseleave)
            .transition() // <---- Here is the transition
            .duration(2000)
            .attr("y", function (d) {
                return y(d.People_Hospitalized);
            })
            .attr("width", x.bandwidth())
            .attr("height", function (d) {
                return height - y(d.People_Hospitalized);
            })
            .style('fill', function (d) {
                return color(d.People_Hospitalized);
            });
        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height - 6)
            .text("US States");
        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "middle")
            .attr("x", -height / 2)
            .attr("y", -20)
            .attr("dy", "-2em")
            .attr("transform", "rotate(-90)")
            .text("People Hospitalized");
        svg.append("text")
            .attr("x", 610)
            .attr("y", 65)
            .attr("text-anchor", "start")
            .style("font-size", "16px")
            .text("Highest number of People Hospitalized: 89,995");
        svg.append("text")
            .attr("x", 610)
            .attr("y", 80)
            .attr("text-anchor", "start")
            .style("font-size", "16px")
            .text("Lowest number of People Hospitalized: 4");
        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .attr("font-weight", 700)
            .text("Number of People Hospitalized in each US State");
        svg.append("text")
            .attr("x", 180)
            .attr("y", 550)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "bold")
            .text("People_Hospitalized - Total number of people hospitalized.");
        svg.append("text")
            .attr("x", 610)
            .attr("y", 30)
            .attr("text-anchor", "start")
            .style("font-size", "16px")
            .text("Hover-over for details:");

        return svg;
    })

}

