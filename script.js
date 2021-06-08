import { cards, cardsBack } from './cards.js';

const game = (() => {
	const functions = (() => {
		const shuffle = unshuffled => {
			//shuffle

			return shuffled;
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
				keepGoing = true;
				i = aceCount;

				//Changing only minimal number of 11 to 1
				while (keepGoing) {
					sum -= 10;

					if (sum < 21 || --i == 0) keepGoing = false;
				}
			}

			return sum;
		};

		const isBusted = value => (value > 21 ? true : false);

		return {
			shuffle,
			getSum,
			isBusted,
		};
	})();

	const board = (() => {
		const renderPlayerCards = hand => {
			const deck = document.querySelector('.player');
			hand.forEach(card => {
				const img = document.createElement('img');
				img.src = card.path;

				deck.appendChild(img);
			});
		};

		return { renderPlayerCards };
	})();

	const global = (() => {
		const start = () => {
			console.log('lol');
		};

		return {
			start,
		};
	})();

	return {
		functions,
		board,
		global,
	};
})();
