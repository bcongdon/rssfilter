import { Regex as RegexRS } from 'regex-rs';

export default async function Regex(regex: string): Promise<RegexRS> {
  let regexModule = await import('regex-rs');
  let regexObj = new regexModule.Regex(regex);
  return regexObj;
}
