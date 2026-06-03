/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 关键：生成纯静态HTML/CSS/JS，适配Cloudflare Pages
  // 其他原有配置保留（如果文件里原来有其他内容，直接加在这行下面即可）
  images: {
    unoptimized: true, // 补充：禁用Next.js图片优化，避免静态部署后图片404
  },
  trailingSlash: true, // 补充：统一路由末尾斜杠，解决部分页面跳转404问题
}

export default nextConfig