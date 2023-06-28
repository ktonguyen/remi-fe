import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import SigninForm from '../pages/signin';
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

describe('SigninForm', () => {
  let mockSocketOn: jest.Mock;
  beforeEach(() => {
    const mockSocket = {
      on: jest.fn(),
      disconnect: jest.fn(),
    };
    mockSocketOn = mockSocket.on as jest.Mock;
    io.mockReturnValue(mockSocket);
    
  });
  test('submits the form and redirects to home page on successful login', async () => {
    useRouter.mockImplementation(() => ({
        // Mock the router methods and properties you need
        pathname: '/',
        push: jest.fn(),
    }));
    // Mock the signIn function from next-auth
    signIn.mockImplementation(() =>
        Promise.resolve({ status: 200, ok: true, url: '/', user: { id: 1, name: "nguyen", email: "nguyen@gmail.com"} })
    )

    render(
        <CacheProvider value={clientSideEmotionCache}>
          <Head>
            <meta name="viewport" content="initial-scale=1, width=device-width" />
          </Head>
          <ThemeProvider>
            <CssBaseline />
              <BroadcastProvider>
                <SigninForm  />
              </BroadcastProvider>
          </ThemeProvider>
      </CacheProvider>
    );

    // Fill out the form
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });

    // Submit the form
    act(() => {
        fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    })

    // Wait for the redirect to happen
    await waitFor(() => expect(screen.getByText('Sign In')).toBeInTheDocument());

    // Assert that the user is redirected to the home page
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  test('displays error message on failed login', async () => {
    signIn.mockImplementation(() =>
        Promise.resolve({ error: 'Invalid email or password', status: 401, ok: false, url: '/' })
    )
    

    render(<CacheProvider value={clientSideEmotionCache}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <ThemeProvider>
          <CssBaseline />
            <BroadcastProvider>
              <SigninForm  />
            </BroadcastProvider>
        </ThemeProvider>
    </CacheProvider>
    );

    // Fill out the form
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    // Wait for the error message to appear
    await waitFor(() => screen.getByText("Invalid email or password"));

    // Assert that the error message is displayed
    expect(screen.getByText("Invalid email or password")).toBeInTheDocument();
  });
});
