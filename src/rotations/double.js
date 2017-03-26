import rules from "../cardRules"
import _ from "lodash"

export default {
    description: "You must play two cards of a matching value whose ranks are higher than the two cards on the stage",
    isValid: [
      _.partial(rules.cardsMatchCount, 2),
      rules.cardsValueMatchEachOther
    ],
    rules: [
      rules.cardsCountMatchStageCount,
      rules.cardsHigherThanStageCards
    ]
  }