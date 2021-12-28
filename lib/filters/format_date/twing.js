import { newTwingFilter } from '../../helpers/twing.js';
import config from '../../config/twing.js';
import { name, options, acceptedArguments, formatDate } from './definition.js';

export function callable(timestamp, type, format, timezone, langcode) {
  return formatDate(config, timestamp, type, format, timezone, langcode);
}

export default newTwingFilter(name, callable, options, acceptedArguments);