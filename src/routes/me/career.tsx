import { For, type JSX } from "solid-js";

import airbusLogo from "./img/airbus-logo.png";
import createLogo from "./img/create-logo.png";
import dataTrendsLogo from "./img/data-trends-logo.png";
import guideLogo from "./img/guide-logo.png";
import horbitoLogo from "./img/horbito-logo.jpg";
import milingualLogo from "./img/milingual.png";
import paperkitDocs from "./img/paperkit-docs.gif";
import paperkitWeb from "./img/paperkit-web.png";
import timedoser from "./img/timedoser.png";
import timedoserDesktop from "./img/timedoser-desktop.png";
import timedoserOptions from "./img/timedoser-options.jpg";
import timedoserReviews from "./img/timedoser-reviews.png";
import transparentLogo from "./img/transparent-logo.png";
import { Link } from "./shared";
import incubator from "./video/incubator.mp4";
import timedoser2 from "./video/timedoser-2.mp4";

type CareerEntry = {
  logo?: string;
  role?: string;
  at: string;
  from: string;
  to?: string;
  description: JSX.Element;
  details?: JSX.Element;
};

export const CAREER = (): CareerEntry[] => [
  {
    role: "Personal project",
    at: "TimeDoser 1.0",
    from: "2013",
    description: (
      <>
        <p>A time-tracking app for Chrome.</p>
        <p>
          Inspired by{" "}
          <Link href="https://en.wikipedia.org/wiki/Pomodoro_Technique">
            the Pomodoro Technique
          </Link>
          , I spent about a year working on{" "}
          <Link href="https://chromewebstore.google.com/detail/cmkneeaihlcdllananjlkmppnkdahdcc">
            this Chrome app
          </Link>{" "}
          with HTML, CSS and vanilla Javascript to learn web development. The
          app{" "}
          <Link href="https://chromewebstore.google.com/detail/timedoser/cmkneeaihlcdllananjlkmppnkdahdcc/reviews">
            was beloved by users
          </Link>{" "}
          for its minimalistic design, and was a success that kickstarted my
          career.
        </p>
        <div class="flex flex-wrap gap-4">
          <Details label="Images">
            <img src={timedoser} alt="The TimeDoser cover image" />
            <div class="flex flex-col sm:flex-row gap-8 items-start">
              <img
                class="min-w-0"
                src={timedoserDesktop}
                alt="TimeDoser running in a desktop"
              />
              <img
                class="min-w-0"
                src={timedoserOptions}
                alt="The TimeDoser options"
              />
            </div>
          </Details>
          <Details label="Reviews">
            <img src={timedoserReviews} alt="A sample of TimeDoser reviews" />
          </Details>
        </div>
      </>
    ),
  },
  {
    logo: dataTrendsLogo,
    role: "Frontend",
    at: "DataTrends",
    from: "September 2014",
    to: "September 2015",
    description: (
      <>
        <p>DataTrends was a B2B big data company at the time.</p>
        <List
          items={[
            "Built an internal classification tool for machine learning.",
            <>
              Built{" "}
              <Link href="https://web.archive.org/web/20161116104500/https://www.datatrends.es/datafeelings/">
                Data Feelings
              </Link>
              , a sentiment analysis tool, with a Laravel (PHP) backend.
            </>,
            <>
              Built a custom Material Design UI framework called{" "}
              <Link href="https://twitter.com/paperkit">Paperkit</Link>{" "}
              (discontinued).
            </>,
            "Worked with D3 on interactive graphs.",
          ]}
        />
        <div class="flex flex-wrap gap-4">
          <Details label="Paperkit framework">
            <img src={paperkitWeb} alt="The Paperkit website" />
            <img
              src={paperkitDocs}
              alt="A demo of the Paperkit docs"
              loading="lazy"
            />
          </Details>
        </div>
      </>
    ),
  },
  {
    at: "Limitless Project",
    role: "Founder",
    from: "October 2015",
    to: "February 2016",
    description: (
      <>
        <p>
          A friend and I partnered to work on an app for learning urban sports
          such as parkour and skateboarding.
        </p>
        <p>
          Even though it never took off, I learned a lot about UX prototyping,
          Apache Cordova, product management, and marketing.
        </p>
        <List
          items={[
            <>
              An early interactive UI prototype{" "}
              <Link href="https://daniguardiola.github.io/pencil-material-template/">
                is still online
              </Link>
              .
            </>,
            <>
              I created{" "}
              <Link href="https://github.com/DaniGuardiola/pencil-material-template">
                a popular output template
              </Link>{" "}
              (used in the item above) for a UI prototyping tool called{" "}
              <Link href="https://github.com/evolus/pencil">Pencil</Link>.
            </>,
            'The learning content was crowdsourced through a platform I built called "Incubator". It was built with Laravel (PHP).',
            "We managed to create a fair amount of hype in the parkour community and had a few pro athletes on board.",
          ]}
        />
        <div class="flex flex-wrap gap-4">
          <Details label="Incubator demo">
            <video src={incubator} controls={false} loop autoplay />
          </Details>
        </div>
      </>
    ),
  },
  {
    logo: milingualLogo,
    role: "Full-stack",
    at: "Milingual",
    from: "November 2015",
    to: "January 2016",
    description: (
      <>
        <p>
          Milingual was a platform for language exchange groups with teachers.
        </p>
        <List
          items={[
            "Maintained their legacy platform written in CodeIgniter (PHP).",
            "Built their new platform from scratch with a Django backend (Python) with help from a part-time Python developer.",
            "Prototyped the UI for a new mobile app.",
          ]}
        />
      </>
    ),
  },
  {
    role: "Personal project",
    at: "TimeDoser 2.0",
    from: "February 2016",
    to: "April 2016",
    description: (
      <>
        <p>
          A full redesign and rewrite of{" "}
          <Link href="https://chromewebstore.google.com/detail/cmkneeaihlcdllananjlkmppnkdahdcc">
            TimeDoser
          </Link>
          .
        </p>
        <p>
          Written from scratch using Polymer components and other new
          technologies. It was very well received by users.
        </p>
        <div class="flex flex-wrap gap-4">
          <Details label="Demo">
            <p>
              In this video, I showcased a fun little easter egg I created where
              the notification sounds for "work start" and "break start" would
              play successively, creating "music".
            </p>
            <p>Tip: turn the sound on.</p>
            <video src={timedoser2} controls loop autoplay muted />
          </Details>
        </div>
      </>
    ),
  },
  {
    logo: transparentLogo,
    role: "Backend",
    at: "Transparent Intelligence",
    from: "July 2016",
    to: "July 2017",
    description: (
      <>
        <p>
          <Link href="https://web.archive.org/web/20210813095727/https://seetransparent.com/en/">
            Transparent
          </Link>{" "}
          was a data intelligence startup for the vacation rental market.
        </p>
        <p>I was the first employee to join them.</p>
        <List
          items={[
            "Built data collecting (scraping) and processing systems.",
            "Reverse engineered many web platforms to extract data.",
            "Built graphic data visualization and manipulation tools.",
          ]}
        />
      </>
    ),
  },
  {
    at: "TimeDoser 3.0-alpha (abandoned)",
    from: "July 2017",
    to: "November 2017",
    description: (
      <>
        <p>
          A new iteration of TimeDoser, featuring a radically new design and
          advanced features like task management and integration with
          third-party tools.
        </p>
        <p>
          The main goal was to learn new technologies by building: React, Redux,
          MobX, Electron...
        </p>
        <p>
          It was left unfinished after life got complicated again. It fulfilled
          its main purpose though.
        </p>
      </>
    ),
  },
  {
    logo: horbitoLogo,
    at: "Horbito",
    role: "Backend",
    from: "November 2017",
    to: "April 2018",
    description: (
      <>
        <p>
          <Link href="https://web.archive.org/web/20180829000619/https://www.horbito.com/">
            Horbito
          </Link>{" "}
          was an in-browser cloud-based OS platform.
        </p>
        <List
          items={[
            "Reduced technical debt and modernized the platform's backend.",
            "Rebuilt part of the dev/sysops, including CI, container orchestration, automated QA, a CLI tool that automated most tasks for developers, a private NPM registry, and more.",
            "Audited the security and improved it by implementing a Vault (Hashicorp) based system in the AWS platform for production secrets, creating strict networking policies (like VPCs), and more.",
            "Helped improve code quality by introducing QA tooling, good practices and project templates, and giving weekly coding talks to employees.",
          ]}
        />
      </>
    ),
  },
  {
    role: "Personal project",
    at: "Coinwallet",
    from: "May 2018",
    to: "September 2018",
    description: (
      <>
        <p>
          Coinwallet was a non-profit project that I started, with the aim of
          building a Bitcoin lightweight wallet in React Native.
        </p>
        <p>
          The ultimate goal was to use it with a Bitcoin-based fork called
          Faircoin, a currency that was intended for fair trade and circular
          economy. The fork would have been called Fairwallet.
        </p>
        <p>
          The project was ultimately abandoned because there were controversies
          in the Faircoin community that I wanted to distance myself from. The
          Bitcoin wallet had reached a functional state by then, but was not
          released because it would've been irresponsible to do without proper
          security audits.
        </p>
      </>
    ),
  },
  {
    logo: airbusLogo,
    role: "Blockchain developer and architect",
    at: "Airbus (Sopra Steria)",
    from: "December 2018",
    to: "December 2020",
    description: (
      <>
        <p>
          At Sopra, I worked on a blockchain project for Airbus Defence and
          Space in which I designed and developed a smart-contract engine and
          helped shape and build a complete blockchain solution along with a
          talented team of developers.
        </p>
        <p>I led the development team, which consisted of 8 people.</p>
        <p>
          Unfortunately, the project was canceled after 2 years due to
          circumstances related to the Covid-19 pandemic, which affected Airbus
          and their investments in R+D.
        </p>
      </>
    ),
  },
  {
    logo: guideLogo,
    role: "Frontend and design system",
    at: "Guide",
    from: "May 2021",
    to: "February 2023",
    description: (
      <>
        <p>
          <Link href="https://www.guide.co/">Guide</Link> is an American startup
          offering an all-in-one platform for Recruiting Operations.
        </p>
        <List
          items={[
            <>
              Built Guide's full-featured design system,{" "}
              <Link href="https://atlas.guide.co/">Atlas</Link>.
            </>,
            <>
              Built Guide's{" "}
              <Link href="https://atlas.guide.co/?path=/story/components-contenteditor">
                rich text editor
              </Link>{" "}
              using Lexical (and{" "}
              <Link href="https://atlas.guide.co/?path=/story/components-texteditor">
                a previous, simpler version
              </Link>{" "}
              using Slate).
            </>,
            "Contributed core and structural UI features to the product, including the main app navigation interface (fully keyboard accessible), the page layouting system, and coordination of floating/modal elements like nested dialogs.",
            "Pushed for better accessibility in both the product and design system, both through code and education for my teammates.",
            "Contributed specific features to the product.",
          ]}
        />
      </>
    ),
  },
  {
    logo: createLogo,
    role: "Frontend and design systems",
    at: "Create",
    from: "May 2023",
    to: "October 2023",
    description: (
      <>
        <p>
          <Link href="https://www.create.xyz/">Create</Link> is a San Francisco
          based startup that helps founders launch apps faster using AI code
          generation and on demand, experienced engineers.
        </p>
        <p>
          My main contribution was coming up with a way to systematically create
          design systems for all customers, without sacrificing quality,
          customizability, or development speed.
        </p>
        <List
          items={[
            <>
              Created{" "}
              <Link href="https://github.com/Create-Inc/archetype">
                Archetype
              </Link>
              , a "design system system": tools for icons, tokens, components,
              documentation, packaging...
            </>,
            <>
              Created{" "}
              <Link href="https://archetype-ui-storybook.created.app/">
                Archetype UI
              </Link>
              , a design system starter with many styled components. Inspired by
              shadcn/ui.
            </>,
            "Built advanced tooling to introspect AI-generated code and provide feedback to the AI agent.",
            "Contributed features to the product, such as AI-generated placeholder images as part of generative UI.",
          ]}
        />
      </>
    ),
  },
  {
    role: "Personal project",
    at: "TimeDoser 3.0",
    from: "November 2023",
    to: "Present",
    description: "Stay tuned...",
  },
];

type DetailsProps = {
  label: string;
  children: JSX.Element;
};

function Details(props: DetailsProps) {
  return (
    <details class="p-2 mt-2 bg-black-invert/5 rounded">
      <summary class="select-none">{props.label}</summary>
      <div class="flex flex-col gap-8 text-base pt-4">{props.children}</div>
    </details>
  );
}

type ListProps = {
  items: JSX.Element[];
};

function List(props: ListProps) {
  return (
    <ul class="space-y-2">
      <For each={props.items}>
        {(item) => <li class="list-disc list-inside">{item}</li>}
      </For>
    </ul>
  );
}
