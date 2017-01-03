function buildDeck() {
  var deck = [];
  for(i=0; i<4; i++) {
    var cardSet = [];
    for (x=0; x<13; x++) {
      cardSet.push({
        faceValue: faceValue(x),
        suitRank: i+1,
        suit: suit(i)
        // TODO
        // Add overall cardRank based on suit and faceValue
      })
    }
    deck = deck.concat(cardSet)
  }
  return deck;
}

function faceValue(value) {
  if (value <= 7) {
    return (value+3).toString()
  }

  var specialCards = {
    8: "Jack",
    9: "Queen",
    10: "King",
    11: "Ace",
    12: "2"
  }

  return specialCards[value]
}

function suit (rank) {
  var suit = {
    0: "spade",
    1: "clubs",
    2: "diamonds",
    3: "hearts"
  }

  return suit[rank]
}

// adapted from https://bost.ocks.org/mike/shuffle/
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


/**
 * Hold off to the cards, 
 */
class Player {

}

class Bot extends Player {

}

/**
 * Hold the current set of cards at hand. Will keep track of the current rotation type. 
 * Game loop will process until any of the player has no cards left at hand. 
 * Or a player throws all four 2s; 6 pairs in seq. 3,3,4,4,5,5,6,6,7,7,8,8; 3 triples in seq. 5,5,5,6,6,6,7,7,7; or dragon all cards in seq.
 * 3,4,5,6 ... K, A, 2
 */
class Stage {
  contructor(deck, players, moveAnalyzer) {
    // will take the init. deck and distribute off to the players 
    // IOC injection of moveAnalyzer
  }

  start() {
    // from players with 3spades to start.
    // determine his move and set the current rotation
    // call the loop 
  }

  loop() {
    // keep asking other players for cards ... player may request for a look at the deck 
      // if player fails to provide tag him with a skip
      // but if player provides the cards pass it on to the moveAnalyzer (playersProvidedCards, cardsOnDeck)
      // moveAnalyzer will response with valid move, winning move, or etc. 
      // when 
  }
}

/**
 * Will take in the rotation type 
 */
class MoveAnalyzer {
  // will contain set of rules 
  determineMove(currentSetOfCardsOnDeck, playerWhosMakingMove) {

  }
}

class Deck {
  contructor() {

  }
  // previous set of cards 
  // current set of cards on the deck
}



console.log(shuffle(buildDeck()))