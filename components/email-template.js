import * as React from 'react';

export const EmailTemplate = ({
  firstName,
}) => (
  <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
      <h1 style={{ color: '#1a1a1a', fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>
        Welcome to Feedbackr, {firstName}! 🎉
      </h1>
      <p style={{ color: '#4a4a4a', fontSize: '16px', lineHeight: '1.5' }}>
        We&apos;re excited to have you on board and can&apos;t wait to help you gather valuable insights through surveys.
      </p>
    </div>

    <div style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', padding: '25px', marginBottom: '30px' }}>
      <h2 style={{ color: '#1a1a1a', fontSize: '18px', fontWeight: '600', marginBottom: '15px' }}>
        Getting Started
      </h2>
      <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
        <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start' }}>
          <span style={{ color: '#4a4a4a', marginRight: '10px' }}>1.</span>
          <span style={{ color: '#4a4a4a' }}>Create your first survey by clicking the &quot;New Survey&quot; button</span>
        </li>
        <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start' }}>
          <span style={{ color: '#4a4a4a', marginRight: '10px' }}>2.</span>
          <span style={{ color: '#4a4a4a' }}>Customize your survey with themes and questions</span>
        </li>
        <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start' }}>
          <span style={{ color: '#4a4a4a', marginRight: '10px' }}>3.</span>
          <span style={{ color: '#4a4a4a' }}>Share your survey link with your audience</span>
        </li>
      </ul>
    </div>

    <div style={{ marginBottom: '30px' }}>
      <h2 style={{ color: '#1a1a1a', fontSize: '18px', fontWeight: '600', marginBottom: '15px' }}>
        Need Help?
      </h2>
      <p style={{ color: '#4a4a4a', fontSize: '16px', lineHeight: '1.5' }}>
        Our support team is here to help you succeed. If you have any questions or need assistance, don&apos;t hesitate to reach out.
      </p>
    </div>

    <div style={{ textAlign: 'center', padding: '20px 0', borderTop: '1px solid #eaeaea' }}>
      <p style={{ color: '#666666', fontSize: '14px', marginBottom: '10px' }}>
        Best regards,<br />
        The Feedbackr Team
      </p>
      <p style={{ color: '#999999', fontSize: '12px' }}>
        © {new Date().getFullYear()} Feedbackr. All rights reserved.
      </p>
    </div>
  </div>
);