import { SHARED_POST_MESSAGE_TYPES } from '../constants/sharedMessageTypes';
import { sharedService } from '../services/SharedService';

export class EmailsList {
	#root;
	#emails;

	constructor(root) {
		if (!root) {
			throw new Error(`${this.constructor.name}: элемент root не найден`);
		}

		this.#root = root;
		this.#emails = [
			'example@gmail.com',
			'example@gmail.com',
			'example@gmail.com',
			'example@gmail.com',
			'example@gmail.com',
			'example@gmail.com',
		]; // TODO: удалить
		this.#init();
	}

	#init() {
		this.#render();
		sharedService.on(
			SHARED_POST_MESSAGE_TYPES.EMAILS_UPDATE,
			this.#handleEmailsUpdate,
		);
	}

	#render() {
		this.#root.innerHTML = this.#emails.map(this.#emailItemTemplate).join('');
	}

	#emailItemTemplate = email =>
		`<li class="subscription__list-item">
			<a href="mailto:${email}">${email}</a>
			<svg>
				<use href="/icons.svg#icon-link-arrow"></use>
			</svg>
		</li>`;

	#handleEmailsUpdate = ({ emails }) => {
		console.log(emails);
		this.#emails = emails;
		this.#render();
		// this.#root.insertAdjacentHTML(
		// 	'afterbegin',
		// 	this.#emailItemTemplate(emails[0]),
		// );
	};

	destroy() {
		sharedService.off(
			SHARED_POST_MESSAGE_TYPES.EMAILS_UPDATE,
			this.#handleEmailsUpdate,
		);
	}
}
