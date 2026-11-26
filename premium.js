(function () {
  /* Premium animation layer — adds motion only. It never changes
     wording, photos, layout or the live site's own behaviour. */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var gate = document.getElementById('gate');

  /* --- lobby: drifting petals + twinkling sparkles --- */
  if (gate && !reduce) {
    var petals = document.createElement('div');
    petals.className = 'ds-petals'; petals.setAttribute('aria-hidden', 'true');
    var px = [6, 16, 27, 38, 49, 58, 67, 76, 85, 93];
    for (var i = 0; i < px.length; i++) {
      var s = document.createElement('span');
      s.style.setProperty('--x', px[i] + '%');
      s.style.setProperty('--d', (15 + (i * 7) % 9) + 's');
      s.style.setProperty('--dl', (-3 - i * 1.7) + 's');
      s.style.setProperty('--sw', ((i % 2 ? -1 : 1) * (30 + (i * 13) % 24)) + 'px');
      s.style.setProperty('--s', (0.65 + (i % 4) * 0.15).toFixed(2));
      petals.appendChild(s);
    }
    gate.appendChild(petals);
    var sparkles = document.createElement('div');
    sparkles.className = 'ds-sparkles'; sparkles.setAttribute('aria-hidden', 'true');
    var sp = [[10,16],[22,64],[33,28],[44,78],[55,12],[63,44],[71,20],[79,70],[87,36],[92,82],[15,88],[50,56]];
    for (var j = 0; j < sp.length; j++) {
      var t = document.createElement('span');
      t.style.setProperty('--x', sp[j][0] + '%');
      t.style.setProperty('--y', sp[j][1] + '%');
      t.style.setProperty('--d', (3 + (j % 5) * 0.4) + 's');
      t.style.setProperty('--dl', (-0.5 - j * 0.35) + 's');
      sparkles.appendChild(t);
    }
    gate.appendChild(sparkles);
  }

  /* --- a burst of hearts when the real password opens the gift --- */
  var form = document.getElementById('unlockForm');
  if (form && !reduce) {
    form.addEventListener('submit', function () {
      var input = document.getElementById('password');
      if (!input || input.value !== '0906') return; /* the site's real password */
      for (var b = 0; b < 16; b++) {
        var heart = document.createElement('span');
        heart.className = 'ds-burst-heart';
        heart.textContent = '♡';
        var ang = (Math.PI * 2 * b) / 16 + Math.random() * 0.4;
        var dist = 120 + Math.random() * 190;
        heart.style.setProperty('--tx', Math.cos(ang) * dist + 'px');
        heart.style.setProperty('--ty', Math.sin(ang) * dist + 'px');
        heart.style.setProperty('--rot', (Math.random() * 90 - 45) + 'deg');
        heart.style.fontSize = 14 + Math.random() * 16 + 'px';
        document.body.appendChild(heart);
        (function (el) { setTimeout(function () { el.remove(); }, 1400); })(heart);
      }
    });
  }

  /* --- hero: little hearts floating up --- */
  var hero = document.querySelector('.hero');
  if (hero && !reduce) {
    var fh = document.createElement('div');
    fh.className = 'ds-float-hearts'; fh.setAttribute('aria-hidden', 'true');
    var hx = [8, 22, 38, 57, 71, 86];
    for (var k = 0; k < hx.length; k++) {
      var hs = document.createElement('span');
      hs.textContent = '♡';
      hs.style.left = hx[k] + '%';
      hs.style.fontSize = (13 + (k % 3) * 5) + 'px';
      hs.style.animationDuration = (11 + k * 2.3) + 's';
      hs.style.animationDelay = (-k * 3.1) + 's';
      fh.appendChild(hs);
    }
    hero.appendChild(fh);
  }

  /* --- candles: spark bursts while the wish button works --- */
  var wishBtn = document.getElementById('wishButton');
  if (wishBtn && !reduce) {
    wishBtn.addEventListener('click', function () {
      document.querySelectorAll('.cake .candle').forEach(function (candle) {
        var r = candle.getBoundingClientRect();
        if (!r.width) return;
        for (var q = 0; q < 5; q++) {
          var spark = document.createElement('span');
          spark.className = 'ds-spark';
          spark.style.left = (r.left + r.width / 2) + 'px';
          spark.style.top = (r.top - 14) + 'px';
          spark.style.position = 'fixed';
          spark.style.setProperty('--sx', (Math.random() * 56 - 28) + 'px');
          spark.style.setProperty('--sy', (-18 - Math.random() * 30) + 'px');
          document.body.appendChild(spark);
          (function (el) { setTimeout(function () { el.remove(); }, 800); })(spark);
        }
      });
    });
  }

  /* --- the love letter: envelope opening + ink reveal --- */
  var letter = document.querySelector('.love-letter');
  if (letter && !reduce) {
    var env = document.createElement('div');
    env.className = 'ds-envelope'; env.setAttribute('aria-hidden', 'true');
    env.innerHTML = '<div class="ds-env-body"></div><div class="ds-env-flap"></div>' +
      '<div class="ds-seal"><span class="ds-seal-half l"></span><span class="ds-seal-half r"></span><span class="ds-heart-mark">♡</span></div>';
    letter.appendChild(env);
    var lines = Array.prototype.slice.call(letter.children).filter(function (el) { return el !== env; });
    lines.forEach(function (el, idx) {
      el.classList.add('ds-ink');
      el.style.setProperty('--rd', (idx * 0.14) + 's');
    });
    var started = false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting || started) return;
        started = true; io.disconnect();
        setTimeout(function () { env.classList.add('break'); }, 500);
        setTimeout(function () {
          env.classList.add('open');
          letter.classList.add('ds-out');
          lines.forEach(function (el) { el.classList.add('ds-ink-in'); });
        }, 1050);
        setTimeout(function () { env.classList.add('gone'); }, 2150);
        setTimeout(function () { env.remove(); letter.classList.add('ds-revealed'); }, 3250);
      });
    }, { threshold: 0.25 });
    io.observe(letter);
  }
})();

