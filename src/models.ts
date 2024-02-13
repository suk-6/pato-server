// oauth.controller.ts
export interface QueryModel {
	code: string;
}

// oauth.service.ts
export interface KakaoTokenModel {
	access_token: string;
	token_type: string;
	refresh_token: string;
	expires_in: number;
	scope: string;
	refresh_token_expires_in: number;
}
