///setting parameters for the attacker
//diceNumber - the number of dice attacker throws, fixes upper bound
function attackerDiceRoll(diceNumber) {
    //set default, max
    if (diceNumber > 3 || diceNumber == 0 || diceNumber == null) {
        diceNumber = 3;
    }
    return createDiceRoll(diceNumber);
}

//setting parameters for the defender
//diceNumber - the number of dice defender throws, fixed upper bounds
function defenderDiceRoll(diceNumber) {
    //set default, max
    if (diceNumber > 2 || diceNumber == 0 || diceNumber == null) {
        diceNumber = 2;
    }
    return createDiceRoll(diceNumber);
}

///create rolls for specific situation
//diceNumber - create the number of dice rolls
function createDiceRoll(diceNumber) {
    var diceRollResult = new Array();
    //for the number of rolls
    for (var i = 0; i < diceNumber; i++) {
        diceRollResult[i] = diceRoll(6);
    }
    return diceRollResult;
}

///determine the winner of the specific situation
//attacker - array for attacker dice
//defender - array for defender dice
//total - the total score in the format of Attacker - Tie - Defender
//returnSorted - if we want the dice results to be sorted, e.g. 3,1,4 into 4,3,1 (default = true)
function determineWinner(attacker, defender, score, returnSorted) {
    //by default we sort results
    if (returnSorted == null) {
        returnSorted = true;
    }
    //decide if we want sorted battle or not (all vs. battle) - reference vs. clone
    if (returnSorted) {
        attackerSorted = attacker;
        defenderSorted = defender;
    } else {
        attackerSorted = attacker.slice(0);
        defenderSorted = defender.slice(0);
    }
    //sort both situations descending
    attackerSorted.sort(function(a, b) { return b - a });
    defenderSorted.sort(function(a, b) { return b - a });
    //start position
    defenderLoss = 0;
    //check losses for 2 dices
    if (defenderSorted[0] < attackerSorted[0]) { //first dice
        defenderLoss++;
    }
    if (attackerSorted.length > 1 && defenderSorted.length > 1 && defenderSorted[1] < attackerSorted[1]) { //second dice
        defenderLoss++;
    }
    //alert(attacker.length + " " + defender.length);
    //define outcome, who is winner
    if (defenderLoss == 2) { //attacker wins 2 dice
        score[0]++;
        return new Array(0, "Att. wins 2");
    } else if (defenderLoss == 1 && (attackerSorted.length == 1 || defenderSorted.length == 1)) { //attacker wins single dice
        score[0]++;
        return new Array(1, "Att. wins 1");
    } else if (defenderLoss == 1) { // tied, each loses 1
        score[1]++
        return new Array(2, "Tie (1:1)");
    } else if (defenderLoss == 0 && (attackerSorted.length == 1 || defenderSorted.length == 1)) { //defender wins single dice
        score[2]++;
        return new Array(3, "Def. wins 1");
    } else if (defenderLoss == 0) { //defender wins 2 dice
        score[2]++;
        return new Array(4, "Def. wins 2");
    } 
}