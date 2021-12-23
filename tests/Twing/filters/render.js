import test from 'ava';
import cloneDeep from 'lodash.clonedeep';
import { setupTwingBefore, renderTemplateMacro } from '#twing-fixture';

test.before(setupTwingBefore);

const template = '{{ array|render }}';

const data = {
  array: {
    key1: { '#markup': '<p>value1</p>' },
    key2: { '#markup': '<p>value2</p>' },
  },
};

test(
  'should return the default Object.toString until render() is implemented',
  renderTemplateMacro,
  {
    template,
    data,
    expected: '[object Object]',
  },
);

test.failing('should convert a render array to a string', renderTemplateMacro, {
  template,
  data,
  expected: '<p>value1</p><p>value2</p>',
});

// Create an object with a custom toString method.
const custom = cloneDeep(data);
custom.toString = function () {
  return '<h2>Custom rendering:</h2>' + this.array.key1['#markup'];
};

test.failing(
  "should use the object's custom toString method if provided",
  renderTemplateMacro,
  {
    template,
    data: custom,
    expected: `${custom}`,
  },
);
