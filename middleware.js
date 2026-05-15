// middleware.js
export function middleware(context) {
  const { request, next, rewrite } = context;
  const url = new URL(request.url);

  // 排除已经是 /download 的请求，避免死循环
  if (url.pathname.startsWith('/download')) {
    return next();
  }

  // 排除静态资源（按需添加）
  if (url.pathname === '/' || url.pathname.startsWith('/assets')) {
    return next();
  }

  // /test/are → /download?path=test/are
  const path = url.pathname.replace(/^\//, '');
  return rewrite(`/download?path=${encodeURIComponent(path)}`);
}
