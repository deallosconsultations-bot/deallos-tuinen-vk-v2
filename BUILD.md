# Tuinen Van Kerckhove — V2 build manifest

Lead: Tuinen Van Kerckhove, Brugge (West-Vlaanderen)
Audit score: 100 ("direct copy of Facebook")
Demo URL target: deallosconsultations-bot.github.io/deallos-tuinen-vk-v2/

## Pages
1. index.html        — Home (hero scroll-pinned transform video, services teaser, werf van de week, map, quiz)
2. diensten.html     — 4 services with 3D tilt cards + 8s timelapse video each
3. realisaties.html  — Project gallery + Leaflet West-Vlaanderen map + 3-year maturity slider
4. over.html         — Team page with 4 walkout videos (Stihl visor drop) — REUSABLE AGENCY ASSET
5. contact.html      — Form + season toggle + live weather widget + CO2 counter

## Tech
Tailwind CDN + Lenis (smooth scroll) + GSAP/ScrollTrigger + Alpine.js + Leaflet

## Reusable agency assets (swap-points across all 10 demos)
- vid/team-walkout-{1,2,3,4}.mp4  → re-prompt with diff agent appearance per client
- vid/hero-transform.mp4          → re-prompt per garden style
- js/season-toggle.js, weather.js, co2.js, quiz.js, map.js → identical across demos

## Spend cap: $10 (Higgsfield credits, ~$0.01/credit on Ultra ≈ free)

## Build status
[x] Manifest written
[ ] Hero overgrown image
[ ] Hero manicured image
[ ] Hero transform video (seedance start→end)
[ ] Team walkout video #1
[ ] HTML scaffolding (5 pages)
[ ] Feature JS modules
[ ] GitHub repo + Pages deploy
