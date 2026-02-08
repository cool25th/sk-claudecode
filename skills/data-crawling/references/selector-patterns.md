# CSS & XPath Selector Patterns

Quick reference for common selector patterns used in web scraping.

## CSS Selectors (Preferred)

### Element Selection
```css
h1                  /* By tag */
.class-name         /* By class */
#element-id         /* By ID */
[data-id]           /* Has attribute */
[type="email"]      /* Attribute value */
```

### Combinators
```css
div > p             /* Direct child */
div p               /* Any descendant */
h2 + p              /* Immediately after */
h2 ~ p              /* Any sibling after */
```

### Pseudo-selectors
```css
:first-child        /* First child */
:last-child         /* Last child */
:nth-child(2)       /* 2nd child */
:nth-child(odd)     /* Odd children */
:not(.hidden)       /* Exclude class */
```

### Attribute Patterns
```css
[href^="https"]     /* Starts with */
[href$=".pdf"]      /* Ends with */
[href*="example"]   /* Contains */
[class~="active"]   /* Word in list */
```

## Common Scraping Selectors

### Articles / Blog Posts
```css
article                          /* Article container */
article h2, article h1          /* Article title */
article .content, article p     /* Article body */
article time, .date, .published /* Date */
article .author, .byline        /* Author */
article img                     /* Images */
.tags a, .categories a          /* Tags/categories */
```

### Tables
```css
table                           /* Table container */
thead th                        /* Header cells */
tbody tr                        /* Data rows */
tbody td                        /* Data cells */
tbody tr:nth-child(n)           /* Specific row */
td:nth-child(2)                 /* Specific column */
```

### Lists / Cards
```css
.item, .card, .list-item        /* List item container */
.item h2, .card-title           /* Item title */
.item a[href]                   /* Item link */
.item .price, .item .value      /* Item value */
.item img, .card-image          /* Item image */
```

### Navigation / Pagination
```css
nav a, .nav-link                /* Navigation links */
.pagination a                   /* Page links */
.pagination .active             /* Current page */
a[rel="next"]                   /* Next page */
a[rel="prev"]                   /* Previous page */
button.load-more                /* Load more button */
```

### Forms
```css
form                            /* Form container */
input[name="q"]                 /* Search input */
select option                   /* Dropdown options */
input[type="hidden"]            /* Hidden fields (tokens) */
```

## Korean Website Patterns

Common selectors for Korean websites:

```css
/* News sites */
.article_body, .news_body       /* Article content */
.article_title, .news_title     /* Headlines */
.press_logo, .media_name        /* Source */

/* Government/institutional */
.bbs_list tr                    /* Board list */
.board_view .content            /* Detail view */
.paging a                       /* Pagination */

/* E-commerce */
.product_info                   /* Product details */
.price_area .sale               /* Sale price */
.review_section .review_item    /* Reviews */
```

## XPath (When CSS Can't)

Use XPath only when CSS selectors aren't sufficient:

```xpath
//text()[contains(., 'keyword')]                 /* Find by text content */
//div[contains(@class, 'partial')]               /* Partial class match */
//a[starts-with(@href, '/items/')]               /* Href prefix */
//table/tr[position() > 1]                       /* Skip header row */
//div[@class='item'][last()]                     /* Last matching element */
//h2/following-sibling::p[1]                     /* First p after h2 */
//*[not(self::script) and not(self::style)]//text()  /* All visible text */
```

## selectolax vs BeautifulSoup

| Feature | selectolax | BeautifulSoup |
|---------|------------|---------------|
| Speed | **5-30× faster** | Slower |
| CSS Selectors | `.css()`, `.css_first()` | `.select()`, `.select_one()` |
| Text extraction | `.text(strip=True)` | `.get_text(strip=True)` |
| Attributes | `.attrs["href"]` | `["href"]` or `.get("href")` |
| XPath | ❌ Not supported | ❌ (use lxml) |
| Install | `pip install selectolax` | `pip install beautifulsoup4` |

**Recommendation**: Use `selectolax` for speed. Fall back to `BeautifulSoup` only
when you need its lenient parser for malformed HTML.
