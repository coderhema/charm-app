const api = window.charming.api("pally-write");
const app = document.getElementById("app");

/* ========== SVG ICONS (inlined from design assets) ========== */
const ICONS = {
  mic: '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.9999 17.4172V20.1674M4.58252 9.16656V11C4.58252 12.702 5.25864 14.3342 6.46213 15.5377C7.66563 16.7411 9.29792 17.4172 10.9999 17.4172C12.7019 17.4172 14.3342 16.7411 15.5377 15.5377C16.7412 14.3342 17.4173 12.702 17.4173 11V9.16656M10.9999 1.83264C12.5189 1.83264 13.7502 3.06396 13.7502 4.58286V11C13.7502 12.5189 12.5189 13.7503 10.9999 13.7503C9.48096 13.7503 8.24961 12.5189 8.24961 11V4.58286C8.24961 3.06396 9.48096 1.83264 10.9999 1.83264Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  edit: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.375 2.625C18.7739 2.22602 19.3104 2 19.875 2C20.4396 2 20.9761 2.22602 21.375 2.625C21.774 3.02398 22 3.56044 22 4.125C22 4.68956 21.774 5.22602 21.375 5.625L12 15L8 16L9 12L18.375 2.625Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  fileText: '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.8332 1.83264H5.50063C5.01445 1.83264 4.54818 2.02581 4.2044 2.36966C3.86062 2.7135 3.66748 3.17986 3.66748 3.66612V18.334C3.66748 18.8202 3.86062 19.2866 4.2044 19.6304C4.54818 19.9743 5.01445 20.1674 5.50063 20.1674H16.4995C16.9857 20.1674 17.452 19.9743 17.7958 19.6304C18.1395 19.2866 18.3327 18.8202 18.3327 18.334V7.33308M12.8332 1.83264C13.1234 1.83217 13.4107 1.88912 13.6788 2.0002C13.9468 2.11127 14.1903 2.27429 14.3951 2.47986L17.6837 5.76913C17.8898 5.97402 18.0533 6.21773 18.1647 6.48616C18.276 6.7546 18.3331 7.04245 18.3327 7.33308M12.8332 1.83264V6.41634C12.8332 6.65948 12.9298 6.89265 13.1017 7.06457C13.2736 7.2365 13.5067 7.33308 13.7498 7.33308L18.3327 7.33308M9.16693 8.24982H7.33378M14.6664 11.9168H7.33378M14.6664 15.5837H7.33378" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  search: '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.2501 19.2501L15.2718 15.2718M17.4167 10.0833C17.4167 14.1334 14.1334 17.4167 10.0833 17.4167C6.03324 17.4167 2.75 14.1334 2.75 10.0833C2.75 6.03324 6.03324 2.75 10.0833 2.75C14.1334 2.75 17.4167 6.03324 17.4167 10.0833Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  sliders: '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.16667 4.58333H2.75M11 17.4167H2.75M12.8333 2.75V6.41667M14.6667 15.5833V19.25M19.25 11H11M19.25 17.4167H14.6667M19.25 4.58333H12.8333M7.33333 9.16667V12.8333M7.33333 11H2.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  quill: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.9994 12.8327L15.8535 7.10435C15.8224 6.9485 15.7473 6.80482 15.6371 6.69024C15.527 6.57566 15.3864 6.49497 15.2319 6.45769L4.69519 3.68935C4.55638 3.65579 4.41127 3.65847 4.27379 3.69712C4.13631 3.73578 4.01108 3.80911 3.91009 3.91009C3.80911 4.01108 3.73578 4.13631 3.69712 4.27379C3.65847 4.41127 3.65579 4.55638 3.68935 4.69519L6.45769 15.2319C6.49497 15.3864 6.57566 15.527 6.69024 15.6371C6.80482 15.7473 6.9485 15.8224 7.10435 15.8535L12.8327 16.9994M3.91585 3.91585L9.98752 9.98752M15.0884 19.7434C14.9321 19.8996 14.7202 19.9874 14.4992 19.9874C14.2783 19.9874 14.0663 19.8996 13.9101 19.7434L12.5884 18.4217C12.4322 18.2655 12.3444 18.0535 12.3444 17.8326C12.3444 17.6116 12.4322 17.3997 12.5884 17.2434L17.2434 12.5884C17.3997 12.4322 17.6116 12.3444 17.8326 12.3444C18.0535 12.3444 18.2655 12.4322 18.4217 12.5884L19.7434 13.9101C19.8996 14.0663 19.9874 14.2783 19.9874 14.4992C19.9874 14.7202 19.8996 14.9321 19.7434 15.0884L15.0884 19.7434ZM12.8327 11.166C12.8327 12.0865 12.0865 12.8327 11.166 12.8327C10.2455 12.8327 9.49935 12.0865 9.49935 11.166C9.49935 10.2455 10.2455 9.49935 11.166 9.49935C12.0865 9.49935 12.8327 10.2455 12.8327 11.166Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  play: '<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.19506 1.66597C2.12161 1.79287 2.08296 1.93691 2.08301 2.08353V7.91647C2.08296 8.06309 2.12161 8.20713 2.19506 8.33403C2.2685 8.46094 2.37413 8.56623 2.50129 8.63926C2.62845 8.7123 2.77263 8.75049 2.91927 8.75C3.06592 8.7495 3.20984 8.71032 3.3365 8.63643L8.33711 5.71995C8.46315 5.64654 8.56771 5.54134 8.64034 5.41486C8.71297 5.28839 8.75113 5.14507 8.75101 4.99922C8.75088 4.85338 8.71247 4.71013 8.63962 4.58378C8.56677 4.45743 8.46203 4.35241 8.33586 4.27921L3.3365 1.36357C3.20984 1.28968 3.06592 1.2505 2.91927 1.25C2.77263 1.24951 2.62845 1.2877 2.50129 1.36074C2.37413 1.43377 2.2685 1.53906 2.19506 1.66597Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  back: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.00021 3.33276L3.33301 7.99996L8.00021 12.6672M3.33301 7.99996H12.6674" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  more: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.99998 10.834C10.4602 10.834 10.8332 10.4606 10.8332 10C10.8332 9.53941 10.4602 9.16602 9.99998 9.16602C9.53979 9.16602 9.16673 9.53941 9.16673 10C9.16673 10.4606 9.53979 10.834 9.99998 10.834Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M15.8327 10.834C16.2929 10.834 16.666 10.4606 16.666 10C16.666 9.53941 16.2929 9.16602 15.8327 9.16602C15.3725 9.16602 14.9995 9.53941 14.9995 10C14.9995 10.4606 15.3725 10.834 15.8327 10.834Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M4.16723 10.834C4.62743 10.834 5.00048 10.4606 5.00048 10C5.00048 9.53941 4.62743 9.16602 4.16723 9.16602C3.70704 9.16602 3.33398 9.53941 3.33398 10C3.33398 10.4606 3.70704 10.834 4.16723 10.834Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  link: '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.83333 7.58335C6.08385 7.91826 6.40346 8.19538 6.77049 8.3959C7.13752 8.59643 7.54338 8.71567 7.96055 8.74555C8.37771 8.77542 8.79643 8.71523 9.18828 8.56906C9.58014 8.42288 9.93598 8.19414 10.2317 7.89835L11.9817 6.14835C12.513 5.59826 12.8069 4.86151 12.8003 4.09677C12.7937 3.33203 12.4869 2.60049 11.9461 2.05972C11.4054 1.51894 10.6738 1.2122 9.90909 1.20555C9.14435 1.19891 8.40759 1.49289 7.8575 2.02419L6.85417 3.02169M8.16678 6.41684C7.91627 6.08193 7.59666 5.80482 7.22963 5.60429C6.8626 5.40377 6.45674 5.28452 6.03957 5.25464C5.6224 5.22477 5.20369 5.28496 4.81183 5.43113C4.41997 5.57731 4.06413 5.80605 3.76845 6.10184L2.01845 7.85184C1.48716 8.40193 1.19317 9.13869 1.19982 9.90343C1.20646 10.6682 1.51321 11.3997 2.05398 11.9405C2.59475 12.4812 3.32629 12.788 4.09103 12.7946C4.85577 12.8013 5.59253 12.5073 6.14262 11.976L7.14012 10.9785" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  waveform: '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 7.5C2.26522 7.5 2.51957 7.39464 2.70711 7.20711C2.89464 7.01957 3 6.76522 3 6.5V4.5C3 4.23478 3.10536 3.98043 3.29289 3.79289C3.48043 3.60536 3.73478 3.5 4 3.5C4.26522 3.5 4.51957 3.60536 4.70711 3.79289C4.89464 3.98043 5 4.23478 5 4.5V11C5 11.2652 5.10536 11.5196 5.29289 11.7071C5.48043 11.8946 5.73478 12 6 12C6.26522 12 6.51957 11.8946 6.70711 11.7071C6.89464 11.5196 7 11.2652 7 11V3C7 2.73478 7.10536 2.48043 7.29289 2.29289C7.48043 2.10536 7.73478 2 8 2C8.26522 2 8.51957 2.10536 8.70711 2.29289C8.89464 2.48043 9 2.73478 9 3V9.5C9 9.76522 9.10536 10.0196 9.29289 10.2071C9.48043 10.3946 9.73478 10.5 10 10.5C10.2652 10.5 10.5196 10.3946 10.7071 10.2071C10.8946 10.0196 11 9.76522 11 9.5V7.5C11 7.23478 11.1054 6.98043 11.2929 6.79289C11.4804 6.60536 11.7348 6.5 12 6.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  notebook: '<svg width="104" height="104" viewBox="0 0 104 104" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M56.6669 18.6639H31.9984C30.2301 18.6639 28.5343 19.3664 27.284 20.6167C26.0337 21.8671 25.3312 23.5629 25.3312 25.3311V78.6687C25.3312 80.437 26.0337 82.1328 27.284 83.3832C28.5343 84.6335 30.2301 85.3359 31.9984 85.3359H72.0013C73.7696 85.3359 75.4654 84.6335 76.7157 83.3832C77.966 82.1328 78.6685 80.437 78.6685 78.6687V54.0001M18.6641 31.9983H31.9984M18.6641 45.3327H31.9984M18.6641 58.6671H31.9984M18.6641 72.0015H31.9984M83.2621 30.7521C84.59 29.4241 85.3361 27.623 85.3361 25.745C85.3361 23.867 84.59 22.0659 83.2621 20.7379C81.9341 19.41 80.133 18.6639 78.255 18.6639C76.377 18.6639 74.576 19.41 73.248 20.7379L56.5468 37.4459C55.7542 38.2381 55.1741 39.2172 54.86 40.2928L52.0698 49.8603C51.9861 50.1471 51.9811 50.4512 52.0553 50.7406C52.1294 51.0301 52.28 51.2943 52.4913 51.5056C52.7026 51.7169 52.9668 51.8675 53.2562 51.9416C53.5457 52.0158 53.8497 52.0108 54.1366 51.9271L63.704 49.1369C64.7796 48.8228 65.7587 48.2426 66.5508 47.4501L83.2621 30.7521Z" stroke="#6B4E3A" stroke-width="1.5" stroke-linecap="round"/></svg>',
  trash: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 5H4.16667H17.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.66699 5V3.33333C6.66699 2.89131 6.84259 2.46738 7.15515 2.15482C7.46771 1.84226 7.89163 1.66667 8.33366 1.66667H11.667C12.109 1.66667 12.5329 1.84226 12.8455 2.15482C13.158 2.46738 13.3337 2.89131 13.3337 3.33333V5M15.8337 5V16.6667C15.8337 17.1087 15.658 17.5326 15.3455 17.8452C15.0329 18.1577 14.609 18.3333 14.167 18.3333H5.83366C5.39163 18.3333 4.96771 18.1577 4.65515 17.8452C4.34259 17.5326 4.16699 17.1087 4.16699 16.6667V5H15.8337Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  context: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
  close: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>'
};
const CSS = `
:root {
  --cream: #fffdf8;
  --ink: #0a0a0a;
  --brown: #512906;
  --brown-light: #6B4E3A;
  --muted: #8c8c8c;
  --dark-blue: #242d64;
  --red: #c23616;
  --border: #e5e5e5;
  --border-dark: #d1d1d1;
  --green: #0c3b1a;
  --font-body: 'Inter', system-ui, -apple-system, sans-serif;
  --font-display: 'Source Serif Pro', Georgia, serif;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body {
  min-height: 100vh;
  min-height: 100dvh;
  font-family: var(--font-body);
  background: var(--cream);
  color: var(--ink);
  -webkit-text-size-adjust: 100%;
}
.pw-app { max-width: 600px; margin: 0 auto; min-height: 100vh; display: flex; flex-direction: column; }
.pw-title { font-family: var(--font-display); font-size: 32px; line-height: 1.1; }
.pw-title-sm { font-family: var(--font-display); font-size: 24px; }
.pw-text { font-size: 14px; color: var(--muted); }
.pw-btn { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 14px 20px; border-radius: 10px; border: none; font-size: 15px; font-weight: 600; cursor: pointer; }
.pw-btn-primary { background: var(--brown); color: var(--cream); }
.pw-btn-secondary { background: transparent; color: var(--ink); border: 1px solid var(--border-dark); }
.pw-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; border-bottom: 1px solid var(--border); }
.pw-card { display: flex; flex-direction: column; gap: 12px; background: var(--cream); padding: 15px; border: 1px solid var(--border); border-radius: 10px; }
.pw-waveform { display: flex; align-items: center; gap: 2px; height: 14px; }
.pw-waveform-bar { width: 2px; background: #d1d1d1; border-radius: 1px; }
.pw-waveform-bar.active { background: var(--brown); }
.pw-fab { position: fixed; bottom: 100px; right: 24px; width: 56px; height: 56px; background: var(--brown); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--cream); cursor: pointer; box-shadow: 0 4px 12px rgba(81,41,6,0.3); z-index: 100; }
.pw-tabs { display: flex; justify-content: space-between; padding: 13px 24px; border-top: 1px solid var(--border); background: var(--cream); position: fixed; bottom: 0; left: 0; right: 0; }
.pw-tab { display: flex; flex-direction: column; align-items: center; gap: 4px; font-size: 12px; color: var(--muted); cursor: pointer; }
.pw-tab.active { color: var(--ink); font-weight: 600; }
.pw-recording { background: var(--dark-blue); color: white; min-height: 100vh; padding: 24px; }
.pw-placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 24px; text-align: center; gap: 16px; }
.pw-context-menu {
  position: fixed;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 8px 0;
  min-width: 160px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 1000;
}
.pw-context-menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  font-size: 14px;
  color: var(--red);
}
.pw-context-menu-item:hover {
  background: #f8f8f8;
}
.pw-note-page { background: #fff; }
.pw-note-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  background: #fff;
}
.pw-note-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: transparent;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  color: var(--brown);
  cursor: pointer;
  transition: background 0.15s;
}
.pw-note-btn:hover { background: var(--cream); }
.pw-note-actions { display: flex; gap: 8px; }
.pw-note-play { color: var(--brown); background: var(--cream); }
.pw-note-play:hover { background: #f0ebe5; }
.pw-note-content {
  flex: 1;
  padding: 20px 24px;
  overflow-y: auto;
}
.pw-note-title-input {
  width: 100%;
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 600;
  color: var(--ink);
  border: none;
  outline: none;
  background: transparent;
  padding: 0;
  margin-bottom: 8px;
}
.pw-note-title-input::placeholder { color: var(--muted); opacity: 0.5; }
.pw-note-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
}
.pw-note-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: var(--cream);
  border-radius: 12px;
  font-size: 12px;
  color: var(--brown);
  font-weight: 500;
}
.pw-note-date {
  font-size: 13px;
  color: var(--muted);
}
.pw-note-audio-player {
  background: var(--cream);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
}
.pw-note-audio-wave {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2px;
  height: 40px;
  margin-bottom: 12px;
}
.pw-note-wave-bar {
  flex: 1;
  background: var(--brown-light);
  border-radius: 2px;
  min-width: 3px;
  opacity: 0.6;
}
.pw-note-wave-bar.active { background: var(--brown); opacity: 1; }
.pw-note-audio-info {
  text-align: center;
  font-size: 13px;
  color: var(--muted);
  font-weight: 500;
}
.pw-note-body-input {
  width: 100%;
  min-height: 300px;
  font-family: var(--font-body);
  font-size: 17px;
  line-height: 1.7;
  color: var(--ink);
  border: none;
  outline: none;
  background: transparent;
  padding: 0;
  resize: none;
}
.pw-note-body-input::placeholder { color: var(--muted); opacity: 0.4; }
.pw-note-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-top: 1px solid var(--border);
  background: #fff;
}
.pw-note-footer-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: var(--brown);
  color: var(--cream);
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}
.pw-note-footer-btn:hover { opacity: 0.9; }
.pw-note-word-count {
  font-size: 13px;
  color: var(--muted);
}

/* ===== NEW EDIT PAGE STYLES ===== */
.pw-edit-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0);
  z-index: 200;
  pointer-events: none;
  transition: background 0.3s ease;
}
.pw-edit-overlay.active {
  background: rgba(0,0,0,0.2);
  pointer-events: auto;
}

.pw-edit-page {
  position: fixed;
  top: 0;
  right: -100%;
  width: 100%;
  max-width: 600px;
  height: 100vh;
  background: #fff;
  z-index: 201;
  display: flex;
  flex-direction: column;
  transition: right 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: -4px 0 24px rgba(0,0,0,0.15);
}
.pw-edit-page.active {
  right: 0;
}

.pw-edit-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  background: #fff;
  flex-shrink: 0;
}

.pw-edit-close {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  cursor: pointer;
  color: var(--muted);
  transition: all 0.15s ease;
}
.pw-edit-close:hover { background: var(--cream); color: var(--ink); }

.pw-edit-save {
  padding: 8px 16px;
  background: var(--brown);
  color: var(--cream);
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s ease;
}
.pw-edit-save:hover { opacity: 0.9; }

.pw-edit-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.pw-edit-title-input {
  width: 100%;
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 600;
  color: var(--ink);
  border: none;
  outline: none;
  background: transparent;
  padding: 0;
  line-height: 1.3;
}
.pw-edit-title-input::placeholder { color: var(--muted); opacity: 0.4; }

.pw-edit-body-input {
  width: 100%;
  flex: 1;
  font-family: var(--font-body);
  font-size: 17px;
  line-height: 1.8;
  color: var(--ink);
  border: none;
  outline: none;
  background: transparent;
  padding: 0;
  resize: none;
  min-height: 300px;
}
.pw-edit-body-input::placeholder { color: var(--muted); opacity: 0.3; }

.pw-edit-meta {
  font-size: 13px;
  color: var(--muted);
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
}

/* Card Actions */
.pw-card {
  position: relative;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
}
.pw-card.selected {
  border-color: var(--brown);
  background: #fff;
  box-shadow: 0 2px 12px rgba(81,41,6,0.12);
}

.pw-card-actions {
  display: flex;
  gap: 8px;
  padding-top: 12px;
  margin-top: 8px;
  border-top: 1px solid var(--border);
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition: all 0.25s ease;
}
.pw-card.selected .pw-card-actions {
  max-height: 60px;
  opacity: 1;
}

.pw-card-action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  background: transparent;
  transition: all 0.15s ease;
  flex: 1;
  justify-content: center;
}
.pw-card-action-btn.context { color: var(--brown); background: var(--cream); }
.pw-card-action-btn.context:hover { background: #f0ebe5; }
.pw-card-action-btn.edit { color: var(--brown); background: var(--cream); }
.pw-card-action-btn.edit:hover { background: #f0ebe5; }
.pw-card-action-btn.delete { color: var(--red); background: #fef2f2; }
.pw-card-action-btn.delete:hover { background: #fee2e2; }
`;

/* ========== STATE ========== */
let state = {
  view: 'welcome',
  notes: [],
  recording: false,
  recordingTime: 0,
  mediaRecorder: null,
  audioChunks: [],
  transcription: '',
  summary: '',
  contextMenu: { visible: false, noteId: null, x: 0, y: 0 },
  libraryFilter: 'recent',
  editingNote: null,
  selectedNoteId: null,
  editPageOpen: false
};

/* ========== HELPERS ========== */
function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return m + ':' + s;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[d.getMonth()] + ' ' + d.getDate();
}

function formatFullDate(dateStr) {
  const d = new Date(dateStr);
  const options = { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' };
  return d.toLocaleDateString('en-US', options);
}

/* ========== VIEWS ========== */
function renderWelcome() {
  return `
    <div class="pw-app" style="justify-content: center; align-items: center; padding: 32px; text-align: center;">
      <div style="margin-bottom: 32px;">${ICONS.notebook}</div>
      <h1 class="pw-title" style="margin-bottom: 12px;">Write freely.<br>Speak naturally.</h1>
      <p class="pw-text" style="margin-bottom: 32px; max-width: 280px;">
        Capture thoughts as text or voice notes - your voice becomes part of the page.
      </p>
      <button class="pw-btn pw-btn-primary" style="width: 100%; margin-bottom: 12px;" onclick="startApp()">
        Start Writing
      </button>
      <button class="pw-btn pw-btn-secondary" style="width: 100%;" onclick="showHome()">
        Skip
      </button>
    </div>
  `;
}

function renderHome() {
  const notes = state.notes.length ? state.notes.map((note, index) => `
    <div class="pw-card ${state.selectedNoteId === note.id ? 'selected' : ''}" 
         onclick="selectNote('${note.id}')"
         data-note-id="${note.id}">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span class="pw-title-sm" style="flex: 1;">${note.title}</span>
        ${note.hasAudio ? `<div class="pw-waveform">${[1,2,3,4,5,6,7,8].map(i => `<div class="pw-waveform-bar" style="height: ${[8,12,6,14,10,4,12,8][i-1]}px;"></div>`).join('')}</div>` : ''}
      </div>
      <p class="pw-text">${note.content.substring(0, 120)}${note.content.length > 120 ? '...' : ''}</p>
      <div style="display: flex; justify-content: space-between; font-size: 12px; color: var(--muted);">
        <span>${formatDate(note.createdAt)}</span>
        <span>${note.hasAudio ? 'Voice note' : 'Text'}</span>
      </div>
      <div class="pw-card-actions">
        <button class="pw-card-action-btn context" onclick="event.stopPropagation(); showNoteContext('${note.id}')">
          ${ICONS.context} Context
        </button>
        <button class="pw-card-action-btn edit" onclick="event.stopPropagation(); editNote('${note.id}')">
          ${ICONS.edit} Edit
        </button>
        <button class="pw-card-action-btn delete" onclick="event.stopPropagation(); confirmDeleteNote('${note.id}')">
          ${ICONS.trash} Delete
        </button>
      </div>
    </div>
  `).join('') : `
    <div class="pw-placeholder">
      <div style="font-size: 48px;">📝</div>
      <p class="pw-text">No notes yet. Tap the + button to create your first note.</p>
    </div>
  `;

  return `
    <div class="pw-app">
      <div class="pw-header">
        <span style="width: 16px;"></span>
        <span class="pw-title-sm">Pally-Write</span>
        <span style="width: 16px;"></span>
      </div>
      <div style="padding: 20px; display: flex; flex-direction: column; gap: 16px; padding-bottom: 100px;" onclick="hideContextMenu()">
        ${notes}
      </div>
      <div class="pw-fab" onclick="startRecording()">${ICONS.quill}</div>
      <div class="pw-tabs">
        <div class="pw-tab active" onclick="showHome()">${ICONS.fileText}<span>Notes</span></div>
        <div class="pw-tab" onclick="showLibrary()">${ICONS.mic}<span>Air Notes</span></div>
        <div class="pw-tab" onclick="showSearch()">${ICONS.search}<span>Search</span></div>
        <div class="pw-tab" onclick="showSettings()">${ICONS.sliders}<span>Settings</span></div>
      </div>
      ${state.contextMenu.visible ? `
        <div class="pw-context-menu" style="left: ${state.contextMenu.x}px; top: ${state.contextMenu.y}px;">
          <div class="pw-context-menu-item" style="color: var(--ink);" onclick="editNote('${state.contextMenu.noteId}')">
            ${ICONS.edit}
            <span>Edit Note</span>
          </div>
          <div class="pw-context-menu-item" onclick="deleteNote('${state.contextMenu.noteId}')">
            ${ICONS.trash}
            <span>Delete Note</span>
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

function renderLibrary() {
  // Filter audio notes
  let audioNotes = state.notes.filter(n => n.hasAudio);
  
  // Apply filter/sort
  if (state.libraryFilter === 'recent') {
    audioNotes = audioNotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (state.libraryFilter === 'longest') {
    audioNotes = audioNotes.sort((a, b) => (b.duration || 0) - (a.duration || 0));
  } else if (state.libraryFilter === 'linked') {
    audioNotes = audioNotes.filter(n => n.title && n.title.length > 0);
  }
  
  const notes = audioNotes.length ? audioNotes.map(note => `
    <div class="pw-card" style="cursor: pointer;" onclick="openNote('${note.id}')">
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="width: 32px; height: 32px; background: var(--border); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
          ${ICONS.play}
        </div>
        <div style="flex: 1;">
          <div style="font-weight: 600; font-size: 14px;">${formatTime(note.duration)}</div>
          <div style="font-size: 11px; color: var(--muted);">${note.title}</div>
        </div>
        <span style="font-size: 12px; color: var(--muted);">${formatDate(note.createdAt)}</span>
      </div>
      <div class="pw-waveform">${[1,2,3,4,5,6,7].map(i => `<div class="pw-waveform-bar" style="height: ${[8,12,6,14,10,4,12][i-1]}px;"></div>`).join('')}</div>
      <div style="display: flex; align-items: center; gap: 6px; font-size: 13px; color: #474747;">
        ${ICONS.link} <span>Linked: ${note.title}</span>
      </div>
    </div>
  `).join('') : `
    <div class="pw-placeholder">
      <div style="font-size: 48px;">🎙️</div>
      <p class="pw-text">No voice notes yet. Start recording to create your first air note.</p>
    </div>
  `;

  return `
    <div class="pw-app">
      <div class="pw-header">
        <span style="width: 32px; cursor: pointer;" onclick="showHome()">${ICONS.back}</span>
        <span class="pw-title-sm">Air Notes</span>
        <span style="width: 32px;"></span>
      </div>
      <div style="padding: 20px; padding-bottom: 100px;">
        <div style="display: flex; gap: 20px; margin-bottom: 20px; font-size: 14px; color: var(--muted);">
          <span style="cursor: pointer; ${state.libraryFilter === 'recent' ? 'color: var(--ink); font-weight: 600; border-bottom: 2px solid var(--ink); padding-bottom: 2px;' : ''}" onclick="setLibraryFilter('recent')">Recent</span>
          <span style="cursor: pointer; ${state.libraryFilter === 'longest' ? 'color: var(--ink); font-weight: 600; border-bottom: 2px solid var(--ink); padding-bottom: 2px;' : ''}" onclick="setLibraryFilter('longest')">Longest</span>
          <span style="cursor: pointer; ${state.libraryFilter === 'linked' ? 'color: var(--ink); font-weight: 600; border-bottom: 2px solid var(--ink); padding-bottom: 2px;' : ''}" onclick="setLibraryFilter('linked')">Linked</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${notes}
        </div>
      </div>
      <div class="pw-tabs">
        <div class="pw-tab" onclick="showHome()">${ICONS.fileText}<span>Notes</span></div>
        <div class="pw-tab active" onclick="showLibrary()">${ICONS.mic}<span>Air Notes</span></div>
        <div class="pw-tab" onclick="showSearch()">${ICONS.search}<span>Search</span></div>
        <div class="pw-tab" onclick="showSettings()">${ICONS.sliders}<span>Settings</span></div>
      </div>
    </div>
  `;
}

function renderRecording() {
  return `
    <div class="pw-app" style="background: var(--dark-blue); color: white;">
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px 24px;">
        <span style="cursor: pointer;" onclick="cancelRecording()">${ICONS.back}</span>
        <span class="pw-title-sm" style="color: white;">New Note</span>
        <span>${ICONS.more}</span>
      </div>
      <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px;">
        <div style="margin-bottom: 40px;">
          ${state.transcription ? `<p style="font-size: 16px; line-height: 1.5; text-align: center; max-width: 300px;">${state.transcription}</p>` : `<p style="opacity: 0.6; font-size: 14px;">Recording... Speak now</p>`}
        </div>
        <div style="display: flex; align-items: center; gap: 3px; margin: 40px 0;">
          ${[12,24,32,40,36,28,20,12].map(h => `<div style="width: 3px; height: ${h}px; background: white; border-radius: 2px; ${state.recording ? 'animation: pulse 1s ease-in-out infinite' : ''}"></div>`).join('')}
        </div>
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
          <div style="width: 10px; height: 10px; background: var(--red); border-radius: 50%;"></div>
          <span style="font-weight: 600;">RECORDING AIR NOTE</span>
        </div>
        <h1 style="font-size: 48px; font-family: var(--font-display); margin-bottom: 40px;">${formatTime(state.recordingTime)}</h1>
        <div style="display: flex; gap: 12px; width: 100%; max-width: 300px;">
          <button class="pw-btn" style="flex: 1; background: transparent; border: 1px solid white; color: white;" onclick="cancelRecording()">Stop</button>
          <button class="pw-btn pw-btn-primary" style="flex: 1; background: var(--brown);" onclick="saveRecording()">Save Note</button>
        </div>
      </div>
    </div>
  `;
}

function renderSearch() {
  return `
    <div class="pw-app">
      <div class="pw-header">
        <span class="pw-title-sm">Search</span>
      </div>
      <div style="padding: 20px;">
        <div style="display: flex; align-items: center; gap: 8px; padding: 13px 15px; border: 1px solid var(--border-dark); border-radius: 10px; color: var(--muted);">
          ${ICONS.search}
          <input type="text" placeholder="Search notes..." style="border: none; background: transparent; flex: 1; font-size: 14px; outline: none;">
        </div>
      </div>
      <div class="pw-tabs">
        <div class="pw-tab" onclick="showHome()">${ICONS.fileText}<span>Notes</span></div>
        <div class="pw-tab" onclick="showLibrary()">${ICONS.mic}<span>Air Notes</span></div>
        <div class="pw-tab active" onclick="showSearch()">${ICONS.search}<span>Search</span></div>
        <div class="pw-tab" onclick="showSettings()">${ICONS.sliders}<span>Settings</span></div>
      </div>
    </div>
  `;
}

function renderSettings() {
  return `
    <div class="pw-app">
      <div class="pw-header">
        <span class="pw-title-sm">Settings</span>
      </div>
      <div style="padding: 20px; display: flex; flex-direction: column; gap: 16px;">
        <div class="pw-card" style="cursor: pointer;">
          <div style="font-weight: 600;">About Pally-Write</div>
<div style="font-size: 13px; color: var(--muted);">Version 1.0 - Powered by Deepgram & Cerebras</div>
          <div style="font-size: 13px; margin-top: 8px;">
            Created by <a href="https://x.com/coderhema" target="_blank" style="color: var(--brown); text-decoration: underline;" onclick="event.stopPropagation(); window.open('https://x.com/coderhema', '_blank'); return false;">coderhema</a>
          </div>
        </div>
        <div class="pw-card" style="cursor: pointer;" onclick="showWelcome()">
          <div style="font-weight: 600;">View Onboarding</div>
        </div>
      </div>
      <div class="pw-tabs">
        <div class="pw-tab" onclick="showHome()">${ICONS.fileText}<span>Notes</span></div>
        <div class="pw-tab" onclick="showLibrary()">${ICONS.mic}<span>Air Notes</span></div>
        <div class="pw-tab" onclick="showSearch()">${ICONS.search}<span>Search</span></div>
        <div class="pw-tab active" onclick="showSettings()">${ICONS.sliders}<span>Settings</span></div>
      </div>
    </div>
  `;
}

function renderEdit() {
  const note = state.editingNote;
  if (!note) return '';
  
  const isVoiceNote = note.hasAudio;
  const displayDate = formatFullDate(note.createdAt || new Date());
  
  return `
    <div class="pw-edit-overlay ${state.editPageOpen ? 'active' : ''}" onclick="closeEditPage()"></div>
    <div class="pw-edit-page ${state.editPageOpen ? 'active' : ''}">
      <div class="pw-edit-header">
        <div class="pw-edit-close" onclick="closeEditPage()">${ICONS.close}</div>
        <span class="pw-title-sm" style="color: var(--muted); font-size: 16px;">${isVoiceNote ? '🎙️ Voice Note' : '📝 Text Note'}</span>
        <button class="pw-edit-save" onclick="saveAndCloseEdit()">Save</button>
      </div>
      <div class="pw-edit-content">
        <input type="text" 
               id="edit-title" 
               class="pw-edit-title-input"
               placeholder="Untitled" 
               value="${escapeHtml(note.title || '')}" />
        <div class="pw-edit-meta">${displayDate}</div>
        <textarea id="edit-content" 
                  class="pw-edit-body-input"
                  placeholder="Start writing...">${escapeHtml(note.content || '')}</textarea>
      </div>
    </div>
  `;
}

/* ========== ACTIONS ========== */
function startApp() { state.view = 'home'; render(); }
function showHome() { state.view = 'home'; state.editingNote = null; render(); }
function showLibrary() { state.view = 'library'; render(); }
function showSearch() { state.view = 'search'; render(); }
function showSettings() { state.view = 'settings'; render(); }
function showWelcome() { state.view = 'welcome'; render(); }
function openNote(id) { 
  const note = state.notes.find(n => n.id === id);
  if (note) {
    state.editingNote = note;
    state.view = 'edit';
    state.editPageOpen = true;
    render();
  }
}

function selectNote(id) {
  // Toggle selection
  if (state.selectedNoteId === id) {
    state.selectedNoteId = null;
  } else {
    state.selectedNoteId = id;
  }
  render();
}

function showNoteContext(id) {
  console.log('Show context for note:', id);
  // Context menu could show additional options
}

function editNote(id) {
  const note = state.notes.find(n => n.id === id);
  if (note) {
    state.editingNote = note;
    state.view = 'edit';
    state.editPageOpen = true;
    state.selectedNoteId = null;
    render();
  }
}

function confirmDeleteNote(id) {
  if (confirm('Delete this note?')) {
    deleteNote(id);
  }
}

function closeEditPage() {
  state.editPageOpen = false;
  // Delay the view switch to allow animation to complete
  setTimeout(() => {
    state.editingNote = null;
    state.view = 'home';
    render();
  }, 300);
}

async function saveAndCloseEdit() {
  const titleInput = document.getElementById('edit-title');
  const contentInput = document.getElementById('edit-content');
  
  if (!state.editingNote || !titleInput || !contentInput) {
    closeEditPage();
    return;
  }
  
  const newTitle = titleInput.value.trim();
  const newContent = contentInput.value.trim();
  
  try {
    const updated = await api.updateNote({
      id: state.editingNote.id,
      title: newTitle || state.editingNote.title,
      content: newContent
    });
    
    const index = state.notes.findIndex(n => n.id === state.editingNote.id);
    if (index !== -1) {
      state.notes[index] = { ...state.notes[index], ...updated };
    }
    
    closeEditPage();
  } catch (e) {
    console.error('Failed to save:', e);
    alert('Failed to save: ' + e.message);
  }
}

function playNote(id) { console.log('Play note:', id); }
function setLibraryFilter(filter) {
  state.libraryFilter = filter;
  render();
}

// Context menu handling
let pressTimer;
let pressStartTime;
const LONG_PRESS_DURATION = 500; // 500ms for long press

function handleNotePress(event, noteId, index) {
  const isTouch = event.type === 'touchstart';
  const clientX = isTouch ? event.touches[0].clientX : event.clientX;
  const clientY = isTouch ? event.touches[0].clientY : event.clientY;
  
  pressStartTime = Date.now();
  
  pressTimer = setTimeout(() => {
    // Long press detected - show context menu
    showContextMenu(clientX, clientY, noteId);
  }, LONG_PRESS_DURATION);
  
  // Clear timer on mouseup/touchend
  const clearTimer = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      pressTimer = null;
    }
  };
  
  document.addEventListener(isTouch ? 'touchend' : 'mouseup', clearTimer, { once: true });
}

function showContextMenu(x, y, noteId) {
  // Prevent going off screen
  const menuWidth = 160;
  const menuHeight = 100; // Two items now
  
  let finalX = x;
  let finalY = y;
  
  if (finalX + menuWidth > window.innerWidth) {
    finalX = window.innerWidth - menuWidth - 10;
  }
  
  if (finalY + menuHeight > window.innerHeight) {
    finalY = window.innerHeight - menuHeight - 10;
  }
  
  state.contextMenu = {
    visible: true,
    noteId: noteId,
    x: finalX,
    y: finalY
  };
  render();
}

function hideContextMenu() {
  state.contextMenu = {
    visible: false,
    noteId: null,
    x: 0,
    y: 0
  };
  render();
}

async function deleteNote(noteId) {
  if (!confirm('Delete this note?')) return;
  
  try {
    await api.deleteNote({ id: noteId });
    // Remove from local state
    state.notes = state.notes.filter(n => n.id !== noteId);
    hideContextMenu();
    render();
    console.log('Note deleted:', noteId);
  } catch (e) {
    console.error('Failed to delete note:', e);
    alert('Failed to delete: ' + e.message);
  }
}

function startRecording() {
  state.view = 'recording';
  state.recording = true;
  state.recordingTime = 0;
  state.transcription = '';
  render();
  
  // Request microphone permission and start recording
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Try to get better quality audio
    navigator.mediaDevices.getUserMedia({ 
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
        sampleRate: 16000
      }
    }).then(stream => {
      // Try different mimeTypes to find one that works
      const mimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus'
      ];
      
      let mediaRecorder;
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          mediaRecorder = new MediaRecorder(stream, { mimeType });
          console.log(`Using mimeType: ${mimeType}`);
          break;
        }
      }
      
      if (!mediaRecorder) {
        mediaRecorder = new MediaRecorder(stream); // Fallback to default
        console.log('Using default MediaRecorder');
      }
      
      state.mediaRecorder = mediaRecorder;
      state.audioChunks = [];
      
      // Simple recording
      state.mediaRecorder.ondataavailable = e => { 
        if (e.data && e.data.size > 0) {
          state.audioChunks.push(e.data);
          console.log(`Audio chunk: ${e.data.size} bytes, total: ${state.audioChunks.length} chunks`);
        }
      };
      
      state.mediaRecorder.start(1000);
      
      // Update timer
      state.timerInterval = setInterval(() => {
        state.recordingTime++;
        if (state.recordingTime >= 600) saveRecording(); // 10 min max
        render();
      }, 1000);
    }).catch(() => {
      state.transcription = 'Microphone access denied. Please allow microphone access to record.';
      render();
    });
  }
}

function cancelRecording() {
  if (state.mediaRecorder && state.mediaRecorder.state === 'recording') {
    state.mediaRecorder.stop();
    state.mediaRecorder.stream.getTracks().forEach(t => t.stop());
  }
  if (state.timerInterval) clearInterval(state.timerInterval);
  state.recording = false;
  state.view = 'home';
  render();
}

async function saveRecording() {
  if (state.mediaRecorder && state.mediaRecorder.state === 'recording') {
    state.mediaRecorder.stop();
    state.mediaRecorder.stream.getTracks().forEach(t => t.stop());
  }
  
  if (state.timerInterval) clearInterval(state.timerInterval);
  state.recording = false;
  
  // Gather audio blobs into a single blob
  const audioBlob = new Blob(state.audioChunks, { type: 'audio/webm' });
  const audioKey = 'audio/' + Date.now() + '.webm';
  const durationMinutes = (state.recordingTime / 60).toFixed(1);
  
  // Check if we actually captured audio
  const hasAudioData = state.audioChunks.length > 0 && audioBlob.size > 100;
  
  // Convert to base64 for upload
  const reader = new FileReader();
  reader.readAsDataURL(audioBlob);
  
  reader.onloadend = async () => {
    const base64Data = reader.result.split(',')[1];
    
    try {
      // 1. Upload audio metadata (we're storing JSON instead of binary to avoid 500 errors)
      let uploadSuccess = false;
      let audioUrl = '';
      if (hasAudioData) {
        try {
          const uploadRes = await api.uploadAudio({ audioBase64: base64Data, key: audioKey });
          uploadSuccess = uploadRes.success || false;
          audioUrl = uploadRes.url || '';
          console.log('Upload result:', uploadRes);
        } catch (e) {
          console.log('Audio upload failed:', e.message);
        }
      }
      
      // 2. Get transcription from backend (which calls Deepgram)
      let transcription = '';
      if (hasAudioData) {
        try {
          const transcribeRes = await api.transcribe({ audioBase64: base64Data });
          transcription = transcribeRes.transcript || '';
          console.log('Transcription result:', transcription.substring(0, 100));
        } catch (e) {
          console.log('Transcription failed:', e.message);
          transcription = `Voice recording (${durationMinutes} min)`;
        }
      } else {
        transcription = `Voice note (${durationMinutes} min)`;
      }
      
      // 3. Get summary if we got real transcription
      let summary = '';
      if (transcription && 
          transcription.length > 30 && 
          !transcription.includes('Voice recording') && 
          !transcription.includes('Voice note')) {
        try {
          const summaryRes = await api.summarize({ text: transcription });
          summary = summaryRes.summary || '';
        } catch (e) { 
          console.log('Summarize failed:', e);
        }
      }
      
      // 4. Create the note
      const title = transcription.split('.')[0].slice(0, 60) || `Voice Note (${durationMinutes} min)`;
      const content = summary || transcription;
      
      const note = await api.createNote({
        title: title,
        content: content,
        hasAudio: uploadSuccess,
        audioKey: uploadSuccess ? audioKey : "",
        duration: state.recordingTime
      });
      
      state.notes.unshift(note);
      state.audioChunks = [];
      state.transcription = '';
      state.view = 'home';
      render();
      
      console.log(`Saved note: ${title}`);
      
    } catch (e) {
      console.error('Save failed:', e);
      alert('Failed to save: ' + e.message);
      
      state.audioChunks = [];
      state.view = 'home';
      render();
    }
  };
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

async function saveEditedNote() {
  if (!state.editingNote) return;
  
  const titleInput = document.getElementById('edit-title');
  const contentInput = document.getElementById('edit-content');
  
  const newTitle = titleInput?.value?.trim() || state.editingNote.title;
  const newContent = contentInput?.value?.trim() || state.editingNote.content;
  
  try {
    // Update via API
    const updated = await api.updateNote({
      id: state.editingNote.id,
      title: newTitle,
      content: newContent
    });
    
    // Update local state
    const index = state.notes.findIndex(n => n.id === state.editingNote.id);
    if (index !== -1) {
      state.notes[index] = { ...state.notes[index], ...updated };
    }
    
    state.editingNote = null;
    state.view = 'home';
    render();
    console.log('Note updated:', updated.id);
  } catch (e) {
    console.error('Failed to update note:', e);
    alert('Failed to save: ' + e.message);
  }
}

function cancelEdit() {
  state.editingNote = null;
  state.view = 'home';
  render();
}

/* ========== RENDER ========== */
function render() {
  const views = {
    welcome: renderWelcome,
    home: renderHome,
    library: renderLibrary,
    recording: renderRecording,
    search: renderSearch,
    settings: renderSettings,
    edit: renderEdit
  };
  app.innerHTML = (views[state.view] || views.welcome)();
}

/* ========== INIT ========== */
function init() {
  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);
  
  const meta = document.querySelector('meta[name="viewport"]') || document.createElement('meta');
  meta.name = 'viewport';
  meta.content = 'width=device-width, initial-scale=1, viewport-fit=cover';
  if (!meta.parentNode) document.head.appendChild(meta);
  
  const font = document.createElement('link');
  font.rel = 'stylesheet';
  font.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Source+Serif+Pro:wght@400;600&display=swap';
  document.head.appendChild(font);
  
  loadNotes();
}

async function loadNotes() {
  try {
    const notes = await api.listNotes();
    state.notes = notes || [];
    render();
  } catch(e) { 
    console.log('Could not load notes, using empty list');
    state.notes = [];
    render(); 
  }
}

// Expose functions globally
window.startApp = startApp;
window.showHome = showHome;
window.showLibrary = showLibrary;
window.showSearch = showSearch;
window.showSettings = showSettings;
window.showWelcome = showWelcome;
window.openNote = openNote;
window.playNote = playNote;
window.startRecording = startRecording;
window.cancelRecording = cancelRecording;
window.saveRecording = saveRecording;
window.setLibraryFilter = setLibraryFilter;
window.editNote = editNote;
window.saveEditedNote = saveEditedNote;
window.cancelEdit = cancelEdit;
window.deleteNote = deleteNote;
window.handleNotePress = handleNotePress;
window.hideContextMenu = hideContextMenu;
window.selectNote = selectNote;
window.showNoteContext = showNoteContext;
window.confirmDeleteNote = confirmDeleteNote;
window.closeEditPage = closeEditPage;
window.saveAndCloseEdit = saveAndCloseEdit;

init();
