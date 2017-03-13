export function buildDeck() {
  var deck = [];
  for(let i=0; i<4; i++) {
    var cardSet = [];
    for (let x=0; x<13; x++) {
      cardSet.push({
        value: faceValue(x),
        suitRank: i+1,
        suit: suit(i),
        rank: (x * 4) + i
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
    0: "spades",
    1: "clubs",
    2: "diamonds",
    3:  "hearts"
  }

  return suit[rank]
}

// adapted from https://bost.ocks.org/mike/shuffle/
export function shuffle(array) {
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