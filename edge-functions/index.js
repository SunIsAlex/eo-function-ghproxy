export async function onRequest(context) {
    const { request } = context;
    const requestUrl = new URL(request.url);

    // 从环境变量或固定配置读取目标站
    const TARGET = 'https://www.github.com';

    // 直接把当前路径拼到目标站上
    const targetUrl = TARGET + '/' + requestUrl.search;

    const forwardHeaders = new Headers(request.headers);
    const targetOrigin = new URL(TARGET);
    forwardHeaders.set('Host', targetOrigin.host);
    forwardHeaders.set('Origin', TARGET);
    forwardHeaders.set('Referer', TARGET + '/');
    forwardHeaders.set('Accept-Encoding', 'identity');
    forwardHeaders.delete('CF-Connecting-IP');
    forwardHeaders.delete('CF-Ray');
    forwardHeaders.delete('X-Forwarded-For');

    const response = await fetch(new Request(targetUrl, {
        method: request.method,
        headers: forwardHeaders,
        body: ['GET', 'HEAD'].includes(request.method) ? null : request.body,
        redirect: 'follow',
    }));

    const responseHeaders = new Headers(response.headers);
    responseHeaders.delete('Content-Encoding');
    responseHeaders.delete('Content-Length');
    responseHeaders.delete('Content-Security-Policy');
    responseHeaders.delete('Content-Security-Policy-Report-Only');
    responseHeaders.delete('X-Frame-Options');
    responseHeaders.set('Access-Control-Allow-Origin', '*');

    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
    });
}
