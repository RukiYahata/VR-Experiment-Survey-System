// ★ GASをデプロイして得たウェブアプリURLを貼る
const GAS_URL = 'https://script.google.com/macros/s/XXXXXXXX/exec';

const DEFAULT_CONFIG = {
  scale: { min: 1, max: 6, minLabel: '全くそう思わない', maxLabel: '非常にそう思う' },
  factors: [
    { name: '実験者の外見', levels: ['女性', 'ロボット'] },
    { name: '参加者の外見', levels: ['女性', 'ロボット'] },
    { name: '視点位置', levels: ['一人称', '横から'] }
  ],
  shuffleSections: false,
  sections: [
    { id: 's1', title: '分野A', items: [
      { id: 's1_q1', type: 'main', text: '(項目の例)' } ] },
    { id: 's2', title: '分野B', items: [
      { id: 's2_q1', type: 'main', text: '(項目の例)' } ] }
  ]
};

async function fetchConfig() {
  const r = await fetch(GAS_URL + '?t=' + Date.now());
  const j = await r.json();
  return j.config || DEFAULT_CONFIG;
}

// text/plain にすることでCORSプリフライトを回避(GASの定番手法)
async function postGas(body) {
  const r = await fetch(GAS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(body)
  });
  return r.json();
}

// 因子の直積 → 条件一覧(因子数・水準数は自由)
function buildConditions(factors) {
  let combos = [[]];
  factors.forEach(f => {
    const next = [];
    combos.forEach(c => f.levels.forEach(l => next.push(c.concat(l))));
    combos = next;
  });
  return combos.map(c => ({ id: c.join('_'), label: c.join(' × ') }));
}
