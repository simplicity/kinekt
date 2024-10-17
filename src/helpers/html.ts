import z from "zod";

const _html = z.string();

export function html() {
  return _html;
}
