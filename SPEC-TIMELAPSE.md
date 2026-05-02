# SPEC — Regenerate werf timelapse video

## Context
The website `/home/cosmos/company/projects/deallos/demos/tuinen-vk-v2/` previously had a Seedance-generated timelapse video at `vid/timelapse-werf.mp4` that hallucinated physically: a lawnmower was shown driving over metal sheets that silently turned into grass. User wants it regenerated with:
- Real construction progression (placing pavers, planting, levelling) — NOT material transformation
- Locked camera — no pan, no zoom
- Same environment start→end (same van, same brick wall, same workers)
- Honest: Seedance is powerful but has no causal world-model for "material → finished state"

## Anchor image (already generated)
A clean 16:9 anchor image of a Belgian back-garden construction site in mid-progress is saved at:
```
/tmp/timelapse-anchor.jpg
```
Shows: leveled tan sand (60% of frame), bluestone pavers stacked on pallet at left, 2 workers in dark trousers kneeling mid-frame (one placing paver, one holding string line), dark green Mercedes Sprinter van at right, red-brick Bruges rowhouse background, overcast diffuse light.

This anchor has been verified by vision as "believable, visually stable, good for locked-camera timelapse." Upload this to Higgsfield first.

## Generation job — Higgsfield Seedance 2.0

### Step 1: Upload anchor to Higgsfield
Use MCP tool `mcp_higgsfield_media_upload` (Claude Code has this MCP). Upload `/tmp/timelapse-anchor.jpg`, get back a UUID. Then `mcp_higgsfield_media_confirm` it.

### Step 2: Generate video
Use `mcp_higgsfield_generate_video` with:
- `model`: `seedance_2_0`
- `aspect_ratio`: `16:9`
- `duration`: 9 (seconds)
- `count`: 1
- `medias`: `[{"role": "start_image", "value": "<UUID from step 1>"}]` — **single anchor only, NEVER pass end_image** (dual anchors cause environment drift per skill `service-business-funnel-sites/references/ai-video-consistency.md`)

### Prompt to pass
```
Locked camera documentary timelapse of a Belgian garden construction site. The exact same wide composition held throughout. Same dark green Mercedes Sprinter van parked at right, same red brick rowhouse background with one white-framed window, same stack of bluestone pavers on wooden pallet at left, same leveled tan sand ground. Four workers in dark green work trousers and black work boots. Time accelerates over one workday: workers progressively lay more bluestone pavers in herringbone pattern across the sand area, more pavers get placed row by row, the layed-paving area grows from small at the near edge to covering most of the frame. Workers move between placing pavers, checking levels, carrying sand bags, sweeping. Overcast Flemish daylight — soft diffuse light shifts slightly from morning to afternoon. Camera does NOT move, does NOT pan, does NOT zoom. Same composition every frame. Same van, same building, same pallet position, same sand colour. Only workers and the paving progress change. Naturalistic documentary photography, 35mm lens, Kodak Portra grain. No people appearing from nowhere, no materials magically transforming, no grass growing, no objects changing identity. 9 second loop.
```

### Step 3: Poll
Use `mcp_higgsfield_job_status` with `sync: true` until status is `completed`. Download the mp4 to `/home/cosmos/company/projects/deallos/demos/tuinen-vk-v2/vid/timelapse-werf.mp4` (overwrite previous).

### Step 4: Verify
Use ffmpeg to extract 3 frames (0.5s, 4s, 8.5s):
```
for t in 0.5 4 8.5; do ffmpeg -y -ss $t -i vid/timelapse-werf.mp4 -frames:v 1 -q:v 4 /tmp/tl-frame-$t.jpg 2>&1 | tail -1; done
```
Then check each frame:
- Same green van visible at right in all 3 frames? (Not morphed into different vehicle, not disappeared)
- Same brick wall in all 3 frames? (Not morphed into different building)
- More pavers present in later frames vs earlier? (Actual progress visible)
- No physical nonsense: no lawnmower-on-metal, no plants appearing from air, no vehicles teleporting

If any frame fails these checks: REPORT the failure, DO NOT re-run automatically (costs credits). Surface the issue.

### Step 5: Restore the HTML section
Previous commit e803292 removed the timelapse section and replaced it with a 4-phase photo strip. Now that we have a working video again, RESTORE a timelapse section BEFORE the photo strip (or replace the photo strip). The HTML template to insert into `index.html` just AFTER the "Drie werven" projects section (around line 320 currently, before the "Vier fases op één werf" photo-strip):

```html
<!-- =============== TIMELAPSE — one workday on the werf =============== -->
<section class="bg-paper py-20 md:py-28 px-6 md:px-10">
  <div class="max-w-7xl mx-auto">
    <div class="grid md:grid-cols-12 gap-10 items-end mb-10">
      <div class="md:col-span-7 reveal">
        <p class="eyebrow text-muted mb-4">Een dag op de werf</p>
        <h2 class="serif h1 text-ink">Van kale grond tot bluesteen — in negen seconden.</h2>
      </div>
      <div class="md:col-span-5 reveal" style="transition-delay:.1s">
        <p class="text-muted leading-relaxed">
          Timelapse van één werfdag: de ploeg legt bluesteen in visgraat op een voorbereide fundering. Zelfde camera, zelfde ploeg, geen knip-en-plak.
        </p>
      </div>
    </div>
    <div class="aspect-video w-full overflow-hidden bg-ink reveal" style="transition-delay:.15s">
      <video autoplay muted loop playsinline poster="img/project-sint-anna.jpg" class="w-full h-full object-cover" data-autoplay>
        <source src="vid/timelapse-werf.mp4" type="video/mp4">
      </video>
    </div>
    <div class="mt-4 flex flex-wrap justify-between items-center text-sm text-muted">
      <span class="mono text-xs">Werf 17 / 2026 — Sint-Anna · bluesteen visgraat · ploeg van 4</span>
      <a href="realisaties.html" class="border-b border-ink pb-0.5 hover:text-brick transition">Bekijk meer werven →</a>
    </div>
  </div>
</section>
```

Keep the existing "Vier fases op één werf" 4-photo strip section intact AFTER this new timelapse section — they serve different purposes (timelapse = dynamic one-day showcase; photo strip = full-project 4-phase breakdown).

### Step 6: Commit & push
```
cd /home/cosmos/company/projects/deallos/demos/tuinen-vk-v2
git add -A
git commit -m "v9b: regenerated timelapse — single-anchor Seedance locked camera (no material hallucination), restored timelapse section with new honest headline 'van kale grond tot bluesteen in negen seconden'"
git push origin main
```

### Step 7: Report
Output a JSON summary of what happened:
```json
{
  "uploaded_anchor_uuid": "...",
  "seedance_job_id": "...",
  "seedance_status": "completed|failed|refused_by_filter",
  "video_path": "vid/timelapse-werf.mp4",
  "video_size_bytes": N,
  "frames_sampled": ["0.5s", "4s", "8.5s"],
  "frame_consistency_check": "pass|fail",
  "frame_consistency_notes": "...",
  "html_section_restored": true,
  "commit_sha": "...",
  "deploy_verified": true|false
}
```

## Credits budget
- Seedance 2.0 9s 1080p: ~70 credits (one try)
- If first attempt fails the consistency check, DO NOT retry automatically — surface the issue. Retrying costs another 70 credits.

## Environment variables available
- `HIGGSFIELD_API_KEY` in `/home/cosmos/company/.env` (but Higgsfield MCP is the preferred path)
- `GITHUB_TOKEN` in `/home/cosmos/company/.env` (for push)

## Important context
- The GitHub repo is `deallosconsultations-bot/deallos-tuinen-vk-v2`
- Branch: `main`
- Git is already configured with push access via the token
- This is an agency demo site — do not modify anything outside the timelapse section without asking
