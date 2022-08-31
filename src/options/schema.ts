import { z } from 'zod';
import { PageOrientation } from './optionsConfig';

export const optionsSchema = z.object({
  page: z.object({
    orientation: z.nativeEnum(PageOrientation),
    size: z.object({
      height: z.number().positive(),
      width: z.number().positive(),
    }),
    margins: z.object({
      top: z.number().positive(),
      right: z.number().positive(),
      bottom: z.number().positive(),
      left: z.number().positive(),
    }),
    number: z.boolean(),
  }),
  font: z.object({
    baseSize: z.number().positive(),
    baseFontFamily: z.string(),
    headersFontFamily: z.string(),
    headersSizes: z.object({
      h1: z.number().positive(),
      h2: z.number().positive(),
      h3: z.number().positive(),
      h4: z.number().positive(),
    }),
  }),
  verticalSpaces: z.number().nonnegative(),
  table: z.object({
    cellMargins: z.object({
      left: z.number().positive(),
      right: z.number().positive(),
      top: z.number().positive(),
      bottom: z.number().positive(),
    }),
  }),
});

export const userOptionsSchema = optionsSchema.deepPartial().strict();
