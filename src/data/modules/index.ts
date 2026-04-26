import type { Module } from '../../types/content';
import module01 from './module01';
import module02 from './module02';
import module03 from './module03';
import module04 from './module04';
import module05 from './module05';
import module06 from './module06';
import module07 from './module07';
import module08 from './module08';
import module09 from './module09';
import module10 from './module10';
import module11 from './module11';
import module12 from './module12';
import { MODULE_VARIETY } from './moduleVariety';

const BASE_MODULES: Module[] = [
  module01,
  module02,
  module03,
  module04,
  module05,
  module06,
  module07,
  module08,
  module09,
  module10,
  module11,
  module12,
];

export const MODULES: Module[] = BASE_MODULES.map((mod) => ({
  ...mod,
  ...MODULE_VARIETY[mod.id],
  coverImage: `/images/modules/module-${String(mod.id).padStart(2, '0')}.png`,
}));
