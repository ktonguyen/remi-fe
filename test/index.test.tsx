import React from 'react';
import { render, fireEvent, RenderResult,waitFor, screen, act } from '@testing-library/react';
import Index from '../pages/index';
import Head from 'next/head';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import ThemeProvider from '../theme';
import createEmotionCache from '../src/createEmotionCache';
import { SessionProvider } from 'next-auth/react';
import { BroadcastProvider, BroadcastContext } from 'BroadcastContext';
import { io } from 'socket.io-client';
jest.mock('socket.io-client');
const clientSideEmotionCache = createEmotionCache();
beforeAll(() => {
  console.log = (msg) => {};
  console.warn = (msg) => {};
});

describe('Videos Page', () => {
  let mockSocketOn: jest.Mock;
  beforeEach(() => {
    const mockSocket = {
      on: jest.fn(),
      disconnect: jest.fn(),
    };
    mockSocketOn = mockSocket.on as jest.Mock;
    io.mockReturnValue(mockSocket);
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            videos: [
              {
                id: 1,
                url: 'https://www.youtube.com/watch?v=Y6ODQH3oM1A',
                title: 'Sample Video',
                createdAt: '2022-01-01',
                shareBy: 'John Doe',
              },
            ],
            total: 10
          }),
      })
    );
  });
  test('should render videos', async () => {
    // Render the component
    
    const { getByText }: RenderResult = render(
      <CacheProvider value={clientSideEmotionCache}>
          <Head>
            <meta name="viewport" content="initial-scale=1, width=device-width" />
          </Head>
          <ThemeProvider>
            <CssBaseline />
            <SessionProvider session={null}>
              <BroadcastProvider>
                <Index  />
              </BroadcastProvider>
            </SessionProvider>
          </ThemeProvider>
      </CacheProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('Sample Video')).toBeInTheDocument();
    });
  });

  test('loads more videos when scrolling', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue({
        videos: [
          { id: 1, title: 'Video 1', url: 'https://example.com/video1', shareBy: 'Nguyen 1' },
          { id: 2, title: 'Video 2', url: 'https://example.com/video2', shareBy: 'Nguyen 2' },
        ],
        total: 10
      }),
    }).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue({
        videos: [
          { id: 3, title: 'Video 3', url: 'https://example.com/video3', shareBy: 'Nguyen 1' },
          { id: 4, title: 'Video 4', url: 'https://example.com/video4', shareBy: 'Nguyen 1' },
        ],
        total: 10
      }),
    });
    const { getByText }: RenderResult = render(
      <CacheProvider value={clientSideEmotionCache}>
          <Head>
            <meta name="viewport" content="initial-scale=1, width=device-width" />
          </Head>
          <ThemeProvider>
            <CssBaseline />
            <SessionProvider session={null}>
              <BroadcastProvider>
                <Index  />
              </BroadcastProvider>
            </SessionProvider>
          </ThemeProvider>
      </CacheProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('Video 1')).toBeInTheDocument();
    });

    // Scroll to trigger fetching more videos
    act(() => {
      fireEvent.scroll(window, { target: { scrollY: 1000 } });
    });
    // Wait for the additional videos to load
    await waitFor(() => {
      expect(screen.getByText('Video 3')).toBeInTheDocument();
      expect(screen.getByText('Video 4')).toBeInTheDocument();
    });
    
  });
  
  it('should render broadcast video', async () => {
    const broadcastValue = {
      id: 3,
      url: 'https://example.com/broadcast',
      title: 'Live Broadcast',
      createdAt: '2022-03-03',
      shareBy: 'Broadcast User',
    };

    const { getByText }: RenderResult = render(
      <CacheProvider value={clientSideEmotionCache}>
          <Head>
            <meta name="viewport" content="initial-scale=1, width=device-width" />
          </Head>
          <ThemeProvider>
            <CssBaseline />
            <SessionProvider session={null}>
              <BroadcastContext.Provider value={{ broadcastValue, broadcast: jest.fn() }}>
                <Index  />
              </BroadcastContext.Provider>
            </SessionProvider>
          </ThemeProvider>
      </CacheProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('Live Broadcast')).toBeInTheDocument();
    });
  });

})

