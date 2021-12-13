import Head from "next/head";
import NewsletterRegistration from "../components/input/newsletter-registration";

import EventList from "../components/event-list";
import { getFeaturedEvents } from "../helpers/api-utils";
import EventSearch from "../components/event-search";
import { useRouter } from "next/router";

function HomePage(props) {
  const { events } = props;
  const router = useRouter();

  function findEventHandler(year, month) {
    const fullpath = `/events/${year}/${month}`;

    router.push(fullpath);
  }

  return (
    <div>
      <Head>
        <title>NextJs Events</title>
        <meta
          name="description"
          content="You can find a lot of events here..."
        />
      </Head>
      <NewsletterRegistration />
      <EventSearch onSearch={findEventHandler} />
      <EventList items={events} />
    </div>
  );
}

export async function getStaticProps() {
  const featuredEvents = await getFeaturedEvents();

  return {
    props: {
      events: featuredEvents,
    },
    revalidate: 600,
  };
}

export default HomePage;
