# Deploying to Vercel

A complete, ordered runbook. Nothing here assumes prior Vercel experience.

**Before you start, three facts about this specific repo:**

- The remote is already set to `https://github.com/priyanshu172004/Proto.git` on branch `main`.
- `.env.local` has **never** been committed and is ignored — your Cal link and any
  token stay local. Verified with `git log --all -- .env*` (empty).
- `info/` (7.6 MB of saved build-research pages) was tracked and is now untracked.
  It still exists on disk; it just stops shipping to GitHub. See §9 if you want it
  gone from history too.

---

## 0. Pre-flight — run locally, in order

Every command from the project root.

```bash
npm ci                 # clean install from the lockfile
npm run lint           # must print nothing
npm run typecheck      # must print nothing
npm run build          # must end with the route table, no errors
```

If any of the four fails, stop and fix it. A red local build is a red Vercel build.

Then confirm nothing secret is staged:

```bash
git status --short              # .env.local must NOT appear
git check-ignore -q .env.local && echo "env is ignored — good"
```

---

## 1. Decide whether the repo is public or private

Both deploy identically on Vercel's free Hobby plan.

- **Public** — anyone can read the source. Fine here: there are no secrets in the
  code, and `.env.local` is ignored. Recruiters can read it, which is usually a plus.
- **Private** — nobody but you and Vercel sees it.

Check and change at `https://github.com/priyanshu172004/Proto/settings` →
*General* → *Danger Zone* → *Change repository visibility*.

> If it is public, be aware `info/` is still in the **history** of the two existing
> commits — those are saved transcripts of the conversations used to plan this
> build. Not a security issue, but see §9 if you would rather they were not there.

---

## 2. Commit and push the current state

```bash
git add -A
git status --short          # read this list before committing
git commit -m "Portfolio: research descriptions, activity radar, deploy hardening"
git push origin main
```

`git status --short` should show `.gitignore`, `next.config.ts`, `DEPLOYMENT.md`,
the `data/` and `components/` changes, and ~94 deletions under `info/`. It must
**not** show `.env.local`.

---

## 3. Create the Vercel account

1. Go to **https://vercel.com/signup**.
2. Choose **Continue with GitHub**. Signing in with GitHub avoids a second
   password and lets Vercel install its app in one step.
3. Turn on 2FA immediately: **Account Settings → Authentication → Two-Factor**.
   Your deploy pipeline is only as secure as this login.

---

## 4. Grant Vercel access to only this repo

1. **Add New… → Project**.
2. Vercel asks to install the GitHub app. When the permission screen appears,
   pick **Only select repositories** and choose **`Proto`**.
   Do *not* grant "All repositories" — there is no reason to give a deploy
   service read access to every project you own.
3. Back in Vercel, click **Import** next to `Proto`.

---

## 5. Configure the project

Vercel auto-detects Next.js. Leave the defaults:

| Setting | Value |
|---|---|
| Framework Preset | Next.js |
| Root Directory | `./` |
| Build Command | `next build` (default) |
| Output Directory | (leave blank — Next.js managed) |
| Install Command | `npm install` (default) |
| Node.js Version | 22.x or later (Settings → General after first deploy) |

**Do not** add `npm run assets` to the build command. That script rewrites
`data/gallery.ts` from `/pictures`; the generated images in `public/images/` are
already committed, so the build has everything it needs. Running it on Vercel
would burn build time regenerating files that cannot be written back.

---

## 6. Environment variables — the part that matters

On the import screen, expand **Environment Variables**. Add them one at a time.

### 6.1 `NEXT_PUBLIC_SITE_URL`

| | |
|---|---|
| Value | `https://your-final-domain.com` (no trailing slash) |
| Environments | Production, Preview, Development |

Feeds canonical URLs, Open Graph, `sitemap.xml`, `robots.txt`. If you do not have
a custom domain yet, use the `*.vercel.app` URL Vercel gives you and update it later.

### 6.2 `NEXT_PUBLIC_CAL_LINK`

| | |
|---|---|
| Value | `https://cal.com/priyanshu-srivastava-3n0bty` |
| Environments | Production, Preview, Development |

A bare handle works too — the app strips the host either way. This is **public by
design**: anything prefixed `NEXT_PUBLIC_` is inlined into the browser bundle.
That is correct here (your booking page is already public), but it is exactly why
a token must never carry that prefix.

### 6.3 `GITHUB_TOKEN` — optional, and the only real secret

Without it the site still shows your full 12-month contribution graph via a public
mirror. Add it only if you want the data to come straight from GitHub.

**Create the token with the narrowest possible scope:**

1. Go to **https://github.com/settings/personal-access-tokens/new**
   (*Settings → Developer settings → Personal access tokens → Fine-grained tokens*).
2. **Token name**: `vercel-portfolio-readonly`
3. **Expiration**: 90 days. Not "No expiration" — a token that never expires is a
   permanent liability if it leaks.
4. **Resource owner**: your account.
5. **Repository access**: **Public repositories (read-only)**.
6. **Permissions**: leave every one at *No access*. Public contribution counts need
   no scopes at all. If a screen forces a choice, `Metadata: Read-only` is enough.
7. **Generate token** and copy it — GitHub shows it exactly once.

**Add it to Vercel:**

| | |
|---|---|
| Key | `GITHUB_TOKEN` |
| Value | the `github_pat_…` string |
| Environments | Production, Preview |
| Sensitive | tick this box |

Rules that matter:

- **No `NEXT_PUBLIC_` prefix.** With it, the token would be compiled into
  JavaScript that every visitor downloads.
- **Never paste it into `.env.example`**, a commit message, or a screenshot.
- Marking it **Sensitive** means Vercel will not display it again after saving.

### 6.4 Mirror them locally

Vercel does not touch your machine. Keep `.env.local` in sync by hand:

```bash
cp .env.example .env.local     # then edit in your real values
```

`.env.local` is gitignored. `.env.example` is committed and must stay
value-free apart from the public Cal link.

---

## 7. Deploy

Click **Deploy**. First build takes roughly 2–4 minutes.

When it finishes, open the `*.vercel.app` URL and walk the page:

- [ ] Hero types out, roles rotate, the green field drifts
- [ ] Theme toggle flips both ways with no flash
- [ ] A project card opens, **scrolls**, and its GitHub link works
- [ ] Gallery scrolls sideways on desktop; a frame opens and arrow keys navigate
- [ ] GitHub and LeetCode graphs show real data, not the empty state
- [ ] The activity radar renders both series
- [ ] **Request a call → the Cal.com scheduler loads**
- [ ] Footer wordmark lights up under the cursor

If the two activity graphs show "Live data unavailable", the build could not reach
GitHub/LeetCode. Redeploy — it revalidates hourly and usually self-heals.

---

## 8. Custom domain

1. **Project → Settings → Domains → Add**.
2. Enter `yourdomain.com`. Vercel prints the DNS records to create.
3. At your registrar, add exactly what Vercel shows — usually:
   - `A` record, host `@` → `76.76.21.21`
   - `CNAME`, host `www` → `cname.vercel-dns.com`
4. Wait for propagation (minutes to a few hours). Vercel issues the TLS
   certificate automatically; there is nothing to buy or upload.
5. Set one as primary and let the other redirect to it — pick either, just be
   consistent.
6. **Go back and update `NEXT_PUBLIC_SITE_URL`** to the real domain, then redeploy.
   Skipping this leaves your canonical tags and sitemap pointing at the old URL.

---

## 9. Optional: purge `info/` from git history

Only relevant if the repo is public and you would rather those transcripts were
not in the history at all. **This rewrites history — if anyone has cloned the
repo, their copies diverge.**

```bash
# Back up first.
cp -r . ../Portfolio_Pri_backup

npx --yes git-filter-repo --path info --invert-paths
git remote add origin https://github.com/priyanshu172004/Proto.git
git push origin main --force
```

Fine to skip. There is nothing sensitive in those files — only bulk and noise.

---

## 10. Ongoing security hygiene

| Item | Action |
|---|---|
| `GITHUB_TOKEN` expiry | Set a 90-day calendar reminder. Generate a new token, update it in Vercel, redeploy, then **delete the old token on GitHub**. |
| Token leak | Delete it at *GitHub → Settings → Developer settings* immediately. The site keeps working — it falls back to the public mirror. |
| Vercel access | Review *Account → Authentication* quarterly. Revoke anything unfamiliar. |
| Dependencies | `npm audit` occasionally; `npm outdated` before big changes. |
| Preview URLs | Every branch push gets a public preview link. If that bothers you, turn on *Settings → Deployment Protection → Vercel Authentication* for Preview only. |

### Already hardened in the code

`next.config.ts` sends these on every response — verified served, not just configured:

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
X-Frame-Options: SAMEORIGIN
Permissions-Policy: camera=(), microphone=(), geolocation=(), browsing-topics=()
X-DNS-Prefetch-Control: on
```

`poweredByHeader: false` also removes the `X-Powered-By: Next.js` version leak.

### Optional: Content-Security-Policy

Deliberately **not** enabled. The Cal.com embed pulls a script and an iframe from
`app.cal.com`, and Next.js and Framer Motion emit inline styles, so a wrong policy
silently kills the booking dialog — the one conversion path on the page.

If you want it, add this to the `securityHeaders` array and then **test the booking
dialog in a preview deploy before promoting to production**:

```ts
{
  key: "Content-Security-Policy",
  value: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://app.cal.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://app.cal.com",
    "font-src 'self' data:",
    "frame-src https://app.cal.com https://cal.com",
    "connect-src 'self' https://app.cal.com https://api.github.com https://leetcode.com https://github-contributions-api.jogruber.de",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; "),
}
```

`'unsafe-inline'` and `'unsafe-eval'` in `script-src` blunt much of the benefit;
removing them requires nonce-based CSP wired through middleware. The headers above
are the high-value, zero-risk part.

---

## 11. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Build fails, works locally | Stale lockfile | `rm -rf node_modules && npm ci && npm run build`, commit `package-lock.json` |
| "Request a call" opens email instead of scheduler | `NEXT_PUBLIC_CAL_LINK` unset in Vercel | Add it, then **redeploy** — `NEXT_PUBLIC_*` is baked in at build time |
| Activity cards show empty state | Upstream unreachable at build | Redeploy; it revalidates hourly |
| Contribution graph says "public events · 14 weeks" | Both GraphQL and the mirror failed | Check `GITHUB_TOKEN` is valid and not expired |
| Photos missing | `public/images/` not committed | `git add public/images && git commit && git push` |
| OG image blank in link previews | Cached by the platform | Re-scrape via that platform's debugger |
| Wrong canonical URL / sitemap | `NEXT_PUBLIC_SITE_URL` still the placeholder | Update it and redeploy |
