/* Bibliothek: Suche ueber freie Antworten und Produkte. */
(function(){
  var D=null;
  function q(i){return document.getElementById(i);}
  function esc(s){return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
  function karte(x){
    var T=D.texte, tag, cls;
    if(x.art==='frei'){ tag=T.kostenlos; cls='frei'; }
    else if(x.art==='buch'){ tag=T.buch; cls='buch'; }
    else { tag=T.pdf; cls='pdf'; }
    var tags='<span class="bib-tag bib-tag-'+cls+'">'+esc(tag)+'</span>';
    if(x.en) tags+='<span class="bib-tag bib-tag-info">'+esc(T.nur_en)+'</span>';
    else if(x.nur_de) tags+='<span class="bib-tag bib-tag-hinweis">'+esc(T.nur_de)+'</span>';
    var b='';
    if(x.link)     b+='<a class="bib-btn bib-btn-frei" href="'+esc(x.link)+'">'+esc(T.kostenlos)+'</a>';
    if(x.amazon)   b+='<a class="bib-btn bib-btn-amazon" href="'+esc(x.amazon)+'" target="_blank" rel="noopener sponsored">'+esc(T.bei_amazon)+'</a>';
    if(x.etsy)     b+='<a class="bib-btn bib-btn-etsy" href="'+esc(x.etsy)+'" target="_blank" rel="noopener sponsored">'+esc(T.bei_etsy)+'</a>';
    if(x.gumroad)  b+='<a class="bib-btn bib-btn-gumroad" href="'+esc(x.gumroad)+'" target="_blank" rel="noopener sponsored">'+esc(T.bei_gumroad)+'</a>';
    if(x.leseprobe)b+='<a class="bib-btn bib-btn-frei" href="'+esc(x.leseprobe)+'">'+esc(T.leseprobe)+'</a>';
    return '<article class="bib-karte"><div class="bib-tags">'+tags+'</div><h3>'+esc(x.titel)+'</h3>'+
           (x.kurz?'<p class="bib-kurz">'+esc(x.kurz)+'</p>':'')+
           '<div class="bib-btns">'+b+'</div></article>';
  }
  function zeichne(){
    var s=q('bib-suche').value.trim().toLowerCase();
    var box=q('bib-ergebnis'), zahl=q('bib-treffer'), leer=q('bib-leer');
    if(!s){ box.innerHTML=''; zahl.textContent=''; leer.style.display='none'; return; }
    var w=s.split(/\s+/);
    var tr=D.eintraege.filter(function(x){
      var h=(x.titel+' '+(x.kurz||'')).toLowerCase();
      return w.every(function(t){ return h.indexOf(t)>=0; });
    });
    box.innerHTML=tr.slice(0,40).map(karte).join('');
    zahl.textContent=tr.length+' '+D.texte.treffer;
    leer.style.display=tr.length?'none':'block';
  }
  var el=document.currentScript;
  var lang=document.documentElement.lang||'de';
  fetch('/bibliothek/suche-'+lang+'.json').then(function(r){return r.json();})
   .then(function(d){ D=d; var i=q('bib-suche'); if(!i) return;
     var tm; i.addEventListener('input',function(){clearTimeout(tm);tm=setTimeout(zeichne,150);});
   }).catch(function(){});
})();
