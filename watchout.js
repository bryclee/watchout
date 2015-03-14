//setting area
	//keep track of score
	//keep track of collisions
	//keep track of High Score
var Score = d3.select(".scoreboard").selectAll("span");
var height = 450;



//make svg area for content
var svg = d3.select(".content").append("svg")
	.style("width", "100%")
	.style("height", "100%");

//create enemy objects on content
	//have an id property
	//have x and y(height)
var makeEnemy = function(value) {
	this.id = value;
}
makeEnemy.prototype.newNumber = function(){
	return Math.random()*100 + "%"
}

var update = function(count){
	var circles = svg.selectAll('circle').data(count, function(d) { return d.id; });
	//change circle x & y
	circles.transition()
		.duration(750)
		.tween('custom', tweenCollision);

		// .attr({'cx': function(d) { return d.newNumber(); },
	 //           'cy': function(d) { return d.newNumber(); },
	 //           'r': 10});
	//create new circles at x & y
	circles.enter()
    .append('circle')
    .attr({'cx': function(d) { return d.newNumber(); },
           'cy': function(d) { return d.newNumber(); },
           'r': 10});
   //remove circles 
	circles.exit()
	  .remove();
}


//check collision
var checkCollision = function(){
	//check sqrt((enemy x - player x)^2 + (enemy y - player y)^2)
	//if smaller then radius return true else don't do anything
}


//update postion during transition while checking for collisions
var tweenCollision = function(data){
	//position tells where enemy will end up
	var circle = d3.select(this)
	console.log(circle, arguments)
	//store beginning
	var beginningX = parseFloat(circle.attr("cx"));
	var beginningY = parseFloat(circle.attr("cy"));
	//store end value for transition
	var endX = parseFloat(data.newNumber());
	var endY = parseFloat(data.newNumber());
	//get difference
	var changeX = endX - beginningX;
	var changeY = endY - beginningY;

	//d3.select.this[]



	//return function that tells where our enemies are(during transition)
	return function(t){
		//check for collision
		var result = checkCollision(d3.select(this));
		if (result) {
			//IF TRUE DO SOMETHING collision related
		}
		circle
			.attr({'cx': (changeX * t) + beginningX + "%",
	           'cy': (changeY * t) + beginningY + "%"});

	}
}

	//if collision detected
			//reset points
			//make screen red at someway JUICE

	//it should update enemy postition throught out animation
  



var count = []; // hold all the enemy objects

for (var i = 0; i < 1; i++){
  count.push(new makeEnemy(i));
}

console.log(count);
update(count);
setInterval(function(){count.push(new makeEnemy(i)); i++; update(count)}, 1000);

//mouse movement
var mouse = svg.on("mousemove", function(){
	playersValues.attr("cx", (d3.mouse(this)[0]+"px"))
							 .attr("cy", (d3.mouse(this)[1]+"px"));
});


//create player object
var player = function() {
	return circle = svg.append("ellipse")
    .attr("cx", 50)
 	  .attr("cy", 50)
    .attr("rx", 20)
    .attr("ry", 10)
    .attr("fill", "red");
}

var playersValues = player();

//setup animation for enemy objects

//animation needs collision detection
	//everytime there is collision we want to reset score
	//we want to add collision to settings
	//make content window have somekind of color light up


