//setting parameters for the attacker
function attackerDiceRoll(diceNumber) {
    //set default, max
    if (diceNumber > 3 || diceNumber == 0 || diceNumber == null) {
        diceNumber = 3;
    }
    return createDiceRoll(diceNumber);
}

//setting parameters for the defender
function defenderDiceRoll(diceNumber) {
    //set default, max
    if (diceNumber > 2 || diceNumber == 0 || diceNumber == null) {
        diceNumber = 2;
    }
    return createDiceRoll(diceNumber);
}

//create rolls for specific situation
function createDiceRoll(diceNumber) {
    var diceRollResult = new Array();
    //for the number of rolls
    for (var i = 0; i < diceNumber; i++) {
        diceRollResult[i] = diceRoll(6);
    }
    return diceRollResult;
}

//determine the winner of the specific situation
function determineWinner(attacker, defender, total) {
    //sort both situations descending
    attacker.sort(function(a, b) { return b - a });
    defender.sort(function(a, b) { return b - a });
    defenderLoss = 0;
    //check losses for 2 dices
    if (defender[0] < attacker[0]) { //first dice
        defenderLoss++;
    }
    if (attacker.length > 1 && defender.length > 1 && defender[1] < attacker[1]) { //second dice
        defenderLoss++;
    }
    //alert(attacker.length + " " + defender.length);
    //define outcome, who is winner
    if (defenderLoss == 2) { //attacker wins 2 dice
        total[0]++;
        return new Array(0, "Att. wins 2");
    } else if (defenderLoss == 1 && (attacker.length == 1 || defender.length == 1)) { //attacker wins single dice
        total[0]++;
        return new Array(1, "Att. wins 1");
    } else if (defenderLoss == 1) { // tied, each loses 1
        total[1]++
        return new Array(2, "Tie (1:1)");
    } else if (defenderLoss == 0 && (attacker.length == 1 || defender.length == 1)) { //defender wins single dice
        total[2]++;
        return new Array(3, "Def. wins 1");
    } else if (defenderLoss == 0) { //defender wins 2 dice
        total[2]++;
        return new Array(4, "Def. wins 2");
    } 
}