import { GOV_CODE_MAP } from "./govCodeRev";

//@ts-check
/// <reference path="../types.d.ts" />

const ZERO = '00000000';

/**
 * @param {string} govCode
 * @returns {string[]}
 */
export function expandGovCode(govCode) {
  if (!govCode) return;
  if (typeof govCode !== 'string')
    govCode = String(govCode);

  const govCodes = [];
  for (let i = 0; i <= 6; i++) {
    const code = `${govCode.slice(0, i)}${ZERO.slice(0, 6 - i)}`;
    if (Object.prototype.hasOwnProperty.call(GOV_CODE_MAP, code)) {
      if (govCodes.length > 0 && govCodes[govCodes.length - 1] === code)
        continue; // 防止重复
      govCodes.push(code);
    }
  }
  return govCodes;
}
