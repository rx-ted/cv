"use client"

import Link from "next/link"
import { AppFooter } from "@/components/layout/AppFooter"
import { AppLogo } from "@/components/layout/AppLogo"
import { useAppStore } from "@/stores/app"

export default function TermsPage() {
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
            <h1>服务条款</h1>
            <p className="text-muted-foreground">最后更新：2026 年</p>
            <h2>接受条款</h2>
            <p>
              欢迎访问木羽（英文名
              rx-ted）的简历编辑器网站（cv.19981204.xyz）。访问或使用本网站即表示你同意本服务条款。如不同意，请勿使用本网站。
            </p>
            <h2>服务说明</h2>
            <p>
              本应用提供简历的编辑、预览与导出（如 PDF、Word、JSON
              等）等功能，主要在您的浏览器本地运行。功能可能随版本更新而调整。
            </p>
            <h2>您的内容与责任</h2>
            <ul>
              <li>
                您对录入、上传或导入本应用的所有内容负责，并应确保拥有相应权利且不违反适用法律。
              </li>
              <li>
                您应自行备份重要数据；清除浏览器存储、切换设备或浏览器数据丢失可能导致本地保存的简历无法恢复。
              </li>
            </ul>
            <h2>知识产权</h2>
            <p>
              本应用的界面、代码与文档的相关权利遵循项目仓库中所示的开源许可证（如有）。您对自己创建的简历内容保留相应权利。
            </p>
            <h2>免责声明</h2>
            <ul>
              <li>
                本应用按“现状”提供，不对适销性、特定用途适用性或不间断、无错误运行作出保证。
              </li>
              <li>
                因使用或无法使用本应用导致的任何直接或间接损失，维护者在法律允许范围内不承担责任。
              </li>
              <li>
                导出文件的排版效果可能因浏览器、系统或字体差异而略有不同，请以最终导出结果为准并自行校对。
              </li>
            </ul>
            <h2>第三方服务</h2>
            <p>
              本应用可能链接或依赖第三方服务（如字体
              CDN、代码托管平台）。第三方服务的可用性与条款由其各自提供方负责。
            </p>
            <h2>条款变更</h2>
            <p>
              我们可能更新本条款，更新后将在本页面公布。继续使用本应用即视为接受更新后的条款。
            </p>
            <h2>联系方式</h2>
            <p>
              如有疑问，请通过项目仓库（
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
            <h1>Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: 2026</p>
            <h2>Acceptance</h2>
            <p>
              Welcome to Mu Yu (also known as rx-ted)&apos;s resume editor
              website (cv.19981204.xyz). By accessing or using this website, you
              agree to these Terms of Service. If you do not agree, please do
              not use this website.
            </p>
            <h2>Service description</h2>
            <p>
              The App provides tools to edit, preview, and export resumes (e.g.
              PDF, Word, JSON) and runs primarily in your browser. Features may
              change with updates.
            </p>
            <h2>Your content and responsibilities</h2>
            <ul>
              <li>
                You are responsible for all content you enter, upload, or import
                and must have the right to use it and comply with applicable
                laws.
              </li>
              <li>
                You should back up important data. Clearing browser storage,
                changing devices, or browser data loss may prevent recovery of
                locally stored resumes.
              </li>
            </ul>
            <h2>Intellectual property</h2>
            <p>
              Rights in the App’s interface, code, and documentation are subject
              to the open-source license stated in the project repository (if
              any). You retain rights to the resume content you create.
            </p>
            <h2>Disclaimer</h2>
            <ul>
              <li>
                The App is provided “as is” without warranties of
                merchantability, fitness for a particular purpose, or
                uninterrupted/error-free operation.
              </li>
              <li>
                To the extent permitted by law, maintainers are not liable for
                any direct or indirect damages arising from use of or inability
                to use the App.
              </li>
              <li>
                Exported layout may vary slightly by browser, OS, or fonts;
                please verify final outputs.
              </li>
            </ul>
            <h2>Third-party services</h2>
            <p>
              The App may link to or rely on third-party services (e.g. font
              CDNs, code hosting). Their availability and terms are governed by
              those providers.
            </p>
            <h2>Changes</h2>
            <p>
              We may update these Terms; changes will be posted on this page.
              Continued use after updates means you accept the revised Terms.
            </p>
            <h2>Contact</h2>
            <p>
              Questions? Contact the maintainer via the project repository (
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
