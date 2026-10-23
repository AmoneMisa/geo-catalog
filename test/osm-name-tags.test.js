import assert from 'node:assert/strict';
import test from 'node:test';
import { isOsmNameTag } from '../src/osm-poi-import.js';

test('name tags that describe a name are not lexical aliases', () => {
  for (const key of ['name', 'name:uk', 'name:en', 'name:uk-Latn', 'alt_name', 'official_name']) {
    assert.equal(isOsmNameTag(key, ['alt_name', 'official_name']), true, key);
  }
  for (const key of [
    'name:etymology', 'name:etymology:wikidata', 'name:etymology:wikipedia',
    'name:left', 'name:right', 'name:signed', 'name:uk:pronunciation', 'highway', 'wikidata',
  ]) {
    assert.equal(isOsmNameTag(key, ['alt_name', 'official_name']), false, key);
  }
});
