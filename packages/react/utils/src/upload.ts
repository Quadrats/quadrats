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

export function upload(base64: string, onProgress: (percent: number) => void): Promise<string> {
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
