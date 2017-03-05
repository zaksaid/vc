import rules from "../cardRules"
import _ from "lodash"

export default {
    description: "You must play three cards of a matching value whose ranks are higher than the three cards on the stage",
    isTriple: [
      _.partial(rules.cardsMatchCount, 3),
      rules.cardsValueMatchEachOther
    ],
    rules: [
      rules.cardsCountMatchStageCount,
      rules.cardsHigherThanStageCards
    ]
  }