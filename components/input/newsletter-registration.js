import { useRef, useContext } from "react";

import classes from "./newsletter-registration.module.css";
import NotificationContext from "../../store/notification-context";

function NewsletterRegistration() {
  const notificationCtx = useContext(NotificationContext);
  const registerInput = useRef();

  function registrationHandler(event) {
    event.preventDefault();

    const email = registerInput.current.value;

    const reqBody = { email: email };

    notificationCtx.showNotification({
      title: "Signing up...",
      message: "Registering for newsletter",
      status: "pending",
    });

    fetch("/api/emailRegister", {
      method: "POST",
      body: JSON.stringify(reqBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        return response.json().then((data) => {
          throw new Error(data.message || "Somthing went wrong!");
        });
      })
      .then((data) => {
        notificationCtx.showNotification({
          title: "Success!",
          message: "Successfully registered for newsletter",
          status: "success",
        });
      })
      .catch((error) => {
        notificationCtx.showNotification({
          title: "Error!",
          message: error.message || "Somthing went wrong!",
          status: "error",
        });
      });
  }

  return (
    <section className={classes.newsletter}>
      <h2>Sign up to stay updated!</h2>
      <form onSubmit={registrationHandler}>
        <div className={classes.control}>
          <input
            type="email"
            id="email"
            placeholder="Your email"
            aria-label="Your email"
            ref={registerInput}
          />
          <button>Register</button>
        </div>
      </form>
    </section>
  );
}

export default NewsletterRegistration;
