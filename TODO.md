# To do

- About page
- Footer
- Write/schedule 10 initial articles
- Update domain and redirect everywhere
- Update URL on social media, etc
- Launch!!!

# Later

- Defer / selectively load LaTeX CSS
- Make tags in article list clickable
- Article view
  - Test deprecated options in completions
  - Tables
  - ToC
  - Topics
  - Related or/and next/prev article links
  - Turn typescript errors into links to https://ts-error-translator.vercel.app/ (see: https://github.com/mattpocock/ts-error-translator/blob/main/apps/web/src/pages/index.tsx#L91)
  - Headings as anchor links
- Add schema.org stuff
- OG images (satori) for articles without defined image
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
- Fira code font for code blocks?
- Optimization: compute reading time when generating article metadata (from article content, maybe excluding JSX - remark should be useful for this) so it's available without javascript enabled (and before hydration)
- Smaller font sizes on mobile?
- Add easter egg
- Allow type highlights to overflow code blocks
- Fix twoslash errors for multi-file snippets
- Dark theme
- Co-locate article og images
- Javascript-less header collapse? (position sticky?)
- Bug: topics list jumps around when selected
- Bug: title and others meta tags don't work properly
