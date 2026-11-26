// Film metadata is bundled as a regular script so the tour also works offline.
window.renderCoffeeTour = function ({main, lang, el, link, loc, t, pair}) {
function filmTime(seconds) {
  const whole = Math.floor(seconds);
  return Math.floor(whole / 60) + ':' + String(whole % 60).padStart(2, '0');
}

function filmChapterLink(scene) {
  const [locale, page, id = ''] = scene.target.slice(1).split('/');
  const language = locale === 'teacher' ? 'teacher' : lang;
  const labels = {
    home: ['打开课程首页', 'Open the course'],
    drinks: ['查找饮品', 'Find a drink'],
    photos: ['浏览图片', 'View the photos'],
    history: ['阅读历史', 'Explore the history'],
    sources: ['查看资料', 'View sources']
  };
  let label = page === 'day' ? ['打开第 ' + id + ' 天', 'Open day ' + id] : labels[page];
  if (locale === 'teacher') label = ['打开教师版课程', 'Open the teacher lesson'];
  return link(t(label) + ' ↗', loc(page, id, language), 'film-lesson-link');
}


  const scenes = window.COFFEE_FILM_SCENES;
  const heading = el('div','film-heading');
  heading.append(el('p','kicker',t(['咖啡课堂 · 短片','Coffee Atlas · Short film'])),
    pair(['七堂课，从浓缩到冰咖啡','Seven lessons, from espresso to ice'],'h1'));
  main.append(heading);
  if (!Array.isArray(scenes) || !scenes.length) {
    main.append(pair(['请将 ZIP 完整解压，再打开网页观看短片。', 'Extract the whole ZIP and open the page again to watch the film.']));
    return;
  }

  const player = el('video','film-player');
  player.controls = true;
  player.playsInline = true;
  player.preload = 'metadata';
  player.poster = 'tour/poster.jpg';
  const voiceSelect = el('select', 'film-voice');
  for (const [value, label] of [['zh', '普通话'], ['en', 'English']]) {
    const option = el('option', '', label);
    option.value = value;
    voiceSelect.append(option);
  }
  voiceSelect.value = lang === 'zh' ? 'zh' : 'en';
  const voiceLabel = el('label', 'film-voice-label');
  voiceLabel.append(el('span', '', t(['讲解语言', 'Narration'])), voiceSelect);
  let captionURLs = [];
  let captionTracks = [];
  let pendingSeek = null;
  const stopCaptionURLs = () => captionURLs.forEach(url => URL.revokeObjectURL(url));
  const captionsByVoice = window.COFFEE_TOUR_CAPTIONS;
  function setVoice(keepTime) {
    const voice = voiceSelect.value;
    const time = keepTime ? (pendingSeek ?? player.currentTime ?? 0) : 0;
    const resume = keepTime && !player.paused;
    const captionLanguage = captionTracks.find(track => track.track?.mode === 'showing')?.srclang;
    player.onloadedmetadata = null;
    captionTracks.forEach(track => track.remove());
    captionTracks = [];
    stopCaptionURLs();
    captionURLs = [];
    player.src = voice === 'zh' ? 'tour/promo.mp4' : 'tour/promo-en.mp4';
    for (const [language, label] of [['zh', '中文'], ['en', 'English']]) {
      const track = el('track');
      track.kind = language === voice ? 'captions' : 'subtitles';
      track.srclang = language === 'zh' ? 'zh-CN' : 'en';
      track.label = label;
      // A blob URL works when a downloaded course is opened from disk.
      const url = URL.createObjectURL(new Blob([captionsByVoice[voice][language]], {type:'text/vtt'}));
      captionURLs.push(url);
      track.src = url;
      player.append(track);
      captionTracks.push(track);
      if (captionLanguage === track.srclang && track.track) track.track.mode = 'showing';
    }
    if (keepTime) {
      pendingSeek = time;
      player.onloadedmetadata = () => {
        player.onloadedmetadata = null;
        player.currentTime = Math.min(pendingSeek ?? time, player.duration || time);
        pendingSeek = null;
      };
      if (resume) player.play().catch(() => {});
    }
  }
  setVoice(false);
  voiceSelect.addEventListener('change', () => setVoice(true));
  player.setAttribute('aria-label',t(['七日咖啡课宣传片，可切换普通话或英文讲解','Coffee Atlas course film with a choice of Mandarin or English narration']));
  const movie = el('section','film-stage');
  const playerBox = el('div','film-playerbox');
  const actionBar = el('div','film-actions');
  actionBar.append(voiceLabel, el('span', '', filmTime(scenes[scenes.length - 1].end) + '  ·  ' + t(['中英字幕', 'Chinese and English captions'])));
  playerBox.append(player, actionBar);

  const controls = el('aside','film-index');
  const sectionTitle = el('h2','',t(['选择片段','Jump to a chapter']));
  const chapterList = el('ol','film-chapters');
  controls.append(sectionTitle,chapterList);
  const chapterButtons = [];
  let selected = -1;
  function selectChapter(index) {
    if (selected === index) return;
    if (chapterButtons[selected]) chapterButtons[selected].removeAttribute('aria-current');
    if (chapterButtons[index]) chapterButtons[index].setAttribute('aria-current','true');
    selected = index;
  }
  function syncChapter() {
    const seconds = player.currentTime;
    let i = scenes.findIndex(scene => seconds >= scene.start && seconds < scene.end);
    if (i < 0 && seconds >= scenes[scenes.length - 1].end) i = scenes.length - 1;
    selectChapter(i);
  }
  function playFrom(index) {
    const start = scenes[index].start;
    pendingSeek = start;
    const seek = () => { player.currentTime = start; pendingSeek = null; selectChapter(index); };
    if (player.readyState > 0) seek();
    else player.addEventListener('loadedmetadata',seek,{once:true});
    // A chapter click is an explicit play request, as with the native play button.
    const playback = player.play();
    if (playback && playback.catch) playback.catch(() => {});
  }
  scenes.forEach((scene,i) => {
    const row = el('li');
    const button = el('button','film-chapter');
    button.type = 'button';
    button.setAttribute('aria-label',t(['从此播放','Play from']) + ' ' + filmTime(scene.start) + ' · ' + t([scene.titleZh,scene.titleEn]));
    button.append(el('span','film-time',filmTime(scene.start)),el('span','',t([scene.titleZh,scene.titleEn])));
    button.addEventListener('click',() => playFrom(i));
    chapterButtons.push(button);
    row.append(button);
    chapterList.append(row);
  });
  player.addEventListener('timeupdate', syncChapter);
  player.addEventListener('seeked', syncChapter);
  selectChapter(0);

  movie.append(playerBox,controls);
  main.append(movie);

  const transcript = el('section','film-script');
  const scriptHeading = el('div','film-script-heading');
  scriptHeading.append(pair(['分镜文字与课程入口','Scene guide and course links'],'h2'));
  const languageSelect = el('select');
  const label = el('label','film-language');
  label.append(el('span','',t(['分镜语言','Scene guide language'])));
  for (const [value,name] of [['zh','中文'],['en','English'],['both','English + 中文']]) {
    const opt = el('option','',name); opt.value=value; languageSelect.append(opt);
  }
  languageSelect.value = lang === 'teacher' ? 'both' : lang;
  label.append(languageSelect);
  scriptHeading.append(label);
  const guide = el('ol','film-guide');
  function buildGuide() {
    guide.replaceChildren();
    scenes.forEach(scene => {
      const row = el('li','film-guide-row');
      const time = el('span','film-range',filmTime(scene.start)+'–'+filmTime(scene.end));
      const textBox = el('div','film-guide-copy');
      const textLang = languageSelect.value;
      const heading = el('h3','',textLang==='zh'?scene.titleZh:scene.titleEn);
      heading.lang = textLang==='zh'?'zh-CN':'en';
      textBox.append(heading);
      const addLine = (str,locale) => {
        const para=el('p','',str);
        para.lang=locale;
        textBox.append(para);
      };
      if (textLang!=='zh') addLine(scene.en + ' ' + scene.visualEn,'en');
      if (textLang!=='en') addLine(scene.zh + scene.visualZh,'zh-CN');
      textBox.append(filmChapterLink(scene));
      const companionDay = {'#zh/day/1':2, '#zh/day/3':4}[scene.target];
      if (companionDay) {
        textBox.append(link(t(['打开第 ' + companionDay + ' 天','Open day ' + companionDay]) + ' ↗',
          loc('day',companionDay),'film-lesson-link'));
      }
      if (scene.target.endsWith('/history')) {
        textBox.append(link(t(['查阅出处 ↗','Browse sources ↗']),loc('sources'),'film-lesson-link'),
          link(t(['从第一天开始 ↗','Start day one ↗']),loc('day',1),'film-lesson-link'));
      }
      row.append(time,textBox);
      guide.append(row);
    });
  }
  languageSelect.addEventListener('change',buildGuide);
  buildGuide();
  transcript.append(scriptHeading,guide);
  main.append(transcript);
  const credit = el('p','film-credit');
  credit.append(document.createTextNode(t([
    '影片摄影来自学员授权的咖啡作品照，另配课程界面与原创图形。',
    'The film pairs student photographs used with permission with course screens and original graphics.'
  ]) + ' '),link(t(['查看图源与资料','View image credits and sources']),loc('sources')));
  main.append(credit);
  return () => {
    player.pause();
    player.onloadedmetadata = null;
    stopCaptionURLs();
  };
};
function filmView() {
  cleanup = window.renderCoffeeTour({main, lang, el, link, loc, t, pair}) || (() => {});
}
