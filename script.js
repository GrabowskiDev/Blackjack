const game = (() => {
	//All games functions
	const functions = (() => {
		const shuffle = unshuffled => {
			//shuffle

			return shuffled;
		};

		const checkForBust = hand => {
			let aceCount = 0;
			let sum = 0;

			hand.forEach(card => {
				sum += card.value;
				if (card.value === 11) aceCount++;
			});

			if (sum > 21 && aceCount > 0) {
				keepGoing = true;
				i = aceCount;
				while (keepGoing) {
					sum -= 10;

					if (sum < 21 || --i == 0) keepGoing = false;
				}
			}

			return sum;
		};

		return {
			shuffle,
			checkForBust,
		};
	})();

	return {
		functions,
	};
})();
