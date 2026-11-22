"use client"

import Link from "next/link"
import { AppFooter } from "@/components/layout/AppFooter"
import { AppLogo } from "@/components/layout/AppLogo"
import { useAppStore } from "@/stores/app"

export default function PrivacyPage() {
  const lang = useAppStore((s) => s.language)
  const isZh = lang === "zh-CN"

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <AppLogo lang={lang} />
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {isZh ? "返回首页" : "Back to home"}
          </Link>
        </div>
      </header>
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 prose prose-sm dark:prose-invert">
        {isZh ? (
          <>
            <h1>隐私政策</h1>
            <p className="text-muted-foreground">最后更新：2026 年</p>
            <h2>概述</h2>
            <p>
              欢迎访问木羽（英文名
              rx-ted）的简历编辑器网站（cv.19981204.xyz）。访问或使用本网站即表示你同意本隐私政策的说明。如不同意，请勿使用本网站。本网站是一款本地优先的简历编辑与导出工具，我们重视你的隐私。
            </p>
            <h2>数据存储</h2>
            <ul>
              <li>
                您创建和编辑的简历内容（包括文本、样式与布局偏好等）默认保存在您浏览器的本地存储（如
                localStorage）中，用于在您下次访问时恢复数据。
              </li>
              <li>
                本应用不会在默认情况下将您的简历内容上传到我们的服务器进行存储。导出为
                PDF、Word、JSON 等文件由您的浏览器在本地生成。
              </li>
            </ul>
            <h2>您主动的操作</h2>
            <ul>
              <li>当您使用“导入/导出”功能时，文件的读写发生在您的设备上。</li>
              <li>
                若您通过第三方链接（如
                GitHub）访问外部网站，相关隐私政策由对应网站适用。
              </li>
            </ul>
            <h2>第三方资源</h2>
            <p>
              本应用可能加载字体、图标等静态资源（例如来自 CDN
              的字体文件）。这些请求由您的浏览器直接发起，其数据处理受相应服务提供方条款约束。
            </p>
            <h2>Cookie 与追踪</h2>
            <p>
              本应用本身不以广告追踪为目的设置第三方追踪
              Cookie；浏览器或您使用的扩展可能有其他行为不在本应用控制范围内。
            </p>
            <h2>政策变更</h2>
            <p>
              我们可能不时更新本隐私政策。更新后的版本将在本页面发布，并以“最后更新”日期为准。
            </p>
            <h2>联系方式</h2>
            <p>
              如对本隐私政策有疑问，可通过项目仓库（
              <a
                href="https://github.com/rx-ted/cv"
                target="_blank"
                rel="noreferrer"
              >
                github.com/rx-ted/cv
              </a>
              ）联系维护者。
            </p>
          </>
        ) : (
          <>
            <h1>Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: 2026</p>
            <h2>Overview</h2>
            <p>
              Welcome to Mu Yu (also known as rx-ted)&apos;s resume editor
              website (cv.19981204.xyz). By accessing or using this website, you
              agree to this Privacy Policy. If you do not agree, please do not
              use this website. This is a local-first resume editor and export
              tool; we value your privacy.
            </p>
            <h2>Data storage</h2>
            <ul>
              <li>
                Resume content you create or edit (including text, styles, and
                layout preferences) is stored by default in your browser’s local
                storage (e.g. localStorage) so it can be restored on your next
                visit.
              </li>
              <li>
                By default, the App does not upload your resume content to our
                servers for storage. Exports such as PDF, Word, or JSON are
                generated locally in your browser.
              </li>
            </ul>
            <h2>Your actions</h2>
            <ul>
              <li>
                When you use import/export features, file operations occur on
                your device.
              </li>
              <li>
                If you follow third-party links (e.g. to GitHub), those sites’
                privacy policies apply.
              </li>
            </ul>
            <h2>Third-party resources</h2>
            <p>
              The App may load static resources such as fonts or icons (for
              example from CDNs). These requests are made directly by your
              browser and are subject to the respective providers’ terms.
            </p>
            <h2>Cookies and tracking</h2>
            <p>
              The App does not set third-party advertising tracking cookies for
              its own purposes. Your browser or extensions may behave
              differently and are outside the App’s control.
            </p>
            <h2>Changes</h2>
            <p>
              We may update this policy from time to time. Updates will be
              posted on this page with a revised “Last updated” date.
            </p>
            <h2>Contact</h2>
            <p>
              If you have questions about this Privacy Policy, you can reach the
              maintainer via the project repository (
              <a
                href="https://github.com/rx-ted/cv"
                target="_blank"
                rel="noreferrer"
              >
                github.com/rx-ted/cv
              </a>
              ).
            </p>
          </>
        )}
      </main>
      <AppFooter lang={lang} />
    </div>
  )
}
