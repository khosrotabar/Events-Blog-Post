import Head from "next/head";

import { getAllEvents } from "../../helpers/api-utils";
import EventList from "../../components/event-list";
import EventSearch from "../../components/event-search";
import { useRouter } from "next/router";

function AllEventsPage(props) {
  const { allEvents } = props;
  const events = allEvents;
  const router = useRouter();

  function findEventHandler(year, month) {
    const fullpath = `/events/${year}/${month}`;

    router.push(fullpath);
  }

  return (
    <div>
      <Head>
        <title>All Events</title>
        <meta
          name="description"
          content="You can find a lot of events here..."
        />
      </Head>
      <EventSearch onSearch={findEventHandler} />
      <EventList items={events} />
    </div>
  );
}

export async function getStaticProps() {
  const events = await getAllEvents();
  return {
    props: {
      allEvents: events,
    },
  };
}

export default AllEventsPage;
