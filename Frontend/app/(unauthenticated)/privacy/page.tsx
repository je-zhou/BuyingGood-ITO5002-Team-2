import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Buying Good",
  description: "Learn about how Buying Good collects, uses, and protects your personal information in accordance with Australian privacy laws.",
  openGraph: {
    title: "Privacy Policy - Buying Good",
    description: "Our commitment to protecting your privacy and personal information.",
  },
};

export default function PrivacyPage() {
  return (
    <div className="w-full flex flex-col min-h-screen">
      <div className="flex flex-col justify-center items-center py-20 px-4">
        <div className="max-w-4xl w-full">
          <div className="flex flex-col items-center gap-4 mb-12">
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
            <p className="text-gray-500 text-center">
              This Policy was last reviewed and updated on: 27 July 2025
            </p>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            <div>
              <p className="text-gray-700 leading-relaxed">
                BuyingGood values and respects the privacy of the people we deal with. BuyingGood is committed to
                protecting your privacy and complying with the Privacy Act 1988 (Cth) (Privacy Act) and other applicable
                privacy laws and regulations.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                This Privacy Policy (Policy) describes how we collect, hold, use and disclose your personal information, and
                how we maintain the quality and security of your personal information.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">What is personal information?</h2>
              <p className="text-gray-700 leading-relaxed">
                &ldquo;Personal information&rdquo; means any information or opinion, whether true or not, and whether recorded in a
                material form or not, about an identified individual or an individual who is reasonably identifiable. In general
                terms, this includes information or an opinion that personally identifies you either directly (e.g. your name) or
                indirectly.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">What personal information do we collect?</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                The personal information we collect about you depends on the nature of your dealings with us or what you
                choose to share with us.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                The personal information we collect about you may include:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>name;</li>
                <li>mailing or street address;</li>
                <li>email address;</li>
                <li>phone number.</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                Under certain circumstances, BuyingGood may need to collect sensitive information about you. This might
                include any information or opinion about your racial or ethnic origin, political opinions, political association,
                religious or philosophical beliefs, membership of a trade union or other professional body, sexual preferences,
                criminal record, or health information.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                If we collect your sensitive information, we will do so only with your consent, if it is necessary to prevent a
                serious and imminent threat to life or health, or as otherwise required or authorised by law, and we take
                appropriate measures to protect the security of this information.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                You do not have to provide us with your personal information. Where possible, we will give you the option to
                interact with us anonymously or by using a pseudonym. However, if you choose to deal with us in this way or
                choose not to provide us with your personal information, we may not be able to provide you with our services or
                otherwise interact with you.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">How do we collect your personal information?</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We collect your personal information directly from you when you:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>interact with us over the phone;</li>
                <li>interact with us in person;</li>
                <li>interact with us online;</li>
                <li>participate in surveys or questionnaires;</li>
                <li>attend a BuyingGood event;</li>
                <li>subscribe to our mailing list;</li>
                <li>apply for a position with us as an employee, contractor or volunteer.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Collecting personal information from third parties</h3>
              <p className="text-gray-700 leading-relaxed">
                We may also collect your personal information from third parties or through publicly available sources, for
                example from Clerk and Resend. We are using Clerk to handle our farmer login and authentication, so they will have access to Farmer emails and names. Resend is used to handle contact form submissions. Buyers wishing to contact Farmers will have their emails and query contents shared, but not stored, with Resend to fulfil the feature functionality.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">How do we use your personal information?</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use personal information for many purposes in connection with our functions and activities, including the
                following purposes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>provide you with information or services that you request from us;</li>
                <li>deliver to you a more personalised experience and service offering;</li>
                <li>improve the quality of the services we offer;</li>
                <li>internal administrative purposes;</li>
                <li>marketing and research purposes.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Disclosure of personal information to third parties</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may disclose your personal information to third parties in accordance with this Policy in circumstances
                where you would reasonably expect us to disclose your information. For example, we may disclose your
                personal information to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>our third party service providers (for example, our IT providers);</li>
                <li>our marketing providers;</li>
                <li>our professional services advisors.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Transfer of personal information overseas</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Some of the third-party service providers we disclose personal information to may be based in or have servers
                located outside of Australia, including in the USA.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Where we disclose your personal information to third parties overseas, we will take reasonable steps to ensure
                that data security and appropriate privacy practices are maintained. We will only disclose to overseas third
                parties if:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>you have given us your consent to disclose personal information to that third party; or</li>
                <li>we reasonably believe that:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>the overseas recipient is subject to a law or binding scheme that is, overall, substantially similar to the APPs; and</li>
                    <li>the law or binding scheme can be enforced; or</li>
                  </ul>
                </li>
                <li>the disclosure is required or authorised by an Australian law or court / tribunal order.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">How do we protect your personal information?</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                BuyingGood will take reasonable steps to ensure that the personal information that we hold about you is kept
                confidential and secure, including by:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>having a robust physical security of our premises and databases / records;</li>
                <li>taking measures to restrict access to only personnel who need that personal information to effectively provide services to you;</li>
                <li>having technological measures in place (for example, anti-virus software, fire walls).</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Online activity</h2>
              
              <h3 className="text-xl font-semibold mb-4">Cookies</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                The BuyingGood website uses cookies. A cookie is a small file of letters and numbers the website puts on
                your device if you allow it. These cookies recognise when your device has visited our website(s) before, so we
                can distinguish you from other users of the website. This improves your experience and the BuyingGood
                website(s).
              </p>
              <p className="text-gray-700 leading-relaxed">
                We do not use cookies to identify you, just to improve your experience on our website(s). If you do not wish to
                use the cookies, you can amend the settings on your internet browser so it will not automatically download
                cookies. However, if you remove or block cookies on your computer, please be aware that your browsing
                experience and our website&rsquo;s functionality may be affected.
              </p>

              <h3 className="text-xl font-semibold mb-4 mt-6">Website analytics</h3>
              <p className="text-gray-700 leading-relaxed">
                Our website may use third party data analytics services to help us better understand visitor traffic, so we can
                improve our services. Although this data is mostly anonymous, it is possible that under certain circumstances,
                we may connect it to you.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Direct marketing</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may send you direct marketing communications and information about our services, opportunities, or events
                that we consider may be of interest to you if you have requested or consented to receive such communications.
                These communications may be sent in various forms, including mail, SMS, fax and email, in accordance with
                applicable marketing laws, such as the Australian Spam Act 2003 (Cth). You consent to us sending you those
                direct marketing communications by any of those methods. If you indicate a preference for a method of
                communication, we will endeavour to use that method whenever practical to do so.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                You may opt-out of receiving marketing communications from us at any time by following the instructions to
                &ldquo;unsubscribe&rdquo; set out in the relevant communication or contacting us using the details set out in the &ldquo;How to
                contact us&rdquo; section below.
              </p>
              <p className="text-gray-700 leading-relaxed">
                In addition, we may also use your personal information or disclose your personal information to third parties for the purposes of advertising, including online behavioural advertising, website personalisation, and to provide targeted or retargeted advertising content to you (including through third party websites).
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Retention of personal information</h2>
              <p className="text-gray-700 leading-relaxed">
                We will not keep your personal information for longer than we need to. In most cases, this means that we will
                only retain your personal information for the duration of your relationship with us unless we are required to
                retain your personal information to comply with applicable laws, for example record-keeping obligations.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">How to access and correct your personal information</h2>
              <p className="text-gray-700 leading-relaxed">
                BuyingGood will endeavour to keep your personal information accurate, complete and up to date.
                If you wish to make a request to access and / or correct the personal information we hold about you, you should
                make a request by contacting us and we will usually respond within 14 days.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Links to third party sites</h2>
              <p className="text-gray-700 leading-relaxed">
                BuyingGood website(s) may contain links to websites operated by third parties. If you access a third party
                website through our website(s), personal information may be collected by that third party website. We make no
                representations or warranties in relation to the privacy practices of any third party provider or website and we
                are not responsible for the privacy policies or the content of any third party provider or website. Third party
                providers / websites are responsible for informing you about their own privacy practices and we encourage you
                to read their privacy policies.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Inquiries and complaints</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                For complaints about how BuyingGood handles, processes or manages your personal information, please
                contact info@buyinggood.com.au. Note we may require proof of your identity and full details of your request
                before we can process your complaint.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Please allow up to 14 days for BuyingGood to respond to your complaint. It will not always be possible to
                resolve a complaint to everyone&rsquo;s satisfaction. If you are not satisfied with BuyingGood&rsquo;s response to a
                complaint, you have the right to contact the Office of Australian Information Commissioner (at
                www.oaic.gov.au/) to lodge a complaint.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">How to contact us</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have a question or concern in relation to our handling of your personal information or this Policy, you can
                contact us for assistance as follows:
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Email</h3>
                  <p className="text-gray-700">info@buyinggood.com.au</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold">Post</h3>
                  <p className="text-gray-700">
                    Attention: BuyingGood Privacy Officer<br />
                    Address: 1 Brisbane street, Brisbane QLD 4000
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}