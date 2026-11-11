// Connects the Maths Arcade to Firebase Firestore for the leaderboard and the usage log.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, getDoc, setDoc, doc, query, where, limit, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

if (firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith("PASTE")) {
  const db = getFirestore(initializeApp(firebaseConfig));
  const clean = (s, n) => String(s || "").slice(0, n);
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
    })
  };
  dispatchEvent(new Event("arcb-ready"));
} else {
  console.info("Maths Arcade: Firebase not set up yet, so the leaderboard is off. See README.md.");
}
