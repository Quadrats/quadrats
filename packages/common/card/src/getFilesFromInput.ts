export function getFilesFromInput(options: { accept: ('image/jpeg' | 'image/jpg' | 'image/png')[] }) {
  const { accept } = options;

  return new Promise<File[] | undefined>((resolve) => {
    const inputEl = document.createElement('input');

    if (accept) {
      inputEl.accept = accept.join(',');
    }

    inputEl.multiple = false;
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
          files.push(file);
        }

        resolve(files);
      }
    });

    inputEl.click();
  });
}
