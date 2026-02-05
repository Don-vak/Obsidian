import React from 'react';
import { Star, Quote } from 'lucide-react';

const reviewsRow1 = [
  { text: "The silence here is profound. A perfect disconnect from the noise of modern life. The architecture frames nature like a painting.", name: "Elena Richardson", role: "Architect", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" },
  { text: "We've stayed in luxury villas across the world, but The Obsidian stands alone. The infinity pool at sunset is magic.", name: "James Sterling", role: "London, UK", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
  { text: "Every detail has been considered. The concierge arranged a private chef who prepared the best meal of our lives.", name: "Sarah Jenkins", role: "New York", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" },
];

const reviewsRow2 = [
  { text: "A true sanctuary. The wellness suite rivals top spas, and the privacy is absolute. We returned rejuvenated.", name: "Marcus Thorne", role: "Tech Executive", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" },
  { text: "Simply unforgettable. Waking up above the clouds was an experience I'll never forget. Highly recommended.", name: "Olivia Parker", role: "Travel Writer", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", dark: true },
  { text: "The seamless integration of technology and nature is impressive. Comfort without compromise.", name: "David Chen", role: "Designer", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" },
];

const reviewsRow3 = [
    { text: "The Obsidian redefined luxury for us. It’s not just a stay; it’s an immersive experience in nature.", name: "Isabella Rossi", role: "Milan, Italy", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop" },
    { text: "Total privacy. We felt like the only people on earth, yet we were pampered at every turn.", name: "Thomas H.", role: "Entrepreneur", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop" },
    { text: "I've never slept better. The bed, the air, the quiet—everything is designed for restoration.", name: "Michael B.", role: "CEO", img: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop" },
];

interface Review {
  text: string;
  name: string;
  role: string;
  img: string;
  dark?: boolean;
}

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => (
  <div className={`w-[300px] md:w-[400px] flex-none p-6 rounded-2xl border shadow-sm hover:shadow-md transition-shadow ${review.dark ? 'bg-[#1C1917] border-stone-800' : 'bg-white border-stone-100'}`}>
    <Quote size={24} className={`mb-4 ${review.dark ? 'text-[#A18058]' : 'text-[#A18058]/30'}`} />
    <p className={`font-light serif italic mb-6 leading-relaxed ${review.dark ? 'text-stone-200' : 'text-stone-600'}`}>"{review.text}"</p>
    <div className="flex items-center gap-3">
      <img src={review.img} className={`w-10 h-10 rounded-full object-cover ${review.dark ? 'ring-2 ring-[#A18058]/50' : 'grayscale opacity-80'}`} alt={review.name} />
      <div>
        <div className={`text-sm font-medium ${review.dark ? 'text-white' : 'text-stone-900'}`}>{review.name}</div>
        <div className="text-[10px] uppercase tracking-widest text-[#A18058]">{review.role}</div>
      </div>
    </div>
  </div>
);

export const Testimonials: React.FC = () => {
  return (
    <section className="bg-[#FAFAF9] pt-24 pb-24" id="reviews">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-[#A18058] font-semibold tracking-[0.2em] text-[10px] uppercase mb-3 block">Guest Experiences</span>
          <h2 className="text-3xl md:text-4xl serif text-stone-900 font-light mb-6">Stories from the Sanctuary</h2>
          
          <div className="inline-flex items-center gap-3 bg-white border border-stone-200 rounded-full px-4 py-2 shadow-sm mt-2">
            <div className="flex -space-x-3">
              {[
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
                "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
              ].map((src, i) => (
                <img key={i} className="w-8 h-8 rounded-full border-2 border-white object-cover" src={src} alt="Guest" />
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-white bg-[#1C1917] text-white flex items-center justify-center text-[10px] font-medium">+120</div>
            </div>
            <div className="h-4 w-px bg-stone-200"></div>
            <div className="flex items-center gap-1">
              <Star size={14} className="text-[#A18058] fill-[#A18058]" />
              <span className="text-xs font-medium text-stone-900">4.98</span>
              <span className="text-xs text-stone-400 font-light">(124 Reviews)</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 overflow-hidden pause-on-hover py-4 mask-linear-fade">
            {/* Mask handled via style in index.html or arbitrary class if possible, but style prop is safer for complexity */}
             <div style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
                
                {/* Row 1 Left */}
                <div className="flex gap-6 w-max animate-scroll-left mb-6">
                    {[...reviewsRow1, ...reviewsRow1, ...reviewsRow1].map((r, i) => <ReviewCard key={i} review={r} />)}
                </div>

                 {/* Row 2 Right */}
                 <div className="flex gap-6 w-max animate-scroll-right mb-6">
                    {[...reviewsRow2, ...reviewsRow2, ...reviewsRow2].map((r, i) => <ReviewCard key={i} review={r} />)}
                </div>

                 {/* Row 3 Left */}
                 <div className="flex gap-6 w-max animate-scroll-left">
                    {[...reviewsRow3, ...reviewsRow3, ...reviewsRow3].map((r, i) => <ReviewCard key={i} review={r} />)}
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};
