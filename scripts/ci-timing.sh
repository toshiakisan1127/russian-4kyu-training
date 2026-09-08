#!/usr/bin/env bash

set -u

TIMING_FILE="${RUNNER_TEMP:-/tmp}/ci-timings.tsv"
START_FILE="${RUNNER_TEMP:-/tmp}/ci-started-at"

format_seconds() {
  local seconds="$1"
  if (( seconds >= 60 )); then
    printf '%dm %02ds' "$(( seconds / 60 ))" "$(( seconds % 60 ))"
  else
    printf '%ds' "$seconds"
  fi
}

case "${1:-}" in
  start)
    date +%s > "$START_FILE"
    : > "$TIMING_FILE"
    ;;

  measure)
    name="${2:?step name is required}"
    shift 2

    started_at=$(date +%s)
    "$@"
    status=$?
    finished_at=$(date +%s)
    duration=$(( finished_at - started_at ))

    printf '%s\t%s\t%s\n' "$name" "$duration" "$status" >> "$TIMING_FILE"
    exit "$status"
    ;;

  summary)
    summary_file="${GITHUB_STEP_SUMMARY:?GITHUB_STEP_SUMMARY is required}"
    now=$(date +%s)
    started_at=$(cat "$START_FILE" 2>/dev/null || printf '%s' "$now")
    total=$(( now - started_at ))

    max_duration=1
    measured_total=0
    if [[ -s "$TIMING_FILE" ]]; then
      while IFS=$'\t' read -r _ duration _; do
        (( duration > max_duration )) && max_duration=$duration
        measured_total=$(( measured_total + duration ))
      done < "$TIMING_FILE"
    fi

    overhead=$(( total - measured_total ))
    (( overhead < 0 )) && overhead=0

    {
      echo '## ⏱️ CI timing'
      echo
      printf '**Elapsed through tests: %s**\n\n' "$(format_seconds "$total")"
      echo '| Step | Duration | Visual | Result |'
      echo '| --- | ---: | --- | :---: |'

      if [[ -s "$TIMING_FILE" ]]; then
        while IFS=$'\t' read -r name duration status; do
          blocks=$(( duration * 16 / max_duration ))
          (( duration > 0 && blocks == 0 )) && blocks=1
          bar=$(printf '%*s' "$blocks" '' | tr ' ' '█')
          result='✅'
          (( status != 0 )) && result='❌'
          printf '| %s | %s | `%s` | %s |\n' "$name" "$(format_seconds "$duration")" "$bar" "$result"
        done < "$TIMING_FILE"
      fi

      if (( overhead > 0 )); then
        blocks=$(( overhead * 16 / max_duration ))
        (( blocks == 0 )) && blocks=1
        (( blocks > 16 )) && blocks=16
        bar=$(printf '%*s' "$blocks" '' | tr ' ' '░')
        printf '| Actions / cache overhead | %s | `%s` | ℹ️ |\n' "$(format_seconds "$overhead")" "$bar"
      fi

      echo
      echo '_Elapsed time starts before checkout and ends when this summary is generated. Post-job cleanup is not included._'
    } >> "$summary_file"
    ;;

  *)
    echo "usage: $0 {start|measure <name> <command...>|summary}" >&2
    exit 2
    ;;
esac
