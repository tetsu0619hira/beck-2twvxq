'use strict';
// Always use the shop's local calendar, even for visitors outside Japan.
function scheduleFor(date) {
  const weekday = new Intl.DateTimeFormat('en-US', {timeZone:'Asia/Tokyo', weekday:'short'}).format(date);
  const day = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(weekday);
  return {day, text: day === 1 ? '本日は定休日（月曜日）' : `本日の通常営業時間 ${day === 0 || day === 6 ? '11:00' : '12:00'}〜19:00`};
}
function updateHours() {
  const now = new Date();
  const schedule = scheduleFor(now);
  document.getElementById('today-title').textContent = schedule.text;
  document.getElementById('today-status').textContent = new Intl.DateTimeFormat('ja-JP', {timeZone:'Asia/Tokyo',month:'long',day:'numeric',weekday:'long'}).format(now) + ' ／ 祝日・臨時変更を除く';
  document.querySelectorAll('[data-days]').forEach(row => {
    const current = row.dataset.days.split(',').map(Number).includes(schedule.day);
    row.classList.toggle('today', current);
    if (current) row.setAttribute('aria-current', 'date'); else row.removeAttribute('aria-current');
  });
}
updateHours();
setInterval(updateHours, 60000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) updateHours(); });
const menu = document.querySelector('.menu-button');
const navigation = document.getElementById('navigation');
function closeMenu(){ menu.setAttribute('aria-expanded','false'); navigation.classList.remove('open'); menu.querySelector('span').textContent='＋'; }
menu.addEventListener('click', () => {
  const expanded = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(expanded));
  navigation.classList.toggle('open', expanded);
  menu.querySelector('span').textContent = expanded ? '−' : '＋';
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click',closeMenu));
document.addEventListener('keydown', event => {if(event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true'){closeMenu();menu.focus();}});
document.addEventListener('click', event => {if(!event.target.closest('.header')) closeMenu();});
