// Simple Organization Schema for SEO
export default function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Chiva TutorHub",
    "url": "https://chivatutorhub.com",
    "logo": "https://chivatutorhub.com/logo.png",
    "description": "Professional tutoring services in Chemistry, Mathematics, Business Studies, and Accounting in Kenya.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "KE"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "email": "info@chivatutorhub.com"
    },
    "sameAs": [
      "https://facebook.com/chivatutorhub",
      "https://instagram.com/chivatutorhub"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
