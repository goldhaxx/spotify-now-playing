import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  console.log("Genius API route called");
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  console.log("Genius API search query:", q);

  if (!q) {
    console.error("Missing search query");
    return NextResponse.json({ error: 'Missing search query' }, { status: 400 });
  }

  try {
    console.log("Fetching from Genius API...");
    const response = await fetch(`https://api.genius.com/search?q=${encodeURIComponent(q)}`, {
      headers: {
        'Authorization': `Bearer G7bF_l2QJz4VwQbp4dAakFT_lDxAphJgzp_z6W8VDWwdn_npJQSah6EfVeYpRrXz`
      }
    });

    console.log("Genius API status:", response.status);
    const data = await response.json();
    console.log("Genius API raw response:", data);

    if (data.response && data.response.hits && data.response.hits.length > 0) {
      const firstHit = data.response.hits[0].result;
      console.log("Genius API first hit:", firstHit);
      return NextResponse.json({ id: firstHit.id, title: firstHit.title });
    }

    console.log("No results found in Genius API response");
    return NextResponse.json({ error: 'No results found' }, { status: 404 });
  } catch (error) {
    console.error("Error fetching from Genius API:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}