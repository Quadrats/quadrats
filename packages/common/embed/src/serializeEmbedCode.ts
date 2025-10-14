import { EmbedStrategies } from './typings';

export function serializeEmbedCode<P extends string>(
  embedCode: string,
  strategies: EmbedStrategies<P>,
  provider: P,
): [P, any] | undefined {
  const strategy = strategies[provider];
  const data = strategy.serialize(embedCode);

  if (data) {
    return [provider, data];
  }
}
