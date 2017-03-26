import React from 'react';
import ReactDOM from 'react-dom';
import { shuffle, buildDeck } from './core.js';
import _ from "lodash";
import App from './App';

import singleRotation from "./rotations/single.js";
import doubleRotation from "./rotations/double";
import tripleRotation from "./rotations/triple";
import fourOfAKindRotation from "./rotations/fourOfAKind";
import straightRotation from "./rotations/straight";
import straightPairRotation from "./rotations/straightPair";

const deck = shuffle(buildDeck())

const createCard = (value, suitRank, rank) => {
    return { value, suitRank, rank }
}

const ruleExec = function(players, stage) {
    return (rule, number) => {
        let result = rule(players, stage)

        // if (!result)
        //     console.log(`Failed: rule ${rule}`)

        return result
    }
}

// take in N(even) number of args being the [key:val] pairs that need to be tested for the next object
// ex. var testObj = func("value", "7", "suits", "hearts"); testObj(objToCheckIn)
const testify = function() {
    let args = Array.prototype.slice.call(arguments)

    if(args.length <= 0 || args.length % 2 != 0) {
        throw new Error("[Key:Value] arguments should in pair")
    }

    return obj => {
        let passing = true 

        return _.range(0, args.length, 2).every(i => {
            let key = args[i],
                value = args[i + 1]
            
            return obj[key] === value
        })
    }
}

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
});

describe("Single rotation", () => {
    it("must reject empty set of cards", () => {
        let players = [],
            stage = [createCard("9", 1, 24)]
        
        expect(singleRotation.isValid.every(ruleExec(players, stage))).toEqual(false);
        expect(singleRotation.rules.every(ruleExec(players, stage))).toEqual(false);
    })

    it("must reject lower card compare to whats on stage", () => {
        let players = [testify("value", "4")],
            stage = [testify("value", "9")]
        
        expect(singleRotation.isValid.every(ruleExec(players, stage))).toEqual(true);
        expect(singleRotation.rules.every(ruleExec(players, stage))).toEqual(false);
    })

    it("must accept a card with higher rank", () => {
        let players = [deck.find(testify("value", "2"))],
            stage = [deck.find(testify("value", "5"))]

        expect(singleRotation.isValid.every(ruleExec(players, stage))).toEqual(true);
        expect(singleRotation.rules.every(ruleExec(players, stage))).toEqual(true);
    })
})

describe("Double rotation", () => {
    it("must reject empty set of cards", () => {
        let players = [],
            stage = [createCard("9", 1, 24)]

        expect(doubleRotation.isValid.every(ruleExec(players))).toEqual(false)
        expect(doubleRotation.rules.every(ruleExec(players, stage))).toEqual(false)
    })

    it("must not accept any other combination of cards other than a pair", () => {
        let players = _.take(deck.filter(x => ["4", "5", "6"]), 3),
            players2 = _.take(deck.filter(x => ["4", "5", "6"]), 1),
            stage = [createCard("9", 1, 24)]

        expect(doubleRotation.isValid.every(ruleExec(players))).toEqual(false)
        //expect(doubleRotation.rules.every(ruleExec(players2, stage))).toEqual(false)
    })

    it("must reject cards of unmatched values", () => {
        let players = [deck.find(x => x.value === "6"), _.findLast(deck, x => x.value === "7")],
            players2 = [deck.find(x => x.value === "5"), _.findLast(deck, x => x.value === "Jack")],
            stage = [deck.find(x => x.value === "4"), deck.find(x => x.value === "4")]

        expect(doubleRotation.isValid.every(ruleExec(players, stage))).toEqual(false)
        //expect(doubleRotation.rules.every(ruleExec(players2, stage))).toEqual(false)
    })

    it("must accept two cards of matching values whose ranks are higher than the two cards on stage", () => {
        let players1 = [deck.find(x => x.value === "6"), _.findLast(deck, x => x.value === "6")],
            stage1 = [deck.find(x => x.value === "4"), deck.find(x => x.value === "4")],

            players2 = [deck.find(testify("value", "7", "suit", "hearts")), deck.find(testify("value", "7", "suit", "clubs"))],
            stage2 = [deck.find(testify("value", "7", "suit", "diamonds")), deck.find(testify("value", "7", "suit", "spades"))]

        expect(doubleRotation.isValid.every(ruleExec(players1))).toEqual(true)
        expect(doubleRotation.isValid.every(ruleExec(players2))).toEqual(true)

        expect(doubleRotation.rules.every(ruleExec(players1, stage1))).toEqual(true)
        expect(doubleRotation.rules.every(ruleExec(players2, stage2))).toEqual(true)
    })
})

describe("Triple rotation", () => {
    it("must reject empty set of cards", () => {
        let players = [],
            stage = [createCard("9", 1, 24)]

        expect(tripleRotation.isValid.every(ruleExec(players, stage))).toEqual(false)
    })

    it("must not accept any other combination of cards other than a triple", () => {
        let players = _.take(deck.filter(x => ["4", "5", "6"]), 6),
            players2 = _.take(deck.filter(x => ["4", "5", "6"]), 2),
            stage = [createCard("9", 1, 24)]

        expect(tripleRotation.isValid.every(ruleExec(players))).toEqual(false)
        expect(tripleRotation.isValid.every(ruleExec(players2))).toEqual(false)
    })

    it("must reject cards of unmatched values", () => {
        let players = [deck.find(x => x.value === "6"), _.findLast(deck, x => x.value === "7"), _.find(deck, x => x.value === "7")],
            players2 = [deck.find(x => x.value === "5"), _.findLast(deck, x => x.value === "Jack"), _.find(deck, x => x.value === "Jack")],
            stage = [deck.find(x => x.value === "4"), deck.find(x => x.value === "4")]

        expect(tripleRotation.isValid.every(ruleExec(players, stage))).toEqual(false)
        //expect(tripleRotation.rules.every(ruleExec(players2, stage))).toEqual(false)
    })

    it("must accept three cards of matching values whose ranks are higher than the three cards on stage", () => {
        let players = [deck.find(x => x.value === "6"), deck.find(x => x.value === "6"), _.findLast(deck, x => x.value === "6")],
            players2 = [deck.find(x => x.value === "Jack"), deck.find(x => x.value === "Jack"), _.findLast(deck, x => x.value === "Jack")],
            stage = [deck.find(x => x.value === "4"), deck.find(x => x.value === "4"), _.findLast(deck, x => x.value === "4")]

        expect(tripleRotation.isValid.every(ruleExec(players, stage))).toEqual(true)
        expect(tripleRotation.rules.every(ruleExec(players2, stage))).toEqual(true)
    })
})

describe("FourOfAKind rotation", () => {
    it("must reject empty set of cards", () => {
        let players = [],
            stage = [createCard("9", 1, 24)]

        expect(fourOfAKindRotation.isValid.every(ruleExec(players))).toEqual(false)
    })

    it("must not accept any other combination of cards other than a quadrupal", () => {
        let players = _.take(deck.filter(x => ["4", "5", "6"]), 6),
            players2 = _.take(deck.filter(x => ["4", "5", "6"]), 2),
            stage = [createCard("9", 1, 24)]

        expect(fourOfAKindRotation.isValid.every(ruleExec(players))).toEqual(false)
    })

    it("must reject cards of unmatched values", () => {
        let players = [deck.find(x => x.value === "6"), _.findLast(deck, x => x.value === "7"), _.find(deck, x => x.value === "7"), _.findLast(deck, x => x.value === "7")],
            players2 = [deck.find(x => x.value === "5"), _.findLast(deck, x => x.value === "Jack"), _.find(deck, x => x.value === "King"), _.findLast(deck, x => x.value === "Jack")]

        expect(fourOfAKindRotation.isValid.every(ruleExec(players))).toEqual(false)
        expect(fourOfAKindRotation.isValid.every(ruleExec(players2))).toEqual(false)
    })

    it("must accept four cards of matching values whose ranks are higher than the four cards on stage", () => {
        let players = [deck.find(x => x.value === "6"), deck.find(x => x.value === "6"), _.findLast(deck, x => x.value === "6"), _.findLast(deck, x => x.value === "6")],
            players2 = [deck.find(x => x.value === "Jack"), deck.find(x => x.value === "Jack"), _.findLast(deck, x => x.value === "Jack"), _.findLast(deck, x => x.value === "Jack")],
            stage = [deck.find(x => x.value === "4"), deck.find(x => x.value === "4"), _.findLast(deck, x => x.value === "4"), _.findLast(deck, x => x.value === "4")]

        expect(fourOfAKindRotation.isValid.every(ruleExec(players, stage))).toEqual(true)
        expect(fourOfAKindRotation.rules.every(ruleExec(players2, stage))).toEqual(true)
    })

    describe("Exceptions", () => {
        it("must beat a single \"2\" on stage but not any other type of single card", () => {
            let players = [deck.find(x => x.value === "6"), deck.find(x => x.value === "6"), _.findLast(deck, x => x.value === "6"), _.findLast(deck, x => x.value === "6")],
                stage = [deck.find(x => x.value === "2")],
                stage1 = [deck.find(x => x.value !== "2")]

            expect(fourOfAKindRotation.isValid.every(ruleExec(players))).toEqual(true)
            expect(fourOfAKindRotation.rules.every(ruleExec(players, stage))).toEqual(false)

            expect(fourOfAKindRotation.exceptions.some(exception => exception.every(ruleExec(players, stage)))).toEqual(true)
            expect(fourOfAKindRotation.exceptions.some(exception => exception.every(ruleExec(players, stage1)))).toEqual(false)
        })
    })
})

describe("Straight Rotation", () => {
    it("must reject empty set of cards", () => {
        let players = []

        expect(straightRotation.isValid.every(ruleExec(players))).toEqual(false)
    })

    it("must only accept 3 or more set of cards in sequence", () => {
        let players = [deck.find(x => x.value === "3"), deck.find(x => x.value === "4"), deck.find(x => x.value === "5")],
            players1 = [deck.find(x => x.value === "Jack"), deck.find(x => x.value === "Queen"), deck.find(x => x.value === "King"), deck.find(x => x.value === "Ace")],

            failedPlayers = [deck.find(x => x.value === "3"), deck.find(x => x.value === "4")],
            failedPlayers1 = [deck.find(x => x.value === "4"), deck.find(x => x.value === "4"), deck.find(x => x.value === "5")],
            failedPlayers2 = [deck.find(x => x.value === "Jack"), deck.find(x => x.value === "Queen"), deck.find(x => x.value === "King"), deck.find(x => x.value === "3")]

        expect(straightRotation.isValid.every(ruleExec(players))).toEqual(true)
        expect(straightRotation.isValid.every(ruleExec(players1))).toEqual(true)

        expect(straightRotation.isValid.every(ruleExec(failedPlayers))).toEqual(false)
        expect(straightRotation.isValid.every(ruleExec(failedPlayers1))).toEqual(false)
        expect(straightRotation.isValid.every(ruleExec(failedPlayers2))).toEqual(false)
    })

    it("must beat another stage cards with sequence starting with greater or same value but having a higher rank", () => {
        let players1 = [deck.find(x => x.value === "Jack"), deck.find(x => x.value === "Queen"), deck.find(x => x.value === "King")],
            stage1 = [deck.find(x => x.value === "3"), deck.find(x => x.value === "4"), deck.find(x => x.value === "5")],

            players2 = [deck.find(x => x.value === "4"), deck.find(x => x.value === "5"), deck.find(x => x.value === "6"), deck.find(x => x.value === "7")],
            stages2 = [deck.find(x => x.value === "3"), deck.find(x => x.value === "4"), deck.find(x => x.value === "5"), deck.find(x => x.value === "6")]
        
        expect(straightRotation.rules.every(ruleExec(players1, stage1))).toEqual(true)
        expect(straightRotation.rules.every(ruleExec(players2, stages2))).toEqual(true)
    })
})

describe("Straight Pair Rotation", () => {
    it("must reject empty, less than 3 pairs, and not paired sets of cards", () => {
        let players = [],
            players1 = [deck.find(testify("value", "4", "suit", "hearts")), deck.find(testify("value", "4", "suit", "spades")),
                        deck.find(testify("value", "5", "suit", "diamonds")), deck.find(testify("value", "5", "suit", "clubs"))]

        expect(straightPairRotation.isValid.every(ruleExec(players))).toEqual(false)
        expect(straightPairRotation.isValid.every(ruleExec(players1))).toEqual(false)
    })

    it("must absolutely reject unpaired and not in sequence sets of cards", () => {
        let players1 = [
                deck.find(testify("value", "3", "suit", "hearts")), deck.find(testify("value", "3", "suit", "diamonds")),
                deck.find(testify("value", "4", "suit", "clubs")), deck.find(testify("value", "5", "suit", "diamonds")),
                deck.find(testify("value", "5", "suit", "spades")), deck.find(testify("value", "5", "suit", "hearts"))
            ],
            players2 = [
                deck.find(testify("value", "9", "suit", "hearts")), deck.find(testify("value", "9", "suit", "diamonds")),
                deck.find(testify("value", "Jack", "suit", "hearts")), deck.find(testify("value", "Jack", "suit", "diamonds")),
                deck.find(testify("value", "Queen", "suit", "clubs")), deck.find(testify("value", "Queen", "suit", "diamonds")),
                deck.find(testify("value", "King", "suit", "spades")), deck.find(testify("value", "4", "suit", "hearts"))
            ],
            players3 = [
                deck.find(testify("value", "8", "suit", "hearts")), deck.find(testify("value", "8", "suit", "diamonds")),
                deck.find(testify("value", "Jack", "suit", "hearts")), deck.find(testify("value", "Jack", "suit", "diamonds")),
                deck.find(testify("value", "Queen", "suit", "clubs")), deck.find(testify("value", "Queen", "suit", "diamonds")),
                deck.find(testify("value", "King", "suit", "spades")), deck.find(testify("value", "King", "suit", "hearts"))
            ]

        expect(straightPairRotation.isValid.every(ruleExec(players1))).toEqual(false)
        expect(straightPairRotation.isValid.every(ruleExec(players2))).toEqual(false)
        expect(straightPairRotation.isValid.every(ruleExec(players3))).toEqual(false)
    })

    it("must accept 3 or more pairs of consecutive rank", () => {
        let players1 = [
                deck.find(testify("value", "3", "suit", "hearts")), deck.find(testify("value", "3", "suit", "diamonds")),
                deck.find(testify("value", "4", "suit", "clubs")), deck.find(testify("value", "4", "suit", "diamonds")),
                deck.find(testify("value", "5", "suit", "spades")), deck.find(testify("value", "5", "suit", "hearts"))
            ],
            players2 = [
                deck.find(testify("value", "9", "suit", "hearts")), deck.find(testify("value", "9", "suit", "diamonds")),
                deck.find(testify("value", "10", "suit", "hearts")), deck.find(testify("value", "10", "suit", "diamonds")),
                deck.find(testify("value", "Jack", "suit", "hearts")), deck.find(testify("value", "Jack", "suit", "diamonds")),
                deck.find(testify("value", "Queen", "suit", "clubs")), deck.find(testify("value", "Queen", "suit", "diamonds")),
                deck.find(testify("value", "King", "suit", "spades")), deck.find(testify("value", "King", "suit", "hearts"))
            ]

        expect(straightPairRotation.isValid.every(ruleExec(players1))).toEqual(true)
        expect(straightPairRotation.isValid.every(ruleExec(players2))).toEqual(true)
    })

    describe("Exceptions", () => {
        it("must be beat able to beat any single \"2\" upon 3 consecutive pair sequence on hand", () => {
            let players1 = [
                    deck.find(testify("value", "3", "suit", "hearts")), deck.find(testify("value", "3", "suit", "diamonds")),
                    deck.find(testify("value", "4", "suit", "clubs")), deck.find(testify("value", "4", "suit", "diamonds")),
                    deck.find(testify("value", "5", "suit", "spades")), deck.find(testify("value", "5", "suit", "hearts"))
                ],
                stage1 = [deck.find(testify("value", "2"))]
            
            expect(straightPairRotation.isValid.every(ruleExec(players1))).toEqual(true)
            expect(straightPairRotation.rules.every(ruleExec(players1, stage1))).toEqual(false)
            expect(straightPairRotation.exceptions.some(exception => exception.every(ruleExec(players1, stage1)))).toEqual(true)
        })

        it("should beat a pair of \"2s\"(but not any other pair) upon handing a sequence of 4 pairs", () => {
            let players1 = [
                    deck.find(testify("value", "3", "suit", "hearts")), deck.find(testify("value", "3", "suit", "diamonds")),
                    deck.find(testify("value", "4", "suit", "clubs")), deck.find(testify("value", "4", "suit", "diamonds")),
                    deck.find(testify("value", "5", "suit", "spades")), deck.find(testify("value", "5", "suit", "hearts")),
                    deck.find(testify("value", "6", "suit", "spades")), deck.find(testify("value", "6", "suit", "hearts")),
                ],
                stage1 = [deck.find(testify("value", "2", "suit", "hearts")), deck.find(testify("value", "2", "suit", "diamonds"))]
            
            expect(straightPairRotation.isValid.every(ruleExec(players1))).toEqual(true)
            expect(straightPairRotation.rules.every(ruleExec(players1, stage1))).toEqual(false)
            expect(straightPairRotation.exceptions.some(exception => exception.every(ruleExec(players1, stage1)))).toEqual(true)
        })

        it("handing a sequence of 5 pairs can easily beat a set of three \"2s\" and only 3 \"2s\"", () => {
            let players1 = [
                    deck.find(testify("value", "3", "suit", "hearts")), deck.find(testify("value", "3", "suit", "diamonds")),
                    deck.find(testify("value", "4", "suit", "clubs")), deck.find(testify("value", "4", "suit", "diamonds")),
                    deck.find(testify("value", "5", "suit", "clubs")), deck.find(testify("value", "5", "suit", "diamonds")),
                    deck.find(testify("value", "6", "suit", "clubs")), deck.find(testify("value", "6", "suit", "diamonds")),
                    deck.find(testify("value", "7", "suit", "spades")), deck.find(testify("value", "7", "suit", "hearts"))
                ],
                stage1 = [
                    deck.find(testify("value", "2", "suit", "spades")), 
                    deck.find(testify("value", "2", "suit", "hearts")),
                    deck.find(testify("value", "2", "suit", "diamonds"))
                ],
                stage2 = [
                    deck.find(testify("value", "2", "suit", "spades")), 
                    deck.find(testify("value", "2", "suit", "hearts"))
                ]
            
            expect(straightPairRotation.isValid.every(ruleExec(players1))).toEqual(true)
            expect(straightPairRotation.rules.every(ruleExec(players1, stage1))).toEqual(false)
            
            expect(straightPairRotation.exceptions.some(exception => exception.every(ruleExec(players1, stage1)))).toEqual(true)
            expect(straightPairRotation.exceptions.some(exception => exception.every(ruleExec(players1, stage2)))).toEqual(false)
        })
    })
})