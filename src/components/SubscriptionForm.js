import { SHARED_ON_MESSAGE_TYPES } from '../constants/sharedMessageTypes';
import { sharedService } from '../services/SharedService';
import { EmailInput } from './EmailInput';

export class SubscriptionForm {
	#root;
	#emailInput;

	constructor(root) {
		if (!root) {
			throw new Error(`${this.constructor.name}: элемент root не найден`);
		}

		this.#root = root;
		this.#emailInput = new EmailInput(
			root.querySelector('input'),
			root.querySelector('.subscription__error'),
		);

		this.#init();
	}

	#init() {
		this.#root.addEventListener('submit', this.#handleSubmit);
	}

	#handleSubmit = e => {
		e.preventDefault();
		if (!this.#emailInput.valid) return;

		sharedService.send(SHARED_ON_MESSAGE_TYPES.ADD_EMAIL, {
			email: this.#emailInput.value,
		});
		this.reset();
	};

	reset() {
		this.#emailInput.reset();
	}

	destroy() {
		this.#root.removeEventListener('submit', this.#handleSubmit);
		this.#emailInput.destroy();
	}
}
