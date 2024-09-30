// current bugs:
// add discard
// add game over conditions etc when everything else works
// add UI
// art assets

// Card class to represent each card
class Card {
    constructor(name, effect, cost, cost_type, effect_description) {
        this.name = name;
        this.effect = effect; // Function to call when card is played
        this.cost = cost; // Cost to play the card
        this.cost_type = cost_type; // Type of cost (seeds, spores, rations)
        this.effect_description = effect_description; // Type of cost (seeds, spores, rations)
    }

    play(active_player, opposing_player) {
        this.effect(active_player, opposing_player); // Execute the card effect
    }
}

// Deck class to represent a deck of cards
class Deck {
    constructor(cards) {
        this.cards = cards; // Array of Card objects
    }

    shuffle() {
        // Simple shuffle algorithm
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    drawCard() {
        return this.cards.pop(); // Draw the top card
    }
}

// Hand class to represent a player's hand of cards
class Hand {
    constructor(cards, deck) {
        this.cards = cards; // Array of Card objects in hand
        this.deck = deck; // The deck from which to draw cards
    }

    fillHand() {
        while (this.cards.length < 7 && this.deck.cards.length > 0) { // Ensure hand has 5 cards
            const card = this.deck.drawCard(); // Draw card from deck
            this.cards.push(card); // Add card to hand
        }
    }

    discardCard(card) {
        const index = this.cards.indexOf(card);
        if (index !== -1) {
            this.cards.splice(index, 1); // Remove card from hand
        }
    }
}

// Player class to represent a player in the game
class Player {
    constructor(name, hand, playedCards, mushroom, hedge, effect, resources) {
        this.name = name; // Player name
        this.hand = hand; // Player's hand
        this.playedCards = playedCards; // Cards that have been played
        this.mushroom = mushroom; // Player's mushroom (health)
        this.hedge = hedge; // Player's hedge (health)
        this.effect = effect; // Effect of the player (if any)
        this.resources = resources; // Player's resources
    }
}

// Mushroom class to manage the health of the mushroom
class Mushroom {
    constructor(health) {
        this.health = health; // Health of the mushroom
    }

    addHealth(amount) {
        this.health += amount; // Add health
    }

    subtractHealth(amount) {
        this.health -= amount; // Subtract health
    }
}

// Hedge class to manage the health of the hedge
class Hedge {
    constructor(health) {
        this.health = health; // Health of the hedge
    }

    addHealth(amount) {
        this.health += amount; // Add health
    }

    subtractHealth(amount) {
        this.health -= amount; // Subtract health
    }
}

// Resources class to manage a player's resources
class Resources {
    constructor(seeds, spores, rations, gardeners, nurturers, sporecerers) {
        this.seeds = seeds; // Number of seeds
        this.spores = spores; // Number of spores
        this.rations = rations; // Number of rations
        this.gardeners = gardeners; // Number of gardeners
        this.nurturers = nurturers; // Number of nurturers
        this.sporecerers = sporecerers; // Number of sporecerers
    }
}

// Game class to manage the overall game state
class Game {
    constructor() {
        this.state = "not started"; // Initial game state
        this.turn_count = 0; // Track turn count
        this.players = []; // Array to hold players
        this.cardList = this.initializeCardList(); // Initialize card list
        this.active_player = null; // Current active player
        this.loadGame(); // Load game state from localStorage
    }

    initializeCardList() {
        const cardBaseList = [
            new Card("Bush", (active_player, opposing_player) => {
                active_player.hedge.addHealth(3);
            }, 1, "seeds", "Hedge +3"),
            new Card("Stem", (active_player, opposing_player) => {
                active_player.mushroom.addHealth(2);
            }, 1, "seeds", "Mushroom +2"),
            new Card("Hedge", (active_player, opposing_player) => {
                active_player.hedge.addHealth(6);
            }, 3, "seeds", "Hedge +6"),
            new Card("Compost", (active_player, opposing_player) => {
                if(active_player.hedge.health >= 4){
                    active_player.mushroom.addHealth(8);
                    active_player.hedge.subtractHealth(4);
                } else{    
                    active_player.mushroom.addHealth(4);
                }
            }, 3, "seeds", "Mushroom +8, Hedge -4"),
            new Card("Grow", (active_player, opposing_player) => {
                active_player.mushroom.addHealth(5);
            }, 5, "seeds", "Mushroom +5"),
            new Card("Greenhouse", (active_player, opposing_player) => {
                active_player.resources.gardeners++;
            }, 8, "seeds", "Gardeners +1"),
            new Card("Root Tap", (active_player, opposing_player) => {
                active_player.mushroom.addHealth(8);
                this.dealDamage(4, opposing_player);
            }, 10, "seeds", "Mushroom +8, Attack 4"),
            new Card("Garden Wall", (active_player, opposing_player) => {
                active_player.hedge.addHealth(22);
            }, 12, "seeds", "Hedge +22"),
            new Card("Fungus", (active_player, opposing_player) => {
                active_player.mushroom.addHealth(20);
            }, 18, "seeds", "Mushroom +20"),
            new Card("Tower Cap", (active_player, opposing_player) => {
                active_player.mushroom.addHealth(32);
            }, 39, "seeds", "Mushroom +32"),
            new Card("Mites", (active_player, opposing_player) => {
                this.dealDamage(2, opposing_player);
            }, 1, "rations", "Attack 2"),
            new Card("Beetle", (active_player, opposing_player) => {
                this.dealDamage(3, opposing_player);
            }, 2, "rations", "Attack 3"),
            new Card("Mantis", (active_player, opposing_player) => {
                this.dealDamage(6, opposing_player);
            }, 4, "rations", "Attack 6"),
            new Card("Colony", (active_player, opposing_player) => {
                active_player.resources.nurturers++;
            }, 8, "rations", "Nurturers +1"),
            new Card("Wolves", (active_player, opposing_player) => {
                this.dealDamage(12, opposing_player);
            }, 10, "rations", "Attack 12"),
            new Card("Sabotage", (active_player, opposing_player) => {
                opposing_player.resources.seeds -= 4;
                opposing_player.resources.spores -= 4;
                opposing_player.resources.rations -= 4;
            }, 12, "rations", "Enemy Resources -4"),
            new Card("Heist", (active_player, opposing_player) => {
                opposing_player.resources.seeds -= 5;
                opposing_player.resources.spores -= 5;
                opposing_player.resources.rations -= 5;
                active_player.resources.seeds += 5;
                active_player.resources.spores += 5;
                active_player.resources.rations += 5;
            }, 15, "rations", "Steal 5 Resources"),
            new Card("Grizzly", (active_player, opposing_player) => {
                this.dealDamage(16, opposing_player);
            }, 15, "rations", "Attack 16"),
            new Card("Armada", (active_player, opposing_player) => {
                this.dealDamage(32, opposing_player);
            }, 28, "rations", "Attack 32"),
            new Card("Sprout", (active_player, opposing_player) => {
                active_player.resources.seeds += 8;
            }, 4, "spores", "Seeds +8"),
            new Card("Mycelium", (active_player, opposing_player) => {
                active_player.resources.spores += 10;
            }, 5, "spores", "Spores +10"),
            new Card("Conjure", (active_player, opposing_player) => {
                active_player.resources.rations += 8;
            }, 4, "spores", "Rations +8"),
            new Card("Wither", (active_player, opposing_player) => {
                opposing_player.resources.seeds -= 8;
            }, 4, "spores", "Enemy Seeds -8"),
            new Card("Spore Zap", (active_player, opposing_player) => {
                opposing_player.resources.spores -= 8;
            }, 4, "spores", "Enemy Spores -8"),
            new Card("Mold", (active_player, opposing_player) => {
                opposing_player.resources.rations -= 8;
            }, 4, "spores", "Enemy Spores -8"),
            new Card("Symposium", (active_player, opposing_player) => {
                active_player.resources.sporecerers++;
            }, 8, "rations", "Sporecerers +1"),
            new Card("Neural Barrage", (active_player, opposing_player) => {
                this.dealDamage(25, opposing_player);
            }, 21, "spores", "Attack 25"),
            new Card("Root Network", (active_player, opposing_player) => {
                active_player.resources.seeds += 18;
                active_player.resources.spores += 18;
                active_player.resources.rations += 18;
            }, 40, "seeds", "Resources +12"),
        ];

        const fullCardList = [];

        // Add 2-3 copies of each card to the deck
        cardBaseList.forEach(card => {
            const numberOfCopies = Math.floor(Math.random() * 2) + 2; // Randomly add 2 or 3 copies
            for (let i = 0; i < numberOfCopies; i++) {
                fullCardList.push(new Card(card.name, card.effect, card.cost, card.cost_type, card.effect_description));
            }
        });

        return fullCardList; // Return the full card list with duplicates
    }

    dealDamage(damage, opponent) {
        if (opponent.hedge.health > 0) {
            if (damage <= opponent.hedge.health) {
                opponent.hedge.health -= damage; // Deal damage to hedge
            } else {
                const overkill = damage - opponent.hedge.health; // Calculate overkill damage
                opponent.hedge.health = 0; // Shield is exhausted
                opponent.mushroom.health -= overkill; // Deal excess damage to mushroom
            }
        } else {
            opponent.mushroom.health -= damage; // Directly deal damage to mushroom
        }

        // Ensure hedge does not go negative
        opponent.hedge.health = Math.max(opponent.hedge.health, 0);
    }

    initializePlayers() {
        if(this.players.length < 2){
            const player1Resources = new Resources(50, 50, 50, 2, 2, 2);
            const player2Resources = new Resources(50, 50, 50, 2, 2, 2);
            const player1Mushroom = new Mushroom(30);
            const player1Hedge = new Hedge(20);
            const player2Mushroom = new Mushroom(30);
            const player2Hedge = new Hedge(20);

            const player1Hand = new Hand([], new Deck(this.cardList));
            const player2Hand = new Hand([], new Deck(this.cardList));

            player1Hand.deck.shuffle();
            player2Hand.deck.shuffle();

            player1Hand.fillHand(); // Fill hand for player 1
            player2Hand.fillHand(); // Fill hand for player 2

            this.players.push(new Player("Player 1", player1Hand, [], player1Mushroom, player1Hedge, null, player1Resources));
            this.players.push(new Player("Player 2", player2Hand, [], player2Mushroom, player2Hedge, null, player2Resources));

            this.active_player = this.players[0]; // Set the first player as active
        }
    }

    startGame() {
        this.initializePlayers(); // Initialize players when the game starts
        this.state = "started"; // Change game state
        this.updateUI(); // Update the UI after starting the game
    }

    playCardByName(cardName) {
        const cardIndex = this.active_player.hand.cards.findIndex(card => card.name === cardName);
        if (cardIndex !== -1) {
            const card = this.active_player.hand.cards[cardIndex];
            if (this.canPlayCard(card)) {
                card.play(this.active_player, this.getOpposingPlayer()); // Play the card
                this.active_player.hand.discardCard(card); // Discard the played card
                this.active_player.hand.fillHand(); // Refill the hand after playing a card
                this.endTurn(); // End the current turn
                return `Played card: ${card.name}`;
            } else {
                return `Not enough resources to play ${card.name}`;
            }
        } else {
            return `Card ${cardName} not found in hand`;
        }
    }

    canPlayCard(card) {
        // Check if the active player has enough resources to play the card
        if (card.cost_type === "seeds" && this.active_player.resources.seeds >= card.cost) {
            return true;
        }
        if (card.cost_type === "rations" && this.active_player.resources.rations >= card.cost) {
            return true;
        }
        if (card.cost_type === "spores" && this.active_player.resources.spores >= card.cost) {
            return true;
        }
        return false; // Not enough resources
    }

    getOpposingPlayer() {
        // Return the opposing player
        return this.players.find(player => player !== this.active_player);
    }

    endTurn() {
        // Move to the next player's turn
        this.active_player = this.players[(this.players.indexOf(this.active_player) + 1) % this.players.length];
        this.active_player.resources.seeds += this.active_player.resources.gardeners;
        this.active_player.resources.spores += this.active_player.resources.sporecerers;
        this.active_player.resources.rations += this.active_player.resources.nurturers;
        this.turn_count++; // Increment turn count
        this.updateUI(); // Update the UI after ending the turn
        updateScoreboardUI(); // Ensure the scoreboard is updated at the end of each turn
    }

    loadGame() {
        // Initialize players when the game loads or starts
        this.initializePlayers();
    }

    saveGame() {
        // Code to save the game state to localStorage or other persistent storage
    }

    updateUI() {
        // Code to update the UI based on the current game state
        console.log(`Current turn: Player ${this.active_player.name}`); // Example of UI update
    }
}

// Initialize the Game
const game = new Game();

// Function to start the game
function startGame() {
    game.startGame();
}

// Example of playing a card
function playCard(cardName) {
    console.log(game.playCardByName(cardName));
}

// Start the game (this could be triggered by a button in your UI)
startGame();

// Example of playing a card (this could be triggered by a UI element as well)
playCard("Bush"); // Replace with the card name you want to play
