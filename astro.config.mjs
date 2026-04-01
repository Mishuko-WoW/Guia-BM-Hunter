// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig(({ command }) => ({
	site: 'https://mishuko-wow.github.io',
	base: command === 'dev' ? '/' : '/Guia-BM-Hunter',
}));
