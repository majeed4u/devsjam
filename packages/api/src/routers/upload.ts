import { uploadFile } from "@devjams/api/lib/s3-helper";
import { z } from "zod";
import { protectedProcedure } from "../index";

export const uploadRouter = {
	upload: protectedProcedure
		.input(
			z.object({
				files: z
					.array(
						z.object({
							fileName: z.string(),
							contentType: z.string(),
							data: z.string(),
						}),
					)
					.min(1)
					.max(10),
			}),
		)
		.handler(async ({ input, context }) => {
			const files = await Promise.all(
				input.files.map((file) =>
					uploadFile({ ...file, userId: context.session.user.id }),
				),
			);
			return { files };
		}),
};
