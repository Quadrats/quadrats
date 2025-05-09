import { FileUploaderUploadOptions } from '@quadrats/common/file-uploader';
import { Image } from '@quadrats/common/image';
import { QuadratsReactEditor } from '@quadrats/react';
import { ReactImage } from '@quadrats/react/image';

interface ProgressUpdates {
  loaded: number;
  total: number;
}

class LocalFileUploaderUpload {
  private savedOnProgress: ((updates: ProgressUpdates) => void) | null = null;

  get onprogress(): ((updates: ProgressUpdates) => void) | null {
    return this.savedOnProgress;
  }

  set onprogress(onProgress: ((updates: ProgressUpdates) => void) | null) {
    this.savedOnProgress = onProgress;
  }
}

class LocalFileUploader {
  private emulateStatus = 0;

  private emulateResponse: string | null = null;

  private uploadInstance = new LocalFileUploaderUpload();

  onload: (() => void) | null = null;

  open(method: string, url: string | URL) {
    console.log('open', method, url);
  }

  setRequestHeader(key: string, value: string) {
    console.log('set header', key, value);
  }

  send(body?: Document | XMLHttpRequestBodyInit | null) {
    const url = URL.createObjectURL(body as Blob);

    this.emulateStatus = 200;
    this.emulateResponse = url;

    if (typeof this.upload.onprogress === 'function') {
      this.upload.onprogress({ loaded: 1, total: 1 });
    }

    if (typeof this.onload === 'function') {
      this.onload();
    }
  }

  get upload() {
    return this.uploadInstance;
  }

  get status() {
    return this.emulateStatus;
  }

  get response() {
    return this.emulateResponse;
  }
}

export default function getLocalFileUploaderOptions<Hosting extends string>(image: ReactImage<Hosting> | Image<Hosting, QuadratsReactEditor>): FileUploaderUploadOptions {
  return {
    accept: ['image/*'],
    createElement: {
      image: {
        dataURL: dataURL => image.createImageElement(dataURL),
        response: response => image.createImageElement(response as string),
      },
    },
    getBody: file => file,
    getHeaders: file => ({
      Authorization: 'Bearer <Your OAuth2 Token>',
      'Content-Type': file.type,
    }),
    getUrl: file => `https://storage.googleapis.com/upload/storage/v1/b/<Your Bucket Name>/o?uploadType=media&name=${file.name}`,
    uploader: new LocalFileUploader(),
  };
}
