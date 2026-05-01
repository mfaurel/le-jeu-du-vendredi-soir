/**
 * TrailPath — animated isometric Bezier trail.
 *
 * Usage:
 *   const trail = new TrailPath(scene, [
 *     { x: 0, y: 10 }, { x: 1, y: 9 }, { x: 2, y: 8 }, ...
 *   ], { originX: 424, originY: 200 });
 *
 *   // later, to reroute:
 *   trail.updatePath(newWaypoints);
 *
 *   // cleanup:
 *   trail.destroy();
 */

// ── Constants ────────────────────────────────────────────────────────────────

const TRAIL_COLOR  = 0x00ffcc;
const TILE_W       = 64;
const TILE_H       = 32;
const STEPS_PER_SPAN = 60;   // interpolated points between each waypoint pair
const DASH_LEN     = 18;     // px — length of each dash
const GAP_LEN      = 14;     // px — gap between dashes
const DASH_SPEED   = 40;     // px/s — scroll speed of the dash pattern
const PERIOD       = DASH_LEN + GAP_LEN;

// ── Isometric projection ─────────────────────────────────────────────────────

function isoProject(tx, ty, ox, oy) {
    return {
        x: ox + (tx - ty) * (TILE_W / 2),
        y: oy + (tx + ty) * (TILE_H / 2)
    };
}

// ── Centripetal Catmull-Rom spline ───────────────────────────────────────────
// Passes through every waypoint. Uses phantom endpoints so the curve reaches
// both ends without requiring explicit tangents.

function catmullRomSpline(pts, stepsPerSpan) {
    if (pts.length === 0) return [];
    if (pts.length === 1) return [{ ...pts[0] }];

    const n = pts.length;
    const ext = [
        { x: 2 * pts[0].x     - pts[1].x,       y: 2 * pts[0].y     - pts[1].y },
        ...pts,
        { x: 2 * pts[n-1].x   - pts[n-2].x,     y: 2 * pts[n-1].y   - pts[n-2].y }
    ];

    const result = [];
    for (let i = 1; i < ext.length - 2; i++) {
        const p0 = ext[i-1], p1 = ext[i], p2 = ext[i+1], p3 = ext[i+2];
        const steps = i < ext.length - 3 ? stepsPerSpan : stepsPerSpan + 1;
        for (let j = 0; j < steps; j++) {
            const t  = j / stepsPerSpan;
            const t2 = t * t, t3 = t2 * t;
            result.push({
                x: 0.5 * (
                    (2 * p1.x) +
                    (-p0.x + p2.x) * t +
                    ( 2*p0.x - 5*p1.x + 4*p2.x - p3.x) * t2 +
                    (-p0.x   + 3*p1.x - 3*p2.x + p3.x) * t3
                ),
                y: 0.5 * (
                    (2 * p1.y) +
                    (-p0.y + p2.y) * t +
                    ( 2*p0.y - 5*p1.y + 4*p2.y - p3.y) * t2 +
                    (-p0.y   + 3*p1.y - 3*p2.y + p3.y) * t3
                )
            });
        }
    }
    return result;
}

// ── Arc-length table ─────────────────────────────────────────────────────────
// Converts a polyline into cumulative arc distances so we can sample at
// uniform spatial intervals rather than uniform parameter intervals.

function buildArcTable(pts) {
    const table = new Float64Array(pts.length);
    for (let i = 1; i < pts.length; i++) {
        const dx = pts[i].x - pts[i-1].x;
        const dy = pts[i].y - pts[i-1].y;
        table[i] = table[i-1] + Math.sqrt(dx*dx + dy*dy);
    }
    return table;
}

// Binary-search the arc table for distance d, return interpolated point.
function sampleAtDist(pts, table, d) {
    const total = table[table.length - 1];
    if (total === 0) return { ...pts[0] };
    d = Math.max(0, Math.min(d, total));

    let lo = 0, hi = table.length - 1;
    while (lo < hi - 1) {
        const mid = (lo + hi) >> 1;
        if (table[mid] <= d) lo = mid; else hi = mid;
    }
    const span = table[hi] - table[lo];
    const t    = span > 0 ? (d - table[lo]) / span : 0;
    return {
        x: pts[lo].x + t * (pts[hi].x - pts[lo].x),
        y: pts[lo].y + t * (pts[hi].y - pts[lo].y)
    };
}

// Return the range [firstIdx, lastIdx] of arc table entries strictly inside
// (s0, s1). Using binary search for O(log n) per dash.
function arcRange(table, s0, s1) {
    const n = table.length;
    let lo = 0, hi = n;
    while (lo < hi) {
        const m = (lo + hi) >> 1;
        if (table[m] <= s0) lo = m + 1; else hi = m;
    }
    const first = lo;

    lo = first; hi = n;
    while (lo < hi) {
        const m = (lo + hi) >> 1;
        if (table[m] < s1) lo = m + 1; else hi = m;
    }
    return [first, lo - 1];
}

// ── TrailPath class ──────────────────────────────────────────────────────────

export class TrailPath {
    /**
     * @param {Phaser.Scene} scene
     * @param {{ x: number, y: number }[]} waypoints  tile-grid coordinates
     * @param {{
     *   originX?: number,  screen-space origin for iso projection
     *   originY?: number,
     *   depth?:   number
     * }} options
     */
    constructor(scene, waypoints, options = {}) {
        this.scene     = scene;
        this.waypoints = waypoints;
        this.originX   = options.originX ?? 0;
        this.originY   = options.originY ?? 0;

        // Animated values driven by tweens
        this._coreAlpha = 0.9;
        this._glowWidth = 12;
        this._dashPhase = 0;

        // Computed spline data
        this._pts = [];
        this._arc = new Float64Array(0);

        this.gfx = scene.add.graphics().setDepth(options.depth ?? 10);

        this._computeSpline();
        this._setupTweens();
        this._draw();

        scene.events.on('update', this._onUpdate, this);
    }

    // ── Public API ────────────────────────────────────────────────────────────

    /** Replace the waypoints and redraw. No object recreation needed. */
    updatePath(newWaypoints) {
        this.waypoints = newWaypoints;
        this._computeSpline();
    }

    destroy() {
        this.scene.events.off('update', this._onUpdate, this);
        this.gfx.destroy();
    }

    // ── Internal ──────────────────────────────────────────────────────────────

    _computeSpline() {
        const screen = this.waypoints.map(w =>
            isoProject(w.x, w.y, this.originX, this.originY)
        );
        this._pts = catmullRomSpline(screen, STEPS_PER_SPAN);
        this._arc = buildArcTable(this._pts);
    }

    _setupTweens() {
        // Pulse: inner core alpha oscillates 0.6 → 1.0 on a 900ms sine loop
        this.scene.tweens.add({
            targets:  this,
            _coreAlpha: { from: 0.6, to: 1.0 },
            duration: 900,
            yoyo:     true,
            repeat:   -1,
            ease:     'Sine.easeInOut'
        });

        // Breath: outer glow width oscillates 10 → 16px, phase-offset by 300ms
        this.scene.tweens.add({
            targets:  this,
            _glowWidth: { from: 10, to: 16 },
            duration: 1200,
            delay:    300,
            yoyo:     true,
            repeat:   -1,
            ease:     'Sine.easeInOut'
        });
    }

    _onUpdate(_time, delta) {
        this._dashPhase = (this._dashPhase + DASH_SPEED * delta / 1000) % PERIOD;
        this._draw();
    }

    _draw() {
        const g    = this.gfx;
        const pts  = this._pts;
        const arc  = this._arc;
        const total = arc.length > 0 ? arc[arc.length - 1] : 0;

        g.clear();
        if (pts.length < 2 || total === 0) return;

        // ── 1. Outer glow — wide, soft, solid ────────────────────────────────
        // Drawn as a single continuous polyline so the glow blends smoothly.
        g.lineStyle(this._glowWidth, TRAIL_COLOR, 0.15);
        g.beginPath();
        g.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) g.lineTo(pts[i].x, pts[i].y);
        g.strokePath();

        // ── 2. Inner core — 3px, dashed, scrolling ───────────────────────────
        // Walk along arc length, emitting a stroke for each dash segment.
        // Using arcRange() to find which spline points fall inside each dash
        // avoids an O(n) scan per dash → keeps per-frame cost bounded.
        g.lineStyle(3, TRAIL_COLOR, this._coreAlpha);
        g.fillStyle(TRAIL_COLOR, this._coreAlpha);

        let d = -(this._dashPhase % PERIOD);
        while (d < total) {
            const s0 = d;
            const s1 = d + DASH_LEN;

            if (s1 > 0 && s0 < total) {
                const a0 = Math.max(0, s0);
                const a1 = Math.min(total, s1);

                const start = sampleAtDist(pts, arc, a0);
                const end   = sampleAtDist(pts, arc, a1);
                const [fi, li] = arcRange(arc, a0, a1);

                // Stroke: start → interior spline points → end
                g.beginPath();
                g.moveTo(start.x, start.y);
                for (let k = fi; k <= li; k++) g.lineTo(pts[k].x, pts[k].y);
                g.lineTo(end.x, end.y);
                g.strokePath();

                // Rounded caps simulated as filled circles at each end
                g.fillCircle(start.x, start.y, 1.5);
                g.fillCircle(end.x,   end.y,   1.5);
            }

            d += PERIOD;
        }
    }
}
