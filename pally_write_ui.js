const api = window.charming.api("pally-write");
const app = document.getElementById("app");

/* ========== SVG ICONS (inlined from design assets) ========== */
const ICONS = {
  mic: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1C6.48 1 2 5.48 2 11v3c0 5.52 3.48 10.26 8 11.81V23h4v-2.19c4.52-1.55 8-6.29 8-11.81v-3c0-5.52-4.48-10-10-10z"></path><circle cx="12" cy="11" r="3"></circle></svg>',
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
  notebook: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6.5a2.5 2.5 0 0 1-2-2.5V4a2.5 2.5 0 0 1 2-2.5z"></path></svg>',
  trash: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 5H4.16667H17.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.66699 5V3.33333C6.66699 2.89131 6.84259 2.46738 7.15515 2.15482C7.46771 1.84226 7.89163 1.66667 8.33366 1.66667H11.667C12.109 1.66667 12.5329 1.84226 12.8455 2.15482C13.158 2.46738 13.3337 2.89131 13.3337 3.33333V5M15.8337 5V16.6667C15.8337 17.1087 15.658 17.5326 15.3455 17.8452C15.0329 18.1577 14.609 18.3333 14.167 18.3333H5.83366C5.39163 18.3333 4.96771 18.1577 4.65515 17.8452C4.34259 17.5326 4.16699 17.1087 4.16699 16.6667V5H15.8337Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  context: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
  close: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>',
  star: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
  starFilled: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>'
};
const AUDIO_MODE = {
  MICROPHONE: 'microphone',
  SYSTEM: 'system',
  BOTH: 'both'
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
.pw-card-action-btn.star { color: var(--muted); background: var(--cream); }
.pw-card-action-btn.star:hover { background: #f0ebe5; }
.pw-card-action-btn.star.starred { color: #eab308; background: #fefce8; }
.pw-card-action-btn.star.starred:hover { background: #fef9c3; }

/* Recording UI styles */
.pw-recording-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
}
.pw-speaker-indicator {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  color: white;
}
.pw-speaker-1 { background: rgba(37,99,235,0.3) !important; border-color: rgba(37,99,235,0.5) !important; }
.pw-speaker-2 { background: rgba(220,38,38,0.3) !important; border-color: rgba(220,38,38,0.5) !important; }
.pw-speaker-3 { background: rgba(5,150,105,0.3) !important; border-color: rgba(5,150,105,0.5) !important; }
.pw-speaker-4 { background: rgba(124,58,237,0.3) !important; border-color: rgba(124,58,237,0.5) !important; }
.pw-speaker-5 { background: rgba(234,88,12,0.3) !important; border-color: rgba(234,88,12,0.5) !important; }
.pw-audio-mode-select {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
  justify-content: center;
}
.pw-audio-mode-btn {
  padding: 10px 16px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 8px;
  color: white;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.pw-audio-mode-btn:hover, .pw-audio-mode-btn.active {
  background: var(--brown);
  border-color: var(--brown);
}
.pw-transcription-text {
  font-size: 15px;
  line-height: 1.8;
  text-align: left;
  max-width: 340px;
  word-wrap: break-word;
  white-space: normal;
}
.pw-transcription-text strong {
  font-weight: 700;
}
.pw-transcription-text br {
  display: block;
  content: "";
  margin: 6px 0;
}
.pw-transcribing-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(2px);
}
.pw-transcribing-modal {
  background: white;
  border-radius: 16px;
  padding: 40px 32px;
  text-align: center;
  max-width: 280px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}
.pw-transcribing-modal h2 {
  font-size: 18px;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 16px;
}
.pw-transcribing-modal p {
  font-size: 13px;
  color: var(--muted);
  margin-bottom: 24px;
}
.pw-spinner {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-bottom: 20px;
}
.pw-spinner-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--brown);
  animation: bounce 1.4s infinite;
}
.pw-spinner-dot:nth-child(1) { animation-delay: 0s; }
.pw-spinner-dot:nth-child(2) { animation-delay: 0.2s; }
.pw-spinner-dot:nth-child(3) { animation-delay: 0.4s; }
@keyframes bounce {
  0%, 60%, 100% { transform: translateY(0); opacity: 1; }
  30% { transform: translateY(-10px); opacity: 0.7; }
}
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
  editPageOpen: false,
  searchQuery: '',
  searchHistory: JSON.parse(localStorage.getItem('pw_searchHistory') || '[]'),
  audioMode: localStorage.getItem('pw_audioMode') || AUDIO_MODE.MICROPHONE,
  speakers: [],
  activeSpeaker: null,
  recordingStarted: false,
  audioContext: null,
  micStream: null,
  screenStream: null,
  isTranscribing: false,
  transcriptionProgress: 0
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

function detectRecordingType(speakerCount) {
  if (speakerCount <= 1) return 'solo';
  if (speakerCount === 2) return 'call';
  return 'group';
}

function getRecordingTypeLabel(type) {
  const labels = {
    solo: 'Personal Note',
    call: 'Voice Call',
    group: 'Group Discussion'
  };
  return labels[type] || 'Voice Note';
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
        <button class="pw-card-action-btn star ${note.starred ? 'starred' : ''}" onclick="event.stopPropagation(); toggleStarNote('${note.id}')">
          ${note.starred ? ICONS.starFilled : ICONS.star} ${note.starred ? 'Starred' : 'Star'}
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
      <div class="pw-fab" onclick="startTextNote()" style="right: 50%; transform: translateX(50%);">${ICONS.edit}</div>
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
          <div class="pw-context-menu-item" style="color: var(--brown);" onclick="toggleStarNote('${state.contextMenu.noteId}'); hideContextMenu();">
            ${state.notes.find(n => n.id === state.contextMenu.noteId)?.starred ? ICONS.starFilled : ICONS.star}
            <span>${state.notes.find(n => n.id === state.contextMenu.noteId)?.starred ? 'Unstar Note' : 'Star Note'}</span>
          </div>
          <div class="pw-context-menu-item" onclick="showNoteContextInfo('${state.contextMenu.noteId}'); hideContextMenu();">
            ${ICONS.context}
            <span>View Context</span>
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
  
  // Apply filter/sort based on selected filter
  if (state.libraryFilter === 'recent') {
    // Sort by most recent first
    audioNotes = audioNotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (state.libraryFilter === 'longest') {
    // Sort by duration (longest first)
    audioNotes = audioNotes.sort((a, b) => (b.duration || 0) - (a.duration || 0));
  } else if (state.libraryFilter === 'linked') {
    // Filter notes that have links/URLs in their content (http, https, www, etc.)
    audioNotes = audioNotes.filter(n => {
      const content = (n.content || '').toLowerCase();
      const title = (n.title || '').toLowerCase();
      return /http|https|www|\[.*\]\(.*\)|ftp/i.test(content + ' ' + title);
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (state.libraryFilter === 'starred') {
    // Filter only starred notes, sorted by recent
    audioNotes = audioNotes.filter(n => n.starred).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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
          <span style="cursor: pointer; ${state.libraryFilter === 'starred' ? 'color: var(--ink); font-weight: 600; border-bottom: 2px solid var(--ink); padding-bottom: 2px;' : ''}" onclick="setLibraryFilter('starred')">Starred</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${notes}
        </div>
      </div>
      <div class="pw-fab" onclick="startAirNoteRecording()" style="right: 50%; transform: translateX(50%);">${ICONS.mic}</div>
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
  const speakerColors = ['#2563eb', '#dc2626', '#059669', '#7c3aed', '#ea580c'];
  
  // Format transcription with speaker labels styled, bold, and colored
  const formatTranscription = (text) => {
    if (!text) return '<span style="opacity: 0.6;">Listening... transcribing with speaker detection</span>';
    return text.replace(/\[Speaker (\d+)\]:([^\[]*)/g, (match, num, content) => {
      const speakerNum = parseInt(num);
      const color = speakerColors[speakerNum - 1] || speakerColors[0];
      return `<span><strong style="color: ${color}; font-weight: 700;">[Speaker ${speakerNum}]:</strong><span style="color: ${color};">${content}</span></span>`;
    }).replace(/\[Speaker (\d+)\]\s*/g, (match, num) => {
      const speakerNum = parseInt(num);
      const color = speakerColors[speakerNum - 1] || speakerColors[0];
      return `<strong style="color: ${color}; font-weight: 700;">[Speaker ${speakerNum}]:</strong>`;
    }).replace(/\n/g, '<br/>').replace(/<br\/>(<strong\s+style=)/g, '<br/><br/>$1');
  };
  
  const speakerBadges = state.speakers.length > 0 && state.recordingStarted
    ? `<div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-bottom: 16px;">
        ${state.speakers.map((s, i) => {
          const speakerNum = i + 1;
          const color = s.color || speakerColors[i];
          const isActive = state.activeSpeaker === s.id;
          return `
            <span class="pw-speaker-indicator ${isActive ? 'pw-speaker-' + Math.min(i + 1, 5) : ''}" 
                  style="${isActive ? '' : 'opacity: 0.7; font-weight: 400;'}">
              <span style="width: 8px; height: 8px; background: ${color}; border-radius: 50%;${isActive ? ' box-shadow: 0 0 8px ' + color : ''}"></span>
              Speaker ${speakerNum}
            </span>
          `;
        }).join('')}
       </div>`
    : '';
  
  return `
    <div class="pw-app" style="background: var(--dark-blue); color: white;">
      <style>
        @keyframes pulse { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(0.6); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      </style>
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px 24px;">
        <span style="cursor: pointer;" onclick="cancelRecording()">${ICONS.back}</span>
        <span class="pw-title-sm" style="color: white;">New Note</span>
        <span style="cursor: pointer;" onclick="cancelRecording()">${ICONS.close}</span>
      </div>
      <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; min-height: 0;">
        ${!state.recordingStarted ? `
          <div style="text-align: center; display: flex; flex-direction: column; align-items: center;">
            <p style="opacity: 0.9; font-size: 15px; margin-bottom: 20px;">Recording with: <strong>${state.audioMode === 'microphone' ? '🎤 Microphone' : state.audioMode === 'system' ? '🖥️ System Audio' : '🎤+🖥️ Both'}</strong></p>
            <p style="opacity: 0.6; font-size: 12px; margin-bottom: 24px; max-width: 280px;">
              ${state.audioMode === 'system' ? 'Capturing audio from your device' : 
                state.audioMode === 'both' ? 'Capturing microphone + system audio' : 
                'Recording from your microphone'}
            </p>
            <button class="pw-btn pw-btn-primary" style="background: var(--brown); padding: 16px 48px; font-size: 16px; margin-bottom: 12px;" onclick="startRecordingWithMode()">
              Start Recording
            </button>
            <button class="pw-btn pw-btn-secondary" style="max-width: 200px;" onclick="showAudioModeSettings()">
              Change Audio Source
            </button>
          </div>
        ` : `
          <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; width: 100%; overflow-y: auto; padding-top: 20px;">
            ${speakerBadges}
            <div style="margin-bottom: 24px; max-width: 340px; width: 100%; text-align: left;">
              <div class="pw-transcription-text">
                ${formatTranscription(state.transcription)}
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 3px; margin: 24px 0;">
              ${[12,24,32,40,36,28,20,12].map((h, i) => `<div style="width: 3px; height: ${h}px; background: white; border-radius: 2px; animation: pulse 0.8s ease-in-out infinite; animation-delay: ${i * 0.05}s;"></div>`).join('')}
            </div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
              <div style="width: 10px; height: 10px; background: var(--red); border-radius: 50%; animation: blink 1s infinite;"></div>
              <span style="font-weight: 600;">RECORDING</span>
              ${state.audioMode === 'both' ? '<span style="opacity: 0.7; font-size: 13px;">(Mic + System)</span>' : 
                state.audioMode === 'system' ? '<span style="opacity: 0.7; font-size: 13px;">(System)</span>' : 
                '<span style="opacity: 0.7; font-size: 13px;">(Microphone)</span>'}
            </div>
            <h1 style="font-size: 48px; font-family: var(--font-display); margin-bottom: 32px;">${formatTime(state.recordingTime)}</h1>
            <div style="font-size: 12px; color: rgba(255,255,255,0.6); margin-bottom: 24px;">Max 5 minutes</div>
            <div style="display: flex; gap: 12px; width: 100%; max-width: 300px;">
              <button class="pw-btn" style="flex: 1; background: transparent; border: 1px solid white; color: white;" onclick="cancelRecording()">Stop & Discard</button>
              <button class="pw-btn pw-btn-primary" style="flex: 1; background: var(--brown);" onclick="saveRecording()">Save Note</button>
            </div>
          </div>
        `}
      </div>
    </div>
  `;
}

function renderSearch() {
  const query = state.searchQuery || '';
  const results = getSearchResults(query);
  
  // Recent searches chips
  const recentSearchesHtml = state.searchHistory.length > 0 && !query
    ? `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <div style="font-size: 12px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px;">Recent Searches</div>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          ${state.searchHistory.slice(0, 8).map(q => `
            <div onclick="useSearchHistory('${escapeHtml(q)}')" 
                 style="display: flex; align-items: center; gap: 6px; 
                        padding: 8px 14px; background: var(--cream); border-radius: 20px; 
                        font-size: 13px; color: var(--ink); cursor: pointer;
                        border: 1px solid var(--border); transition: all 0.15s ease;">
              <span style="color: var(--brown);">${ICONS.search}</span>
              ${escapeHtml(q)}
            </div>
          `).join('')}
        </div>
      </div>
    `
    : '';
  
  const resultsHtml = query.length > 0
    ? (results.length > 0
        ? results.map(note => `
            <div class="pw-card" onclick="openNote('${note.id}')" style="cursor: pointer;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <span class="pw-title-sm" style="flex: 1; font-size: 16px;">${highlightMatch(note.title, query)}</span>
                <span class="pw-note-badge">${note.hasAudio ? '🎙️ Voice' : '📝 Text'}</span>
              </div>
              <p class="pw-text" style="font-size: 13px; margin-bottom: 8px;">${highlightMatch(getSearchPreview(note.content, query), query)}</p>
              <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--muted);">
                <span>${formatDate(note.createdAt)}</span>
                <span>${note.content.length} chars</span>
              </div>
            </div>
          `).join('')
        : `<div class="pw-placeholder">
            <div style="font-size: 48px;">🔍</div>
            <p class="pw-text">No notes found for "${escapeHtml(query)}"</p>
          </div>`
      )
    : recentSearchesHtml || `<div class="pw-placeholder">
        <div style="font-size: 48px;">🔍</div>
        <p class="pw-text">Start typing to search your notes...</p>
      </div>`;

  return `
    <div class="pw-app">
      <div class="pw-header">
        <span class="pw-title-sm">Search</span>
      </div>
      <div style="padding: 20px; display: flex; flex-direction: column; gap: 16px; padding-bottom: 100px;">
        <div style="display: flex; align-items: center; gap: 8px; padding: 13px 15px; border: 1px solid var(--border-dark); border-radius: 10px; color: var(--muted);">
          ${ICONS.search}
          <input 
            type="text" 
            id="search-input"
            value="${escapeHtml(query)}"
            placeholder="Search notes..." 
            style="border: none; background: transparent; flex: 1; font-size: 14px; outline: none; color: var(--ink);"
            oninput="handleSearchInput(this.value)"
            onfocus="this.parentElement.style.borderColor='var(--brown)'"
            onblur="this.parentElement.style.borderColor=''"
            onkeydown="if(event.key === 'Enter') { addToSearchHistory(this.value); }"
          >
          ${query ? `<div style="cursor: pointer;" onclick="clearSearch()">${ICONS.close}</div>` : ''}
        </div>
        ${query ? `<div style="font-size: 12px; color: var(--muted);">Found ${results.length} result${results.length !== 1 ? 's' : ''}</div>` : ''}
        ${resultsHtml}
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
}

function showNoteContextInfo(id) {
  const note = state.notes.find(n => n.id === id);
  if (note) {
    const info = [
      `Type: ${note.hasAudio ? 'Voice Note' : 'Text Note'}`,
      `Created: ${formatFullDate(note.createdAt)}`,
      note.hasAudio ? `Duration: ${formatTime(note.duration || 0)}` : '',
      `Content Length: ${note.content.length} characters`,
      `ID: ${note.id.slice(0, 8)}...`
    ].filter(Boolean).join('\n');
    alert(info);
  }
}

function getSearchResults(query) {
  if (!query || query.trim().length === 0) return [];
  const lowerQuery = query.toLowerCase();
  return state.notes.filter(note => {
    const titleMatch = note.title && note.title.toLowerCase().includes(lowerQuery);
    const contentMatch = note.content && note.content.toLowerCase().includes(lowerQuery);
    return titleMatch || contentMatch;
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function getSearchPreview(content, query) {
  const lowerContent = (content || '').toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerContent.indexOf(lowerQuery);
  if (index === -1) return content.substring(0, 120);
  
  const start = Math.max(0, index - 40);
  const end = Math.min(content.length, index + query.length + 40);
  let preview = content.substring(start, end);
  if (start > 0) preview = '...' + preview;
  if (end < content.length) preview = preview + '...';
  return preview;
}

function highlightMatch(text, query) {
  if (!query || query.trim().length === 0) return escapeHtml(text);
  const lowerText = (text || '').toLowerCase();
  const lowerQuery = query.toLowerCase();
  let result = '';
  let lastIndex = 0;
  let index = lowerText.indexOf(lowerQuery);
  
  while (index !== -1) {
    result += escapeHtml(text.substring(lastIndex, index));
    result += `<mark style="background: #e8d5c4; color: var(--brown); border-radius: 2px; padding: 0 2px;">${escapeHtml(text.substring(index, index + query.length))}</mark>`;
    lastIndex = index + query.length;
    index = lowerText.indexOf(lowerQuery, lastIndex);
  }
  result += escapeHtml(text.substring(lastIndex));
  return result;
}

function handleSearchInput(value) {
  state.searchQuery = value;
  render();
  // Refocus the input after render
  setTimeout(() => {
    const input = document.getElementById('search-input');
    if (input && document.activeElement !== input) {
      input.focus();
      const len = input.value.length;
      input.setSelectionRange(len, len);
    }
  }, 0);
}

function addToSearchHistory(query) {
  if (!query || query.trim().length === 0) return;
  const trimmed = query.trim();
  // Remove if already exists, then add to front
  state.searchHistory = state.searchHistory.filter(q => q.toLowerCase() !== trimmed.toLowerCase());
  state.searchHistory.unshift(trimmed);
  // Keep only last 10
  state.searchHistory = state.searchHistory.slice(0, 10);
  // Save to localStorage
  localStorage.setItem('pw_searchHistory', JSON.stringify(state.searchHistory));
}

function useSearchHistory(query) {
  state.searchQuery = query;
  render();
}

function clearSearch() {
  state.searchQuery = '';
  render();
}

async function toggleStarNote(id) {
  const note = state.notes.find(n => n.id === id);
  if (!note) return;
  
  const newStarred = !note.starred;
  try {
    const updated = await api.updateNote({
      id: id,
      starred: newStarred
    });
    
    const index = state.notes.findIndex(n => n.id === id);
    if (index !== -1) {
      state.notes[index] = { ...state.notes[index], ...updated };
    }
    hideContextMenu();
    render();
  } catch (e) {
    console.error('Failed to update star:', e);
    alert('Failed to update: ' + e.message);
  }
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

function startTextNote() {
  // Create a new text note directly in edit mode
  state.editingNote = { id: null, title: '', content: '', hasAudio: false, audioKey: '', duration: 0, createdAt: new Date().toISOString() };
  state.view = 'edit';
  state.editPageOpen = true;
  render();
}

function startAirNoteRecording() {
  // Air note recording - called from Air Notes view FAB
  // Shows audio mode selection screen first
  state.view = 'recording';
  state.recording = true;
  state.recordingStarted = false;
  state.recordingTime = 0;
  state.transcription = '';
  state.speakers = [];
  state.activeSpeaker = null;
  render();
}

function setAudioMode(mode) {
  state.audioMode = mode;
  localStorage.setItem('pw_audioMode', mode);
  render();
}

function showAudioModeSettings() {
  const modes = [
    { id: 'microphone', label: '🎤 Microphone Only', desc: 'Record from your microphone' },
    { id: 'system', label: '🖥️ System Audio Only', desc: 'Capture device audio (calls, videos, etc.)' },
    { id: 'both', label: '🎤+🖥️ Both', desc: 'Microphone + system audio combined' }
  ];
  
  const options = modes.map(m => `
    <div onclick="setAudioMode('${m.id}'); render();" 
         style="padding: 12px; margin-bottom: 12px; border: 2px solid ${state.audioMode === m.id ? 'var(--brown)' : 'var(--border)'}; border-radius: 8px; cursor: pointer; text-align: center;">
      <div style="font-weight: 600; margin-bottom: 4px;">${m.label}</div>
      <div style="font-size: 12px; color: var(--muted);">${m.desc}</div>
    </div>
  `).join('');
  
  alert(`Audio Source Selection\n\nCurrent: ${state.audioMode}\n\nSelect which audio to capture:`);
  // Show selection via custom modal or use built-in selection
}

function generateTempTranscription() {
  // Generate temporary transcription placeholder that includes speaker labels
  // This simulates what Deepgram will return with diarization
  const speakerColors = ['#2563eb', '#dc2626', '#059669', '#7c3aed', '#ea580c'];
  
  // Update speakers list if not set
  if (state.speakers.length === 0) {
    state.speakers = [
      { id: 0, color: speakerColors[0] },
      { id: 1, color: speakerColors[1] }
    ];
  }
  
  // Simulate speaker activity during recording
  if (state.recordingTime % 5 === 0) {
    state.activeSpeaker = Math.floor(Math.random() * state.speakers.length);
    state.speakers[state.activeSpeaker].lastActive = Date.now();
  }
  
  // Update transcription with placeholder
  const phrases = [
    "Um, today we're discussing the...",
    "The meeting to capture this audio.",
    "So that's basically what we're trying to...",
    "Right, so when we...",
    "Yeah, exactly. The transcription...",
    "And it should show different...",
    "Speakers with different colors."
  ];
  
  const currentSpeaker = state.activeSpeaker || 0;
  const currentLine = `[Speaker ${currentSpeaker + 1}]: ${phrases[Math.floor(state.recordingTime / 3) % phrases.length]}`;
  
  if (state.transcription && !state.transcription.includes(currentLine)) {
    state.transcription += (state.transcription ? '\n\n' : '') + currentLine;
    render();
  }
}

async function startRecordingWithMode() {
  state.recordingStarted = true;
  state.audioChunks = [];
  render();
  
  try {
    const needsMic = state.audioMode === AUDIO_MODE.MICROPHONE || state.audioMode === AUDIO_MODE.BOTH;
    const needsSys = state.audioMode === AUDIO_MODE.SYSTEM || state.audioMode === AUDIO_MODE.BOTH;
    
    let micStream = null;
    let screenStream = null;
    let audioContext = null;
    let destination = null;
    
    // Get microphone stream if needed
    if (needsMic) {
      try {
        micStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
            sampleRate: { ideal: 16000 }
          }
        });
      } catch (e) {
        if (!needsSys) {
          throw new Error('Microphone access denied: ' + e.message);
        }
        console.log('Mic access denied, using system audio only:', e.message);
      }
    }
    
    // Get system audio stream if needed (macOS/Windows via getDisplayMedia)
    if (needsSys) {
      try {
        screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: false,
          audio: { echoCancellation: false }
        });
      } catch (e) {
        if (!micStream) {
          throw new Error('System audio access denied and no microphone: ' + e.message);
        }
        if (state.audioMode === AUDIO_MODE.SYSTEM) {
          throw new Error('System audio not available. Switch to microphone mode.');
        }
        console.log('System audio not available, using microphone only:', e.message);
      }
    }
    
    // Determine which stream to use
    let recordingStream = null;
    if (micStream && screenStream) {
      // Mix both streams using Web Audio API
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      destination = audioContext.createMediaStreamDestination();
      
      const micSource = audioContext.createMediaStreamSource(micStream);
      const sysSource = audioContext.createMediaStreamSource(screenStream);
      
      const micGain = audioContext.createGain();
      const sysGain = audioContext.createGain();
      
      micGain.gain.value = 0.7;
      sysGain.gain.value = 0.7;
      
      micSource.connect(micGain);
      sysSource.connect(sysGain);
      micGain.connect(destination);
      sysGain.connect(destination);
      
      recordingStream = destination.stream;
    } else if (micStream) {
      recordingStream = micStream;
    } else if (screenStream) {
      recordingStream = screenStream;
    } else {
      throw new Error('No audio source available');
    }
    
    // Store refs for cleanup
    state.micStream = micStream;
    state.screenStream = screenStream;
    state.audioContext = audioContext;
    
    // Create MediaRecorder with supported mimeType
    const mimeTypes = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/mp4'];
    let mediaRecorder;
    let usedMimeType = '';
    
    for (const mimeType of mimeTypes) {
      if (MediaRecorder.isTypeSupported(mimeType)) {
        mediaRecorder = new MediaRecorder(recordingStream, { mimeType });
        usedMimeType = mimeType;
        console.log(`Using audio format: ${mimeType}`);
        break;
      }
    }
    
    if (!mediaRecorder) {
      mediaRecorder = new MediaRecorder(recordingStream);
      console.log('Using browser default audio format');
    }
    
    state.mediaRecorder = mediaRecorder;
    
    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        state.audioChunks.push(e.data);
        console.log(`Audio chunk recorded: ${e.data.size} bytes`);
      }
    };
    
    mediaRecorder.onerror = (e) => {
      console.error('MediaRecorder error:', e);
      state.transcription = 'Recording error: ' + (e.error || 'unknown');
      render();
    };
    
    // Start recording with 100ms intervals for better audio capture
    mediaRecorder.start(100);
    console.log('Recording started with audio mode:', state.audioMode);
    
    // Update timer (5 minute max = 300 seconds)
    state.timerInterval = setInterval(() => {
      state.recordingTime++;
      // Auto-save at 5 minutes (300 seconds)
      if (state.recordingTime >= 300) {
        console.log('Recording reached 5 minute limit, auto-saving...');
        saveRecording();
      }
      render();
    }, 1000);
    
    render();
    
  } catch (e) {
    console.error('Recording initialization failed:', e);
    state.recordingStarted = false;
    state.transcription = 'Error: ' + e.message;
    render();
  }
}

// Keep startRecording for backward compatibility - it now goes to recording from home
function startRecording() {
  // Recording button from FAB - for voice notes
  state.view = 'recording';
  state.recording = true;
  state.recordingTime = 0;
  state.transcription = '';
  render();
  
  // Request microphone permission and start recording
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ 
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
        sampleRate: 16000
      }
    }).then(stream => {
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
        mediaRecorder = new MediaRecorder(stream);
      }
      
      state.mediaRecorder = mediaRecorder;
      state.audioChunks = [];
      
      state.mediaRecorder.ondataavailable = e => { 
        if (e.data && e.data.size > 0) {
          state.audioChunks.push(e.data);
          console.log(`Audio chunk: ${e.data.size} bytes, total: ${state.audioChunks.length} chunks`);
        }
      };
      
      state.mediaRecorder.start(1000);
      
      state.timerInterval = setInterval(() => {
        state.recordingTime++;
        if (state.recordingTime >= 600) saveRecording();
        render();
      }, 1000);
    }).catch(() => {
      state.transcription = 'Microphone access denied. Please allow microphone access to record.';
      render();
    });
  }
}

function cancelRecording() {
  // Clean up audio resources
  if (state.mediaRecorder && state.mediaRecorder.state === 'recording') {
    try {
      state.mediaRecorder.stop();
      state.mediaRecorder.stream.getTracks().forEach(t => t.stop());
    } catch (e) {
      console.log('Error stopping media recorder:', e);
    }
  }
  
  // Clean up source streams
  if (state.micStream) {
    state.micStream.getTracks().forEach(t => t.stop());
  }
  if (state.screenStream) {
    state.screenStream.getTracks().forEach(t => t.stop());
  }
  
  // Close audio context if used
  if (state.audioContext && state.audioContext.state !== 'closed') {
    try {
      state.audioContext.close();
    } catch (e) {
      console.log('Error closing audio context:', e);
    }
  }
  
  if (state.timerInterval) clearInterval(state.timerInterval);
  if (state.transcriptionInterval) clearInterval(state.transcriptionInterval);
  
  // Reset recording state
  state.recording = false;
  state.recordingStarted = false;
  state.mediaRecorder = null;
  state.micStream = null;
  state.screenStream = null;
  state.audioContext = null;
  state.transcription = '';
  state.speakers = [];
  state.activeSpeaker = null;
  
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
  state.isTranscribing = true;
  render();
  
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
      
      // 2. Get transcription from backend (which calls Deepgram with diarization)
      let transcription = '';
      let speakers = [];
      if (hasAudioData) {
        try {
          console.log('Sending audio to Deepgram for transcription (', audioBlob.size, 'bytes)...');
          const transcribeRes = await api.transcribe({ audioBase64: base64Data, diarize: true });
          transcription = transcribeRes.transcript || '';
          speakers = transcribeRes.speakers || [];
          console.log('Transcription result:', transcription.substring(0, 150));
          console.log('Speakers detected:', speakers.length > 0 ? speakers : 'No speakers detected');
          if (speakers.length === 0) {
            console.warn('⚠️ Speaker diarization returned no speakers. Check Deepgram response.');
          }
        } catch (e) {
          console.error('Transcription failed:', e);
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
      
      // 4. Detect recording type (solo, call, or group)
      const recordingType = detectRecordingType(speakers.length);
      const recordingTypeLabel = getRecordingTypeLabel(recordingType);
      
      // Format content based on recording type
      let content = '';
      if (recordingType === 'solo') {
        // Solo: simpler format (just summary, no speaker labels)
        const cleanTranscript = transcription.replace(/\[Speaker \d+\]:\s*/g, '');
        content = summary || cleanTranscript;
      } else {
        // Call/Group: keep full transcription with speaker identification
        content = summary || transcription;
      }
      
      // 5. Create the note
      const title = transcription.split('.')[0].slice(0, 60) || recordingTypeLabel + ' (' + durationMinutes + ' min)';
      
      const note = await api.createNote({
        title: title,
        content: content,
        hasAudio: uploadSuccess,
        audioKey: uploadSuccess ? audioKey : "",
        duration: state.recordingTime
      });
      
      state.notes.unshift(note);
      
      // Cleanup recording state
      state.audioChunks = [];
      state.transcription = '';
      state.speakers = [];
      state.activeSpeaker = null;
      state.recordingStarted = false;
      state.recording = false;
      state.isTranscribing = false;
      state.view = 'home';
      render();
      
      console.log(`Saved note: ${title}`);
      
    } catch (e) {
      console.error('Save failed:', e);
      alert('Failed to save: ' + e.message);
      
      state.audioChunks = [];
      state.transcription = '';
      state.speakers = [];
      state.activeSpeaker = null;
      state.recordingStarted = false;
      state.recording = false;
      state.isTranscribing = false;
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
  
  let html = (views[state.view] || views.welcome)();
  
  // Add transcribing overlay if active
  if (state.isTranscribing) {
    html += `
      <div class="pw-transcribing-overlay">
        <div class="pw-transcribing-modal">
          <div class="pw-spinner">
            <div class="pw-spinner-dot"></div>
            <div class="pw-spinner-dot"></div>
            <div class="pw-spinner-dot"></div>
          </div>
          <h2>Transcribing...</h2>
          <p>Processing your audio with speaker detection</p>
        </div>
      </div>
    `;
  }
  
  app.innerHTML = html;
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
window.startTextNote = startTextNote;
window.startAirNoteRecording = startAirNoteRecording;
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
window.showNoteContextInfo = showNoteContextInfo;
window.confirmDeleteNote = confirmDeleteNote;
window.closeEditPage = closeEditPage;
window.saveAndCloseEdit = saveAndCloseEdit;
window.handleSearchInput = handleSearchInput;
window.clearSearch = clearSearch;
window.setAudioMode = setAudioMode;
window.startRecordingWithMode = startRecordingWithMode;
window.showAudioModeSettings = showAudioModeSettings;
window.toggleStarNote = toggleStarNote;
window.useSearchHistory = useSearchHistory;
window.addToSearchHistory = addToSearchHistory;

init();
