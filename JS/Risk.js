///gets all total different results possible in risk
function allResults() {
    //show results
    document.getElementById("resultsAll").style.display = "block";
    //table header
    document.getElementById("resultsAllDetailed").innerHTML = "<tr><th align=\"right\">#</th><th>Attacker</th><th>Defender</th><th>Winner</th></tr>";
    //get the situation for attacker defender
    var numbers = document.getElementById("allType").value.split(',');
    var attackerNumber = parseInt(numbers[0]);
    var defenderNumber = parseInt(numbers[1]);
    //prepare array to store the number of dice for attacker defender (e.g. [1,1,1,1,1])
    var result = new Array();
    for (var i = 0; i < (attackerNumber + defenderNumber); i++) {
        result[i] = 1;
    }
    //final score logger attacker - tie - defender
    var score = [0, 0, 0];
    //counting fights
    var i = 0;
    //active dice is the one going ++, the last one for easier tracking
    activeDice = (attackerNumber + defenderNumber) - 1;
    //do while we have dice left
    while (activeDice >= 0) {
        //activeDice each time is the last one (goes + 1)
        activeDice = (attackerNumber + defenderNumber) - 1;
        //we are getting attacker and defender from results array
        var attacker = new Array();
        //take attacker from results, otherwise can't battle
        for (var j = 0; j < (attackerNumber); j++) {
            attacker[j] = result[j];
        }
        //take defender from results, otherwise can't battle
        var defender = new Array();
        for (var j = 0; j < (defenderNumber); j++) {
            defender[j] = result[j + attackerNumber];
        }
        //get results
        var winner = determineWinner(attacker, defender, score, false);
        //display battle
        battleBlankRender(document.getElementById("resultsAllDetailed"), attacker, defender, winner[1]);
        //go plus one
        result[activeDice]++;
        //we check if this dice is 7, change to 1, change next dice + 1, while not till the end
        while (result[activeDice] > 6) {
            result[activeDice] = 1;
            activeDice--;
            result[activeDice]++;
        }
        //counting fight
        i++;
    }
    //display final result
    document.getElementById("resultsAllTotals").innerHTML = "";
    battleTotalRender(document.getElementById("resultsAllTotals"), score, i);
}


///creating new battle
function battleResults() {
    //reset logs
    diceRollLogReset();
    //display results
    document.getElementById("resultsBattle").style.display = "block";
    
    //get attacker and defender inital position
    var attackerPosition = document.getElementById("player1").value;
    var defenderPosition = document.getElementById("player2").value;
    //if attacker and defender have position, do real battle, otherwise blank
    if (attackerPosition != '' && defenderPosition != '') {
        battleReal(attackerPosition, defenderPosition);
    } else {
        battleBlank();
    }
    //display log
    document.getElementById("diceRollLog").innerHTML = "<tr><th>Roll</th><th>Number</th><th>Relative</th><th>Expected</th><th>Deviation</th></tr>";
    diceRollLogRender(document.getElementById("diceRollLog"));
}


///blank battle without any numbers
function battleBlank() {
    //header
    document.getElementById("resultsBattleDetailed").innerHTML = "<tr><th align=\"right\">#</th><th>Attacker</th><th>Defender</th><th>Winner</th></tr>";
    //totals attacker -tie - defender
    var score = [0, 0, 0];
    //do 1000 roll situations
    for (var i = 0; i < 10000; i++) {
        //attacker defender go
        var attacker = attackerDiceRoll(3);
        var defender = defenderDiceRoll(2);
        //determine winner
        var winner = determineWinner(attacker, defender, score);
        //display fights, first 1000
        if (i < 1000) {
            battleBlankRender(document.getElementById("resultsBattleDetailed"), attacker, defender, winner[1]);
        }
    }
    //display final score
    document.getElementById("resultsBattleTotals").innerHTML = "";
    battleTotalRender(document.getElementById("resultsBattleTotals"), score, i);
}

///new real battle with fixed numbers
//attackerPosition - the number of armies for the attacker
//defencerPosition - comma separated number of armies in different territories for defender
function battleReal(attackerPosition, defenderPosition) {  
    //set initial values for rotation
    var attackerNumber = attackerPosition; var attackerWins = 0;
    var defenderNumbers = defenderPosition.split(','); var defenderWins = 0;
    //create header
    document.getElementById("resultsBattleDetailed").innerHTML = "<tr><th align=\"right\">#</th><th>Start</th><th>Attacker</th><th>Defender</th><th>Winner</th><th>End</th><th>Status</th></tr>";
    //totals attacker - tie- defender
    var score = [0, 0, 0];
    //set defender start position
    var defenderTeritory = 0;
    //roll 1000 situations
    for (var i = 0; i < 10000; i++) {
        //we have started the battle with start numbers, otherwise set satus to continue
        if (attackerNumber == attackerPosition && defenderNumbers == defenderPosition) {
            var status = "Start";
        } else {
            var status = "Continue";
        }
        //roll dices, attacker nees to leave 1 behind
        var attacker = attackerDiceRoll(attackerNumber - 1);
        var defender = defenderDiceRoll(defenderNumbers[defenderTeritory]);
        //get winner
        var winner = determineWinner(attacker, defender, score);
        //start situation
        var start = attackerNumber + " v " + defenderNumbers;
        //map results to numbers
        if (winner[0] == 0) { //attacker wins 2
            defenderNumbers[defenderTeritory]--; defenderNumbers[defenderTeritory]--;
        } else if (winner[0] == 1) { //attacker wins 1
            defenderNumbers[defenderTeritory]--;
        } else if (winner[0] == 2) { // tie
            defenderNumbers[defenderTeritory]--; attackerNumber--;
        } else if (winner[0] == 3) { //defender wins 1
            attackerNumber--;
        } else if (winner[0] == 4) { //defender wins 2
            attackerNumber--; attackerNumber--;
        }
        //end situation
        var end = attackerNumber + " v " + defenderNumbers;

        //the defender has lost
        if (defenderNumbers[defenderTeritory] <= 0) {
            //defender lost the last teritory, reset
            if (defenderTeritory == defenderNumbers.length - 1) {
                attackerWins++;
                defenderTeritory = 0;
                attackerNumber = attackerPosition;
                defenderNumbers = defenderPosition.split(',');
                status = "<b>Att. occupies</b>";
            //defender has territories left
            } else {
                defenderTeritory++;
                //attacker leaves 1 behind
                attackerNumber--;
                status = "Att. proceeds";
            }
        }
        //the defender has survived, reset
        if (attackerNumber <= 1) {
            defenderWins++;
            defenderTeritory = 0;
            attackerNumber = attackerPosition;
            defenderNumbers = defenderPosition.split(',');
            status = "<b>Def. survives</b>";
        }
        //display battle
        if (i < 1000) {
            battleRealRender(document.getElementById("resultsBattleDetailed"), start, attacker, defender, winner[1], end, status);
        }
    }
    document.getElementById("resultsBattleTotals").innerHTML = "Attacker occupies: <b>" + attackerWins + "</b> (" + (attackerWins / (attackerWins + defenderWins) * 100).toFixed(2) + "%)<br>";
    document.getElementById("resultsBattleTotals").innerHTML += "Defender survives: <b>" + defenderWins + "</b> (" + (defenderWins / (attackerWins + defenderWins) * 100).toFixed(2) + "%)<br/>";
    document.getElementById("resultsBattleTotals").innerHTML += "Total simulations: <b>" + (defenderWins + attackerWins) + "</b><br/><br/>";

    battleTotalRender(document.getElementById("resultsBattleTotals"), score, i);
    
}


///displaying battle result for blank situation
//table - html table to display results to
//attacker - attacker dice throws
//defender - defender dice throws
//winner - winner as string (e.g. Attacker wins 2)
function battleBlankRender(table, attacker, defender, winner) {
    var row = table.insertRow(table.rows.length);
    insertCells(row, 4);
    row.cells[0].innerHTML = "<b>" + (table.rows.length - 1) + "</b>";
    row.cells[1].innerHTML = attacker;
    row.cells[2].innerHTML = defender;
    row.cells[3].innerHTML = winner;
}

///displaying battle result for real situation
//table - html table to display results to
//start - start dice situation (e.g. 10 vs. 7,2)
//attacker - attacker dice throws
//defender - defender dice throws
//winner - winner as string (e.g. Attacker wins 2)
//end - end dice situation
//status - status of the battle (e.g. Attacker continues)
function battleRealRender(table, start, attacker, defender, winner, end, status) {
    var row = table.insertRow(table.rows.length);
    insertCells(row, 7);
    row.cells[0].innerHTML = "<b>" + (table.rows.length - 1) + "</b>";
    row.cells[1].innerHTML = start;
    row.cells[2].innerHTML = attacker;
    row.cells[3].innerHTML = defender;
    row.cells[4].innerHTML = winner;
    row.cells[5].innerHTML = end;
    row.cells[6].innerHTML = status;
}

///display final score for the battle
//div - the div to add the score to
//score - the score array attacker - tie - defender
//totalNumber - total number of battles, for relative numbers
function battleTotalRender(div, score, totalNumber) {
    div.innerHTML += "Attacker wins: <b>" + score[0] + "</b> (" + (score[0] / totalNumber * 100).toFixed(2) + "%)<br/>";
    div.innerHTML += "Tie: <b>" + score[1] + "</b> (" + (score[1] / totalNumber * 100).toFixed(2) + "%)<br/>";
    div.innerHTML += "Defender wins: <b>" + score[2] + "</b> (" + (score[2] / totalNumber * 100).toFixed(2) + "%)<br/>";
    div.innerHTML += "Total fights: <b>" + totalNumber + "</b><br/>"; 
}
