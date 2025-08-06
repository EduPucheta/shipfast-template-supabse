import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

export const metadata = getSEOTags({
  title: `Terms and Conditions | ${config.appName}`,
  canonicalUrlRelative: "/tos",
});

const TOS = () => {
  return (
    <main className="max-w-xl mx-auto">
      <div className="p-5">
        <Link href="/" className="btn btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"
              clipRule="evenodd"
            />
          </svg>
          Back
        </Link>
        <h1 className="text-3xl font-extrabold pb-6">
          Terms and Conditions for {config.appName}
        </h1>

        <pre
          className="leading-relaxed whitespace-pre-wrap"
          style={{ fontFamily: "sans-serif" }}
        >
          {`Last Updated: July 29, 2024

Welcome to Feedbackito!

These Terms of Service ("Terms") govern your use of the Feedbackito website at https://feedbackito.com ("Website") and the services provided by Feedbackito. By using our Website and services, you agree to these Terms.

1. Description of Feedbackito

Feedbackito is a feedback onsite recollection tool with AI analysis.

2. Ownership and Usage Rights

By subscribing to one of our plans, you are granted a non-exclusive, non-transferable license to access and use the services provided by Feedbackito. This license is for your internal business purposes only. You do not have the right to resell, lease, or sublicense the services.

3. User Data and Privacy

We collect and store user data, including your name, email, and payment information, as necessary to provide our services. For more details on how we handle your personal data, please refer to our Privacy Policy at https://feedbackito.com/privacy-policy.

4. Non-Personal Data Collection

We use web cookies to collect non-personal data to improve our services and your user experience.

5. Governing Law

These Terms are governed by and construed in accordance with the laws of Argentina.

6. Updates to the Terms

We may update these Terms from time to time. We will notify you of any changes by sending an email to the address you have provided.

For any questions or concerns regarding these Terms of Service, please contact us at edupucheta@gmail.com.

Thank you for using Feedbackito!`}
        </pre>
      </div>
    </main>
  );
};

export default TOS;
