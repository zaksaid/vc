import rules from "../cardRules"
import _ from "lodash"

export default {
    description: "Three or more pairs of consecutive rank - such as 3-3-4-4-5-5 or 6-6-7-7-8-8-9-9",
    isStraightPair: [
      _.partial(rules.cardsCountGreaterThanEqualTo, 6),
      rules.cardsInEvenQuantity,
      rules.cardsInPair
    ],
    rules: [
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
        _.partialRight(rules.cardsMatchCount, 2 * 3), // pair * number of pairs
        rules.cardsPairInSeq
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
        _.partialRight(rules.cardsMatchCount, 2 * 4), // pair * number of pairs
        rules.cardsPairInSeq
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
        _.partialRight(rules.cardsMatchCount, 2 * 5), // pair * number of pairs
        rules.cardsPairInSeq
      ]
    ]
  }