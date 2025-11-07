/**
 * OAuth2 Callback Route (Temporary)
 */

import express from 'express';

const router = express.Router();

// OAuth2 callback route
router.get('/callback', (req, res) => {
  const { code, error } = req.query;

  if (error) {
    return res.status(400).send(`
      <h1>❌ Authorization Failed</h1>
      <p>Error: ${error}</p>
      <p>Please try again.</p>
    `);
  }

  if (code) {
    return res.send(`
      <h1>✅ Authorization Successful!</h1>
      <h2>Your Authorization Code:</h2>
      <div style="background: #f0f0f0; padding: 10px; font-family: monospace; word-break: break-all;">
        ${code}
      </div>
      <br>
      <p><strong>Next steps:</strong></p>
      <ol>
        <li>Copy the authorization code above</li>
        <li>Go back to your terminal</li>
        <li>Run: <code>node exchange-token.js ${code}</code></li>
      </ol>
      <p>You can close this window now.</p>
    `);
  }

  res.status(400).send('<h1>❌ No authorization code received</h1>');
});

export default router;