class Game {
    constructor(state, turn_count, players, active_player, background) {
      this.state = state;
      this.turn_count = turn_count;
      this.players = players;
      this.active_player = active_player;
      this.background = background;
    }

    startGame() {
        this.state = "in progress";
        this.turn_count = 1;
        this.active_player = this.players[0];
    }

    endTurn() {
        this.turn_count++;
        this.active_player = this.players[this.turn_count % this.players.length]; // Switch active player
    }
}

class Player {
    constructor(name, hand, buffs, mushroom, hedge, deck, character, resources) {
        this.name = name;
        this.hand = hand;
        this.buffs = buffs;
        this.mushroom = mushroom;
        this.hedge = hedge;
        this.deck = deck;
        this.character = character;
        this.resources = resources;
    }

    play_card(card){
        return `${this.name} played ${card}`;
    }
}

 class Resources {
    constructor(sporecerers, spores, gardeners, seeds, nurturers, rations, mushroom, hedge) {
        this.sporecerers = sporecerers;
        this.spores = spores;
        this.gardeners = gardeners;
        this.seeds = seeds;
        this.nurturers = nurturers;
        this.rations = rations;
        this.mushroom = mushroom;
        this.hedge = hedge;
    }
}

/* class Resource{
    constructor(name, type, count) {
        this.name = name;
        this.type = type;
        this.count = count;
    }
} */

class Card {
    constructor(name, effect, cost, cost_type) {
        this.name = name;
        this.effect = effect;
        this.cost = cost;
        this.cost_type = cost_type;
    }
}

class Mushroom {
    constructor(health, customization) {
        this.health = health;
        this.customization = customization;
    }

    addHealth(health_received){
        this.health += health_received;
    }

    subtractHealth(damage_taken){
        this.health -= damage_taken;
    }
}

class Hedge {
    constructor(health, customization) {
        this.health = health;
        this.customization = customization;
    }

    addHealth(health_received){
        this.health += health_received;
    }

    subtractHealth(damage_taken){
        this.health -= damage_taken;
    }
}

class Deck {
    constructor(cards, size) {
        this.cards = cards;
        this.size = size;
    }

    shuffle(){
        return "shuffled deck";
    }

    /* shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
        return this.cards;
    } */
}

class Hand {
    constructor(cards, deck) {
        this.cards = cards;
        this.deck = deck;
    }

    fillhand(){
        return 'hand filled'
    }

    drawCard(card, deck){
        return `drew ${card} from ${deck}`;
    }

    discardCard(card){
        return `discarded ${card}`;
    }

    /* drawCard() {
        if (this.deck && this.deck.cards.length > 0) {
            const drawnCard = this.deck.cards.pop();
            this.cards.push(drawnCard);
            return drawnCard;
        } else {
            console.log("No cards to draw!");
            return null;
        }
    }

    discardCard(card) {
        const index = this.cards.indexOf(card);
        if (index > -1) {
            this.cards.splice(index, 1);
            return card;
        } else {
            console.log("Card not in hand");
            return null;
        }
    } */
}

class Buff {
    constructor(name, effect, length, turn_activated) {
        this.name = name;
        this.effect = effect;
        this.length = length;
        this.turn_activated = turn_activated;
    }

    checkLength(turn_count) {
        if (turn_count - this.turn_activated >= this.length) {
            return true;  // Buff has expired
        }
        return false;  // Buff is still active
    }
}

class Character {
    constructor(name, skill, customization) {
        this.name = name;
        this.skill = skill;
        this.customization = customization;
    }
}

// Instantiate Data and setup game loop

var test_card = new Card(
    "Grow Hedge", 
    function (active_player) {
    opponent.health -= 5;
    active_player.hedge.health += 8;
    }, 
    10, 
    "seeds")

var player_one_character = new Character("Spinki", "Spinki Blast", undefined);
var player_two_character = new Character("Zinci", "Zinci Blast", undefined);

var player_one_deck_cards = [];
var player_two_deck_cards = [];

var player_one_deck = new Deck(player_one_deck_cards, player_one_deck_cards.length)
var player_two_deck = new Deck(player_two_deck_cards, player_two_deck_cards.length)

var player_one_hand = new Hand(undefined, player_one_deck)
var player_two_hand = new Hand(undefined, player_two_deck)

var player_one_mushroom = new Mushroom(30)
var player_two_mushroom = new Mushroom(30)

var Player_one_hedge = new Hedge(20)
var Player_two_hedge = new Hedge(20)

var player_one_resources = new Resources(2, 5, 2, 5, 2, 5, player_one_mushroom.health, player_one_hedge.health)
var player_two_resources = new Resources(2, 5, 2, 5, 2, 5, player_two_mushroom.health, player_two_hedge.health)

var player_one = new Player("Player 1", player_one_hand, [], player_one_mushroom, player_one_hedge, player_one_deck, player_one_character, player_one_resources)
var player_two = new Player("Player 2", player_two_hand, [], player_two_mushroom, player_two_hedge, player_two_deck, player_two_character, player_two_resources)

var players = [
    player_one,
    player_two,
];

var game = new Game("start", 0, players, players[0]);

// use game loop to check for buffs
// player.buffs = player.buffs.filter(buff => !buff.checkLength(game.turn_count));
