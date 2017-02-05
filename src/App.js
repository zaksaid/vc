import React, { Component } from 'react';
import './App.css';
import { shuffle, buildDeck } from './core.js';
import _ from "lodash"

class Stage extends Component {
  
  componentWillReceiveProps(nextProps) {
    // add logic here for checking the cards that are received from players next
    // apply rules here then update state accordingly 

    // take next players cards and cards from stage go through the rules chain cycle depending on whatever the current rotation is in
    // if user passess any exception or all rules then it means it has beaten the cards on stage and App state will update the 
    // state accordingly 
  }

  render() {
    return (
      <div className="player-stage stage">
        {this.props.stage.map(function (card, idx) {
          return(
            <div className="card-box" key={idx}>
                {card.value} {card.suit}
            </div>
          )
        })}
    </div>);
  }
}

class Player extends Component {
  render() {
    let { player, actions, idx } = this.props

    return (
      <div className={`player-wrapper ${idx}`} key={idx}>
        <div className="player-name">{player.name}</div>
        <div className="player-stage">
          {player.hand && player.hand.map(function (card, idx) {

          return (
            <div key={idx}
              className={player.selectedCards.has(card) ? "selected card-box" : "card-box"}
              onClick={() => actions.selectCard(player, card)}>
              {card.value} {card.suit} <br/>
              rank: {card.rank}
            </div>
          )
          })}
        </div>
      </div>
    );
  }
}

class App extends Component {

  constructor(props, context) {
    super(props, context);
    
    this.state = {
      deck: buildDeck(),
      rotationType: null,
      players: {
        player1: {
          name: "player1",
          id: 0,
          hand: null,
          class: "player1",
          selectedCards: new Set(),
          currentPlayer: false
        },
        player2: {
          name: "player2",
          id: 1,
          hand: null,
          class: "player2",
          selectedCards: new Set(),
          currentPlayer: false
        },
        player3: {
          name: "player3",
          id: 2,
          hand: null,
          class: "player3",
          selectedCards: new Set(),
          currentPlayer: false
        },
        player4: {
          name: "player4",
          id: 3,
          hand: null,
          class: "player4",
          selectedCards: new Set(),
          currentPlayer: false
        },
      },
      stage: []
    };

    this.actions = {
      players: {
        selectCard: this.selectCard.bind(this)
      },
      stage: {
        setRotation: this.setRotation.bind(this)
      }
    }
  }

  resetBoardPlayers = () => {
    this.setState({
      deck: shuffle(this.state.deck)
    })
  };

  dealDeck = () => {
    this.resetBoardPlayers();
    const self = this;

    let players = this.state.players;

    _.each(players, function(player) {
      let playerHand = self.state.deck.slice(player.id*13, 13*(player.id+1))
      playerHand = playerHand.sort(function(a, b) {
        if (a.rank === 0) {
          player.currentPlayer = true;
        }
        return a.rank - b.rank;
      });
      player.hand = playerHand;
    });

    this.setState({
      players: players,
    })
  }

  selectCard = (currentPlayer, card) => {
    let players = this.state.players;
    let updatedPlayer = players[currentPlayer.name];

    updatedPlayer.selectedCards.has(card)
      ? updatedPlayer.selectedCards.delete(card)
      : updatedPlayer.selectedCards.add(card);

    players[currentPlayer.name] = updatedPlayer;

    this.setState({
      players: players
    })
  }

  playHand = () => {
    let currentPlayer = this.state.players.player1;
    let players = this.state.players;

    const selectedCards = Array.from(currentPlayer.selectedCards);
    const cardsLeftOver = _.difference(currentPlayer.hand, selectedCards)

    currentPlayer.hand = cardsLeftOver;

    players[currentPlayer.name] = currentPlayer;

    this.setState({
      stage: selectedCards,
      players: players
    })

    this.clearSelection(currentPlayer);
  }

  clearSelection = (player) => {
    let players = this.state.players;
    let updatedPlayer = players[player.name];

    updatedPlayer.selectedCards.clear();

    players[player.name] = updatedPlayer;

    this.setState({
      players: players
    })
  }

  setRotation = (type) => {
    this.setState({ rotationType: type })
  }

  render() {
    
    return (
      <div>
        <button onClick={this.dealDeck}>Deal</button>
        <button onClick={this.playHand}>Play Hand</button>
        <div className="game-wrapper">
          {
            _.map(
              this.state.players, 
              (player, idx) => <Player player={player} actions={this.actions.players} idx={idx}/>)
          }
          <Stage stage={this.state.stage} rotationType={this.state.rotationType} actions={this.actions.stage}/>
        </div>
      </div>
    );
  }
}

let rotations = {
  single: {
    description: "You must play a single card of a higher rank than the card on the stage",
    rules: [
      (cards) => cards.length === 1,
      (cards, stage) => {
        return cards.length === stage.length
      },
      (cards, stage) => {
        let _cards = Array.from(cards),
            _stage = Array.from(stage);

        return _cards.some(card => _stage.some(scard => card.rank > scard.rank));
      }
    ]
  },

  pair: {
    description: "You must play two cards of a matching value whose ranks are higher than the two cards on the stage",
    rules: [
      // check for two cards
      (cards) => cards.length === 2,
      (cards, stage) => {
        return cards.length === stage.length;
      },
      // check for same value
      (cards) => {
        let _cards = Array.from(cards),
            c1 = _cards[0], c2 = _cards[1];

        return c1.value === c2.value;
      },
      // check for rank higher than the two cards on the stage
      (cards, stage) => {
        let _cards = Array.from(cards),
            _stage = Array.from(stage);

        return _cards.some(card => _stage.some(scard => card.rank > scard.rank));
      }
    ]
  },

  triple: {
    description: "You must play three cards of a matching value whose ranks are higher than the three cards on the stage",
    rules: [
      (cards) => cards.length === 3,
      (cards, stage) => {
        return cards.length === stage.length;
      },
      // check for same value
      (cards) => {
        let _cards = Array.from(cards),
            c1 = _cards[0], c2 = _cards[1], c3 = _cards[2];

        return c1.value === c2.value && c2.value === c3.value;
      },
      // check for rank higher than the three cards on the stage
      (cards, stage) => {
        let _cards = Array.from(cards),
            _stage = Array.from(stage);

        return _cards.some(card => _stage.some(scard => card.rank > scard.rank));
      }
    ]
  },

  fourOfAKind: {
    description: "You must play four cards of a matching value whose ranks are higher than the four cards on the stage",
    rules: [
      (cards) => cards.length === 4,
      (cards, stage) => {
        return cards.length === stage.length;
      },
      // check for same value
      (cards) => {
        let _cards = Array.from(cards),
            c1 = _cards[0], c2 = _cards[1], c3 = _cards[2], c4 = _cards[3];

        return c1.value === c2.value && c2.value === c3.value && c3.value === c4.value;
      },
      (cards, stage) => {
        let _cards = Array.from(cards),
            _stage = Array.from(stage);

        return _cards.some(card => _stage.some(scard => card.rank > scard.rank));
      }
    ],
    // If passess any means it has beaten the cards on stage
    exceptions: [
      [
        // A four of a kind can beat any single two (but not any other single card, such as an ace or king)
        (cards, stage) => {
          return stage.length === 1;
        },
        (cards, stage) => {
          return _.head(Array.from(stage)).value === "2"
        },
        (cards, stage) => {
          let isFourOfAKind = _.nth(rotations["fourOfAKind"].rules, 0)(cards) 
                              && _.nth(rotations["fourOfAKind"].rules, 2)(cards)

          return isFourOfAKind;
        }
      ]
    ]
  },

  straight: {
    description: "You must play \"N\" cards with an increasing value of which the last card has a higher rank than the last card on the stage",
    rules: [
      (cards) => cards.length >= 3,
      (cards, stage) => {
        return cards.length === stage.length;
      },
      // check for card value seq. in ascending order
      (cards) => {
        let faceValues = ["3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King", "Ace", "2"],
            _cards = Array.from(cards),
            startIdx = faceValues.indexOf(_.head(_cards).value);
        
        for(var i = startIdx, ii = 0; ii < _cards.length; i++, ii++) {
          if(faceValues[i] == null || faceValues[i] !== _cards[ii].value);
            return false;
        }

        return true;
      },
      (cards, stage) => {
        return cards.length === stage.length;
      },
      (cards, stage) => {
        let _cards = Array.from(cards),
            _stage = Array.from(stage);
          
        return _cards.some(card => _stage.some(scard => card.rank > scard.rank));
      }
    ]
  },

  straightPair: {
    description: "Three or more pairs of consecutive rank - such as 3-3-4-4-5-5 or 6-6-7-7-8-8-9-9",
    rules: [
      (cards) => cards.length >= 6 && cards.length % 2 === 0,
      (cards, stage) => {
        return cards.length === stage.length;
      },
      (cards) => {
        // divide them into pairs
        let _cards = Array.from(cards),
            pairs = []

        _.cards.forEach((card, idx) => {
          if(idx % 2 === 0)
            pairs.push([card])
          else 
            pairs[Math.floor(idx / 2)].push(card)
        })

        let isActualPairs = pairs.every((pair) => pair[0].value === pair[1].value)

        let applySeqCheck = _.nth(rotations["straight"].rules, 2); // get the seq. check validator from "straight"
        let truncatePairs = _.reduce(pairs, (list, pair) => list.push(_.head(pair)) && list, []) // flatten the pairs uniquely by just picking first item
        let isSeq = applySeqCheck(truncatePairs) 

        return isActualPairs && isSeq;
      },
      (cards, stage) => {
        let _cards = Array.from(cards),
            _stage = Array.from(stage);
          
        return _.head(_cards).rank >= _.head(_stage).rank && // atleast the first card should be greater than or equal to the stage's first card
                _cards.some(card => _stage.some(scard => card.rank > scard.rank));
      }
    ],
    // If passess any means that it has beaten the cards on stage
    exceptions: [
      // A sequence of three pairs (such as 7-7-8-8-9-9) can beat any single two
      [
        (cards, stage) => {
          return stage.length === 1;
        },
        (cards, stage) => {
          let _stage = Array.from(stage)

          return _.every(_stage, card => card.value === "2")
        },
        (cards, stage) => {
          let isSeqOfPairs = _.nth(rotations["straightPair"].rules, 0)(cards) 
                            && _.nth(rotations["straightPair"].rules, 1)(cards)

          return isSeqOfPairs;
        }
      ],
      // A sequence of four pairs (such as 5-5-6-6-7-7-8-8) can beat a pair of twos (but not any other pair)
      [
        (cards, stage) => {
          return cards.length === 8 && stage.length === 2;
        },
        (cards, stage) => {
          let _stage = Array.from(stage)

          return _.every(_stage, card => card.value === "2")
        },
        (cards, stage) => {
          let isSeqOfPairs = _.nth(rotations["straightPair"].rules, 0)(cards) 
                            && _.nth(rotations["straightPair"].rules, 1)(cards)

          return isSeqOfPairs;
        }
      ],
      // A sequence of five pairs (such as 8-8-9-9-10-10-J-J-Q-Q) can beat a set of three twos
      [
        (cards, stage) => {
          return cards.length === 10 && stage.length === 3;
        },
        (cards, stage) => {
          let _stage = Array.from(stage)

          return _.every(_stage, card => card.value === "2")
        },
        (cards, stage) => {
          let isSeqOfPairs = _.nth(rotations["straightPair"].rules, 0)(cards) 
                            && _.nth(rotations["straightPair"].rules, 1)(cards)

          return isSeqOfPairs;
        }
      ]
    ]
  }
}

export default App;
