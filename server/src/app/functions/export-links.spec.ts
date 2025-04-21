import { randomUUID } from "node:crypto";
import { describe, expect, it, vi } from "vitest";

import { exportLinks } from "./export-links";
import { makeLink } from "@/test/factories/make-link";
import { isRight, unwrapEither } from "@/shared/either";
import * as upload from "@/infra/storage/upload-file-to-storage";

describe("Export links", () => {
  it("should be able to export links", async () => {
    const uploadStub = vi
      .spyOn(upload, "uploadFileToStorage")
      .mockImplementationOnce(async () => {
        return {
          key: `${randomUUID()}.csv`,
          url: "http://exemple.com/file.csv",
        };
      });

    const namePattern = `${randomUUID()}first-test`;

    const link1 = await makeLink({
      shortUrl: `localhost:3333/${namePattern}-1`,
    });

    const sut = await exportLinks();

    const generatedCSVStream = uploadStub.mock.calls[0][0].contentStream;

    const csvAsString = await new Promise<string>((resolve, reject) => {
      const chunks: Buffer[] = [];
      generatedCSVStream.on("data", (chunk: Buffer) => {
        chunks.push(chunk);
      });

      generatedCSVStream.on("end", () => {
        resolve(Buffer.concat(chunks).toString("utf-8"));
      });

      generatedCSVStream.on("error", (err) => {
        reject(err);
      });
    });

    const csvAsArray = csvAsString
      .trim()
      .split("\n")
      .map((row) => row.split(","));

    expect(isRight(sut)).toBe(true);
    expect(unwrapEither(sut)).toEqual({
      reportUrl: "http://exemple.com/file.csv",
    });
    expect(csvAsArray).toEqual(
      expect.arrayContaining([
        expect.arrayContaining([
          link1.id,
          link1.url,
          link1.shortUrl,
          link1.clicks.toString(),
          expect.any(String),
        ]),
      ])
    );
  });
});
