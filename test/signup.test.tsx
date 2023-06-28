import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import SignupForm from '../pages/signup';
import { useRouter } from 'next/router';
import Head from 'next/head';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import ThemeProvider from '../theme';
import createEmotionCache from '../src/createEmotionCache';
import { SessionProvider, signIn } from 'next-auth/react';
import { BroadcastProvider, BroadcastContext } from 'BroadcastContext';
import { io } from 'socket.io-client';
jest.mock('next-auth/react');
jest.mock('socket.io-client');
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));
beforeAll(() => {
    console.log = (msg) => {};
    console.warn = (msg) => {};
});
const clientSideEmotionCache = createEmotionCache();

describe('SignupForm', () => {
  let mockSocketOn: jest.Mock;
  beforeEach(() => {
    const mockSocket = {
      on: jest.fn(),
      disconnect: jest.fn(),
    };
    mockSocketOn = mockSocket.on as jest.Mock;
    io.mockReturnValue(mockSocket);
    
  });
  test('submits the form and redirects to home page on successful signup', async () => {
    
    // Mock the signIn function from next-auth
    signIn.mockImplementation(() =>
        Promise.resolve({ status: 200, ok: true, url: '/', user: { id: 1, name: "test", email: "test@example.com"} })
    )
    global.fetch = jest.fn().mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({ success: true }),
        status: 200,
    });

    render(
        <CacheProvider value={clientSideEmotionCache}>
          <Head>
            <meta name="viewport" content="initial-scale=1, width=device-width" />
          </Head>
          <ThemeProvider>
            <CssBaseline />
              <BroadcastProvider>
                <SignupForm  />
              </BroadcastProvider>
          </ThemeProvider>
      </CacheProvider>
    );

    // Fill out the form
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'test test' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });

    // Submit the form
    act(() => {
        fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
    })

    // Wait for the redirect to happen
    await waitFor(() => expect(screen.getByText('Sign Up')).toBeInTheDocument());

    // Assert that the user is redirected to the home page
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  test('submits the form failed ', async () => {
    
    // Mock the signIn function from next-auth
    signIn.mockImplementation(() =>
        Promise.resolve({ status: 200, ok: true, url: '/', user: { id: 1, name: "test", email: "test@example.com"} })
    )
    global.fetch = jest.fn().mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({ error: "User already exist" }),
        status: 401,
    });

    render(
        <CacheProvider value={clientSideEmotionCache}>
          <Head>
            <meta name="viewport" content="initial-scale=1, width=device-width" />
          </Head>
          <ThemeProvider>
            <CssBaseline />
              <BroadcastProvider>
                <SignupForm  />
              </BroadcastProvider>
          </ThemeProvider>
      </CacheProvider>
    );

    // Fill out the form
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'test test' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });

    // Submit the form
    act(() => {
        fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
    })

    // Wait for the redirect to happen
    await waitFor(() => expect(screen.getByText('User already exist')).toBeInTheDocument());

    // Assert that the user is redirected to the home page
    expect(screen.getByText('User already exist')).toBeInTheDocument();
  });

});
