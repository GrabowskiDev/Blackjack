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

		return {
			shuffle,
			draw,
			getSum,
			isBusted,
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
			splitButton.disabled = true;
		};

		return {
			renderPlayerCards,
			renderDealerCards,
			renderPlayerValue,
			renderDealerValue,
			disableButtons,
		};
	})();

	//Global script
	const global = (() => {
		const start = () => {
			deck = cards.slice();
			functions.shuffle(deck);

			functions.draw(dealerHand, deck);
			functions.draw(playerHand, deck);
			functions.draw(dealerHand, deck);
			functions.draw(playerHand, deck);

			board.renderPlayerCards();
			board.renderDealerCards();
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
	const splitButton = document.querySelector('#split');

	const playerValue = document.querySelector('.playerValue');
	const dealerValue = document.querySelector('.dealerValue');
	const mainText = document.querySelector('.text');

	//On pageload
	global.start();

	//Event listeners (Button clicks)
	hitButton.addEventListener('click', () => {
		functions.draw(playerHand, deck);
		board.renderPlayerCards();

		functions.isBusted(playerHand);
	});

	standButton.addEventListener('click', () => {
		board.disableButtons();

		dealerHide = false;
		board.renderDealerCards();

		board.renderDealerValue();

		let keepGoing = true;
		while (keepGoing) {
			let dealerSum = functions.getSum(dealerHand);

			//Check for blackjack
			if (dealerSum === 21) {
				mainText.innerHTML = 'Blackjack! Dealer won!';
				keepGoing = false;
			}

			//Check if dealer needs to draw a card
			if (dealerSum < 17) {
				functions.draw(dealerHand, deck);
				board.renderDealerCards();
				board.renderDealerValue();
			}

			//Checking who have better value
			if (dealerSum >= 17) {
				keepGoing = false;

				if (dealerSum > 21) {
					mainText.innerHTML = 'Dealer is busted! You won!';
				} else if (dealerSum > functions.getSum(playerHand)) {
					mainText.innerHTML = 'Dealer won!';
				} else if (dealerSum < functions.getSum(playerHand)) {
					mainText.innerHTML = 'You won!';
				} else {
					mainText.innerHTML = 'Draw!';
				}
			}
		}
	});

	return {
		functions,
		board,
		global,
		deck,
		playerHand,
		dealerHand,
	};
})();

//console.log(game.functions.getSum(game.playerHand));

//console.log(game.deck);
console.log(game.dealerHand);
