/* global ENV_PREFIX */
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Loads an optional .env file located beside this module so values generated
// during the Amplify build can be added to the runtime environment.
// amplify.yaml build/commands :
// - echo "PUBLIC_LANG=$PUBLIC_LANG" >> ./build/compute/default/.env
 
function loadSiblingEnvFile() {
	const envFile = join(dirname(fileURLToPath(import.meta.url)), ".env");
	if (existsSync(envFile)) process.loadEnvFile(envFile);
}

loadSiblingEnvFile();

const expected = new Set([
	'SOCKET_PATH',
	'HOST',
	'PORT',
	'ORIGIN',
	'XFF_DEPTH',
	'ADDRESS_HEADER',
	'PROTOCOL_HEADER',
	'HOST_HEADER',
	'BODY_SIZE_LIMIT',
]);

if (ENV_PREFIX) {
	for (const name in process.env) {
		if (name.startsWith(ENV_PREFIX)) {
			const unprefixed = name.slice(ENV_PREFIX.length);
			if (!expected.has(unprefixed)) {
				throw new Error(
					`You should change envPrefix (${ENV_PREFIX}) to avoid conflicts with existing environment variables — unexpectedly saw ${name}`
				);
			}
		}
	}
}

/**
 * @param {string} name
 * @param {any} fallback
 */
export function env(name, fallback) {
	const prefixed = ENV_PREFIX + name;
	return prefixed in process.env ? process.env[prefixed] : fallback;
}
