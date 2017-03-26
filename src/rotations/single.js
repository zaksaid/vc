import rules from "../cardRules"
import _ from "lodash"

export default {
    description: "You must play a single card of a higher rank than the card on the stage",
    isValid: [
      _.partial(rules.cardsMatchCount, 1)
    ],
    rules: [
      rules.cardsCountMatchStageCount,
      rules.cardsHigherThanStageCards
    ]
  }