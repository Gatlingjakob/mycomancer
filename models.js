class Game {
    constructor(state, turn_count, players, active_player) {
      this.state = state;
      this.turn_count = turn_count;
      this.players = players;
      this.active_player = active_player;
    }
}

class Player {
    constructor(name, hand, turn, buffs, mushroom, hedge, deck, hand, character) {
        this.name = name;
        this.hand = hand;
        this.turn = turn;
        this.buffs = buffs;
        this.mushroom = mushroom;
        this.hedge = hedge;
        this.deck = deck;
        this.hand = hand;
        this.character = character;
    }

    play_card(card){
        return `${this.name} played ${card}`;
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
}

class Buff {
    constructor(name, effect, length, turn_activated) {
        this.name = name;
        this.effect = effect;
        this.length = length;
        this.turn_activated = turn_activated;
    }

    checkLength(length, turn_count, turn_activated){
        if(turn_count - turn_activated > length){
            return `${this.name} expired`;
        }
    }
}

class Character {
    constructor(name, skill, customization) {
        this.name = name;
        this.skill = skill;
        this.customization = customization;
    }
}

// Instantiate Data