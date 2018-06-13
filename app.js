var grid = [
	[0, 0, 0, 0], 
	[0, 0, 0, 0], 
	[0, 0, 0, 0], 
	[0, 0, 0, 0]];

var score = 0;
var highestscore = localStorage.getItem('highestscore') || 0;
document.getElementsByClassName('highestscore-board')[0].getElementsByClassName('highest-score')[0].innerHTML = highestscore;


function gridEqual(grid1, grid2){
	for(var i = 0; i < 4; i++){
		for(var j = 0; j < 4; j++){
			if(grid1[i][j] !== grid2[i][j]){
				return false
			}
		}
	}
	return true
}

function drawCells(){
	var rows = document.getElementsByClassName('grid-row');
	var scoreContainer = document.getElementsByClassName('score-container')[0];
	for(var i = 0; i < 4; i++){
		var cells = rows[i].getElementsByClassName('grid-cell');
		for(var j = 0; j < 4; j++){
			if(grid[i][j] != 0){
				cells[j].innerHTML = grid[i][j];
				cells[j].style.textAlign = "center";;
			}
			else{
				cells[j].innerHTML = "";
			}
		}
	}
	for(var i = 0; i < 4; i++){
		cells = rows[i].getElementsByClassName('grid-cell');
		for(var j = 0; j < 4; j++){
			if(grid[i][j] == 0){
				cells[j].style.background = "#febe7e";
			}
			else if(grid[i][j] == 2){
				cells[j].style.background = "#e4f68f";
			}
			else if(grid[i][j] == 4){
				cells[j].style.background = "#a9d7f6";
			}
			else if(grid[i][j] == 8){
				cells[j].style.background = "#f19cbb";
			}
			else if(grid[i][j] == 16){
				cells[j].style.background = "#ccccff";
			}
			else if(grid[i][j] == 32){
				cells[j].style.background = "#faebd7";
			}
			else if(grid[i][j] == 64){
				cells[j].style.background = "#b2beb5";
			}
			else if(grid[i][j] == 128){
				cells[j].style.background = "#c4d8e2";
			}
			else if(grid[i][j] == 256){
				cells[j].style.background = "#fb607f";
			}
			else if(grid[i][j] == 512){
				cells[j].style.background = "#ffc1cc";
			}
			else if(grid[i][j] == 1024){
				cells[j].style.background = "#a3c1ad";
			}
			else if(grid[i][j] == 2048){
				cells[j].style.background = "#00bfff";
			}
			else if(grid[i][j] == 4096){
				cells[j].style.background = "#ffb7c5";
			}
		}
	}
	scoreContainer.getElementsByClassName('current-score')[0].innerHTML = score;
	if(score > highestscore){
		var tempScore = parseInt(score);
		localStorage.setItem('highestscore', tempScore);
		document.getElementsByClassName('highestscore-board')[0].getElementsByClassName('highest-score')[0].innerHTML = score;
	}
	if(isGameOver(grid)){
		console.log("game over");
	}
}

function copyGrid(grid){
	var newGrid = [];
	for(var i = 0; i < 4; i++){
		newGrid.push([]);
		for(var j = 0; j < 4; j++){
			newGrid[i].push(grid[i][j]);
		}
	}
	return newGrid
}


function addNumber(grid){
	var options = [];
	for(var i = 0; i < 4; i++){
		for(var j = 0; j < 4; j++){
			if(grid[i][j] === 0){
				options.push([i,j]);
			}
		}
	}
	if(options.length > 0){
		var spot = options[Math.floor(Math.random() * options.length)];
		var twoOrFour = Math.round(Math.random() - 0.3);
		grid[spot[0]][spot[1]] = twoOrFour === 0? 2 : 4;
	}
}

function slideLeft(row){
	var newRow = [];
	var j = 0
	for(var i = 0; i < 4; i++){
		if(row[i] !== 0){
			newRow[j] = row[i];
			j += 1
		}
	}
	var missing = 4 - newRow.length;
	while(missing > 0){
		newRow.push(0);
		missing -= 1;
	}
	return newRow
}
function combineLeft(row){
	var newRow = [];
	var i = 0;
	while(i < 4){
		j = i + 1;
		if(j < 4){
			if(row[j] == row[i]){
				newRow.push(2 * row[i]);
				score += 2 * row[i];
				i += 2
			} 
			else{
				newRow.push(row[i]);
				i += 1;
			}
		}
		else{
			newRow.push(row[i]);
			i += 1;
		}
	}
	var missing = 4 - newRow.length;
	while(missing > 0){
		newRow.push(0);
		missing -= 1;
	}
	return newRow
}

function leftOperation(grid){
	var newGrid = [];
	for(var i = 0; i < 4; i++){
		newGrid.push(combineLeft(slideLeft(grid[i])));
	}
	return newGrid
}

function slideAndCombineRight(row){
	var newRow = [];
	newRow = combineLeft(slideLeft(row.reverse())).reverse();
	return newRow
}

function rightOperation(grid){
	var newGrid = [];
	for(var i = 0; i < 4; i++){
		newGrid.push(slideAndCombineRight(grid[i]));
	}
	return newGrid
}

function slideAndCombineUp(grid, j){
	var column = [];
	for(var i = 0; i < 4; i++){
		column.push(grid[i][j]);
	}
	column = combineLeft(slideLeft(column));
	for(var i = 0; i < 4; i++){
		grid[i][j] = column[i];
	}
	return grid
}

function upOperation(grid){
	var newGrid = [];
	for(var j = 0; j < 4; j++){
		newGrid = slideAndCombineUp(grid, j)
	}
	return newGrid;
}

function slideAndCombineDown(grid, j){
	var column = [];
	for(var i = 0; i < 4; i++){
		column.push(grid[i][j]);
	}
	column = slideAndCombineRight(column);
	for(var i = 0; i < 4; i++){
		grid[i][j] = column[i];
	}
	return grid

}

function downOperation(grid){
	var newGrid = [];
	for(var j = 0; j < 4; j++){
		newGrid = slideAndCombineDown(grid, j)
	}
	return newGrid;
}

function isGameOver(grid){
	for(var i = 0; i < 4; i++){
		for(var j = 0; j < 4; j++){
			if(grid[i][j] == 0){
				return false
			}
			else if(i != 3 && grid[i][j] == grid[i+1][j]){
				return false
			}
			else if(j != 3 && grid[i][j] == grid[i][j+1]){
				return false
			}
		}
	}
	return true
}

$(document).ready(function(){
	addNumber(grid);
	addNumber(grid);
	drawCells();
});

$(document).keydown(function(e) {
	var previousGrid = copyGrid(grid);
	switch(e.which) {
    	case 37:
    	grid = leftOperation(grid);
    	drawCells();
    	break;

    	case 38:
    	// upMove.play(); 
    	// setTimeout(clearGrid,1000);
    	// setTimeout(redrawGrid,1000);
    	grid = upOperation(grid);
    	// setTimeout(drawCells,1010);
    	drawCells();
    	break;

    	case 39: 
    	grid = rightOperation(grid);
    	drawCells();
    	break;

    	case 40: 
    	grid = downOperation(grid);
    	drawCells();
    	break;

    	default: return; 
	}
	if(gridEqual(previousGrid, grid) === false){
		addNumber(grid);
		drawCells();
	}
	e.preventDefault(); 
});

// function upAnimation(grid){
// 	var target = document.getElementById('13');
// 	var pos = 0;
//   	var id = setInterval(frame, 5);
//   	function frame() {
//     	if (pos == 350) {
//       	clearInterval(id);
//     	} else {
//       		pos++; 
//       	elem.style.top = pos + 'px'; 
//       	elem.style.left = pos + 'px'; 
//     	}
//   	}

// }
var upMove = anime({
  targets: 'div.row4', 
  translateY: '-340%',
  autoplay: false,
  targets: 'div.row3',
  translateY: '-240%',
  autoplay: false
});


function clearGrid(){
	var rows = document.getElementsByClassName('grid-row');
	for(var i = 0; i < 4; i++){
		while (rows[i].hasChildNodes()) {
			rows[i].removeChild(rows[i].lastChild);
		}
	}
}

function redrawGrid(){
	var rows = document.getElementsByClassName('grid-row');
	for(var i = 0; i < 4; i++){
		for(var j = 0; j < 4; j++){
			var cellNode = document.createElement("div");
			cellNode.classList.add("grid-cell", `row${i+1}` );
			rows[i].appendChild(cellNode);
		}
	}
}
