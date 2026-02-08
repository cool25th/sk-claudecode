---
name: document-processing
description: Create, edit, and analyze PDF, PPTX, XLSX, DOCX, and CSV documents. Use when working with spreadsheets, presentations, reports, or any structured document format.
---

# Document Processing Skill

Expert document handler that creates, edits, analyzes, and transforms structured documents across all major office formats.

## Supported Formats

| Format | Create | Edit | Analyze | Max Size |
|--------|--------|------|---------|----------|
| **PDF** | ✅ | ✅ | ✅ (text + visual, up to 100 pages) | 30MB |
| **PPTX** (PowerPoint) | ✅ | ✅ | ✅ | 30MB |
| **XLSX** (Excel) | ✅ | ✅ | ✅ (formulas, multi-sheet) | 30MB |
| **DOCX** (Word) | ✅ | ✅ | ✅ | 30MB |
| **CSV** | ✅ | ✅ | ✅ | 30MB |

---

## Workflow

### Step 1: Understand the Request

Classify the task type:

| Task | Action |
|------|--------|
| **Create** | Generate a new document from scratch |
| **Edit** | Modify an existing uploaded document |
| **Analyze** | Extract insights, summarize, or answer questions about a document |
| **Transform** | Convert between formats (e.g., CSV → XLSX, data → PPTX) |

### Step 2: Format-Specific Guidelines

#### PDF Documents
- **Reading**: Analyze both text and visual elements (charts, tables, images)
- **Creating**: Use for final reports, contracts, formal documentation
- **Large PDFs** (100+ pages): Focus on text extraction; visual analysis limited
- **Best practice**: When creating PDFs from data, structure with clear headings and page breaks

#### PPTX Presentations
- **Structure**: Title slide → Content slides → Summary/CTA
- **Design rules**:
  - One key message per slide
  - Maximum 6 bullet points per slide
  - Use speaker notes for detailed explanations
  - Consistent font sizing (Title: 36pt, Body: 24pt, Notes: 14pt)
- **Brand consistency**: Recognize and maintain existing layouts, fonts, slide masters
- **Data → Slides**: Process data in structured format first, then create visual slides

#### XLSX Spreadsheets
- **Formulas**: Preserve formula dependencies when editing
- **Multi-sheet**: Support multiple tabs for organized data
- **Features**: Pivot tables, charts, conditional formatting, data validation
- **Best practices**:
  - Header row in row 1
  - One data type per column
  - No merged cells in data ranges
  - Named ranges for formula references
- **Analysis**: Summarize datasets, detect patterns, explain calculations

#### DOCX Documents
- **Structure**: Use proper heading hierarchy (H1 → H2 → H3)
- **Styles**: Apply consistent paragraph and character styles
- **Tables**: Use for structured data, keep formatting clean
- **Headers/Footers**: Include page numbers, document title, date

#### CSV Files
- **Encoding**: Default to UTF-8
- **Delimiter**: Comma (,) unless specified otherwise
- **Headers**: Always include header row
- **Quoting**: Quote fields containing commas, newlines, or quotes

### Step 3: Quality Checklist

Before delivering any document:

- [ ] Content is accurate and complete
- [ ] Formatting is consistent throughout
- [ ] Fonts and sizes are uniform
- [ ] Colors follow a cohesive palette
- [ ] Tables/charts are properly labeled
- [ ] No placeholder text remaining
- [ ] File is within 30MB size limit
- [ ] Document opens correctly in target application

---

## Common Workflows

### Data Analysis Pipeline
```
1. Upload XLSX/CSV → Analyze patterns
2. Generate insights summary
3. Create PPTX with visualizations
4. Export PDF report
```

### Report Generation
```
1. Gather data from multiple sources
2. Structure in DOCX with headings
3. Add tables and charts
4. Export as PDF for distribution
```

### Presentation from Research
```
1. Analyze source documents (PDF/DOCX)
2. Extract key findings
3. Create PPTX with one insight per slide
4. Add speaker notes with supporting data
```

---

## Anti-Patterns (NEVER)

- Don't create documents with inconsistent formatting
- Don't ignore existing brand/style guidelines in uploaded files
- Don't merge cells unnecessarily in spreadsheets
- Don't exceed 30MB file size limit
- Don't use placeholder content ("Lorem ipsum")
- Don't skip headers in data files
- Don't break formula references when editing XLSX

---

## Related Skills

- `/skill humanizer` - Remove AI writing patterns from document text
- `/skill docs` - Technical documentation generation
- `/skill writer-memory` - Persistent writing context

## Related Agents

- `document-writer` - Document creation and analysis specialist (Sonnet)
- `writer` - Technical documentation writer
