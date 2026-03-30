import { Metadata } from 'next';
import Link from 'next/link';
import { FileText, AlertCircle, Scale, UserX, DollarSign, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service | Chiva TutorHub',
  description: 'Read the terms and conditions for using Chiva TutorHub educational services and resources. Understand your rights and responsibilities.',
  alternates: {
    canonical: 'https://chivatutorhub.com/terms',
  },
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-6">
              <Scale className="h-8 w-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
            <p className="text-xl text-blue-100">
              Please read these terms carefully before using our services
            </p>
            <p className="text-sm text-blue-200 mt-4">
              Last Updated: March 30, 2026
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
            {/* Introduction */}
            <section className="mb-12">
              <p className="text-lg text-gray-700 leading-relaxed">
                Welcome to Chiva TutorHub. These Terms of Service (&quot;Terms&quot;) govern your access to and use of our website, services, and educational resources. By accessing or using our services, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our services.
              </p>
            </section>

            {/* Acceptance of Terms */}
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">1. Acceptance of Terms</h2>
              </div>

              <div className="ml-14 space-y-4">
                <p className="text-gray-700">
                  By creating an account, accessing our website, or using any of our services, you acknowledge that you have read, understood, and agree to be bound by these Terms, as well as our Privacy Policy. These Terms apply to all users, including students, parents, and visitors.
                </p>
                <p className="text-gray-700">
                  If you are under 18 years of age, you must have permission from a parent or legal guardian to use our services.
                </p>
              </div>
            </section>

            {/* Services Description */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Services</h2>
              <div className="ml-14 space-y-4">
                <p className="text-gray-700">Chiva TutorHub provides:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Online tutoring services in Chemistry, Mathematics, Business Studies, and Accounting</li>
                  <li>Educational resources, study materials, and downloadable content</li>
                  <li>Blog articles and learning guides</li>
                  <li>Both free and paid educational materials</li>
                  <li>Communication channels for inquiries and support</li>
                </ul>
                <p className="text-gray-700">
                  We reserve the right to modify, suspend, or discontinue any aspect of our services at any time without prior notice.
                </p>
              </div>
            </section>

            {/* User Accounts */}
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <UserX className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">3. User Accounts and Registration</h2>
              </div>

              <div className="ml-14 space-y-4">
                <p className="text-gray-700">When creating an account, you agree to:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and promptly update your account information</li>
                  <li>Keep your password secure and confidential</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                </ul>
                <p className="text-gray-700">
                  We reserve the right to suspend or terminate accounts that violate these Terms or engage in fraudulent, abusive, or illegal activities.
                </p>
              </div>
            </section>

            {/* User Conduct */}
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">4. Acceptable Use and Conduct</h2>
              </div>

              <div className="ml-14 space-y-4">
                <p className="text-gray-700">You agree NOT to:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Use our services for any unlawful purpose or in violation of any applicable laws</li>
                  <li>Impersonate any person or entity or misrepresent your affiliation</li>
                  <li>Harass, threaten, or harm other users or our staff</li>
                  <li>Upload or transmit viruses, malware, or any harmful code</li>
                  <li>Attempt to gain unauthorized access to our systems or networks</li>
                  <li>Scrape, copy, or redistribute our content without permission</li>
                  <li>Share, resell, or distribute purchased resources to third parties</li>
                  <li>Use automated systems or bots to access our services</li>
                  <li>Interfere with or disrupt the integrity of our services</li>
                  <li>Engage in any activity that could damage our reputation</li>
                </ul>
              </div>
            </section>

            {/* Intellectual Property */}
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">5. Intellectual Property Rights</h2>
              </div>

              <div className="ml-14 space-y-4">
                <p className="text-gray-700">
                  All content on Chiva TutorHub, including but not limited to text, graphics, logos, images, videos, audio clips, digital downloads, and software, is the property of Chiva TutorHub or its content suppliers and is protected by international copyright, trademark, and other intellectual property laws.
                </p>
                <p className="text-gray-700">
                  <strong>License for Personal Use:</strong> We grant you a limited, non-exclusive, non-transferable license to access and use our educational resources for personal, non-commercial educational purposes only.
                </p>
                <p className="text-gray-700">
                  <strong>Restrictions:</strong> You may not reproduce, distribute, modify, create derivative works, publicly display, or commercially exploit any of our content without our express written permission.
                </p>
              </div>
            </section>

            {/* Payments and Refunds */}
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">6. Payments, Pricing, and Refunds</h2>
              </div>

              <div className="ml-14 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Pricing</h3>
                  <p className="text-gray-700">
                    Prices for our services and resources are displayed in US Dollars (USD) or Kenyan Shillings (KES) and are subject to change without notice. We reserve the right to modify pricing at any time.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Payment Processing</h3>
                  <p className="text-gray-700">
                    Payments are processed through secure third-party payment processors. By making a purchase, you agree to provide accurate payment information and authorize us to charge the specified amount.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Refund Policy</h3>
                  <p className="text-gray-700 mb-2">
                    Due to the digital nature of our products, all sales are generally final. However, we may offer refunds in the following circumstances:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li>Technical issues preventing access to purchased content</li>
                    <li>Duplicate purchases made in error</li>
                    <li>Content significantly different from description</li>
                  </ul>
                  <p className="text-gray-700 mt-3">
                    Refund requests must be submitted within 7 days of purchase. Contact us at chivatutorhub@gmail.com to request a refund.
                  </p>
                </div>
              </div>
            </section>

            {/* Educational Resources */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Educational Resources and Downloads</h2>
              <div className="ml-14 space-y-4">
                <p className="text-gray-700">
                  When you purchase or download educational resources from our platform:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>You receive a personal, non-transferable license to use the materials</li>
                  <li>You may not share, redistribute, or resell the materials</li>
                  <li>You may not modify or create derivative works without permission</li>
                  <li>Downloaded materials are for your personal educational use only</li>
                  <li>We retain all ownership rights to the materials</li>
                </ul>
              </div>
            </section>

            {/* Disclaimers */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Disclaimers and Warranties</h2>
              <div className="ml-14 space-y-4">
                <p className="text-gray-700">
                  <strong>Educational Results:</strong> While we strive to provide high-quality educational services, we do not guarantee specific academic outcomes or improvements. Student success depends on various factors including effort, prior knowledge, and individual circumstances.
                </p>
                <p className="text-gray-700">
                  <strong>Service Availability:</strong> Our services are provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, either express or implied. We do not guarantee uninterrupted, timely, secure, or error-free service.
                </p>
                <p className="text-gray-700">
                  <strong>Content Accuracy:</strong> While we make reasonable efforts to ensure accuracy, we do not warrant that our educational content is complete, accurate, or up-to-date. Always verify information from multiple sources.
                </p>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
              <div className="ml-14 space-y-4">
                <p className="text-gray-700">
                  To the fullest extent permitted by law, Chiva TutorHub, its owners, employees, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or other intangible losses resulting from:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Your use or inability to use our services</li>
                  <li>Unauthorized access to your account or data</li>
                  <li>Errors or omissions in our content</li>
                  <li>Any conduct or content of third parties</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  Our total liability shall not exceed the amount you paid to us in the six months preceding the claim.
                </p>
              </div>
            </section>

            {/* Indemnification */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Indemnification</h2>
              <p className="text-gray-700">
                You agree to indemnify, defend, and hold harmless Chiva TutorHub and its affiliates from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of our services, violation of these Terms, or infringement of any third-party rights.
              </p>
            </section>

            {/* Third-Party Links */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Third-Party Links and Services</h2>
              <p className="text-gray-700">
                Our website may contain links to third-party websites or services. We are not responsible for the content, privacy policies, or practices of these third parties. Your use of third-party services is at your own risk.
              </p>
            </section>

            {/* Termination */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Termination</h2>
              <div className="ml-14 space-y-4">
                <p className="text-gray-700">
                  We reserve the right to suspend or terminate your access to our services at any time, with or without cause, with or without notice, for any reason including:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Violation of these Terms</li>
                  <li>Fraudulent or illegal activity</li>
                  <li>Abuse of our services or staff</li>
                  <li>Non-payment for services</li>
                </ul>
                <p className="text-gray-700">
                  Upon termination, your right to use our services will immediately cease. You may also terminate your account at any time by contacting us.
                </p>
              </div>
            </section>

            {/* Governing Law */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Governing Law and Dispute Resolution</h2>
              <div className="ml-14 space-y-4">
                <p className="text-gray-700">
                  These Terms shall be governed by and construed in accordance with the laws of Kenya, without regard to its conflict of law provisions.
                </p>
                <p className="text-gray-700">
                  Any disputes arising from these Terms or your use of our services shall be resolved through good faith negotiations. If negotiations fail, disputes shall be submitted to the competent courts of Kenya.
                </p>
              </div>
            </section>

            {/* Changes to Terms */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Changes to Terms of Service</h2>
              <p className="text-gray-700">
                We reserve the right to modify these Terms at any time. We will notify users of material changes by posting the updated Terms on our website and updating the &quot;Last Updated&quot; date. Your continued use of our services after changes constitutes acceptance of the modified Terms.
              </p>
            </section>

            {/* Severability */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Severability</h2>
              <p className="text-gray-700">
                If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
              </p>
            </section>

            {/* Entire Agreement */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">16. Entire Agreement</h2>
              <p className="text-gray-700">
                These Terms, together with our Privacy Policy, constitute the entire agreement between you and Chiva TutorHub regarding the use of our services and supersede all prior agreements and understandings.
              </p>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">17. Contact Information</h2>
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Chiva TutorHub</strong></p>
                  <p>Email: <a href="mailto:chivatutorhub@gmail.com" className="text-blue-600 hover:underline">chivatutorhub@gmail.com</a></p>
                  <p>Phone: <a href="tel:+254746930093" className="text-blue-600 hover:underline">+254 746 930 093</a></p>
                </div>
              </div>
            </section>

            {/* Footer Navigation */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
                  ← Back to Home
                </Link>
                <span className="text-gray-300">|</span>
                <Link href="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
                  Privacy Policy
                </Link>
                <span className="text-gray-300">|</span>
                <Link href="/contact" className="text-blue-600 hover:text-blue-700 font-medium">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
