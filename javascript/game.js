var hangmanDictionary = ["banana", "pineapple", "lychee", "pear", "dragonfruit", "papaya", "strawberry", "mango", "peach", "apple", "plum", "raspberry", "blueberry", "fig", "lemon", "lime", "boysenberry", "salmonberry", "cherry", "tangerine"];

var HangmanGame = {
	//set properties and methods of HangmanGame object for game logic
	incorrectGuessesLeft: 0,
	winsCounter: 0,
	hangmanWord: [],
	guessedLetters: [],
	revealedWord: [],
	totalNumbersRevealed: 0,

	//check if Game is Over
	isGameOver: function () {
		if (this.incorrectGuessesLeft === 0 || this.totalNumbersRevealed === this.hangmanWord.length) {
			//check if player won
			this.didYouWin();
			return true;
		}
		else {
			return false;
		}
	},
	//check if player won
	didYouWin: function () {
		if (this.totalNumbersRevealed === this.hangmanWord.length) {

			return true;
		}
		else {
			return false;
		}
	},
	//check if submitted guess is correct
	isGuessCorrect: function (guess) {
		if (this.hangmanWord.includes(guess)) {
			return true;
		}
		else {
			return false;
		}
	},
	//if a guess is correct, add it to the revealed word at the desired index
	//return number of letters revealed by each check
	reveal: function (guess) {
		var revealedLetters = 0;
		for (var i = 0; i < this.revealedWord.length; i++) {

			if (this.hangmanWord[i] === guess) {
				this.revealedWord[i] = guess;
				revealedLetters++;
			}
			else { };
		}
		return revealedLetters;
	},
	//submit a user guess to the game: add guess to guessed letters if it hasn't been guessed already, check if guess is correct, call reveal() and add result to find win condition, finally decrement guesses left if user is wrong
	submitGuess: function (guess) {

		if (!this.guessedLetters.includes(guess)) {
			this.guessedLetters.push(guess);
			if (this.isGuessCorrect(guess)) {

				// this.reveal(guess);
				this.totalNumbersRevealed += this.reveal(guess);
			}
			else {
				this.incorrectGuessesLeft--;
			}
			return true;
		}
		else {
			return false;
		}
	},
	//set opening game conditions
	initializeGame: function (tmpWord) {
		this.incorrectGuessesLeft = 6;
		this.hangmanWord = tmpWord;
		this.guessedLetters = [];
		this.revealedWord = Array(tmpWord.length).fill(" ");
		this.totalNumbersRevealed = 0;
	}
}
//object for user interface properties and methods
var drawScreen = {
	spanList: [],
	winSound: document.createElement("audio"),
	//Display number of times user has won in this browsing session
	showWins: function () {
		document.getElementById("numberOfWins").textContent = "You've won " + HangmanGame.winsCounter + " games";
	},
	//ask user to keep playing if game is over. If user loses display word user should have guessed . If user wins play the winning sound and display win statement.
	showEnd: function () {
		if (HangmanGame.isGameOver()) {
			document.getElementById("submitId").textContent = "Type the Any key to continue";
			if (!HangmanGame.didYouWin()) {
				document.getElementById("Lose").textContent = "You lose!";
				document.getElementById("hangmanWord").textContent = HangmanGame.hangmanWord.join("");
			}
			else {
				document.getElementById("Lose").textContent = "You've won the game!";
				this.winSound.setAttribute("src", "assets/images/old-fashioned-school-bell-daniel_simon.mp3");
				this.winSound.play();
			}

		}
		//sets value to empty so the user is not being told that they won or that they lost while they are playing
		else {
			document.getElementById("Lose").textContent = "";
		}


	},
	//set initial display values: span elements are removed if there was a previous game, new span elements are created and initialized to blank, pause win sound, and ask the user to submit a guess
	initDisplay: function () {
		parent = document.getElementById("hangmanWord");
		while (parent.hasChildNodes()) {
			parent.removeChild(parent.childNodes[0]);
		}

		this.spanList = [];

		for (var i = 0; i < HangmanGame.revealedWord.length; i++) {
			var blank = document.createElement("span");
			this.spanList.push(blank)
			document.getElementById("hangmanWord").appendChild(blank);
			blank.textContent = " _ ";
		}
		this.winSound.pause();
		document.getElementById("submitId").textContent = "Submit a guess by typing in a letter!";
	},
	//update the spans as the user guesses correctly, at the correct index to display the finished word
	drawWord: function () {
		for (var i = 0; i < HangmanGame.revealedWord.length; i++) {
			blank = this.spanList[i];
			if (HangmanGame.revealedWord[i] === " ") {
				blank.textContent = " _ ";
			}
			else {
				blank.textContent = HangmanGame.revealedWord[i];

			}

		}
	},
	//show the previously guessed letters
	showGuesses: function () {
		var list = "  ";
		for (var i = 0; i < HangmanGame.guessedLetters.length; i++) {
			list += " " + HangmanGame.guessedLetters[i].toString() + " ";
		}
		document.getElementById("previousGuesses").textContent = "Previously guessed: " + list;
	},
	//Displays remaining guesses available to user
	guessesLeft: function () {
		document.getElementById("guessesLeft").textContent = "You have " + HangmanGame.incorrectGuessesLeft + " guesses left";
	},
	//displays the user's current guess
	currentGuess: function (guess) {
		var youGuess = document.getElementById("youGuessed")
		youGuess.textContent = guess;
		youGuess.setAttribute("style", "font-size: 3em;");
	},
	//calls methods necessary to display the game
	displayGame: function (guess) {
		this.showWins();
		this.showGuesses();
		this.showEnd();
		this.drawWord();
		this.guessesLeft();
		this.currentGuess(guess);

	}
}
//initialize the word for the game to a random choice from the globally declared hangmanDictionary, then initialize the game logic, set up the initial display of the game, and call necessary display methods
function setUpGame() {
	var tmpWord = Array.from(hangmanDictionary[Math.floor(Math.random() * hangmanDictionary.length)]);
	HangmanGame.initializeGame(tmpWord);
	drawScreen.initDisplay();
	drawScreen.displayGame();
}
//play the game: if the game is not over, submit guesses and draw the screen; if the game is over, update the winsCounter if the user won and then set up another game
function playGame(guess) {
	if (!HangmanGame.isGameOver()) {
		HangmanGame.submitGuess(guess);
		drawScreen.displayGame(guess);


	}
	else {
		if (HangmanGame.didYouWin()) {
			HangmanGame.winsCounter++
		}
		setUpGame();

	}
}
//set up an initial hangman game
setUpGame();
//get user's input
document.onkeyup = function (event) {
	// Determines which key was pressed.
	var guess = event.key.toLowerCase();
	//make sure the input is a letter
	if (('a' <= guess && guess <= 'z') && guess.length === 1) {
		playGame(guess);
	}
	else {

	}
}