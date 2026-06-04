export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, firstname, lastname, company } = req.body;

  if (!email || !firstname) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const PORTAL_ID = '146086925';
  const FORM_ID = '0a0f646c-3a8d-4d02-a9fa-b2d42f2da289';

  try {
    const fields = [
      { name: 'firstname', value: firstname },
      { name: 'lastname', value: lastname || '' },
      { name: 'email', value: email },
      { name: 'company', value: company || '' }
    ];

    const response = await fetch(
      `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_ID}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields,
          context: { pageUri: 'https://digital-berg.com/framework.html', pageName: 'The Brazil Readiness Framework™' }
        })
      }
    );

    if (response.ok) {
      return res.status(200).json({ success: true });
    }

    const data = await response.json();
    throw new Error(data.message || 'HubSpot error');

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
