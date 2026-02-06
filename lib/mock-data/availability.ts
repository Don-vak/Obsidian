export const mockBlockedDates = [
    // Already booked
    { date: '2026-03-15', reason: 'booked' as const },
    { date: '2026-03-16', reason: 'booked' as const },
    { date: '2026-03-17', reason: 'booked' as const },

    // Maintenance
    { date: '2026-04-01', reason: 'maintenance' as const },
    { date: '2026-04-02', reason: 'maintenance' as const },

    // Personal use
    { date: '2026-05-20', reason: 'personal' as const },
    { date: '2026-05-21', reason: 'personal' as const },

    // Holidays
    { date: '2026-12-24', reason: 'holiday' as const },
    { date: '2026-12-25', reason: 'holiday' as const },
    { date: '2026-12-31', reason: 'holiday' as const },
    { date: '2027-01-01', reason: 'holiday' as const },
];

export function isDateAvailable(date: Date): boolean {
    const dateStr = date.toISOString().split('T')[0];
    return !mockBlockedDates.some(blocked => blocked.date === dateStr);
}

export function getBlockedDatesInRange(startDate: Date, endDate: Date) {
    return mockBlockedDates.filter(blocked => {
        const blockedDate = new Date(blocked.date);
        return blockedDate >= startDate && blockedDate <= endDate;
    });
}

export function checkAvailability(checkIn: string, checkOut: string) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const blockedDates = getBlockedDatesInRange(start, end);
    const available = blockedDates.length === 0;

    return {
        available,
        blockedDates: blockedDates.map(d => d.date),
        message: available
            ? 'Dates are available!'
            : 'Some dates in your range are not available.',
    };
}
