import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { enUS, LocaleDefinition, zhTW } from '@quadrats/locales';
import ConfigsProvider from './ConfigsProvider';
import { useLocale } from './locale';
import { useTheme } from './theme';

(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

function render(ui: React.ReactElement) {
  const container = document.createElement('div');
  const root = createRoot(container);

  act(() => {
    root.render(ui);
  });

  act(() => {
    root.unmount();
  });
}

describe('ConfigsProvider', () => {
  it('should provide enUS by default at top level', () => {
    let captured: LocaleDefinition | undefined;

    function Probe() {
      captured = useLocale();

      return null;
    }

    render(
      <ConfigsProvider>
        <Probe />
      </ConfigsProvider>,
    );

    expect(captured).toBe(enUS);
  });

  it('should inherit locale from ancestor provider when omitted', () => {
    let captured: LocaleDefinition | undefined;

    function Probe() {
      captured = useLocale();

      return null;
    }

    render(
      <ConfigsProvider locale={zhTW}>
        <ConfigsProvider>
          <Probe />
        </ConfigsProvider>
      </ConfigsProvider>,
    );

    expect(captured).toBe(zhTW);
  });

  it('should let explicit locale on nested provider win over ancestor', () => {
    let captured: LocaleDefinition | undefined;

    function Probe() {
      captured = useLocale();

      return null;
    }

    render(
      <ConfigsProvider locale={zhTW}>
        <ConfigsProvider locale={enUS}>
          <Probe />
        </ConfigsProvider>
      </ConfigsProvider>,
    );

    expect(captured).toBe(enUS);
  });

  it('should inherit theme from ancestor provider when omitted', () => {
    let captured: string | undefined;

    function Probe() {
      captured = useTheme().props.className;

      return null;
    }

    render(
      <ConfigsProvider theme="custom">
        <ConfigsProvider>
          <Probe />
        </ConfigsProvider>
      </ConfigsProvider>,
    );

    expect(captured).toBe('qdr-theme-custom');
  });
});
