import test from 'ava';
import { setupTwigBefore, renderTemplateMacro } from '#twig-fixture';

test.before(setupTwigBefore);

const template = '{{ id|clean_id }}';

test('should return an empty string given invalid input', renderTemplateMacro, {
  template,
  data: { id: null },
  expected: '',
});

test(
  'should not strip letters, digits, and hyphens from the ID',
  renderTemplateMacro,
  {
    template,
    data: { id: 'abcdefghijklmnopqrstuvwxyz-0123456789' },
    expected: 'abcdefghijklmnopqrstuvwxyz-0123456789',
  },
);

test('should strip invalid characters from the ID', renderTemplateMacro, {
  template,
  data: { id: 'invalid,./:@\\^`{Üidentifier' },
  expected: 'invalididentifier',
});

test('should enforce Drupal coding standards', renderTemplateMacro, {
  template,
  data: { id: 'ID NAME_[1]' },
  expected: 'id-name-1',
});

test.failing('should make a repeated ID unique', async (t) => {
  const compiledTemplate = await t.context.twingEnvironment.createTemplate(
    template,
  );
  const data = { id: 'test-unique-id' };
  const expected = 'test-unique-id';
  let actual;

  actual = await compiledTemplate.render(data);
  t.is(actual, expected);

  actual = await compiledTemplate.render(data);
  t.not(actual, expected);
});
