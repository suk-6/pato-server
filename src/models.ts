// Auth
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

export interface KakaoUserModel {
	id: number;
	connected_at: string;
	kakao_account: {
		name_needs_agreement: boolean;
		name: string;
		has_email: boolean;
		email_needs_agreement: boolean;
		is_email_valid: boolean;
		is_email_verified: boolean;
		email: string;
		has_phone_number: boolean;
		phone_number_needs_agreement: boolean;
		phone_number: string;
		has_birthyear: boolean;
		birthyear_needs_agreement: boolean;
		birthyear: string;
		has_birthday: boolean;
		birthday_needs_agreement: boolean;
		birthday: string;
		birthday_type: string;
		has_gender: boolean;
		gender_needs_agreement: boolean;
		gender: string;
	};
}

export interface RegisterUser {
	uuid: string;
	kakaoUID: number;
	name: string;
	email: string;
	phone: string;
	gender: string;
	birthyear: string;
	birthdate: string;
}

// JWT Payload
export interface JWTPayloadModel {
	uuid: string;
}

// Profile
// profile.routes.ts
export interface ProfileModel {
	uuid: string;
	image: string;
	nickname: string;
	region: string;
	alcohol: number;
	hobby: string;
}

// Chat
// chat.service.ts
export interface ChatroomUserModel {
	crid: number;
	uuid: string;
	chatToken: string;
}

export interface ChatMessageModel {
	crid: number;
	cuid: number;
	uuid: string;
	message: string;
}
