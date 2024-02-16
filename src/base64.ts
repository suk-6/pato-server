export const base64encode = (plaintext: string): string => {
	return Buffer.from(plaintext, "utf8").toString("base64");
};

export const base64decode = (base64text: string): string => {
	return Buffer.from(base64text, "base64").toString("utf8");
};
