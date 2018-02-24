function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}

function changeInnerHTML(id, strVal) {
	document.getElementById(id).innerHTML = strVal;	
}

function changeBackgroundColor(id, colorVal) {
	document.getElementById(id).style.backgroundColor = colorVal;	
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

	//console.log("element has been created!");
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
	//addBogyoListener();
}

function addBogyoListener() {
	document.getElementById('bogyok').addEventListener('click', function (e) {
	}, false);
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

