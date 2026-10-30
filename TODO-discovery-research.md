# Game discovery research: what players want and hate

Research date: 2026-10-30. Window: May to October 2026 (Reddit posts lock 6 months after posting, so every Reddit link below should still take replies until its lock date).

Sources: Reddit (via the Arctic Shift Reddit archive, since reddit.com blocks automated access) and X. Every item is mapped against the current Game Changer code.

## How to read this

- Status: ❌ we don't have it, 🟡 partly have it, ✅ we have it (bottom section, reply now), ⛔ decided not to build, ⏸ skipped for now.
- Effort: S = a day or two, M = about a week, L = multi-week or needs new data sources.
- Priority = how often people ask × how cheap it is to build.
- Each source line has a `[ ] replied` box. Tick it once you've answered that person after shipping.
- Self-promo rule per subreddit (from each sub's usual sidebar rules; check the sidebar again before posting):
  - **strict** = no self-promo. Use as research only, or post in the sub's weekly/megathread if it has one.
  - **mixed** = allowed with limits (flair, ratio, dev-only days). Read the rules first.
  - **open** = fine to reply as the builder.
  - X is open everywhere. Always reply as the builder ("I'm building X, it does Y"). Never pose as a stranger who "found" the site.
- `(removed)` = mods removed the post. Read only, don't reply.

---

## Priority 1: build next

### 1. Hide whole genres, tags or publishers ✅ shipped 2026-10-30
People hate being recommended a genre they never play.
Shipped: a "Never show" list (genres, themes, tags, studios) on For You, in the browse filters, and as one-press options in For You's "Not for me" menu. It applies to browse, home rows, For You and the chat's picks; searching a game by name still finds it. Code: `src/features/games/blockedTags.js`.
- ~~r/Steam - u/Material_Dot2444 - "I hate racing games."~~ Dropped: the post is a troll, not a real request. Don't reply.
- [ ] [X - @BortBurgoes - tired of seeing "games I've already ignored or stuff from publishers I've already ignored" (Sep 29)](https://x.com/BortBurgoes/status/2105044818703663442)
- [ ] [X - @BladerLBM - "saturated with this garbage, along with Survivor-likes" (52 likes, Jun 4)](https://x.com/BladerLBM/status/2062648261844885781)

### 2. Stop one game from steering my recommendations, and let me reset my taste ✅ shipped 2026-10-30
Players play things for work, for a friend, or out of curiosity, and those games pollute their recs. They also want a "reset" because tastes change.
Shipped: a "Reset" button in For You's header, next to Hidden and Never show (it used to be at the bottom of the Hidden page). It brings back every hidden game, forgets what they taught, empties the Never show list and rebuilds the picks; the library and ratings stay. Decided against a per-game "Don't use for recommendations" toggle: "Not my style" in the Not for me menu covers it.
- [ ] [r/Steam - u/Ray-Zide426 - "disable steam from using certain games as reference for your recommendations" (31 upvotes, Aug 25)](https://www.reddit.com/r/Steam/comments/1vxpzxp/) · strict · locks ~Feb 25
- [ ] [r/Steam - u/viewNSFWreddit - "Why can't we reset the Discovery Queue? ...requested several times" (Aug 13)](https://www.reddit.com/r/Steam/comments/1vnd1p2/) · strict · locks ~Feb 13
- [ ] [X - @314MxxD - "Would love to reset my suggest queue. Tastes change over time." (25 likes, Sep 29)](https://x.com/314MxxD/status/2105018945728323942)

### 3. Quality floor: no shovelware, AI slop, asset flips or porn in discovery ⛔ dropped 2026-10-30
This is the loudest hate across both platforms.
Dropped: we already hide most of the trash, so a separate quality floor isn't worth building. Every list keeps main games and expansions only and drops erotic, unofficial and cancelled games (`src/api/igdbApi.js:60`); For You only picks games with 25+ ratings; browse sorts by rating count; Newest and Popular Now need some hype or ratings. Anyone who wants a higher bar can use the browse rating filter. The one gap is the Soonest sort for upcoming games, which has no hype minimum. Add one only if junk actually shows up there.
Replies: these people still count. Answer as the builder that discovery here has no adult games and no slop by default, where the sub's rules allow it.
- [ ] [r/Steam - u/lean_hoemoan - "Thanks for the recommendations, Steam" (adult games in recs, 1,844 upvotes, 147 comments, Sep 7)](https://www.reddit.com/r/Steam/comments/1wa0dvd/) · strict · locks ~Mar 7
- [ ] [r/Steam - u/killer5907 - "Overwhelmed with so much shovelware ...struggling to find anything good" (26 comments, Oct 19)](https://www.reddit.com/r/Steam/comments/1xa3yj0/) · strict · locks ~Apr 19
- [ ] [r/Steam - u/tomodashi96 - "Did the Next Fest Algorithm Really Work to Bury AI Slop?" (Oct 22)](https://www.reddit.com/r/Steam/comments/1xca07g/) · strict · locks ~Apr 22
- [ ] [r/Steam - u/turtleviking123 - "So much spam in my discovery queue" (Aug 11)](https://www.reddit.com/r/Steam/comments/1vlnw1m/) · strict · locks ~Feb 11
- [ ] [r/IndieGaming - u/Sweet-Recording9578 - "discover genuinely cool indie games ...without being forced to dig through slop?" (26 comments, May 30)](https://www.reddit.com/r/IndieGaming/comments/1ts7iwt/) · mixed · **locks ~Nov 30, reply soon**
- [ ] [X - @walayimuna - "the amount of literal crap that the platform has is mindboggling" (26 likes, Aug 19)](https://x.com/walayimuna/status/2090044536013627819)
- [ ] [X - @PhriekshoTV - "44k games deep in the discovery queue and it's 6/10 games per queue" (Oct 20)](https://x.com/PhriekshoTV/status/2112602144868352074)
- [ ] [X - @g1itt3rp1peb0mb - "porn game came up on steam discovery queue" (25 likes, Sep 30)](https://x.com/g1itt3rp1peb0mb/status/2105378249237012907)

### 4. Hidden gems: a popular-to-niche slider ⏸ skipped for now (2026-10-30)
Skipped: the risk is surfacing hidden trash instead of hidden gems. If it comes back, skip the slider. Use one "Hidden gems" sort with fixed bounds (rating 80+, 10 to 80 ratings, out 6+ months), and test the query on real results before building.
Steam's home page keeps showing the same popular games. The thing people praise is Steam's "interactive recommender" with a niche/popularity range. Our sorts are Popular, Newest, Most hyped and Soonest. There's no "show me what I've never heard of".
Build: a "Mainstream ↔ Hidden gem" slider (IGDB `total_rating_count` / hypes bands) on browse and For You, kept alongside the quality floor so niche doesn't turn into junk.
- [ ] [r/Steam - u/Least_Yard_4327 - "always shoves the same popular games instead of niche or new games" (42 upvotes, Jun 23)](https://www.reddit.com/r/Steam/comments/1udelmc/) · strict · locks ~Dec 23
- [ ] [r/Steam comment - u/zulunationslayer - "Set time range and niche/popularity range" (praising Steam's interactive recommender)](https://www.reddit.com/r/Steam/comments/1udelmc/_/otdih00/) · strict
- [ ] [r/gamingsuggestions - u/Overratedbeing - "Recommend me a game I've never heard of" (89 comments, Sep 11)](https://www.reddit.com/r/gamingsuggestions/comments/1wd66ly/) · strict · locks ~Mar 11
- [ ] [r/gaming - u/New_Importance2779 - "obscure or Indie game you can recommend that isn't an FPS?" (201 upvotes, 934 comments, Sep 1)](https://www.reddit.com/r/gaming/comments/1w479qe/) · strict · locks ~Mar 1
- [ ] [X - @PokeIndie - "Good Indie Games Disappear Too Fast" (25 likes, Oct 13)](https://x.com/PokeIndie/status/2109984473483825198)
- [ ] r/patientgamers - u/AccomplishedEvent273 - "How do you find hidden gems you missed in the past?" (Aug 5) (removed)

### 5. Filter by length ("short games", "a weekend") ✅ shipped 2026-10-30
People want game length on cards and as a filter. HowLongToBeat-at-a-glance plugins get big engagement.
Shipped: game cards show hours to beat at a normal pace, and the game page shows all three of IGDB's paces (rushed, normal pace, 100%). Browse has a Length menu (under 5 h, 5–15 h, 15–40 h, 40+ h). IGDB's "hastily" time is a rushed run (GTA San Andreas 7 h vs HowLongToBeat's 31 h main story), so the cards and the filter use "normally". Limit: IGDB only has lengths for about 5,400 games, almost all popular ones but only about a third of recent ones, and the filter uses the 500 most-reported games per band. Code: `LENGTH_BANDS` in `src/api/igdbApi.js`.
- [ ] [X - @Forhanvv - Steam Deck plugin with "HowLongToBeat stats" on the home screen (172 likes, Oct 16)](https://x.com/Forhanvv/status/2110952152969703677)
- [ ] [X - @heydemoura - "see how long to beat any game from the home screen" (152 likes, Oct 17)](https://x.com/heydemoura/status/2111525027917058511)
- [ ] r/gaming - u/Appropriate-Ebb-7525 - "not-too-long story games" (Aug 12) (removed)

### 6. "What should I play next?" from my own backlog ⛔ dropped 2026-10-30
Dropped: Game Changer isn't a store like Steam, so users don't own games here and there's no owned library to pick from. The wishlist already covers "games I want to play".
Big backlogs cause decision paralysis. People want the site to pick from games they already own or wishlisted, not from new ones. We also have no explicit "Backlog" status (wishlist, playing, played, dropped only; `useQuickStatus.js:13`).
Build: add a "Backlog / Own it" status, plus a "Pick for me" button that chooses from backlog by mood + length + why ("you loved X, this is the closest unplayed one").
- [ ] [r/gamingsuggestions - u/62lasa - "recommend the next 2 or 3 games i should play out of this backlog" (9 comments, Aug 20)](https://www.reddit.com/r/gamingsuggestions/comments/1vts62r/) · strict · locks ~Feb 20
- [ ] [r/patientgamers - u/189charizard - "Extremely long backlog, help me pick" (Aug 8)](https://www.reddit.com/r/patientgamers/comments/1vj5qtq/) · strict · locks ~Feb 8
- [ ] [r/patientgamers - u/bamb1nofaded - "nearly 400 games backlog, where to start?" (May 20)](https://www.reddit.com/r/patientgamers/comments/1tiay2a/) · strict · **locks ~Nov 20**
- [ ] [X - @rpgmaker2000 - "so many games i want to play and i havent been keeping track" (Jul 22)](https://x.com/rpgmaker2000/status/2079997302651957720)
- r/patientgamers - u/Rude_Direction4304 - "How do you decide what to play next when your backlog keeps growing?" (removed)
- r/patientgamers - u/shwomz - "tips on tracking your backlog and picking what to play next?" (removed)

### 7. Installable app (PWA) ✅ shipped 2026-10-30
Backloggd's most-repeated request on X is a phone app. They're web-only and even had to warn users about fake apps stealing logins. We're already responsive, so a PWA (manifest + icons + offline shell) is cheap and gets us "on the home screen".
Shipped: a full manifest (name, dark theme so launch doesn't flash white, Browse / For you / Your library shortcuts), new brand icons with a maskable one for Android, and a service worker (`vite-plugin-pwa`) that keeps the app shell, fonts and cover art for offline and never caches `/api`. "Install app" sits at the bottom of the mobile menu and in the footer, and only shows when the browser can install or on iPhone/iPad, where it opens the Share → Add to Home Screen steps and names the only official address. No popup on load. Icons regenerate from `pwa/icon-source.svg` (see `pwa-assets.config.js`).
- [ ] [X - @trailtexxt - "We need a Backloggd app" (Aug 2)](https://x.com/trailtexxt/status/2083936308724940888)
- [ ] [X - @fromfireforged - "How much money do I need to give Backloggd devs to make that app on iOS" (Aug 16)](https://x.com/fromfireforged/status/2089012894553833598)
- [ ] [X - @fableplayss - "I personally hate using backloggd due to it being web only" (Jul 11)](https://x.com/fableplayss/status/2075990520455700684)
- Context: [X - @BackloggdApp - "there is currently no official Backloggd app on iOS or Android" (640 likes, Sep 24)](https://x.com/BackloggdApp/status/2103132580011003948)

---

## Priority 2: strong demand, more work

### 8. Mood-based discovery 🟡 browse + home shipped 2026-10-30, For You next
The most-commented request posts are moods, not genres: "wreck me emotionally", "low stakes, aimless", "cozy but simple". Our AI chat can handle this, but there's no mood entry point on browse.
Shipped: five moods (Emotional, Cozy & low-stakes, Brain-off action, Scary but mild, Mind-bending), each an IGDB keyword/theme/genre query checked by hand on real results. Browse has a mood chip row (`?mood=`, one at a time, combines with every filter and the search), and the empty state offers to drop the mood. Home has a "Pick a mood" row of art tiles that open Browse on that mood, most popular first. A mood never overrides Never show. Code: `src/features/games/moods.js`.
Still to build: mood chips on For You with the AI re-rank (mood candidates, a mood boost in scoring, the mood in the model's reasons, saved picks per mood).
- [ ] [r/gamingsuggestions - u/Daedalparacosm3000 - "recommend me a game that will wreck me emotionally?" (203 upvotes, 668 comments, Oct 22)](https://www.reddit.com/r/gamingsuggestions/comments/1xc5he2/) · strict · locks ~Apr 22
- [ ] [r/gamingsuggestions - u/isthisevenreal1765 - "truly aimless, task-less, low stakes game ...during a rough mental patch" (32 comments, Oct 18)](https://www.reddit.com/r/gamingsuggestions/comments/1x9gmsf/) · strict · locks ~Apr 18
- [ ] [r/gaming - u/Bananafoofoofwee - "Please recommend some mildly scary games." (246 comments, Oct 14)](https://www.reddit.com/r/gaming/comments/1x66jbt/) · strict · locks ~Apr 14
- [ ] [r/gamingsuggestions - u/floatable_shark - "a game with an insane amount of destruction" (236 comments, Oct 21)](https://www.reddit.com/r/gamingsuggestions/comments/1xbp57z/) · strict · locks ~Apr 21

### 9. Price and deals ❌ M
People want "worth it at this price" and the cheapest store, and they shop by budget ("under $10"). We have free games (GamerPower) and store links, but no prices.
Build: current lowest price + historical low on game details (IsThereAnyDeal API through a new `api/` proxy with the usual guard), a "Max price" filter, and wishlist price-drop alerts (extends `useWishlistAlerts.jsx`).
- [ ] [r/gamingsuggestions - u/Most-Entertainer2845 - "website or app that tracks how many games i've finished and the prices" (Oct 24)](https://www.reddit.com/r/gamingsuggestions/comments/1xeem96/) · strict · locks ~Apr 24
- [ ] [r/Steam - u/redditd0ggy - "I kept only games <$10 ...Other recommendations?" (623 upvotes, 277 comments, Jun 30)](https://www.reddit.com/r/Steam/comments/1ujozg9/) · strict · locks ~Dec 30
- [ ] [r/Steam - u/Slow-Pack-8916 - "I have 20 usd ...can't find much cheap games" (Jun 15)](https://www.reddit.com/r/Steam/comments/1u62ywt/) · strict · locks ~Dec 15
- Competitor: [r/webdev - u/PhasersOnKill - "game recommendation site that helps you find new games at the best price" (Oct 10)](https://www.reddit.com/r/webdev/comments/1x2jyso/)

### 10. Import library (Steam first) ❌ M (Steam) / L (PSN, Xbox)
Every competing tracker launched on Reddit this year leads with "syncs Steam/PSN/Xbox". Logging games one by one is the pain point. Importing would also feed the taste profile instantly, so new users get good recs on day one.
Build: Steam import via Steam Web API (public profile, owned games + hours) mapped to IGDB through `external_games`.
- [ ] [X - @Generalkenobi47 - "backloggd has a library feature so now i gotta put everything on there one by one" (Sep 17)](https://x.com/Generalkenobi47/status/2100541417638498391)
- [ ] [X - @cheliseul - "it didn't mark my imported games from backloggd properly" (Sep 26)](https://x.com/cheliseul/status/2103856707273212326)
- Competitors: [GG'ed (r/backlog, Aug 15)](https://www.reddit.com/r/backlog/comments/1vp8yhf/), [Unalia (r/patientgamers, May 22)](https://www.reddit.com/r/patientgamers/comments/1tkpyyb/), [games + shows + books tracker (r/backlog, Sep 23)](https://www.reddit.com/r/backlog/comments/1wo4qxa/)
- r/patientgamers - u/efohvee - "Backlog management across multiple platforms" (Oct 14) (removed)

### 11. Custom lists ❌ M
We only have favorites. Lists (GOTY, "top 4", themed collections) are what Backloggd users show off and ask for.
Build: user lists (name, description, ordered games, public/private), "Add to list" from any game card, and a "Create new list" option right inside that menu.
- [ ] [r/backloggd - u/Lost-Building-3701 - "make a new list by hitting 'manage lists' from a game" (16 upvotes, Oct 16)](https://www.reddit.com/r/backloggd/comments/1x7qvvv/) · strict (competitor's sub) · locks ~Apr 16
- [ ] [r/backloggd - u/EthanRegg - "some sort of list template feature" (Jun 4)](https://www.reddit.com/r/backloggd/comments/1twp2r7/) · strict · locks ~Dec 4
- [ ] [X - @suzifumi - "i just like documenting things i like, my little lists" (84 likes, Aug 27)](https://x.com/suzifumi/status/2093072894368608373)
- [ ] [X - @FinalMasonry - "backloggd best of lists ...gonna need like 6 gameplay slots" (Aug 12)](https://x.com/FinalMasonry/status/2087619384822915176)

### 12. Private notes per game ❌ S
This means notes separate from the review: mods to install, where I left off, thoughts for a future review.
Build: a private `notes` field on `user_games` (RLS: owner only), plus a Notes tab in the log dialog.
- [ ] [r/backloggd - u/ManeBOI - "Feature idea: Notes ...private personalized notes for any game, similar to steam's notes" (Oct 25)](https://www.reddit.com/r/backloggd/comments/1xfdnxs/) · strict · locks ~Apr 25

### 13. Personal release calendar 🟡 S
Steam's personal calendar (upcoming games filtered to your taste and wishlist) got a big positive reaction. We have an Upcoming list and wishlist alerts, but no personal calendar view.
Build: a month/week calendar of upcoming releases filtered to wishlist + taste, with an "Add to calendar (.ics)" link.
- [ ] [r/Steam - u/wickedplayer494 - "Steam's Personal Calendar Full Release" (463 upvotes, Oct 23)](https://www.reddit.com/r/Steam/comments/1xdoprt/) · strict · locks ~Apr 23
- [ ] [X - @Elvick - "I wish you could have a mini version of the calendar on the homepage" (Jun 5)](https://x.com/Elvick/status/2062760398084817278)
- [ ] [r/gamingsuggestions - u/JustATad_ - "What does the perfect 'Upcoming Games' section on a website look like?" (Jul 22)](https://www.reddit.com/r/gamingsuggestions/comments/1v3g6ah/) · strict · locks ~Jan 22

### 14. "Surprise me / outside my comfort zone" mode ❌ S
Some players are tired of "slightly different version of what you already play" and want a deliberate stretch pick.
Build: an "Explore" toggle on For You that picks from genres the user rarely plays but that share a theme/mood with their favorites, and says so in the "why".
- [ ] [r/gaming - u/AccountJustForNino - "Why recommend similar games instead of new ones? ...can you give me a genre I DONT play?" (Oct 16)](https://www.reddit.com/r/gaming/comments/1x7ax8k/) · strict · locks ~Apr 16

---

## Priority 3: real needs, bigger lift

### 15. Runs on my PC (low-spec filter) ❌ L
These threads get hundreds of comments. IGDB has no system requirements, so this needs Steam store data (`pc_requirements`) or a curated "low-spec friendly" flag.
- [ ] [r/gamingsuggestions - u/ArtistWithoutArt - "PC died ...19 yr old laptop. Recommend extremely low spec games." (104 upvotes, 316 comments, Sep 1)](https://www.reddit.com/r/gamingsuggestions/comments/1w431ye/) · strict · locks ~Mar 1
- [ ] [r/gamingsuggestions - u/anfique-hv - "a game that runs on my low-end PC (GT 1030 2GB, 8GB DDR4)" (Sep 19)](https://www.reddit.com/r/gamingsuggestions/comments/1wkktew/) · strict · locks ~Mar 19
- [ ] [r/gamingsuggestions - u/Homeless_CEO_ - "AAA/open-world games for my weak setup" (Sep 20)](https://www.reddit.com/r/gamingsuggestions/comments/1wlekbh/) · strict · locks ~Mar 20

### 16. Accessibility and input filters (mouse-only, one hand) ❌ L
People with injuries are asking for games they can physically play. No data source covers this well, so start with a curated keyword set ("mouse only", "turn-based", "one-handed") and let users tag games.
- [ ] [r/gamingsuggestions - u/Environmental_Dish77 - "steam games I can play with just a mouse ...injury to my wrist" (131 upvotes, 303 comments, Aug 28)](https://www.reddit.com/r/gamingsuggestions/comments/1w0casn/) · strict · locks ~Feb 28
- [ ] [r/gamingsuggestions - u/Brick_Grimes - "hurt my hand ...can only use my pointer finger and thumb" (Oct 4)](https://www.reddit.com/r/gamingsuggestions/comments/1wxhmkj/) · strict · locks ~Apr 4

### 17. Follow people whose taste you trust, with blocking built in ❌ L
Players trust specific people over critics, and find "taste twins" by who rated a niche game 5/5. But Backloggd's social side is also its most hated part (see Hates). If we build this, launch with block/mute and a "hide community reviews" option from day one.
- [ ] [X - @NeonZoux - "I trust some randoms I follow on Backloggd and Twitter more than any games journalist" (182 likes, Oct 2)](https://x.com/NeonZoux/status/2106136307932025158)
- [ ] [X - @lutyrannus - "Finding my mutuals on Backloggd by scrolling through all the people who rated Monster Hunter 2 as 5/5" (42 likes, Sep 23)](https://x.com/lutyrannus/status/2102877488787411376)
- [ ] [X - @fisphophyllite - "on some of these cataloguing sites I wish I could block people" (Oct 11)](https://x.com/fisphophyllite/status/2109084472973160721)

### 18. Owned-collection shelf (physical + digital, editions) ❌ M
- [ ] [X - @rubynesoberi - "Backloggd ...doesn't feel great for actually cataloguing your owned collection ...some sort of digital shelf" (Aug 18)](https://x.com/rubynesoberi/status/2089853947121156212)

---

## Hates: things to avoid (or fix if we already do them)

1. **The same popular games again and again.** Rotate home rows and never repeat a game the user already saw/hid this week. [u/Least_Yard_4327, r/Steam](https://www.reddit.com/r/Steam/comments/1udelmc/)
2. **Adult content and AI-slop capsule art in recommendations.** Keep the erotic-theme filter and the existing junk filters on by default for everyone (Priority 1 #3). [u/lean_hoemoan](https://www.reddit.com/r/Steam/comments/1wa0dvd/), [u/tomodashi96](https://www.reddit.com/r/Steam/comments/1xca07g/)
3. **One off-genre game wrecking the whole profile.** Weight by rating and hours (we do), and let users exclude a game (Priority 1 #2). [u/Ray-Zide426](https://www.reddit.com/r/Steam/comments/1vxpzxp/)
4. **Recs that don't match anything I played.** Always show the "because you liked X" line. We do this; keep it on every pick, including the AI chat. [u/Typek834 comment](https://www.reddit.com/r/Steam/comments/1udelmc/_/otceb12/)
5. **Duplicate and irrelevant results.** Dedupe editions/remasters/bundles in every list. [u/Few-Reading5087 on SteamPeek](https://www.reddit.com/r/gamingsuggestions/comments/1vbziby/)
6. **Seeing things I already ignored.** Hidden means hidden everywhere: browse, search rows, AI chat. [@BortBurgoes](https://x.com/BortBurgoes/status/2105044818703663442)
7. **A fast "preview" mode that hides the real store page.** On mobile, keep a one-tap path to full details. [u/Oblic008, r/Steam](https://www.reddit.com/r/Steam/comments/1tzojob/)
8. **Toxic reviews, taste-shaming and power-user moderation.** If reviews go social: block/mute, sort by helpful, and a "hide community reviews" setting. [@nenetiansnares](https://x.com/nenetiansnares/status/2107652778596180121), [@Sweguin7](https://x.com/Sweguin7/status/2075640030647758994), [@heavenspex](https://x.com/heavenspex/status/2112052935719092482)
9. **Logging as a chore or a flex.** Don't push users to rate every game they ever played. Make logging optional and quick. [@FinalMasonry](https://x.com/FinalMasonry/status/2099943135174328683), [@dmc3lady](https://x.com/dmc3lady/status/2095442294530793965)
10. **Paywalled customization.** Keep profile basics free. [@cheliseul](https://x.com/cheliseul/status/2103696804533403980)
11. **Time-to-beat numbers that feel wrong.** Show main / main+extras / completionist ranges and say it depends on playstyle. [@KiwiJuicez](https://x.com/KiwiJuicez/status/2107172125589242136)
12. **Web-only, no app.** Fixed: the site installs as an app (Priority 1 #7). [@fableplayss](https://x.com/fableplayss/status/2075990520455700684)
13. **Fake apps phishing logins.** The iPhone install steps name the only official address. [@BackloggdApp](https://x.com/BackloggdApp/status/2103132580011003948)

---

## Reply now ✅ (we already have this)

These people asked for something Game Changer already does. Reply as the builder where the rule allows it. For strict subs, skip or use the weekly thread.

- **Recommendations based on my favorites, with the reason why** (For You + `because_of`, `useGetRecommendations.js:126`)
  - [ ] [r/gaming - u/MurkyUnit3180 - "Recommend me games based on my favorites" (35 comments, Aug 20)](https://www.reddit.com/r/gaming/comments/1vtm5c0/) · strict
  - [ ] [r/gamingsuggestions - u/Skrubbadub - "What games do you recommend based on my favourites?" (45 comments, Oct 24)](https://www.reddit.com/r/gamingsuggestions/comments/1xe4pi9/) · strict
  - [ ] [r/gamingsuggestions - u/Imaginary_Worker1656 - "based on my favorites?" (Oct 9)](https://www.reddit.com/r/gamingsuggestions/comments/1x1mn9f/) · strict
  - [ ] [r/gamingsuggestions - u/BraumAndBard - "What would you recommend for me based on my favs?" (Oct 7)](https://www.reddit.com/r/gamingsuggestions/comments/1wzx0ja/) · strict
  - [ ] [X - @Jenbox360 - "I don't think Steam recommendations is working as intended" (126 likes, Oct 28)](https://x.com/Jenbox360/status/2115450508462768450)
  - [ ] [X - @eggsfordogs - "steam recommendations just dont give a f*** anymore" (Aug 22)](https://x.com/eggsfordogs/status/2091269804988809695)
- **An accurate recommender site to replace one that died** (For You + "games like X")
  - [ ] [r/gamingsuggestions - u/Few-Reading5087 - "What happened to the game recommender website Mythic Map ...steampeek shows duplicate and irrelevant games" (Jul 31)](https://www.reddit.com/r/gamingsuggestions/comments/1vbziby/) · strict · locks ~Jan 31
- **Filter by themes, not just broad genres** (genre + theme menu in `useFilterMenus.js`)
  - [ ] [r/backloggd - u/gabriel29ewui - "filter by themes? IGDB has a theme feature, but backloggd didn't include that option" (Oct 15)](https://www.reddit.com/r/backloggd/comments/1x6l4v7/) · strict (competitor's sub, don't promote there)
  - [ ] [X - @nayrunayru - "i wish backloggd actually had genre descriptors more specific than 'Adventure' and 'Puzzle'" (Sep 10)](https://x.com/nayrunayru/status/2098087054013792443)
- **"Not for me" that teaches the recommender** (dismiss with reasons + Hidden page)
  - [ ] [X - @AphantasticR - "smashing ignore 95% of the time and waiting for that one weird gem" (26 likes, Aug 31)](https://x.com/AphantasticR/status/2094471166802985113)
- **A cataloguing site without the toxic review culture** (personal library, ratings, private by default)
  - [ ] [X - @Niflheimm155983 - "ignore the user reviews ...it's a great site for just cataloguing your own things" (Sep 20)](https://x.com/Niflheimm155983/status/2101771239903854777)
  - [ ] [X - @rpgmaker2000 - "i need to create a backloggd or something" (Jul 22)](https://x.com/rpgmaker2000/status/2079997302651957720)

---

## Competitors seen on Reddit this year (study, don't reply)

- [Playfeed, a Steam game discovery site (r/gamingsuggestions, Sep 22)](https://www.reddit.com/r/gamingsuggestions/comments/1wnanv0/)
- [Free site that finds Steam games similar to ones you love (r/gamingsuggestions, Oct 1)](https://www.reddit.com/r/gamingsuggestions/comments/1wuu45b/)
- [Suggestions from two input games (r/gamingsuggestions, Aug 9)](https://www.reddit.com/r/gamingsuggestions/comments/1vk109a/)
- [Indie discovery by mood/time/preferences (r/IndieGaming, Jun 17)](https://www.reddit.com/r/IndieGaming/comments/1u8mq04/)
- [A better Steam Discovery Queue (r/Games, Jul 28)](https://www.reddit.com/r/Games/comments/1v9bvp5/)
- [Find games with friends, by studio/designer (r/SideProject, Oct 30)](https://www.reddit.com/r/SideProject/comments/1xj9k3d/)
- [Steam Playtest discovery hub (r/IndieGaming, Oct 29)](https://www.reddit.com/r/IndieGaming/comments/1xik6kv/)

Common pattern: they all lead with one sharp hook (two-game input, mood, best price, Steam sync). Game Changer's sharpest hook today is "recommendations that tell you why". Lead with that.

## Research notes

- Reddit was read through the Arctic Shift archive (reddit.com blocks automated tools). Scores in the archive can lag the live post.
- X was searched with keyword + engagement filters. Most generic "game discovery" tweets are dev marketing, so they were skipped.
- Lock dates assume Reddit's default 6-month archive. Some subs turn archiving off, so a link may stay open longer.
