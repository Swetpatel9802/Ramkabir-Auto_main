export const config = {
  matcher: '/product/:id',
};

export default async function middleware(req) {
  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 1];

    // Fetch the raw index.html that Vercel serves for this deployment
    // By fetching the root URL, Vercel routes it to the static index.html
    const originUrl = new URL('/', req.url);
    const res = await fetch(originUrl);
    let html = await res.text();

    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey && id) {
      // Direct REST API fetch to Supabase (compatible with Edge runtime)
      const productRes = await fetch(`${supabaseUrl}/rest/v1/public_tractors?id=eq.${id}&select=id,make,model_number,images`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });

      const products = await productRes.json();
      
      if (products && products.length > 0) {
        const p = products[0];
        
        let imageUrl = 'https://ramkabir-auto.com/images/Logo.jpg';
        
        let parsedImages = [];
        if (Array.isArray(p.images)) {
          parsedImages = p.images;
        } else if (typeof p.images === 'string') {
          try {
            parsedImages = JSON.parse(p.images);
            if (!Array.isArray(parsedImages)) parsedImages = [p.images]; // Just in case it parsed to a non-array
          } catch (e) {
            parsedImages = [p.images]; // It was just a plain string URL
          }
        }

        if (parsedImages && parsedImages.length > 0 && typeof parsedImages[0] === 'string') {
          imageUrl = parsedImages[0];
          // Optimize Cloudinary image for WhatsApp/Facebook (JPG format, 1200x630, compressed)
          if (imageUrl.includes('res.cloudinary.com')) {
            if (imageUrl.includes('/upload/v')) {
                imageUrl = imageUrl.replace('/upload/v', '/upload/w_1200,h_630,c_fill,f_jpg,q_80/v');
            } else if (imageUrl.includes('/upload/ramkabir')) {
                imageUrl = imageUrl.replace('/upload/ramkabir', '/upload/w_1200,h_630,c_fill,f_jpg,q_80/ramkabir');
            }
          }
        }

        const title = `${p.make} ${p.model_number} | Ramkabir Auto`;
        const description = `Check out this ${p.make} ${p.model_number} available at Ramkabir Auto, Vadodara.`;

        // Inject Open Graph tags right before </head>
        const metaTags = `
          <title>${title}</title>
          <meta name="description" content="${description}" />
          <meta property="og:title" content="${title}" />
          <meta property="og:description" content="${description}" />
          <meta property="og:image" content="${imageUrl}" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="${req.url}" />
          <meta name="twitter:card" content="summary_large_image" />
        `;
        
        // Remove the original generic tags to prevent WhatsApp from getting confused
        html = html.replace(/<title>.*?<\/title>/i, '');
        html = html.replace(/<meta\s+name=["']description["']\s+content=["'].*?["']\s*\/?>/i, '');
        
        html = html.replace('</head>', `${metaTags}</head>`);
      }
    }

    return new Response(html, {
      status: 200,
      headers: { 
        'content-type': 'text/html;charset=UTF-8',
        'cache-control': 'public, max-age=60, s-maxage=60'
      },
    });
  } catch (error) {
    // If anything fails in the middleware, just pass through to the React app
    console.error('Middleware error:', error);
    // Returning fetch lets Vercel continue the normal rewrite
    return fetch(new URL('/', req.url));
  }
}
