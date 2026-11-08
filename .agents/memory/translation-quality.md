---
name: Generated translation quality checks
description: Quality checks for AI-generated Amharic course and glossary content.
---

For generated Amharic datasets, check for unexpected writing systems (such as Cyrillic, Hangul, or CJK characters) and inspect the surrounding translation before shipping. Preserve intended Latin acronyms and numeric formulas.

**Why:** Generated text can contain an isolated character from another language inside an otherwise fluent-looking sentence, which ordinary visual review can miss.

**How to apply:** Run a Unicode-script scan over every newly generated Amharic data file, then manually review flagged strings and sample key course content. Describe the review as best-effort unless a qualified native reviewer has checked it.
