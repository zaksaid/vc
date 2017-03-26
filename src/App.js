import React, { Component } from 'react';
import './App.css';
import { shuffle, buildDeck } from './core.js';
import Rotations from "./rotations"
import classNames from "classnames"
import _ from "lodash"

class Stage extends Component {
  render() {
    return (
      <div className="stage">
        {this.props.stage.map(function (card, idx) {
          return(
            <div className={`card card-${card.suit}`} key={idx}>
                {card.value} {card.suitCode}
            </div>
          )
        })}
        {
          this.props.moveError && <div className="error">{this.props.moveError}</div>
        }
    </div>);
  }
}

class Player extends Component {
  render() {
    let { player, actions, idx } = this.props,
        playerStageClass = classNames("player-stage", {
          "alert-danger": player.skipping
        })

    return (
      <div className={`player-wrapper ${idx}`} key={idx}>
        <div className="player-name">{player.name}</div>
        <div className={playerStageClass}>
          {player.hand && player.hand.map(function (card, idx) {

            let className = player.selectedCards.has(card) ? "selected card" : player.hasTurn ? "card" : "card disabled"

            return (
              <div key={idx}
                className={className}
                onClick={() => actions.selectCard(player, card)}>
                {card.value} {card.suitCode} <br/>
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
      players: {
        player1: {
          name: "player1",
          id: 0,
          hand: null,
          class: "player1",
          selectedCards: new Set(),
          currentPlayer: false,
          hasTurn: true
        },
        player2: {
          name: "player2",
          id: 1,
          hand: null,
          class: "player2",
          selectedCards: new Set(),
          currentPlayer: false,
          hasTurn: false
        },
        player3: {
          name: "player3",
          id: 2,
          hand: null,
          class: "player3",
          selectedCards: new Set(),
          currentPlayer: false,
          hasTurn: false
        },
        player4: {
          name: "player4",
          id: 3,
          hand: null,
          class: "player4",
          selectedCards: new Set(),
          currentPlayer: false,
          hasTurn: false
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

  canPlayAnyRotation(currentPlayer) {
    return _.values(this.state.players)
            .filter(x => !x.name.includes(currentPlayer.name))
            .every(x => x.skipping)
  }

  playHand = () => {
    let currentPlayer = this.state.players[_.findKey(this.state.players, x => x.hasTurn)];
    let players = this.state.players;

    const selectedCards = Array.from(currentPlayer.selectedCards);
    const cardsLeftOver = _.difference(currentPlayer.hand, selectedCards)

    let rotation = this.state.rotation
    
    // this occurs if everyone plan to skip their turns
    if(this.canPlayAnyRotation(currentPlayer)) {
      rotation = null
    }

    if(rotation == null) {
      if(Rotations.Single.isValid.every(rule => rule(selectedCards)))
        rotation = "Single"
      else if (Rotations.Double.isValid.every(rule => rule(selectedCards)))
        rotation = "Double"
      else if (Rotations.Triple.isValid.every(rule => rule(selectedCards)))
        rotation = "Triple"
      else if (Rotations.FourOfAKind.isValid.every(rule => rule(selectedCards)))
        rotation = "FourOfAKind"
      else if (Rotations.Straight.isValid.every(rule => rule(selectedCards)))
        rotation = "Straight"
      else if (Rotations.StraightPair.isValid.every(rule => rule(selectedCards)))
        rotation = "StraightPair"

      if(rotation == null) {
        this.setState({moveError: "Invalid move. This move doesn't seem to represent any rotation."})
        return;
      }
      else {
        for(let name in players) {
          let player = players[name]
          player.skipping = false
        }

        this.selectNextPlayer(currentPlayer)
      }
    } else {
      if( // is valid and passess all rules
          (_.overEvery(Rotations[rotation].isValid)(selectedCards) && _.overEvery(Rotations[rotation].rules)(selectedCards, this.state.stage)) 
          || 
          // or, its a case with an exception
          (_.has(Rotations[rotation], "exceptions") && _.overSome(Rotations[rotation].exceptions)(selectedCards, this.state.stage))  
        ) {
        
        this.selectNextPlayer(currentPlayer)
      }
      else {
        this.setState({
          moveError: Rotations[rotation].description
        })
        return;
      }
    }

    currentPlayer.hand = cardsLeftOver;

    this.setState({
      stage: selectedCards,
      players: players,
      moveError: null,
      rotation
    })

    this.clearSelection(currentPlayer);
  }

  skipCurrent = () => {
    let currentPlayer = _.values(this.state.players).find(x => x.hasTurn)
    
    this.clearSelection(currentPlayer)

    this.selectNextPlayer(currentPlayer)

    let players = this.state.players

    players[currentPlayer.name].skipping = true

    this.setState({
      players
    })
  }

  selectNextPlayer(player) {
    player.hasTurn = false
    
    let players = this.state.players
    let playersArr = _.values(players)

    let inc = 1, nextPlayer = null

    do
    {
      let idx = (playersArr.findIndex(x => x.name === player.name ) + inc) % playersArr.length
      nextPlayer = playersArr[idx]
      nextPlayer = !nextPlayer.skipping ? nextPlayer : null
      inc = inc + 1 
    } while(nextPlayer == null)
    
    players[nextPlayer.name].hasTurn = true

    this.setState({
      players
    })
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
    // Future plan 
    // Modify/Refactor/Clean/Nice UI current implementation
    // <StartScreen />
    // - Upto 4 players max. Atleast one human player and one bot/human. 
    // - Able to see and connect players online
    // <GameScreen />
    // - Based on config. set in start screen build the desired app state/tree
    // - Connect to Socket to feed real data.
    // <WinningScreen />
    // - Hurrah!!! Winner screen

    return (
      <div className="shell">
        <div className="col-xs-12 col-xs-offset-5">
          <button className="btn btn-primary gutter-half-top gutter-side-right" onClick={this.dealDeck}>Deal</button>
          <button className="btn btn-info gutter-half-top" onClick={this.playHand}>Play Hand</button>
          <button className="btn btn-info gutter-half-top" onClick={this.skipCurrent}>Skip</button>
        </div>
        <div className="game-wrapper">
          {
            _.map(
              this.state.players, 
              (player, idx) => <Player key={`${player.name}-${idx}`} player={player} hasTurn={player.hasTurn} actions={this.actions.players} idx={idx}/>)
          }
          <Stage stage={this.state.stage} rotationType={this.state.rotationType} moveError={this.state.moveError} actions={this.actions.stage}/>
        </div>
      </div>
    );
  }
}

export default App;
