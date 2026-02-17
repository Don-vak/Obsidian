import { Hero } from '@/components/Hero';
import { PropertyDetails } from '@/components/PropertyDetails';
import { Amenities } from '@/components/Amenities';
import { Gallery } from '@/components/Gallery';
import { Location } from '@/components/Location';
import { Testimonials } from '@/components/Testimonials';

export default function Home() {
    return (
        <>
            <Hero />
            <PropertyDetails />
            <Amenities />
            <Gallery />
            <Location />
            <Testimonials />
        </>
    );
}
