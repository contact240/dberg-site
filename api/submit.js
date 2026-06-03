export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, firstname, lastname, company } = req.body;

  if (!email || !firstname) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const response = await fetch(
      `https://api.hubapi.com/contacts/v1/contact/createOrUpdate/email/${encodeURIComponent(email)}/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.HUBSPOT_TOKEN}`
        },
        body: JSON.stringify({
          properties: [
            { property: 'email', value: email },
            { property: 'firstname', value: firstname },
            { property: 'lastname', value: lastname || '' },
            { property: 'company', value: company || '' },
            { property: 'hs_lead_status', value: 'NEW' },
            { property: 'lead_source_detail', value: 'Brazil Readiness Framework LP' }
          ]
        })
      }
    );

    if (response.ok || response.status === 409) {
      return res.status(200).json({ success: true });
    }

    const data = await response.json();
    throw new Error(data.message || 'HubSpot error');

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

