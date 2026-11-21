const paperRoute = id => id === 'sqg' ? '#sqg' : '#paper/' + encodeURIComponent(id);

export function resultsMap(data, esc) {
  const nodes = data.resultsMap.nodes;
  const node = id => {
    const n = nodes.find(n => n.id === id);
    return `<button type="button" class="result-node ${esc(n.outcome)}" data-result="${esc(n.id)}" aria-pressed="false" aria-controls="result-detail"><span class="result-kind">${esc(n.label)}</span><strong>${esc(n.space)}</strong><span>${esc(n.title)}</span></button>`;
  };
  return `<section class="results-atlas" aria-label="Interactive map of research results">
    <div class="atlas-intro"><span class="eyebrow">A LANDSCAPE OF REGULARITY</span><h2>${esc(data.resultsMap.title)}</h2><p>${esc(data.resultsMap.intro)}</p></div>
    <div class="atlas-layout"><div class="atlas-branches">
      <section class="atlas-branch logarithmic"><header><span class="branch-family">2D EULER · VELOCITY</span><h3>The logarithmic frontier</h3><p>H²,α(ℝ²) · a critical norm refined by a logarithmic weight</p></header>
        <div class="threshold-band" aria-label="Strong ill-posedness for 0 less than alpha at most one half; global well-posedness for alpha greater than one half"><span>0 &lt; α ≤ ½<br><b>Strong ill-posedness</b></span><span>α &gt; ½<br><b>Global well-posedness</b></span></div>
        <label class="alpha-label" for="map-alpha">Explore the weight <output id="map-alpha-value">α = 0.50</output></label><input id="map-alpha" type="range" min="5" max="100" step="5" value="50" aria-valuetext="Alpha 0.50" aria-describedby="alpha-context"><p id="alpha-context" class="atlas-caption">Move across α = ½ to compare the two results. α = 0 is outside the refinement shown here.</p>
        <div class="result-pair">${node('log-ill')}${node('log-well')}</div>
        <div class="branch-connection">The positive result is a specialization of</div>${node('generalized')}
      </section>
      <section class="atlas-branch"><header><span class="branch-family">2D EULER · VORTICITY</span><h3>The L¹ endpoint</h3><p>ω ∈ W²,¹(ℝ²) · a different regularity scale</p></header>${node('endpoint-local')}<div class="branch-connection">Add Dini continuity to the initial vorticity</div>${node('endpoint-global')}<p class="atlas-caption">Local existence here does not by itself establish velocity well-posedness in W³,¹.</p></section>
      <section class="atlas-branch sqg-branch"><header><span class="branch-family">INVISCID SQG · TRANSPORTED SCALAR</span><h3>A different equation, a related question</h3><p>How much regularity controls a nonlinear transport equation?</p></header>${node('sqg')}<p class="atlas-caption">A thematic connection to the Euler results; no implication between the theorems is asserted.</p></section>
    </div><aside id="result-detail" class="result-detail" aria-label="Selected result"></aside></div>
  </section>`;
}

export function setupResultsMap(data, esc, safe) {
  const nodes = data.resultsMap.nodes;
  function select(id) {
    const n = nodes.find(n => n.id === id);
    if (!n) return;
    document.querySelectorAll('[data-result]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.result === id)));
    const paper = data.papers.find(p => p.detail === n.paper);
    document.querySelector('#result-detail').innerHTML = `<span class="result-kind ${esc(n.outcome)}">${esc(n.label)}</span><h3>${esc(n.title)}</h3><div class="selected-space">${esc(n.space)}</div><p>${esc(n.statement)}</p><h4>Assumptions & scope</h4><p>${esc(n.assumptions)}</p><h4>Inside the argument</h4><p>${esc(n.mechanism)}</p>${paper ? `<div class="result-source"><span class="eyebrow">THE PAPER</span><p>${esc(paper.title)}</p><p class="entry-meta">${esc(paper.authors)}<br>${esc(paper.status)}</p><a href="${paperRoute(n.paper)}">Explore the paper</a><a href="${paperRoute(n.paper)}/proof">Read proof ideas</a>${safe(paper.url) ? `<a href="${esc(safe(paper.url))}">Read PDF</a>` : ''}${safe(paper.source) ? `<a href="${esc(safe(paper.source))}">Source record</a>` : ''}</div>` : ''}`;
    document.querySelector('#map-selection-status').textContent = n.title;
  }
  const status = document.createElement('p');
  status.id = 'map-selection-status';status.className = 'sr-only';status.setAttribute('role','status');
  document.querySelector('.results-atlas').append(status);
  document.querySelectorAll('[data-result]').forEach(button => button.addEventListener('click', () => {
    select(button.dataset.result);
    if (window.matchMedia('(max-width:1100px)').matches) document.querySelector('#result-detail').scrollIntoView({block:'start',behavior:'instant'});
  }));
  document.querySelector('#map-alpha').addEventListener('input', event => {
    const value = Number(event.target.value) / 100;
    document.querySelector('#map-alpha-value').textContent = 'α = ' + value.toFixed(2);
    event.target.setAttribute('aria-valuetext','Alpha '+value.toFixed(2));
    select(value <= 0.5 ? 'log-ill' : 'log-well');
  });
  select('log-ill');
}
