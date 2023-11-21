import { createSignal, For } from "solid-js";

import { HeadMetadata } from "~/components/HeadMetadata";
import { CANONICAL_DOMAIN } from "~/data/config";
import { toggleTheme } from "~/utils/theme";

import { CAREER } from "./career";
import { Link } from "./shared";

function Heading() {
  return (
    <h1>
      <span class="font-bold text-5xl">Dani Guardiola</span>
      <br />
      <p class="text-lg text-subtle-invert font-bold">
        Software developer · 10+ years{" "}
      </p>
    </h1>
  );
}

type SkillProps = {
  children: string;
};

function Skill(props: SkillProps) {
  return <li class="list-disc list-inside">{props.children}</li>;
}

function Introduction() {
  return (
    <section aria-label="Introduction" class="flex flex-col gap-4 text-base">
      <p>Passionate about software and user interfaces. Nerd.</p>
      <div class="flex gap-2 flex-wrap">
        <details class="border-2 border-accent rounded p-2">
          <summary class="select-none">A brief history of me</summary>
          <div class="flex flex-col gap-8 text-base pt-4">
            <p>
              When I was 4, my family's rusty old computer (still running
              Windows 98) became my first machine. They probably expected me to
              play games, but I was more interested in messing with the poor
              computer. I would routinely delete system32 files until it stopped
              working, just to see what would happen. Not long after, I
              discovered webpages, and I'd spend hours creating random websites
              with the ancient{" "}
              <Link href="https://en.wikipedia.org/wiki/Microsoft_FrontPage">
                Microsoft FrontPage
              </Link>{" "}
              and an HTML book someone had gifted me for Christmas.
            </p>
            <p>
              A few years later, when I was around 15, I learned how to code and
              built my first app,{" "}
              <Link href="https://chromewebstore.google.com/detail/timedoser/cmkneeaihlcdllananjlkmppnkdahdcc">
                TimeDoser
              </Link>
              , which reached over 59k+ installs, 23k+ weekly active users, and
              a high user rating. It also garnered media attention, being
              featured on a few websites, including{" "}
              <Link href="https://lifehacker.com/timedoser-is-a-pomodoro-timer-for-chrome-1639626091">
                Lifehacker
              </Link>{" "}
              and{" "}
              <Link href="https://www.omgchrome.com/pomodoro-app-for-google-chrome/">
                OMG! Chrome!
              </Link>
              .
            </p>
            <p>
              I soon caught the attention of a tech company, which hired me at
              17 and kickstarted my professional career as a fulltime software
              developer. Ever since, I've worked with companies (mostly
              startups), built a few personal projects, and contributed to
              open-source.
            </p>
            <p>
              For the past few years, I've worked with Silicon Valley startups,
              specializing in front-end, design systems, rich text editors and
              tooling. While I like building end products, there is something I
              love even more: solving the complex bits (a.k.a. library code) to
              make it simpler for others to build. I enjoy a good challenge.
            </p>
          </div>
        </details>
        <details class="border-2 border-accent rounded p-2">
          <summary class="select-none">Skills and knowledge</summary>
          <div class="flex flex-col gap-8 text-base pt-4">
            <p>
              I don't believe in listing every single technology/programming
              language I've ever learned. As I build more stuff, the list gets
              longer, harder to parse, and less meaningful.
            </p>
            <p>
              Instead, here's a brief list with some items I have deep knowledge
              about. Feel free to reach out with a specific role/project for
              more relevant details.
            </p>
            <ul>
              <Skill>Web platform: HTML, CSS, web APIs</Skill>
              <Skill>JavaScript and TypeScript (certified wizard™)</Skill>
              <Skill>React and Solid</Skill>
              <Skill>ASTs, tooling, compilers, code generation...</Skill>
            </ul>
          </div>
        </details>
      </div>
      <p>
        I blog at <Link href="https://dio.la">dio.la</Link>, tweet at{" "}
        <Link href="https://twitter.com/daniguardio_la">@daniguardio_la</Link>,
        and push code at{" "}
        <Link href="https://github.com/DaniGuardiola">
          github.com/DaniGuardiola
        </Link>
        .
      </p>
      <p>
        Reach me at{" "}
        <Link href="mailto:hi@daniguardio.la">hi@daniguardio.la</Link> or
        schedule a call through{" "}
        <Link href="https://cal.com/dio.la/30min">cal.com/dio.la</Link>.
      </p>
    </section>
  );
}

function Career() {
  const [recentFirst, setRecentFirst] = createSignal(true);
  return (
    <section class="flex flex-col gap-4 text-dark-invert">
      <div class="flex items-baseline justify-between gap-4">
        <h1 class="text-2xl font-bold text-accent">Career</h1>
        <span class="text-subtle-invert text-sm">
          Showing {recentFirst() ? "most recent first" : "chronologically"} -{" "}
          <button
            class="underline hover:decoration-2 hover:text-dark-invert"
            onClick={() => setRecentFirst((value) => !value)}
          >
            change
          </button>
        </span>
      </div>
      <div class="py-2 flex flex-col gap-8">
        <For each={recentFirst() ? CAREER().toReversed() : CAREER()}>
          {(entry, index) => (
            <>
              {index() !== 0 && <hr class="border-black-invert/20" />}
              <article class="flex flex-col gap-6">
                {entry.logo && (
                  <img src={entry.logo} class="max-h-12 rounded self-start" />
                )}
                <div>
                  <h1>
                    <span class="font-bold">{entry.at}</span>
                    {entry.role && <span> · {entry.role}</span>}
                  </h1>
                  <p class="text-sm text-subtle-invert font-bold uppercase">
                    {entry.from}
                    {entry.to && ` - ${entry.to}`}
                  </p>
                </div>
                <div class="flex flex-col gap-4">{entry.description}</div>
              </article>
            </>
          )}
        </For>
      </div>
    </section>
  );
}

function Notes() {
  return (
    <section class="flex flex-col gap-2">
      <h1 class="text-2xl font-bold text-accent">Notes</h1>
      <h2 class="font-bold text-dark-invert mt-6">Languages</h2>
      <p>
        I am a native Spanish speaker, and proficient at English, having worked
        with American companies exclusively for the past three years. I also
        write and tweet in English.
      </p>
      <h2 class="font-bold text-dark-invert mt-6">Remote work</h2>
      <p>
        I've spent about half of my career working remotely, and I love it. I've
        gotten good at working autonomously, managing my time, and communicating
        asynchronously - even across multiple timezones.
      </p>
      <h2 class="font-bold text-dark-invert mt-6">Freelance work</h2>
      <p>
        Throughout my career, I've worked on multiple freelance projects. I've
        created from simple static pages to full-fledged applications. Other
        examples include{" "}
        <Link href="https://github.com/DaniGuardiola/telegram-welcome-bot">
          a Telegram bot
        </Link>
        , some server-scripting tasks, and web-scraping tools.
      </p>
      <h2 class="font-bold text-dark-invert mt-6">
        Free and open source software
      </h2>
      <p>
        I am an advocate for free (as in freedom) software, and I try to
        contribute to the community whenever possible. Most of my side projects
        are open-source, and I donate regularly. Notably, I'm a top donor to the{" "}
        <Link href="https://opencollective.com/ariakit">Ariakit</Link> project:
        $600 donated personally to date, and $1500 donated by my previous
        employer at my request.
      </p>
      <h2 class="font-bold text-dark-invert mt-6">Fun facts</h2>
      <ul class="list-disc list-inside space-y-2">
        <li>
          My team was a runner-up at the 2017 European Techcrunch hackathon. The
          project was a conditional basic income financed by distributed crypto
          mining in websites.{" "}
          <Link href="https://devpost.com/software/altrui-st">
            Here's the pitch
          </Link>
          .
        </li>
        <li>
          I built this resume with Solid and Tailwind CSS. You can read the
          source{" "}
          <Link href="https://github.com/DaniGuardiola/dio.la/blob/main/src/routes/me/index.tsx">
            here
          </Link>
          .
        </li>
        <li>
          The <Link href="https://notmylinkedin.com/">notmylinkedin.com</Link>{" "}
          domain redirects to this page. It might seem that I bought it just for
          the memes, but it is actually part of an exploit I've used in
          vulnerable job search websites just so that I could avoid creating a
          Linkedin account.{" "}
          <Link href="https://dio.la/article/unlinked">
            Here's the full story
          </Link>
          .
        </li>
      </ul>
    </section>
  );
}

export default function Me() {
  return (
    <div class="main-container px-4 py-16 sm:py-32 flex flex-col gap-8 text-dark-invert">
      <HeadMetadata
        url={`https://${CANONICAL_DOMAIN}/me`}
        title={"Not Dani Guardiola's Linkedin"}
        description={"About me & career"}
        image="/open-graph/hacking-linkedin.png"
        type="website"
      />
      <Heading />
      <Introduction />
      <Career />
      <Notes />
      <button
        class="mt-16 self-start text-subtle-invert underline hover:decoration-2 hover:text-dark-invert"
        onClick={toggleTheme}
      >
        Switch theme
      </button>
    </div>
  );
}
