import { toast } from "sonner"
import { getAuthHeader } from "./auth"

// Use localhost for development, update for production
export const API_BASE_URL = 'https://fyvbe-production.up.railway.app/api';
export const SOCKET_URL = 'https://fyvbe-production.up.railway.app';

// Disable mock API - we want to use the real backend 
const useMockApi = false;

// Common fetch options
export const fetchOptions = {
  mode: 'cors' as RequestMode,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Get fetch options with auth headers when needed
export function getFetchOptions(needsAuth: boolean = false): RequestInit {
  if (!needsAuth) {
    return fetchOptions;
  }
  
  // Add authorization header
  return {
    ...fetchOptions,
    headers: {
      ...fetchOptions.headers,
      ...getAuthHeader()
    }
  };
}

// Add better error handling for JSON parsing
async function handleResponse(response: Response) {
  try {
    // Check if the response is actually JSON
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      // If it's not JSON, get the text for better error reporting
      const text = await response.text()
      console.error('Non-JSON response:', text.substring(0, 100) + '...')
      throw new Error('Server returned non-JSON response')
    }
    return await response.json()
  } catch (error) {
    console.error('Error parsing response:', error)
    throw error
  }
}

// Types
export interface Question {
  text: string
  options: string[]
}

export interface Event {
  eventCode: string
  hostName: string
  questions: Question[]
  countdownDuration: number
  participantCount: number
  startTime: string
  isActive: boolean
  createdAt: string
}

export interface EventResponse {
  message: string
  eventCode: string
  event: Event
}

export interface Participant {
  anonymousId: string
  displayName: string
  eventCode: string
}

export interface QuestionResponse {
  questionId: number
  answer: string
}

export interface Vote {
  voterId: string
  outfitOwnerId: string
  score: number
}

export interface LeaderboardEntry {
  anonymousId: string
  outfit: string
  averageScore: number
  voteCount: number
}

export interface Match {
  matchParticipantId: string
  displayName: string
  compatibilityScore: number
  isWildCard: boolean
  outfit: string
}

export interface FollowupStats {
  totalParticipants: number
  totalMatches: number
  totalFollowUps: number
  wantToReconnect: number
  reconnectPercentage: string
  mutualInterestCount: number
  mutualInterestPercentage: string
}

export interface MatchInterest {
  matchParticipantId: string
  mutualInterest: boolean
  matchContactInfo: string
}

// Mock storage for our mock API
const mockStorage = {
  events: new Map<string, Event>(),
  participants: new Map<string, Participant[]>()
};

// Mock API implementations
function generateRandomCode(length = 6) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function mockCreateEvent(hostName: string, questions?: Question[], countdownDuration?: number): Promise<EventResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const eventCode = generateRandomCode();
      const mockEvent: Event = {
        eventCode,
        hostName,
        questions: questions || [],
        countdownDuration: countdownDuration || 300,
        participantCount: 0,
        startTime: new Date().toISOString(),
        isActive: true,
        createdAt: new Date().toISOString()
      };
      
      // Store in our mock storage
      mockStorage.events.set(eventCode, mockEvent);
      
      const response: EventResponse = {
        message: "Event created successfully",
        eventCode,
        event: mockEvent
      };
      
      resolve(response);
    }, 800);
  });
}

function mockGetEventDetails(eventCode: string): Promise<Event | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Check if event exists in our mock storage
      const event = mockStorage.events.get(eventCode);
      
      // If not found, create a dummy one for testing
      if (!event) {
        const mockEvent: Event = {
          eventCode,
          hostName: "Mock Host",
          questions: [],
          countdownDuration: 300,
          participantCount: Math.floor(Math.random() * 20) + 1,
          startTime: new Date().toISOString(),
          isActive: true,
          createdAt: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
        };
        mockStorage.events.set(eventCode, mockEvent);
        resolve(mockEvent);
      } else {
        resolve(event);
      }
    }, 500);
  });
}

function mockJoinEvent(eventCode: string, displayName: string): Promise<Participant | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate a random participant ID
      const anonymousId = generateRandomCode(8);
      
      // Create the participant
      const participant: Participant = {
        anonymousId,
        displayName,
        eventCode
      };
      
      // Store the participant
      if (!mockStorage.participants.has(eventCode)) {
        mockStorage.participants.set(eventCode, []);
      }
      mockStorage.participants.get(eventCode)?.push(participant);
      
      // Update participant count
      const event = mockStorage.events.get(eventCode);
      if (event) {
        event.participantCount = (mockStorage.participants.get(eventCode)?.length || 0);
        mockStorage.events.set(eventCode, event);
      }
      
      resolve(participant);
    }, 600);
  });
}

// API service functions
export async function createEvent(hostName: string, questions?: Question[], countdownDuration?: number): Promise<EventResponse | null> {
  try {
    console.log("Creating event with:", { hostName, questions: questions?.length, countdownDuration });
    
    // We should never use mock implementation now
    if (useMockApi) {
      console.log("Using mock API implementation");
      return await mockCreateEvent(hostName, questions, countdownDuration);
    }
    
    // Prepare the request body based on the backend API's expected format
    const requestBody: any = {
      hostName: hostName,
      countdownDuration: countdownDuration || 300 // Default 5 minutes
    };
    
    // Only add questions if they are provided and we're using custom questions
    if (questions && questions.length > 0) {
      requestBody.questions = questions;
    }
    
    console.log("Request payload:", requestBody);
    
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: "POST",
      ...getFetchOptions(true), // Use authenticated request
      body: JSON.stringify(requestBody)
    });

    console.log("Create event response status:", response.status);

    if (!response.ok) {
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const error = await response.json();
          toast.error(error.message || "Failed to create event");
        } else {
          const text = await response.text();
          console.error("Error response text:", text.substring(0, 200));
          toast.error("Failed to create event - server error");
        }
      } catch (parseError) {
        console.error("Error parsing error response:", parseError);
        toast.error("Failed to create event - unexpected response");
      }
      return null;
    }

    try {
      const data = await response.json();
      console.log("Event created successfully:", data);
      
      // The backend should return an object with eventCode, message, and event details
      return data;
    } catch (parseError) {
      console.error("Error parsing response:", parseError);
      toast.error("Failed to parse server response");
      return null;
    }
  } catch (error) {
    console.error("Error creating event:", error);
    toast.error("Failed to create event. Please try again.");
    return null;
  }
}

export async function getEventDetails(eventCode: string): Promise<Event | null> {
  try {
    console.log(`Getting details for event ${eventCode}`);
    
    // We should never use mock implementation
    if (useMockApi) {
      console.log("Using mock getEventDetails implementation");
      return await mockGetEventDetails(eventCode);
    }
    
    const response = await fetch(`${API_BASE_URL}/events/${eventCode}`, getFetchOptions());

    console.log("Get event details response status:", response.status);

    if (!response.ok) {
      if (response.status === 404) {
        toast.error("Event not found")
      } else {
        toast.error("Failed to get event details")
      }
      return null;
    }

    try {
      const data = await response.json();
      console.log("Event details retrieved:", data);
      return data;
    } catch (parseError) {
      console.error("Error parsing event details response:", parseError);
      toast.error("Failed to parse server response");
      return null;
    }
  } catch (error) {
    console.error("Error getting event details:", error)
    toast.error("Failed to get event details. Please try again.")
    return null;
  }
}

export async function startEventCountdown(eventCode: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${eventCode}/start`, {
      method: "POST",
      ...getFetchOptions(true) // Use authenticated request
    })

    if (!response.ok) {
      if (response.status === 404) {
        toast.error("Event not found")
      } else if (response.status === 403) {
        toast.error("You don't have permission to start this event")
      } else {
        toast.error("Failed to start event countdown")
      }
      return false
    }

    return true
  } catch (error) {
    console.error("Error starting event countdown:", error)
    toast.error("Failed to start event countdown. Please try again.")
    return false
  }
}

export async function joinEvent(eventCode: string, displayName: string): Promise<Participant | null> {
  try {
    console.log(`Joining event ${eventCode} as ${displayName}`);
    
    // We should never use mock implementation
    if (useMockApi) {
      console.log("Using mock joinEvent implementation");
      return await mockJoinEvent(eventCode, displayName);
    }
    
    const requestBody = {
      displayName: displayName
    };
    
    console.log("Join event request:", requestBody);
    
    const response = await fetch(`${API_BASE_URL}/events/${eventCode}/join`, {
      method: "POST",
      ...fetchOptions,
      body: JSON.stringify(requestBody)
    });

    console.log("Join event response status:", response.status);

    if (!response.ok) {
      if (response.status === 404) {
        toast.error("Event not found")
      } else {
        toast.error("Failed to join event")
      }
      return null;
    }

    try {
      const data = await response.json();
      console.log("Successfully joined event:", data);
      return data;
    } catch (parseError) {
      console.error("Error parsing join response:", parseError);
      toast.error("Failed to parse server response");
      return null;
    }
  } catch (error) {
    console.error("Error joining event:", error)
    toast.error("Failed to join event. Please try again.")
    return null
  }
}

export async function submitQuestionnaireResponses(
  eventCode: string,
  anonymousId: string,
  responses: QuestionResponse[]
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${eventCode}/responses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        anonymousId,
        responses,
      }),
    })

    if (!response.ok) {
      if (response.status === 404) {
        toast.error("Participant or event not found")
      } else {
        toast.error("Failed to submit questionnaire responses")
      }
      return false
    }

    return true
  } catch (error) {
    console.error("Error submitting questionnaire responses:", error)
    toast.error("Failed to submit responses. Please try again.")
    return false
  }
}

export async function submitOutfitDescription(
  eventCode: string,
  anonymousId: string,
  outfit: string
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${eventCode}/outfit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        anonymousId,
        outfit,
      }),
    })

    if (!response.ok) {
      if (response.status === 404) {
        toast.error("Participant or event not found")
      } else {
        toast.error("Failed to submit outfit description")
      }
      return false
    }

    return true
  } catch (error) {
    console.error("Error submitting outfit description:", error)
    toast.error("Failed to submit outfit description. Please try again.")
    return false
  }
}

export async function submitVote(eventCode: string, voterId: string, outfitOwnerId: string, score: number): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${eventCode}/vote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        voterId,
        outfitOwnerId,
        score,
      }),
    })

    if (!response.ok) {
      if (response.status === 404) {
        toast.error("Participant or event not found")
      } else if (response.status === 400) {
        toast.error("Invalid vote parameters")
      } else {
        toast.error("Failed to submit vote")
      }
      return false
    }

    return true
  } catch (error) {
    console.error("Error submitting vote:", error)
    toast.error("Failed to submit vote. Please try again.")
    return false
  }
}

export async function getLeaderboard(eventCode: string): Promise<LeaderboardEntry[] | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${eventCode}/leaderboard`)

    if (!response.ok) {
      toast.error("Failed to get leaderboard")
      return null
    }

    return await response.json()
  } catch (error) {
    console.error("Error getting leaderboard:", error)
    toast.error("Failed to get leaderboard. Please try again.")
    return null
  }
}

export async function triggerMatchmaking(eventCode: string, force: boolean = false): Promise<{ message: string; matchCount: number } | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${eventCode}/reveal`, {
      method: "POST",
      ...getFetchOptions(true), // Use authenticated request for host-only action
      body: JSON.stringify({
        force,
      }),
    })

    if (!response.ok) {
      if (response.status === 404) {
        toast.error("Event not found")
      } else if (response.status === 403) {
        toast.error("You don't have permission to trigger matchmaking for this event")
      } else if (response.status === 400) {
        toast.error("Not enough participants or matches already exist")
      } else {
        toast.error("Failed to trigger matchmaking")
      }
      return null
    }

    return await response.json()
  } catch (error) {
    console.error("Error triggering matchmaking:", error)
    toast.error("Failed to trigger matchmaking. Please try again.")
    return null
  }
}

export async function getMatch(eventCode: string, anonymousId: string): Promise<Match | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${eventCode}/matches?anonymousId=${anonymousId}`)

    if (!response.ok) {
      if (response.status === 404) {
        toast.error("Match not found")
      } else {
        toast.error("Failed to get match")
      }
      return null
    }

    return await response.json()
  } catch (error) {
    console.error("Error getting match:", error)
    toast.error("Failed to get match. Please try again.")
    return null
  }
}

export async function submitFollowupInfo(
  eventCode: string,
  participantId: string,
  reconnect: boolean,
  contactInfo?: string
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${eventCode}/followup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        participantId,
        reconnect,
        contactInfo: contactInfo || "",
      }),
    })

    if (!response.ok) {
      if (response.status === 404) {
        toast.error("Participant or event not found")
      } else if (response.status === 400) {
        toast.error("Invalid parameters or no match found")
      } else {
        toast.error("Failed to submit follow-up information")
      }
      return false
    }

    return true
  } catch (error) {
    console.error("Error submitting follow-up information:", error)
    toast.error("Failed to submit follow-up information. Please try again.")
    return false
  }
}

export async function getFollowupStats(eventCode: string): Promise<FollowupStats | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${eventCode}/followup/stats`, getFetchOptions(true))

    if (!response.ok) {
      if (response.status === 403) {
        toast.error("You don't have permission to view these statistics")
      } else {
        toast.error("Failed to get follow-up statistics")
      }
      return null
    }

    return await response.json()
  } catch (error) {
    console.error("Error getting follow-up statistics:", error)
    toast.error("Failed to get follow-up statistics. Please try again.")
    return null
  }
}

export async function checkMatchInterest(eventCode: string, participantId: string): Promise<MatchInterest | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${eventCode}/followup/match?participantId=${participantId}`)

    if (!response.ok) {
      if (response.status === 404) {
        toast.error("Match not found")
      } else {
        toast.error("Failed to check match interest")
      }
      return null
    }

    return await response.json()
  } catch (error) {
    console.error("Error checking match interest:", error)
    toast.error("Failed to check match interest. Please try again.")
    return null
  }
}