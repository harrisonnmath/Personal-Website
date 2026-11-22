const imageSource = value => /^(assets\/|https?:\/\/|data:image\/(?:png|jpeg|webp);base64,)/i.test(String(value || '')) ? value : '';

export function notebookMarkup() {
  return `<section class="photo-notebook" aria-label="Off the clock photo notebook"><div class="notebook-heading"><span class="eyebrow">A PERSONAL FIELD NOTEBOOK</span><p>Photographs, places, and little things worth keeping.</p></div><div class="notebook-book" tabindex="0" aria-label="Photo notebook. Use left and right arrow keys to turn pages."><div class="notebook-spread" id="notebook-spread"></div><span class="notebook-binding" aria-hidden="true"></span></div><div class="notebook-controls"><button type="button" id="notebook-prev" class="notebook-button">Previous page</button><span id="notebook-count" role="status" aria-live="polite"></span><button type="button" id="notebook-next" class="notebook-button">Turn the page</button></div></section>`;
}

export function setupNotebook(data, esc, art) {
  const book = data.notebook || {title:'Off the clock',subtitle:'Notes from beyond the blackboard',pages:[]};
  const pages = book.pages || [];
  const total = pages.length + 1 || 1;
  const spread = document.querySelector('#notebook-spread');
  const frame = spread.closest('.notebook-book');
  let page = 0, busy = false;
  const count = pages.length ? total : 2;
  function render() {
    if (page === 0) {
      spread.innerHTML = `<div class="notebook-leaf notebook-cover"><span class="cover-label">FIELD NOTES</span><h2>${esc(book.title)}</h2><div class="cover-botanical">${art('nature')}</div><p>${esc(book.subtitle)}</p><span class="cover-owner">${esc(data.name)}</span></div><div class="notebook-leaf notebook-lined notebook-opening"><span class="notebook-date">OUTSIDE THE OFFICE</span><h3>A few pages from life</h3><p>${esc(book.subtitle)}</p><div class="notebook-sketch">${art('nature')}</div><p class="notebook-hand">Keep the small moments.</p><span class="leaf-number">Opening notes</span></div>`;
    } else {
      const entry = pages[page-1] || {title:'The next page is still unwritten.',caption:'A collection in the making.'};
      const src = imageSource(entry.photo);
      spread.innerHTML = `<div class="notebook-leaf notebook-photo-page"><figure class="notebook-print">${src ? `<img src="${esc(src)}" alt="${esc(entry.alt || entry.title || 'Photograph from my notebook')}" decoding="async">` : `<div class="notebook-empty">${art('nature')}<span>A moment to keep</span></div>`}<figcaption>${esc(entry.title || '')}</figcaption></figure><span class="leaf-number">${page * 2 - 1}</span></div><div class="notebook-leaf notebook-lined notebook-caption-page"><span class="notebook-date">${esc(entry.date || 'OFF THE CLOCK')}</span><h3>${esc(entry.title || 'A note from the trail')}</h3><p class="notebook-caption">${esc(entry.caption || '')}</p><span class="leaf-number">${page * 2}</span></div>`;
      spread.querySelector('img')?.addEventListener('error', event => {const note=document.createElement('p');note.className='notebook-empty';note.textContent='This photograph is unavailable.';event.target.replaceWith(note);});
    }
    document.querySelector('#notebook-count').textContent = page === 0 ? 'Opening spread' : `Entry ${page} of ${pages.length || 1}`;
    document.querySelector('#notebook-prev').disabled = page === 0;
    document.querySelector('#notebook-next').disabled = page === count - 1;
  }
  function turn(direction) {
    if (busy || page + direction < 0 || page + direction >= count) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {page+=direction;render();return;}
    busy=true;
    frame.classList.add(direction>0?'turn-forward':'turn-back');
    setTimeout(()=>{if(!spread.isConnected)return;page+=direction;render();frame.classList.remove('turn-forward','turn-back');busy=false;},220);
  }
  document.querySelector('#notebook-prev').onclick=()=>turn(-1);
  document.querySelector('#notebook-next').onclick=()=>turn(1);
  frame.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();turn(event.key==='ArrowRight'?1:-1);}});
  let startX;
  frame.addEventListener('touchstart',event=>{startX=event.touches[0].clientX;},{passive:true});
  frame.addEventListener('touchend',event=>{const distance=event.changedTouches[0].clientX-startX;if(Math.abs(distance)>65)turn(distance<0?1:-1);startX=undefined;},{passive:true});
  render();
}
