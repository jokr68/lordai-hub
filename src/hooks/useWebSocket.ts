import { useEffect, useRef, useState, useCallback } from 'react';
import { getWebSocketClient } from '@/lib/websocket';

interface UseWebSocketOptions {
  onMessage?: (data: any) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
  onError?: (error: any) => void;
}

export function useWebSocket(conversationId: number, options: UseWebSocketOptions = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<any>(null);

  useEffect(() => {
    // Get WebSocket client (singleton)
    const ws = getWebSocketClient(`ws://localhost:3000/api/ws?conversationId=${conversationId}`);
    wsRef.current = ws;

    // Set up event listeners
    const handleConnected = () => {
      setIsConnected(true);
      options.onConnected?.();
    };

    const handleDisconnected = () => {
      setIsConnected(false);
      options.onDisconnected?.();
    };

    const handleError = (error: any) => {
      options.onError?.(error);
    };

    const handleMessage = (data: any) => {
      options.onMessage?.(data);
    };

    ws.on('connected', handleConnected);
    ws.on('disconnected', handleDisconnected);
    ws.on('error', handleError);
    ws.on('message', handleMessage);

    // Connect if not already connected
    if (!ws.isConnected()) {
      ws.connect().catch((error: any) => {
        console.error('Failed to connect WebSocket:', error);
        options.onError?.(error);
      });
    }

    // Cleanup
    return () => {
      ws.off('connected', handleConnected);
      ws.off('disconnected', handleDisconnected);
      ws.off('error', handleError);
      ws.off('message', handleMessage);
    };
  }, [conversationId, options]);

  const sendMessage = useCallback((type: string, data: any = {}) => {
    if (wsRef.current) {
      wsRef.current.send(type, data);
    }
  }, []);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.disconnect();
    }
  }, []);

  return {
    isConnected,
    sendMessage,
    disconnect,
  };
}

export default useWebSocket;