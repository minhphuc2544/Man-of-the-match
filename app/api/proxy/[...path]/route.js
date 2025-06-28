export async function POST(req, { params }) {
  const path = params.path.join('/');
  const backendURL = `http://34.204.8.214:8080/api/${path}`;

  const body = await req.text();

  const response = await fetch(backendURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });

  const text = await response.text();
  return new Response(text, {
    status: response.status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function GET(req, { params }) {
  const path = params.path.join('/');
  const backendURL = `http://34.204.8.214:8080/api/${path}`;

  const response = await fetch(backendURL, {
    method: 'GET',
    headers: req.headers,
  });

  const data = await response.text();
  return new Response(data, {
    status: response.status,
    headers: response.headers,
  });
}
