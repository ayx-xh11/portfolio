# Product Requirements Document: Interactive Gravity Portfolio

**Status:** Draft for design and implementation  
**Version:** 1.0  
**Product type:** Personal portfolio website  
**Primary platform:** Responsive web  
**Reference implementation:** `src/index.htm` and `src/css/style.css`

## 1. Product vision

Create a memorable personal portfolio that presents the owner's achievements, skills, projects, experience, and contact information in a clear professional format. The site should retain the compact, dark visual language of the current portfolio while introducing a distinctive interactive surface: the page below the navbar is visually divided into small square cells that respond to pointer movement as if a localized gravity field follows the cursor.

The experience should feel technical, polished, and playful without allowing the animation to compete with the portfolio content.

## 2. Problem statement

Most portfolio websites communicate information but are difficult to remember. This portfolio needs to do both:

- Let recruiters, collaborators, and clients understand the owner's capabilities quickly.
- Give visitors a distinctive interaction they will associate with the owner.
- Keep important information easy to scan even while a large part of the visual identity is animated.
- Work well for visitors using a mouse, touch, keyboard, reduced-motion settings, or lower-powered devices.

## 3. Goals

### Primary goals

1. Present the owner's identity, skills, achievements, projects, experience, and contact options in a complete portfolio.
2. Preserve the visual foundation already established in the reference site.
3. Make the cursor-driven square gravity field the site's signature interaction.
4. Keep navigation and portfolio content legible, responsive, accessible, and fast.
5. Structure the product so more advanced animation can be added later without rewriting the content layer.

### Success indicators

- A visitor can identify who the owner is, what they do, and their strongest work within 10 seconds.
- Every primary section is reachable from the navbar and by normal page scrolling.
- Project and contact actions remain usable when animation is disabled.
- Pointer animation remains visually smooth on a typical modern laptop and does not delay input or scrolling.
- The layout works without horizontal scrolling at 375 px, 768 px, 1024 px, and 1440 px viewport widths.
- The site earns strong automated accessibility and performance results, with a target Lighthouse score of at least 90 in each category on the production build.

## 4. Non-goals for the first release

- A CMS, user accounts, admin dashboard, or database.
- A blog authoring system. Posts may link to external or static pages.
- Heavy 3D scenes, WebGL-only navigation, or animation required to understand content.
- Theme switching. The first release uses the existing dark theme.
- Moving the navbar in response to pointer gravity.
- Final advanced page-transition choreography; the first release only establishes animation-ready structure and the gravity interaction.

## 5. Target audience

### Primary audiences

- Recruiters and hiring managers evaluating skills and experience.
- Engineers and designers evaluating technical depth and craft.
- Potential clients or collaborators looking for relevant work and a contact path.

### Visitor needs

- Quickly understand the owner's role and specialization.
- See credible evidence through projects, achievements, experience, and links.
- Find a resume and contact details without hunting.
- Browse comfortably on desktop or mobile regardless of animation preferences.

## 6. Experience principles

1. **Content first:** Animation supports the story and never obscures text or actions.
2. **Stable navigation:** The navbar is visually and physically separate from the gravity surface.
3. **Progressive enhancement:** The complete portfolio works if JavaScript, pointer input, or animation is unavailable.
4. **Calm by default:** Movement is localized around the pointer rather than making the entire page continuously move.
5. **Consistent visual language:** New sections extend the current typography, colors, borders, and compact proportions.
6. **Evidence over claims:** Skills should be connected to projects, achievements, or experience wherever possible.

## 7. Existing design foundation

The current site is the source of truth for the initial visual direction.

### Typography

- Primary font stack: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`.
- Overall character: clean system sans-serif, compact, technical, and understated.
- Default body size must be at least 16 px for long-form text even though small metadata may remain more compact.
- Headings use weight and spacing for hierarchy; avoid introducing a second display font in the first release.

### Color tokens

| Token | Starting value | Use |
|---|---:|---|
| Page background | `#111111` | Main site canvas |
| Navbar surface | `rgba(32, 32, 32, 0.724)` | Stable top navigation |
| Primary text | `#FFFFFF` | Headings and high-emphasis copy |
| Secondary text | `gray` initially; refine to an accessible fixed value during implementation | Metadata and supporting copy |
| Border/grid line | `#27272A` | Cards, square grid, icon containers |
| Hover text | `rgba(255, 255, 255, 0.597)` initially; adjust if contrast is insufficient | Secondary hover treatment only |

Implementation must convert these into semantic CSS custom properties rather than scattering raw color values through components. Any refinement must preserve the same near-black, charcoal, white, and gray appearance while meeting WCAG contrast requirements.

### Shape and spacing

- Rounded cards: approximately 10 px radius.
- Thin, low-contrast borders.
- Centered content with a compact reading width based on the existing 50 rem container.
- Generous section separation with tighter spacing inside cards.
- Social and utility icons use consistent bordered containers and SVG assets.

### Visual tone

- Minimal, grid-based, high contrast, and technically minded.
- No decorative gradients, bright accent colors, glass effects, or unrelated visual styles in the first release.
- The square field supplies visual personality; the content UI stays restrained.

## 8. Information architecture

### Persistent navbar

The navbar remains outside the animated square field and includes:

- Owner name or wordmark linking to the top.
- About.
- Work/Experience.
- Projects.
- Achievements.
- Skills.
- Posts, only if real posts exist.
- Resume action.
- Contact or primary social link.

On smaller screens, navigation may collapse into an accessible menu. The menu must be keyboard operable, announce its expanded state, and preserve a clear close action.

### Page sections

1. **Hero / identity**
   - Name.
   - Professional title or one-line positioning statement.
   - Location and availability status when relevant.
   - Short introduction focused on outcomes and interests.
   - Primary actions: View projects and Contact me.
   - Secondary actions: Resume and social profiles.

2. **About**
   - Concise personal background.
   - Current focus.
   - Working style or values.
   - Optional portrait, optimized and given meaningful alternative text.

3. **Selected work / experience**
   - Role or engagement.
   - Organization/client.
   - Dates.
   - Responsibilities and measurable outcomes.
   - Technologies used.

4. **Projects**
   - Project name and one-sentence value proposition.
   - Problem, contribution, and result.
   - Technology tags.
   - Image or preview when available.
   - Live demo and source-code links where permitted.
   - Featured projects appear first; visitors may expand to view the rest.

5. **Achievements**
   - Awards, competition results, certifications, publications, milestones, or notable recognition.
   - Issuer, date, short context, and verification link when available.

6. **Skills / What I work with**
   - Grouped categories such as Languages, Frontend, Backend, Tools, and Design.
   - Proficiency is demonstrated through related work rather than arbitrary percentage bars.
   - Each skill may link or visually relate to one or more projects.

7. **Posts / notes** (optional for launch)
   - Title, date, topic, short summary, and destination link.
   - Hide the section and its navigation item if there is no real content.

8. **Contact**
   - Clear invitation to collaborate or connect.
   - Email and relevant social profiles.
   - Optional simple contact form only if a secure submission endpoint is selected.

9. **Footer**
   - Owner name, current year, core social links, and back-to-top action.

## 9. Signature interaction: gravity square field

### Concept

All page space below the navbar uses a tiled square field as a visual background layer. The grid creates the impression that the portfolio surface is assembled from many small cells. A localized gravity field follows mouse or trackpad movement and temporarily displaces nearby cells downward.

Portfolio text, cards, buttons, and media remain in a separate foreground layer. The effect must never split semantic content into squares or make text itself wobble.

### Desktop behavior

- The square field begins immediately below the navbar and extends through the full document height.
- Default cell size target: 24-40 px, responsive to viewport size and performance budget.
- Cells use the existing border color with very low visual contrast so the field reads as texture, not a checkerboard.
- Pointer position defines a circular influence area with a starting target radius of 120-180 px.
- Cells inside the influence area move slightly downward. Displacement is strongest near the pointer and fades smoothly toward the edge of the radius.
- Optional horizontal pull toward the pointer may be added at very low intensity if it improves the gravity illusion.
- Target maximum vertical displacement: approximately 8-18 px. Exact values will be tuned during prototyping.
- When the pointer moves away, cells return to their resting position with spring-like easing and no abrupt snapping.
- Pointer velocity may add a small delay or trailing wave, but the effect must settle quickly.
- Clicking is not required to trigger the effect. Normal links, text selection, and scrolling must remain unaffected.
- The navbar does not deform, displace, or inherit the grid effect.

### Touch and mobile behavior

- The interface must not depend on hover.
- On capable touch devices, a brief, low-amplitude ripple may follow an active touch, provided it does not interfere with scrolling.
- The default mobile implementation may use a static grid if continuous touch animation harms scrolling, battery life, or clarity.
- All content and actions remain identical whether the field is static or animated.

### Reduced-motion behavior

When `prefers-reduced-motion: reduce` is active:

- Render the square grid in its resting state.
- Disable cursor attraction, spring movement, trailing waves, parallax, and animated page transitions.
- Preserve hover/focus color feedback without spatial motion.
- Do not show an intermediate or empty animation state; content is immediately complete and usable.

### Implementation constraints

- Animate only `transform` and, if needed, `opacity`; do not animate layout properties such as `top`, `left`, `width`, or `height`.
- Schedule visual updates through `requestAnimationFrame` and avoid an update per raw pointer event.
- The field uses `pointer-events: none` and must never block buttons, links, selection, or scrolling.
- Pause or substantially reduce updates when the tab is hidden, the pointer leaves the interactive area, or the animation is off-screen.
- Prefer one canvas or another batched rendering method if a DOM cell implementation cannot meet the performance target.
- Cap pixel density and the number of simulated cells on high-resolution or small devices.
- The grid must not create layout shift.

### Animation acceptance criteria

- Content is fully usable before the animation initializes and if initialization fails.
- The effect reacts locally to the pointer and does not continuously animate distant cells.
- The field returns to rest after pointer movement stops or exits.
- The navbar remains stationary.
- There is no measurable input blocking during ordinary scrolling and navigation.
- No foreground text, controls, or cards are distorted by the field.
- Reduced-motion visitors receive a static experience.

## 10. Functional requirements

### Navigation

- Navbar links scroll or navigate to the correct section.
- The active section may be indicated without relying only on color.
- The navbar remains available while browsing long pages, unless usability testing favors a non-sticky treatment.
- Keyboard focus is always visible and is not hidden beneath a sticky navbar.

### Projects and achievements

- Data should be maintained separately from presentation markup so items can be reordered or expanded later.
- Cards use consistent fields and gracefully omit unavailable links or images.
- External links identify that they open an external destination; opening a new tab should be used sparingly and securely.

### Resume

- Provide a clear view/download action.
- The resume asset must have a stable filename or route and useful link text.

### Contact

- Email and social links work without requiring JavaScript.
- If a form is added, every input has a visible label, inline validation, submission feedback, spam protection, and an accessible error summary.

### Metadata and sharing

- Unique page title and concise meta description.
- Open Graph and social preview metadata.
- Favicon and share image consistent with the portfolio identity.
- Structured data may describe the owner and selected projects when content is finalized.

## 11. Responsive layout requirements

- Mobile-first layout with no horizontal page scrolling.
- Desktop retains the reference site's focused central column, expanded only where project media needs more room.
- Content cards stack into one column on narrow screens.
- Multi-column project or skill layouts collapse in a predictable reading order.
- Interactive targets are at least 44 by 44 px with adequate separation.
- The square cell size, influence radius, and cell count adapt to viewport and device capability.
- Important content is not positioned solely according to pointer coordinates.

## 12. Accessibility requirements

- Target WCAG 2.2 AA.
- Body copy and controls meet a 4.5:1 contrast ratio; large text meets at least 3:1.
- All features are keyboard accessible with visible focus states.
- Use semantic landmarks and a logical heading hierarchy.
- Include a skip-to-content link.
- Icon-only actions have accessible names.
- Informative images have meaningful alternative text; decorative grid elements are hidden from assistive technology.
- Zoom up to 200% does not remove content or functionality.
- Motion is never required to reveal or understand information.
- The site honors reduced-motion and does not use scroll-jacking.

## 13. Performance requirements

- Target Core Web Vitals in the "good" range on representative mobile and desktop devices.
- Reserve dimensions for media to prevent cumulative layout shift; target CLS below 0.1.
- Optimize images to WebP or AVIF where appropriate and lazy-load below-the-fold media.
- Keep the initial experience lightweight; animation code should not delay core content rendering.
- Avoid loading large animation libraries unless a prototype proves they are necessary.
- Measure animation frame time and long tasks using browser performance tools.
- Provide a quality fallback that lowers grid density or disables dynamic motion on constrained devices.

## 14. Content requirements

Before launch, collect and validate:

- Correct display name and professional title.
- A 20-40 word introduction and a longer About narrative.
- Location and availability wording.
- Resume file.
- 3-6 featured projects with problem, contribution, result, stack, links, and optimized imagery.
- Work or education timeline with dates and measurable outcomes.
- Achievements with issuer, date, context, and proof links.
- Skills grouped by category and supported by project evidence.
- Email address and approved social profiles.
- Optional posts with real titles, dates, descriptions, and URLs.

Placeholder text, broken links, and fictional projects must not ship.

## 15. Suggested content model

```text
Profile
  name
  role
  location
  availability
  shortBio
  longBio
  resumeUrl
  socialLinks[]

Project
  title
  summary
  problem
  contribution
  result
  technologies[]
  image
  demoUrl?
  sourceUrl?
  featured

Experience
  organization
  role
  startDate
  endDate?
  outcomes[]
  technologies[]

Achievement
  title
  issuer
  date
  description
  verificationUrl?

SkillGroup
  name
  skills[]
```

## 16. Analytics and privacy

- Analytics are optional and should be privacy-conscious.
- If enabled, measure section views, project-link clicks, resume actions, and contact actions.
- Do not collect raw pointer paths or replay cursor movement merely to support the gravity effect.
- Avoid non-essential cookies; disclose any analytics or form data collection clearly.

## 17. Delivery plan

### Phase 1: Content and static foundation

- Finalize portfolio content and navigation.
- Convert the current page into semantic, responsive sections.
- Establish design tokens from the existing CSS.
- Validate keyboard use, contrast, and mobile layout.

### Phase 2: Square-field prototype

- Prototype both a DOM/CSS approach and a canvas/batched approach using representative page length.
- Test cell density, influence radius, displacement, spring return, and scroll behavior.
- Select the simplest approach that meets performance and accessibility requirements.

### Phase 3: Integration and polish

- Place the square field behind the full page content except the navbar.
- Add restrained card and link micro-interactions.
- Add reduced-motion and constrained-device fallbacks.
- Tune visual contrast so the grid supports rather than competes with content.

### Phase 4: QA and launch

- Test current Chrome, Edge, Firefox, and Safari.
- Test representative iOS and Android viewport sizes.
- Test keyboard-only use, screen reader landmarks, 200% zoom, and reduced motion.
- Profile animation, optimize media, validate metadata, and remove all placeholders.

## 18. Definition of done

The first release is complete when:

- All approved portfolio sections contain final content.
- The visual design clearly inherits the reference site's font, colors, borders, radius, and centered layout.
- The navbar is stable and every navigation action works.
- The square gravity field covers the page below the navbar and meets its animation acceptance criteria.
- The static and reduced-motion experiences are complete and attractive.
- The site passes responsive, accessibility, cross-browser, and performance checks.
- Project, resume, social, and contact links have been manually verified.
- No placeholder content or broken media remains.

## 19. Open product decisions

These choices should be resolved before final visual implementation:

1. Final display name, role, short introduction, and location text.
2. Whether the site is a single scrolling page or uses dedicated project detail pages.
3. Which 3-6 projects and achievements are featured first.
4. Whether a contact form is needed in addition to email and social links.
5. Whether Posts launches with real content or is hidden initially.
6. Whether the gravity field uses pure DOM/CSS or a batched canvas implementation after prototyping.
7. Whether the navbar is sticky on desktop, mobile, both, or neither.

