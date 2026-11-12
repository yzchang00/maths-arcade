// Connects the Maths Arcade to Firebase: leaderboard, usage log, and optional Google sign-in to save progress.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, getDoc, setDoc, doc, query, where, limit, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

if (firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith("PASTE")) {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);
  const clean = (s, n) => String(s || "").slice(0, n);

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

  window.ARCB = {
    // One document per player per game, holding their best score only (keeps the free Firebase plan well within its limits).
    post: async (r) => {
      const id = [r.game, r.cls, r.nick].map(x => clean(x, 40).replace(/[\/\s]+/g, "_")).join("__");
      const ref = doc(db, "scores", id), old = await getDoc(ref);
      if (old.exists() && old.data().score >= r.score) return { kept: true };
      return setDoc(ref, {
        game: clean(r.game, 40), title: clean(r.title, 60), level: clean(r.level, 12),
        nick: clean(r.nick, 14), cls: clean(r.cls, 8), score: r.score, stars: r.stars,
        mode: clean(r.mode, 8), ts: serverTimestamp()
      });
    },
    top: async (game) => {
      const snap = await getDocs(query(collection(db, "scores"), where("game", "==", game), limit(1000)));
      return snap.docs.map(d => { const x = d.data(); return { nick: x.nick, cls: x.cls, score: x.score, stars: x.stars, t: x.ts ? x.ts.toMillis() : Date.now() }; });
    },
    log: (e) => addDoc(collection(db, "visits"), {
      event: clean(e.event, 10), game: clean(e.game, 40), score: e.score, nick: clean(e.nick, 14), cls: clean(e.cls, 8),
      sid: clean(e.sid, 12), device: clean(e.device, 10), ts: serverTimestamp()
    }),
    canSignIn: true,
    user: null,
    signIn: () => signInWithPopup(auth, new GoogleAuthProvider().setCustomParameters({ prompt: "select_account" })),
    // Signing out also clears this device's progress, so the next pupil on a shared device starts fresh.
    signOut: async () => { clearTimeout(timer); progKeys().forEach(k => LS.removeItem(k)); await signOut(auth); }
  };

  onAuthStateChanged(auth, async (u) => {
    user = null; window.ARCB.user = null;
    if (u) {
      try { const s = await getDoc(doc(db, "players", u.uid)); if (s.exists()) mergeIn(s.data().p); } catch (e) { console.warn("Could not load progress", e); }
      user = u; window.ARCB.user = { first: clean((u.displayName || "").split(" ")[0], 20) };
      save();
    }
    dispatchEvent(new Event("arcb-auth"));
  });

  dispatchEvent(new Event("arcb-ready"));
} else {
  console.info("Maths Arcade: Firebase not set up yet, so the leaderboard is off. See README.md.");
}
