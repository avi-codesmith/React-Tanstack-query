import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

import Header from "../Header.jsx";
import Modal from "../UI/Modal.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";

import { useQuery, useMutation } from "@tanstack/react-query";
import { deleteEvent, fetchEvent, queryClient } from "../../util/http.js";

export default function EventDetails() {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id;

  const [showModal, setShowModal] = useState(false);

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
        refetchType: "none",
      });
      navigate("/events");
    },
  });

  function handleStartDelete() {
    setShowModal(true);
  }

  function handleCancel() {
    setShowModal(false);
  }

  function handleConfirmDelete() {
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
          <h1>{data.title}</h1>
          <nav>
            <button onClick={handleStartDelete}>Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>

        <div id="event-details-content">
          <img src={`http://localhost:3000/${data.image}`} alt={data.title} />

          <div id="event-details-info">
            <div>
              <p id="event-details-location">{data.location}</p>
              <time dateTime={data.time}>{data.time}</time>
            </div>

            <p id="event-details-description">{data.description}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {showModal && (
        <Modal onClose={handleCancel}>
          <h2>Are you sure?</h2>
          <p>Do you really want to delete this event?</p>

          <div className="form-actions">
            <button onClick={handleCancel} className="button-text">
              Cancel
            </button>

            <button onClick={handleConfirmDelete} className="button">
              {deletePending ? "Deleting..." : "Yes Delete"}
            </button>
          </div>

          {deleteError && (
            <ErrorBlock
              title="Failed to delete event"
              message="Please try again later."
            />
          )}
        </Modal>
      )}

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
