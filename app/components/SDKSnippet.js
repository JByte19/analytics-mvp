'use client';
export default function SDKSnippet() {
  const sdkCode = `<!-- Analytics Tracking -->
<script>
(function() {
  const API_URL = '${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/api/track';
  
  function getUserId() {
    let userId = localStorage.getItem('__analytics_user_id');
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('__analytics_user_id', userId);
    }
    return userId;
  }

  window.analytics = {
    track: async function(eventName, properties = {}) {
      try {
        const payload = {
          eventName: eventName,
          userId: getUserId(),
          properties: properties
        };

        await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      } catch (error) {
        console.error('Analytics error:', error);
      }
    },

    pageView: function() {
      this.track('page_view', {
        title: document.title,
        url: window.location.href,
        referrer: document.referrer
      });
    }
  };

  window.analytics.pageView();

  const originalPushState = window.history.pushState;
  window.history.pushState = function() {
    originalPushState.apply(this, arguments);
    window.analytics.pageView();
  };
})();
</script>`;

  return (
    <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
      <h2>📋 SDK Installation</h2>
      <p>Add this snippet to your website (in the &lt;head&gt; or &lt;body&gt; tag):</p>
      <pre style={{
        backgroundColor: '#2d2d2d',
        color: '#f8f8f2',
        padding: '16px',
        borderRadius: '4px',
        overflowX: 'auto',
        fontSize: '11px',
        lineHeight: '1.4',
        maxHeight: '300px',
        overflowY: 'auto'
      }}>
        {sdkCode}
      </pre>

      <button 
        onClick={() => navigator.clipboard.writeText(sdkCode)}
        style={{
          marginTop: '12px',
          padding: '10px 20px',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        📋 Copy to Clipboard
      </button>

      <h3 style={{ marginTop: '20px' }}>Usage Examples</h3>
      <pre style={{
        backgroundColor: '#f0f0f0',
        padding: '12px',
        borderRadius: '4px',
        fontSize: '11px'
      }}>
{`// Page view (automatic on page load)
// No need to call this manually

// Track button clicks
document.getElementById('myButton').addEventListener('click', () => {
  analytics.track('button_clicked', { 
    buttonId: 'myButton'
  });
});

// Track form submissions
document.getElementById('myForm').addEventListener('submit', () => {
  analytics.track('form_submitted', {
    formName: 'contact_form'
  });
});

// Track custom events
analytics.track('video_played', {
  videoId: 'abc123',
  duration: 120
});`}
      </pre>
    </div>
  );
}
