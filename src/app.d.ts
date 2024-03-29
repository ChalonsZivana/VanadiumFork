// See https://kit.svelte.dev/docs/types#app

import type { SessionData } from "$lib/server/auth";
import type { Session } from 'svelte-kit-cookie-session';


import "reflect-metadata";
// for information about these interfaces

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session:Session<SessionData>
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
