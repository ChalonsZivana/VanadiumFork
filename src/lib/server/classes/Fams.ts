import prisma from "$lib/prisma";
import type { fams } from "@prisma/client";
import { HasMoney } from "../BasicClasses";

export class Fams extends HasMoney {
  constructor(nums: number) {
    nums = nums % 100;
    if (nums > 50) nums = 100 - nums;
    if (nums == 0) nums = 50;
    // bifam's
    if (nums == 9) nums = 8;
    super("fams", nums);
  }

  async fams() {
    return (await prisma.fams.findFirst({ where: { nums: this.ID } })) as fams;
  }
}
