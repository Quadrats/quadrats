import React from 'react';
import { useSlateStatic } from '@quadrats/react';
import { Hints, Button } from '@quadrats/react/components';
import { ReactCarousel } from '../typings';

export function useCarouselModal(controller: ReactCarousel) {
  const editor = useSlateStatic();

  return {
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
          onClick={() => {
            controller.upload(editor);
          }}
        >
          加入圖片
        </Button>
      </div>
    ),
    children: <div>建立輪播</div>,
    customizedFooterElement: <div>已上傳 8/10</div>,
  };
}
