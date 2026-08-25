---
title: "Beyond the Chatbot: How I Orchestrate My Multi-Model AI Stack"
date: "2026-07-29"
type: post
excerpt: "The future of AI isn't one omnipotent chatbot — it's a fleet of specialized models, each doing exactly what it does best. Here's the current lineup and what's actually being built with it."
tags: ["AI stack", "multi-agent", "orchestration"]
---

If you’ve been following the AI space recently, it’s easy to get caught up in the "model wars." Everyone is looking for the *one* tool that does it all. But after spending countless hours building autonomous systems, I've realized something important: the future of AI isn't a single omnipotent chatbot. It's a localized, customized fleet of models and agents, each doing exactly what they do best.

Here is a breakdown of the current AI tools I use, how they work together, and what I’m actually building with them in the trenches.

## The Arsenal: Right Model, Right Job

I don't rely on just one provider. Every task gets routed to the model that handles it best. Here is how I divide the labor:

*   **Claude (The Orchestrator):** In my experience, Claude is simply the best overall reasoner. I use it as the "brain" of my operations. It decomposes complex problems, dispatches tasks to other agents, adjudicates disputes, and synthesizes the final output. If I need deep architectural planning or cross-family code review, Claude is at the helm.
*   **Codex & Qwen (The Builders):** When it comes to writing code, generating boilerplate, and doing the mechanical heavy lifting of software engineering, these models shine. I use them for the "hard build" phases. They take the architectural plans and turn them into functional Python, APIs, and infrastructure.
*   **Gemini Pro (The Researcher & Brainstormer):** Gemini is my go-to for research, brainstorming, and structuring data. Whether I'm mapping out a massive new system architecture or generating SEO-optimized metadata in strict JSON formats, Gemini excels at laying out the blueprint and gathering the context.

## What I'm Building: The Autonomous Fleet

Having good tools is one thing, but stringing them together into autonomous pipelines is where the magic happens. Here are a few of the projects I've built using this multi-model approach:

### 1. ASAC (Adobe Stock Autonomous Contributor)
Also known as the *OpenCode Overnight Builder*, this is a fully autonomous pipeline that generates and uploads high-volume assets to Adobe Stock while I sleep. 
*   **The Generation Hub:** It wakes up at 2:00 AM and uses a local RTX 4060 running ComfyUI/Flux to generate batches of images.
*   **The Quality Police:** Before anything gets uploaded, a Vision MCP server (running GLM-4.6V-Flash) slices the images into 3x3 grids and audits them for anatomical errors (like extra fingers), artifacts, or IP issues. 
*   **The SEO Engine:** Gemini Pro kicks in to generate optimized titles and 50 highly relevant keywords.
*   **The Hybrid Upload:** Finally, a Python script handles the heavy data transfer via headless SFTP, while Playwright takes control of a browser to visually click the required "Generated with AI" checkboxes on the Adobe portal.

### 2. BergGPT (The Hive Mind)
Why ask one agent a question when you can ask ten simultaneously? BergGPT is my massively parallel Mixture of Experts (MoE) orchestration system. 
*   When given a query, it dispatches **10 specialized MCP agents** (Web Scout, Code Hunter, The Scholar, etc.) to research the topic concurrently. 
*   They share a real-time "Hot Memory" powered by Redis Stack (for sub-second vector searches) and a "Cold Memory" archival system backed by LanceDB. 
*   The result is a synthesized, highly accurate answer pulled from across the web, codebases, and academic papers in a fraction of the time it would take a single agent.

### 3. Meta-Automation & Reelcut
Managing social media across multiple brands (like Jäger Stockill Racing and Burger Boys) requires serious automation.
*   **Meta-Automation:** A custom, single-tenant programmatic backend (FastAPI/uvicorn) running in a Proxmox LXC container. It schedules and publishes posts directly to Facebook and Instagram via the Graph API, handling idempotency and webhook events.
*   **Reelcut:** Instead of manually scrubbing through hours of racing footage, I use `vidx` (a local video indexer with Whisper transcripts and OCR) to find the best moments. Then, `reelcut` takes a text file and uses `ffmpeg` to automatically slice, crop, and crossfade vertical 1080x1920 reels—even exporting a Premiere Pro timeline if I need to make manual tweaks later.

## The Takeaway

We are moving past the era of copy-pasting code from a browser window. By treating models as specialized workers—Orchestrators, Builders, and Researchers—and wiring them together with local databases, Vision MCPs, and background scripts, we can build systems that don't just answer questions, but actively execute complex, multi-step goals autonomously. 

The tools are here. It's just a matter of how you orchestrate them.
