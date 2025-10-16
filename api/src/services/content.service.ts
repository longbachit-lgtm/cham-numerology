import pool from '../db/connection';
import Mustache from 'mustache';

export interface ContentTemplate {
  scope: string;
  number: string;
  lang: string;
  key: string;
  body: string;
}

/**
 * Get content templates for a specific number and scope
 */
export async function getContentTemplates(
  number: string,
  scope: string = 'day',
  lang: string = 'vi'
): Promise<{ [key: string]: string }> {


  const result = await pool.query(
    `SELECT key, body FROM content_templates 
     WHERE number = $1  AND lang = $2`,
    [number, lang]
  );



  const content: { [key: string]: string } = {};
  result.rows.forEach(row => {
    content[row.key] = row.body;
  });


  return content;
}

/**
 * Render template with context
 */
export function renderTemplate(template: string, context: any): string {
  return Mustache.render(template, context);
}

/**
 * Get all content for a number (with fallback to English)
 */
export async function getNumberContent(
  number: string,
  scope: string = 'day',
  lang: string = 'vi',
  context: any = {}
): Promise<any> {
  let content = await getContentTemplates(number, scope, lang);

  // Fallback to English if Vietnamese content is missing
  if (Object.keys(content).length === 0 && lang !== 'en') {
    content = await getContentTemplates(number, scope, 'en');
  }

  // Render templates with context
  const rendered: any = {};
  for (const [key, template] of Object.entries(content)) {
    rendered[key] = renderTemplate(template, context);
  }

  return rendered;
}

/**
 * Build energy card for a specific day
 */
export async function buildEnergyCard(
  personalDay: string,
  scope: string = 'day',
  lang: string = 'vi',
  userContext: any = {}
): Promise<any> {
  const content = await getNumberContent(personalDay, scope, lang, userContext);

  return {
    number: personalDay,
    title: content.title || `Năng lượng con số ${personalDay}`,
    keywords: content.keywords || '1',
    challenges: content.challenges || '1',
    opportunities: content.opportunities || '1',
    quickTip: content.quick_tip || '',
    mistakesToAvoid: content.mistakes_to_avoid || '1',
    actions: {
      morning: content.actions_morning || '1',
      noon: content.actions_noon || '1',
      afternoon: content.actions_afternoon || '1',
      night: content.actions_night || '1',
    },
    affirmation: content.affirmation || '1',
    quote: content.quote || '1',
  };
}

/**
 * Insert or update content template
 */
export async function upsertContentTemplate(
  scope: string,
  number: string,
  lang: string,
  key: string,
  body: string
): Promise<void> {
  await pool.query(
    `INSERT INTO content_templates (scope, number, lang, key, body)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (scope, number, lang, key)
     DO UPDATE SET body = $5, updated_at = now()`,
    [scope, number, lang, key, body]
  );
}
