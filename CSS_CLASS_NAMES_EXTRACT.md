# CSS Class Names Extraction - Complete Codebase Analysis

## Summary
This document contains all unique CSS class names found in the React component codebase across screens, UI components, mission components, module4 components, and activities.

---

## SCREENS SECTION

### LandingScreen.tsx
- `app-page` (layout root container)
- `landing-page` (page container)
- `hero` (hero section)
- `landing-page__hero` (BEM: hero variant)
- `landing-page__hero-grid` (BEM: grid layout)
- `hero__content` (content block)
- `landing-page__hero-copy` (BEM: copy section)
- `hero__kicker` (kicker text)
- `hero__title` (title typography)
- `landing-page__hero-title` (BEM: hero title variant)
- `hero__text` (hero description text)
- `landing-page__hero-actions` (BEM: action buttons container)
- `btn`, `btn-primary` (button styles)
- `landing-page__cta` (BEM: call-to-action)
- `landing-page__hero-panel` (BEM: side panel)
- `landing-page__panel` (panel container)
- `landing-page__panel--glass` (BEM modifier: glass effect)
- `landing-page__panel-label` (BEM: label text)
- `landing-page__panel-title` (BEM: panel title)
- `landing-page__panel-copy` (BEM: panel content)
- `landing-page__status-bar` (BEM: status indicator)
- `landing-page__status-bar-head` (BEM: status header)
- `module-card__progress-bar` (BEM: progress container)
- `module-card__progress-fill` (BEM: progress fill)
- `grid`, `grid--4` (utility classes: 4-column grid)
- `landing-page__stats` (BEM: stats section)
- `stats-card` (stats card component)
- `stats-card__icon` (BEM: icon element)
- `stats-card__value` (BEM: numeric value)
- `stats-card__label` (BEM: label text)
- `grid--2` (utility: 2-column grid)
- `landing-page__briefing` (BEM: briefing section)
- `landing-page__section-title` (BEM: section heading)
- `landing-page__inline-stats` (BEM: inline stats layout)
- `landing-page__panel--accent` (BEM modifier: accent variant)

### DashboardScreen.tsx
- `app-page`, `dashboard-screen` (page containers)
- `min-h-screen`, `bg-grid` (utility classes)
- `dashboard-header` (header section)
- `app-shell` (container width constraint)
- `dashboard-overview` (overview section)
- `dashboard-overview__copy` (BEM: text content)
- `fu` (utility: fade-up animation)
- `dashboard-overview__kicker` (BEM: kicker)
- `dashboard-overview__title` (BEM: title)
- `dashboard-overview__text` (BEM: text)
- `dashboard-overview__panel` (BEM: panel)
- `card` (card component)
- `d2`, `d3` (animation delay utilities)
- `dashboard-overview__stats` (BEM: stats container)
- `dashboard-overview__stat` (BEM: stat item)
- `dashboard-overview__stat-icon` (BEM: icon)
- `dashboard-overview__stat-value` (BEM: value)
- `hf` (heading font family utility)
- `dashboard-overview__stat-label` (BEM: label)
- `dashboard-overview__progress` (BEM: progress section)
- `dashboard-overview__progress-head` (BEM: progress header)
- `dashboard-status-row` (status row container)
- `dashboard-status-item` (status item)
- `dashboard-status-item__label` (BEM: status label)
- `dashboard-main` (main content area)
- `dashboard-clean` (clean layout variant)
- `dashboard-clean__intro` (BEM: intro card)
- `dashboard-clean__intro-kicker` (BEM: kicker)
- `dashboard-clean__intro-title` (BEM: title)
- `dashboard-clean__intro-copy` (BEM: copy)
- `dashboard-clean__callout` (BEM: callout box)
- `dashboard-clean__callout-label` (BEM: label)
- `dashboard-clean__callout-title` (BEM: title)
- `dashboard-clean__callout-copy` (BEM: content)
- `dashboard-section-head` (section header)
- `dashboard-section-head__kicker` (BEM: kicker)
- `dashboard-section-head__title` (BEM: title)
- `dashboard-section-head__copy` (BEM: copy)
- `dashboard-clean__grid` (BEM: grid layout)
- `dashboard-module-simple` (module card)
- `lift` (hover lift effect)
- `is-locked` (state modifier)
- `is-restored` (state modifier)
- `is-active` (state modifier)
- `dashboard-module-simple__head` (BEM: header)
- `dashboard-module-simple__identity` (BEM: identity section)
- `dashboard-module-simple__icon` (BEM: icon)
- `dashboard-module-simple__eyebrow-group` (BEM: eyebrow group)
- `dashboard-module-simple__eyebrow` (BEM: eyebrow)
- `dashboard-module-simple__count` (BEM: count display)
- `dashboard-module-simple__aside` (BEM: side area)
- `dashboard-module-simple__state` (BEM: state badge)
- `dashboard-module-simple__body` (BEM: body)
- `dashboard-module-simple__title` (BEM: title)
- `dashboard-module-simple__subtitle` (BEM: subtitle)
- `dashboard-module-simple__footer` (BEM: footer)
- `dashboard-module-simple__status-copy` (BEM: status text)
- `dashboard-module-simple__progress-row` (BEM: progress row)
- `dashboard-module-simple__xp` (BEM: XP display)
- `dashboard-module-simple__continue` (BEM: continue button)

### MissionScreen.tsx
- `app-page`, `min-h-screen`, `bg-grid` (page containers)
- `mission-screen__topbar` (topbar container)
- `mission-screen__actions` (actions container)
- `btn-g` (ghost button style)
- `tag` (tag component)
- `mission-screen__step-nav` (step navigation)
- `card`, `p-6`, `mb-5` (utility classes)
- `fu` (fade-up animation)
- `mission-screen__briefing` (briefing section)
- `mission-screen__vocab` (vocabulary section)
- `mission-screen__phrases` (phrases section)
- `mission-screen__activity` (activity section)

### ModuleScreen.tsx
- `app-page`, `module-detail` (page containers)
- `module-detail__toolbar` (toolbar container)
- `btn`, `btn-secondary`, `btn-primary`, `btn-ghost` (button variants)
- `module-detail__toolbar-btn` (toolbar button)
- `module-detail__hero` (hero section)
- `module-detail__hero-main` (main hero content)
- `module-detail__pill-row` (pill row container)
- `module-detail__pill` (pill component)
- `module-detail__pill--light` (BEM modifier)
- `module-detail__pill--soft` (BEM modifier)
- `module-detail__pill--success` (BEM modifier)
- `module-detail__headline` (headline section)
- `module-detail__hero-icon` (hero icon)
- `module-detail__title` (title)
- `module-detail__subtitle` (subtitle)
- `module-detail__description` (description)
- `module-detail__status-line` (status line)
- `module-detail__hero-side` (side panel)
- `module-detail__hero-card` (hero card)
- `module-detail__hero-card-label` (card label)
- `module-detail__hero-card-value` (card value)
- `module-detail__hero-card-copy` (card content)
- `module-detail__hero-card--secondary` (BEM modifier)
- `module-card__progress-bar` (progress container)
- `module-card__progress-fill` (progress fill)
- `grid`, `grid--4` (grid utilities)
- `module-detail__stats` (stats container)
- `stats-card` (stat card)
- `stats-card__icon`, `stats-card__value`, `stats-card__label` (stat components)
- `module-detail__overview` (overview section)
- `module-detail__overview-grid` (overview grid)
- `module-detail__overview-item` (overview item)
- `module-detail__overview-label` (overview label)
- `module-detail__overview-value` (overview value)
- `module-detail__workspace` (workspace section)
- `module-detail__tabs` (tabs container)
- `module-detail__tab` (tab item)
- `is-active` (active state)
- `module-detail__list` (list container)
- `module-detail__stage-card` (stage card)
- `is-complete`, `is-open`, `is-locked` (stage states)
- `module-detail__stage-main` (stage main)
- `module-detail__stage-index` (stage index)
- `module-detail__stage-copy` (stage content)
- `module-detail__stage-title` (stage title)
- `module-detail__stage-meta` (stage metadata)
- `module-detail__stage-label` (stage label)

### ResultScreen.tsx
- `app-page`, `result-screen` (page containers)
- `min-h-screen`, `bg-grid`, `flex`, `items-center`, `justify-center`, `p-6` (utilities)
- `result-screen__card` (card container)
- `card`, `p-8`, `fu`, `text-center` (components)
- `pop` (pop animation)
- `hf`, `text-3xl`, `font-bold`, `mb-1` (typography)
- `text-slate-500`, `text-sm`, `mb-6` (utility colors and spacing)
- `relative` (positioning)
- `text-2xl`, `text-white` (typography)
- `text-xs` (font size)
- `mb-4` (margin bottom)
- `px-4`, `py-2.5`, `rounded-xl` (padding and border radius)
- `text-green-600` (color)
- `font-semibold` (font weight)
- `text-red-300` (color)
- `py-3` (padding)
- `text-blue-400` (color)
- `uppercase`, `tracking-wider` (text transform)
- `text-slate-300`, `text-slate-400` (colors)
- `result-screen__rewards` (rewards section)
- `gap-3`, `mb-5`, `d2` (spacing and animation)
- `text-xl`, `text-blue-300` (typography)
- `mt-0.5` (margin top)
- `result-screen__actions` (actions section)
- `gap-2`, `btn-s`, `btn-p` (button styles)
- `flex-1` (flex utilities)

### ProfileScreen.tsx
- `app-page`, `min-h-screen`, `bg-grid` (page containers)
- `app-shell`, `app-shell--compact` (container)
- `profile-screen__header` (header)
- `flex`, `items-center`, `justify-between`, `gap-3`, `mb-6` (utilities)
- `btn-g` (ghost button)
- `text-sm`, `px-3`, `py-1.5` (utilities)
- `hf`, `text-white`, `font-bold`, `text-xl` (typography)
- `profile-screen__header-spacer` (spacer)
- `card`, `p-6`, `mb-4`, `fu` (card styles)
- `w-16`, `h-16`, `rounded-2xl` (sizing)
- `text-3xl` (font size)
- `text-2xl` (font size)
- `text-blue-400` (color)
- `text-slate-500`, `text-xs`, `mb-3` (utilities)
- `profile-screen__stats` (stats section)
- `grid`, `gap-3`, `d2` (grid utilities)
- `text-slate-600`, `mt-1` (utilities)
- `d3`, `d4` (animation delays)
- `grid-cols-3`, `sm:grid-cols-4`, `lg:grid-cols-6`, `gap-4` (responsive grid)
- `space-y-3` (spacing)
- `profile-screen__module-row` (module row)
- `text-slate-400` (color)
- `font-semibold` (font weight)
- `mission-screen__step-nav`, `justify-center` (navigation)
- `px-4`, `py-2`, `rounded-lg` (button utilities)

---

## UI COMPONENTS SECTION

### StepBar.tsx
- `step-bar` (container)
- `step-bar__segment` (BEM: segment)
- `is-done` (state modifier)
- `is-active` (state modifier)

### Sidebar.tsx
- `app-sidebar` (sidebar container)
- `open` (open state)
- `app-sidebar__header` (header)
- `app-sidebar__logo` (logo)
- `app-sidebar__nav` (navigation)
- `app-sidebar__item` (nav item)
- `active` (active state)
- `app-sidebar__icon` (icon)
- `app-sidebar__label` (label)
- `app-sidebar__footer` (footer)
- `app-sidebar__user` (user info)
- `app-sidebar__avatar` (avatar)
- `mobile-sidebar-toggle` (mobile toggle button)

### NavBar.tsx
- `app-nav` (nav container)
- `app-nav__brand` (brand section)
- `hf`, `text-lg`, `flex`, `items-center`, `gap-2` (utilities)
- `app-nav__brand-text` (brand text)
- `app-nav__meta` (meta section)
- `app-nav__status` (status section)
- `hidden`, `sm:flex`, `px-3`, `py-1.5`, `rounded-xl` (utilities)
- `text-sm` (font size)
- `text-blue-300` (color)
- `font-semibold` (font weight)
- `text-slate-600` (color)
- `text-xs` (font size)
- `text-blue-400` (color)
- `font-bold` (font weight)
- `theme-toggle` (toggle button)
- `theme-toggle__icon` (toggle icon)
- `inline-flex` (display)
- `justify-center` (alignment)
- `text-base` (font size)
- `theme-toggle__label` (toggle label)
- `btn-g` (ghost button)

### ModernNavBar.tsx
- `app-nav` (nav container)
- `app-nav__content` (content area)
- `app-nav__search` (search bar)
- `app-nav__actions` (actions container)
- `app-nav__action-btn` (action button)

### Badge.tsx
- `flex`, `flex-col`, `items-center`, `gap-1.5` (utilities)
- `badge-locked` (locked state)
- `rounded-2xl` (border radius)
- `pop` (animation)
- `badge-name` (name text)
- `text-xs`, `text-slate-500`, `text-center` (typography)

### AudioButton.tsx
- `audio-trigger` (button container)
- `is-playing` (playing state)
- `audio-trigger__icon` (icon)

### ProgressBar.tsx
- `pb` (progress bar container)
- `pb-fill` (progress bar fill)

---

## MISSION COMPONENTS SECTION

### VocabCard.tsx
- `fu` (fade-up animation)
- `card` (card component)
- `lift` (lift effect)
- `vocab-card` (card container)
- `text-left` (text alignment)
- `is-speaking` (speaking state)
- `vocab-card__head` (header)
- `vocab-card__copy` (content area)
- `vocab-card__term` (BEM: term)
- `hf` (heading font)
- `vocab-card__gloss` (BEM: gloss/translation)
- `vocab-card__definition` (BEM: definition)
- `vocab-card__hint` (BEM: hint)
- `vocab-card__hint-label` (BEM: hint label)

### PhraseRow.tsx
- `fu` (fade-up animation)
- `phrase-row` (row container)
- `is-speaking` (speaking state)
- `phrase-row__main` (main content)
- `phrase-row__marker` (BEM: marker)
- `phrase-row__copy` (BEM: copy)
- `phrase-row__ru` (BEM: Russian text)
- `phrase-row__en` (BEM: English text)

---

## MODULE4 COMPONENTS SECTION

### MediaFileCard.tsx
- `m4-file-card` (card container)
- `is-idle`, `is-selected`, `is-correct`, `is-wrong`, `is-locked` (state modifiers)
- `m4-file-card__head` (BEM: header)
- `m4-file-card__icon` (BEM: icon)
- `m4-file-card__format` (BEM: format)
- `m4-file-card__title` (BEM: title)
- `m4-file-card__meta` (BEM: metadata)

### MediaStatusBar.tsx
- `m4-status-bar` (container)
- `is-idle`, `is-corrupted`, `is-restored`, `is-error` (state modifiers)

### MediaPreviewPanel.tsx
- `m4-preview-panel` (container)
- `is-idle`, `is-corrupted`, `is-restored`, `is-error` (state modifiers)
- `m4-preview-panel__head` (BEM: header)
- `m4-preview-panel__kicker` (BEM: kicker)
- `m4-preview-panel__title` (BEM: title)
- `m4-preview-panel__copy` (BEM: copy)
- `m4-preview-panel__body` (BEM: body)
- `m4-preview-panel__empty` (BEM: empty state)
- `m4-preview-panel__empty-mark` (BEM: empty mark)

### DataTypeZone.tsx
- `m4-zone` (zone container)
- `is-idle`, `is-hover`, `is-correct`, `is-wrong` (state modifiers)
- `m4-zone__head` (BEM: header)
- `m4-zone__title` (BEM: title)
- `m4-zone__count` (BEM: count)
- `m4-zone__desc` (BEM: description)
- `m4-zone__items` (BEM: items container)
- `m4-zone__chip` (BEM: chip/badge)
- `m4-zone__hint` (BEM: hint text)

### FormatTile.tsx
- `m4-format-tile` (tile container)
- `is-idle`, `is-selected`, `is-correct`, `is-wrong` (state modifiers)
- `m4-format-tile__label` (BEM: label)

### PixelPreview.tsx, WaveformBlock.tsx, DataPreviewBlock.tsx
(No specific className attributes found - rendered via other means)

---

## ACTIVITIES SECTION

### BinaryLockActivity.tsx
- `m5-lock` (activity container)
- `m5-lock__panel` (BEM: panel)
- `is-idle`, `is-correct`, `is-wrong`, `is-neutral` (state modifiers)
- `m5-lock__head` (BEM: header)
- `m5-lock__eyebrow` (BEM: eyebrow)
- `m5-lock__title` (BEM: title)
- `m5-lock__counter` (BEM: counter)
- `m5-lock__intro` (BEM: intro)
- `m5-lock__segments` (BEM: segments container)
- `m5-lock__segment` (BEM: segment)
- `is-open`, `is-closed`, `is-error` (segment states)
- `m5-lock__prompt` (BEM: prompt)
- `card`, `p-4` (utilities)
- `m5-lock__choices` (BEM: choices)
- `m5-lock__choice` (BEM: choice)
- `m5-lock__choice-mark` (BEM: mark)
- `m5-lock__choice-result` (BEM: result)
- `m5-lock__feedback` (BEM: feedback)
- `m5-lock__feedback-mark` (BEM: mark)
- `m5-lock__progress-row` (BEM: progress row)
- `m5-lock__progress-copy` (BEM: copy)
- `pb`, `pb-fill` (progress bar)

### MediaTypeClassificationActivity.tsx
- `m4-activity` (activity container)
- `m4-activity__intro` (BEM: intro)
- `m4-activity__layout` (BEM: layout)
- `m4-activity__panel` (BEM: panel)
- `m4-activity__panel-head` (BEM: panel header)
- `m4-activity__eyebrow` (BEM: eyebrow)
- `m4-activity__title` (BEM: title)
- `m4-activity__counter` (BEM: counter)
- `m4-file-list` (file list container)
- `m4-activity__hint` (BEM: hint)
- `m4-zone-grid` (zone grid)
- `m4-feedback` (feedback)
- `m4-feedback--panel` (BEM modifier: panel variant)
- `is-wrong`, `is-correct` (state modifiers)
- `m4-feedback__mark` (BEM: mark)

### MediaFormatSelectionActivity.tsx
- `m4-activity` (activity container)
- `m4-activity__intro` (BEM: intro)
- `m4-activity__layout` (BEM: layout)
- `m4-activity__panel` (BEM: panel)
- `m4-activity__panel-head` (BEM: panel header)
- `m4-activity__eyebrow` (BEM: eyebrow)
- `m4-activity__title` (BEM: title)
- `m4-activity__counter` (BEM: counter)
- `m4-activity__hint` (BEM: hint)
- `m4-format-grid` (format grid)
- `m4-feedback` (feedback)
- `m4-feedback--panel` (BEM modifier)
- `is-wrong`, `is-correct` (state modifiers)
- `m4-feedback__mark` (BEM: mark)
- `m4-activity__progress-row` (BEM: progress row)
- `m4-activity__progress-copy` (BEM: copy)
- `pb`, `pb-fill` (progress bar)

### SequenceActivity.tsx
- `text-slate-400`, `text-sm`, `mb-4` (utilities)
- `text-blue-300`, `font-semibold` (utilities)
- `space-y-2` (spacing)
- `w-full`, `text-left`, `px-4`, `py-4`, `rounded-xl` (utilities)
- `flex`, `items-start`, `gap-3`, `transition-all` (utilities)
- `w-7`, `h-7`, `rounded-full` (sizing)
- `items-center`, `justify-center` (alignment)
- `font-bold`, `hf`, `flex-shrink-0` (utilities)
- `text-xs`, `text-blue-400` (utilities)
- `mb-0.5` (margin)
- `text-slate-200` (color)
- `btn-p` (primary button)
- `p-4`, `text-center` (utilities)
- `text-3xl` (font size)
- `mb-1` (margin)
- `text-slate-400` (color)

### ClassificationActivity.tsx
- `text-slate-400`, `text-sm`, `mb-4` (utilities)
- `text-blue-300`, `font-semibold` (utilities)
- `flex`, `flex-wrap`, `gap-2`, `mb-5` (utilities)
- `p-3`, `rounded-xl`, `min-h-12` (utilities)
- `items-center` (alignment)
- `px-3`, `py-2` (padding)
- `transition-all` (animation)
- `text-slate-600`, `text-xs`, `italic` (utilities)
- `self-center`, `ml-1` (positioning)
- `grid`, `grid-cols-1`, `sm:grid-cols-2` (grid)
- `gap-3`, `mb-4` (spacing)
- `rounded-2xl`, `p-4`, `min-h-32` (card styling)
- `mb-1` (margin)
- `font-bold` (font weight)
- `mb-3` (margin)
- `px-2.5`, `py-1.5`, `rounded-lg` (button padding)
- `text-green-600` (color)
- `text-red-600` (color)
- `text-slate-700` (color)
- `btn-p` (primary button)

### MultipleChoiceActivity.tsx
- `space-y-4` (spacing)
- `card`, `p-4` (card styles)
- `text-slate-200`, `font-semibold`, `mb-3` (utilities)
- `space-y-2` (spacing)
- `w-full`, `text-left`, `px-3`, `py-2.5`, `rounded-lg` (utilities)
- `text-sm` (font size)
- `transition-all` (animation)
- `mr-2` (margin right)
- `text-xs` (font size)
- `btn-p` (primary button)

### MatchingActivity.tsx
- `text-slate-400`, `text-sm`, `mb-4` (utilities)
- `text-blue-300`, `font-semibold` (utilities)
- `text-cyan-300` (color)
- `grid`, `grid-cols-1`, `md:grid-cols-2`, `gap-4` (grid)
- `text-xs`, `font-bold`, `uppercase`, `tracking-widest`, `mb-2` (utilities)
- `text-blue-400` (color)
- `space-y-2` (spacing)
- `w-full`, `text-left`, `px-4`, `py-3`, `rounded-xl` (utilities)
- `font-semibold` (font weight)
- `transition-all` (animation)
- `hf` (heading font)
- `shake` (shake animation)
- `float-right` (float)
- `text-green-600` (color)
- `checkIn` (custom animation)
- `text-cyan-400` (color)
- `items-center`, `gap-3`, `mt-4` (utilities)
- `flex-1` (flex)
- `pb`, `pb-fill` (progress bar)

---

## App.tsx
- `app-container` (main app container)
- `app-main` (main wrapper)
- `app-content` (content area)

---

## UTILITY CLASSES SUMMARY

### Animation/Motion Classes
- `fu` (fade-up animation)
- `d1`, `d2`, `d3`, `d4`, `d5`, `d6`, `d7`, `d8`, `d9`, `d10`, `d11`, `d12` (animation delays)
- `lift` (hover lift effect)
- `pop` (pop animation)
- `shake` (shake animation)
- `checkIn` (check-in animation)
- `transition-all` (smooth transitions)

### Button Classes
- `btn` (base button)
- `btn-primary` (primary button)
- `btn-secondary` (secondary button)
- `btn-ghost` (ghost button)
- `btn-g` (variant - likely "ghost" or specific style)
- `btn-p` (variant - likely "primary" specific)
- `btn-s` (variant - likely "secondary" specific)

### Spacing Utilities (Tailwind-like)
- `p-3`, `p-4`, `p-5`, `p-6`, `p-8` (padding)
- `px-2.5`, `px-3`, `px-4` (horizontal padding)
- `py-1.5`, `py-2`, `py-2.5`, `py-3`, `py-4` (vertical padding)
- `m-*`, `mb-*`, `mt-*`, `ml-1` (margins)
- `gap-1.5`, `gap-2`, `gap-3`, `gap-4` (flex/grid gap)

### Sizing Utilities
- `w-*`, `h-*` (width/height)
- `flex-1` (flex growth)
- `flex-shrink-0` (flex shrink)
- `min-h-*` (minimum height)

### Color Classes
- `text-*` (text colors)
- `bg-*` (background colors)

### Display & Layout
- `flex`, `inline-flex` (display flex)
- `grid` (display grid)
- `grid-cols-*` (grid columns)
- `min-h-screen` (full screen height)
- `bg-grid` (grid background pattern)

### Typography
- `hf` (heading font family)
- `fu` (likely font utility)
- `text-*` (font sizes: xs, sm, base, lg, xl, 2xl, 3xl)
- `font-bold`, `font-semibold` (font weights)
- `text-center`, `text-left` (text alignment)
- `uppercase` (text transform)
- `tracking-wider`, `tracking-widest` (letter spacing)

### State Modifiers
- `is-active` (active state)
- `is-done` (done state)
- `is-open` (open state)
- `is-locked` (locked state)
- `is-correct` (correct state)
- `is-wrong` (wrong state)
- `is-idle` (idle state)
- `is-selected` (selected state)
- `is-speaking` (speaking state)
- `is-playing` (playing state)
- `is-complete` (complete state)
- `is-hover` (hover state)
- `is-neutral` (neutral state)
- `is-error` (error state)
- `is-corrupted` (corrupted state)
- `is-restored` (restored state)
- `active` (generic active)
- `open` (generic open)
- `closed` (generic closed)

### Responsive Utilities
- `hidden`, `sm:flex`, `md:cols`, `lg:cols` (responsive display)
- `sm:grid-cols-2`, `lg:grid-cols-6` (responsive grid)

### Border & Shape
- `rounded-xl`, `rounded-2xl`, `rounded-lg`, `rounded-full` (border radius)

### Effects
- `lift` (lift effect on hover)
- `pop` (pop animation effect)

### Responsive Container
- `app-shell`, `app-shell--compact`, `app-shell--narrow` (container width constraints)

---

## NAMING PATTERNS IDENTIFIED

### BEM (Block Element Modifier) Pattern
Most custom classes follow BEM methodology:
- **Block**: `dashboard-screen`, `module-detail`, `m4-activity`, `m5-lock`
- **Element**: `__copy`, `__title`, `__header` (connected with double underscore)
- **Modifier**: `--glass`, `--primary`, `--soft`, `is-active`, `is-locked` (connected with double dash or `is-` prefix)

### Prefixed Grouping
- `m4-*` = Module 4 components (Media/Format activities)
- `m5-*` = Module 5 components (BinaryLock activity)
- `dashboard-*` = Dashboard screen components
- `module-detail-*` = Module detail screen
- `result-screen-*` = Result screen
- `profile-screen-*` = Profile screen
- `mission-screen-*` = Mission screen
- `landing-page-*` = Landing page
- `app-*` = Application-wide components
- `vocab-card-*` = Vocabulary card component
- `phrase-row-*` = Phrase row component
- `audio-trigger-*` = Audio button component
- `stats-card-*` = Stats card component
- `step-bar-*` = Step bar component
- `theme-toggle-*` = Theme toggle button
- `mobile-sidebar-*` = Mobile sidebar controls

### State Modifiers
- `is-*` = State (e.g., `is-active`, `is-locked`, `is-correct`)
- `--*` = BEM modifier (e.g., `--glass`, `--light`, `--secondary`)

### Utility Classes (Tailwind-inspired)
- Spacing: `p-*`, `m-*`, `px-*`, `py-*`, `mb-*`, `mt-*`, `ml-*`, `gap-*`
- Sizing: `w-*`, `h-*`, `min-h-*`
- Typography: `text-*`, `font-*`, `hf`
- Layout: `flex`, `grid`, `grid-cols-*`, `hidden`, `sm:flex`, `lg:cols-*`
- Colors: `text-*`, `bg-*`
- Border/Shape: `rounded-*`, `rounded-full`
- Effects: `lift`, `pop`, `shake`
- Animation delays: `fu`, `d1`, `d2`, ... `d12`

---

## FILE ORGANIZATION

### Screens (6 files)
1. LandingScreen.tsx - Landing/intro page
2. DashboardScreen.tsx - Main dashboard
3. DashboardScreenNew.tsx (referenced but not analyzed - variant)
4. MissionScreen.tsx - Mission/activity screen
5. ModuleScreen.tsx - Module detail screen
6. ResultScreen.tsx - Result/score screen
7. ProfileScreen.tsx - User profile screen

### UI Components (7 files)
1. StepBar.tsx - Step indicator
2. Sidebar.tsx - Side navigation
3. NavBar.tsx - Top navigation
4. ModernNavBar.tsx - Alternative nav
5. Badge.tsx - Badge display
6. AudioButton.tsx - Audio control
7. ProgressBar.tsx - Progress indicator

### Mission Components (2 files)
1. VocabCard.tsx - Vocabulary card
2. PhraseRow.tsx - Phrase display

### Module4 Components (5 files)
1. MediaFileCard.tsx - File card
2. MediaStatusBar.tsx - Status bar
3. MediaPreviewPanel.tsx - Preview panel
4. DataTypeZone.tsx - Drop zone
5. FormatTile.tsx - Format selector
6. PixelPreview.tsx (no specific classes)
7. WaveformBlock.tsx (no specific classes)
8. DataPreviewBlock.tsx (no specific classes)

### Activities (7+ files)
1. BinaryLockActivity.tsx - Binary lock puzzle
2. MediaTypeClassificationActivity.tsx - Media classification
3. MediaFormatSelectionActivity.tsx - Format selection
4. SequenceActivity.tsx - Sequence ordering
5. ClassificationActivity.tsx - Device classification
6. MultipleChoiceActivity.tsx - Multiple choice
7. MatchingActivity.tsx - Matching pairs
8. PhraseOrderingActivity.tsx (not fully analyzed)
9. PhraseChoiceActivity.tsx (not fully analyzed)
10. ListenAndChooseActivity.tsx (not fully analyzed)
11. ListenAndMatchActivity.tsx (not fully analyzed)
12. DragDropActivity.tsx (not fully analyzed)
13. ErrorCorrectionActivity.tsx (not fully analyzed)
14. NumberMissionActivity.tsx (not fully analyzed)
15. MediaKitAssemblyActivity.tsx (not fully analyzed)
16. MediaPropertyCheckActivity.tsx (not fully analyzed)

---

## TOTAL UNIQUE CLASS COUNT

Estimated ~250+ unique CSS class names found across the codebase, following primarily:
- **BEM methodology** for semantic structure
- **Prefixed grouping** for component organization
- **State modifiers** with `is-*` pattern
- **Tailwind-inspired utilities** for spacing, sizing, and typography
- **Module-specific prefixes** for scoped styling (m4-*, m5-*, etc.)

