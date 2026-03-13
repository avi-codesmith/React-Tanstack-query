import { Link, Outlet, useNavigate, useParams } from "react-router-dom";

import Header from "../Header.jsx";
import { useQuery, useMutation } from "@tanstack/react-query";
import { deleteEvent, fetchEvent, queryClient } from "../../util/http.js";
import ErrorBlock from "../UI/ErrorBlock.jsx";

export default function EventDetails() {
  const navigate = useNavigate();
  const params = useParams("id");
  const id = params.id;

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["events", { id }],
    queryFn: ({ signal }) => fetchEvent({ id, signal }),
  });

  const {
    mutate,
    isError: deleteError,
    isPending: deletePending,
  } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["events"],
      });
      navigate("/events");
    },
  });

  function hanldeDelete() {
    mutate({ id });
  }

  let content;

  if (isPending) {
    content = (
      <div id="event-detail-content" className="center">
        <p>Fetching event data...</p>
      </div>
    );
  }

  if (isError) {
    content = (
      <div id="event-detail-content" className="center">
        <ErrorBlock
          title="Ops! can't fetch event detail"
          message={error.info?.message}
        />
      </div>
    );
  }

  if (data) {
    content = (
      <>
        <header>
          <h1>{data && data.title}</h1>
          <nav>
            <button onClick={hanldeDelete}>
              {deletePending
                ? "Deleting..."
                : deleteError
                  ? "Ops! Can't delete event"
                  : "Delete"}
            </button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
        <div id="event-details-content">
          <img src={`http://localhost:3000/${data.image}`} alt={data.title} />
          <div id="event-details-info">
            <div>
              <p id="event-details-location">{data.location}</p>
              <time dateTime={`Todo-DateT$Todo-Time`}>{data.time}</time>
            </div>
            <p id="event-details-description">{data.description}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">{content}</article>
    </>
  );
}
