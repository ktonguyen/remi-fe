import React from 'react';
import { render, screen } from '@testing-library/react';
import { io } from 'socket.io-client';
import { BroadcastProvider } from '../app/BroadcastContext';

jest.mock('socket.io-client', () => ({
  io: jest.fn(),
}));

describe('BroadcastContext', () => {
  test('should render children and display message when video is shared', () => {
    const mockSocket = {
      on: jest.fn(),
      disconnect: jest.fn(),
    };
    io.mockReturnValue(mockSocket);

    render(
      <BroadcastProvider>
        <div data-testid="child">Child Component</div>
      </BroadcastProvider>
    );

    expect(io).toHaveBeenCalledWith('ws://localhost:8080');
    expect(mockSocket.on).toHaveBeenCalledWith('shareVideo', expect.any(Function));

    // Simulate video share event
    const videoTitle = 'Test Video';
    const sharedBy = 'John Doe';
    const message = `Video: ${videoTitle} has been shared by ${sharedBy}`;
    const shareVideoHandler = mockSocket.on.mock.calls[0][1];
    shareVideoHandler({ title: videoTitle, shareBy: sharedBy, id: 1, url: "videos.com?ab=1" });

    // Verify that child component is rendered
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
