import Link from "next/link"

export default function LegalPage() {
  return (
    <div className="container max-w-4xl mx-auto p-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Legal Information</h1>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold mb-4">Terms of Service</h2>
          <div className="prose max-w-none">
            <p>
              By using the AI Doctor application ("Service"), you agree to be bound by these Terms of Service ("Terms").
              Please read these Terms carefully before using the Service.
            </p>

            <h3>1. Medical Disclaimer</h3>
            <p>
              The Service provides general health information and is not a substitute for professional medical advice,
              diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with
              any questions you may have regarding a medical condition.
            </p>

            <h3>2. User Accounts</h3>
            <p>
              You are responsible for safeguarding your account and for all activities that occur under your account.
              You must immediately notify us of any unauthorized use of your account.
            </p>

            <h3>3. User Content</h3>
            <p>
              You retain all rights to any information you submit to the Service. By submitting information, you grant
              us a worldwide, non-exclusive, royalty-free license to use, store, and process that information for the
              purpose of providing the Service.
            </p>

            <h3>4. Limitation of Liability</h3>
            <p>
              To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or
              indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of the
              Service.
            </p>

            <h3>5. Changes to Terms</h3>
            <p>
              We reserve the right to modify these Terms at any time. We will provide notice of significant changes by
              posting the new Terms on the Service and updating the "Last Updated" date.
            </p>

            <p>Last Updated: May 7, 2023</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Privacy Policy</h2>
          <div className="prose max-w-none">
            <p>
              This Privacy Policy describes how we collect, use, and disclose your information when you use our Service.
            </p>

            <h3>1. Information We Collect</h3>
            <p>
              We collect information you provide directly to us, including account information, medical profile data,
              and the content of your conversations with the AI doctor.
            </p>

            <h3>2. How We Use Your Information</h3>
            <p>We use your information to:</p>
            <ul>
              <li>Provide, maintain, and improve the Service</li>
              <li>Personalize your experience</li>
              <li>Communicate with you about the Service</li>
              <li>Monitor and analyze usage patterns</li>
              <li>Protect against, identify, and prevent fraud and other illegal activity</li>
            </ul>

            <h3>3. Data Security</h3>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information. All
              medical data is encrypted at rest and in transit.
            </p>

            <h3>4. Data Retention</h3>
            <p>
              We retain your information for as long as necessary to provide the Service and fulfill the purposes
              outlined in this Privacy Policy. You can request deletion of your data at any time.
            </p>

            <h3>5. Your Rights</h3>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul>
              <li>Access to your personal information</li>
              <li>Correction of inaccurate information</li>
              <li>Deletion of your information</li>
              <li>Restriction of processing</li>
              <li>Data portability</li>
            </ul>

            <h3>6. HIPAA Compliance</h3>
            <p>
              For users in the United States, we comply with the Health Insurance Portability and Accountability Act
              (HIPAA) regarding the collection, use, and disclosure of protected health information.
            </p>

            <h3>7. GDPR Compliance</h3>
            <p>
              For users in the European Union, we comply with the General Data Protection Regulation (GDPR) regarding
              the collection, use, and disclosure of personal data.
            </p>

            <p>Last Updated: May 7, 2023</p>
          </div>
        </section>
      </div>

      <div className="mt-8 text-center">
        <Link href="/" className="text-blue-600 hover:underline">
          Return to Home
        </Link>
      </div>
    </div>
  )
}
