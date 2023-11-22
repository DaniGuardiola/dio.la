import clsx from "clsx";
import { createSignal, Show } from "solid-js";

async function subscribe(email: string) {
  try {
    const body = {
      "fields[email]": email,
      "ml-submit": "1",
      anticsrf: "true",
    };
    const response = await fetch(
      "https://assets.mailerlite.com/jsonp/701331/forms/105550814312924511/subscribe",
      {
        body: new URLSearchParams(body),
        method: "POST",
        mode: "cors",
        credentials: "omit",
      }
    );
    const result = await response.json();
    if (result.success) return true;
  } catch (e) {
    return false;
  }

  return false;
}

export function Subscribe() {
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<string>();
  const [success, setSuccess] = createSignal<string>();
  function clearState() {
    setError(undefined);
    setSuccess(undefined);
  }

  let emailInput: HTMLInputElement;
  async function onSubmit(event: SubmitEvent) {
    event.preventDefault();
    setLoading(true);
    const email = emailInput.value;
    const success = await subscribe(email);
    setLoading(false);
    if (success) {
      setSuccess(`${email} was subscribed successfully!`);
      emailInput.value = "";
    } else setError("Something went wrong. Please try again.");
  }

  return (
    <form
      class="space-y-2"
      action="https://assets.mailerlite.com/jsonp/701331/forms/105550814312924511/subscribe"
      data-code=""
      method="post"
      target="_blank"
      onSubmit={onSubmit}
    >
      <p class="text-dark-invert">Keep up with my stuff. Zero spam.</p>

      <div class="flex gap-4">
        <input
          disabled={loading()}
          class="grow shrink min-w-0 rounded text-dark px-4 focus:outline-2 focus:outline-accent ring ring-2 ring-inset ring-gray-200"
          ref={emailInput!}
          type="email"
          name="fields[email]"
          aria-label="Email"
          placeholder="Email"
          required
          autocomplete="email"
          onFocus={clearState}
          onInput={clearState}
        />
        <button
          disabled={loading()}
          class={clsx(
            "text-white py-2 px-4 rounded focus-ring",
            loading()
              ? "pointer-events-none bg-accent/80"
              : "bg-accent hover:bg-accent/90"
          )}
          type="submit"
        >
          {loading() ? "Subscribing..." : "Subscribe"}
        </button>
      </div>
      <Show when={error()}>
        <p class="text-sm text-red-500">{error()}</p>
      </Show>
      <Show when={success()}>
        <p class="text-sm text-accent">{success()}</p>
      </Show>

      <input type="hidden" name="ml-submit" value="1" />
      <input type="hidden" name="anticsrf" value="true" />
    </form>
  );
}
