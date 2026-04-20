import {
	SHARED_ON_MESSAGE_TYPES,
	SHARED_POST_MESSAGE_TYPES,
} from '../constants/sharedMessageTypes';
import { sharedService } from '../services/SharedService';

const STORAGE_FIELD = 'theme';
const THEME_ATTRIBUTE = 'data-theme';

export class ThemeSwitcher {
	#app;
	#checkbox;

	constructor(root) {
		if (!root) {
			throw new Error(`${this.constructor.name}: элемент root не найден`);
		}

		this.#app = document.documentElement;
		this.#checkbox = root.querySelector('input[type=checkbox]');
		this.#init();
	}

	#init() {
		const savedTheme = localStorage.getItem(STORAGE_FIELD) || 'light';
		this.#setTheme(savedTheme);

		sharedService.on(
			SHARED_POST_MESSAGE_TYPES.THEME_UPDATE,
			this.#handleUpdate,
		);
		this.#checkbox.addEventListener('change', this.#handleChange);
	}

	#handleUpdate = ({ theme }) => {
		this.#setTheme(theme);
	};

	#handleChange = e => {
		if (!e.target) return;

		const theme = e.target.checked ? 'dark' : 'light';
		this.#setTheme(theme);
		sharedService.send(SHARED_ON_MESSAGE_TYPES.THEME_CHANGE, { theme });
	};

	#setTheme(newTheme) {
		if (newTheme !== 'light' && newTheme !== 'dark') return;
		// if (newTheme === this.#app.getAttribute(THEME_ATTRIBUTE)) return;

		this.#app.setAttribute(THEME_ATTRIBUTE, newTheme);
		localStorage.setItem(STORAGE_FIELD, newTheme);
		this.#checkbox.checked = newTheme === 'dark';
	}

	destroy() {
		sharedService.off(
			SHARED_POST_MESSAGE_TYPES.THEME_UPDATE,
			this.#handleUpdate,
		);
		this.#checkbox.removeEventListener('change', this.#handleChange);
	}
}
