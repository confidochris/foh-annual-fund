import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface DonationData {
  firstName: string;
  lastName: string;
  email: string;
  amount: number;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  phone?: string;
}

const ETAPESTRY_BASE_URL = "https://sna.etapestry.com/v3messaging/service";

class ETapestryClient {
  private endpoint: string;
  private databaseId: string;
  private apiKey: string;

  constructor(databaseId: string, apiKey: string) {
    this.endpoint = ETAPESTRY_BASE_URL;
    this.databaseId = databaseId;
    this.apiKey = apiKey;
  }

  private async makeSOAPRequest(method: string, params: any): Promise<any> {
    const soapEnvelope = this.buildSOAPEnvelope(method, params);
    
    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
        "SOAPAction": `""`
      },
      body: soapEnvelope
    });

    const responseText = await response.text();
    console.log(`SOAP Response for ${method}:`, responseText);

    if (!response.ok) {
      throw new Error(`SOAP request failed: ${response.status} - ${responseText}`);
    }

    return this.parseSOAPResponse(responseText);
  }

  private buildSOAPEnvelope(method: string, params: any): string {
    const paramsXML = Object.entries(params)
      .map(([key, value]) => `<${key}>${this.escapeXML(String(value))}</${key}>`)
      .join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.etapestry.com">
  <soapenv:Header/>
  <soapenv:Body>
    <ser:${method}>
      ${paramsXML}
    </ser:${method}>
  </soapenv:Body>
</soapenv:Envelope>`;
  }

  private escapeXML(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  private parseSOAPResponse(xml: string): any {
    const match = xml.match(/<return>(.*?)<\/return>/s);
    if (match) {
      return match[1];
    }
    return xml;
  }

  async login(): Promise<void> {
    console.log('Logging in to eTapestry...');
    const newEndpoint = await this.makeSOAPRequest('apiKeyLogin', {
      databaseId: this.databaseId,
      apiKey: this.apiKey
    });

    if (newEndpoint && newEndpoint.trim() !== '') {
      console.log('Redirecting to new endpoint:', newEndpoint);
      this.endpoint = newEndpoint;
      await this.makeSOAPRequest('apiKeyLogin', {
        databaseId: this.databaseId,
        apiKey: this.apiKey
      });
    }
    console.log('Login successful');
  }

  async findAccountByEmail(email: string): Promise<any> {
    console.log('Searching for account with email:', email);
    try {
      const result = await this.makeSOAPRequest('getAccountByEmail', {
        email: email
      });
      return result;
    } catch (error) {
      console.log('Account not found or error:', error);
      return null;
    }
  }

  async createAccount(data: DonationData): Promise<string> {
    console.log('Creating new account for:', data.email);
    
    const accountXML = `
      <account>
        <accountType>Individual</accountType>
        <firstName>${this.escapeXML(data.firstName)}</firstName>
        <lastName>${this.escapeXML(data.lastName)}</lastName>
        <email>${this.escapeXML(data.email)}</email>
        ${data.phone ? `<phoneNumber>${this.escapeXML(data.phone)}</phoneNumber>` : ''}
        ${data.address ? `<address>${this.escapeXML(data.address)}</address>` : ''}
        ${data.city ? `<city>${this.escapeXML(data.city)}</city>` : ''}
        ${data.state ? `<state>${this.escapeXML(data.state)}</state>` : ''}
        ${data.postalCode ? `<postalCode>${this.escapeXML(data.postalCode)}</postalCode>` : ''}
      </account>
    `;

    const result = await this.makeSOAPRequest('createAccount', {
      account: accountXML
    });
    
    console.log('Account created successfully');
    return result;
  }

  async createGift(accountRef: string, amount: number, date: string): Promise<void> {
    console.log('Creating gift for account:', accountRef);
    
    const giftXML = `
      <gift>
        <accountRef>${this.escapeXML(accountRef)}</accountRef>
        <date>${date}</date>
        <amount>${amount}</amount>
        <fund>Fund - Research</fund>
        <note>Online donation via website</note>
        <receiptType>Gift</receiptType>
      </gift>
    `;

    await this.makeSOAPRequest('setAccountGift', {
      gift: giftXML
    });
    
    console.log('Gift created successfully');
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const databaseId = Deno.env.get('ETAPESTRY_DATABASE_ID');
    const apiKey = Deno.env.get('ETAPESTRY_API_KEY');

    if (!databaseId || !apiKey) {
      throw new Error('eTapestry credentials not configured');
    }

    const donationData: DonationData = await req.json();
    console.log('Processing donation for eTapestry sync:', donationData);

    const client = new ETapestryClient(databaseId, apiKey);
    
    await client.login();

    let accountRef = await client.findAccountByEmail(donationData.email);
    
    if (!accountRef) {
      accountRef = await client.createAccount(donationData);
    } else {
      console.log('Using existing account:', accountRef);
    }

    const today = new Date().toISOString().split('T')[0];
    await client.createGift(accountRef, donationData.amount, today);

    return new Response(
      JSON.stringify({ success: true, message: 'Donation synced to eTapestry' }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('eTapestry sync error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        details: error.toString()
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
