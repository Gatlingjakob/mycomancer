class Game {
    constructor() {
        this.state = "not started";
        this.turn_count = 0;
        this.players = [];
        this.active_player = null;
        this.cardList = this.initializeCardList();
        this.loadGame(); // Load game state from localStorage
    }

    initializeCardList() {
        return [
            new Card("Bush", (active_player, opposing_player) => {
                active_player.hedge.addHealth(3);
            }, 1, "seeds"),
            new Card("Stem", (active_player, opposing_player) => {
                active_player.mushroom.addHealth(2);
            }, 1, "seeds"),
            new Card("Hedge", (active_player, opposing_player) => {
                active_player.hedge.addHealth(6);
            }, 3, "seeds"),
            new Card("Compost", (active_player, opposing_player) => {
                if(active_player.hedge >= 4){
                    active_player.mushroom.addHealth(8);
                    active_player.hedge.subtractHealth(4);
                } else{    
                    active_player.mushroom.addHealth(4);
                }
            }, 3, "seeds"),
            new Card("Grow", (active_player, opposing_player) => {
                active_player.mushroom.addHealth(5);
            }, 5, "seeds"),
            new Card("Greenhouse", (active_player, opposing_player) => {
                active_player.resources.gardeners = active_player.resources.gardeners + 1;
            }, 8, "seeds"),
            new Card("Root Tap", (active_player, opposing_player) => {
                active_player.mushroom.addHealth(8);
                opposing_player.mushroom.subtractHealth(4);
            }, 10, "seeds"),
            new Card("Garden Wall", (active_player, opposing_player) => {
                active_player.hedge.addHealth(22);
            }, 12, "seeds"),
            new Card("Fungus", (active_player, opposing_player) => {
                active_player.mushroom.addHealth(20);
            }, 18, "seeds"),
            new Card("Tower Cap", (active_player, opposing_player) => {
                active_player.mushroom.addHealth(32);
            }, 39, "seeds"),
            new Card("Mites", (active_player, opposing_player) => {
                this.dealDamage(2, opposing_player);
            }, 1, "rations"),
            new Card("Beetle", (active_player, opposing_player) => {
                this.dealDamage(3, opposing_player);
            }, 2, "rations"),
            new Card("Mantis", (active_player, opposing_player) => {
                this.dealDamage(6, opposing_player);
            }, 4, "rations"),
            new Card("Colony", (active_player, opposing_player) => {
                active_player.resources.nurturers = active_player.resources.nurturers + 1;
            }, 8, "rations"),
            new Card("Wolves", (active_player, opposing_player) => {
                this.dealDamage(12, opposing_player);
            }, 10, "rations"),
            new Card("Sabotage", (active_player, opposing_player) => {
                opposing_player.resources.seeds = active_player.resources.seeds - 4;
                opposing_player.resources.spores = active_player.resources.spores - 4;
                opposing_player.resources.rations = active_player.resources.rations - 4;
            }, 12, "rations"),
            new Card("Heist", (active_player, opposing_player) => {
                opposing_player.resources.seeds = active_player.resources.seeds - 5;
                opposing_player.resources.spores = active_player.resources.spores - 5;
                opposing_player.resources.rations = active_player.resources.rations - 5;
                active_player.resources.seeds = active_player.resources.seeds + 5;
                active_player.resources.spores = active_player.resources.spores + 5;
                active_player.resources.rations = active_player.resources.rations + 5;
            }, 15, "rations"),
            new Card("Grizzly", (active_player, opposing_player) => {
                opposing_player.mushroom.subtractHealth(10);
            }, 18, "rations"),
            new Card("Armada", (active_player, opposing_player) => {
                this.dealDamage(32, opposing_player);
            }, 28, "rations"),
            new Card("Sprout", (active_player, opposing_player) => {
                active_player.resources.seeds = active_player.resources.seeds + 8;
            }, 4, "spores"),
            new Card("Mycelium", (active_player, opposing_player) => {
                active_player.resources.spores = active_player.resources.spores + 10;
            }, 4, "spores"),
            new Card("Conjure", (active_player, opposing_player) => {
                active_player.resources.rations = active_player.resources.rations + 8;
            }, 4, "spores"),
            new Card("Wither", (active_player, opposing_player) => {
                opposing_player.resources.seeds = opposing_player.resources.seeds - 8;
            }, 4, "spores"),
            new Card("Spore Zap", (active_player, opposing_player) => {
                opposing_player.resources.spores = opposing_player.resources.spores - 8;
            }, 4, "spores"),
            new Card("Mold", (active_player, opposing_player) => {
                opposing_player.resources.rations = opposing_player.resources.rations - 8;
            }, 4, "spores"),
            new Card("Colony", (active_player, opposing_player) => {
                active_player.resources.sporecerers = active_player.resources.sporecerers + 1;
            }, 8, "rations"),
            new Card("Fae Barrage", (active_player, opposing_player) => {
                this.dealDamage(25, opposing_player);
            }, 21, "spores"),
            new Card("Root Network", (active_player, opposing_player) => {
                active_player.mushroom.addHealth(22);
            }, 22, "spores"),
            new Card("Hive Mind", (active_player, opposing_player) => {
                active_player.resources.sporecerers = active_player.resources.sporecerers + 1;
                active_player.resources.sporecerers = active_player.resources.sporecerers + 1;
                active_player.resources.sporecerers = active_player.resources.sporecerers + 1;
                opposing_player.resources.sporecerers = opposing_player.resources.sporecerers - 1;
                opposing_player.resources.sporecerers = opposing_player.resources.sporecerers - 1;
                opposing_player.resources.sporecerers = opposing_player.resources.sporecerers - 1;
            }, 45, "spores"),
        ];
    }

    dealDamage(damage, opponent) {
        if (opponent.hedge > 0) {
            if (damage <= opponent.hedge) {
                opponent.hedge -= damage; // Deal damage to hedge
            } else {
                const overkill = damage - opponent.hedge; // Calculate overkill damage
                opponent.hedge = 0; // Shield is exhausted
                opponent.mushroom -= overkill; // Deal excess damage to mushroom
            }
        } else {
            opponent.mushroom -= damage; // Directly deal damage to mushroom
        }

        // Ensure mushroom and hedge do not go negative
        opponent.hedge = Math.max(opponent.hedge, 0);
    }

    startGame() {
        this.state = "in progress";
        this.turn_count = 1;
        this.active_player = this.players[0];
        this.updateUI(); // Update UI to reflect starting state
        this.saveGame(); // Save game state after starting
    }

    endTurn() {
        this.turn_count++;
        this.active_player = this.players[this.turn_count % this.players.length]; // Switch active player
        this.updateUI(); // Update UI after ending a turn
        this.saveGame(); // Save game state after ending a turn
    }

    getActivePlayer() {
        return this.active_player; // Return active player
    }

    getOpposingPlayer() {
        return this.players.find(player => player !== this.active_player); // Find opposing player
    }

    playCardByName(card_name) {
        const activePlayer = this.getActivePlayer();
        const card = activePlayer.hand.cards.find(card => card.name === card_name);

        if (card) {
            card.play(activePlayer, this.getOpposingPlayer()); // Play the card
            activePlayer.hand.discardCard(card); // Discard card after play
            this.updateUI(); // Update UI after playing a card
            this.saveGame(); // Save game state after playing a card
            return `Played ${card.name} from hand.`;
        } else {
            console.log(`Card "${card_name}" not found in hand.`);
            return `Card "${card_name}" not found in hand.`;
        }
    }

    updateUI() {
        // Update player resource values in the UI
        this.players.forEach((player, index) => {
            document.getElementById(`player${index + 1}-mushroom-health`).innerText = player.mushroom.health;
            document.getElementById(`player${index + 1}-hedge-health`).innerText = player.hedge.health;
            document.getElementById(`player${index + 1}-resources`).innerText = `${player.resources.spores} Spores, ${player.resources.seeds} Seeds, ${player.resources.rations} Rations`;
        });
    }

    saveGame() {
        const gameState = {
            state: this.state,
            turn_count: this.turn_count,
            players: this.players,
            active_player: this.active_player.name,
        };
        localStorage.setItem('gameState', JSON.stringify(gameState));
    }

    loadGame() {
        const savedState = localStorage.getItem('gameState');
        if (savedState) {
            const { state, turn_count, players, active_player } = JSON.parse(savedState);
            this.state = state;
            this.turn_count = turn_count;
            this.active_player = this.players.find(player => player.name === active_player);
            this.players = players.map(playerData => {
                return new Player(
                    playerData.name,
                    new Hand(playerData.hand.cards, new Deck([])), // Assuming empty deck for simplicity
                    playerData.buffs,
                    new Mushroom(playerData.mushroom.health),
                    new Hedge(playerData.hedge.health),
                    new Deck([]), // Assuming empty deck for simplicity
                    playerData.character,
                    new Resources(playerData.resources.spores, playerData.resources.seeds, playerData.resources.rations)
                );
            });
            this.updateUI(); // Update UI from loaded state
        } else {
            // Initialize default players if no game state found
            this.players = [
                new Player("Player 1", new Hand([], new Deck([])), [], new Mushroom(30), new Hedge(20), new Deck([]), "", new Resources(5, 5, 5)),
                new Player("Player 2", new Hand([], new Deck([])), [], new Mushroom(30), new Hedge(20), new Deck([]), "", new Resources(5, 5, 5)),
            ];
        }
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
}

class Resources {
    constructor(sporecerers, spores, gardeners, seeds, nurturers, rations) {
        this.sporecerers = sporecerers;
        this.spores = spores;
        this.gardeners = gardeners;
        this.seeds = seeds;
        this.nurturers = nurturers;
        this.rations = rations;
    }
}

class Card {
    constructor(name, effect, cost, cost_type) {
        this.name = name;
        this.effect = effect;
        this.cost = cost;
        this.cost_type = cost_type;
    }

    play(active_player, opposing_player) {
        const resourceType = active_player.resources[this.cost_type];
        if (resourceType >= this.cost) {
            active_player.resources[this.cost_type] -= this.cost; // Deduct the resource cost
            this.effect(active_player, opposing_player); // Invoke the card's effect
        } else {
            console.log(`Not enough ${this.cost_type} to play ${this.name}.`);
        }
    }
}

class Mushroom {
    constructor(health) {
        this.health = health;
    }

    addHealth(amount) {
        this.health += amount;
    }

    subtractHealth(amount) {
        this.health -= amount;
    }
}

class Hedge {
    constructor(health) {
        this.health = health;
    }

    addHealth(amount) {
        this.health += amount;
    }

    subtractHealth(amount) {
        this.health -= amount;
    }
}

class Deck {
    constructor(cards) {
        this.cards = cards;
        this.size = cards.length;
    }

    shuffle() {
        // Fisher-Yates shuffle algorithm
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
        return this.cards;
    }
}

class Hand {
    constructor(cards, deck) {
        this.cards = cards; // Array of cards currently in hand
        this.deck = deck;   // Reference to the deck
        this.maxHandSize = 7; // Maximum hand size
    }

    fillHand() {
        while (this.cards.length < this.maxHandSize && this.deck.cards.length > 0) {
            const drawnCard = this.deck.cards.pop(); // Draw a card from the deck
            this.cards.push(drawnCard); // Add it to the hand
        }
        return `Hand filled with ${this.cards.length} cards.`;
    }

    drawCard() {
        if (this.cards.length < this.maxHandSize && this.deck.cards.length > 0) {
            const drawnCard = this.deck.cards.pop(); // Draw the top card from the deck
            this.cards.push(drawnCard); // Add it to the hand
            return `Drew ${drawnCard.name} from the deck.`;
        } else if (this.cards.length >= this.maxHandSize) {
            return 'Cannot draw card, hand is full!';
        } else {
            return 'No cards left in the deck to draw!';
        }
    }

    discardCard(card) {
        const index = this.cards.indexOf(card);
        if (index > -1) {
            this.cards.splice(index, 1); // Remove the card from hand
            return `Discarded ${card.name} from hand.`;
        } else {
            return 'Card not found in hand.';
        }
    }
}

// Initialize the Game
const game = new Game();

function startGame() {
    game.startGame();
}

// Example of playing a card
function playCard(cardName) {
    console.log(game.playCardByName(cardName));
}
