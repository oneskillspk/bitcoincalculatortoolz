<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <title>Sitemap — Bitcoin Calculator Tools</title>
        <meta name="robots" content="noindex"/>
        <style>
          :root{color-scheme:light dark;}
          body{font-family:'Manrope',system-ui,-apple-system,sans-serif;margin:0;background:#f5f3ee;color:#1a1a1a;}
          header{padding:2rem clamp(1rem,4vw,3rem) 1.25rem;background:linear-gradient(180deg,#fff,transparent);border-bottom:1px solid #e6e1d6;}
          h1{font-family:'Sora','Manrope',sans-serif;font-size:clamp(1.5rem,3vw,2rem);font-weight:700;letter-spacing:-0.02em;margin:0 0 .35rem;}
          .meta{color:#5a5a5a;font-size:.9rem;}
          .meta strong{color:#e85d3a;}
          main{padding:1.5rem clamp(1rem,4vw,3rem) 4rem;}
          table{border-collapse:collapse;width:100%;background:#fff;border:1px solid #e6e1d6;border-radius:10px;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,.03);}
          th,td{text-align:left;padding:.65rem .9rem;font-size:.875rem;border-bottom:1px solid #f0ece4;vertical-align:top;}
          th{background:#faf8f3;font-weight:600;color:#3a3a3a;text-transform:uppercase;font-size:.7rem;letter-spacing:.05em;position:sticky;top:0;}
          tr:last-child td{border-bottom:none;}
          tr:hover td{background:#fbf8f1;}
          td.url{max-width:520px;word-break:break-all;}
          td.url a{color:#0c4a8a;text-decoration:none;}
          td.url a:hover{text-decoration:underline;}
          .pill{display:inline-block;padding:2px 8px;border-radius:999px;background:#fff1ec;color:#e85d3a;font-size:.7rem;font-weight:600;}
          @media (prefers-color-scheme: dark){body{background:#141414;color:#f5f3ee;}header{background:linear-gradient(180deg,#1d1d1d,transparent);border-color:#2a2a2a;}.meta{color:#a8a39a;}table{background:#1a1a1a;border-color:#2a2a2a;}th{background:#202020;color:#d8d3c8;}th,td{border-color:#262626;}tr:hover td{background:#222;}td.url a{color:#7cb3f5;}.pill{background:#3a1d14;}}
        </style>
      </head>
      <body>
        <header>
          <h1>Bitcoin Calculator Tools — XML Sitemap</h1>
          <p class="meta">
            <strong><xsl:value-of select="count(s:urlset/s:url)"/></strong> URLs.
            Machine-readable sitemap for search engines. Humans, browse the
            <a href="/">homepage</a> instead.
          </p>
        </header>
        <main>
          <table>
            <thead>
              <tr><th>URL</th><th>Last modified</th><th>Change freq</th><th>Priority</th><th>Alternates</th></tr>
            </thead>
            <tbody>
              <xsl:for-each select="s:urlset/s:url">
                <tr>
                  <td class="url"><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td>
                  <td><xsl:value-of select="s:lastmod"/></td>
                  <td><xsl:value-of select="s:changefreq"/></td>
                  <td><xsl:value-of select="s:priority"/></td>
                  <td>
                    <xsl:for-each select="xhtml:link">
                      <span class="pill"><xsl:value-of select="@hreflang"/></span>
                      <xsl:text> </xsl:text>
                    </xsl:for-each>
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
