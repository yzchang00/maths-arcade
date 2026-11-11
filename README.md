# Maths Arcade: class website with leaderboard and tracker

This folder is the whole website. GitHub Pages hosts the games for free. Firebase (Google's free database) stores the leaderboard and the usage log.

| File | What it is |
|---|---|
| `index.html` | The Maths Arcade games, with nicknames and a 🏆 leaderboard |
| `dashboard.html` | The teacher tracker: who played, which games, which classes, and when |
| `firebase-config.js` | **You fill this in** (step 2) |
| `firestore.rules` | Security rules you paste into Firebase (step 3) |
| `backend.js` | Connects the games to Firebase. No changes needed |
| `source/` | The part files the site is built from. You only need them if you ask Claude to change a game |

Until you fill in `firebase-config.js`, the games still work but the leaderboard stays hidden.

---

## Part A: Set up Firebase (about 10 minutes)

### 1. Create a project
1. Go to <https://console.firebase.google.com> and sign in with your teacher Google account.
2. Click **Create a project** and name it `maths-arcade`. Google Analytics is not needed, so you can switch it off.

### 2. Add a web app and copy its settings
1. On the project home page, click the **web icon `</>`**.
2. Name the app `maths-arcade` and click **Register app**. Leave Firebase Hosting unticked.
3. Firebase shows a block of code containing `const firebaseConfig = { apiKey: ..., ... }`.
4. Open `firebase-config.js` in Notepad and replace each `PASTE...` value with the matching value from that block.
5. In the same file, change `your.teacher.email@example.com` to your own Google email. Only this email can open the tracker. To allow more teachers, list them like this: `["a@x.com","b@y.com"]`.

### 3. Turn on the database
1. In the left menu, choose **Build → Firestore Database → Create database**.
2. For location, choose **asia-southeast1 (Singapore)**. Then choose **Start in production mode**.
3. Open the **Rules** tab and delete everything in it. Paste in the whole of `firestore.rules`.
4. In the rules, change `your.teacher.email@example.com` to the same email(s) you used in step 2.
5. Click **Publish**.

### 4. Turn on teacher sign-in (for the tracker)
1. Choose **Build → Authentication → Get started**, then **Google**. Switch it on and click **Save**.
2. Open **Authentication → Settings → Authorized domains** and click **Add domain**.
3. Add `YOUR-GITHUB-USERNAME.github.io`, using your real GitHub username.

---

## Part B: Put the site on GitHub Pages (with GitHub Desktop)

1. In GitHub Desktop, choose **File → New repository**.
   - Name it `maths-arcade`.
   - Pick a local folder to keep it in.
   - Click **Create repository**.
2. Copy **every file in this folder** (including the `source` folder) into the new repository folder.
3. Back in GitHub Desktop, type a summary such as "First version" and click **Commit to main**.
4. Click **Publish repository**.
   - Untick **Keep this code private**. GitHub Pages on a free account needs a public repository.
   - Your students' data is **not** in the repository. It lives in Firebase.
5. On github.com, open the repository and go to **Settings → Pages**.
   - Under **Branch**, pick `main` and `/ (root)`.
   - Click **Save**.
6. After a minute or two, your links will be:
   - Games: `https://YOUR-GITHUB-USERNAME.github.io/maths-arcade/`
   - Tracker: `https://YOUR-GITHUB-USERNAME.github.io/maths-arcade/dashboard.html`

## Updating the games later
Ask Claude for a new version of the site, copy the new files over the old ones in the repository folder, then **Commit** and **Push origin** in GitHub Desktop. The live site updates within a couple of minutes.

---

## How it works for pupils
- The first time a pupil opens the arcade, they type a **nickname** and their **class** (e.g. 5B), or play as a guest.
- When they finish a game, their score goes to the leaderboard. In multiplayer games, this happens only when they play against Robo.
- Only each pupil's **best** score per game is kept.
- The leaderboard can show all classes or just their own class.
- Nicknames are saved on that device. Pupils can tap **Change** on the home screen to switch.

## How the tracker works for you
`dashboard.html` (Google sign-in, teacher emails only) shows:
- How many players, visits, and games started and finished.
- A chart of games started per day.
- The most played games, with average scores.
- A table for each class.
- A searchable list of players with their last-seen time.
- A recent-activity feed.
- A CSV download of everything.

You can **delete** a rude or test nickname from the leaderboard there.

## Good to know
- **Privacy:** tell pupils to use nicknames, not full names. The arcade saves no emails or passwords for pupils. Check your school's guidelines on pupil data (PDPA) before you use it with a class.
- **Free plan limits:** Firebase's free Spark plan allows about 50,000 reads and 20,000 writes a day. That is plenty for several classes. Each game adds about 2–3 writes.
- **Cheating:** a determined pupil could post a fake score. If you see one, delete it in the tracker.
