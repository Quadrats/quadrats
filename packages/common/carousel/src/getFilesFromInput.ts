export function getFilesFromInput(options: { accept: string[]; limitSize: number }) {
  const { accept, limitSize } = options;

  return new Promise<File[] | undefined>((resolve) => {
    const inputEl = document.createElement('input');

    if (accept) {
      inputEl.accept = accept.join(',');
    }

    inputEl.multiple = true;
    inputEl.type = 'file';

    inputEl.addEventListener('cancel', () => {
      resolve(undefined);
    });

    inputEl.addEventListener('change', () => {
      const { files: fileList } = inputEl;

      if (!fileList || !fileList.length) {
        resolve(undefined);
      } else {
        const files: File[] = [];

        for (const file of fileList) {
          if (file.size <= limitSize * 1024 * 1024) {
            files.push(file);
          }
        }

        resolve(files);
      }
    });

    inputEl.click();
  });
}
