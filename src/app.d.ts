// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}

declare namespace Express {
	export interface Request {
		user: any;
	}
	export interface Response {
		user: any;
	}
}

export {};
