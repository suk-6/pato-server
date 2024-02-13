import { KakaoUserModel } from "./models";

export const testUser: KakaoUserModel = {
	id: 1234567890,
	connected_at: "20240101",
	kakao_account: {
		profile: {
			nickname: "홍길동닉네임",
		},
		name_needs_agreement: false,
		name: "홍길동",
		birthyear_needs_agreement: false,
		birthyear: "2000",
		birthday_needs_agreement: false,
		birthday: "0101",
		birthday_type: "SOLAR",
		gender_needs_agreement: false,
		gender: "male",
		phone_number_needs_agreement: false,
		phone_number: "+82 10 0000 0000",
	},
};
