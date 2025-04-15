import { stringify } from "csv-stringify";
import { pipeline } from "node:stream/promises";
import { PassThrough, Transform } from "node:stream";

import { db, pg } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { Either, makeRight } from "@/shared/either";
import { uploadFileToStorage } from "@/infra/storage/upload-file-to-storage";

type ExportUploadsOutput = {
  reportUrl: string;
};

export async function exportLinks(): Promise<
  Either<never, ExportUploadsOutput>
> {
  const { sql, params } = db
    .select({
      id: schema.links.id,
      url: schema.links.url,
      clicks: schema.links.clicks,
      shortUrl: schema.links.shortUrl,
      createdAt: schema.links.createdAt,
    })
    .from(schema.links)
    .toSQL();

  const cursor = pg.unsafe(sql, params as string[]).cursor(2);

  const csv = stringify({
    delimiter: ",",
    header: true,
    columns: [
      { key: "id", header: "ID" },
      { key: "url", header: "URL" },
      { key: "short_url", header: "Short URL" },
      { key: "clicks", header: "Clicks" },
      { key: "created_at", header: "Created at" },
    ],
  });

  const uploadToStorageStream = new PassThrough();

  const convertToCSVPipeline = pipeline(
    cursor,
    new Transform({
      objectMode: true,
      transform(chunks: unknown[], encoding, callback) {
        for (const chunk of chunks) {
          this.push(chunk);
        }

        callback();
      },
    }),
    csv,
    uploadToStorageStream
  );

  const uploadToStorage = uploadFileToStorage({
    contentType: "text/csv",
    folder: "downloads",
    fileName: `${new Date().toISOString()}-uploads.csv`,
    contentStream: uploadToStorageStream,
  });

  const [{ url }] = await Promise.all([uploadToStorage, convertToCSVPipeline]);

  return makeRight({ reportUrl: url });
}
