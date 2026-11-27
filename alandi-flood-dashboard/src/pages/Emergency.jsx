import { useState, useEffect } from 'react';
import './FloodHelp.css';

const T = {
  en: {
    title: 'Flood help', call: 'Call 112 now', amb: 'Ambulance', pol: 'Police', fire: 'Fire',
    share: 'Send my location', dontT: 'Do not', doT: 'Do', readyT: 'Get ready', reset: 'Reset',
    count: '{n} of {t} done', ready: 'You are ready.',
    finding: 'Finding your location…', copied: 'Link copied. Paste it in a message.',
    fail: 'Could not get location. Allow location and try again.', help: 'I need help. My location: ',
    donts: ['Do not walk or drive through flowing water', 'Do not touch fallen electric wires', 'Stay away from rivers, bridges and drains'],
    dos: ['Move to a higher floor or higher ground', 'Follow local authority instructions', 'Switch off electricity if water enters', 'Help children and elders first'],
    items: ['Pack water, torch, first aid, dry food', 'Charge phones and power banks', 'Keep ID papers in a waterproof bag', 'Know your nearest high ground', 'Agree a family meeting point'],
  },
  hi: {
    title: 'बाढ़ सहायता', call: 'अभी 112 पर कॉल करें', amb: 'एम्बुलेंस', pol: 'पुलिस', fire: 'दमकल',
    share: 'मेरी लोकेशन भेजें', dontT: 'यह न करें', doT: 'यह करें', readyT: 'तैयारी करें', reset: 'रीसेट',
    count: '{t} में से {n} पूरे', ready: 'आप तैयार हैं।',
    finding: 'लोकेशन खोज रहे हैं…', copied: 'लिंक कॉपी हुआ। मैसेज में पेस्ट करें।',
    fail: 'लोकेशन नहीं मिली। अनुमति दें और फिर कोशिश करें।', help: 'मुझे मदद चाहिए। मेरी लोकेशन: ',
    donts: ['बहते पानी में चलें या गाड़ी न चलाएं', 'गिरे हुए बिजली के तारों को न छुएं', 'नदी, पुल और नालों से दूर रहें'],
    dos: ['ऊंची मंजिल या ऊंची जगह पर जाएं', 'स्थानीय अधिकारियों की बात मानें', 'पानी घुसे तो बिजली बंद करें', 'पहले बच्चों और बुजुर्गों की मदद करें'],
    items: ['पानी, टॉर्च, प्राथमिक उपचार, सूखा खाना रखें', 'फोन और पावर बैंक चार्ज करें', 'पहचान पत्र वॉटरप्रूफ बैग में रखें', 'सबसे नज़दीकी ऊंची जगह जानें', 'परिवार के मिलने की जगह तय करें'],
  },
  mr: {
    title: 'पूर सहाय्य', call: 'आत्ता 112 वर कॉल करा', amb: 'रुग्णवाहिका', pol: 'पोलीस', fire: 'अग्निशमन',
    share: 'माझे लोकेशन पाठवा', dontT: 'हे करू नका', doT: 'हे करा', readyT: 'तयारी करा', reset: 'पुन्हा सुरू',
    count: '{t} पैकी {n} पूर्ण', ready: 'तुम्ही तयार आहात.',
    finding: 'लोकेशन शोधत आहे…', copied: 'लिंक कॉपी झाली. मेसेजमध्ये पेस्ट करा.',
    fail: 'लोकेशन मिळाले नाही. परवानगी द्या आणि पुन्हा प्रयत्न करा.', help: 'मला मदतीची गरज आहे. माझे लोकेशन: ',
    donts: ['वाहत्या पाण्यातून चालू नका किंवा गाडी चालवू नका', 'पडलेल्या विजेच्या तारांना हात लावू नका', 'नदी, पूल आणि नाल्यांपासून दूर रहा'],
    dos: ['वरच्या मजल्यावर किंवा उंच जागी जा', 'स्थानिक प्रशासनाच्या सूचना पाळा', 'पाणी आत आले तर वीज बंद करा', 'आधी मुले आणि वृद्धांना मदत करा'],
    items: ['पाणी, टॉर्च, प्रथमोपचार, कोरडे अन्न ठेवा', 'फोन आणि पॉवर बँक चार्ज करा', 'ओळखपत्रे वॉटरप्रूफ बॅगमध्ये ठेवा', 'जवळची उंच जागा माहीत करून घ्या', 'कुटुंबाने भेटण्याची जागा ठरवा'],
  },
};

const LANGS = [['en', 'English'], ['hi', 'हिन्दी'], ['mr', 'मराठी']];

function useStored(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable */ }
  }, [key, value]);
  return [value, setValue];
}

const browserLang = () => {
  const l = (navigator.language || 'en').slice(0, 2);
  return T[l] ? l : 'en';
};

export default function FloodHelp() {
  const [lang, setLang] = useStored('fh.lang', browserLang());
  const [done, setDone] = useStored('fh.done', []); // indexes of ticked items
  const [msg, setMsg] = useState('');

  const t = T[lang] || T.en;
  const total = t.items.length;
  const pct = Math.round((done.length / total) * 100);

  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  const toggle = (i) =>
    setDone((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i]));

  const shareLocation = () => {
    if (!navigator.geolocation) return setMsg(t.fail);
    setMsg(t.finding);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const link = `https://maps.google.com/?q=${coords.latitude},${coords.longitude}`;
        const text = t.help + link;
        try {
          if (navigator.share) { await navigator.share({ text }); setMsg(''); }
          else { await navigator.clipboard.writeText(text); setMsg(t.copied); }
        } catch {
          setMsg(link);
        }
      },
      () => setMsg(t.fail),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <main className="fh">
      <h1>{t.title}</h1>

      <div className="fh-lang" role="group" aria-label="Language">
        {LANGS.map(([code, name]) => (
          <button key={code} type="button" aria-pressed={lang === code}
            onClick={() => { setLang(code); setMsg(''); }}>
            {name}
          </button>
        ))}
      </div>

      <a className="fh-big fh-sos" href="tel:112">📞 <span>{t.call}</span></a>

      <div className="fh-grid">
        <a className="fh-mini" href="tel:108"><b>108</b><span>{t.amb}</span></a>
        <a className="fh-mini" href="tel:100"><b>100</b><span>{t.pol}</span></a>
        <a className="fh-mini" href="tel:101"><b>101</b><span>{t.fire}</span></a>
      </div>

      <div>
        <button type="button" className="fh-big fh-loc" onClick={shareLocation}>
          📍 <span>{t.share}</span>
        </button>
        <p className="fh-msg" role="status">{msg}</p>
      </div>

      <section className="fh-card">
        <div className="fh-box fh-no">
          <h2>⛔ {t.dontT}</h2>
          <ul>{t.donts.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
        <div className="fh-box fh-yes">
          <h2>✅ {t.doT}</h2>
          <ul>{t.dos.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
      </section>

      <section className="fh-card">
        <div className="fh-top">
          <h2>{t.readyT}</h2>
          <button type="button" className="fh-reset" onClick={() => setDone([])} disabled={!done.length}>
            {t.reset}
          </button>
        </div>
        <div className="fh-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
          <i style={{ width: `${pct}%` }} />
        </div>
        <p className="fh-count">
          {done.length === total ? t.ready : t.count.replace('{n}', done.length).replace('{t}', total)}
        </p>
        {t.items.map((txt, i) => (
          <label key={i} className={`fh-chk ${done.includes(i) ? 'is-done' : ''}`}>
            <input type="checkbox" checked={done.includes(i)} onChange={() => toggle(i)} />
            <span>{txt}</span>
          </label>
        ))}
      </section>
    </main>
  );
}
