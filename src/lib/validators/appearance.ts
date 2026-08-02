import { z } from "zod";

export const appearanceSchema = z.object({
  active_theme: z.string().optional(),
  theme_school_profile: z.object({
    hero: z.object({
      title: z.string().optional(),
      subtitle: z.string().optional(),
      backgroundImage: z.string().nullable().optional(),
    }).optional(),
    visionMission: z.object({
      vision: z.string().optional(),
      missions: z.array(z.string()).optional(),
    }).optional(),
    principal: z.object({
      name: z.string().optional(),
      message: z.string().optional(),
      image: z.string().nullable().optional(),
    }).optional(),
    stats: z.object({
      students: z.number().optional(),
      teachers: z.number().optional(),
      awards: z.number().optional(),
    }).optional(),
    cta: z.object({
      title: z.string().optional(),
      subtitle: z.string().optional(),
      buttonText: z.string().optional(),
      buttonUrl: z.string().optional(),
    }).optional(),
  }).optional(),
  logo: z.string().nullable().optional(),
  favicon: z.string().nullable().optional(),
  primary_color: z.string().optional(),
  secondary_color: z.string().optional(),
  font_family: z.string().optional(),
  header_style: z.string().optional(),
  sidebar_position: z.string().optional(),
  footer_text: z.string().optional(),
  custom_css: z.string().optional(),
  custom_head: z.string().optional(),
  custom_footer: z.string().optional(),
});

export type AppearanceInput = z.infer<typeof appearanceSchema>;
