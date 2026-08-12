# GitHub repository refresh

The GitHub repository page now supports both kinds of refresh:

1. **Fetch Latest in the UI** searches GitHub using the selected technology stacks (or a custom query), displays the results, and saves them to `frontend/public/github-persisted.json` through the local scan server. Saved results are deduplicated by GitHub URL and loaded again on the next page visit.
2. **Daily refresh** runs `scripts/refresh-github-daily.bat`. It first runs the supplied crawler, then reads the last topics/query saved by the UI, searches GitHub again, merges results by URL, and regenerates the browser-loadable batches from:
   `C:\Users\Legion\Desktop\github_crawler\github_repos.csv`

## One-time setup

Start the app with the normal frontend command so the scan server is running:

```bash
cd frontend
npm run dev
```

Use **AI Tech Stack GitHub Repos → Fetch Latest**, select the stacks you want refreshed daily, and run one successful fetch. The selected topics/query are saved in `frontend/public/github-refresh-config.json`.

For higher GitHub API limits, set `GITHUB_TOKEN` in the environment used by the scan server and the scheduled task. Without a token, GitHub's unauthenticated rate limit applies.

## Windows Task Scheduler

Create a task with:

- **Program:** the full path to `scripts\refresh-github-daily.bat`
- **Trigger:** Daily, at the desired time
- **Start in:** the project root
- **Run whether user is logged on or not:** as appropriate for the machine

The wrapper writes output to `frontend\github-refresh.log`. It does not commit or push changes. The crawler may take a long time and is subject to GitHub API limits; keep `.token_clean.txt` protected.

## Manual refresh

```bash
cd frontend
npm run github:refresh
```

To import only the latest crawler CSV without making GitHub API requests:

```bash
cd frontend
npm run github:import
```

The importer removes URLs already present in the catalog and duplicate URLs within the CSV before creating `frontend/public/github-repos-batches/`.
