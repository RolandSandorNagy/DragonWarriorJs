var N;
var M;
var K;
var counter = 75;
var points = 1;
var dir = "RIGHT";
var displayState = '';
var heart = '';
var sneak = Array();
var mat = Array();
var objects = Array();
var timeOut;
var interval;
var scroll;
var life;
var	srt; 
var keyPressed = false;
var sneakhitsWall = false;
var mirrorsActive = false;
var end = true;
var tickAudio = new Audio('tick2.mp3');
var objectOrWallAudio = new Audio('objectOrWall.mp3');
var pickUpAudio = new Audio('scrollPickUp3.mp3');
var heartAudio = new Audio('heart3.mp3');
var gongAudio = new Audio('gong.mp3');
		
function slowDown() {
	tick(5);
	counter = 113;
	setTimeOutFunc();
	clearInterval(interval);
	setIntervalFunc(1, 5, 1017);
}

function tick(second) {
	tickAudio.play();
	setCountDownDisplay('Timer:   ' + second);

}

function setTimeOutFunc() {
	clearTimeout(timeOut);
	timeOut = setTimeout(function() {
		speedDown();
	}, 5000);	
}

function speedUp() {
	tick(5);
	counter = 50;
	setTimeOutFunc();
	clearInterval(interval);
	setIntervalFunc(1, 5, 1000);
}

function setIntervalFunc(step, second, val) {
	interval = setInterval(function() {
		frame();
		step++;
		if((counter * step) % val === 0) {
			second--;
			tick(second);
		}
	}, counter);	
}


function speedDown() {
	setCountDownDisplay('');
	displayState = '';
	counter = 75;
	clearInterval(interval);
	interval = setInterval(function() {
		frame();
	}, counter);
}

function setCountDownDisplay(second) {
	changeInnerHTML('countdown', second);
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
	changeInnerHTML('points', 'Points:    <strong>' + points + '</strong>');
	changeInnerHTML('state', displayState.toString());
	for (var i = 1; i <= 5; i++) {	
		changeInnerHTML('life' + i, '&nbsp;');
	}for (var i = 1; i <= life; i++) {	
		changeInnerHTML('life' + i, '<i class="fa fa-heart"></i>');
	}
}

function drawSneak() {
	changeBackgroundColor(sneak[sneak.length - 1][0] + ',' + sneak[sneak.length - 1][1], 'rgb(123,66,12)');
	for (var i = 0; i < sneak.length - 1; i++) {
		changeBackgroundColor(sneak[i][0] + ',' + sneak[i][1], 'rgb(173,166,62)');
	}
}

function removeSneak() {
	for (var i = 0; i < sneak.length; i++) {
		changeBackgroundColor(sneak[i][0] + ',' + sneak[i][1], 'rgba(200,200,200,0.3)');
	}
}

function crash() {
	sneakhitsWall = true;
	objectOrWallAudio.play();
	life--;
	updatePanel();
}

function tryMoveUp() {
	if(sneak[sneak.length - 1][0] > 0) {
		sneak[sneak.length - 1][0]--;
	} else {
		crash();
		if(life === 0) {
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
		crash();
		if(life === 0) {
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
		crash();
		if(life === 0) {
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
		crash();
		if(life === 0) {
			end = true;
		} else {
			reset();
			return;			
		}
	}
}

function controlSneak() {
   switch(dir){
        case 'UP': 		tryMoveUp(); 	break;
        case 'DOWN': 	tryMoveDown(); 	break;
        case 'LEFT': 	tryMoveLeft(); 	break;
        case 'RIGHT': 	tryMoveRight(); break;
    }
}

function moveSneak() {
    removeSneak();
    var lgt = sneak.length - 1;
    for (var i = 0; i < lgt; i++){
        sneak[i][0] = sneak[i + 1][0];
        sneak[i][1] = sneak[i + 1][1];
    }
 	controlSneak();
 	drawSneak();
}

function tryDirUp() {
	if(dir !== "DOWN")  dir = "UP";
}

function tryDirDown() {
	if(dir !== "UP") dir = "DOWN";
}

function tryDirLeft() {
	if(dir !== "RIGHT") dir = "LEFT";
}

function tryDirRight() {
	if(dir !== "LEFT") dir = "RIGHT";
}

function arrowPressed(e) {
	var key = e.key ? e.key : e.code;
	e.preventDefault();
	switch(key) {
		case 'ArrowUp': 
			if(mirrorsActive === true) tryDirDown();
			else tryDirUp(); 
			break; 
		case 'ArrowDown': 
			if(mirrorsActive === true) tryDirUp(); 
			else tryDirDown(); 
			break; 
		case 'ArrowLeft': 
			if(mirrorsActive === true) tryDirRight(); 				
			else tryDirLeft(); 				
			break; 
		case 'ArrowRight': 
			if(mirrorsActive === true) tryDirLeft();
			else tryDirRight(); 
			break;
	}						
}

function isThereAScroll(x, y) {
	return scroll[0] === x && scroll[1] === y;
}

function checkIfThereIsSneak(x, y) {
	for (var i = 0; i < sneak.length; i++) {
		if(sneak[i][0] === x && sneak[i][1] === y) return false;
	}
	return true;
}

function checkIfThereIsObject(x, y) {
	for (var j = 0; j < objects.length; j++) {
		if(objects[j][0] === x && objects[j][1] === y) return false;
	}
	return true;
}


function validCoords(x, y) {
	return checkIfThereIsSneak(x, y) && checkIfThereIsObject(x, y);
}

function createNewObject() {
	var try_XY = [Math.floor((Math.random() * N)), Math.floor((Math.random() * M))];
	while(!validCoords(try_XY[0], try_XY[1])) {
		try_XY = [Math.floor((Math.random() * N)), Math.floor((Math.random() * M))];
	}
	return [try_XY[0], try_XY[1], true, getRandomScrollType()];
}

function sneakGrows(){
    sneak.push([sneak[sneak.length - 1][0], sneak[sneak.length - 1][1]]);
}

function sneakHitsItSelf() {
    var j = 0;
    var lgt = sneak.length - 1;
    var head = [sneak[lgt][0], sneak[lgt][1]];
    while(j < lgt ) {
    	if(sneak[j][0] === head[0] && sneak[j][1] === head[1]) {
	    	crash();
	    	removeSneak();
	    	reset();
			return true;	    		
    	} 
    	j++;
    }
	return false;
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
	if(!end) end = sneakHitsItSelf() || sneakhitsWall || life < 1; 
	checking();
}

function handleScrollPickUp(param) {
	switch(param) {
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
}

function checking() {
	if(!end) {
		var lgt = sneak.length - 1;
	    if (isThereAScroll(sneak[lgt][0], sneak[lgt][1])) {
	    	pickUpAudio.play();
	    	speedDown();
			mirrorsActive = false;
	    	scroll[2] = false
	    	displayState = '<strong>' + scroll[3] + '</strong>'; 
	    	handleScrollPickUp(scroll[3]);
			scroll = createNewObject();
		} else if (isThereObject(sneak[lgt][0], sneak[lgt][1])) {
			crash();
			if(life === 0) {
				end = true;
				return;
			} else {
				reset();
				return;
			}
		} else if(isThereHeart(sneak[lgt][0], sneak[lgt][1])) {
			heartAudio.play();
			removeHeart();
			if(life < 5) life++;
		}
	   	drawscroll();
		moveSneak();
		keyPressed = false;
		drawObjects();
		tryMakeHeart();
	} else {
		if(life === 0) {
			life--;
			youFailed();
			clearInterval(interval);
			endGame();
			return;
		} else {
			reset();
			return;
		}			
	}
}

function isThereHeart(x, y) {
	return heart === '' ? false : heart[0] === x && heart[1] === y;	
}

function drawHeart() {
	changeInnerHTML(heart[0] + ',' + heart[1], '<i id="heartSpan" class="fa fa-heart"></i>');
}

function tryMakeHeart() {
	if(heart === '' && Math.floor(Math.random() * 1000) < 3) {
		heart = createNewObject();
		heart[3] = 'Heart';
		drawHeart();
	}
}

function removeHeart() {
	changeInnerHTML(heart[0] + ',' + heart[1], '&nbsp;');
	heart = '';
}

function youFailed() {
	new Audio('laugh' + (Math.floor(Math.random() * 2) + 2) + '.mp3').play();
	showPoints();
}

function reset() {	
	speedDown();
	displayState = '&nbsp;';
	removeSneak();
	sneakhitsWall = false;
	mirrorsActive = false;
	end = false;
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
	removeTable();
	changeInnerHTML('points', '&nbsp;');
	changeInnerHTML('state', '&nbsp;');
	changeInnerHTML('countdown', '&nbsp;');
	changeInnerHTML('life1', '&nbsp;');
	changeInnerHTML('life2', '&nbsp;');
	changeInnerHTML('life3', '&nbsp;');
	changeInnerHTML('life4', '&nbsp;');
	changeInnerHTML('life5', '&nbsp;');
	dir = "RIGHT";
	points = 1;
	displayState = '';
}

function removeTable() {
	document.getElementById('table2').remove();
}	

function clearSneak() {
	sneak = [[srt,0]];;
}

function clearObjects() {
	objects = [];
}

function clearMap() {
    for (var i = 0; i < N; i++) {
        for (var j = 0; j < M; j++) {
        	changeBackgroundColor(i + ',' + j, 'rgba(200,200,200,0.3)');
        }
    }

}

function reverseSneak() {
	for (var i = 0; i < Math.floor((sneak.length + 1) / 2); i++) {
		changeNums(i, sneak.length - 1 - i);
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
		changeBackgroundColor(objects[i][0] + ',' + objects[i][1], 'black');
		document.getElementById(objects[i][0] + ',' + objects[i][1]).style.borderRadius = '0px';
	}
}

function drawscroll() {
	if(scroll[0] < N && scroll[1] < M && scroll[2]) {
		var color;
		switch(scroll[3]) {
			case 'Wisdom'	: 	color = "yellow"; 	break;
			case 'Mirrors'	: 	color = "magenta"; 	break;
			case 'Reverse'	: 	color = "pink"; 	break;
			case 'Greed'	: 	color = "blue"; 	break;
			case 'Laziness'	: 	color = "green"; 	break;
			case 'Gluttony'	: 	color = "orange"; 	break;
		}
		if(scroll[3] === 'Heart') {
			changeInnerHTML(scroll[0] + ',' + scroll[1], '<i id="heartSpan" class="fa fa-heart"></i>');
			changeColor(scroll[0] + ',' + scroll[1], color);
		} else {
			changeBackgroundColor(scroll[0] + ',' + scroll[1], color);
		}
	}
}

function displayInfoTable() {
	document.getElementById('table').style.display = 'table';
	document.getElementById('table').style.margin = '0 auto';
	document.getElementById('table').className = 'text-center';	
}

// Start
function start() {
	var n = document.getElementById('N').value;	
	var m = document.getElementById('M').value;	
	var k = document.getElementById('K').value;	
	if(n !== '' || m !== '' || k !== '') {
		if( (n !== '' && (n >= 23 || n <= 4))  || 
			(m !== '' && (m >= 46 || m <= 4)) || 
			(k !== '' && (k >= 20 || k < 0))){
				return;
			}
	}
	var pointsH2 = document.getElementById('PointsH2');
	if(pointsH2 !== null) pointsH2.remove();
	if(end === true) {
		end = false;
		gongAudio.play();
		displayInfoTable();
		life = 3;
		N = n === '' ? 20 : n;
		M = m === '' ? 30 : m;
		K = k === '' ? 2 : k;
		srt = N % 2 == 0 ? N / 2 : (N - 1) / 2; 
		sneak = [[srt,0]];
		dir = "RIGHT";
		sneakhitsWall = false;
		mirrorsActive = false;
		counter = 75;
		createMap();
		adjustPanel();
		makeObjects();
		drawObjects();
		scroll = createNewObject();
		addMainListener();
		setTimeout(function() {
			interval = setInterval(function() {
				frame();
			}, counter);
		}, 1000);	
	} else {

	}
}

function addMainListener() {
	document.addEventListener("keydown", function(e) {
		if(!keyPressed) {
			var key = e.key ? e.key : e.code;
			switch(key) {
				case ' ': case 'ArrowUp': case 'ArrowDown': case 'ArrowLeft': case 'ArrowRight': arrowPressed(e);
			}								
			keyPressed = true;
		}
	}, false);
}

document.getElementById('start-btn').addEventListener('click', start, false);
document.getElementById('table').style.display = 'none';
