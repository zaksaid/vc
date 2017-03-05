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
          selectedCards: new Set()
        },
        player2: {
          name: "player2",
          id: 1,
          hand: null,
          class: "player2",
          selectedCards: new Set()
        },
        player3: {
          name: "player3",
          id: 2,
          hand: null,
          class: "player3",
          selectedCards: new Set()
        },
        player4: {
          name: "player4",
          id: 3,
          hand: null,
          class: "player4",
          selectedCards: new Set()
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

  shuffleDeck = () => {
    this.setState({
      deck: shuffle(this.state.deck)
    })
  };

  sortHand = (a, b) => {
    return a - b;
  }

  dealDeck = () => {
    this.shuffleDeck();
    const self = this;

    let players = this.state.players;

    _.each(players, function(player) {
      let playerHand = self.state.deck.slice(player.id*13, 13*(player.id+1))
      playerHand = playerHand.sort(function(a, b) {
        return a.rank - b.rank;
      });
      return player.hand = playerHand
    });

    this.setState({
      players: players
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
              (player, idx) => <Player key={`${player.name}-${idx}`} player={player} actions={this.actions.players} idx={idx}/>)
          }
          <Stage stage={this.state.stage} rotationType={this.state.rotationType} actions={this.actions.stage}/>
        </div>
      </div>
    );
  }
}

export default App;
