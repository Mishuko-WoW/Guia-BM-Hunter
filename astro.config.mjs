// @ts-check
import { defineConfig } from 'astro/config';

const isDev = process.argv.includes('dev');

// https://astro.build/config
export default defineConfig({
	site: 'https://mishuko-wow.github.io',
	base: isDev ? '/' : '/Guia-BM-Hunter',
});
