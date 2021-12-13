import { Fragment, useState, useEffect } from "react";
import useSWR from "swr";
import { useRouter } from "next/router";
import Head from "next/head";

// import { getFilteredEvents } from "../../helpers/api-utils";
import EventList from "../../components/event-list";
import ResultsTitle from "../../components/results-title";
import ErrorAlert from "../../components/ui/error-alert";
import Button from "../../components/ui/button";

function FilteredEventsPage(props) {
  const [loadedEvents, setLoadedEvents] = useState();
  const router = useRouter();

  const filterData = router.query.slug;

  const url =
    "https://nextjs-course-prerender-default-rtdb.firebaseio.com/events.json";

  const fetcher = async () =>
    await fetch(url).then((response) => response.json());

  const { data, error } = useSWR(url, fetcher);

  useEffect(() => {
    if (data) {
      const events = [];

      for (const key in data) {
        events.push({
          id: key,
          ...data[key],
        });
      }

      setLoadedEvents(events);
    }
  }, [data]);

  let filteredHead = (
    <Head>
      <title>Filtered Events</title>
      <meta name="description" content="All events for filter data" />
    </Head>
  );

  if (!loadedEvents) {
    return (
      <Fragment>
        {filteredHead}
        <p className="center">Loading...</p>
      </Fragment>
    );
  }

  const filteredYear = filterData[0];
  const filteredMonth = filterData[1];

  const numYear = +filteredYear;
  const numMonth = +filteredMonth;

  filteredHead = (
    <Head>
      <title>Filtered Events</title>
      <meta
        name="description"
        content={`All events for ${numYear}/${numMonth}`}
      />
    </Head>
  );

  if (
    isNaN(numYear) ||
    isNaN(numMonth) ||
    numYear > 2022 ||
    numYear < 2021 ||
    numMonth > 12 ||
    numMonth < 1 ||
    error
  ) {
    return (
      <Fragment>
        {filteredHead}
        <ErrorAlert>
          <p>Invalid filter. please adjust your values!</p>
        </ErrorAlert>
        <div className="center">
          <Button link="/events">Show All Events</Button>
        </div>
      </Fragment>
    );
  }

  const filteredEvents = loadedEvents.filter((event) => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getFullYear() === numYear &&
      eventDate.getMonth() === numMonth - 1
    );
  });

  // const filteredEvents = props.events;

  if (!filteredEvents || filteredEvents.length === 0) {
    return (
      <Fragment>
        {filteredHead}
        <ErrorAlert>
          <p>No events found for choosen filter</p>
        </ErrorAlert>
        <div className="center">
          <Button link="/events">Show All Events</Button>
        </div>
      </Fragment>
    );
  }

  const date = new Date(numYear, numMonth - 1);

  return (
    <Fragment>
      <Head>
        <title>Filtered Events</title>
        <meta
          name="description"
          content={`All events for ${numYear}/${numMonth}`}
        />
      </Head>
      <ResultsTitle date={date} />
      <EventList items={filteredEvents} />
    </Fragment>
  );
}

// export async function getServerSideProps(context) {
//   const { params } = context;

//   const filterData = params.slug;

//   const filteredYear = filterData[0];
//   const filteredMonth = filterData[1];

//   const numYear = +filteredYear;
//   const numMonth = +filteredMonth;

//   if (
//     isNaN(numYear) ||
//     isNaN(numMonth) ||
//     numYear > 2022 ||
//     numYear < 2021 ||
//     numMonth > 12 ||
//     numMonth < 1
//   ) {
//     return {
//       props: {
//         hasError: true,
//       },
//     };
//   }

//   const filteredEvents = await getFilteredEvents({
//     year: numYear,
//     month: numMonth,
//   });

//   return {
//     props: {
//       events: filteredEvents,
//       filterData: filterData,
//       date: {
//         year: numYear,
//         month: numMonth,
//       },
//     },
//   };
// }

export default FilteredEventsPage;
