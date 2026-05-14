import { motion } from 'framer-motion';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-pink-50/30 rounded-[2.5rem] p-8 sm:p-12 border border-pink-100"
        >
          <h1 className="text-4xl sm:text-5xl font-bold font-display mb-8 text-gray-900">
            Terms & <span className="text-pink-500">Conditions</span>
          </h1>
          
          <div className="space-y-8 text-gray-600 text-sm sm:text-base leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider">1. Appointment Policy</h2>
              <p>
                By booking an appointment at PinkRoom Nails by Gissela, you agree to provide accurate personal information. All appointments are subject to availability and must be confirmed through our booking system or official communication channels.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider">2. Cancellation & Rescheduling</h2>
              <p>
                We value your time and ours. If you need to cancel or reschedule, please notify us at least 24 hours in advance. Failure to show up for an appointment without notice ("No-show") may result in restrictions on future bookings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider">3. Service Standards</h2>
              <p>
                We strive for excellence in every nail enhancement service. If you are dissatisfied with the quality of your service, please inform us within 48 hours so we can address your concerns. Please note that results may vary based on individual nail health and aftercare.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider">4. Health & Safety</h2>
              <p>
                For the safety of our clients and staff, please inform us of any allergies, skin conditions, or medical issues prior to your service. We reserve the right to refuse service if a condition presents a health risk to the client or staff.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider">5. Liability</h2>
              <p>
                PinkRoom Nails is not responsible for any damage to personal property or injury resulting from improper aftercare or failure to disclose relevant health information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider">6. Changes to Terms</h2>
              <p>
                We reserve the right to update these terms at any time. Your continued use of our services after such changes constitutes your acceptance of the new terms.
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
