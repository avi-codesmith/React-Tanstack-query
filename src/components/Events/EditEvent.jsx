import { Link, useNavigate, useParams } from "react-router-dom";

import Modal from "../UI/Modal.jsx";
import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import EventForm from "./EventForm.jsx";
import { fetchEvent, updateEvent } from "../../util/http.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import { queryClient } from "../../util/http.js";

export default function EditEvent() {
  const params = useParams();
  const id = params.id;

  const navigate = useNavigate();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["event", { id }],
    queryFn: ({ signal }) => fetchEvent({ signal, id }),
  });

  const { mutate } = useMutation({
    mutationFn: updateEvent,
  });

  function handleSubmit(event) {
    mutate({ id, event });
    navigate("../");
  }

  function handleClose() {
    navigate("../");
  }

  let content;

  if (isPending) {
    content = (
      <div className="center">
        <LoadingIndicator />
      </div>
    );
  }

  if (isError) {
    content = (
      <>
        <ErrorBlock
          title="An error Occured!"
          message={
            error.info?.message ||
            "Ops! can not edit event, please try again later"
          }
        />
        <div className="formActions">
          <Link to={"../"} className="button">
            Okay!
          </Link>
        </div>
      </>
    );
  }

  if (data) {
    content = (
      <EventForm inputData={data} onSubmit={handleSubmit}>
        <Link to="../" className="button-text">
          Cancel
        </Link>
        <button type="submit" className="button">
          Update
        </button>
      </EventForm>
    );
  }

  return <Modal onClose={handleClose}>{content}</Modal>;
}
