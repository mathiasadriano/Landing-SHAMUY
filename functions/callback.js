export async function onRequest(context) {
    const url = new URL(context.request.url);
    const code = url.searchParams.get('code');
    
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        client_id: context.env.GITHUB_CLIENT_ID,
        client_secret: context.env.GITHUB_CLIENT_SECRET,
        code: code
      }),
    });
    
    const data = await response.json();
    
    const html = `
      <!DOCTYPE html>
      <html><body><script>
        window.opener.postMessage('authorization:github:success:{"token":"${data.access_token}","provider":"github"}', '*');
        window.close();
      </script></body></html>
    `;
    return new Response(html, { headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
  }