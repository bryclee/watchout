//setting area
	//keep track of score
	//keep track of collisions
	//keep track of High Score
var Scoreboard = d3.select(".scoreboard").selectAll("span");
var ScoreboardValues = [0, 0, 0, 0];
var height = 450;
var lengthOfStep = 2000;

var enemyHeight = 10;
var playerYHeight = 10;

// ======= Make the content window ========
//make svg area for content
var svg = d3.select(".content").append("svg")
	.style("width", "100%")
	.style("height", "100%");
// ========================================


// ========== scoring function ============

var score = function() {
	//set score to 
	var startSeconds = Math.floor(Date.now()/1000);
	return function() {
		var newSeconds = Math.floor(Date.now()/1000);
		var diff =  newSeconds - startSeconds; 
		return diff;
	}
	//time difference between start and current to keep track of
}
var getScore = score();


// ========================================


// ========== Make the Enemy ==============
//create enemy objects on content
	//have an id property
	//have x and y(height)
var makeEnemy = function(value) {
	this.id = value;
}
makeEnemy.prototype.newNumber = function(){
	return Math.random()*100 + "%"
}
// ========================================

// ========= custom tween =================
//update postion during transition while checking for collisions
var tweenCollision = function(data){
	// ** calculate enemy's initial position and the change to the final position
	var circle = d3.select(this)
	//store beginning
	var beginningX = parseFloat(circle.attr("cx"));
	var beginningY = parseFloat(circle.attr("cy"));
	//store end value for transition
	var endX = parseFloat(data.newNumber());
	var endY = parseFloat(data.newNumber());
	//get difference
	var changeX = endX - beginningX;
	var changeY = endY - beginningY;
  var hasCollided = false;
	//return function that changes the enemy position during transition
	//and also checks for collision
	return function(t){
		//check for collision
		if (hasCollided === false){
			if (checkCollision(circle) ===true) {
				console.log('hit');
				getScore = score();
				ScoreboardValues[1] = getScore();
				ScoreboardValues[2]++; // update collisions
				ScoreboardValues[3]--;
				hasCollided = true;
				var id = circle.data()[0].id;
				for (var i = 0; i < count.length; i++) {
					if (count[i].id === id){
						count.splice(i, 1);
						break;
					}
				}
			  Scoreboard.data(ScoreboardValues).text(function(d) { return d; });

			  circle.attr({ stroke: "red", "stroke-width":'5px' })
			    .transition().duration(800)
			    .attr({ stroke: "#00FC87", "stroke-width":'0px' });

			  playersValues.attr({ stroke: "red", "stroke-width":'10px' })
			    .transition().duration(800)
			    .attr({ stroke: "#00FC87", "stroke-width":'3px' });

			  explode();
		  }
		} 

		circle
			.attr({'cx': (changeX * t) + beginningX + "%",
	           'cy': (changeY * t) + beginningY + "%"});
	}
}

//check collision
var checkCollision = function(circle){
	var cX = parseFloat(circle.attr("cx"))/100 * parseFloat(svg.style('width'));
	var cY = parseFloat(circle.attr("cy"))/100 * parseFloat(svg.style('height'));
	var pX = parseFloat(playersValues.attr("cx"))/100 * parseFloat(svg.style('width'));
	var pY = parseFloat(playersValues.attr("cy"))/100 * parseFloat(svg.style('height'));

	var distance = Math.sqrt(Math.pow((cX - pX), 2) + Math.pow((cY - pY), 2));
	//check sqrt((enemy x - player x)^2 + (enemy y - player y)^2)
	//if smaller then radius return true else don't do anything
	if (distance < (playerYHeight + enemyHeight)){
    return true;
	} else return false;
}
// ==========================================



// ======== Update the enemy locations and numbers =============
var update = function(count){
	// ** Select all circle elements, bind the enemy data in the count array to the DOM elements
	var circles = svg.selectAll('circle').data(count, function(d) { return d.id; });
	
  // ** update() update all enemies that already have DOM elements
	//change circle x & y
	circles.transition()
		.duration(800)
		.attr('fill', function() { return '#' + Math.floor(Math.random() * 1000);})
		.tween('custom', tweenCollision);

  // ** enter() select the enemy that has no DOM element and act on it
	//create new circles at x & y
	circles.enter()
    .append('circle')
    .attr({'opacity': '0'})
    .transition().duration(500)
    .attr('class','circle')
    .attr('opacity', 0.8)
    .attr('stroke', 'white')
    .attr('stroke-width', "2px")
    .attr({'fill': function() { return '#' + Math.floor(Math.random() * 1000);}})
    .attr({'cx': function(d) { return d.newNumber(); },
           'cy': function(d) { return d.newNumber(); },
           'r': enemyHeight});
   //remove circles 

  // ** exit() selects any DOM elements with no enemy bound to it
	circles.exit().transition().duration(500)
	  .attr({ 'r': enemyHeight*2, 'opacity':0 })
	  .remove();

	ScoreboardValues[1] = getScore();

	if (ScoreboardValues[0] < ScoreboardValues[1]) {
		ScoreboardValues[0] = ScoreboardValues[1];
	}
	
	Scoreboard.data(ScoreboardValues).text(function(d) { return d; });
}
// ==============================================


// ========= Explosions =================

var explode = function(){
	var pX = parseFloat(playersValues.attr("cx"))/100 * parseFloat(svg.style('width'));
	var pY = parseFloat(playersValues.attr("cy"))/100 * parseFloat(svg.style('height'));

	var particles = d3.range(20);

	svg.selectAll('square').data(particles).enter().append('rect')
    .attr({ x: pX + 'px', y: pY + 'px', width: '5px', height: '5px'})
    .style({ fill: function() {return '#FF66FB'} })
    .transition().duration(700).ease('quad','in')
      .attr({ x: function() { return pX + Math.random() * 200 - 100 + 'px' }, 
      	      y: function() { return pY + Math.random() * 200 - 100 + 'px' }})
      .style({ fill: '#00FF62', opacity: 0 })
      .remove()
};

// ======================================


// ========= Gameplay ===================
var count = []; // hold all the enemy objects

// spawn initial enemies
for (var i = 0; i < 1; i++){
  count.push(new makeEnemy(i));
}

// show the initial enemies
update(count);
// interval creating new enemies and moving existing ones
var nextStep = function(lengthOfStep) {
	setTimeout(function(){
		count.push(new makeEnemy(i));
		i++;
		update(count);
		ScoreboardValues[3]++;
		lengthOfStep = Math.max(2000 - 100*ScoreboardValues[3], 800);
    nextStep(lengthOfStep);
  }, lengthOfStep);
};
nextStep(lengthOfStep);

// function to track mouse movement
var mouse = svg.on("mousemove", function(){
	playersValues.attr("cx", ((d3.mouse(this)[0] / parseFloat(svg.style('width'))) * 100 + "%"))
							 .attr("cy", ((d3.mouse(this)[1] / parseFloat(svg.style('height'))) * 100 + "%"));
});


//create player object
var player = function() {
	return svg.append("ellipse")
		.attr("stroke", "#00FC87")
		.attr("stroke-width", "3px")
    .attr("cx", "50%")
 	  .attr("cy", "50%")
    .attr("rx", 2 * playerYHeight)
    .attr("ry", playerYHeight)
    .attr("fill", "#644");
}

var playersValues = player();

//setup animation for enemy objects

//animation needs collision detection
	//everytime there is collision we want to reset score
	//we want to add collision to settings
	//make content window have somekind of color light up


