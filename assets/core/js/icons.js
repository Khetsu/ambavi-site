/* ამბავი · საერთო ხატულები (SVG sprite). გამოყენება: <svg><use href="#i-heart"/></svg>
   config.js-ის icon ველში იწერება სახელი "i-"-ის გარეშე, მაგ. icon: "rings". */
(function(){
"use strict";
const S = 'fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"';
const P = {
  pin: '<g ' + S + '><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></g>',
  heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill="currentColor" fill-opacity=".18" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
  note: '<path d="M9 18V5l12-2v13" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="6" cy="18" r="3" fill="currentColor"/><circle cx="18" cy="16" r="3" fill="currentColor"/>',
  cal: '<g ' + S + '><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></g>',
  share: '<g ' + S + '><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></g>',
  send: '<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z" ' + S + '/>',
  copy: '<g ' + S + '><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></g>',
  wa: '<path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z"/>',
  tg: '<path fill="currentColor" d="M21.9 4.3 18.8 19c-.2 1-.8 1.3-1.7.8l-4.6-3.4-2.2 2.1c-.3.3-.5.5-1 .5l.3-4.8L18.3 6c.4-.3-.1-.5-.6-.2L6.9 12.6 2.3 11.2c-1-.3-1-1 .2-1.5l18-6.9c.8-.3 1.6.2 1.4 1.5z"/>',
  clock: '<g ' + S + '><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></g>',
  camera: '<g ' + S + '><path d="M3 8h4l2-3h6l2 3h4v12H3z"/><circle cx="12" cy="13.5" r="3.5"/></g>',
  rings: '<g fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="15" r="5.5"/><circle cx="15" cy="15" r="5.5"/><path d="M10 4l2-2 2 2-2 3z" fill="currentColor" fill-opacity=".35"/></g>',
  church: '<g ' + S + '><path d="M12 2v4M10.3 3.6h3.4M8.5 10 12 6l3.5 4M7 21V10h10v11M10.5 21v-3.5a1.5 1.5 0 0 1 3 0V21M3 21h18M4 21v-6h3M20 21v-6h-3"/></g>',
  glasses: '<g ' + S + '><path d="M4 3h5l-.4 5a2.1 2.1 0 0 1-4.2 0zM6.5 10.2V20M4.5 20h4M15 3h5l-.4 5a2.1 2.1 0 0 1-4.2 0zM17.5 10.2V20M15.5 20h4"/><path d="M11 5.5l1.5-1M11 3l1.2.4M13 7l-1-.2"/></g>',
  hotel: '<g ' + S + '><path d="M5 21V6h14v15M2 21h20M8.5 9.5h2M13.5 9.5h2M8.5 13.5h2M13.5 13.5h2M10.5 21v-3.5h3V21"/></g>',
  dance: '<g ' + S + '><circle cx="8" cy="4" r="2"/><circle cx="16" cy="4" r="2"/><path d="M8 7v6l-2 8M8 13l2 8M16 7v6l-3 8M16 13l3 8M8 9h8"/></g>',
  cake: '<g ' + S + '><path d="M4 21h16M5 21v-6h14v6M7 15v-4h10v4M12 11V8M12 5.5c.8 0 1.2-.8 0-2.5-1.2 1.7-.8 2.5 0 2.5z"/><path d="M5 18c1.2 1 2.3 1 3.5 0s2.3-1 3.5 0 2.3 1 3.5 0 2.3-1 3.5 0"/></g>',
  gift: '<g ' + S + '><rect x="3" y="9" width="18" height="4" rx="1"/><path d="M5 13v8h14v-8M12 9v12M12 9c-2-4-6-5-6-2 0 1.5 2 2 6 2zm0 0c2-4 6-5 6-2 0 1.5-2 2-6 2z"/></g>',
  balloon: '<g ' + S + '><path d="M12 3c3.9 0 6 3 6 6.2C18 13 15 16 12 16S6 13 6 9.2C6 6 8.1 3 12 3z"/><path d="M11 16l1 1.5 1-1.5M12 17.5c0 2-2 2.5-1 4.5"/></g>',
  star: '<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.6 6.7 19.4l1.2-6L3.4 9.3l6-.7z" fill="currentColor" fill-opacity=".15" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>',
  sparkle: '<path d="M12 2c.6 4.6 2.4 7.4 8 8-5.6.6-7.4 3.4-8 8-.6-4.6-2.4-7.4-8-8 5.6-.6 7.4-3.4 8-8z" fill="currentColor"/>',
  cross: '<path d="M9 3h6l-2 7 7-1v6l-7-1 2 7H9l2-7-7 1V9l7 1z" fill="currentColor" fill-opacity=".2" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>',
  dove: '<path d="M3 13c3 0 5-1 6.5-3.5C11 7 12.5 5 16 5c1.6 0 2.7.8 3.2 2l2.3.6-2.2 1c-.3 4.4-3.6 8.4-9.3 8.4-2 0-3.5-.4-4.7-1.2L3 21l1.6-5.2C3.6 15 3 14 3 13z" fill="currentColor" fill-opacity=".15" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M9.5 9.5c.5 3 2.5 4.5 5.5 4.5" fill="none" stroke="currentColor" stroke-width="1.3"/>',
  candle: '<g ' + S + '><rect x="9" y="10" width="6" height="11" rx="1"/><path d="M12 10V8M12 3c1.6 1.8 1.6 3.6 0 5-1.6-1.4-1.6-3.2 0-5z"/></g>',
  dress: '<path d="M12 7a2 2 0 1 1 2-2M12 7v1.5L3 15a1 1 0 0 0 .6 1.8h16.8A1 1 0 0 0 21 15l-9-6.5" ' + S + '/>',
  car: '<g ' + S + '><path d="M4 16v-4l2-5h12l2 5v4zM4 16v3h3v-3M17 16v3h3v-3M4 12h16"/><circle cx="7.5" cy="14" r=".8" fill="currentColor"/><circle cx="16.5" cy="14" r=".8" fill="currentColor"/></g>',
  baby: '<g ' + S + '><circle cx="12" cy="13" r="8"/><path d="M12 5c-1.5-1.5 0-3 1.5-2.5M9 12h.01M15 12h.01M10 16c1.2 1 2.8 1 4 0"/></g>',
  users: '<g ' + S + '><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.5-4 3.2-6 6.5-6s6 2 6.5 6"/><circle cx="17" cy="9" r="2.8"/><path d="M16.5 14c3 .2 4.6 2 5 5"/></g>',
  home: '<path d="M3 11l9-7 9 7M5 9.5V20h5v-6h4v6h5V9.5" ' + S + '/>',
  game: '<g ' + S + '><path d="M6 8h12a4 4 0 0 1 3.9 4.8l-.8 4a2.5 2.5 0 0 1-4.3 1.2L15 16H9l-1.8 2a2.5 2.5 0 0 1-4.3-1.2l-.8-4A4 4 0 0 1 6 8z"/><path d="M7 11v3M5.5 12.5h3M16 11.5h.01M18 13.5h.01"/></g>',
  magic: '<g ' + S + '><path d="M4 20L15 9M13 7l4 4"/><path d="M18 3v3M16.5 4.5h3M20 9v2M19 10h2M10 3v2M9 4h2"/></g>',
  sun: '<g ' + S + '><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></g>',
  yes: '<g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="9" fill="currentColor" fill-opacity=".1"/><path d="M8 13c1 1.8 2.4 2.7 4 2.7s3-.9 4-2.7M9 9.5h.01M15 9.5h.01" stroke-width="2"/></g>',
  no: '<g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="9" fill="currentColor" fill-opacity=".1"/><path d="M8.5 15.5c1-1.2 2.2-1.8 3.5-1.8s2.5.6 3.5 1.8M9 10h.01M15 10h.01" stroke-width="2"/></g>',
  check: '<path d="M5 12.5l4.5 4.5L19 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  down: '<path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
  left: '<path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
  right: '<path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>'
};
const html = '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">' +
  Object.keys(P).map(k => '<symbol id="i-' + k + '" viewBox="0 0 24 24">' + P[k] + '</symbol>').join("") + '</svg>';
document.body.insertAdjacentHTML("afterbegin", html);
})();
