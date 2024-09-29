class Game {
    constructor(state, turn_count, players, active_player, background) {
        this.state = state;
        this.turn_count = turn_count;
        this.players = players;
        this.active_player = active_player;
        this.background = background;
        this.cardList = this.initializeCardList();
    }

    findCardByName(card_name) {
        return this.cardList.find(card => card.name === card_name);
    }

    startGame() {
        this.state = "in progress";
        this.turn_count = 1;
        this.active_player = this.players[0];
    }

    endTurn() {
        this.turn_count++;
        this.active_player = this.players[this.turn_count % this.players.length]; // Switch active player
        saveGame(); // Save state after ending a turn
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
            saveGame(); // Save game state after playing a card
            return `Played ${card.name} from hand.`;
        } else {
            console.log(`Card "${card_name}" not found in hand.`);
            return `Card "${card_name}" not found in hand.`;
        }
    }

    initializeCardList() {
        return [
            new Card("Grow Hedge", (active_player, opposing_player) => {
                opposing_player.mushroom.subtractHealth(5);
                active_player.hedge.addHealth(8);
            }, 10, "seeds"),
            new Card("Spore Blast", (active_player, opposing_player) => {
                opposing_player.mushroom.subtractHealth(10);
            }, 7, "spores"),
        ];
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
    constructor(health, customization) {
        this.health = health;
        this.customization = customization;
    }

    addHealth(amount) {
        this.health += amount;
    }

    subtractHealth(amount) {
        this.health -= amount;
    }
}

class Hedge {
    constructor(health, customization) {
        this.health = health;
        this.customization = customization;
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

class Buff {
    constructor(name, effect, length, turn_activated) {
        this.name = name;
        this.effect = effect;
        this.length = length;
        this.turn_activated = turn_activated;
    }

    checkLength(turn_count) {
        return turn_count - this.turn_activated >= this.length; // Buff has expired
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
const player_one_character = new Character("Spinki", "Spinki Blast", undefined);
const player_two_character = new Character("Zinci", "Zinci Blast", undefined);

const player_one_mushroom = new Mushroom(30, undefined);
const player_two_mushroom = new Mushroom(30, undefined);
const player_one_hedge = new Hedge(20, undefined);
const player_two_hedge = new Hedge(20, undefined);

const player_one_resources = new Resources(5, 5, 5, 5, 5, 5, player_one_mushroom, player_one_hedge);
const player_two_resources = new Resources(5, 5, 5, 5, 5, 5, player_two_mushroom, player_two_hedge);

const player_one_deck = new Deck([
    new Card("Grow Hedge", (active_player, opposing_player) => {
        opposing_player.mushroom.subtractHealth(5);
        active_player.hedge.addHealth(8);
    }, 10, "seeds"),
    new Card("Spore Blast", (active_player, opposing_player) => {
        opposing_player.mushroom.subtractHealth(10);
    }, 7, "spores"),
]);

const player_two_deck = new Deck([
    new Card("Grow Hedge", (active_player, opposing_player) => {
        opposing_player.mushroom.subtractHealth(5);
        active_player.hedge.addHealth(8);
    }, 10, "seeds"),
    new Card("Spore Blast", (active_player, opposing_player) => {
        opposing_player.mushroom.subtractHealth(10);
    }, 7, "spores"),
]);

const player_one_hand = new Hand([], player_one_deck);
const player_two_hand = new Hand([], player_two_deck);

const player_one = new Player("Player 1", player_one_hand, [], player_one_mushroom, player_one_hedge, player_one_deck, player_one_character, player_one_resources);
const player_two = new Player("Player 2", player_two_hand, [], player_two_mushroom, player_two_hedge, player_two_deck, player_two_character, player_two_resources);

const game = new Game("not started", 0, [player_one, player_two], null, null);

// Render hand in UI
function renderHand() {
    const handContainer = document.getElementById('hand-container');
    handContainer.innerHTML = ''; // Clear existing hand

    const activePlayerHand = game.getActivePlayer().hand.cards;

    activePlayerHand.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.innerText = `${card.name} - Cost: ${card.cost} ${card.cost_type}`;
        cardElement.onclick = () => {
            const result = game.playCardByName(card.name);
            updateScoreboard(); // Update scoreboard after playing a card
            alert(result); // Show result of the action
            renderHand(); // Re-render hand
        };
        handContainer.appendChild(cardElement);
    });
}

// Update scoreboard in UI
function updateScoreboard() {
    const player1MushroomHealth = game.players[0].mushroom.health;
    const player1HedgeHealth = game.players[0].hedge.health;
    const player2MushroomHealth = game.players[1].mushroom.health;
    const player2HedgeHealth = game.players[1].hedge.health;

    document.getElementById('player1-mushroom-health').innerText = player1MushroomHealth;
    document.getElementById('player1-hedge-health').innerText = player1HedgeHealth;
    document.getElementById('player2-mushroom-health').innerText = player2MushroomHealth;
    document.getElementById('player2-hedge-health').innerText = player2HedgeHealth;
}

// Load Game State from localStorage
function loadGame() {
    const savedGame = JSON.parse(localStorage.getItem('gameState'));
    if (savedGame) {
        // Restore state logic here
        console.log('Game loaded successfully');
    } else {
        console.log('No saved game found');
    }
}

// Save Game State to localStorage
function saveGame() {
    localStorage.setItem('gameState', JSON.stringify(game));
    console.log('Game saved successfully');
}

// Start Game Logic
function startGame() {
    game.startGame();
    player_one_hand.fillHand();
    player_two_hand.fillHand();
    renderHand();
    updateScoreboard();
}

// Call the function to start the game
// Removed the call here to prevent premature execution
