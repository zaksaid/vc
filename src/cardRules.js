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
        _stage = Array.from(stage);

        return _cards.some(card => _stage.some(scard => card.rank > scard.rank));
  },
  cardsValueMatchEachOther: (cards) => {
    let _cards = Array.from(cards),
        value = _.head(_cards).value;

    return _cards.every(c => _.isEqual(value, c.value));
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
          if(idx % 2)
            result.push(result.slice(i, i + 2))
          return result
        }, [])
    
    return pairs.every(pair => _.isEqual( _.head(pair).value, _.tail(pair).value))
  },
  cardsPairInSeq: (cards) => {
    let values = ["3", "3", "4", "4", "5", "5", "6", "6", "7", "7", "8", "8", "9", "9", "10", "10", 
                  "Jack", "Jack", "Queen", "Queen", "King", "King", "Ace", "Ace", "2", "2"],
        _cards = Array.from(cards),
        counter = values.indexOf(_.head(_cards).value)

    return _cards.every(card => !_.isUndefined(values[counter]) && _.isEqual(card.value, values[counter++]))
  }
}