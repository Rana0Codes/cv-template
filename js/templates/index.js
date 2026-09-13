/**
 * Master Template Registry for CV Template.
 * Single source of truth for all 5 professional templates, their metadata,
 * and their renderers. Zero duplicate lists or disconnected labels.
 */

import { template1 } from './template-1.js';
import { template2 } from './template-2.js';
import { template3 } from './template-3.js';
import { template4 } from './template-4.js';
import { template5 } from './template-5.js';

export const TEMPLATES = {
  'template-1': template1,
  'template-2': template2,
  'template-3': template3,
  'template-4': template4,
  'template-5': template5
};

export const TEMPLATE_LIST = [
  template1,
  template2,
  template3,
  template4,
  template5
];

export function getTemplate(templateId) {
  return TEMPLATES[templateId] || template1;
}
