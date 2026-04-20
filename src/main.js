import { EmailsList } from './components/EmailsList';
import { PagesCounter } from './components/PagesCounter';
import { SubscriptionForm } from './components/SubscriptionForm';
import { ThemeSwitcher } from './components/ThemeSwitcher';

const pagesCounter = new PagesCounter(document.getElementById('tabs-counter'));
const subscriptionForm = new SubscriptionForm(
	document.getElementById('subscription-form'),
);
const emailsList = new EmailsList(document.getElementById('emails-list'));
const themeSwitcher = new ThemeSwitcher(
	document.getElementById('theme-switcher'),
);
