---
title: "ClawWatch: How I Force AI to Fix Its Own Code Errors (Automatically)"
date: "2026-08-19"
type: post
excerpt: "A PostToolUse hook for Claude Code that catches its own mistakes with Ruff and Pytest, then forces a fix loop before the agent is allowed to call anything done."
tags: ["Claude Code", "automation", "tooling", "AI agents"]
---

If you use AI coding agents long enough, you'll run into a familiar, frustrating loop: The AI writes a script, runs it, gets an error, and then just... stops. Or worse, it hallucinates a "fix" that breaks something else, and you have to manually step in, read the traceback, and prompt it to try again.

I got tired of babysitting my AI. If an agent is supposed to be autonomous, it needs to be able to catch its own mistakes before it hands the work back to me. 

To solve this, I built **ClawWatch**.

## What is ClawWatch?

ClawWatch is a `PostToolUse` hook I built specifically for Claude Code. It sits silently in the background and watches every move Claude makes in the terminal.

The moment Claude runs a Bash command that modifies code, or uses an Edit/Write tool to change a Python file, ClawWatch intercepts the output and runs a rapid, hybrid analysis on it.

## The Detection Pipeline

Instead of relying solely on the LLM to realize it messed up, ClawWatch uses deterministic tools to catch flaws:
1.  **Ruff Linting:** Instantly checks the modified files for syntax errors, missing imports, or formatting violations.
2.  **Pytest Parsing:** If Claude runs a test suite, ClawWatch parses the exact failures out of the console output.
3.  **GLM-5 Deep Analysis (Optional):** If a command fails and the error is complex, ClawWatch can ping a Z.AI API (using GLM-5) to analyze the traceback and suggest a fix.

## The Autonomous Feedback Loop

Here is where the magic happens: ClawWatch does not just log these errors. It injects them directly back into Claude's context window.

If Claude writes a bug, ClawWatch intercepts the next step and injects a `[ClawWatch FLAWS]` report into the system prompt. It lists the issues by severity (e.g., `[CRITICAL] SyntaxError at line 42`) and explicitly instructs Claude: *"Please fix these issues before proceeding."*

Claude is forced to read the report, apply the fix, and re-run the command. This loop repeats until the code passes Ruff and the tests are green. Only then does ClawWatch inject a `[ClawWatch PASS]` message, allowing Claude to move on to the next task.

## Zero-Friction Autonomy

The best part? I don't have to run any commands. There is no `clawwatch check` to type manually. It hooks directly into the agent's tool-use lifecycle. 

By combining the reasoning power of Claude with the strict, deterministic gates of tools like Ruff and Pytest, I've virtually eliminated the "lazy AI" problem. My agents don't mark their work as complete until the code actually runs.
