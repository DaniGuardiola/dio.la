# To do

- About page
- 404 page
- Favicon
- Default OG image
- Write 10 initial articles
- Update domain and redirect everywhere
- Update URL on social media, etc
- Launch!!!

# Later

- Article view
  - Test deprecated options in completions
  - Fix/report hot reload issue
  - Tables
  - Headings as links
  - ToC
  - Topics
  - Related or/and next/prev article links
  - Turn typescript errors into links to https://ts-error-translator.vercel.app/ (see: https://github.com/mattpocock/ts-error-translator/blob/main/apps/web/src/pages/index.tsx#L91)
  - Headings as anchor links
- Add schema.org stuff
- Add draft option to articles (frontmatter), and create drafts.dio.la deployment to show them with env variable.
- OG images (satori) for homepage and articles without defined image
- Hire illustrator to make nice main images for articles (and some secondary illustrations as needed)
- RSS
- Error fallback
- Fix upstream shiki-twoslash issues:
  - ESM
  - remark: html raw
- Fix/complete shiki-twoslash features (and then complete styles):
  - inline code highlights
  - logger
  - annotations
- Image fallbacks on error
- Analytics
- Green bg height transition on client-side navigation?
- Fira code font for code blocks?
- Go to top button in articles
- Optimization: compute reading time when generating article metadata (from article content, maybe excluding JSX - remark should be useful for this) so it's available without javascript enabled (and before hydration)
- Smaller font sizes on mobile?
- Figure out how to prevent stuff from jumping around on load
- Add easter egg
- Allow type highlights to overflow code blocks
- Fix twoslash errors for multi-file snippets
