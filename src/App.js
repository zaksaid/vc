import React, { Component } from 'react';
import './App.css';
import { shuffle, buildDeck } from './core.js';
import _ from "lodash"

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

  render() {
    const self = this;
    return (
      <div>
        <button onClick={this.dealDeck}>Deal</button>
        <button onClick={this.playHand}>Play Hand</button>
        <div className="game-wrapper">
          {_.map(this.state.players, function (player, idx) {
            return (
              <div className={"player-wrapper " + (idx) } key={idx}>
                <div className={player.currentPlayer
                  ? "current-player player-name"
                  : "player-name"}>{player.name}</div>
                <div className="player-stage">
                  {player.hand && player.hand.map(function (card, idx) {
                  return (
                    <div key={idx}
                      className={player.selectedCards.has(card) ? "selected card-box" : "card-box"}
                      onClick={() => self.selectCard(player, card)}>
                      {card.value} {card.suit} <br/>
                      rank: {card.rank}
                    </div>
                  )
                  })}
                </div>
              </div>
            )
          })}
          <div className="player-stage stage">
            {this.state.stage.map(function (card, idx) {
              return(
                <div className="card-box" key={idx}>
                    {card.value} {card.suit}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
