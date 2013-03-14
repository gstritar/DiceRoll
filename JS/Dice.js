//logging dice rolls
var diceRollLog = new Array();
var diceRollThrows = 0;

///rolls N-sided dice, default = 6
function diceRoll(sides) {
    //set default value
    if (sides == null) {
        sides = 6;
    }
    //calculate result
    var result = Math.floor((Math.random() * sides) + 1);
    //log result
    diceRollThrows++;
    //we are working with open array for n-sided dice, so hack this for flexibility
    if (diceRollLog[result] == null) {
        diceRollLog[result] = 1;
    } else {
        diceRollLog[result]++;
    }
    //return;
    return result;
}

///reseting dice roll log before next game
function diceRollLogReset() {
    //reset log rolls and number
    diceRollLog = new Array();
    diceRollThrows = 0;
}

///displays dice roll results log
function diceRollLogRender(table) {
    //calculate totals for checking
    var diceTotals = new Array(0, 0, 0, 0);
    var diceSides = 0;
    //count the number of dice sides
    for (var i = 0; i < diceRollLog.length; i++) {
        //check all items in array that have value (0 is ignored)
        if (diceRollLog[i] != null && diceRollLog[i] != 0) {
            diceSides++;
        }
    }
    //display results for dice throws, they are indexed in array
    for (var i = 0; i < diceRollLog.length; i++) {
        if (diceRollLog[i] != null && diceRollLog[i] != 0) {
            //double checking sums
            diceTotals[0] += diceRollLog[i]; //total throws
            diceTotals[1] += (diceRollLog[i] * 100) / (diceRollThrows); //relative throws for each
            diceTotals[2] += (100 / diceSides); //expected for this dice throw
            diceTotals[3] += (((diceRollLog[i] * 100) / (diceRollThrows)) - 100 / diceSides); //deviation to expected

            //create new row and cells
            var row = table.insertRow(table.rows.length);
            //insert 5 cells
            insertCells(row, 5);
            //display results for single dice result
            row.cells[0].innerHTML = "<b>" + i + "</b>";
            row.cells[1].innerHTML = diceRollLog[i];
            row.cells[2].innerHTML = "<b>" + ((diceRollLog[i] * 100) / (diceRollThrows)).toFixed(2) + "%</b>";
            row.cells[3].innerHTML = (100 / diceSides).toFixed(2) + "%";
            row.cells[4].innerHTML = (((diceRollLog[i] * 100) / (diceRollThrows)) - 100 / diceSides).toFixed(2) + "p.p.";
        }
    }
    //insert totals row
    var row = table.insertRow(table.rows.length);
    //insert 5 cells
    insertCells(row, 5);
    //display total results for double checking
    row.cells[0].innerHTML = "<b>Total</b>";
    row.cells[1].innerHTML = diceTotals[0];
    row.cells[2].innerHTML = "<b>" + diceTotals[1].toFixed(2) + "%</b>";
    row.cells[3].innerHTML = diceTotals[2].toFixed(2) + "%";
    row.cells[4].innerHTML = Math.abs(diceTotals[3].toFixed(2)) + "p.p.";
}

///add x right aligned cells to a table row
function insertCells(row, number) {
    //loop the cells by number
    for (var i = 0; i < number; i++) {
        var cell = row.insertCell(i);
        cell.align = "right";
    }
}

//show hide dice detailed throw distribution
function diceRollLogShow(link, element) {
    if (document.getElementById(element).style.display == 'none') {
        document.getElementById(element).style.display = 'block';
        document.getElementById(link).innerHTML = "Hide throws distribution";
    } else {
        document.getElementById(element).style.display = 'none';
        document.getElementById(link).innerHTML = "Show throws distribution";
    }
}