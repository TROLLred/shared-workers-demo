/**
 * Объект с типами, которые обрабатывает SharedWorker внутри себя
 */
export const SHARED_ON_MESSAGE_TYPES = Object.freeze({
	THEME_CHANGE: 'THEME_CHANGE',
	TAB_CLOSING: 'TAB_CLOSING',
	ADD_EMAIL: 'ADD_EMAIL',
	HEARTBEAT: 'HEARTBEAT',
});

/**
 * Объект с типами, которые отправляет сам SharedWorker внутри себя
 */
export const SHARED_POST_MESSAGE_TYPES = Object.freeze({
	COUNT_UPDATE: 'COUNT_UPDATE',
	THEME_UPDATE: 'THEME_UPDATE',
	EMAILS_UPDATE: 'EMAILS_UPDATE',
});
