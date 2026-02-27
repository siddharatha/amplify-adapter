import adapter from '@puruvj/amplify-adapter';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			immutableMaxAge: 7 * 1000, // 7 seconds only
		}),
	},
};

export default config;
