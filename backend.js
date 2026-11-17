// Connects the Maths Arcade to Firebase: leaderboards, usage log, online rooms, and optional Google sign-in to save progress.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, getDoc, setDoc, deleteDoc, doc, query, where, limit, serverTimestamp, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInAnonymously, linkWithPopup, signInWithCredential, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { firebaseConfig, teacherEmails } from "./firebase-config.js";

if (firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith("PASTE")) {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);
  const clean = (s, n) => String(s || "").slice(0, n);
  // Scores saved before difficulty levels existed have no "diff"; they are shown as "old".
  const row = d => { const x = d.data(); return { id: d.id, game: x.game, diff: x.diff || "old", mode: x.mode, nick: x.nick, cls: x.cls, score: x.score, stars: x.stars, t: x.ts ? x.ts.toMillis() : Date.now() }; };

  // ---- Every device gets an invisible anonymous ID (no name, no email). The database rules use it so that
  // a device can only change its own scores and its own place in an online room. ----
  // Waits for the saved ID to load first, so a device keeps the same ID from visit to visit.
  let authReady = null;
  const ensureAuth = () => {
    if (auth.currentUser) return Promise.resolve(auth.currentUser);
    if (!authReady) authReady = auth.authStateReady()
      .then(() => auth.currentUser || signInAnonymously(auth).then(c => c.user))
      .catch(e => { authReady = null; throw e; });
    return authReady;
  };

  // ---- Saved progress (only for pupils who choose to sign in with Google) ----
  // Stored in players/{uid}: just the game progress below. No email or real name is saved.
  const KEEP = /^(arcMe|arcBest_|arcLvl_|arcLevel|vmBest|rqMix)/;
  const LS = window.localStorage, rawSet = Storage.prototype.setItem;
  const progKeys = () => { const a = []; try { for (let i = 0; i < LS.length; i++) { const k = LS.key(i); if (KEEP.test(k)) a.push(k); } } catch (e) {} return a; };
  const snapshot = () => { const o = {}; progKeys().slice(0, 400).forEach(k => o[k.slice(0, 60)] = String(LS.getItem(k)).slice(0, 300)); return o; };
  const isNum = v => v != null && v !== "" && !isNaN(+v);
  let user = null, timer = null;
  const save = () => { if (!user) return; clearTimeout(timer); timer = setTimeout(() => {
    setDoc(doc(db, "players", user.uid), { p: snapshot(), ts: serverTimestamp() }).catch(e => console.warn("Progress not saved", e));
  }, 2500); };
  // Any progress the games write is copied to the pupil's account a moment later.
  Storage.prototype.setItem = function (k, v) { rawSet.call(this, k, v); if (this === LS && user && KEEP.test(k)) save(); };
  const mergeIn = (cloud) => {
    for (const [k, cv] of Object.entries(cloud || {})) {
      if (!KEEP.test(k)) continue;
      const lv = LS.getItem(k);
      if (k === "arcMe") {
        let c = null; try { c = JSON.parse(cv); } catch (e) {}
        if (c && c.nick) rawSet.call(LS, k, cv);                                   // the account's nickname wins
      } else if ((k.startsWith("arcBest_") || k === "vmBest") && isNum(cv)) {
        if (!isNum(lv) || +cv > +lv) rawSet.call(LS, k, cv);                         // keep the higher best score
      } else if (lv == null) rawSet.call(LS, k, cv);
    }
  };

  // ---- Profiles (Google sign-in only). users/{uid} holds who signed in; plays/{id} holds each finished game.
  // The rules let a pupil read only their own; the admin (and, later, teachers for their own classes) can read them.
  const ADMINS = (teacherEmails || []).map(x => String(x).toLowerCase());
  const myNick = () => { try { return JSON.parse(LS.getItem("arcMe") || "null") || {}; } catch (e) { return {}; } };
  const touchUser = async (u) => {
    const ref = doc(db, "users", u.uid), me = myNick();
    const base = { name: clean(u.displayName, 60), email: clean(u.email, 100), nick: clean(me.nick, 14), cls: clean(me.cls, 8), last: serverTimestamp() };
    const s = await getDoc(ref);
    return setDoc(ref, { ...base, first: s.exists() && s.data().first ? s.data().first : serverTimestamp() });
  };
  // Is this account staff? The admin list is in firebase-config.js. Teachers are documents in staff/{email} = { role: "teacher", classes: ["5B", ...] }.
  const staffOf = async (u) => {
    const email = String(u.email || "").toLowerCase();
    if (ADMINS.includes(email)) return { admin: true, staff: true };
    try { const s = await getDoc(doc(db, "staff", email)); if (s.exists()) return { admin: false, staff: true, classes: s.data().classes || [] }; } catch (e) {}
    return { admin: false, staff: false };
  };

  window.ARCB = {
    // Feedback from Ask Qubi (guests too). Files arrive already shrunk by the page: [{name, type, data (a data: URL)}].
    feedback: async (f) => { const u = await ensureAuth(); const me = user ? myNick() : null;
      return addDoc(collection(db, "feedback"), {
        uid: u.uid, kind: clean(f.kind, 20), msg: clean(f.msg, 1000), page: clean(f.page, 60), game: clean(f.game, 60), round: clean(f.round, 40),
        level: clean(f.level, 20), mode: clean(f.mode, 12), nick: clean(me && me.nick, 14), cls: clean(me && me.cls, 8), signed: !!user,
        screen: clean(f.screen, 20), files: (f.files || []).slice(0, 2).map(x => ({ name: clean(x.name, 80), type: clean(x.type, 80), data: String(x.data) })),
        status: "new", ts: serverTimestamp() }); },
    // One finished game of a signed-in pupil (guests are never recorded here).
    play: async (p) => { if (!user) return; return addDoc(collection(db, "plays"), {
      uid: user.uid, nick: clean(p.nick, 14), cls: clean(p.cls, 8), game: clean(p.game, 40), title: clean(p.title, 60), level: clean(p.level, 12),
      strand: clean(p.strand, 12), topic: clean(p.topic, 80), diff: clean(p.diff || "-", 8), mode: clean(p.mode, 8),
      score: Math.round(p.score) || 0, max: Math.round(p.max) || 0, stars: p.stars == null ? -1 : p.stars,
      res: clean(p.res, 40), rt: clean(p.rt, 120), ts: serverTimestamp() }); },
    // Called after the pupil picks or changes their nickname or class.
    profile: async () => { if (user) return touchUser(user); },
    // One document per player per game per difficulty, holding their best score only.
    // Stars are kept from the best solo result, so a higher robot/online score never wipes a 3-star solo result.
    // Returns {saved}, {kept} (an equal or better score is already there) or {taken} (that name and class belong to another device).
    post: async (r) => {
      const u = await ensureAuth();
      const diff = clean(r.diff || "-", 8);
      const id = [r.game, diff, r.cls, r.nick].map(x => clean(x, 40).replace(/[\/\s]+/g, "_")).join("__");
      const ref = doc(db, "scores", id), old = await getDoc(ref);
      const o = old.exists() ? old.data() : null;
      if (o && o.uid && o.uid !== u.uid) return { taken: true };
      const stars = Math.max(r.stars, o ? o.stars : -1);
      const base = { game: clean(r.game, 40), title: clean(r.title, 60), level: clean(r.level, 12), diff,
        nick: clean(r.nick, 14), cls: clean(r.cls, 8), uid: u.uid, ts: serverTimestamp() };
      if (o && o.score >= r.score) {
        if (stars > o.stars || !o.uid) { await setDoc(ref, { ...base, score: o.score, stars, mode: clean(o.mode, 8) }); return { saved: true }; }
        return { kept: true };
      }
      await setDoc(ref, { ...base, score: r.score, stars, mode: clean(r.mode, 8) });
      return { saved: true };
    },
    rank: async (game, diff) => (await getDocs(query(collection(db, "scores"), where("game", "==", game), where("diff", "==", diff), limit(500)))).docs.map(row),
    top: async (game) => (await getDocs(query(collection(db, "scores"), where("game", "==", game), limit(2000)))).docs.map(row),
    // Arcade Champions: every 3-star result (only solo games give stars).
    champs: async () => (await getDocs(query(collection(db, "scores"), where("stars", "==", 3), limit(5000)))).docs.map(row),
    log: async (e) => { await ensureAuth(); return addDoc(collection(db, "visits"), {
      event: clean(e.event, 10), game: clean(e.game, 40), score: e.score, nick: clean(e.nick, 14), cls: clean(e.cls, 8),
      sid: clean(e.sid, 12), device: clean(e.device, 10), ts: serverTimestamp()
    }); },
    canSignIn: true,
    user: null,
    // A pupil's anonymous ID is upgraded to their Google account, so the scores they already saved stay theirs.
    // If that Google account was already used on another device, it simply signs in to it.
    signIn: async () => {
      const p = new GoogleAuthProvider().setCustomParameters({ prompt: "select_account" });
      const cur = auth.currentUser;
      if (cur && cur.isAnonymous) {
        try { return await linkWithPopup(cur, p); }
        catch (e) {
          const cred = GoogleAuthProvider.credentialFromError(e);
          if (e.code === "auth/credential-already-in-use" && cred) return signInWithCredential(auth, cred);
          throw e;
        }
      }
      return signInWithPopup(auth, p);
    },
    // Signing out also clears this device's progress, so the next pupil on a shared device starts fresh.
    signOut: async () => { clearTimeout(timer); progKeys().forEach(k => LS.removeItem(k)); await signOut(auth); authReady = null; ensureAuth(); }
  };

  // ---- Online rooms: each player is one small document in rooms/arc-<code>/p/<their id>_<tab>. Everyone in the room watches the list live.
  // The rules only let a device change or remove its own document, and "joined" is stamped by the server once, so nobody can pretend to be the host. ----
  const FIELDS = ["nick", "code", "status", "score", "round", "game", "level", "startAt", "seed", "topic", "team", "teams"];
  window.ARCROOM = {
    // true if nobody is in that room right now (used to avoid giving two classes the same code)
    isFree: async (name) => { await ensureAuth(); const s = await getDocs(query(collection(db, "rooms", name, "p"), limit(20)));
      const now = Date.now(); return !s.docs.some(d => { const t = d.data().seen; return !t || now - t.toMillis() < 75000; }); },
    // reuse: the same device rejoining the same room gets its old entry back (same place in the join order, same team, same score).
    join: async (name, reuse) => {
      const u = await ensureAuth();
      const sfx = reuse && /^[a-z0-9]{4,8}$/.test(reuse) ? reuse : Math.random().toString(36).slice(2, 8);
      const pid = u.uid + "_" + sfx;
      const col = collection(db, "rooms", name, "p"), me = doc(col, pid);
      let created = false;
      if (reuse) { try { created = (await getDoc(me)).exists(); } catch (e) {} }
      // Closing the tab or refreshing only marks us "away", so we can come back as the same player. Leaving on purpose deletes the entry.
      const bye = () => { if (created) setDoc(me, { status: "away", seen: serverTimestamp() }, { merge: true }).catch(() => {}); };
      addEventListener("pagehide", bye);
      // Check in every 30 seconds so others can tell we are still here.
      const beat = setInterval(() => { if (created) setDoc(me, { seen: serverTimestamp() }, { merge: true }).catch(() => {}); }, 30000);
      return {
        sfx, rejoined: created,
        presence: async (p) => { const d = {}; FIELDS.forEach(k => { if (p && k in p) d[k] = p[k] === undefined ? null : p[k]; });
          if (!created) { await setDoc(me, { ...d, joined: serverTimestamp(), seen: serverTimestamp() }); created = true; return; }
          return setDoc(me, { ...d, seen: serverTimestamp() }, { merge: true }); },
        // Players whose device stops checking in for 75 seconds (closed tab, lost Wi-Fi) drop off the list.
        onPeers: (cb, err) => {
          let last = [];
          const emit = () => { const now = Date.now(); cb({ peers: last.filter(p => p.sameTab || now - p.t < 75000) }); };
          const un = onSnapshot(col, snap => {
            const now = Date.now();
            last = snap.docs.map(d => { const x = d.data(); return { id: d.id, t: x.seen ? x.seen.toMillis() : now, joined: x.joined ? x.joined.toMillis() : now, presence: x, sameTab: d.id === pid }; });
            emit();
          }, e => err && err(e));
          const iv = setInterval(emit, 5000);
          return () => { clearInterval(iv); un(); };
        },
        leave: async () => { clearInterval(beat); removeEventListener("pagehide", bye); try { await deleteDoc(me); } catch (e) {} }
      };
    }
  };

  onAuthStateChanged(auth, async (u) => {
    user = null; window.ARCB.user = null;
    if (u && !u.isAnonymous) {
      try { const s = await getDoc(doc(db, "players", u.uid)); if (s.exists()) mergeIn(s.data().p); } catch (e) { console.warn("Could not load progress", e); }
      user = u; window.ARCB.user = { first: clean((u.displayName || "").split(" ")[0], 20), admin: false, staff: false };
      save();
      touchUser(u).catch(e => console.warn("Profile not saved", e));
      staffOf(u).then(r => { if (window.ARCB.user && user === u) { Object.assign(window.ARCB.user, r); if (r.staff) dispatchEvent(new Event("arcb-auth")); } });
    }
    dispatchEvent(new Event("arcb-auth"));
  });

  ensureAuth();
  dispatchEvent(new Event("arcb-ready"));
} else {
  console.info("Maths Arcade: Firebase not set up yet, so the leaderboard is off. See README.md.");
}
