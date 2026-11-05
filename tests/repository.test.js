import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import vm from 'node:vm';
import { colouringSheets, workshops } from '../modules/activities/activities-data.js';
const root = resolve(import.meta.dirname, '..');
function walk(dir) {
  return readdirSync(dir).filter(name => !name.startsWith('.') && name !== 'node_modules').flatMap(name => {
    const path = resolve(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}
test('HTML pages and activity assets resolve to nonempty local files', () => {
  for (const file of walk(root).filter(path => path.endsWith('.html'))) {
    const html = readFileSync(file, 'utf8');
    assert.ok(html.trim(), `${file} is empty`);
    for (const [, url] of html.matchAll(/\b(?:src|href)=["']([^"']+)["']/g)) {
      if (/^(?:[a-z]+:|#|\/\/)/i.test(url)) continue;
      const target = resolve(dirname(file), decodeURIComponent(url.split(/[?#]/)[0]));
      assert.ok(existsSync(target), `${file}: missing ${url}`);
      assert.ok(statSync(target).size > 0, `${url} is empty`);
    }
  }
  for (const item of [...colouringSheets, ...workshops]) {
    for (const url of [item.image, item.download].filter(Boolean)) {
      assert.ok(existsSync(resolve(root, url)), `Missing ${url}`);
      if (url.endsWith('.pdf')) assert.equal(readFileSync(resolve(root, url)).subarray(0, 5).toString(), '%PDF-');
    }
  }
});
function element() {
  const classes = new Set();
  return {
    children: [], dataset: {}, style: {}, listeners: {}, textContent: '',
    classList: { add: (...names) => names.forEach(name => classes.add(name)), remove: name => classes.delete(name), contains: name => classes.has(name) },
    setAttribute() {}, addEventListener(event, fn) { this.listeners[event] = fn; },
    appendChild(child) { this.children.push(child); },
    set innerHTML(value) { this.children = []; },
    click() { this.listeners.click(); }
  };
}
for (const file of ['modules/games/games.js', 'games.html']) {
  for (const resetEvent of ['restart', 'size change']) {
    test(`${file}: ${resetEvent} cancels the old mismatch timer`, () => {
      const source = readFileSync(resolve(root, file), 'utf8');
      const memory = source.slice(source.indexOf('  const EMOJI='), source.indexOf('  /* ---------- Word Scramble'));
      const nodes = new Map(['mem-board','mem-status','mem-size','mem-moves','mem-pairs','mem-reset'].map(id => ['#'+id, element()]));
      nodes.get('#mem-size').value = '6';
      let nextId = 0;
      const timers = new Map();
      vm.runInNewContext(memory, {
        $: id => nodes.get(id), document: { createElement: element },
        setTimeout: fn => { timers.set(++nextId, fn); return nextId; },
        clearTimeout: id => timers.delete(id)
      });
      const board = nodes.get('#mem-board');
      function mismatch() {
        const first = board.children[0];
        const second = board.children.find(card => card.dataset.e !== first.dataset.e);
        first.click(); second.click();
        return [first, second];
      }
      mismatch();
      const oldTimer = [...timers.keys()][0];
      if (resetEvent === 'restart') nodes.get('#mem-reset').click();
      else { nodes.get('#mem-size').value = '8'; nodes.get('#mem-size').listeners.change(); }
      assert.equal(timers.has(oldTimer), false, 'old callback must be cancelled');
      const pair = mismatch();
      const third = board.children.find(card => !pair.includes(card));
      third.click();
      assert.equal(third.textContent, '?', 'new board stays locked during its mismatch');
      for (const fn of timers.values()) fn();
      third.click();
      assert.equal(third.textContent, third.dataset.e, 'board unlocks after its own delay');
    });
  }
}

test('shared routes resolve from nested pages and hosted subdirectories', () => {
  const source = readFileSync(resolve(root, 'js/components.js'), 'utf8');
  const pages = ['modules/index.html', 'modules/activities/activities.html', 'modules/games/games.html', 'modules/toy-shop/toy-shop.html'];
  for (const prefix of ['https://example.test/', 'https://example.test/PlayPal/']) {
    for (const page of pages) {
      const context = { window: {}, URL, document: { currentScript: { src: new URL('js/components.js', prefix).href } } };
      vm.runInNewContext(source, context);
      const pp = context.window.PlayPal;
      for (const key of ['home', 'toyShop', 'games', 'activities']) {
        const href = pp.url(key);
        assert.equal(href, new URL(pp.routes[key], prefix).href, `${page}: ${key}`);
        assert.ok(existsSync(resolve(root, pp.routes[key])), `Missing route ${key}`);
        assert.ok(pp.components.nav({ active: key }).includes(`href="${href}"`));
        assert.ok(pp.components.footer().includes(`href="${href}"`));
      }
      assert.equal(new URL(pp.url('games', 'game=memory-match')).search, '?game=memory-match');
      assert.equal(new URL(pp.url('activities', 'section=workshops')).hash, '#workshops');
      assert.equal(pp.url('basket'), '#');
      assert.equal(pp.url('parents'), '#');
    }
  }
});

test('local CSS assets resolve after the restructure', () => {
  for (const file of walk(root).filter(path => path.endsWith('.css'))) {
    const css = readFileSync(file, 'utf8');
    for (const [, url] of css.matchAll(/url\(["']?([^\s"')]+)["']?\)/g)) {
      if (/^(?:[a-z]+:|#|\/\/)/i.test(url)) continue;
      assert.ok(existsSync(resolve(dirname(file), decodeURIComponent(url))), `${file}: missing ${url}`);
    }
  }
});
