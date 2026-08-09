import React, { useState } from 'react';
import useCalcAmount from "../../hooks/useCalcAmount.jsx";



const Amount = ({handleDecrease,handleIncrease, counter}) => {


	return (
		<div>
			<button
				data-amount-decrease
				onClick={handleDecrease}
				disabled={counter === 1}
			>
				-
			</button>
			<input
				id="id-amount"
				className="amount-input"
				type="number"
				value={counter}
				readOnly
			/>
			<button
				data-amount-increase
				onClick={handleIncrease}
			>
				+
			</button>
		</div>
	);
};

export default Amount;