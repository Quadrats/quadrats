import React, { useMemo, useState, useEffect } from 'react';
import { useSlateStatic } from '@quadrats/react';
import { Hints, Button, Modal, ModalConfig, useModal } from '@quadrats/react/components';
import { ReactCarousel } from '../typings';

const CarouselModal = ({
  isOpen,
  setIsOpen,
  setIsModalClosed,
  controller,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsModalClosed: React.Dispatch<React.SetStateAction<boolean>>;
  controller: ReactCarousel;
}) => {
  const editor = useSlateStatic();
  const [targetFiles, setTargetFiles] = useState<File[]>([]);

  console.log('targetFiles', targetFiles);

  const modalConfig = useMemo(
    (): ModalConfig => ({
      title: '建立輪播',
      size: 'extraLarge',
      closable: true,
      haveCloseButton: false,
      confirmText: '建立輪播',
      sideChildren: (
        <div>
          上傳建議
          <Hints
            hints={[
              {
                text: `數量限制：至少 1 張，至多 ${controller.maxLength} 張。`,
              },
              {
                text: `檔案大小：不可大於 ${controller.limitSize} MB。`,
              },
            ]}
          />
          <Button
            variant="outlined"
            onClick={async () => {
              const files = await controller.selectFiles(editor);

              if (files) {
                setTargetFiles(files);
              }
            }}
          >
            加入圖片
          </Button>
        </div>
      ),
      children: <div>建立輪播</div>,
      customizedFooterElement: <div>{`已上傳 ${targetFiles.length}/10`}</div>,
    }),
    [controller, editor, targetFiles.length],
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false);
        setIsModalClosed(true);
        setTargetFiles([]);
      }}
      {...modalConfig}
    />
  );
};

export function useCarouselModal(controller: ReactCarousel) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isModalClosed, setIsModalClosed] = useState<boolean>(false);
  const editor = useSlateStatic();
  const { appendModal } = useModal();

  useEffect(() => {
    appendModal(
      <CarouselModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setIsModalClosed={setIsModalClosed}
        controller={controller}
      />,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controller, isOpen]);

  useEffect(() => {
    if (isModalClosed) {
      setTimeout(() => {
        controller.removeCarouselPlaceholder(editor);
        setIsModalClosed(false);
      }, 250);
    }
  }, [controller, editor, isModalClosed, isOpen]);

  return {
    isOpen,
    setIsOpen,
  };
}
