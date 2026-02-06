export interface BlockedDate {
    start: string;
    end: string;
    reason: 'booked' | 'maintenance' | 'personal' | 'holiday';
}

export const mockBlockedDates: BlockedDate[] = [
    { start: '2026-02-10', end: '2026-02-15', reason: 'booked' },
    { start: '2026-02-20', end: '2026-02-22', reason: 'maintenance' },
    { start: '2026-03-01', end: '2026-03-07', reason: 'booked' },
    { start: '2026-03-15', end: '2026-03-20', reason: 'personal' },
    { start: '2026-04-05', end: '2026-04-12', reason: 'booked' },
    { start: '2026-04-25', end: '2026-04-28', reason: 'holiday' },
];

export interface AvailabilityCheck {
    available: boolean;
    message: string;
}

export const checkAvailability = (checkIn: string, checkOut: string): AvailabilityCheck => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);

    // Check if dates overlap with any blocked dates
    for (const blocked of mockBlockedDates) {
        const blockedStart = new Date(blocked.start);
        const blockedEnd = new Date(blocked.end);

        // Check for overlap
        if (
            (start >= blockedStart && start <= blockedEnd) ||
            (end >= blockedStart && end <= blockedEnd) ||
            (start <= blockedStart && end >= blockedEnd)
        ) {
            return {
                available: false,
                message: `These dates are not available. The property is ${blocked.reason === 'booked' ? 'already booked' : blocked.reason} during this period.`,
            };
        }
    }

    return {
        available: true,
        message: 'These dates are available!',
    };
};
