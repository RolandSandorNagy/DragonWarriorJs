//-------------------------------------------------------------------------------------------------------
//-----------------------------------------GLOBÁLIS VÁLTOZÓK---------------------------------------------
//-------------------------------------------------------------------------------------------------------

var scrollTypes = [];
var objects = [];
var sneak = [];
var mirrorsActive = false;
var keyPressed = false;
var end = true;
var dirInit = 'RIGHT';
var displayState = '';
var heart = '';
var scrollNumber = 25;		
var counterInit = 75;
var rowsInit = 10;
var colsInit = 10;
var objsInit = 2;
var points = 1;
var interval;
var timeOut;
var counter;
var scroll;
var life;
var dir;
var	srt; 
var N;
var M;
var K;

//-------------------------------------------------------------------------------------------------------
//--------------------------------------------JÁTÉK LOGIKA-----------------------------------------------
//-------------------------------------------------------------------------------------------------------

function slowDown() {
	tick(5);
	//counter = 113;
	counter = Math.floor(counter * 1.5) + 1;
	console.log(counter);
	setTimeOutFunc();
	clearInterval(interval);
	setIntervalFunc(1, 5, 1017);
}

function tick(second) {
	new Audio('sfx/tick.mp3').play();
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
	//counter = 50;
	counter = Math.floor(counter / 1.5);
	console.log(counter);
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
	//counter = 75;
	counter = counterInit;
	clearInterval(interval);
	interval = setInterval(function() {
		frame();
	}, counter);
}

function setCountDownDisplay(second) {
	changeInnerHTML('countdown', second);
}

function getRandomScrollType() {
	return scrollTypes[Math.floor((Math.random() * scrollNumber))];
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
		changeInnerHTML('life' + i, '<i class="fa fa-heart heart"></i>');
	}
}

function removeSneak() {
	for (var i = 0; i < sneak.length; i++) {
		changeBackgroundColor(sneak[i][0] + ',' + sneak[i][1], 'rgba(255,255,255,0)');
	}
}

function crash() {
	new Audio('sfx/objectOrWall.mp3').play();
	life--;
	updatePanel();
	if(life === 0) {
		removeStartListener();
		end = true;
		endGame();
	} else {
		reset();
		return;			
	}
}


function tryMoveUp() {
	if(sneak[sneak.length - 1][0] > 0) sneak[sneak.length - 1][0]--;
	else crash();			
}
function tryMoveDown() {
	if(sneak[sneak.length - 1][0] < N-1) sneak[sneak.length - 1][0]++;
	else crash();
}
function tryMoveLeft() {
	if(sneak[sneak.length - 1][1] > 0) sneak[sneak.length - 1][1]--;	
	else crash();
}
function tryMoveRight() {
	if(sneak[sneak.length - 1][1] < M-1) sneak[sneak.length - 1][1]++;
	else crash();
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
    replaceSneakCoords();
 	controlSneak();
 	drawSneak(sneak);
}

function replaceSneakCoords() {
    var lgt = sneak.length - 1;
    for (var i = 0; i < lgt; i++){
        sneak[i][0] = sneak[i + 1][0];
        sneak[i][1] = sneak[i + 1][1];
    }
}

function tryDirUp() {
	if(dir !== 'DOWN')  dir = 'UP';
}

function tryDirDown() {
	if(dir !== 'UP') dir = 'DOWN';
}

function tryDirLeft() {
	if(dir !== 'RIGHT') dir = 'LEFT';
}

function tryDirRight() {
	if(dir !== 'LEFT') dir = 'RIGHT';
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
		if(sneak[i][0] === x && sneak[i][1] === y) return true;
	}
	return false;
}

function checkIfThereIsObject(x, y) {
	for (var j = 0; j < objects.length; j++) {
		if(objects[j][0] === x && objects[j][1] === y) return true;
	}
	return false;
}


function validCoords(x, y) {
	return !checkIfThereIsSneak(x, y) && !checkIfThereIsObject(x, y);
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
    var lgt = sneak.length - 1;
    for (var i = 0.; i < lgt; i++) {
      	if(sneak[i][0] === sneak[lgt][0] && sneak[i][1] === sneak[lgt][1]) {
			return true;	    		
    	} 
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

function pickUpTheScroll() {
	mirrorsActive = false;
	scroll[2] = false
	changeInnerHTML(scroll[0] + ',' + scroll[1], '&nbsp;');
	new Audio('sfx/scrollPickUp.mp3').play();
	speedDown();
	displayState = '<strong>' + scroll[3] + '</strong>'; 
	handleScrollPickUp(scroll[3]);
	scroll = createNewObject();
}

function checking() {
	if(end) {
		//endGame();
		return;
	}
	var lgt = sneak.length - 1;
    if(isThereAScroll(sneak[lgt][0], sneak[lgt][1])) {
    	pickUpTheScroll();
	} else if(isThereObject(sneak[lgt][0], sneak[lgt][1]) || sneakHitsItSelf()) {
		crash();
		return;
	} else if(isThereHeart(sneak[lgt][0], sneak[lgt][1])) {
		if(heart[3] == 'Heart') life = life + 1 > 5 ? 5 : life + 1; 
		else if(heart[3] == 'Heart2') life = 5; 
		new Audio('sfx/heart.mp3').play();
		removeHeart();
	}
   	drawscroll();
	moveSneak();
	keyPressed = false;
	drawObjects(objects);
	tryMakeHeart();
}

function isThereHeart(x, y) {
	return heart === '' ? false : heart[0] === x && heart[1] === y;	
}

function drawHeart() {
	if(heart[3] === 'Heart2')
		changeInnerHTML(heart[0] + ',' + heart[1], '<i id="heartSpan" class="fa fa-heart heart"></i>');
	else
		changeInnerHTML(heart[0] + ',' + heart[1], '<i id="heartSpan" class="fa fa-heart-o heart"></i>');
}

function tryMakeHeart() {
	if(heart === '' && Math.floor(Math.random() * 1000) < 3) {
		heart = createNewObject();
		heart[3] = Math.floor(Math.random() * 1000) < 3 ? 'Heart2' : 'Heart';
		drawHeart();
	}
}

function removeHeart() {
	changeInnerHTML(heart[0] + ',' + heart[1], '&nbsp;');
	heart = '';
}

function youFailed() {
	new Audio('sfx/laugh' + (Math.floor(Math.random() * 2) + 1) + '.mp3').play();
	showPoints();
}

function endGame() {
	clearInterval(interval);
	removeControlListener();
	life--;
	youFailed();
	clearSneak();
	clearObjects();
	clearMap();
	removeElement('table2');
	initElements();
	dir = dirInit;
	points = 1;
	displayState = '';
	addStartListener();
}

function clearSneak() {
	sneak = [[srt,0]];;
}

function clearObjects() {
	objects = [];
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
			changeInnerHTML(scroll[0] + ',' + scroll[1], '<i id="heartSpan" class="fa fa-heart-o heart"></i>');
			changeColor(scroll[0] + ',' + scroll[1], color);
		} else if(scroll[3] === 'Heart2') {
			changeInnerHTML(scroll[0] + ',' + scroll[1], '<i id="heartSpan" class="fa fa-heart heart"></i>');
			changeColor(scroll[0] + ',' + scroll[1], color);
		} else {
			changeBackgroundColor(scroll[0] + ',' + scroll[1], color);
			changeColor(scroll[0] + ',' + scroll[1], 'black');
			changeInnerHTML(scroll[0] + ',' + scroll[1], '<i class="fa fa-bullseye at"></i>');
		}
	}
}

function initNMK() {
	N = getElementVaule('N') == '' ? rowsInit : getElementVaule('N');
	M = getElementVaule('M') == '' ? colsInit : getElementVaule('M');
	K = getElementVaule('K') == '' ? objsInit : getElementVaule('K');
}

function initGame() {
	clearTimeout(removeH2Points, 10000);
	srt = N % 2 == 0 ? N / 2 : (N + 1) / 2; 
	scrollTypes = calcScrollTypes();
	displayInfoTable();
	new Audio('sfx/gong.mp3').play();
	removeH2Points();
	mirrorsActive = false;
	end = false;
	sneak = [[srt,0]];
	//counter = 75;
	counter = counterInit;
	dir = dirInit;
	life = 3;
}

function calcScrollTypes() {
	var scrolls = new Array();
	var k = 0;
	var scNum = 0;
	for(var i = 0; i < 25; i++) {
		if(i % 5 === 0) {
			switch(k) {				
				case 0: if(bogyoON(2)) { scNum++; scrolls.push('Mirrors'); } break;
				case 1: if(bogyoON(3)) { scNum++; scrolls.push('Reverse'); } break;
				case 2: if(bogyoON(4)) { scNum++; scrolls.push('Greed'); } break;
				case 3: if(bogyoON(5)) { scNum++; scrolls.push('Laziness'); } break;
				case 4: if(bogyoON(6)) { scNum++; scrolls.push('Gluttony'); } break;
			}
			k++;
		} else {
			if(bogyoON(1)) { scNum++; scrolls.push('Wisdom') };
		}
	}
	scrollNumber = scNum;
	return scrolls;
}

function bogyoON(szam) {
	var color = document.getElementById("bogyo" + szam).style.backgroundColor;
	var l = color !== 'rgb(211, 211, 211)';
	return l;
}

function allBogyoOFF() {
	var c = 0;
	for (var i = 1; i <= 6; i++) {
		if(!bogyoON(i)) c++;
	};
	return c === 6;
}

function startInterval() {
	setTimeout(function() {
		interval = setInterval(function() {
			frame();
		}, counter);
	}, 1000);	

}

function reset() {	
	speedDown();
	displayState = '&nbsp;';
	removeSneak();
	mirrorsActive = false;
	end = false;
	sneak = [[srt, 0]];
	dir = dirInit;
}

function getBogyoColor(id) {
	switch(id) {
		case 'bogyo1': return "yellow";
		case 'bogyo2': return "pink";
		case 'bogyo3': return "magenta";
		case 'bogyo4': return "blue";
		case 'bogyo5': return "green";
		case 'bogyo6': return "orange";
	} 
}

function start() {
	initNMK();
	if( N < 10 || M < 10 || K <  0 || 
		N > 22 || M > 45 || K > 19 || 
		end === false || allBogyoOFF() ) return;
	initGame();
	createMap();
	adjustPanel();
	makeObjects();
	drawObjects(objects);
	scroll = createNewObject();
	addControlListener();
	startInterval();
}

//-------------------------------------------------------------------------------------------------------
//--------------------------------------------ESEMÉNYKEZELÉS---------------------------------------------
//-------------------------------------------------------------------------------------------------------

function addControlListener() {
	document.addEventListener("keydown", function(e) {
		if(!keyPressed) {
			var key = e.key ? e.key : e.code;
			switch(key) {
				case 'ArrowUp': case 'ArrowDown': case 'ArrowLeft': case 'ArrowRight': arrowPressed(e);
			}								
			keyPressed = true;
		}
	}, false);
}

function removeControlListener() {
	document.removeEventListener("keydown", function(e) {
		if(!keyPressed) {
			var key = e.key ? e.key : e.code;
			switch(e.key) {
				case 'ArrowUp': case 'ArrowDown': case 'ArrowLeft': case 'ArrowRight': arrowPressed(e);
			}
			keyPressed = true;
		}
	}, false);
}

function addStartListener() {
	document.getElementById('start-btn').addEventListener('click', start, false);
}

function removeStartListener() {
	document.getElementById('start-btn').removeEventListener('click', start, false);	
}

function addBogyoListener() {
	document.getElementById('bogyok').addEventListener('click', function (e) {
		if(e.target.tagName === 'I' || 
			e.target.tagName === 'TD' ) {
			var id = e.target.id;
			if(e.target.tagName === 'I') {
				var id = e.target.parentNode.id;
			}
			var color = document.getElementById(id).style.backgroundColor;
			if ( color !== 'rgb(211, 211, 211)' ) {
				color = 'rgb(211, 211, 211)';
			} else {
				color = getBogyoColor(id);
			}
			changeBackgroundColor(id, color);
		}
	}, false );
}

function addListeners() {
	addBogyoListener();
	addStartListener();
}


addListeners();
