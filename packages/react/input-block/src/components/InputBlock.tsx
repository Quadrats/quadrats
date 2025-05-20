import React from 'react';
import { Icon } from '@quadrats/react/components';
import { Edit, Trash } from '@quadrats/icons';
import { RenderInputBlockElementProps } from '../typings';
import { useInputBlock } from '../hooks/useInputBlock';

function InputBlock(props: RenderInputBlockElementProps) {
  const { attributes } = props;
  const {
    inputRef, onBlur, onConfirm, onRemove, onKeyDown, placeholder,
  } = useInputBlock(props);

  return (
    <div
      {...attributes}
      contentEditable={false}
      className="qdr-input-block"
    >
      <input
        ref={inputRef}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="qdr-input-block__input"
        style={{
          display: 'block',
          color: 'currentColor',
          width: '100%',
          margin: 0,
          border: 0,
          padding: 0,
          background: 'none',
          outline: 0,
          boxSizing: 'border-box',
        }}
      />
      <div className="qdr-input-block__icons">
        <div className="qdr-input-block__icon" onClick={onConfirm}>
          <Icon
            icon={Edit}
            width={24}
            height={24}
          />
        </div>
        <div className="qdr-input-block__icon" onClick={onRemove}>
          <Icon
            icon={Trash}
            width={24}
            height={24}
          />
        </div>
      </div>
    </div>
  );
}

export default InputBlock;
