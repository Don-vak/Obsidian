export interface FAQ {
    question: string;
    answer: string;
    category?: string;
}

export const faqData: FAQ[] = [
    {
        question: 'What makes this Music Row Condo unique?',
        answer: 'Located directly on legendary Music Row, our condo offers a rare combination of luxury and history. You are steps away from famous recording studios while enjoying modern amenities like a rooftop sky lounge, seasonal pool, and full gym.',
        category: 'Property & Amenities',
    },
    {
        question: 'Is parking included?',
        answer: 'Yes! We provide free, secure garage parking connected directly to the building. This is a rare find in this area of Nashville and ensures your vehicle is safe and accessible.',
        category: 'Getting Here',
    },
    {
        question: 'What amenities are available?',
        answer: 'You have access to a seasonal outdoor pool, a massive rooftop deck with city views/grills, a state-of-the-art gym, a clubroom with billiards, and a business center. Inside the condo, enjoy high-speed WiFi, smart TVs, and a fully equipped kitchen.',
        category: 'Property & Amenities',
    },
    {
        question: 'How close is it to Broadway and other attractions?',
        answer: 'We are approximately 1 mile (5-minute drive or short rideshare) from the honky-tonks on Broadway. Vanderbilt and Belmont Universities are within walking distance (0.5 miles). The Gulch and Midtown are also just minutes away.',
        category: 'Location',
    },
    {
        question: 'What is the check-in/check-out time?',
        answer: 'Check-in is at 4:00 PM and check-out is at 11:00 AM. We offer contactless check-in via a secure keypad. Early check-in or late check-out may be requested but depends on availability.',
        category: 'Policies',
    },
    {
        question: 'Are pets allowed?',
        answer: 'Yes, we are pet-friendly! A small non-refundable pet fee applies. Please let us know in advance if you plan to bring a pet so we can prepare for your arrival.',
        category: 'Policies',
    },
    {
        question: 'Is the area safe/noise level?',
        answer: 'Music Row is a safe, historic business district that is quieter than downtown. While you are close to the action, the condo itself provides a peaceful retreat. Strict quiet hours are enforced from 10 PM to 8 AM.',
        category: 'Policies',
    },
    {
        question: 'Do you offer luggage storage?',
        answer: 'We do not have a front desk for luggage storage, but there are several reputable luggage storage services nearby in Midtown and Downtown if you arrive early or leave late.',
        category: 'Getting Here',
    },
];
