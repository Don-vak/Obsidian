export interface FAQ {
    question: string;
    answer: string;
    category?: string;
}

export const faqData: FAQ[] = [
    {
        question: 'What makes The Obsidian unique?',
        answer: 'The Obsidian is a masterfully designed architectural gem nestled in the Malibu hills. Our property combines contemporary luxury with natural serenity, offering floor-to-ceiling windows with breathtaking ocean views, curated interiors by renowned designers, and exclusive amenities that create an unparalleled retreat experience.',
        category: 'Property & Amenities',
    },
    {
        question: 'What is your booking and cancellation policy?',
        answer: 'We offer flexible booking with a 50% deposit required to secure your reservation. Cancellations made 30+ days before check-in receive a full refund. Cancellations within 14-30 days receive a 50% refund. Unfortunately, cancellations within 14 days are non-refundable. We recommend travel insurance for added peace of mind.',
        category: 'Booking & Reservations',
    },
    {
        question: 'What amenities are included during my stay?',
        answer: 'Your stay includes premium amenities: a fully equipped gourmet kitchen, high-speed WiFi, smart home technology, luxury linens and towels, premium toiletries, in-home spa facilities, private infinity pool, outdoor entertainment area, and complimentary concierge services. We also provide a welcome package with local artisan products.',
        category: 'Property & Amenities',
    },
    {
        question: 'How many guests can The Obsidian accommodate?',
        answer: 'The Obsidian comfortably accommodates up to 8 guests across 4 beautifully appointed bedrooms, each with en-suite bathrooms. Additional sleeping arrangements can be made for children upon request. We maintain our commitment to exclusivity by hosting only one party at a time.',
        category: 'Property & Amenities',
    },
    {
        question: 'Is there a minimum stay requirement?',
        answer: 'Yes, we require a minimum 2-night stay to ensure our guests can fully immerse themselves in the Obsidian experience. During peak seasons and holidays, a 5-night minimum may apply. Extended stays of 7+ nights receive special weekly rates, and 28+ night stays qualify for our monthly discount.',
        category: 'Booking & Reservations',
    },
    {
        question: 'What is the check-in and check-out process?',
        answer: 'Check-in is at 4:00 PM and check-out is at 11:00 AM. We offer a seamless, contactless check-in experience with smart lock access codes sent 24 hours before arrival. Our concierge team is available to greet you personally if preferred. Early check-in and late check-out may be available upon request, subject to availability.',
        category: 'Policies & Guidelines',
    },
    {
        question: 'Are pets welcome at The Obsidian?',
        answer: 'We understand pets are family. Well-behaved dogs are welcome with prior approval and a $200 pet fee. We ask that you inform us during booking and provide details about your furry companion. Please note that pets must be supervised at all times and are not permitted on furniture or beds.',
        category: 'Policies & Guidelines',
    },
    {
        question: 'What happens if I need to extend my stay?',
        answer: 'We would be delighted to extend your stay! Please contact our concierge team as early as possible. Extensions are subject to availability and will be charged at the current nightly rate. If you are enjoying your time with us, we will do everything possible to accommodate your request.',
        category: 'Booking & Reservations',
    },
    {
        question: 'Is parking available at the property?',
        answer: 'Yes, The Obsidian features a private, gated driveway with secure parking for up to 4 vehicles. The property is accessed via a private road, ensuring complete privacy and security throughout your stay. Detailed directions and access codes are provided upon booking confirmation.',
        category: 'Getting Here',
    },
    {
        question: 'How do I access the property?',
        answer: 'Access is simple and secure. You will receive detailed arrival instructions 24 hours before check-in, including GPS coordinates, access codes for the gate and smart locks, and a digital welcome guide. Our concierge team is available 24/7 should you need any assistance during your arrival or stay.',
        category: 'Getting Here',
    },
];
