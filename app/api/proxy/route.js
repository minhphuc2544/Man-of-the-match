export async function GET(req, { params }) {
  const path = params.path.join("/"); // e.g., "votes" or "stats"
  const backendURL = `http://34.204.8.214:8080/api/${path}`;

  const response = await fetch(backendURL, {
    method: "GET",
    headers: req.headers,
  });

  const data = await response.text(); // or .json() if you're sure it's JSON

  return new Response(data, {
    status: response.status,
    headers: response.headers,
  });
}

export async function POST(req, { params }) {
  const path = params.path.join("/");
  const backendURL = `http://34.204.8.214:8080/api/${path}`;

  const body = await req.text(); // or req.json() if JSON body

  const response = await fetch(backendURL, {
    method: "POST",
    headers: req.headers,
    body,
  });

  const data = await response.text();

  return new Response(data, {
    status: response.status,
    headers: response.headers,
  });
}
