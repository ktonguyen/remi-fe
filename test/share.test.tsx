import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Share from '../pages/share';
import Head from 'next/head';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import ThemeProvider from '../theme';
import createEmotionCache from '../src/createEmotionCache';
import { SessionProvider } from 'next-auth/react';
import { BroadcastProvider, BroadcastContext } from 'BroadcastContext';
import io from 'socket.io-client';
import socketIO from 'socket.io-mock';
jest.mock('socket.io-client');
const clientSideEmotionCache = createEmotionCache();
beforeAll(() => {
    console.log = (msg) => {};
    console.warn = (msg) => {};
});

describe('ShareForm', () => {
    let mockSocket;

    beforeEach(() => {
        mockSocket = new socketIO();
        io.mockReturnValue(mockSocket);
    });

    afterEach(() => {
        io.mockRestore();
    });
    test('submits the form and displays success message', async () => {
        global.fetch = jest.fn().mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({ success: true }),
        status: 200,
        });
        const broadcastValue = {
            id: 3,
            url: 'https://www.youtube.com/watch?v=abcd1234',
            title: 'My Video',
            createdAt: '2022-03-03',
            shareBy: 'nguyen',
        };

        render(<CacheProvider value={clientSideEmotionCache}>
            <Head>
            <meta name="viewport" content="initial-scale=1, width=device-width" />
            </Head>
            <ThemeProvider>
            <CssBaseline />
            <SessionProvider session={{ user: {id: 1, name: "nguyen", accessToken: "token", email: "nguyen@gmail.com" }}}>
                <BroadcastProvider>
                    <Share  />
                </BroadcastProvider>
            </SessionProvider>
            </ThemeProvider>
        </CacheProvider>
        );

        // Fill out the form
        fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'My Video' } });
        fireEvent.change(screen.getByLabelText('Url Youtube'), { target: { value: 'https://www.youtube.com/watch?v=abcd1234' } });

        // Submit the form
        act(() => {
            fireEvent.click(screen.getByRole('button', { name: 'Share' }));
            
        })
        act(() => {
            mockSocket.on('shareVideo', (data) => {
                expect(data).toEqual(broadcastValue);
            });
            mockSocket.socketClient.emit('shareVideo', broadcastValue);
        })
       
        await waitFor(() => screen.getByText(`Video: ${broadcastValue.title} has been shared by ${broadcastValue.shareBy}`));
        
    });

    test('displays error message on form submission failure', async () => {
        // Mock the fetch function
        global.fetch = jest.fn().mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({ success: false, error: 'Something went wrong' }),
        status: 500,
        });

        render(<CacheProvider value={clientSideEmotionCache}>
            <Head>
            <meta name="viewport" content="initial-scale=1, width=device-width" />
            </Head>
            <ThemeProvider>
            <CssBaseline />
            <SessionProvider session={{ user: {id: 1, name: "nguyen", accessToken: "token", email: "nguyen@gmail.com" }}}>
                <BroadcastProvider>
                    <Share  />
                </BroadcastProvider>
            </SessionProvider>
            </ThemeProvider>
        </CacheProvider>);

        // Fill out the form
        fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'My Video' } });
        fireEvent.change(screen.getByLabelText('Url Youtube'), { target: { value: 'https://www.youtube.com/watch?v=abcd1234' } });

        // Submit the form
        act(() => {
            fireEvent.click(screen.getByRole('button', { name: 'Share' }));
            
        })

        // Wait for the error message to appear
        await waitFor(() => screen.getByText('Something went wrong'));

        // Assert that the error message is displayed
        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
});
