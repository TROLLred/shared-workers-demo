import { debounce } from '../lib/debounce';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export class EmailInput {
	#input;
	#error;

	constructor(input, error) {
		if (!input) {
			throw new Error(`${this.constructor.name}: элемент input не найден`);
		}
		this.#input = input;

		if (!error) {
			throw new Error(`${this.constructor.name}: элемент error не найден`);
		}
		this.#error = error;

		this.#init();
	}

	#init() {
		this.#input.addEventListener('input', this.#handleInput);
	}

	get value() {
		return this.#input.value.trim();
	}

	get valid() {
		return this.validate();
	}

	validate() {
		if (!this.value.length) {
			this.#showError('Поле email обязательно');
			return false;
		}

		if (!EMAIL_REGEX.test(this.value)) {
			this.#showError('Некорректный email');
			return false;
		}

		this.#hideError();
		return true;
	}

	#showError(error) {
		this.#error.innerHTML = `<span>${error}</span>`;
	}

	#hideError() {
		this.#error.innerHTML = '';
	}

	#handleInput = debounce(() => {
		this.#hideError();
	}, 100);

	reset() {
		this.#input.value = '';
		this.#hideError();
	}

	destroy() {
		this.#input = null;
		this.#error = null;
		this.#hideError();
		this.#input.removeEventListener('input', this.#handleInput);
	}
}
