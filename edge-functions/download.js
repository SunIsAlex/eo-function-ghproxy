// functions/download.js
// 访问: /download?path=folder/file.txt

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.searchParams.get('path');

  if (!path) {
    return new Response('缺少 path 参数', { status: 400 });
  }

  const rawUrl = `https://raw.githubusercontent.com/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/main/${path}`;

  const res = await fetch(rawUrl);

  if (!res.ok) {
    return new Response('文件不存在', { status: 404 });
  }

  const filename = path.split('/').pop();

  return new Response(res.body, {
    headers: {
      'Content-Type': res.headers.get('Content-Type') || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
