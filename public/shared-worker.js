import {
	SHARED_ON_MESSAGE_TYPES,
	SHARED_POST_MESSAGE_TYPES,
} from '../src/constants/sharedMessageTypes';

let nextTabId = 1;
let theme = 'light';

const tabs = new Map();
const emails = [
	'example@gmail.com',
	'example@gmail.com',
	'example@gmail.com',
	'example@gmail.com',
	'example@gmail.com',
	'example@gmail.com',
];

function broadcast(type, payload) {
	tabs.forEach((_, port) => {
		try {
			port.postMessage({ type, ...payload });
		} catch (e) {
			console.error(e);
		}
	});
}

self.onconnect = function (e) {
	const port = e.ports[0];
	const tabId = nextTabId++;

	if (!tabs.has(port)) {
		tabs.set(port, tabId);

		// port.postMessage({
		// 	type: 'INIT',
		// 	count: tabs.size,
		// 	theme,
		// 	tabId,
		// 	emails,
		// });

		broadcast(SHARED_POST_MESSAGE_TYPES.EMAILS_UPDATE, { emails });
		broadcast(SHARED_POST_MESSAGE_TYPES.COUNT_UPDATE, { count: tabs.size });
	}

	port.onmessage = function ({ data }) {
		switch (data.type) {
			case SHARED_ON_MESSAGE_TYPES.THEME_CHANGE:
				theme = data.theme;
				broadcast(SHARED_POST_MESSAGE_TYPES.THEME_UPDATE, {
					theme: data.theme,
				});
				break;
			case SHARED_ON_MESSAGE_TYPES.TAB_CLOSING:
				if (tabs.has(port)) {
					tabs.delete(port);
					broadcast(SHARED_POST_MESSAGE_TYPES.COUNT_UPDATE, {
						count: tabs.size,
					});
				}
				break;
			case SHARED_ON_MESSAGE_TYPES.ADD_EMAIL:
				if (data.email && !emails.includes(data.email)) {
					// Решил использовать массив вместо Set из-за порядка "сначала новые, затем старые"
					emails.unshift(data.email);
					broadcast(SHARED_POST_MESSAGE_TYPES.EMAILS_UPDATE, {
						emails,
					});
				}
				break;
			case SHARED_ON_MESSAGE_TYPES.HEARTBEAT:
				break;
		}
	};

	port.onmessageerror = function () {
		if (tabs.has(port)) {
			tabs.delete(port);
			broadcast(SHARED_POST_MESSAGE_TYPES.COUNT_UPDATE, { count: tabs.size });
		}
	};

	port.start();
};
