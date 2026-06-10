import type { NormalizedInput } from "../../optimizer/types";

export type TestCase = {
  id: string;
  name: string;
  input: NormalizedInput;
};