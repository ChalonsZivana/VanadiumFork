import { writable } from "svelte/store";
import { z } from "zod";

type PopupData = { success: boolean; message: string };

export const popupStore = writable<PopupData[]>([]);

export function triggerPopupForm(form: object) {
  const zodObject = z.object({ success: z.boolean(), message: z.string() });
  const d = zodObject.safeParse(form);
  if (d.success) {
    return popupStore.set([d.data]);
  }

  const zodObjectArray = z.array(zodObject);
  const dArray = zodObjectArray.safeParse(form);
  if(!dArray.success) return;
  popupStore.set(dArray.data)
}
