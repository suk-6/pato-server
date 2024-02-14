import * as fs from "fs";
import {
	S3Client,
	PutObjectCommand,
	PutObjectCommandInput,
} from "@aws-sdk/client-s3";

export class ImageService {
	async uploadImage(base64Image: string) {
		const fileName = await this.saveImage(base64Image);
		const imageURL = await this.saveImageToCloud(fileName);
		this.deleteImage(fileName);

		return imageURL;
	}

	async saveImage(base64Image: string) {
		const buffer = Buffer.from(base64Image, "base64");
		const fileName = `${crypto.randomUUID()}.png`;
		fs.writeFileSync(`/tmp/${fileName}`, buffer);

		return fileName;
	}

	async deleteImage(fileName: string) {
		fs.unlinkSync(`/tmp/${fileName}`);
	}

	async saveImageToCloud(fileName: string) {
		const r2Path =
			(process.env.CF_ENDPOINT as string) +
			(process.env.CF_PATH as string);

		const r2PublicPath =
			(process.env.CF_PUBLIC as string) + (process.env.CF_PATH as string);

		const R2 = new S3Client({
			region: "auto",
			endpoint: r2Path,
			credentials: {
				accessKeyId: process.env.CF_ACCESS_KEY as string,
				secretAccessKey: process.env.CF_SECRET_KEY as string,
			},
		});

		const filePath = `/tmp/${fileName}`;
		const fileStream = fs.createReadStream(filePath);
		const fileLength = fs.statSync(filePath).size;

		if (!fileStream) throw new Error("Failed to read file");
		if (!fileLength) throw new Error("Failed to get file length");
		if (15000000 < fileLength) {
			this.deleteImage(fileName);
			throw new Error("File size is too big"); // 15MB
		}

		const uploadParams: PutObjectCommandInput = {
			Bucket: process.env.CF_BUCKET_NAME as string,
			Key: fileName,
			Body: fileStream,
			ContentLength: fileLength,
			ContentType: "image/png",
		};

		R2.send(new PutObjectCommand(uploadParams));
		return `${r2PublicPath}/${fileName}`;
	}
}
