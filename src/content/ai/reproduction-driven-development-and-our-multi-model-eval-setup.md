---
title: "Reproduction-Driven Development and Our Multi-Model Eval Setup"
date: "2026-09-17"
type: "post"
excerpt: "How we use Reproduction-Driven Development (RDD) combined with GLM-5.3 and Flash models in a continuous evaluation harness to keep autonomous coding agents honest."
tags:
  - "rdd"
  - "testing"
  - "ai-agents"
  - "coder-eval"
  - "glm-5.3"
  - "gemini-flash"
---

Building a reliable AI coding assistant isn't about finding the perfect model—it is about building the perfect constraints. 

Our local testing environment uses a customized `coder-eval` harness to benchmark our agents. The core philosophy driving this is **Reproduction-Driven Development (RDD)**. An agent isn't allowed to just "fix" a file. It must first write a script that proves the bug exists, then prove the fix resolves it. 

To make this scalable without burning through API tokens, we rely on a multi-model architecture. For the deep, multi-step execution tasks, we deploy **Z.AI OpenCode running GLM-5.3**. It has the context window and the flat-rate execution plan necessary to grind through complex, autonomous workflows.

For the evaluation side, we use fast, cheap models like **Gemini Flash**. The eval harness runs the GLM-5.3 output through an LLM judge, checking the exact pass thresholds and ensuring the agent actually ran the required RDD reproduction script. If an agent tries to bypass the reproduction step and make a blind edit, the Flash-powered judge catches it and fails the task.

By separating the "doer" (GLM-5.3) from the "checker" (Flash) inside an automated harness, we can deploy agents into production codebases with absolute confidence.
