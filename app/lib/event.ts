export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  eventCode: string;
  attendeeCount: number;
  status: 'active' | 'completed' | 'cancelled';
  organizer: string;
  maxAttendees: number;
  attendees?: Attendee[];
}

export interface Attendee {
  id: string;
  name: string;
  email: string;
}

export interface EventRegistrationRequest {
  eventId: string;
  eventCode: string;
}

export interface EventRegistrationResponse {
  success: boolean;
  message: string;
  event?: Event;
}

// Check if an event is upcoming (in the future)
export function isUpcomingEvent(event: Event): boolean {
  return new Date(event.date) > new Date() && event.status === 'active';
}

// Check if an event is past (already happened)
export function isPastEvent(event: Event): boolean {
  return new Date(event.date) < new Date() || event.status === 'completed';
}

// Check if an event is at capacity
export function isEventAtCapacity(event: Event): boolean {
  return event.attendeeCount >= event.maxAttendees;
}

// Format event date for display
export function formatEventDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Get remaining spots for an event
export function getRemainingSpots(event: Event): number {
  return Math.max(0, event.maxAttendees - event.attendeeCount);
} 