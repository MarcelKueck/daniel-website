/**
 * SEO improvements for the Baumfällung Partsch Junior website
 * This script adds structured data to improve search engine visibility
 */

document.addEventListener('DOMContentLoaded', function() {
    addStructuredData();
});

function addStructuredData() {
    // Create the structured data script tag
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    
    // Create the structured data content
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Baumfällung Partsch Junior",
        "description": "Bayerns führender Baumspezialist bietet präzise Baumfällung, Pflege und Wartungsdienste mit Engagement für Umweltverantwortung.",
        "image": "assets/images/hero-video.jpg",
        "telephone": "+49 123 456 7890",
        "email": "info@partsch-tree.de",
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "DE",
            "addressRegion": "Bayern"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 48.1351,  // Example coordinates for Munich
            "longitude": 11.5820
        },
        "sameAs": [
            "https://www.facebook.com/partsch-tree",
            "https://www.instagram.com/partsch-tree"
        ],
        "priceRange": "€€",
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
                "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"
            ],
            "opens": "08:00",
            "closes": "18:00"
        },
        "serviceArea": {
            "@type": "GeoCircle",
            "geoMidpoint": {
                "@type": "GeoCoordinates",
                "latitude": 48.1351,
                "longitude": 11.5820
            },
            "geoRadius": "50000"
        },
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Tree Services",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Tree Removal"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Tree Maintenance"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Forest Management"
                    }
                }
            ]
        }
    };
    
    // Add the structured data to the script tag
    script.innerHTML = JSON.stringify(structuredData);
    
    // Add the script tag to the document head
    document.head.appendChild(script);
}