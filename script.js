const $=s=>document.querySelector(s),audio=$('#music');
const captions=['a little sparkle','my favourite view','those beautiful eyes','your silly little faces','soft little moments','a daydream in white','a pocketful of light','you, in full bloom','a quiet kind of lovely','always, just you','a smile to keep','flowers & you','my butterfly girl','a little bit of magic','a memory to hold','pretty in every chapter','a rose for my rose','a moment in white','your sweetest smile','where the story began','sunshine in a photograph','a whole little world','a little sparkle, again','grace in every step','a beautiful adventure','under a thousand lights','the softest kind of happy','a little everyday magic','my favourite notification','one more reason to smile'];
let photoIndex=0,isPlaying=false,targetVolume=.17,unlocked=false,scrollQueued=false,fadeTimer,candlesBusy=false;
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function setSoundState(playing){isPlaying=playing;document.body.classList.toggle('paused',!playing);$('#soundText').textContent=playing?'sound on':'sound off';$('#soundToggle').setAttribute('aria-label',playing?'Pause music':'Play music');$('#trackPlay').textContent=playing?'Ⅱ':'▷';$('#trackPlay').setAttribute('aria-label',playing?'Pause Alfaaz':'Play Alfaaz');}
function playMusic(){audio.volume=.1;const attempt=audio.play();if(attempt)attempt.then(()=>{setSoundState(true);$('#audioStatus').textContent='';clearInterval(fadeTimer);fadeTimer=setInterval(()=>{if(!isPlaying)return;const d=targetVolume-audio.volume;if(Math.abs(d)>.003)audio.volume=Math.max(0,Math.min(.5,audio.volume+d*.07));},65);}).catch(()=>{setSoundState(false);$('#audioStatus').textContent='Tap play to start our song.';});}
function toggleMusic(){if(isPlaying){audio.pause();setSoundState(false);}else playMusic();}
audio.addEventListener('error',()=>{$('#audioStatus').textContent='The song could not load. Please check your connection.';setSoundState(false);});audio.addEventListener('pause',()=>setSoundState(false));audio.addEventListener('play',()=>setSoundState(true));
$('#soundToggle').addEventListener('click',toggleMusic);$('#trackPlay').addEventListener('click',toggleMusic);
$('#personalLine').textContent="Love isn't only in the big words. It's in checking whether you've eaten, reminding you to rest, a little teasing, and wanting to hear about your day. Those tiny things with you mean everything to me.";
function openWorld(){if(unlocked)return;unlocked=true;$('#world').hidden=false;$('#gate').hidden=true;document.body.classList.remove('locked');document.querySelectorAll('[data-photo]').forEach(img=>img.src=window.MEMORIES[Number(img.dataset.photo)-1].src);buildGallery();const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));createPetals();window.addEventListener('scroll',onScroll,{passive:true});onScroll();}
$('#previewNotice').hidden=!!window.DECEMBER_SECURE;
$('#unlockForm').addEventListener('submit',async e=>{e.preventDefault();const input=$('#password'),button=e.currentTarget.querySelector('button');button.disabled=true;let valid=false;try{if(window.DECEMBER_SECURE){const r=await fetch('./api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:input.value})});valid=r.ok;if(r.status===429)throw Error('A few too many tries. Please wait a minute.');}else valid=input.value==='0906';if(!valid){$('#gateError').textContent='Not quite, my love. Try our little secret again.';input.value='';input.focus();return;}openWorld();playMusic();}catch(err){$('#gateError').textContent=err.message||'Could not open your surprise. Try again.';}finally{button.disabled=false;}});
if(window.DECEMBER_SECURE)fetch('./api/session').then(r=>{if(r.ok){openWorld();setSoundState(false);$('#audioStatus').textContent='Tap play to start our song.';}}).catch(()=>{});
function buildGallery(){
 const chapters=[
  {after:'.ribbon',style:'clothesline',kicker:'LITTLE MOMENTS / 01',title:'A few reasons I <em>adore you.</em>',note:'Like love notes, hanging in a little December breeze.',start:0},
  {after:'#letter',style:'scrapbook',kicker:'PRESSED BETWEEN THE PAGES / 02',title:'If love were a <em>scrapbook.</em>',note:'A ribbon, a flower, a photograph. And you, in every little detail.',start:5},
  {existing:true,style:'editorial',start:10},
  {after:'#musicMoment',style:'rose-garden',kicker:'A ROSE FOR MY ROSE / 04',title:'Some flowers look <em>like you.</em>',note:'Soft, a little magical, and impossible not to love.',start:15},
  {after:'#wish',style:'wish-ribbon',kicker:'TIED WITH ALL MY LOVE / 05',title:'Five little keepsakes.<br>A thousand <em>birthday wishes.</em>',note:'Little pieces of you, tied together with a pink ribbon.',start:20},
  ];
  chapters.forEach(chapter=>{
  let grid;
  if(chapter.existing){grid=$('#memoryGrid');$('#memories').classList.add('photo-chapter','editorial');}
  else{const section=document.createElement('section');section.className=`photo-chapter ${chapter.style}`;section.innerHTML=`<div class="chapter-heading reveal"><span class="chapter-flourish" aria-hidden="true">✧</span><p class="eyebrow">${chapter.kicker}</p><h2>${chapter.title}</h2><p>${chapter.note}</p></div><div class="chapter-photos" aria-label="Five decorated photo memories"></div><span class="chapter-love" aria-hidden="true">made of you & little things ♡</span>`;$(chapter.after).after(section);grid=section.querySelector('.chapter-photos');}
  for(let i=chapter.start;i<Math.min(chapter.start+5,window.MEMORIES.length);i++){
   const photo=window.MEMORIES[i],button=document.createElement('button');button.className='memory-button btn reveal';button.style.setProperty('--tilt',`${[-5,4,-3,5,-4][i%5]}deg`);button.style.setProperty('--duration',`${7+i%4}s`);button.style.setProperty('--delay',`${-(i%6)}s`);button.setAttribute('aria-label',`Open memory ${i+1}: ${captions[i]}`);button.dataset.wide=String([0,2,3,6,8,14].includes(i));
   const frame=document.createElement('figure');frame.className='polaroid';const img=document.createElement('img');img.src=photo.src;img.alt=`Memory ${i+1} — ${captions[i]}`;img.loading='lazy';img.decoding='async';const caption=document.createElement('figcaption');caption.textContent=captions[i];const number=document.createElement('span');number.className='memory-number';number.textContent=`${String(i+1).padStart(2,'0')} / 30`;frame.append(img,caption,number);button.append(frame);button.addEventListener('click',()=>showPhoto(i));grid.append(button);
  }
 });
 document.querySelectorAll('.hero-photo').forEach(frame=>{frame.tabIndex=0;frame.setAttribute('role','button');const open=()=>showPhoto(Number(frame.querySelector('img').dataset.photo)-1);frame.addEventListener('click',open);frame.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});});
}
function showPhoto(i){photoIndex=(i+window.MEMORIES.length)%window.MEMORIES.length;$('#fullPhoto').src=window.MEMORIES[photoIndex].src;$('#fullPhoto').alt=`Memory ${photoIndex+1} — ${captions[photoIndex]}`;$('#fullCaption').textContent=`${captions[photoIndex]} · ${photoIndex+1} / 30`;if(!$('#lightbox').open)$('#lightbox').showModal();}
$('#closeLightbox').addEventListener('click',()=>$('#lightbox').close());$('#prevPhoto').addEventListener('click',()=>showPhoto(photoIndex-1));$('#nextPhoto').addEventListener('click',()=>showPhoto(photoIndex+1));$('#lightbox').addEventListener('click',e=>{if(e.target===$('#lightbox'))$('#lightbox').close();});document.addEventListener('keydown',e=>{if(!$('#lightbox').open)return;if(e.key==='ArrowLeft')showPhoto(photoIndex-1);if(e.key==='ArrowRight')showPhoto(photoIndex+1);});
function onScroll(){if(scrollQueued)return;scrollQueued=true;requestAnimationFrame(()=>{const rect=$('#musicMoment').getBoundingClientRect(),center=rect.top+rect.height/2,proximity=Math.max(0,1-Math.abs(center-innerHeight/2)/(innerHeight/2+rect.height/2));targetVolume=.17+proximity*proximity*.28;$('#glassPoem').style.setProperty('--glass-tilt',`${reduceMotion?0:Math.max(-4,Math.min(4,(center-innerHeight/2)/100))}deg`);scrollQueued=false;});}
function createPetals(){if(reduceMotion)return;for(let i=0;i<10;i++){const petal=document.createElement('i');petal.className='petal';petal.style.left=`${i*11}%`;petal.style.setProperty('--fall',`${18+i%5*3}s`);petal.style.setProperty('--start',`${-i*4}s`);$('#petals').append(petal);}}
$('#wishButton').addEventListener('click',async()=>{
 if(candlesBusy)return;
 const button=$('#wishButton'),result=$('#wishResult');
 const candles=[...document.querySelectorAll('.cake .candle')];
 if(!candles.length)return;
 candlesBusy=true;button.disabled=true;
 const alreadyBlown=candles.every(candle=>candle.classList.contains('out'));
 const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
 if(alreadyBlown){
  result.textContent='Lighting your little birthday candles again ♡';
  for(const candle of [...candles].reverse()){
   candle.classList.remove('out');
   await pause(500);
  }
  button.textContent='Make a wish & blow the candles ✧';
  result.textContent='A little birthday magic is waiting.';
 }else{
  result.textContent='Close your eyes and make a wish... ♡';
  for(let i=0;i<candles.length;i++){
   candles[i].classList.add('out');
   result.textContent=`Candle ${i+1} of ${candles.length} is out. ♡`;
   await pause(700);
  }
  button.textContent='Relight the candles ♡';
  result.textContent='May every beautiful thing you wished for find its way to you. ♡';
  if(!reduceMotion)for(let i=0;i<45;i++){
   const piece=document.createElement('span');piece.className='confetti';
   piece.textContent=['♡','✧','✿'][i%3];piece.style.left=`${Math.random()*100}%`;
   piece.style.animationDelay=`${Math.random()*.6}s`;
   piece.style.setProperty('--drift',`${(Math.random()-.5)*240}px`);
   $('#celebration').append(piece);setTimeout(()=>piece.remove(),4500);
  }
 }
 candlesBusy=false;button.disabled=false;
});
$('#openNote').addEventListener('click',()=>{const note=$('#secretNote');note.hidden=!note.hidden;$('#openNote').setAttribute('aria-expanded',String(!note.hidden));$('#openNote').innerHTML=note.hidden?'A tiny note for you <span>♡</span>':'Keep this close to your heart <span>♡</span>';});
// The song clock, never scroll position, chooses the single visible lyric.
const poem=$('#glassPoem');
poem.innerHTML='<span class="glass-shine"></span><div class="lyric-stage" aria-live="polite" aria-atomic="true"><p class="lyric-line" id="currentLyric"></p></div><span class="original-label">ALFAAZ · ONE LINE, ONE FEELING AT A TIME</span><span class="lyric-clock" id="lyricClock">0:00 / 3:05</span>';
let lyrics=[],activeLyric=-2,lyricChange=0,lyricFrame;
fetch('./lyrics.json').then(r=>{if(!r.ok)throw Error('Lyrics unavailable');return r.json();}).then(data=>{lyrics=data;syncLyrics();}).catch(()=>{$('#audioStatus').textContent='Lyrics could not load. The song can still play.';});
function syncLyrics(){
 const time=audio.currentTime||0;
 const total=Number.isFinite(audio.duration)?audio.duration:185.13;
 $('#lyricClock').textContent=`${Math.floor(time/60)}:${String(Math.floor(time%60)).padStart(2,'0')} / ${Math.floor(total/60)}:${String(Math.floor(total%60)).padStart(2,'0')}`;
 const next=lyrics.findIndex(line=>time>=line.start&&time<line.end);
 if(next===activeLyric)return;
 activeLyric=next;
 const change=++lyricChange,line=$('#currentLyric');
 line.classList.remove('arrived');
 const update=()=>{if(change!==lyricChange)return;line.textContent=next>=0?lyrics[next].text:'';requestAnimationFrame(()=>{if(change===lyricChange)line.classList.add('arrived');});};
 if(reduceMotion)update();else setTimeout(update,160);
}
function lyricTick(){syncLyrics();if(!audio.paused&&!audio.ended)lyricFrame=requestAnimationFrame(lyricTick);}
audio.addEventListener('play',()=>{cancelAnimationFrame(lyricFrame);lyricTick();});
audio.addEventListener('pause',()=>{cancelAnimationFrame(lyricFrame);syncLyrics();});
['timeupdate','seeked','loadedmetadata','ended'].forEach(name=>audio.addEventListener(name,syncLyrics));
setSoundState(false);
