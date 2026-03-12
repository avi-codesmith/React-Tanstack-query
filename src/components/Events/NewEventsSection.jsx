import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import EventItem from "./EventItem.jsx";
import { useQuery } from "@tanstack/react-query";
import { fetchEvents } from "../../util/http.js";

export default function NewEventsSection() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["event"],
    queryFn: fetchEvents,
    staleTime: 5000, // it is the time by which we can take control over the refetching of the data whenever the window refocus or the component remount, [it is 0 initially]
    // gcTime: 1000, // it is initially 50000 (5min)
    // we can add to get control over the GC time.
    // gc time: if the component isnt in using the cache data will deleted after 5 min
  });

  let content;

  if (isLoading) {
    content = <LoadingIndicator />;
  }

  if (isError) {
    content = (
      <ErrorBlock
        title="An error occurred"
        message={error.info?.message || "Ops! Can not fetch events!"}
      />
    );
  }

  if (data) {
    content = (
      <ul className="events-list">
        {data.map((event) => (
          <li key={event.id}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="content-section" id="new-events-section">
      <header>
        <h2>Recently added events</h2>
      </header>
      {content}
    </section>
  );
}
