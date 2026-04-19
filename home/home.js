// home.js — přidej do HTML: <script src="home.js"></script>

/* 1) Random hero image (U1–U4) + smooth fade/replace + auto-cycle */
(function() {
  const images = ["u1.png","u2.png","u3.png","u4.png"];
  const el = document.getElementById("hero-img");
  if (!el) return;

  let idx = Math.floor(Math.random() * images.length);
  el.src = images[idx];
  // force reflow for transition
  setTimeout(()=> el.classList.add("visible"), 30);

  // cycle images every 7s (fade out -> change -> fade in)
  setInterval(()=>{
    el.classList.remove("visible");
    setTimeout(()=>{
      idx = (idx + 1) % images.length;
      el.src = images[idx];
      // small timeout to allow browser to set new src before fade in
      setTimeout(()=> el.classList.add("visible"), 60);
    }, 420); // short gap for fade-out
  }, 7000);
})();

/* 2) Scroll reveal for all .reveal elements (and initial call) */
(function(){
  const reveals = Array.from(document.querySelectorAll(".reveal"));
  if (!reveals.length) return;

  function onScroll(){
    const vh = window.innerHeight;
    for (const r of reveals){
      const rect = r.getBoundingClientRect();
      if (rect.top < vh - 100) r.classList.add("active");
    }
  }
  window.addEventListener("scroll", onScroll, {passive:true});
  // initial check
  onScroll();
})();

/* 3) Smooth internal link scrolling (for anchors like #castingy) */
(function(){
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const target = document.querySelector(a.getAttribute('href'));
      if (target){
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  });
})();
