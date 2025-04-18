import { Event } from './event';

// Mock database of events
export const events: Event[] = [
  {
    id: "evt-001",
    title: "Tech Conference 2023",
    date: "2023-12-15T09:00:00.000Z",
    location: "Convention Center, Downtown",
    description: "Annual technology conference featuring the latest innovations and networking opportunities.",
    eventCode: "TECH2023",
    attendeeCount: 120,
    status: "active",
    organizer: "TechEvents Inc.",
    maxAttendees: 200,
    attendees: [
      {
        id: "usr-001",
        name: "John Doe",
        email: "john.doe@example.com"
      },
      {
        id: "usr-002",
        name: "Jane Smith",
        email: "jane.smith@example.com"
      }
    ]
  },
  {
    id: "evt-002",
    title: "Networking Mixer",
    date: "2023-11-05T18:00:00.000Z",
    location: "Skyline Lounge",
    description: "Evening networking event for professionals in the tech industry.",
    eventCode: "MIXER2023",
    attendeeCount: 45,
    status: "completed",
    organizer: "Business Network Group",
    maxAttendees: 50,
    attendees: [
      {
        id: "usr-001",
        name: "John Doe",
        email: "john.doe@example.com"
      }
    ]
  },
  {
    id: "evt-003",
    title: "Product Launch: NextGen",
    date: "2023-12-20T14:00:00.000Z",
    location: "Innovation Hub",
    description: "Launch of our next generation products with live demonstrations and Q&A sessions.",
    eventCode: "LAUNCH2023",
    attendeeCount: 85,
    status: "active",
    organizer: "NextGen Technologies",
    maxAttendees: 100,
    attendees: []
  },
  {
    id: "evt-004",
    title: "Annual Developers Meetup",
    date: "2024-01-15T10:00:00.000Z",
    location: "Code Campus, East Wing",
    description: "Annual gathering of developers to discuss trends, challenges, and future of software development.",
    eventCode: "DEVMEET24",
    attendeeCount: 65,
    status: "active",
    organizer: "Developer Community",
    maxAttendees: 150,
    attendees: []
  },
  {
    id: "evt-005",
    title: "Startup Funding Workshop",
    date: "2023-11-10T13:00:00.000Z",
    location: "Business Incubator Center",
    description: "Workshop on securing funding for startups, featuring venture capitalists and angel investors.",
    eventCode: "FUND2023",
    attendeeCount: 30,
    status: "cancelled",
    organizer: "Startup Accelerator",
    maxAttendees: 40,
    attendees: []
  }
];

// Find event by ID
export function findEventById(id: string): Event | undefined {
  return events.find(event => event.id === id);
}

// Find events by user ID (events a user is registered for)
export function findEventsByUserId(userId: string): Event[] {
  return events.filter(event => 
    event.attendees?.some(attendee => attendee.id === userId)
  );
}

// Find event by event code
export function findEventByCode(code: string): Event | undefined {
  return events.find(event => event.eventCode === code);
}

// Check if user is registered for an event
export function isUserRegisteredForEvent(eventId: string, userId: string): boolean {
  const event = findEventById(eventId);
  return !!event?.attendees?.some(attendee => attendee.id === userId);
}

// Get active events
export function getActiveEvents(): Event[] {
  return events.filter(event => event.status === 'active');
}

// Get upcoming events
export function getUpcomingEvents(): Event[] {
  const now = new Date();
  return events.filter(event => 
    new Date(event.date) > now && event.status === 'active'
  );
}

// Get past events
export function getPastEvents(): Event[] {
  const now = new Date();
  return events.filter(event => 
    new Date(event.date) < now || event.status === 'completed'
  );
} 