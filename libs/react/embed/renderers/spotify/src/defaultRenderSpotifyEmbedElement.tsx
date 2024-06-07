import React from 'react';
import PodcastSpotify, { SpotifyProps } from './components/Spotify';

export const defaultRenderSpotifyEmbedElement = (props: SpotifyProps) => <PodcastSpotify {...props} />;
