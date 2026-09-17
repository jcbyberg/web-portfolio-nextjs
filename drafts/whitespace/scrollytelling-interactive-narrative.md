# Draft: Scrollytelling: Why Your Story Needs to Move at the User's Pace

## 1. Post metadata and strategy

- **Collection:** whitespace
- **Type:** essay
- **Title:** Scrollytelling: Why Your Story Needs to Move at the User's Pace
- **Excerpt:** Standard web pages ask users to read walls of text. Scrollytelling turns scrolling into an interactive narrative. Here is how and when to use it.
- **Tags:** ui, design, trends, frontend
- **Video:** /images/whitespace/scrollytelling-interactive.mp4

Strategy:
- **Target audience:** Growth-stage SMBs, marketing directors, and brands looking to launch flagship products or impact reports.
- **Goal:** Show that we can build highly interactive, narrative-driven experiences that aren't just standard corporate templates.
- **Required action:** Needs an image of a scrolling UI changing a background graphic.

## 2. Image ideas
- A mock UI showing a sticky background graphic (like a 3D product) while text cards scroll up over it on the left side.
- A visual representation of a scroll-timeline, showing how scroll depth dictates opacity and movement.

## 3. Blog body: wording options

### Option A: The "Engagement and Retention" Angle
*[Use this when targeting marketing leads who struggle to get users to read long-form content]*

Nobody reads on the internet anymore; they scan. If you present a potential customer with a 2,000-word block of text explaining your new flagship product, they will scroll straight to the pricing table and leave. 

If you want people to actually consume your narrative, you have to turn them from passive readers into active participants. This is where "Scrollytelling" comes in.

**What is Scrollytelling?**
A portmanteau of "scrolling" and "storytelling," this trend ties the visual state of the website strictly to the user's scroll position. As you scroll down, the text doesn't just move up the page. Instead, background images fade in, 3D models rotate, and data charts draw themselves piece by piece. 

**A Brief History**
The New York Times popularized this format in 2012 with their famous "Snow Fall" article, which won a Pulitzer. For a long time, it remained the domain of elite journalism and massive tech giants like Apple, because building it required heavy, scroll-hijacking JavaScript that often made the page feel broken or janky on older phones. 

Today, modern CSS has democratized the technique.

**Where to Use It**
Do not use this for your contact page or your standard e-commerce grid. Scrollytelling is reserved for your highest-value narratives: an annual impact report, the launch page for a massive new feature, or a deep-dive explanation of a complex technical product. 

**The Code**
We used to rely on complex event listeners checking `window.scrollY` 60 times a second. Now, we use the incredibly powerful `position: sticky` combined with Intersection Observers or the new CSS Scroll-Driven Animations API:

```css
/* The container that holds the narrative */
.scrolly-section {
  position: relative;
  height: 400vh; /* 4 screens tall to give the user time to scroll */
}

/* The graphic that stays pinned to the screen while you scroll */
.sticky-graphic {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* The text cards that scroll over the graphic */
.story-step {
  height: 100vh;
  padding: 2rem;
  /* Add JS Intersection Observer to fade the graphic when this card hits the center */
}
```

By keeping the visual anchor (the image or chart) sticky in the background, we let the user control the pacing of the story just by scrolling their mouse wheel.

### Option B: The "Death of the Video Explainer" Angle
*[Use this when targeting founders who are spending too much money on animated explainer videos]*

Five years ago, every startup homepage had a 2-minute animated explainer video sitting right below the header. The problem? Users rarely click "play." They want to control the flow of information, pausing when they are confused and skimming when they are bored. A video forces them onto your timeline.

Scrollytelling fixes this by turning the entire website into the explainer video, with the user's scroll wheel acting as the play button.

**A Brief History**
As attention spans dropped, designers tried to force interaction by hijacking the scroll wheel—making one flick of the mouse jump to an entirely new slide. Users hated it. It broke the native feel of the browser. The modern iteration of Scrollytelling respects the native scroll physics. The user is always in control; the website just reacts beautifully to their movement.

**Where to Use It**
Use Scrollytelling when you need to explain a step-by-step process. If your SaaS product has a complex onboarding flow, or if your physical product has intricate internal engineering (like a new coffee machine or a car engine), use a sticky background graphic that disassembles itself layer-by-layer as the user reads the text cards scrolling past.

**The Code**
With the brand new CSS Scroll-Driven Animations API, we can actually tie CSS animations directly to the scrollbar, completely removing JavaScript from the equation for massive performance gains:

```css
@keyframes reveal-product {
  0% { opacity: 0; transform: translateY(50px); }
  100% { opacity: 1; transform: translateY(0); }
}

.product-feature {
  /* The animation progress is tied strictly to the scroll position */
  animation: reveal-product linear;
  animation-timeline: view();
  animation-range: entry 20% cover 50%;
}
```

This CSS-only approach ensures that even on a low-end mobile device, the story plays out with butter-smooth 60fps performance, keeping your users engaged from the hero section to the footer.

## 4. Facebook hooks
- **Hook A (for Option A):** Nobody reads on the internet anymore—they scan. If you want users to actually consume your narrative, you need Scrollytelling. Here is how and when to use it. (Assumes link in body)
- **Hook B (for Option B):** Explainer videos are dead. Users want to control the pace of information. Scrollytelling turns your website into an interactive narrative controlled by the scroll wheel. (Assumes link in body)

