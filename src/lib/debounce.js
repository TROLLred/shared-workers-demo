export const debounce = (cb, delay) => {
	let timerId;
	return function (...args) {
		clearTimeout(timerId);
		timerId = setTimeout(() => {
			cb.apply(this, args);
		}, delay);
	};
};
