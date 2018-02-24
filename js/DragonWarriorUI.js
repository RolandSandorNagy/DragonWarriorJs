//-------------------------------------------------------------------------------------------------------
//--------------------------------------------MEGJELENÍTÉS-----------------------------------------------
//-------------------------------------------------------------------------------------------------------

function changeInnerHTML(id, strVal) {
	document.getElementById(id).innerHTML = strVal;	
}

function changeBackgroundColor(id, colorVal) {
	var element = document.getElementById(id);
	if(element === null) return;
	element.style.backgroundColor = colorVal;	
}

function changeColor(id, colorVal) {
	document.getElementById(id).style.color = colorVal;	
}

function getElementVaule(id) {
	return document.getElementById(id).value;
}

function createMap() {
	var body = document.getElementById('gameDiv');
    body.style.backgroundColor = 'rgba(255,255,255,0.3)';
    var tbl = document.createElement('table');
	tbl.id = "table2";
    tbl.style.backgroundColor = 'rgba(255,255,255,0.3)';
    tbl.setAttribute('border', '3');
    var tbdy = document.createElement('tbody');
    tbdy.style.backgroundColor = 'rgba(255,255,255,0)';
    for (var i = 0; i < N; i++) {
        var tr = document.createElement('tr');
        for (var j = 0; j < M; j++) {
            var td = document.createElement('td');
            td.id = i + "," + j;
        	td.className = "tds";
            td.borderSizing = "border-box";	
        	td.style.width = "20px !important";
        	td.style.height = "20px !important";
        	td.style.borderRadius = "10px";
        	td.style.border = "none";
        	td.style.backgroundColor = "rgba(255,255,255,0)";
        	td.innerHTML = "&nbsp;";
            tr.appendChild(td)
        }
        tbdy.appendChild(tr);
    }
    tbl.appendChild(tbdy);
    body.appendChild(tbl);
}

function showPoints() {
	var gameDiv = document.getElementById('gameDiv');
	var PointsH2 = document.createElement('h2');
	gameDiv.appendChild(PointsH2);		
	PointsH2.id = 'PointsH2';
	PointsH2.innerHTML = 'SCORE: &nbsp;&nbsp;&nbsp;&nbsp;' + points + 'pts';
	PointsH2.style.padding = '0 20px';
	PointsH2.style.textAlign = 'center';
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
	setTimeout(removeH2Points, 10000);
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
	for (var i = 1; i <= life; i++) {	
		changeInnerHTML('life' + i, '<i class="fa fa-heart-o heart"></i>');
	}
}

function displayInfoTable() {
	document.getElementById('table').style.display = 'table';
	document.getElementById('table').style.margin = '0 auto';
	document.getElementById('table').className = 'text-center';	
}

function clearMap() {
    for (var i = 0; i < N; i++) {
        for (var j = 0; j < M; j++) {
        	changeBackgroundColor(i + ',' + j, 'rgba(255,255,255,0)');
        }
    }
}

function drawObjects(objects) {
	for (var i = 0; i < objects.length; i++) {
		changeBackgroundColor(objects[i][0] + ',' + objects[i][1], 'black');
		document.getElementById(objects[i][0] + ',' + objects[i][1]).style.borderRadius = '0px';
	}
}

function drawSneak(sneak) {
	changeBackgroundColor(sneak[sneak.length - 1][0] + ',' + sneak[sneak.length - 1][1], 'rgb(123,66,12)');
	for (var i = 0; i < sneak.length - 1; i++) {
		changeBackgroundColor(sneak[i][0] + ',' + sneak[i][1], 'rgb(173,166,62)');
	}
}

function initElements() {
	document.getElementById('table').style.display = 'none';
	changeInnerHTML('points', '&nbsp;');
	changeInnerHTML('state', '&nbsp;');
	changeInnerHTML('countdown', '&nbsp;');
	changeInnerHTML('life1', '&nbsp;');
	changeInnerHTML('life2', '&nbsp;');
	changeInnerHTML('life3', '&nbsp;');
	changeInnerHTML('life4', '&nbsp;');
	changeInnerHTML('life5', '&nbsp;');
}
function removeH2Points() {
	removeElement('PointsH2');
}

function removeElement(id) {
	var element = document.getElementById(id);
	if(element !== null) element.remove();
}	
