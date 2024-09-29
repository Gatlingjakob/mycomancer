// State Machine for Card Game
class StateMachine {
    constructor() {
        this.states = {
            START: 'start',
            DEAL: 'deal',
            PLAYER_TURN: 'player_turn',
            GAME_OVER: 'game_over'
        };
        this.currentState = this.states.START;
    }

    // Transition to a new state
    transition(newState) {
        console.log(`Transitioning from ${this.currentState} to ${newState}`);
        this.currentState = newState;
        this.renderState(); // Re-render the game based on the new state
    }

    // Render game based on the current state
    renderState() {
        const gameBoard = document.getElementById('game-board');

        switch (this.currentState) {
            case this.states.START:
                gameBoard.innerHTML = `<p>Welcome to the Card Game!</p>`;
                break;
            case this.states.DEAL:
                gameBoard.innerHTML = `<p>Dealing Cards...</p>`;
                // Deal cards to players (logic to deal cards goes here)
                break;
            case this.states.PLAYER_TURN:
                gameBoard.innerHTML = `<p>It's your turn!</p>`;
                // Handle player's turn
                break;
            case this.states.GAME_OVER:
                gameBoard.innerHTML = `<p>Game Over! Thanks for playing.</p>`;
                break;
            default:
                gameBoard.innerHTML = `<p>Unknown state!</p>`;
        }
    }
}

// Initialize the state machine
const game = new StateMachine();

// Start Button Event Listener
document.getElementById('startBtn').addEventListener('click', () => {
    game.transition(game.states.DEAL);  // Move to the "Deal" state when Start is clicked

    // Simulate moving to the player's turn after dealing cards
    setTimeout(() => {
        game.transition(game.states.PLAYER_TURN);
    }, 2000);  // 2-second delay for dealing
});

// Example function to transition to Game Over state after player's turn
setTimeout(() => {
    game.transition(game.states.GAME_OVER);
}, 5000);  // Simulate game over after 5 seconds