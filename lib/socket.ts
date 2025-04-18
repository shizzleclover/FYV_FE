import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { SOCKET_URL } from './api';

interface SessionState {
  eventCode: string | null;
  hostName: string | null;
  participantId: string | null;
  displayName: string | null;
  matchId: string | null;
  matchParticipantId: string | null;
  socket: Socket | null;
}

// Session state
const sessionState: SessionState = {
  eventCode: null,
  hostName: null,
  participantId: null,
  displayName: null,
  matchId: null,
  matchParticipantId: null,
  socket: null,
};

// Connect to Socket.IO
export function connectToSocket(
  eventCode?: string,
  participantId?: string,
  displayName?: string,
  matchId?: string,
  matchParticipantId?: string
) {
  // Update session state if values provided
  if (eventCode) sessionState.eventCode = eventCode;
  if (participantId) sessionState.participantId = participantId;
  if (displayName) sessionState.displayName = displayName;
  if (matchId) sessionState.matchId = matchId;
  if (matchParticipantId) sessionState.matchParticipantId = matchParticipantId;

  // Disconnect existing socket if any
  if (sessionState.socket) {
    console.log('Disconnecting existing socket connection');
    sessionState.socket.disconnect();
  }
  
  console.log('Connecting to socket server at:', SOCKET_URL);
  
  try {
    sessionState.socket = io(SOCKET_URL);
    
    sessionState.socket.on('connect', () => {
      console.log('Socket connected successfully, socket id:', sessionState.socket?.id);
      
      if (sessionState.eventCode) {
        // Join event room
        console.log('Joining event room:', sessionState.eventCode);
        sessionState.socket?.emit('join-event', sessionState.eventCode);
        
        // If we already have a match, automatically join the chat room
        if (sessionState.matchId && sessionState.participantId) {
          console.log('Auto-joining chat room for match:', sessionState.matchId);
          sessionState.socket?.emit('join-chat', {
            eventCode: sessionState.eventCode,
            matchId: sessionState.matchId,
            participantId: sessionState.participantId,
            displayName: sessionState.displayName || sessionState.participantId
          });
        }
      }
    });
    
    sessionState.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      toast.error('Failed to connect to the chat server. Please try again.');
    });
    
    // Set up default event handlers
    setupSocketEventHandlers();
    
    return sessionState.socket;
  } catch (error) {
    console.error('Error initializing socket:', error);
    toast.error('Failed to initialize real-time connection');
    return null;
  }
}

// Setup default socket event handlers
function setupSocketEventHandlers() {
  if (!sessionState.socket) return;
  
  // Lobby events
  sessionState.socket.on('participant-update', (data) => {
    console.log('Participant update:', data);
    // Events can be handled by components
  });
  
  sessionState.socket.on('countdown-update', (data) => {
    console.log('Countdown update:', data);
    // Events can be handled by components
  });
  
  sessionState.socket.on('countdown-complete', () => {
    console.log('Countdown complete');
    toast.info('Countdown complete!');
    // Events can be handled by components
  });
  
  sessionState.socket.on('match-reveal', () => {
    console.log('Match reveal triggered');
    toast.success('Matches have been revealed!');
    // Events can be handled by components
  });
  
  // Chat events
  sessionState.socket.on('chat-history', (data) => {
    console.log('Received chat history:', data.messages.length, 'messages');
    // Events can be handled by components
  });
  
  sessionState.socket.on('new-message', (message) => {
    console.log('Received new message:', message);
    // Events can be handled by components
  });
  
  sessionState.socket.on('chat-participant-joined', (data) => {
    console.log('Participant joined chat:', data);
    // Events can be handled by components
  });
  
  sessionState.socket.on('chat-participant-left', (data) => {
    console.log('Participant left chat:', data);
    // Events can be handled by components
  });
}

// Get current socket
export function getSocket(): Socket | null {
  return sessionState.socket;
}

// Send a chat message
export function sendChatMessage(content: string): boolean {
  if (!sessionState.socket || !sessionState.eventCode || !sessionState.participantId || !sessionState.matchId) {
    console.error('Cannot send message - missing required data', {
      hasSocket: !!sessionState.socket,
      eventCode: sessionState.eventCode,
      participantId: sessionState.participantId,
      matchId: sessionState.matchId
    });
    return false;
  }
  
  sessionState.socket.emit('send-message', {
    eventCode: sessionState.eventCode,
    matchId: sessionState.matchId,
    senderId: sessionState.participantId,
    content: content
  });
  
  return true;
}

// Trigger matchmaking
export function triggerMatchReveal(eventCode: string): void {
  if (sessionState.socket) {
    sessionState.socket.emit('trigger-match-reveal', eventCode);
  }
}

// Start event countdown
export function startCountdown(eventCode: string, duration: number): void {
  if (sessionState.socket) {
    sessionState.socket.emit('start-countdown', {
      eventCode: eventCode,
      duration: duration
    });
  }
}

// Update leaderboard
export function updateLeaderboard(eventCode: string): void {
  if (sessionState.socket) {
    sessionState.socket.emit('update-leaderboard', {
      eventCode: eventCode
    });
  }
}

// Get current session state
export function getSessionState(): SessionState {
  return { ...sessionState };
}

// Update session state
export function updateSessionState(updates: Partial<SessionState>): void {
  Object.assign(sessionState, updates);
} 