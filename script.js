const MP=10,EP=20;
let qs=[],i=0,base=0,bonus=0,streak=0,correct=0,done=false;
const app=document.getElementById('app');
const el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e};
const shuffle=a=>{for(let k=a.length-1;k>0;k--){const j=Math.floor(Math.random()*(k+1));[a[k],a[j]]=[a[j],a[k]]}return a};
const status=()=>document.getElementById('st').textContent=`score ${base+bonus} | streak ${streak}🔥 | Ln ${Math.min(i+1,qs.length)}`;
const btn=(t,f,c)=>{const b=el('button','btn '+(c||''),t);b.onclick=f;return b};

function menu(){
  app.replaceChildren();base=bonus=streak=correct=0;i=0;status();
  const m=DATA.filter(q=>q.kind==='mcq').length,e=DATA.length-m;
  app.append(el('h1','','💎 CYBER SECURITY QUIZ'),
    el('div','arb','لعبة أسئلة الأمن السيبراني — اختيارات ومقالي مع الترجمة العربية'),
    el('div','code',`>>> import cybersecurity as cs\n>>> cs.load_questions()  # ${DATA.length} questions (${m} MCQ + ${e} essay)\n>>> cs.start()`),
    btn(`▶ Start — all (${DATA.length}) | كل الأسئلة`,()=>start('all')),
    btn(`▶ MCQ only (${m}) | اختيارات فقط`,()=>start('mcq')),
    btn(`▶ Essay only (${e}) | مقالي فقط`,()=>start('essay')),
    btn('▶ Quick round — 20 | جولة سريعة 20 سؤال',()=>start('quick')));
}
function start(m){
  let p=DATA.slice();
  if(m==='mcq')p=p.filter(q=>q.kind==='mcq');
  if(m==='essay')p=p.filter(q=>q.kind==='essay');
  shuffle(p);if(m==='quick')p=p.slice(0,20);
  qs=p;i=0;base=bonus=streak=correct=0;show();
}
function show(){
  if(i>=qs.length)return result();
  const q=qs[i];done=false;status();app.replaceChildren();
  const meta=el('div','meta');
  meta.append(el('span','',`# question_${String(i+1).padStart(2,'0')} / ${qs.length} [${q.kind.toUpperCase()}] +${q.kind==='mcq'?MP:EP}`));
  const pr=el('div','prog'),bar=el('i');bar.style.width=(100*i/qs.length)+'%';pr.append(bar);meta.append(pr);
  const cols=el('div','cols'),a=el('div','card'),b=el('div','card');
  a.append(el('small','','EN ▸ question'),el('div','en','>>> '+q.q));
  b.append(el('small','','AR ▸ الترجمة'),el('div','arb',q.ar));
  cols.append(a,b);
  const area=el('div'),fb=el('div');
  app.append(meta,cols,area,fb);
  q.kind==='mcq'?mcq(q,area,fb):essay(q,area,fb);
}
function feedback(fb,head,col,body){
  const f=el('div','fb');f.style.borderColor=col;
  const h=el('div','',head);h.style.color=col;
  f.append(h,el('div','arb',body));fb.append(f);
  fb.append(btn(i+1>=qs.length?'Finish 🏁 | إنهاء':'Next ▶ | التالي',()=>{i++;show();window.scrollTo(0,0)},'main'));
  f.scrollIntoView({behavior:'smooth',block:'nearest'});
}
function mcq(q,area,fb){
  const o=shuffle([q.right,...q.wrong]),bs=[];
  o.forEach((t,k)=>{
    const b=btn(`[${'ABCD'[k]}] ${t}`,()=>{
      if(done)return;done=true;
      bs.forEach((x,j)=>{x.disabled=true;if(o[j]===q.right)x.classList.add('ok');else if(j===k)x.classList.add('no')});
      const ok=t===q.right;let msg,col;
      if(ok){correct++;streak++;base+=MP;const bn=streak>=3?5:0;bonus+=bn;msg=`✔ Correct! +${MP}`+(bn?` (+${bn} streak bonus 🔥)`:'');col='var(--good)'}
      else{streak=0;msg='✘ Wrong';col='var(--bad)'}
      status();feedback(fb,msg,col,'💡 '+q.exp);
    });
    bs.push(b);area.append(b);
  });
}
function essay(q,area,fb){
  area.append(el('div','meta','# اكتب إجابتك بالإنجليزي — الكلمات المفتاحية هي اللي بتتصحح'));
  const t=el('textarea');area.append(t);
  const fin=(pts,mt,ms)=>{
    done=true;t.disabled=true;r.remove();
    base+=pts;if(pts>=EP/2){correct++;streak++}else streak=0;status();
    feedback(fb,`Score: ${pts}/${EP}\n✔ matched: ${mt.join(', ')||'-'}\n✘ missing: ${ms.join(', ')||'-'}`,pts>=EP/2?'var(--good)':'var(--bad)',
      '📘 Model answer:\n'+q.model+'\n\n🇪🇬 '+q.model_ar);
  };
  const r=el('div','row');
  r.append(btn('⏎ Submit | تصحيح',()=>{if(done)return;const x=t.value.toLowerCase();
      const mt=q.kws.filter(k=>x.includes(k)),ms=q.kws.filter(k=>!x.includes(k));
      fin(Math.round(EP*mt.length/q.kws.length),mt,ms)},'ok'),
    btn('👁 Show answer | اعرض الإجابة',()=>{if(!done)fin(0,[],q.kws)}));
  area.append(r);
}
function result(){
  app.replaceChildren();
  const mc=qs.filter(q=>q.kind==='mcq').length,mx=mc*MP+(qs.length-mc)*EP;
  const pct=mx?Math.min(100,Math.round(100*base/mx)):0;
  const rk=pct>=90?'Cyber Legend 💎 | أسطورة الأمن السيبراني':pct>=75?'Security Analyst 🛡️ | محلل أمني':pct>=50?'Junior Defender 🔐 | مدافع مبتدئ':'Script Kiddie 🐣 | كمّل مذاكرة وهتبقى جامد';
  app.append(el('h1','','┌─ RESULT ─┐'),
    el('div','code',`>>> score   = ${base+bonus}   # base ${base} + bonus ${bonus}\n>>> percent = ${pct}%\n>>> correct = ${correct} / ${qs.length}\n>>> rank    = "${rk}"`),
    btn('↻ Play again | العب تاني',menu,'main'));
  status();
}
menu();
