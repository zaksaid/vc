import rules from "../cardRules"
import _ from "lodash"

export default {
    description: "You must play four cards of a matching value whose ranks are higher than the four cards on the stage",
    isValid: [
      _.partial(rules.cardsMatchCount, 4),
      rules.cardsValueMatchEachOther
    ],
    rules: [
      rules.cardsCountMatchStageCount,
      rules.cardsHigherThanStageCards
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
        }
      ]
    ]
  }