import { enhance } from "$app/forms";
import type { SubmitFunction } from "@sveltejs/kit";

export function foysTransform(solde: number) {
  let a = solde
    .toFixed(3)
    .split(",")
    .map((e) => parseInt(e));

  return Math.sign(solde) * (a[0] + a[1]);
}

export function oneshotform(formElement:HTMLFormElement){
  let clicked = false;
  formElement.addEventListener('submit',(e)=>{
    clicked = true;
    const submitter = e.submitter as HTMLButtonElement;
    submitter.disabled = true;
    setTimeout(()=>{
      submitter.disabled = false;
    },1000);
  });

  
}

export type WithRequiredOnly<T, K extends keyof T> = Partial<T> & Required<Pick<T, K>>;

export function oneShotEnhance(
  formElement: HTMLFormElement,
  submit?: SubmitFunction<Record<string, unknown> | undefined, Record<string, unknown> | undefined>
) {
  enhance(formElement, async ({ action, cancel, controller, formData, formElement, submitter }) => {
    const submitted = submitter as HTMLButtonElement;
    submitted.disabled = true; // Disable the button
    console.log("submitted", submitted);
    try {
      if (submit) {
        const r = await submit({ action, cancel, controller, formData, formElement, submitter });
        return r;
      }
    } finally {
      submitted.disabled = false; // Re-enable button after response
      console.log('yo')
    }

    return () => {};
  });
}


export function oneshotaction(e:HTMLButtonElement){
  e.addEventListener('click',(a)=>{
    setTimeout(()=>{
      e.disabled = true;
      setTimeout(()=>{
        e.disabled = false;
      },1000);
    },300)
  });
}

export function soundButton(e:HTMLButtonElement){
    let audio = new Audio('/sounds/button.mp3'); // Ensure the file is in the static directory
    audio.currentTime = 0; // Restart if already playing

    e.addEventListener('click',(a)=>{
      audio.play().catch((e) => console.error('Playback failed', e));
    });
}