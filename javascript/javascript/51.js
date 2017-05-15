(function(){
	var width = 1070,
	    height = 550;

	var formatter = d3.format("$,");

	var div = d3.select("body").append("div")
	  .attr("class", "tooltip")
	  .style("opacity", 0);

	var svg = d3.select("#chart51")
	  .append("svg")
	  .attr("height", height)
	  .attr("width", width)
	  .append("g")
	  .attr("transform", "translate(0,0)")

	 // This is the command that creates 
	 // a defs div in your SVG. You can place
	 // images or gradients in there below
	var defs = svg.append("defs");


    // code that tells the radius to draw from the lowest to
    // highest number in the data set which is domain. And output
    // 10 to 80 radius circles which is the range
	var radiusScale = d3.scaleSqrt().domain([0, 6416005]).range([1, 130])

	// the simulation is a collection of forces
	// about where we want our circles to go
	// and how we want our circles to interact

	var forceXSeparate = d3.forceX(function(d) {
		if(d.position === 'top') {
		  return 300 
		} else {
		  return 750
		}
	 }).strength(0.05)

	var forceXCombine = d3.forceX(width / 2).strength(0.05)

	var forceCollide = d3.forceCollide(function(d) {
		return radiusScale(d.money) + 1
	})

	var simulation = d3.forceSimulation()
	  .force("x", forceXCombine)
	  .force("y", d3.forceY(height / 2).strength(0.05))
	  .force("collide", forceCollide)

	d3.queue()
	  .defer(d3.csv, "csv/51.csv")
	  .await(ready)
    
    // pull in the data
	function ready (error, datapoints) {
    
    // This code sets the parameters for the image bg
		defs.selectAll(".artist-pattern")
		  .data(datapoints)
		  .enter().append("pattern")
		  .attr("class", "artist-pattern")
		  .attr("id", function(d) {
		  	// jon-snow
		  	// Madonna
		  	// the-eagles
		  	// This gives a name and also puts a dash
		  	// btw 2+ word names so they work
		  	return d.name.toLowerCase().replace(/ /g, "-")
		  })
		  .attr("height", "100%")
		  .attr("width", "100%")
		  .attr("patternContentUnits", "objectBoundingBox")
		  .append("image")
		  .attr("height", 1)
		  .attr("width", 1)
		  .attr("preserveAspectRatio", "none")
		  .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
		  .attr("xlink:href", function(d) {
		  	return d.image_path
		  });

        // make a circle for every data point
		var circles = svg.selectAll(".artist")
		  .data(datapoints)
		  .enter().append("circle")
		  .attr("class", "artist")
		  .attr("r", function(d) {
		  	return radiusScale(d.money)
		  })
		  .on("mouseover", function(d) {
       	    div.transition()
             .duration(200)
             .style("opacity", .9);
            
            div.html(getTooltipHTMLContent(d))
             .style("left", (d3.event.pageX) + "px")
             .style("top", (d3.event.pageY - 28) + "px");
         })
         .on("mouseout", function(d) {
            div.transition()
             .duration(500)
             .style("opacity", 0);
         })
        // This is the function that changes the 
        // image
		  .attr("fill", function(d) {
		  	return "url(#" + d.name.toLowerCase().replace(/ /g, "-") + ")"
		  })
        
        // information for decade button to work on click
		d3.select("#top51").on('click', function() {
			simulation
			  .force("x", forceXSeparate)
			  .alphaTarget(0.5)
			  .restart()
		})
        
        // information for combine button to work on click
		d3.select("#total51").on('click', function() {
			simulation
			  .force("x", forceXCombine)
			  .alphaTarget(0.5)
			  .restart()
		})
 
        // here's all of the data, every time
        // there's a tick of the clock
        // run the function below
		simulation.nodes(datapoints)
		  .on('tick', ticked)
        
        //function for the simulation
		function ticked()  {
			circles
			  .attr("cx", function(d) {
			  	return d.x
			  })
			  .attr("cy", function(d) {
			  	 return d.y
			  })
		}
	}

	function getTooltipHTMLContent(d) {
		var htmlContent = '';

		htmlContent += "<div class='tooltip-container'>"
		htmlContent += "<h3>Organization</h3>";
		htmlContent += "<h4>" + d.name + "</h4>";
		htmlContent += "<hr class='short'>";
		htmlContent += "<h3>Donation amt.</h3>";
		htmlContent += "<h4>" + formatter(d.money) + "</h4>";
		htmlContent += "</div>"

		// return d.name + "<br/>" + d.money;

		return htmlContent;
	}

})();