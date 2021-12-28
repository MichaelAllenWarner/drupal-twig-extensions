import test from 'ava';
import DrupalAttribute from 'drupal-attribute';
import { Attribute } from '../lib/index.js';

test('should export drupal-attribute as Attribute', (t) => {
  t.deepEqual(Attribute, DrupalAttribute);
});