import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowLeft, FileText, Shield, CheckCircle } from 'lucide-react';

export default function TermsAndPolicy() {
  const [activeTab, setActiveTab] = useState('terms');

  const navigate = useNavigate();

  // Add your markdown content here - it will be automatically parsed and displayed
  const termsContent = `
# Terms of Service

**Last Updated:** January 1, 2025

## 1. Acceptance of Terms

By accessing and using Opinara ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.

## 2. Description of Service

Opinara is a community-driven platform that allows users to:
- Report local issues and problems
- Vote on community concerns
- Participate in locality-based discussions (Waves)
- Access AI-generated summaries of community issues

## 3. User Accounts

### 3.1 Registration
- You must provide accurate and complete information
- You must be at least 13 years old to use this service
- One account per person
- You are responsible for maintaining account security

### 3.2 Verification
- All users must complete verification to prevent spam
- Fake accounts or impersonation is strictly prohibited
- We reserve the right to suspend unverified accounts

## 4. User Conduct

You agree NOT to:
- Post false, misleading, or defamatory content
- Harass, abuse, or harm other users
- Spam or post irrelevant content
- Violate any local, state, or national laws
- Attempt to manipulate voting systems
- Share personal information of others without consent

## 5. Content Policy

### 5.1 User-Generated Content
- You retain ownership of content you post
- You grant Opinara a license to display and distribute your content
- You are responsible for the content you post

### 5.2 Prohibited Content
- Hate speech or discriminatory content
- Explicit or inappropriate material
- Copyrighted material without permission
- Spam or commercial advertisements

## 6. Voting and Engagement

- One vote per user per post
- Vote manipulation is strictly prohibited
- AI summaries are generated based on aggregate data
- We reserve the right to remove fraudulent votes

## 7. Privacy and Data

- We collect and process data as outlined in our Privacy Policy
- Your locality information is used to organize Waves
- AI analysis is performed on aggregate, anonymized data
- We do not sell your personal information

## 8. Intellectual Property

- Opinara's name, logo, and design are our property
- User content belongs to respective users
- AI-generated summaries are owned by Opinara

## 9. Termination

We may suspend or terminate your account if:
- You violate these Terms of Service
- You engage in fraudulent activity
- You harm other users or the community
- Required by law

## 10. Disclaimers

- The platform is provided "as is" without warranties
- We are not responsible for user-generated content
- We do not guarantee issue resolution
- AI summaries may not be 100% accurate

## 11. Limitation of Liability

Opinara is not liable for:
- Indirect, incidental, or consequential damages
- Loss of data or profits
- Issues arising from platform usage
- Actions taken based on community reports

## 12. Changes to Terms

- We may update these terms at any time
- Continued use constitutes acceptance of new terms
- Major changes will be notified via email or platform notice

## 13. Governing Law

These terms are governed by the laws of India. Any disputes will be resolved in the courts of [Your Jurisdiction].

## 14. Contact Us

For questions about these Terms of Service:
- Email: legal@opinara.com
- Address: Opinara HQ, [Your Address]
- Support: support@opinara.com

---

**By using Opinara, you acknowledge that you have read, understood, and agree to these Terms of Service.**
`;

  const privacyContent = `
# Privacy Policy

**Last Updated:** January 1, 2025

## 1. Introduction

Welcome to Opinara. We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information.

## 2. Information We Collect

### 2.1 Information You Provide
- **Account Information:** Name, email address, password
- **Locality Information:** Your residential area or locality
- **Profile Information:** Optional profile picture and bio
- **Content:** Posts, comments, votes, and reports you create

### 2.2 Automatically Collected Information
- **Usage Data:** How you interact with the platform
- **Device Information:** Browser type, IP address, device type
- **Location Data:** Approximate location based on IP (not precise GPS)
- **Cookies:** Small data files for functionality and analytics

## 3. How We Use Your Information

We use your information to:
- **Provide Service:** Enable you to report issues and engage with your community
- **Organize Waves:** Group users by locality for relevant discussions
- **Generate AI Summaries:** Create insights from aggregate community data
- **Improve Platform:** Analyze usage patterns to enhance features
- **Communication:** Send important updates and notifications
- **Security:** Prevent fraud, spam, and abuse
- **Legal Compliance:** Meet legal and regulatory requirements

## 4. Data Sharing and Disclosure

### 4.1 What We Share
- **Public Content:** Your posts and votes are visible to your Wave community
- **Aggregate Data:** Anonymous, aggregated statistics for AI summaries
- **Service Providers:** Third-party services that help operate the platform

### 4.2 What We DON'T Share
- We **never sell** your personal information
- We don't share your email or contact details with other users
- We don't share your precise location
- We don't share private messages or personal data with advertisers

### 4.3 Legal Requirements
We may disclose information if:
- Required by law or legal process
- Necessary to protect rights and safety
- Preventing fraud or security threats

## 5. AI and Data Processing

### 5.1 AI Summaries
- Our AI analyzes posts and votes to generate Wave summaries
- This analysis uses **anonymized, aggregate data**
- Individual posts are not attributed to specific users in summaries
- AI models are trained on community trends, not personal data

### 5.2 Data Anonymization
- Personal identifiers are removed before AI processing
- Summaries reflect community consensus, not individual opinions
- You can opt-out of AI analysis in settings

## 6. Your Rights and Choices

You have the right to:
- **Access:** Request a copy of your data
- **Correction:** Update or correct your information
- **Deletion:** Request account and data deletion
- **Opt-Out:** Disable certain data collection features
- **Export:** Download your content and data
- **Portability:** Transfer your data to another service

### 6.1 How to Exercise Rights
- Visit Settings → Privacy → Data Management
- Email: privacy@opinara.com
- We respond to requests within 30 days

## 7. Data Security

We implement security measures including:
- Encryption of data in transit (HTTPS/TLS)
- Encrypted password storage
- Regular security audits
- Access controls and authentication
- Secure data centers

**However,** no system is 100% secure. Use strong passwords and enable two-factor authentication.

## 8. Data Retention

- **Active Accounts:** Data retained while account is active
- **Deleted Accounts:** Personal data deleted within 90 days
- **Legal Requirements:** Some data may be retained for legal compliance
- **Public Posts:** May remain visible in aggregate summaries

## 9. Children's Privacy

- Opinara is not intended for children under 13
- We do not knowingly collect data from children under 13
- If we learn a child under 13 has provided information, we delete it immediately
- Parents can contact us to request deletion

## 10. Cookies and Tracking

### 10.1 Types of Cookies
- **Essential Cookies:** Required for platform functionality
- **Analytics Cookies:** Help us understand usage patterns
- **Preference Cookies:** Remember your settings

### 10.2 Cookie Control
- You can disable cookies in browser settings
- Some features may not work without cookies
- We use Google Analytics (you can opt-out)

## 11. Third-Party Services

We use third-party services:
- **Authentication:** Google, Facebook login
- **Analytics:** Google Analytics
- **Hosting:** Cloud service providers
- **Email:** Email delivery services

Each has their own privacy policies. We recommend reviewing them.

## 12. International Data Transfers

- Your data may be stored and processed outside your country
- We ensure adequate protection measures
- By using Opinara, you consent to international transfers

## 13. Changes to Privacy Policy

- We may update this policy periodically
- Major changes will be notified via email
- Continued use means acceptance of changes
- Previous versions available upon request

## 14. Contact Us

For privacy concerns or questions:
- **Email:** privacy@opinara.com
- **Address:** Opinara HQ, [Your Address]
- **Data Protection Officer:** dpo@opinara.com

## 15. Your Consent

By using Opinara, you consent to:
- Collection and use of information as described
- AI processing of aggregate data
- Cookie usage as outlined
- Terms of this Privacy Policy

---

**We value your privacy and are committed to protecting your personal information. Thank you for trusting Opinara.**
`;

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center gap-2 text-gray-600 hover:text-[#007BFF] transition font-medium text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#007BFF] to-[#0056D2] rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-[#212529]">
                Opinara<span className="text-[#007BFF]">.</span>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('terms')}
              className={`py-4 px-2 border-b-2 font-semibold text-sm transition ${
                activeTab === 'terms'
                  ? 'border-[#007BFF] text-[#007BFF]'
                  : 'border-transparent text-gray-600 hover:text-[#007BFF]'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Terms of Service
              </div>
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`py-4 px-2 border-b-2 font-semibold text-sm transition ${
                activeTab === 'privacy'
                  ? 'border-[#007BFF] text-[#007BFF]'
                  : 'border-transparent text-gray-600 hover:text-[#007BFF]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Privacy Policy
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:p-12">
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown
              components={{
                h1: ({node, ...props}) => <h1 className="text-4xl font-bold text-[#212529] mb-6" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-[#212529] mt-8 mb-4" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-lg font-bold text-[#212529] mt-6 mb-3" {...props} />,
                p: ({node, ...props}) => <p className="text-gray-700 mb-4 leading-relaxed" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc ml-6 mb-4 space-y-2" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal ml-6 mb-4 space-y-2" {...props} />,
                li: ({node, ...props}) => <li className="text-gray-700" {...props} />,
                strong: ({node, ...props}) => <strong className="font-bold text-[#212529]" {...props} />,
                hr: ({node, ...props}) => <hr className="my-8 border-gray-300" {...props} />,
                a: ({node, ...props}) => <a className="text-[#007BFF] hover:text-[#0056D2] font-semibold" {...props} />,
              }}
            >
              {activeTab === 'terms' ? termsContent : privacyContent}
            </ReactMarkdown>
          </div>

          {/* Acceptance Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#007BFF] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[#212529] mb-2">
                    {activeTab === 'terms' ? 'You Agree to These Terms' : 'Your Privacy Matters'}
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {activeTab === 'terms' 
                      ? 'By using Opinara, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.'
                      : 'We are committed to protecting your privacy and ensuring your data is handled responsibly. If you have questions, please contact our privacy team.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm mb-2">
            Have questions about our {activeTab === 'terms' ? 'terms' : 'privacy policy'}?
          </p>
          <button className="text-[#007BFF] hover:text-[#0056D2] font-semibold text-sm transition">
            Contact Us →
          </button>
        </div>
      </div>
    </div>
  );
}