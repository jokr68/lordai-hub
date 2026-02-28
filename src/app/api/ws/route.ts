import { NextRequest } from 'next/server';
import { WebSocketServer } from 'ws';

export const dynamic = 'force-dynamic';

// Store active connections by conversation ID
const connections = new Map<number, Set<any>>();

// Create a simple WebSocket server instance (will be initialized when needed)
let wss: WebSocketServer | null = null;

export async function GET(request: NextRequest) {
  // This is a placeholder - WebSocket upgrade happens at the server level
  return new Response('WebSocket endpoint - use ws:// protocol', { status: 200 });
}

// Initialize WebSocket server
export function initializeWebSocketServer() {
  if (wss) return wss;

  wss = new WebSocketServer({ noServer: true });

  wss.on('connection', (ws: any, req: any) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const conversationId = parseInt(url.searchParams.get('conversationId') || '0');
    const userId = parseInt(url.searchParams.get('userId') || '0');

    console.log(`WebSocket connected for conversation ${conversationId}, user ${userId}`);

    // Add connection to the conversation's connection set
    if (!connections.has(conversationId)) {
      connections.set(conversationId, new Set());
    }
    connections.get(conversationId)!.add(ws);

    // Send welcome message
    ws.send(JSON.stringify({
      type: 'connected',
      data: { conversationId, userId }
    }));

    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message);
        
        // Broadcast message to all connections in the same conversation
        broadcastToConversation(conversationId, {
          type: data.type || 'message',
          data: data.data || {},
          userId,
          timestamp: new Date().toISOString()
        }, ws); // Exclude sender from receiving their own message

      } catch (error: unknown) {
        console.error('Error processing WebSocket message:', error);
      }
    });

    ws.on('close', () => {
      console.log(`WebSocket disconnected for conversation ${conversationId}`);
      const conversationConnections = connections.get(conversationId);
      if (conversationConnections) {
        conversationConnections.delete(ws);
        if (conversationConnections.size === 0) {
          connections.delete(conversationId);
        }
      }
    });

    ws.on('error', (error: Error) => {
      console.error('WebSocket error:', error);
    });
  });

  return wss;
}

// Handle WebSocket upgrade (this would be handled by a custom server in production)
export function handleUpgrade(req: any, socket: any, head: any) {
  const server = initializeWebSocketServer();
  server.handleUpgrade(req, socket, head, (ws) => {
    server.emit('connection', ws, req);
  });
}

function broadcastToConversation(conversationId: number, message: any, excludeWs?: any) {
  const conversationConnections = connections.get(conversationId);
  if (conversationConnections) {
    conversationConnections.forEach((ws) => {
      if (ws !== excludeWs && ws.readyState === 1) { // 1 = OPEN
        ws.send(JSON.stringify(message));
      }
    });
  }
}

// Export function to send messages from server-side
export function broadcastMessage(conversationId: number, type: string, data: any) {
  broadcastToConversation(conversationId, {
    type,
    data,
    timestamp: new Date().toISOString()
  });
}

export { wss, connections };