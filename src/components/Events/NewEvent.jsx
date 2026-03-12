import { Link, useNavigate } from "react-router-dom";

import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import { useMutation } from "@tanstack/react-query";
import { createNewEvent, queryClient } from "../../util/http.js";

export default function NewEvent() {
  const navigate = useNavigate();

  const { mutate, isPending, isError, error } = useMutation({
    // mutationKey: ["formEvent"], We can though we don't wanna save data on server or backend hence we dont need any key here, just we're positing data.
    mutationFn: createNewEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event"] });
      navigate("/events");
    },
  });

  function handleSubmit(formData) {
    mutate({ event: formData });
    console.log(formData);
  }

  return (
    <Modal onClose={() => navigate("../")}>
      <EventForm onSubmit={handleSubmit}>
        {isPending ? (
          "Submitting..."
        ) : (
          <>
            <Link to="../" className="button-text">
              Cancel
            </Link>
            <button type="submit" className="button">
              Create
            </button>
          </>
        )}
      </EventForm>
      {isError && (
        <ErrorBlock
          title="Failed to Send"
          message={
            error.info?.message || "Please check your inputs or try again!"
          }
        />
      )}
    </Modal>
  );
}
