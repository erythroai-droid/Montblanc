import React, {useState} from 'react';

const useCalcAmount = () => {
	const [counter, setCounter] = useState(1);

	const handleDecrease = () => {
		if (counter > 1) {
			setCounter(prev => prev - 1);
		}
	};

	const handleIncrease = () => {
		setCounter(prev => prev + 1);
	};

	return{handleDecrease,handleIncrease, counter}
};

export default useCalcAmount;
