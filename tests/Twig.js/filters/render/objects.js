import test from 'ava';
import cloneDeep from 'lodash.clonedeep';
import { setupTwigBefore, renderTemplateMacro } from '#twig-fixture';

test.before(setupTwigBefore);

const template = '{{ array|render }}';

const data = {
  array: {
    key1: { '#markup': '<p>value1</p>' },
    key2: { '#markup': '<p>value2</p>' },
  },
};

test('should return a string', renderTemplateMacro, {
  // The first key of a string is 0.
  template: '{{ array|render|keys|first }}',
  data,
  expected: '0',
});

// Create an object with a custom toString method.
const custom = cloneDeep(data.array);
custom.toString = function () {
  return '<h2>Custom rendering:</h2>' + this.key1['#markup'];
};

test(
  "should use the object's custom toString method if provided",
  renderTemplateMacro,
  {
    template,
    data: {
      array: custom,
    },
    expected: custom.toString(),
  },
);

test(
  "should use the object's custom toRenderable method if provided",
  renderTemplateMacro,
  {
    template,
    data: {
      array: {
        ...custom,
        toRenderable: function () {
          return 'to Renderable';
        },
        __toString: function () {
          return '__to String';
        },
      },
    },
    expected: 'to Renderable',
  },
);

test(
  "should use the object's custom __toString method if provided",
  renderTemplateMacro,
  {
    template,
    data: {
      array: {
        ...custom,
        __toString: function () {
          return '__to String';
        },
      },
    },
    expected: '__to String',
  },
);

test('should print the #markup of a pre-rendered array', renderTemplateMacro, {
  template,
  data: {
    array: {
      '#printed': true,
      '#markup': 'The #markup string',
    },
  },
  expected: 'The #markup string',
});

test(
  'should return the default Object.toString until render() is implemented',
  renderTemplateMacro,
  {
    template,
    data,
    expected: '[object Object]',
  },
);

// test('should convert a render array to a string', renderTemplateMacro, {
//   template,
//   data,
//   expected: '<p>value1</p><p>value2</p>',
// });
