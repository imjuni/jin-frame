import { JinFrame } from '#frames/JinFrame';
import { JinFile } from '#frames/JinFile';
import fs from 'node:fs';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import path from 'node:path';
import { afterEach, beforeEach, describe, it } from 'vitest';
import { Post } from '#decorators/methods/Post';
import { Put } from '#decorators/methods/Put';
import { Patch } from '#decorators/methods/Patch';
import { Body } from '#decorators/fields/Body';

@Post({ host: 'http://some.api.google.com/fileupload-case04', contentType: 'multipart/form-data' })
class TestGetFrame extends JinFrame {
  @Body()
  declare public readonly description: string;

  @Body()
  declare public readonly myFile: JinFile<Buffer>;

  @Body()
  declare public readonly myFiles: JinFile<Buffer>[];
}

@Post({ host: 'http://some.api.google.com/fileupload-blob', contentType: 'multipart/form-data' })
class BlobFileFrame extends JinFrame {
  @Body()
  declare public readonly singleBlob: JinFile<Blob>;

  @Body()
  declare public readonly multiBlobs: JinFile<Blob>[];
}

@Put({ host: 'http://some.api.google.com/fileupload-put', contentType: 'multipart/form-data' })
class PutFileFrame extends JinFrame {
  @Body()
  declare public readonly description: string;

  @Body()
  declare public readonly myFile: JinFile<Buffer>;
}

@Patch({ host: 'http://some.api.google.com/fileupload-patch', contentType: 'multipart/form-data' })
class PatchFileFrame extends JinFrame {
  @Body()
  declare public readonly description: string;

  @Body()
  declare public readonly myFile: JinFile<Buffer>;
}

describe('fileupload.test', () => {
  const server = setupServer();

  beforeEach(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
    server.close();
  });

  it('fileupload-test', async () => {
    const originalFileContent = fs.readFileSync(path.join(process.cwd(), 'README.md'));

    server.use(
      http.post('http://some.api.google.com/fileupload-case04', async ({ request }) => {
        // Content-Type header validation
        const contentType = request.headers.get('content-type');

        if (!contentType?.includes('multipart/form-data')) {
          return new HttpResponse('Invalid Content-Type', { status: 400 });
        }

        // FormData parsing and validation
        const formData = await request.formData();

        // Text field validation
        const description = formData.get('description');
        if (description !== 'test') {
          return new HttpResponse('Invalid description', { status: 400 });
        }

        // Single file validation
        const singleFile = formData.get('myFile') as File;
        if (singleFile?.name !== 'README.md') {
          return new HttpResponse('Invalid myFile', { status: 400 });
        }

        // File content validation
        const singleFileArrayBuffer = await singleFile.arrayBuffer();
        const singleFileBuffer = new Uint8Array(singleFileArrayBuffer);

        if (!originalFileContent.equals(singleFileBuffer)) {
          return new HttpResponse('File content mismatch', { status: 400 });
        }

        // Multiple file validation
        const multipleFiles = formData.getAll('myFiles') as File[];

        if (multipleFiles.length !== 4) {
          return new HttpResponse('Invalid myFiles count', { status: 400 });
        }

        // Each file name and content validation
        const expectedNames = ['README01.md', 'README02.md', 'README03.md', 'README04.md'];
        const fileValidations = await Promise.all(
          multipleFiles.map(async (file, index) => {
            if (file == null || file.name !== expectedNames[index]) {
              return { valid: false, error: `Invalid file name: ${file?.name}` };
            }

            const multipleFileArrayBuffer = await file.arrayBuffer();
            const multipleFileBuffer = new Uint8Array(multipleFileArrayBuffer);

            if (!originalFileContent.equals(multipleFileBuffer)) {
              return { valid: false, error: `File content mismatch: ${file.name}` };
            }

            return { valid: true };
          }),
        );

        const invalidFile = fileValidations.find((validation) => !validation.valid);

        if (invalidFile != null) {
          return new HttpResponse(invalidFile.error, { status: 400 });
        }

        return HttpResponse.json({
          message: 'Files uploaded successfully',
          filesReceived: {
            description,
            myFile: singleFile.name,
            myFiles: multipleFiles.map((file) => file.name),
          },
        });
      }),
    );

    const frame = TestGetFrame.of({
      description: 'test',
      myFile: new JinFile('README.md', originalFileContent),
      myFiles: [
        new JinFile('README01.md', originalFileContent),
        new JinFile('README02.md', originalFileContent),
        new JinFile('README03.md', originalFileContent),
        new JinFile('README04.md', originalFileContent),
      ],
    });

    await frame._execute();
  });

  it('should upload multipart/form-data with PUT method', async () => {
    const originalFileContent = fs.readFileSync(path.join(process.cwd(), 'README.md'));

    server.use(
      http.put('http://some.api.google.com/fileupload-put', async ({ request }) => {
        const contentType = request.headers.get('content-type');
        if (!contentType?.includes('multipart/form-data')) {
          return new HttpResponse('Invalid Content-Type', { status: 400 });
        }

        const formData = await request.formData();
        const description = formData.get('description');
        if (description !== 'put-test') {
          return new HttpResponse('Invalid description', { status: 400 });
        }

        const file = formData.get('myFile') as File;
        if (file?.name !== 'README.md') {
          return new HttpResponse('Invalid myFile', { status: 400 });
        }

        return HttpResponse.json({ message: 'PUT uploaded successfully' });
      }),
    );

    const frame = PutFileFrame.of({
      description: 'put-test',
      myFile: new JinFile('README.md', originalFileContent),
    });

    await frame._execute();
  });

  it('should upload multipart/form-data with PATCH method', async () => {
    const originalFileContent = fs.readFileSync(path.join(process.cwd(), 'README.md'));

    server.use(
      http.patch('http://some.api.google.com/fileupload-patch', async ({ request }) => {
        const contentType = request.headers.get('content-type');
        if (!contentType?.includes('multipart/form-data')) {
          return new HttpResponse('Invalid Content-Type', { status: 400 });
        }

        const formData = await request.formData();
        const description = formData.get('description');
        if (description !== 'patch-test') {
          return new HttpResponse('Invalid description', { status: 400 });
        }

        const file = formData.get('myFile') as File;
        if (file?.name !== 'README.md') {
          return new HttpResponse('Invalid myFile', { status: 400 });
        }

        return HttpResponse.json({ message: 'PATCH uploaded successfully' });
      }),
    );

    const frame = PatchFileFrame.of({
      description: 'patch-test',
      myFile: new JinFile('README.md', originalFileContent),
    });

    await frame._execute();
  });

  it('should upload Blob-based JinFile (non-Buffer branch) for single and array', async () => {
    server.use(
      http.post('http://some.api.google.com/fileupload-blob', async ({ request }) => {
        const formData = await request.formData();
        const single = formData.get('singleBlob') as File;
        const multi = formData.getAll('multiBlobs') as File[];
        if (single == null || multi.length !== 2) {
          return new HttpResponse('Invalid', { status: 400 });
        }
        return HttpResponse.json({ message: 'ok' });
      }),
    );

    const blobContent = new Blob(['hello blob'], { type: 'text/plain' });
    const frame = BlobFileFrame.of({
      singleBlob: new JinFile('single.txt', blobContent),
      multiBlobs: [new JinFile('a.txt', blobContent), new JinFile('b.txt', blobContent)],
    });

    await frame._execute();
  });
});
