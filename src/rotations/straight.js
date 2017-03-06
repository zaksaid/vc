import rules from "../cardRules"
import _ from "lodash"

export default {
    description: "You must play \"N\" cards with an increasing value of which the last card has a higher rank than the last card on the stage",
    isStriaght: [
        _.partial(rules.cardsCountGreaterThanEqualTo, 3),
        rules.cardsInSequence
    ],
    rules: [
        rules.cardsCountMatchStageCount,
        rules.cardsHigherThanStageCards
    ]
  }