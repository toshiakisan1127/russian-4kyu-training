#!/usr/bin/env python3

from __future__ import annotations

import json
import math
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

MAX_RUNS = 25
WORKFLOW_FILE = "ci.yml"
SERIES = (
    ("total", "Total build job", "#8250df"),
    ("smoke", "Browser smoke tests", "#1f883d"),
    ("playwright", "Playwright setup", "#0969da"),
)
PLAYWRIGHT_STEPS = {
    "Cache Playwright Chromium",
    "Install Playwright system dependencies",
    "Install Playwright Chromium",
}


def api_get(path: str) -> dict:
    token = os.environ.get("GITHUB_TOKEN")
    repository = os.environ.get("GITHUB_REPOSITORY")
    if not token or not repository:
        raise RuntimeError("GITHUB_TOKEN and GITHUB_REPOSITORY are required")

    url = f"https://api.github.com/repos/{repository}/{path}"
    request = urllib.request.Request(
        url,
        headers={
            "Accept": "application/vnd.github+json",
            "Authorization": f"Bearer {token}",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "russian-4kyu-ci-performance",
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            return json.load(response)
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"GitHub API returned {exc.code}: {body}") from exc


def parse_time(value: str | None) -> datetime | None:
    if not value:
        return None
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def duration_seconds(started_at: str | None, completed_at: str | None) -> int | None:
    started = parse_time(started_at)
    completed = parse_time(completed_at)
    if not started or not completed:
        return None
    return max(0, round((completed - started).total_seconds()))


def fetch_recent_successful_runs() -> list[dict]:
    selected: list[dict] = []
    for page in range(1, 4):
        query = urllib.parse.urlencode(
            {
                "event": "pull_request",
                "status": "completed",
                "per_page": 50,
                "page": page,
            }
        )
        payload = api_get(f"actions/workflows/{WORKFLOW_FILE}/runs?{query}")
        runs = payload.get("workflow_runs", [])
        selected.extend(run for run in runs if run.get("conclusion") == "success")
        if len(selected) >= MAX_RUNS or len(runs) < 50:
            break
    return selected[:MAX_RUNS]


def fetch_point(run: dict) -> dict | None:
    jobs = api_get(f"actions/runs/{run['id']}/jobs?per_page=100").get("jobs", [])
    build = next((job for job in jobs if job.get("name") == "build"), None)
    if not build:
        return None

    total = duration_seconds(build.get("started_at"), build.get("completed_at"))
    if total is None:
        return None

    smoke: int | None = None
    playwright_values: list[int] = []
    for step in build.get("steps", []):
        duration = duration_seconds(step.get("started_at"), step.get("completed_at"))
        if duration is None:
            continue
        if step.get("name") == "Browser smoke tests":
            smoke = duration
        if step.get("name") in PLAYWRIGHT_STEPS:
            playwright_values.append(duration)

    return {
        "run": run.get("run_number"),
        "created_at": run.get("created_at"),
        "url": run.get("html_url"),
        "total": total,
        "smoke": smoke,
        "playwright": sum(playwright_values) if playwright_values else None,
    }


def escape(value: object) -> str:
    return (
        str(value)
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def render_svg(points: list[dict]) -> str:
    width = 900
    height = 430
    left = 66
    right = 24
    top = 92
    bottom = 68
    plot_width = width - left - right
    plot_height = height - top - bottom

    values = [
        value
        for point in points
        for key, _, _ in SERIES
        if (value := point.get(key)) is not None
    ]
    max_value = max(values, default=60)
    y_max = max(30, int(math.ceil((max_value * 1.1) / 30.0) * 30))

    def x_at(index: int) -> float:
        if len(points) <= 1:
            return left + plot_width / 2
        return left + plot_width * index / (len(points) - 1)

    def y_at(value: int) -> float:
        return top + plot_height * (1 - value / y_max)

    chunks = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title desc">',
        '<title id="title">CI performance history</title>',
        '<desc id="desc">Successful pull request CI durations for the build job, browser smoke tests, and Playwright setup.</desc>',
        '<rect width="100%" height="100%" rx="12" fill="#ffffff" stroke="#d0d7de"/>',
        '<text x="32" y="36" font-size="20" font-weight="600" fill="#1f2328" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif">CI performance</text>',
        f'<text x="32" y="60" font-size="12" fill="#656d76" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif">Latest {len(points)} successful PR runs · seconds</text>',
    ]

    legend_x = 450
    for offset, (_, label, color) in enumerate(SERIES):
        x = legend_x + offset * 145
        chunks.extend(
            [
                f'<line x1="{x}" y1="36" x2="{x + 22}" y2="36" stroke="{color}" stroke-width="3" stroke-linecap="round"/>',
                f'<text x="{x + 28}" y="40" font-size="11" fill="#1f2328" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif">{escape(label)}</text>',
            ]
        )

    for tick in range(5):
        value = round(y_max * tick / 4)
        y = y_at(value)
        chunks.append(
            f'<line x1="{left}" y1="{y:.1f}" x2="{width - right}" y2="{y:.1f}" stroke="#d8dee4" stroke-width="1"/>'
        )
        chunks.append(
            f'<text x="{left - 10}" y="{y + 4:.1f}" text-anchor="end" font-size="11" fill="#656d76" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif">{value}s</text>'
        )

    if not points:
        chunks.append(
            '<text x="450" y="220" text-anchor="middle" font-size="14" fill="#656d76" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif">No successful CI runs found yet.</text>'
        )
    else:
        label_every = max(1, math.ceil(len(points) / 7))
        for index, point in enumerate(points):
            if index % label_every == 0 or index == len(points) - 1:
                x = x_at(index)
                chunks.append(
                    f'<text x="{x:.1f}" y="{top + plot_height + 24}" text-anchor="middle" font-size="11" fill="#656d76" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif">#{escape(point["run"])}</text>'
                )

        for key, _, color in SERIES:
            segments: list[list[tuple[float, float]]] = []
            current: list[tuple[float, float]] = []
            for index, point in enumerate(points):
                value = point.get(key)
                if value is None:
                    if current:
                        segments.append(current)
                        current = []
                    continue
                current.append((x_at(index), y_at(value)))
            if current:
                segments.append(current)

            for segment in segments:
                coords = " ".join(f"{x:.1f},{y:.1f}" for x, y in segment)
                chunks.append(
                    f'<polyline points="{coords}" fill="none" stroke="{color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>'
                )
                for x, y in segment:
                    chunks.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="3" fill="{color}"/>')

    updated = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    chunks.append(
        f'<text x="{width - 24}" y="{height - 18}" text-anchor="end" font-size="10" fill="#8c959f" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif">Updated {updated}</text>'
    )
    chunks.append("</svg>")
    return "\n".join(chunks) + "\n"


def main() -> int:
    output = Path(sys.argv[1] if len(sys.argv) > 1 else "ci-performance.svg")
    runs = fetch_recent_successful_runs()
    points = [point for run in reversed(runs) if (point := fetch_point(run))]
    output.write_text(render_svg(points), encoding="utf-8")
    print(f"wrote {output} with {len(points)} runs")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
