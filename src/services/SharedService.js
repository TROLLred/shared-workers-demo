import { SHARED_ON_MESSAGE_TYPES } from '../constants/sharedMessageTypes';

/**
 * Сервис по работе с SharedWorker.
 * По сути представляет собой Singleton и подобие EventEmitter,
 * P.S. не уверен насколько уместен здесь EventEmitter, но лучше я ничего не придумал
 */
class SharedService {
	#listeners;

	constructor() {
		if (SharedService.instance) {
			return SharedService.instance;
		}

		this.worker = new SharedWorker(
			new URL('../../public/shared-worker.js', import.meta.url).href,
			{
				type: 'module',
				name: 'tab-sync',
			},
		);
		this.worker.port.start();

		this.#listeners = new Map();
		this.worker.port.onmessage = ({ data: { type, ...payload } }) => {
			if (this.#listeners.has(type)) {
				const callbacks = this.#listeners.get(type);
				[...callbacks].forEach(cb => cb(payload));
			}
		};

		window.addEventListener('beforeunload', this.#handleBeforeUnload);

		SharedService.instance = this;
	}

	/**
	 * Подписка на событие
	 * @param {string} type Тип события из SHARED_POST_MESSAGE_TYPES
	 * @param {function} callback Функция, принимающая payload
	 */
	on(type, callback) {
		if (!this.#listeners.has(type)) {
			this.#listeners.set(type, []);
		}
		this.#listeners.get(type).push(callback);
	}

	/**
	 * Отписка от события
	 * @param {string} type Тип события из SHARED_POST_MESSAGE_TYPES
	 * @param {function} callback Функция, принимающая payload
	 */
	off(type, callback) {
		if (!this.#listeners.has(type)) return;

		const callbacks = this.#listeners.get(type);
		const index = callbacks.indexOf(callback);
		if (index > -1) {
			callbacks.splice(index, 1);
		}

		if (callbacks.length === 0) {
			this.#listeners.delete(type);
		}
	}

	/**
	 * Отправка сообщения в SharedWorker
	 * @param {string} type Тип события из SHARED_ON_MESSAGE_TYPES
	 * @param {function} callback Функция, принимающая payload
	 */
	send(type, payload = {}) {
		this.worker.port.postMessage({ type, ...payload });
	}

	#handleBeforeUnload = () => this.send(SHARED_ON_MESSAGE_TYPES.TAB_CLOSING);
}

export const sharedService = new SharedService();
