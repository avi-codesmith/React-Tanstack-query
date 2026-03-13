import { Link, Outlet, useNavigate, useParams } from "react-router-dom";

import Header from "../Header.jsx";
import { useQuery, useMutation } from "@tanstack/react-query";
import { deleteEvent, fetchEvent, queryClient } from "../../util/http.js";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import { useState } from "react";
import Modal from "../UI/Modal.jsx";

export default function EventDetails() {
  const [showModal, setShowModel] = useState(false);
  const navigate = useNavigate();
  const params = useParams("id");
  const id = params.id;

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["events", { id }],
    queryFn: ({ signal }) => fetchEvent({ id, signal }),
  });

  const {
    mutate,
    isError: isdeleteError,
    isPending: isdeletePending,
    error: deleteError,
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

  function hanldeDelete() {
    mutate({ id });
  }

  function handleShow() {
    setShowModel(true);
  }

  function handleCancel() {
    setShowModel(false);
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
        {showModal && (
          <Modal onClose={handleCancel}>
            <h2>Are You Sure?</h2>
            <p>
              Do you really want to delete this item? this process can not be
              undone!
            </p>
            <div className="form-actions">
              {isdeletePending && <p>Deleting...please wait</p>}
              {!isdeletePending && (
                <>
                  <button onClick={handleCancel} className="button-text">
                    Cancel
                  </button>
                  <button onClick={hanldeDelete} className="button">
                    Delete
                  </button>
                </>
              )}
              {isdeleteError && (
                <ErrorBlock
                  title="Ops! something went wrong"
                  message={deleteError.info?.message}
                />
              )}
            </div>
          </Modal>
        )}
        <header>
          <h1>{data && data.title}</h1>
          <nav>
            <button onClick={handleShow}>Delete</button>
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
