# Client evidence required

Internal working file. Not linked from the website, disallowed in `robots.txt`.

Every item below is something the website **cannot** state until Bharat Infra
Associate supplies the evidence named next to it. Nothing here is a criticism of
the business — it is simply the list of claims that a buyer, a search engine or a
competitor could challenge, and which the site currently does not make.

Last reviewed: 2026-09-22

---

## 1. Credentials needed to finish work already built

| # | Item | Blocks | Where it goes |
|---|------|--------|---------------|
| 1.1 | Production **Web3Forms access key** for `bharatinfrassociate.com`, plus written confirmation that it delivers to `procurement@bharatinfrassociate.com` | The enquiry form cannot submit | `enquiry.js` → `ACCESS_KEY` |
| 1.2 | Verified **GA4 Measurement ID** (`G-XXXXXXXXXX`) for the property that should receive this site's traffic | No analytics data is collected | `analytics.js` → `MEASUREMENT_ID` |
| 1.3 | **Google Search Console** access for the `https://www.bharatinfrassociate.com/` property | Index coverage cannot be checked or requested | n/a — console only |

Until 1.1 is supplied the contact page shows a visible notice pointing visitors
to the phone numbers and email address. Until 1.2 is supplied no tag is loaded
and no request is made; the event layer is wired and inert.

## 2. Client and logo claims removed on 2026-09-22

The homepage carried a "Clientele" carousel headed *"Companies associated with our
work"*, with the line *"Operators, OEMs and infrastructure providers who have
placed work orders with us"*, six logos, and the label **"EPC Partner"** under
L&T. None of it was evidenced in this repository, so all of it was removed. See
the comment block in `index.html` where the section used to be.

For **each** of L&T, Oriano, Radiate Energy, Sterling & Wilson, Tata Power and
Ultrathon Electric, four things are needed before anything returns:

- [ ] Work order or contract reference and date
- [ ] Whether the engagement was **direct** or **as a subcontractor**, and to whom
- [ ] **Written permission** from that company to display its logo on this website
- [ ] The **exact wording** that company approves for describing the relationship

A company cannot be called a client, customer, partner or organisation served
without evidence supporting that exact relationship. Partial evidence supports
only the narrower claim it actually proves.

The logo image files remain in the repository but are referenced by no page.

## 3. Project records — needed per project

The website publishes no project record. `/case-study-template.html` is the
structure a record will use. Per project:

- [ ] Project title and type (solar EPC / telecom / civil / erection / AC-DC / O&M)
- [ ] State **and district**
- [ ] Client disclosure status: named with written permission, described
      generically, or not disclosed
- [ ] Direct contractor or subcontractor, and to whom (name only with permission)
- [ ] Contracted scope, as written in the work order
- [ ] One measurable quantity with its unit (MWp, foundations, km of trench, towers)
- [ ] Start and completion month and year
- [ ] Site conditions as recorded at the time
- [ ] Work actually performed by this company, separated from work by others
- [ ] Inspection and testing records: which were held, who witnessed, what format
- [ ] Handover scope and documents
- [ ] The result as the client agrees it may be stated publicly
- [ ] Original photographs, with permission to publish and factual captions

## 4. Location pages

`/projects-bihar.html` and `/projects-jharkhand.html` were retired on 2026-09-22
and both now 301 to `/projects.html`. Measured similarity between the two was
**98.6%** once the state name was normalised; neither held a district, an
approved project summary, an original photograph, a completion period or any
other state-specific fact.

To bring either page back, that state needs at minimum:

- [ ] At least one verified district
- [ ] At least one approved project summary for that state
- [ ] Original photographs from that state, with permission
- [ ] The exact work performed and the completion period

Do not restore them as keyword targets without that. Two near-identical location
pages compete with each other and with `/projects.html`.

## 5. Business name

The brief supplied for this work listed the verified name as **"Bharat Infra
Associates"** (plural). The repository and the live site use **"Bharat Infra
Associate"** (singular), applied deliberately in commit `d1f6b70` on 2026-09-10.
The LinkedIn company slug (`/company/bharat-infra-associates/`) and the GitHub
repository name are both plural.

The singular form was confirmed on 2026-09-22 as the name to keep, so no rename
was made. To close this out on paper:

- [ ] File the GST certificate, registration certificate or letterhead that
      shows the registered name, so the discrepancy has a documentary answer
- [ ] If the registered name turns out to be plural, decide whether to correct
      the site, the LinkedIn page, or both

The domain uses the singular form and is not affected either way.

## 6. Claims the site still does not make, deliberately

None of the following appear anywhere on the site, and none should be added
without the evidence named:

| Claim type | Evidence needed |
|---|---|
| Project count, capacity, MW installed | Work orders or completion certificates |
| Districts or cities worked in | Project records naming them |
| Certifications, registrations, licences | The certificate itself, in date |
| ISO / standards compliance | Certificate plus scope of certification |
| Testing capability | Equipment list, calibration certificates |
| Performance results, availability, yield | Approved measured data |
| Testimonials, reviews, ratings | Signed, attributable statements |
| Additional office locations | Address proof |
| Awards | The award record |
| Team size, safety record | HR and incident records |
| Guarantees or warranties | The contractual wording that grants them |
