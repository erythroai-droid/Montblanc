import React from 'react';
import styles from "./Amount.module.scss";

const Amount = ({ handleDecrease, handleIncrease, counter }) => {
	return (
		<div className={styles.amountContainer}>
			<button
				data-amount-decrease
				onClick={handleDecrease}
				disabled={counter === 1}
				type="button"
			>
				-
			</button>
			<input
				id="id-amount"
				className={styles.input}
				type="number"
				value={counter}
				readOnly
			/>
			<button
				data-amount-increase
				onClick={handleIncrease}
				type="button"
			>
				+
			</button>
		</div>
	);
};

export default Amount;