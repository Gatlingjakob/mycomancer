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
    constructor(name, hand, turn, buffs, mushroom, hedge, deck, character, resources) {
        this.name = name;
        this.hand = hand;
        this.turn = turn;
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
    constructor(resources) {
        this.resources = resources;
    }
}

class Resource{
    constructor(name, type, count) {
        this.name = name;
        this.type = type;
        this.count = count;
    }
}

class Card {
    constructor(name, effect, cost) {
        this.name = name;
        this.effect = effect;
        this.cost = cost;
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

var player_one = new Player("Player 1")
var player_two = new Player("Player 2")

var players = [
    player_one,
    player_two,
];

var game = new Game("start", 0, players, players[0]);

// use in game loop to check for buffs
// player.buffs = player.buffs.filter(buff => !buff.checkLength(game.turn_count));
