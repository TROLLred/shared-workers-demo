import { SHARED_POST_MESSAGE_TYPES } from '../constants/sharedMessageTypes';
import { sharedService } from '../services/SharedService';

export class PagesCounter {
	#root;
	#count;

	constructor(root) {
		if (!root) {
			throw new Error(`${this.constructor.name}: элемент root не найден`);
		}

		this.#root = root;
		this.#count = localStorage.getItem('count') || 1;
		this.#init();
	}

	#render() {
		this.#root.innerHTML = `Вкладки:  <span id="tabsCount" class="header__counter-value">${this.#count}</span>`;
	}

	#init() {
		this.#render();
		sharedService.on(
			SHARED_POST_MESSAGE_TYPES.COUNT_UPDATE,
			this.#handleUpdate,
		);
	}

	#handleUpdate = ({ count }) => {
		localStorage.setItem('count', count);
		this.#count = count;
		this.#render();
	};

	destroy() {
		sharedService.off(
			SHARED_POST_MESSAGE_TYPES.COUNT_UPDATE,
			this.#handleUpdate,
		);
	}
}
