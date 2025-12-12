import { mount } from 'svelte';
import { inject } from '@vercel/analytics';
import './app.css';
import App from './App.svelte';

// Enable Vercel Analytics only in production
if (import.meta.env.PROD) {
    inject();
}

const app = mount(App, {
    target: document.getElementById('app'),
});

export default app;
