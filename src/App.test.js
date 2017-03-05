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

const ruleExec = (players, stage) => {
    return (rule, number) => {
        let result = rule(players, stage)

        if (!result)
            console.log(`Failed: rule ${rule}`)

        return result
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
        
        expect(singleRotation.isSingle.every(ruleExec(players, stage))).toEqual(false);
        expect(singleRotation.rules.every(ruleExec(players, stage))).toEqual(false);
    })

    it("must reject lower card compare to whats on stage", () => {
        let players = [createCard("4", 1, 0)],
            stage = [createCard("9", 1, 24)]
        
        expect(singleRotation.isSingle.every(ruleExec(players, stage))).toEqual(true);
        expect(singleRotation.rules.every(ruleExec(players, stage))).toEqual(false);
    })

    it("must accept a card with higher rank", () => {
        let players = [createCard("King", 1, 40)],
            stage = [createCard("9", 1, 24)]

        expect(singleRotation.isSingle.every(ruleExec(players, stage))).toEqual(true);
        expect(singleRotation.rules.every(ruleExec(players, stage))).toEqual(true);
    })
})

describe("Double rotation", () => {
    it("must reject empty set of cards", () => {
        let players = [],
            stage = [createCard("9", 1, 24)]

        expect(doubleRotation.isDouble.every(ruleExec(players))).toEqual(false)
        expect(doubleRotation.rules.every(ruleExec(players, stage))).toEqual(false)
    })

    it("must not accept any other combination of cards other than a pair", () => {
        let players = _.take(deck.filter(x => ["4", "5", "6"]), 3),
            players2 = _.take(deck.filter(x => ["4", "5", "6"]), 1),
            stage = [createCard("9", 1, 24)]

        expect(doubleRotation.isDouble.every(ruleExec(players))).toEqual(false)
        //expect(doubleRotation.rules.every(ruleExec(players2, stage))).toEqual(false)
    })

    it("must reject cards of unmatched values", () => {
        let players = [deck.find(x => x.value === "6"), _.findLast(deck, x => x.value === "7")],
            players2 = [deck.find(x => x.value === "5"), _.findLast(deck, x => x.value === "Jack")],
            stage = [deck.find(x => x.value === "4"), deck.find(x => x.value === "4")]

        expect(doubleRotation.isDouble.every(ruleExec(players, stage))).toEqual(false)
        //expect(doubleRotation.rules.every(ruleExec(players2, stage))).toEqual(false)
    })

    it("must accept two cards of matching values whose ranks are higher than the two cards on stage", () => {
        let players = [deck.find(x => x.value === "6"), _.findLast(deck, x => x.value === "6")],
            players2 = [deck.find(x => x.value === "Jack"), _.findLast(deck, x => x.value === "Jack")],
            stage = [deck.find(x => x.value === "4"), deck.find(x => x.value === "4")]

        expect(doubleRotation.isDouble.every(ruleExec(players, stage))).toEqual(true)
        expect(doubleRotation.rules.every(ruleExec(players2, stage))).toEqual(true)
    })
})

describe("Triple rotation", () => {
    it("must reject empty set of cards", () => {
        let players = [],
            stage = [createCard("9", 1, 24)]

        expect(tripleRotation.isTriple.every(ruleExec(players, stage))).toEqual(false)
    })

    it("must not accept any other combination of cards other than a triple", () => {
        let players = _.take(deck.filter(x => ["4", "5", "6"]), 6),
            players2 = _.take(deck.filter(x => ["4", "5", "6"]), 2),
            stage = [createCard("9", 1, 24)]

        expect(tripleRotation.isTriple.every(ruleExec(players))).toEqual(false)
        expect(tripleRotation.isTriple.every(ruleExec(players2))).toEqual(false)
    })

    it("must reject cards of unmatched values", () => {
        let players = [deck.find(x => x.value === "6"), _.findLast(deck, x => x.value === "7"), _.find(deck, x => x.value === "7")],
            players2 = [deck.find(x => x.value === "5"), _.findLast(deck, x => x.value === "Jack"), _.find(deck, x => x.value === "Jack")],
            stage = [deck.find(x => x.value === "4"), deck.find(x => x.value === "4")]

        expect(tripleRotation.isTriple.every(ruleExec(players, stage))).toEqual(false)
        //expect(tripleRotation.rules.every(ruleExec(players2, stage))).toEqual(false)
    })

    it("must accept three cards of matching values whose ranks are higher than the three cards on stage", () => {
        let players = [deck.find(x => x.value === "6"), deck.find(x => x.value === "6"), _.findLast(deck, x => x.value === "6")],
            players2 = [deck.find(x => x.value === "Jack"), deck.find(x => x.value === "Jack"), _.findLast(deck, x => x.value === "Jack")],
            stage = [deck.find(x => x.value === "4"), deck.find(x => x.value === "4"), _.findLast(deck, x => x.value === "4")]

        expect(tripleRotation.isTriple.every(ruleExec(players, stage))).toEqual(true)
        expect(tripleRotation.rules.every(ruleExec(players2, stage))).toEqual(true)
    })
})

describe("FourOfAKind rotation", () => {
    it("must reject empty set of cards", () => {
        let players = [],
            stage = [createCard("9", 1, 24)]

        expect(fourOfAKindRotation.isFourOfAKind.every(ruleExec(players))).toEqual(false)
    })

    it("must not accept any other combination of cards other than a quadrupal", () => {
        let players = _.take(deck.filter(x => ["4", "5", "6"]), 6),
            players2 = _.take(deck.filter(x => ["4", "5", "6"]), 2),
            stage = [createCard("9", 1, 24)]

        expect(fourOfAKindRotation.isFourOfAKind.every(ruleExec(players))).toEqual(false)
    })

    it("must reject cards of unmatched values", () => {
        let players = [deck.find(x => x.value === "6"), _.findLast(deck, x => x.value === "7"), _.find(deck, x => x.value === "7"), _.findLast(deck, x => x.value === "7")],
            players2 = [deck.find(x => x.value === "5"), _.findLast(deck, x => x.value === "Jack"), _.find(deck, x => x.value === "King"), _.findLast(deck, x => x.value === "Jack")]

        expect(fourOfAKindRotation.isFourOfAKind.every(ruleExec(players))).toEqual(false)
        expect(fourOfAKindRotation.isFourOfAKind.every(ruleExec(players2))).toEqual(false)
    })

    it("must accept four cards of matching values whose ranks are higher than the four cards on stage", () => {
        let players = [deck.find(x => x.value === "6"), deck.find(x => x.value === "6"), _.findLast(deck, x => x.value === "6"), _.findLast(deck, x => x.value === "6")],
            players2 = [deck.find(x => x.value === "Jack"), deck.find(x => x.value === "Jack"), _.findLast(deck, x => x.value === "Jack"), _.findLast(deck, x => x.value === "Jack")],
            stage = [deck.find(x => x.value === "4"), deck.find(x => x.value === "4"), _.findLast(deck, x => x.value === "4"), _.findLast(deck, x => x.value === "4")]

        expect(fourOfAKindRotation.isFourOfAKind.every(ruleExec(players, stage))).toEqual(true)
        expect(fourOfAKindRotation.rules.every(ruleExec(players2, stage))).toEqual(true)
    })

    it("must beat a single \"2\" on stage but not any other type of single card", () => {
        let players = [deck.find(x => x.value === "6"), deck.find(x => x.value === "6"), _.findLast(deck, x => x.value === "6"), _.findLast(deck, x => x.value === "6")],
            stage = [deck.find(x => x.value === "2")],
            stage1 = [deck.find(x => x.value !== "2")]

        expect(fourOfAKindRotation.isFourOfAKind.every(ruleExec(players))).toEqual(true)
        expect(fourOfAKindRotation.rules.every(ruleExec(players, stage))).toEqual(false)

        expect(fourOfAKindRotation.exceptions.some(exception => exception.every(ruleExec(players, stage)))).toEqual(true)
        expect(fourOfAKindRotation.exceptions.some(exception => exception.every(ruleExec(players, stage1)))).toEqual(false)
    })
})

describe("Straight Rotation", () => {
    it("must reject empty set of cards", () => {
        let players = []

        expect(straightRotation.isStriaght.every(ruleExec(players))).toEqual(false)
    })

    it("must only accept 3 or more set of cards in sequence", () => {
        let players = [deck.find(x => x.value === "3"), deck.find(x => x.value === "4"), deck.find(x => x.value === "5")],
            players1 = [deck.find(x => x.value === "Jack"), deck.find(x => x.value === "Queen"), deck.find(x => x.value === "King"), deck.find(x => x.value === "Ace")],

            failedPlayers = [deck.find(x => x.value === "3"), deck.find(x => x.value === "4")],
            failedPlayers1 = [deck.find(x => x.value === "4"), deck.find(x => x.value === "4"), deck.find(x => x.value === "5")],
            failedPlayers2 = [deck.find(x => x.value === "Jack"), deck.find(x => x.value === "Queen"), deck.find(x => x.value === "King"), deck.find(x => x.value === "3")]

        expect(straightRotation.isStriaght.every(ruleExec(players))).toEqual(true)
        expect(straightRotation.isStriaght.every(ruleExec(players1))).toEqual(true)

        expect(straightRotation.isStriaght.every(ruleExec(failedPlayers))).toEqual(false)
        expect(straightRotation.isStriaght.every(ruleExec(failedPlayers1))).toEqual(false)
        expect(straightRotation.isStriaght.every(ruleExec(failedPlayers2))).toEqual(false)
    })
})