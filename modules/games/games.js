/* PlayPal - Games module (Tic-Tac-Toe, Memory Match, Word Scramble).
   Self-contained: only touches elements inside #games-root. */
(function(){
  "use strict";
  const root = document.getElementById('games-root');
  if(!root) return;            // not on the games page: do nothing
  const $ = s => root.querySelector(s);

  /* ---------- Menu (tabs) ---------- */
  const tabs = [...root.querySelectorAll('[role="tab"]')];
  function showTab(t){
    tabs.forEach(b=>{
      const on = b===t;
      b.setAttribute('aria-selected', on);
      $('#'+b.getAttribute('aria-controls')).hidden = !on;
    });
  }
  tabs.forEach((t,i)=>{
    t.addEventListener('click',()=>showTab(t));
    t.addEventListener('keydown',e=>{
      if(e.key==='ArrowRight'||e.key==='ArrowLeft'){
        const n = tabs[(i+(e.key==='ArrowRight'?1:tabs.length-1))%tabs.length];
        n.focus(); showTab(n);
      }
    });
  });

  /* ---------- Tic-Tac-Toe ---------- */
  const LINES=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  const tBoard=$('#ttt-board'), tStatus=$('#ttt-status');
  let board, turn, over, history, busy=false, cpuTimer=null;
  const cells=[];
  for(let i=0;i<9;i++){
    const b=document.createElement('button');
    b.className='gm-cell'; b.addEventListener('click',()=>play(i));
    tBoard.appendChild(b); cells.push(b);
  }
  function winnerOf(b){
    for(const l of LINES){ if(b[l[0]]&&b[l[0]]===b[l[1]]&&b[l[0]]===b[l[2]]) return {w:b[l[0]],line:l}; }
    return b.every(Boolean)?{w:'draw'}:null;
  }
  function cellLabel(i){
    const r=Math.floor(i/3)+1,c=i%3+1;
    return `Row ${r}, column ${c}, ${board[i]?board[i]:'empty'}`;
  }
  function render(){
    const res=winnerOf(board);
    cells.forEach((b,i)=>{
      b.textContent=board[i]||'';
      b.className='gm-cell'+(board[i]?' gm-'+board[i].toLowerCase():'');
      b.disabled=over||!!board[i]||busy;
      b.setAttribute('aria-label',cellLabel(i));
      if(res&&res.line&&res.line.includes(i)) b.classList.add('gm-win');
    });
    $('#ttt-undo').disabled=history.length===0||busy;
  }
  function setStatus(msg,cls){ tStatus.textContent=msg; tStatus.className='gm-status '+(cls?'gm-'+cls:''); }
  function tReset(){
    clearTimeout(cpuTimer); busy=false;
    board=Array(9).fill(null); turn='X'; over=false; history=[];
    const cpu=$('#ttt-mode').value==='cpu';
    $('#ttt-level').disabled=!cpu;
    setStatus(cpu?'Your turn! You are X.':"X goes first.");
    render();
  }
  function finish(){
    const res=winnerOf(board); if(!res) return false;
    over=true;
    const cpu=$('#ttt-mode').value==='cpu';
    if(res.w==='draw') setStatus("It's a draw! 🤝",'');
    else if(cpu) setStatus(res.w==='X'?'You win! 🎉':'The computer wins. Try again!',res.w==='X'?'good':'bad');
    else setStatus(`${res.w} wins! 🎉`,'good');
    render(); return true;
  }
  function play(i){
    if(over||board[i]||busy) return;
    board[i]=turn; history.push(i);
    if(finish()) return;
    turn = turn==='X'?'O':'X';
    const cpu=$('#ttt-mode').value==='cpu';
    if(cpu&&turn==='O'){
      busy=true; setStatus('Computer is thinking…'); render();
      cpuTimer=setTimeout(()=>{
        busy=false;
        const m=cpuPick(); board[m]='O'; history.push(m);
        if(finish()) return;
        turn='X'; setStatus('Your turn!'); render();
      },450);
    } else { setStatus(cpu?'Your turn!':`${turn}'s turn.`); render(); }
  }
  function minimax(b,isO){
    const r=winnerOf(b);
    if(r){ return r.w==='O'?1:r.w==='X'?-1:0; }
    let best=isO?-2:2;
    for(let i=0;i<9;i++) if(!b[i]){
      b[i]=isO?'O':'X'; const s=minimax(b,!isO); b[i]=null;
      best=isO?Math.max(best,s):Math.min(best,s);
    }
    return best;
  }
  function cpuPick(){
    const empty=board.map((v,i)=>v?null:i).filter(v=>v!==null);
    if($('#ttt-level').value==='easy'){
      // easy: win or block sometimes, otherwise random
      if(Math.random()<.35){
        for(const p of ['O','X']) for(const i of empty){
          board[i]=p; const r=winnerOf(board); board[i]=null;
          if(r&&r.w===p) return i;
        }
      }
      return empty[Math.floor(Math.random()*empty.length)];
    }
    let bestScore=-2,moves=[];
    for(const i of empty){
      board[i]='O'; const s=minimax(board,false); board[i]=null;
      if(s>bestScore){bestScore=s;moves=[i];} else if(s===bestScore) moves.push(i);
    }
    return moves[Math.floor(Math.random()*moves.length)];
  }
  $('#ttt-undo').addEventListener('click',()=>{
    if(busy||!history.length) return;
    const cpu=$('#ttt-mode').value==='cpu';
    const n = cpu ? (history.length%2===0?2:1) : 1;
    for(let k=0;k<n&&history.length;k++) board[history.pop()]=null;
    over=false; turn = history.length%2===0?'X':'O';
    setStatus('Move taken back. '+(cpu?'Your turn!':`${turn}'s turn.`)); render();
  });
  $('#ttt-reset').addEventListener('click',tReset);
  $('#ttt-mode').addEventListener('change',tReset);
  $('#ttt-level').addEventListener('change',tReset);
  tReset();

  /* ---------- Memory Match ---------- */
  const EMOJI=['🧸','🚗','🪁','🎨','🧩','🚀','🪀','🎲','🦖','🎈'];
  const mBoard=$('#mem-board'), mStatus=$('#mem-status');
  let mFirst=null, mLock=false, mMoves=0, mPairs=0, mTotal=0, mTimer=null;
  function shuffle(a){ for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }
  function mReset(){
    clearTimeout(mTimer); mTimer=null;
    const pairs=+$('#mem-size').value; mTotal=pairs;
    mFirst=null; mLock=false; mMoves=0; mPairs=0;
    $('#mem-moves').textContent=0; $('#mem-pairs').textContent='0 / '+pairs;
    mStatus.textContent='Tap a card to flip it. Find all the pairs!'; mStatus.className='gm-status';
    const cols = pairs===6?4:pairs===8?4:5;
    mBoard.style.gridTemplateColumns=`repeat(${cols},1fr)`;
    mBoard.innerHTML='';
    shuffle([...EMOJI.slice(0,pairs),...EMOJI.slice(0,pairs)]).forEach((e,i)=>{
      const b=document.createElement('button');
      b.className='gm-card'; b.dataset.e=e; b.textContent='?';
      b.setAttribute('aria-label',`Card ${i+1}, face down`);
      b.addEventListener('click',()=>flip(b,i));
      mBoard.appendChild(b);
    });
  }
  function show(b,i){ b.classList.add('gm-open'); b.textContent=b.dataset.e; b.setAttribute('aria-label',`Card ${i+1}, ${b.dataset.e}`); }
  function hide(b,i){ b.classList.remove('gm-open'); b.textContent='?'; b.setAttribute('aria-label',`Card ${i+1}, face down`); }
  function flip(b,i){
    if(mLock||b.classList.contains('gm-open')||b.classList.contains('gm-done')) return;
    show(b,i);
    if(!mFirst){ mFirst={b,i}; return; }
    mMoves++; $('#mem-moves').textContent=mMoves;
    const a=mFirst; mFirst=null; mLock=true;
    if(a.b.dataset.e===b.dataset.e){
      [a.b,b].forEach(x=>{x.classList.add('gm-done'); x.disabled=true; x.setAttribute('aria-label',x.dataset.e+', matched');});
      mPairs++; $('#mem-pairs').textContent=mPairs+' / '+mTotal; mLock=false;
      if(mPairs===mTotal){ mStatus.textContent=`You found them all in ${mMoves} moves! 🎉`; mStatus.className='gm-status gm-good'; }
      else { mStatus.textContent='Match! ✅'; mStatus.className='gm-status gm-good'; }
    } else {
      mStatus.textContent='Not a match. Try again!'; mStatus.className='gm-status gm-bad';
      mTimer=setTimeout(()=>{ hide(a.b,a.i); hide(b,i); mLock=false; mTimer=null; },800);
    }
  }
  $('#mem-reset').addEventListener('click',mReset);
  $('#mem-size').addEventListener('change',mReset);
  mReset();

  /* ---------- Word Scramble ---------- */
  const WORDS=[
    ['TEDDY','A soft, cuddly bear you hug at bedtime'],
    ['PUZZLE','Fit the pieces together to see the picture'],
    ['ROBOT','A machine that beeps and moves like a person'],
    ['CRAYON','A waxy stick for colouring'],
    ['BALLOON','Floats up when filled with helium'],
    ['MARBLES','Little glass balls you roll and flick'],
    ['SCOOTER','Two wheels, a handle, and you push with one foot'],
    ['BLOCKS','Stack them up to build a tower'],
    ['KITE','Flies high on a string when it is windy'],
    ['DRUM','Bang bang! You hit it with sticks'],
    ['DOLL','A toy friend you can dress up'],
    ['PAINT','Brush it on paper to make colourful art']
  ];
  const ROUNDS=8;
  let sQ, sIdx, sScore, sHint, sDone;
  const sIn=$('#scr-input'), sStat=$('#scr-status');
  function scramble(w){
    let s; do{ s=shuffle(w.split('')).join(''); }while(s===w);
    return s;
  }
  function sNew(){
    sQ=shuffle([...WORDS]).slice(0,ROUNDS); sIdx=0; sScore=0; sDone=false;
    $('#scr-play').hidden=false; sNext(true);
  }
  function sNext(first){
    if(!first) sIdx++;
    $('#scr-score').textContent=sScore;
    $('#scr-bar').style.width=(sIdx/ROUNDS*100)+'%';
    if(sIdx>=ROUNDS){
      $('#scr-play').hidden=true; sDone=true;
      $('#scr-progress-text').textContent='All done!';
      sStat.textContent=`Final score: ${sScore} out of ${ROUNDS*10}. ${sScore>=ROUNDS*8?'Word wizard! 🧙':sScore>=ROUNDS*5?'Great job! 🌟':'Good try. Play again!'}`;
      sStat.className='gm-status gm-center gm-good'; return;
    }
    const [w,clue]=sQ[sIdx]; sHint=0;
    $('#scr-progress-text').textContent=`Question ${sIdx+1} of ${ROUNDS}`;
    const tiles=$('#scr-tiles'); tiles.innerHTML='';
    scramble(w).split('').forEach(ch=>{ const d=document.createElement('div'); d.className='gm-tile'; d.textContent=ch; tiles.appendChild(d); });
    tiles.setAttribute('aria-label','Scrambled letters: '+[...tiles.children].map(t=>t.textContent).join(', '));
    $('#scr-clue').textContent='Clue: '+clue;
    sIn.value=''; sIn.focus();
    if(!first){ /* keep last feedback visible */ } else { sStat.textContent=''; sStat.className='gm-status gm-center'; }
    $('#scr-hint').disabled=false;
  }
  $('#scr-form').addEventListener('submit',e=>{
    e.preventDefault(); if(sDone) return;
    const guess=sIn.value.trim().toUpperCase(), ans=sQ[sIdx][0];
    if(!guess){ sStat.textContent='Type your answer in the box first.'; sStat.className='gm-status gm-center gm-bad'; sIn.focus(); return; }
    if(!/^[A-Z]+$/.test(guess)){ sStat.textContent='Letters only, please (A to Z).'; sStat.className='gm-status gm-center gm-bad'; sIn.focus(); return; }
    if(guess===ans){
      sScore+=Math.max(10-sHint*5,5);
      sStat.textContent='Correct! 🎉'; sStat.className='gm-status gm-center gm-good'; sNext();
    } else {
      const close=guess.length===ans.length;
      sStat.textContent=close?'Close! Check the letters and try again.':`Hmm, the word has ${ans.length} letters. Try again!`;
      sStat.className='gm-status gm-center gm-bad'; sIn.select(); /* keep what they typed */
    }
  });
  $('#scr-hint').addEventListener('click',()=>{
    if(sDone) return; sHint=1;
    const w=sQ[sIdx][0];
    sStat.textContent=`Hint: it starts with "${w[0]}" and has ${w.length} letters.`; sStat.className='gm-status gm-center';
    $('#scr-hint').disabled=true; sIn.focus();
  });
  $('#scr-skip').addEventListener('click',()=>{
    if(sDone) return;
    sStat.textContent=`Skipped. The word was ${sQ[sIdx][0]}.`; sStat.className='gm-status gm-center'; sNext();
  });
  $('#scr-reset').addEventListener('click',sNew);
  sNew();
})();
