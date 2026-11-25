/* Static, browser-local interactions. No data collection or third-party scripts. */
(() => {
  'use strict';
  const data = window.DFAT_DATA;
  const config = window.DFAT_CONFIG || {};
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const imagePath = image => `./assets/images/${typeof image === 'number' ? `reference-image${image}.jpg` : image}`;

  function safeUrl(value) {
    try { const parsed = new URL(value); return ['https:', 'http:'].includes(parsed.protocol) ? parsed.href : ''; }
    catch { return ''; }
  }

  $$('.authors [data-author]').forEach(node => {
    const url = safeUrl((config.authorUrls || {})[node.dataset.author]);
    if (!url) return;
    const a = document.createElement('a');
    a.href = url; a.textContent = node.textContent; a.target = '_blank'; a.rel = 'noopener';
    node.replaceChildren(a);
  });
  const repo = safeUrl(config.repositoryUrl);
  if (repo) $$('[data-repository-link]').forEach(a => { a.href = repo; a.hidden = false; });
  const artifact = safeUrl(config.artifactUrl);
  $$('[data-artifact-link]').forEach(a => { if (artifact) a.href = artifact; else a.hidden = true; });
  const projectUrl = safeUrl(config.projectUrl);
  if (projectUrl) {
    const base = projectUrl.endsWith('/') ? projectUrl : projectUrl + '/';
    const canonical = document.createElement('link'); canonical.rel = 'canonical'; canonical.href = base; document.head.append(canonical);
    const og = document.createElement('meta'); og.setAttribute('property','og:url'); og.content = base; document.head.append(og);
  }

  const menu = $('.menu-toggle');
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open)); $('#main-nav').classList.toggle('is-open', open);
  });
  $$('#main-nav a').forEach(a => a.addEventListener('click', () => { menu.setAttribute('aria-expanded', 'false'); $('#main-nav').classList.remove('is-open'); }));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') { menu.setAttribute('aria-expanded','false'); $('#main-nav').classList.remove('is-open'); } });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) $$('#main-nav a').forEach(a => {
          const current = a.getAttribute('href') === '#' + entry.target.id;
          a.classList.toggle('is-current', current);
          if (current) a.setAttribute('aria-current','location'); else a.removeAttribute('aria-current');
        });
      }
    }, {rootMargin:'-15% 0px -65% 0px',threshold:0});
    $$('#home, #overview, #taxonomy, #findings, #training, #paper').forEach(section => observer.observe(section));
  }

  // Standard tablist keyboard behavior, shared by both sets of tabs.
  function bindTabKeyboard(list) {
    list.addEventListener('keydown', event => {
      const tabs = [...list.querySelectorAll('[role="tab"]')];
      const index = tabs.indexOf(event.target);
      if (index < 0) return;
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault(); tabs[next].focus(); tabs[next].click();
    });
  }

  const domainNames = {face:'FACE-RELATED ARTIFACTS',style:'STYLE-RELATED ARTIFACTS',background:'BACKGROUND-RELATED ARTIFACTS',accessories:'ACCESSORY-RELATED ARTIFACTS'};
  function showCue(cue, selectedIndex) {
    $$('#cue-buttons button').forEach((button,index) => button.setAttribute('aria-pressed',String(index === selectedIndex)));
    $('#cue-name').textContent = cue.name;
    $('#cue-explanation').textContent = cue.text;
    const source = cue.source || `DFAT visual reference, p. ${cue.sourcePage}`;
    const holder = $('#example-images');
    holder.className = 'example-images' + (cue.images.length === 1 ? ' single' : cue.images.length === 3 ? ' three' : '');
    holder.replaceChildren();
    cue.images.forEach((number,index) => {
      const figure = document.createElement('figure');
      const button = document.createElement('button'); button.type = 'button'; button.className = 'example-image-button'; button.setAttribute('aria-label',`Enlarge ${cue.name}: ${cue.captions[index]}`);
      const img = document.createElement('img'); img.src = imagePath(number); img.alt = `${cue.name}: ${cue.captions[index]}. Source: ${source}`; img.width = 460; img.height = 460; img.loading = 'lazy';
      const zoom = document.createElement('span'); zoom.className = 'zoom-icon'; zoom.textContent = '⤢'; zoom.setAttribute('aria-hidden','true');
      button.append(img,zoom);
      button.addEventListener('click', () => {
        $('#enlarged-image').src = img.src; $('#enlarged-image').alt = img.alt;
        $('#image-dialog-caption').textContent = `${cue.name} · ${cue.captions[index]}`;
        $('#image-dialog').showModal();
      });
      const caption = document.createElement('figcaption'); caption.textContent = cue.captions[index];
      figure.append(button,caption); holder.append(figure);
    });
  }
  function showDomain(index) {
    const domain = data.taxonomy[index];
    $$('#domain-tabs button').forEach((button,i) => { button.setAttribute('aria-selected',String(i === index)); button.tabIndex = i === index ? 0 : -1; });
    $('#taxonomy-panel').setAttribute('aria-labelledby',`domain-${domain.id}`);
    $('#domain-label').textContent = domainNames[domain.id]; $('#domain-heading').textContent = {face:'Face-related Artifacts',style:'Style-related Artifacts',background:'Background-related Artifacts',accessories:'Accessory-related Artifacts'}[domain.id]; $('#domain-description').textContent = domain.description;
    $('#cue-buttons').replaceChildren();
    domain.cues.forEach((cue,i) => {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'cue-button'; button.textContent = cue.name;
      button.addEventListener('click', () => showCue(cue,i)); $('#cue-buttons').append(button);
    });
    showCue(domain.cues[0],0);
  }
  data.taxonomy.forEach((domain,index) => {
    const button = document.createElement('button'); button.type = 'button'; button.id = `domain-${domain.id}`; button.className = 'domain-tab';
    button.setAttribute('role','tab'); button.setAttribute('aria-controls','taxonomy-panel');
    button.innerHTML = `<span class="domain-title">${domain.name}</span><span class="cue-count">${domain.count} cue${domain.count === 1 ? '' : 's'}</span>`;
    button.addEventListener('click', () => showDomain(index)); $('#domain-tabs').append(button);
  });
  bindTabKeyboard($('#domain-tabs')); showDomain(0);
  $('#close-image').addEventListener('click', () => $('#image-dialog').close());
  $('#image-dialog').addEventListener('click', event => { if (event.target === $('#image-dialog')) { const rect = $('#image-dialog').getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) $('#image-dialog').close(); } });

  let training = 'specific', format = 'single';
  function renderResults() {
    const values = data.accuracy[training][format];
    const trainingName = training === 'specific' ? 'Model-specific' : 'General-purpose';
    const formatName = format === 'single' ? 'Single image' : 'Side by side';
    const chart = $('#accuracy-chart'); chart.replaceChildren();
    $('#results-table').replaceChildren();
    $('#results-caption').textContent = `${trainingName} training · ${formatName} · Table 3`;
    chart.setAttribute('aria-label',`${trainingName} training, ${formatName}. Mean accuracy before and after training.`);
    values.forEach(([pre,post,n],index) => {
      const model = data.models[index];
      const row = document.createElement('div'); row.className = 'chart-row';
      row.innerHTML = `<div class="chart-row-label"><span>${model}</span><span class="chart-values">${pre.toFixed(1)}% <span aria-hidden="true">→</span> <strong>${post.toFixed(1)}%</strong></span></div><div class="chart-track" aria-hidden="true"><span class="chart-connector" style="left:${Math.min(pre,post)}%;width:${Math.abs(post-pre)}%"></span><span class="chart-dot before" style="left:${pre}%"></span><span class="chart-dot after" style="left:${post}%"></span></div>`;
      chart.append(row);
      const tr = document.createElement('tr'); tr.innerHTML = `<th scope="row">${model}</th><td>${pre.toFixed(1)}%</td><td>${post.toFixed(1)}%</td><td>${n}</td>`; $('#results-table').append(tr);
    });
    const axes = document.createElement('div'); axes.className = 'chart-axes'; axes.setAttribute('aria-hidden','true'); axes.innerHTML = '<span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>'; chart.append(axes);
  }
  $$('[data-training]').forEach(button => button.addEventListener('click', () => { training = button.dataset.training; $$('[data-training]').forEach(b => b.setAttribute('aria-pressed',String(b === button))); renderResults(); }));
  $$('[data-format]').forEach(button => button.addEventListener('click', () => { format = button.dataset.format; $$('[data-format]').forEach(b => b.setAttribute('aria-pressed',String(b === button))); renderResults(); }));
  renderResults();

  function showLesson(index, changeVideo = true) {
    const lesson = data.training[index];
    $$('#training-tabs button').forEach((button,i) => { button.setAttribute('aria-selected',String(i === index)); button.tabIndex = i === index ? 0 : -1; });
    $('#training-panel').setAttribute('aria-labelledby',`lesson-${lesson.id}`);
    $('#lesson-title').textContent = lesson.name; $('#lesson-description').textContent = lesson.description;
    $('#video-download').href = `./assets/videos/${lesson.id}.mp4`;
    const video = $('#training-video'); video.setAttribute('aria-label',`${lesson.name} DFAT training video`);
    if (changeVideo) { video.pause(); video.querySelector('source').src = `./assets/videos/${lesson.id}.mp4`; video.load(); }
  }
  data.training.forEach((lesson,index) => {
    const button = document.createElement('button'); button.type = 'button'; button.id = `lesson-${lesson.id}`; button.className = 'lesson-tab'; button.textContent = lesson.name;
    button.setAttribute('role','tab'); button.setAttribute('aria-controls','training-panel'); button.addEventListener('click', () => showLesson(index)); $('#training-tabs').append(button);
  });
  bindTabKeyboard($('#training-tabs')); showLesson(0,false);

  $('#copy-citation').addEventListener('click', async () => {
    const citation = $('#bibtex').textContent;
    try {
      await navigator.clipboard.writeText(citation);
      $('#copy-status').textContent = 'BibTeX copied to clipboard.';
      $('#copy-citation').textContent = 'Copied ✓';
      setTimeout(() => { $('#copy-citation').innerHTML = 'Copy BibTeX <span aria-hidden="true">⧉</span>'; },2500);
    } catch {
      const range = document.createRange(); range.selectNodeContents($('#bibtex'));
      const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
      $('#copy-status').textContent = 'Citation selected. Press Ctrl+C / ⌘C to copy, or download the .bib file.';
    }
  });
})();
