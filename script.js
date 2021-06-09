import { cards, cardsBack } from './cards.js';

//Global functions
function between(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

//Game script
const game = (() => {
	const functions = (() => {
		const shuffle = a => {
			//shuffle
			for (let i = a.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[a[i], a[j]] = [a[j], a[i]];
			}
			return a;
		};

		const draw = (hand, from) => {
			let i = between(0, from.length - 1);
			let card = from[i];
			from.splice(i, 1);

			hand.push(card);
		};

		const getSum = hand => {
			let aceCount = 0;
			let sum = 0;

			//add sum of each card
			hand.forEach(card => {
				sum += card.value;
				if (card.value === 11) aceCount++;
			});

			//Need to change ace value from 11 to 1 when over 21
			if (sum > 21 && aceCount > 0) {
				let keepGoing = true;
				let i = aceCount;

				//Changing only minimal number of 11 to 1
				while (keepGoing) {
					sum -= 10;

					if (sum < 21 || --i == 0) keepGoing = false;
				}
			}

			return sum;
		};

		const isBusted = hand => {
			let sum = getSum(hand);

			if (sum > 21) {
				mainText.innerHTML = 'Busted!';
				board.disableButtons();
			}
		};

		const checkForBlackjack = () => {
			if (functions.getSum(playerHand) === 21) {
				board.disableButtons();

				mainText.innerHTML = 'Blackjack! You won!';
			}
		};

		const stand = () => {
			board.disableButtons();

			dealerHide = false;
			board.renderDealerCards();

			board.renderDealerValue();

			let keepGoing = true;
			while (keepGoing) {
				let dealerSum = functions.getSum(dealerHand);
				let playerSum = functions.getSum(playerHand);

				//Check if dealer needs to draw a card
				if (dealerSum < 17) {
					functions.draw(dealerHand, deck);
					board.renderDealerCards();
					board.renderDealerValue();
				}

				//Check for blackjack
				if (dealerSum === 21) {
					mainText.innerHTML = 'Blackjack! Dealer won!';
					keepGoing = false;
				}

				//Checking who have better value
				if (dealerSum >= 17) {
					keepGoing = false;

					if (dealerSum > 21) {
						mainText.innerHTML = 'Dealer is busted! You won!';
					} else if (dealerSum > playerSum) {
						mainText.innerHTML = 'Dealer won!';
					} else if (dealerSum < playerSum) {
						mainText.innerHTML = 'You won!';
					} else {
						mainText.innerHTML = 'Draw!';
					}
				}
			}
		};

		return {
			shuffle,
			draw,
			getSum,
			isBusted,
			checkForBlackjack,
			stand,
		};
	})();

	//Board script (Visuals)
	const board = (() => {
		const renderPlayerCards = () => {
			const deck = document.querySelector('.player');
			deck.innerHTML = '';
			playerHand.forEach(card => {
				const img = document.createElement('img');
				img.src = card.path;

				deck.appendChild(img);
			});

			renderPlayerValue();
		};

		const renderDealerCards = () => {
			const deck = document.querySelector('.dealer');
			deck.innerHTML = '';
			dealerHand.forEach(card => {
				const img = document.createElement('img');
				if (dealerHand.indexOf(card) == 0 && dealerHide)
					img.src = cardsBack.path;
				else img.src = card.path;

				deck.appendChild(img);
			});
		};

		const renderPlayerValue = () => {
			let value = functions.getSum(playerHand);
			playerValue.innerHTML = `Value: ${value}`;
		};

		const renderDealerValue = () => {
			let value = functions.getSum(dealerHand);
			dealerValue.innerHTML = `Value: ${value}`;
		};

		const disableButtons = () => {
			hitButton.disabled = true;
			standButton.disabled = true;
			doubleButton.disabled = true;
		};

		const enableButtons = () => {
			hitButton.disabled = false;
			standButton.disabled = false;
			doubleButton.disabled = false;
		};

		return {
			renderPlayerCards,
			renderDealerCards,
			renderPlayerValue,
			renderDealerValue,
			disableButtons,
			enableButtons,
		};
	})();

	//Global script
	const global = (() => {
		const start = () => {
			board.enableButtons();

			playerHand = [];
			dealerHand = [];
			dealerHide = true;
			mainText.innerHTML = '';

			deck = cards.slice();
			functions.shuffle(deck);

			functions.draw(dealerHand, deck);
			functions.draw(playerHand, deck);
			functions.draw(dealerHand, deck);
			functions.draw(playerHand, deck);

			board.renderPlayerCards();
			board.renderDealerCards();
			dealerValue.innerHTML = 'Value: ?';

			functions.checkForBlackjack();
		};

		return {
			start,
		};
	})();

	//Variables and initial values
	let deck = [];
	let playerHand = [];
	let dealerHand = [];

	let dealerHide = true;

	//Query selectors
	const hitButton = document.querySelector('#hit');
	const standButton = document.querySelector('#stand');
	const doubleButton = document.querySelector('#double');

	const roundButton = document.querySelector('#roundButton');

	const playerValue = document.querySelector('.playerValue');
	const dealerValue = document.querySelector('.dealerValue');
	const mainText = document.querySelector('.text');

	//On pageload

	//Event listeners (Button clicks)
	roundButton.addEventListener('click', () => {
		global.start();
		roundButton.innerHTML = 'Restart!';
	});

	hitButton.addEventListener('click', () => {
		functions.draw(playerHand, deck);
		board.renderPlayerCards();

		doubleButton.disabled = true;

		functions.isBusted(playerHand);
	});

	standButton.addEventListener('click', () => {
		functions.stand();
	});

	doubleButton.addEventListener('click', () => {
		functions.draw(playerHand, deck);
		board.renderPlayerCards();

		functions.isBusted(playerHand);

		standButton.click();
	});

	return {
		global,
	};
})();

//console.log(game.functions.getSum(game.playerHand));

//console.log(game.deck);
console.log(game.dealerHand);
