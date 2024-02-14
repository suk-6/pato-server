export const calculateAge = (birthyear: string, birthdate: string) => {
	const today = new Date();
	const year = today.getFullYear();
	const month = today.getMonth() + 1;
	const day = today.getDate();

	const birth = new Date(
		parseInt(birthyear),
		parseInt(birthdate.slice(0, 2)),
		parseInt(birthdate.slice(2))
	);

	let age = year - birth.getFullYear();
	if (
		month < birth.getMonth() + 1 ||
		(month === birth.getMonth() + 1 && day < birth.getDate())
	) {
		age--;
	}

	return age;
};
