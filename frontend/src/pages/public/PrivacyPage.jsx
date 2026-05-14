import { motion } from 'framer-motion';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-pink-50/30 rounded-[2.5rem] p-8 sm:p-12 border border-pink-100"
        >
          <h1 className="text-4xl sm:text-5xl font-bold font-display mb-8 text-gray-900">
            Privacy <span className="text-pink-500">Policy</span>
          </h1>
          
          <div className="space-y-8 text-gray-600 text-sm sm:text-base leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider">1. Information We Collect</h2>
              <p>
                When you book an appointment with PinkRoom, we collect basic personal information including your name, phone number, and email address. This information is necessary to manage your reservation and provide quality service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider">2. How We Use Your Data</h2>
              <p>
                Your data is used exclusively for:
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-2">
                <li>Booking and confirming your appointments.</li>
                <li>Sending reminders via SMS, WhatsApp, or Email.</li>
                <li>Contacting you regarding changes to your schedule.</li>
                <li>Personalizing your experience at PinkRoom.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider">3. Data Security</h2>
              <p>
                We implement industry-standard security measures to protect your personal information. Your data is stored on secure servers and is only accessible by authorized staff.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider">4. Third-Party Sharing</h2>
              <p>
                PinkRoom does not sell, trade, or otherwise transfer your personal information to outside parties. Your privacy is our priority.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider">5. Your Rights</h2>
              <p>
                You have the right to access, update, or request the deletion of your personal data at any time. To exercise these rights, please contact us directly via WhatsApp or Email.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider">6. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please reach out to us through our official communication channels provided on this website.
              </p>
            </section>
          </div>
          
          <div className="mt-12 pt-8 border-t border-pink-100 text-center">
            <p className="text-xs text-gray-400">Last updated: May 2024 • PinkRoom Nails by Gissela • USA CT</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
