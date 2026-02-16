# Stocky Bird — Overview

## Concept

Stocky Bird is a finance-themed arcade game that fuses Flappy Bird mechanics with a Bloomberg Terminal aesthetic. The player controls a candlestick chart element — green when rising, red when falling — navigating through price-level gates styled as support/resistance lines. After clearing each gate, the player must answer a timed math question before the next gate arrives or die instantly.

## Theme

Every element reinforces the financial trading metaphor:

- **Player** = candlestick (body + wicks, color reflects direction)
- **Obstacles** = price support/resistance levels with labeled prices
- **Score** = "TRADES" count + P&L in dollars with streak multiplier
- **Start prompt** = "PRESS SPACE TO TRADE"
- **Death screen** = "TRADE REJECTED"
- **Pause screen** = "MARKET HALTED"
- **Background** = scrolling grid + stock ticker tape with real NASDAQ/NYSE symbols

## Visual Identity

- **Black background** with subtle grid lines (Bloomberg terminal look)
- **Amber/orange (#FFA028)** as the primary UI color
- **Geist Mono** monospace font throughout
- **Green (#00FF00)** for bullish/positive values
- **Red (#FF0000)** for bearish/negative values
- **Cyan/teal (#4AF6C3)** as accent color

## Core Loop

1. **Flap** to navigate through the gap in the next gate
2. **Answer** the math question that appears after clearing the gate
3. **Earn P&L** — correct answers on the first try build a streak multiplier (up to 2x)
4. **Survive** — difficulty ramps with each gate (gap shrinks, speed increases)
5. **Die** if you hit a pipe, the floor/ceiling, or reach the next gate without answering

## Tech Philosophy

- Built with **Next.js 16 + React 19 + raw Canvas 2D** — no game engine libraries
- All audio is **procedurally synthesized** via Web Audio API — no audio files
- All visuals are **drawn with canvas primitives** — no sprites or image assets
- React is used only as a mount point; gameplay is entirely imperative
