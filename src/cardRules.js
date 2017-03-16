import _ from "lodash"

export default {
  cardsMatchCount: (length, cards, stage) => {
    return cards.length === length
  },
  cardsCountMatchStageCount: (cards, stage) => {
    return cards.length === stage.length
  },
  cardsCountGreaterThanEqualTo: (length, cards, stage) => {
    return cards.length >= length
  },
  cardsHigherThanStageCards: (cards, stage) => {
    let _cards = Array.from(cards),
        _stage = Array.from(stage),
        findHighRankCard = cards => cards.reduce((rank, n) => Math.max(rank, n.rank) === n.rank ? n.rank : rank, 0)
      
      // lets take the highest card from player and highest card from stage
    let pHighRank = findHighRankCard(_cards),
        sHighRank = findHighRankCard(_stage)
      
    return pHighRank > sHighRank && _cards.every((card, i) => _stage.some(scard => card.rank > scard.rank));
  },
  cardsValueMatchEachOther: (cards) => {
    let _cards = Array.from(cards),
        value = _.head(_cards).value;
    
    return _cards.every(c => _.isEqual(value, c.value));
  },
  cardsInEvenQuantity: (cards) => {
    return cards.length % 2 === 0
  },
  cardsInSequence: (cards) => {
    let values = ["3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King", "Ace", "2"],
        _cards = Array.from(cards),
        counter = values.indexOf(_.head(_cards).value)
    
    return _cards.every(card => !_.isUndefined(values[counter]) && _.isEqual(card.value, values[counter++]))
  },
  cardsInPair: (cards) => {
    let _cards = Array.from(cards),
        pairs = _cards.reduce((result, value, i) => {
          if(i % 2 === 0)
            result.push(_cards.slice(i, i + 2))
          return result
        }, [])
      
    return pairs.every(pair => _.isEqual( _.first(pair).value, _.last(pair).value))
  },
  cardsPairInSeq: (cards) => {
    let values = ["3", "3", "4", "4", "5", "5", "6", "6", "7", "7", "8", "8", "9", "9", "10", "10", 
                  "Jack", "Jack", "Queen", "Queen", "King", "King", "Ace", "Ace", "2", "2"],
        _cards = Array.from(cards),
        counter = values.indexOf(_.head(_cards).value)

    return _cards.every(card => !_.isUndefined(values[counter]) && _.isEqual(card.value, values[counter++]))
  }
}