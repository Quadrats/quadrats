import {
  FileUploaderGetBody,
  FileUploaderGetHeaders,
  FileUploaderGetUrl,
  FileUploaderImplement,
} from '@quadrats/common/file-uploader';

export function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      }
    };

    reader.onerror = () => reject(reader.error);

    reader.readAsDataURL(file);
  });
}

export async function upload({
  file,
  getBody,
  getHeaders,
  getUrl,
  uploader,
  onProgress,
}: {
  file: File;
  getBody: FileUploaderGetBody;
  getHeaders?: FileUploaderGetHeaders;
  getUrl: FileUploaderGetUrl;
  uploader?: FileUploaderImplement;
  onProgress: (percent: number) => void;
}) {
  const headers = await getHeaders?.(file);
  const xhr = uploader || new XMLHttpRequest();

  return new Promise<string>((resolve, reject) => {
    let sent = false;

    xhr.upload.onprogress = ({ loaded, total }: { loaded: number; total: number }) =>
      onProgress((loaded * 100) / total);

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response as string);
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}: ${xhr.response}`));
      }
    };

    xhr.open('POST', getUrl(file));

    if (headers) {
      for (const headerName in headers) {
        xhr.setRequestHeader(headerName, headers[headerName]);
      }
    }

    if (!sent) {
      sent = true;
      xhr.send(getBody(file) as XMLHttpRequestBodyInit);
    }
  });
}

export function mockUpload(base64: string, onProgress: (percent: number) => void): Promise<string> {
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      onProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => resolve(base64), 200);
      }
    }, 250);
  });
}
