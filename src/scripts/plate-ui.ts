const KEY = 'wf-outlet';

function current(): string {
  return document.documentElement.dataset.outlet || '120-15';
}

function setOutlet(id: string) {
  document.documentElement.dataset.outlet = id;
  try {
    localStorage.setItem(KEY, id);
  } catch {
    /* private mode */
  }
  document.querySelectorAll<HTMLButtonElement>('[data-outlet-chip]').forEach((btn) => {
    btn.setAttribute('aria-pressed', btn.dataset.outletChip === id ? 'true' : 'false');
  });
  document.querySelectorAll<HTMLElement>('[data-live-count]').forEach((el) => {
    const rows = [...document.querySelectorAll<HTMLElement>('tr[data-fit]')];
    const shown = rows.filter((row) => !row.hidden && row.offsetParent !== null).length;
    const visible = rows.filter((row) => (row.dataset.fit || '').split(/\s+/).includes(id)).length;
    el.textContent = `${visible} of ${rows.length} shown for this outlet`;
    void shown;
  });
  const form = document.getElementById('job-form') as HTMLFormElement | null;
  if (form) {
    const voltage = form.querySelector('#voltage') as HTMLSelectElement | null;
    const breaker = form.querySelector('#breakerA') as HTMLInputElement | null;
    if (voltage) voltage.value = id.startsWith('120') ? '120' : '240';
    if (breaker) breaker.value = id.endsWith('15') ? '15' : '50';
  }
}

function sortTable(table: HTMLTableElement, key: string) {
  const prev = table.dataset.sortKey;
  const dir = prev === key && table.dataset.sortDir !== 'desc' ? 'desc' : 'asc';
  table.dataset.sortKey = key;
  table.dataset.sortDir = dir;
  const tbody = table.tBodies[0];
  const rows = [...tbody.rows];
  const outlet = current();
  const value = (row: HTMLTableRowElement) => {
    if (key === 'duty') return Number(outlet === '240-50' ? row.dataset.duty240 : row.dataset.duty120);
    if (key === 'lb' || key === 'proc' || key === 'volt') return Number(row.dataset[key]);
    return (row.dataset[key] || '').toLowerCase();
  };
  rows.sort((a, b) => {
    const av = value(a);
    const bv = value(b);
    const cmp = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv));
    return dir === 'asc' ? cmp : -cmp;
  });
  for (const row of rows) tbody.append(row);
  table.querySelectorAll<HTMLButtonElement>('th button').forEach((btn) => {
    btn.dataset.active = btn.dataset.sort === key ? dir : '';
  });
}

document.querySelectorAll<HTMLButtonElement>('[data-outlet-chip]').forEach((btn) => {
  btn.addEventListener('click', () => setOutlet(btn.dataset.outletChip || '120-15'));
});

document.querySelectorAll<HTMLTableElement>('table.sortable').forEach((table) => {
  table.querySelectorAll<HTMLButtonElement>('th button[data-sort]').forEach((btn) => {
    btn.addEventListener('click', () => sortTable(table, btn.dataset.sort || 'name'));
  });
});

setOutlet(current());
