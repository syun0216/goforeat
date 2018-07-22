export function formatCard(card,isShow) {
  let _card = '';
  if(isShow) {
    let _arr_temp = [];
    for(let i = 0;i<card.length;i+=4) {
      _arr_temp.push(card.substr(i,4));
    }
    _card = _arr_temp.join(' ');
  }else {
    _card = card.substr(card.length-4);
    _card = `****   ****   ****   ${_card}`;
  }
  return _card;
}

export function formatVailTime(time) {
  return [time.substr(0,2),time.substr(2,2)].join('/');
}