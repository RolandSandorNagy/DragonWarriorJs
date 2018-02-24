var N = 10;
var M = 10;
var K = 2;
var	srt = M % 2 == 0 ? M / 2 : (M - 1) / 2; 
var sneak = Array();
var dir = "RIGHT";
var mat = Array();
var objects = Array();
var scroll;
var points = 1;
var end = true;
var sneakhitsWall = false;
var mirrorsActive = false;
var displayState = '';
var counter = 75;
var interval;
var timeOut;
var life;
var keyPressed = false;
var heart = '';

function slowDown() {
	var tickAudio = new Audio('tick2.mp3');
	tickAudio.play();
	var step = 1;
	var second = 5;
	setCountDownDisplay('Timer:   ' + second);
	clearInterval(interval);
	counter = 113;
	interval = setInterval(function() {
		frame();
		var val = (counter * step) % 1000;
		step++;
		if((counter * step) % 1017 === 0) {
			var tickAudio = new Audio('tick2.mp3');
			tickAudio.play();
			second--;
			setCountDownDisplay('Timer:   ' + second);
		}
	}, counter);
	clearTimeout(timeOut);
	timeOut = setTimeout(function() {
		speedDown();
	}, 5000);
}


function speedUp() {
	var tickAudio = new Audio('tick2.mp3');
	tickAudio.play();
	var step = 1;
	var second = 5;
	setCountDownDisplay('Timer:   ' + second);
	clearInterval(interval);
	counter = 50;
	interval = setInterval(function() {
		frame();
		var val = (counter * step) % 1000;
		step++;
		if((counter * step) % 1000 === 0) {
			var tickAudio = new Audio('tick2.mp3');
			tickAudio.play();
			second--;
			setCountDownDisplay('Timer:   ' + second);
		}
	}, counter);
	clearTimeout(timeOut);
	timeOut = setTimeout(function() {
		speedDown();
	}, 5000);
}

function speedDown() {
	setCountDownDisplay('')
	displayState = '';
	counter = 75;
	clearInterval(interval);
	interval = setInterval(function() {
		frame();
	}, counter);
}

function setCountDownDisplay(second) {
	document.getElementById('countdown').innerHTML = second;
}

function getRandomScrollType() {
	var scrollTypes = [ 'Wisdom','Wisdom','Wisdom','Wisdom','Mirrors',
						'Wisdom','Wisdom','Wisdom','Wisdom','Reverse',
						'Wisdom','Wisdom','Wisdom','Wisdom','Greed',
						'Wisdom','Wisdom','Wisdom','Wisdom','Laziness', 
						'Wisdom','Wisdom','Wisdom','Wisdom','Gluttony'
					  ];
	return scrollTypes[Math.floor((Math.random() * 25))];
}

function makeObjects() {
	for (var i = 0; i < K; i++) {
		objects.push(createNewObject());		
	}
}

function updatePanel() {
	document.getElementById('points').innerHTML = "Points:    <strong>" + points + '</strong>';	
	document.getElementById('state').innerHTML = displayState.toString();	
	for (var i = 1; i <= 5; i++) {	
		document.getElementById('life' + i).innerHTML = '&nbsp;';
	}for (var i = 1; i <= life; i++) {	
		document.getElementById('life' + i).innerHTML = '<i class="fa fa-heart"></i>';
	}
}

function drawSneak() {
	document.getElementById(sneak[sneak.length - 1][0] + ',' + sneak[sneak.length - 1][1]).style.backgroundColor = 'rgb(123,66,12)';
	for (var i = 0; i < sneak.length - 1; i++) {
		document.getElementById(sneak[i][0] + ',' + sneak[i][1]).style.backgroundColor = 'rgb(173,166,62)';
	}
}

function removeSneak() {
	for (var i = 0; i < sneak.length; i++) {
		document.getElementById(sneak[i][0] + ',' + sneak[i][1]).style.backgroundColor = 'rgba(200,200,200,0.3)';
	}
}

function tryMoveUp() {
	if(sneak[sneak.length - 1][0] > 0) {
		sneak[sneak.length - 1][0]--;
	} else {
    	var objectOrWallAudio = new Audio('objectOrWall.mp3');
		objectOrWallAudio.play();
		life--;
		updatePanel();
		if(life === 0) {
			sneakhitsWall = true;
			end = true;
		} else {
			reset();
			return;			
		}
	}
}
function tryMoveDown() {
	if(sneak[sneak.length - 1][0] < N-1) {
		sneak[sneak.length - 1][0]++;
	} else {
    	var objectOrWallAudio = new Audio('objectOrWall.mp3');
		objectOrWallAudio.play();
		life--;
		updatePanel();
		if(life === 0) {
			sneakhitsWall = true;
			end = true;
		} else {
			reset();
			return;			
		}
	}
}
function tryMoveLeft() {
	if(sneak[sneak.length - 1][1] > 0) {
		sneak[sneak.length - 1][1]--;	
	} else {
    	var objectOrWallAudio = new Audio('objectOrWall.mp3');
		objectOrWallAudio.play();
		life--;
		updatePanel();
		if(life === 0) {
			sneakhitsWall = true;
			end = true;
		} else {
			reset();
			return;			
		}
	}
}
function tryMoveRight() {
	if(sneak[sneak.length - 1][1] < M-1) {
		sneak[sneak.length - 1][1]++;
	} else {
    	var objectOrWallAudio = new Audio('objectOrWall.mp3');
		objectOrWallAudio.play();
		life--;
		updatePanel();
		if(life === 0) {
			sneakhitsWall = true;
			end = true;
		} else {
			reset();
			return;			
		}
	}
}

function moveSneak() {
    removeSneak();
    var length = sneak.length;
    for (var i = 0; i < length - 1; i++){
        sneak[i][0] = sneak[i + 1][0];
        sneak[i][1] = sneak[i + 1][1];
    }
    switch(dir){
        case 'UP': tryMoveUp();
            break;
        case 'DOWN': tryMoveDown();
            break;
        case 'LEFT': tryMoveLeft();
            break;
        case 'RIGHT': tryMoveRight();
            break;
    }
	drawSneak();
}

function tryDirUp() {
	if(dir !== "DOWN") {
		dir = "UP";
	}
}
function tryDirDown() {
	if(dir !== "UP") {
		dir = "DOWN";
	}
}
function tryDirLeft() {
	if(dir !== "RIGHT") {
		dir = "LEFT";
	}
}
function tryDirRight() {
	if(dir !== "LEFT") {
		dir = "RIGHT";
	}
}

function arrowPressed(e) {
	e.preventDefault();
	var key = e.key ? e.key : e.code;
	switch(key) {
		case 'ArrowUp': 
			if(mirrorsActive === true) {
				tryDirDown();
			} else {
				tryDirUp(); 
			}
			break; 
		case 'ArrowDown': 
			if(mirrorsActive === true) {
				tryDirUp(); 
			} else {
				tryDirDown(); 
			}
			break; 
		case 'ArrowLeft': 
			if(mirrorsActive === true) {
				tryDirRight(); 				
			} else {
				tryDirLeft(); 				
			}
			break; 
		case 'ArrowRight': 
			if(mirrorsActive === true) {
				tryDirLeft();
			} else {
				tryDirRight(); 
			}
			break;
	}						
}

function isThereAScroll(x, y) {
	return scroll[0] === x && scroll[1] === y;
}

function isThereSneak(x, y) {
	for (var i = 0; i < sneak.length; i++) {
		if(sneak[i][0] === x && sneak[i][1] === y) {
			return true;
		}
	}
}

function isThereObject(x, y) {
	for (var i = 0; i < objects.length; i++) {
		if(objects[i][0] === x && objects[i][1] === y) {
			return true;
		}
	}
}

function validCoords(x, y) {
	for (var j = 0; j < objects.length; j++) {
		if(objects[j][0] === x && objects[j][1] === y) {
			return false;
		}
	}
	return !isThereSneak(x, y) && !isThereObject(x, y);
}

function createNewObject() {
	var try_XY = [Math.floor((Math.random() * N)), Math.floor((Math.random() * M))];
	while(!validCoords(try_XY[0], try_XY[1])) {
		try_XY = [Math.floor((Math.random() * N)), Math.floor((Math.random() * M))];
	}
	return [try_XY[0], try_XY[1], true, getRandomScrollType()];
}

function sneakGrows(){
	mirrorsActive = false;
    sneak.push([sneak[sneak.length - 1][0], sneak[sneak.length - 1][1]]);
}

function sneakHitsItSelf() {
    var log = false;
    var j = 0;
    var h = sneak.length;
    var head = [sneak[h - 1][0], sneak[h - 1][1]];
    while(!log && j < h - 1) {
    	log = sneak[j][0] === head[0] && sneak[j][1] === head[1]; 
    	j++;
    }
    if(log === true) {
    	var objectOrWallAudio = new Audio('objectOrWall.mp3');
		objectOrWallAudio.play();
    	life--;
    	updatePanel();
    	removeSneak();
    	reset();
    }
	return log;
}

function isThereObject(x, y) {
	for (var i = 0; i < objects.length; i++) {
		if(objects[i][0] === x && objects[i][1] === y) {
			return true;
		}
	}
	return false;
}

function frame() {
	updatePanel();
	if(!end) { end = sneakHitsItSelf() || sneakhitsWall; }
	checking();
}

function checking() {
	if(!end) {
		var len = sneak.length;
	    if (isThereAScroll(sneak[len - 1][0], sneak[len - 1][1])) {
	    	var pickUpAudio = new Audio('scrollPickUp3.mp3');
			pickUpAudio.play();
	    	if(counter === 50 || counter === 113) speedDown();
	    	scroll[2] = false
	    	displayState = '<strong>' + scroll[3] + '</strong>'; 
	    	switch(scroll[3]) {
				case 'Wisdom':   sneakGrows(); sneakGrows(); sneakGrows(); sneakGrows(); 
						    	 points += 4;
								 break;
				case 'Mirrors':  sneakGrows();
						    	 points += 1;
						    	 mirrorsActive = true;
								 break;
				case 'Reverse':  sneakGrows();
								 reverseSneak();
						     	 points += 1;
								 break;
				case 'Greed':    sneakGrows();
								 speedUp();
						    	 points += 1;
								 break;
				case 'Laziness': sneakGrows();
						    	 slowDown();
						    	 points += 1;
								 break;
				case 'Gluttony': sneakGrows(); sneakGrows(); sneakGrows(); sneakGrows(); sneakGrows(); sneakGrows(); sneakGrows(); sneakGrows(); sneakGrows(); sneakGrows();
						    	 points += 10;
								 break;	    		
	    	}
			scroll = createNewObject();
		} else if (isThereObject(sneak[len - 1][0], sneak[len - 1][1])) {
	    	var objectOrWallAudio = new Audio('objectOrWall.mp3');
			objectOrWallAudio.play();
			life--;
			updatePanel();
			if(life === 0) {
				end = true;
				return;
			} else {
				reset();
				return;
			}
		} else if(isThereHeart(sneak[len - 1][0], sneak[len - 1][1])) {
	    	var heartAudio = new Audio('heart3.mp3');
			heartAudio.play();
			removeHeart();
			if(life < 5) {
				life++				
			}
		}
	   	drawscroll();
		moveSneak();
		keyPressed = false;
		drawObjects();
		tryMakeHeart();
	} else {
		//updatePanel();
		if(life === 0) {
			life--;
			youFailed();
			clearInterval(interval);
			endGame();
		} else {
			reset();
			return;
		}			
	}
}

function isThereHeart(x, y) {
	return heart === '' ? false : heart[0] === x && heart[1] === y;	
}

function tryMakeHeart() {
	if(heart === '' && Math.floor(Math.random() * 1000) < 3) {
		heart = createNewObject();
		heart[3] = 'Heart';
		drawHeart();
	}
}

function drawHeart() {
	document.getElementById(heart[0] + ',' + heart[1]).innerHTML = '<i id="heartSpan" class="fa fa-heart"></i>';	
}

function removeHeart() {
	var hrt = document.getElementById(heart[0] + ',' + heart[1]);	
	hrt.innerHTML = '';
	heart = '';
}

function youFailed() {
	var endAudio = new Audio('laugh' + (Math.floor(Math.random() * 2) + 2) + '.mp3');
	endAudio.play();
	showPoints();
	//alert("You Failed.");

}

function showPoints() {
	var gameDiv = document.getElementById('gameDiv');
	var PointsH2 = document.createElement('h2');
	gameDiv.appendChild(PointsH2);		
	PointsH2.id = 'PointsH2';
	PointsH2.innerHTML = 'SCORE: &nbsp;&nbsp;&nbsp;&nbsp;' + points + 'pts';
	PointsH2.style.color = 'white';
	PointsH2.style.backgroundColor = 'black';
	PointsH2.style.fontWeight = '900';
	PointsH2.style.width = '300px';
	PointsH2.style.height = '60px';
	PointsH2.style.lineHeight = '60px';
	PointsH2.style.position = 'relative';
	PointsH2.style.top = '200px';
	PointsH2.style.left = '300px';
	PointsH2.style.transition = 'all 1s';
}

function reset() {	
	speedDown();
	displayState = '&nbsp;';
	removeSneak();
	sneakhitsWall = false;
	mirrorsActive = false;
	end = false;
	srt = N % 2 == 0 ? N / 2 : (N - 1) / 2; 
	sneak = [[srt, 0]];
	dir = 'RIGHT';
}

function endGame() {
	document.getElementById('table').style.display = 'none';
	document.removeEventListener("keydown", function(e) {
		console.log(e.key);	
		switch(e.key) {
			case ' ': case 'ArrowUp': case 'ArrowDown': case 'ArrowLeft': case 'ArrowRight': arrowPressed(e);
		}
	}, false);
	clearSneak();
	clearObjects();
	clearMap();
	var tbl = document.getElementById('table2');
	document.getElementById('points').innerHTML = '&nbsp;';
	document.getElementById('state').innerHTML = '&nbsp;';
	document.getElementById('countdown').innerHTML = '&nbsp;';
	document.getElementById('life1').innerHTML = '&nbsp;';
	document.getElementById('life2').innerHTML = '&nbsp;';
	document.getElementById('life3').innerHTML = '&nbsp;';
	//document.getElementById('life').innerHTML = '';
	tbl.remove();
	dir = "RIGHT";
	points = 1;
	displayState = '';
}

function clearSneak() {
	sneak = [[srt,0]];;
}

function clearObjects() {
	objects = Array();
}

function clearMap() {
    for (var i = 0; i < N; i++) {
        for (var j = 0; j < M; j++) {
     		document.getElementById(i + ',' + j).style.backgroundColor = 'rgba(200,200,200,0.3)';
        }
    }

}

function reverseSneak() {
	for (var i = 0; i < Math.floor((sneak.length + 1) / 2); i++) {
		changeNums(i, sneak.length-1-i);
	}
	switch(dir) {
		case 'LEFT': 
			if(sneak.length === 2) {
				dir = 'RIGHT';
				return;
			}			
			if(sneak[sneak.length - 1][1] > sneak[sneak.length - 2][1]) {
				dir = 'RIGHT'; 				
			}
			break;
		case 'RIGHT': 
			if(sneak.length === 2) {
				dir = 'LEFT';
				return;
			}			
			if(sneak[sneak.length - 1][1] < sneak[sneak.length - 2][1]) {
				dir = 'LEFT';
			}
			break;
		case 'UP': 
			if(sneak.length === 2) {
				dir = 'DOWN';
				return;
			}			
			if(sneak[sneak.length - 1][0] > sneak[sneak.length - 2][0]) {
				dir = 'DOWN';
			}
			break;
		case 'DOWN': 
			if(sneak.length === 2) {
				dir = 'UP';
				return;
			}			
			if(sneak[sneak.length - 1][0] < sneak[sneak.length - 2][0]) {
				dir = 'UP';
			}
			break;
	}
}

function changeNums(i, j) {
	var tmp = sneak[i];
	sneak[i] = sneak[j];
	sneak[j] = tmp;
}

function drawObjects() {
	for (var i = 0; i < objects.length; i++) {
		document.getElementById(objects[i][0] + ',' + objects[i][1]).style.backgroundColor = 'black';
		document.getElementById(objects[i][0] + ',' + objects[i][1]).style.borderRadius = '0px';
	}
}

function drawscroll() {
	if(scroll[0] < N && scroll[1] < M && scroll[2]) {
		var color = "black";
		switch(scroll[3]) {
			case 'Wisdom': color = "yellow"; break;
			case 'Mirrors': color = "magenta"; break;
			case 'Reverse': color = "pink"; break;
			case 'Greed': color = "blue"; break;
			case 'Laziness': color = "green"; break;
			case 'Gluttony': color = "orange"; break;
			//case 'Heart': color = "rgb(200,120,120)"; break;
		}
		if(scroll[3] === 'Heart') {
			document.getElementById(scroll[0] + ',' + scroll[1]).innerHTML = '<i id="heartSpan" class="fa fa-heart"></i>';						
			document.getElementById(scroll[0] + ',' + scroll[1]).backgroundColor = color;						
			document.getElementById(scroll[0] + ',' + scroll[1]).color = color;						
		} else {
			document.getElementById(scroll[0] + ',' + scroll[1]).style.backgroundColor = color;		
		}
	}
}

// Start
function start() {
	var n = document.getElementById('N').value;	
	var m = document.getElementById('M').value;	
	var k = document.getElementById('K').value;	
	if(n !== '' || m !== '' || k!== '') {
		if( (n !== '' && (n >= 23 || n <= 4))  || 
			(m !== '' && (m >= 46 || m <= 4)) || 
			(k !== '' && (k >= 20 || k < 0))){
				return;
			}
	}
	var pointsH2 = document.getElementById('PointsH2');
	if(pointsH2 !== null) pointsH2.remove();
	if(end === true) {
    	var gongAudio = new Audio('gong.mp3');
		gongAudio.play();
		document.getElementById('table').style.display = 'table';
		document.getElementById('table').style.margin = '0 auto';
		document.getElementById('table').className = 'text-center';
		life = 3;
		N = n === '' ? 10 : n;
		M = m === '' ? 10 : m;
		K = k === '' ? 2 : k;
		srt = N % 2 == 0 ? N / 2 : (N - 1) / 2; 
		sneak = [[srt,0]];
		dir = "RIGHT";
		sneakhitsWall = false;
		mirrorsActive = false;
		end = false;
		counter = 75;
		createMap();
		adjustPanel();
		makeObjects();
		drawObjects();
		scroll = createNewObject();
		document.addEventListener("keydown", function(e) {
			//e.preventDefault();
			//console.log(e.code);	
			if(!keyPressed) {
				var key = e.key ? e.key : e.code;
				switch(key) {
					case ' ': case 'ArrowUp': case 'ArrowDown': case 'ArrowLeft': case 'ArrowRight': arrowPressed(e);
				}								
				keyPressed = true;
			}
		}, false);
		//createPanel();
		setTimeout(function() {
			interval = setInterval(function() {
				frame();
			}, counter);
		}, 1000);	
	} else {

	}
}

function adjustPanel() {
	document.getElementById('points').style.width = Math.floor((M * 20) / 4) + 'px';
	document.getElementById('points').innerHTML = "Points: <strong>1</strong>"
	document.getElementById('state').style.width = Math.floor((M * 20) / 4) + 'px';
	document.getElementById('countdown').style.width = Math.floor((M * 20) / 4) + 'px';
	document.getElementById('life1').style.width = Math.floor((M * 20) / 20) + 'px';
	document.getElementById('life2').style.width = Math.floor((M * 20) / 20) + 'px';
	document.getElementById('life3').style.width = Math.floor((M * 20) / 20) + 'px';
	document.getElementById('life4').style.width = Math.floor((M * 20) / 20) + 'px';
	document.getElementById('life5').style.width = Math.floor((M * 20) / 20) + 'px';
	document.getElementById('table').style.maxWidth = (Math.floor(M * 20) + 4)  + 'px';
	for (var i = 1; i <= 5; i++) {	
		document.getElementById('life' + i).innerHTML = '<i class="fa fa-heart"></i>';
	}
}

document.getElementById('start-btn').addEventListener('click', start, false);
document.getElementById('table').style.display = 'none';
//createMap();
//adjustPanel();
//createPanel();
	

//start();
