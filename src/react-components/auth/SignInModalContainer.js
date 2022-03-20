import React, { useCallback, useReducer, useContext, useEffect } from "react";
import configs from "../../utils/configs";
import { AuthContext } from "./AuthContext";
import { SignInModal, SignInStep, WaitForVerification, SubmitEmail } from "./SignInModal";

const SignInAction = {
  submitEmail: "submitEmail",
  verificationReceived: "verificationReceived",
  cancel: "cancel"
};

const initialSignInState = {
  step: SignInStep.submit,
  email: "",
  authLink: ""
};

function loginReducer(state, action) {
  switch (action.type) {
    case SignInAction.submitEmail:
      return { step: SignInStep.waitForVerification, email: action.email };
    case SignInAction.verificationReceived:
      return { ...state, step: SignInStep.complete, authLink: action.authLink };
    case SignInAction.cancel:
      return { ...state, step: SignInStep.submit };
  }
}

function useSignIn() {
  const auth = useContext(AuthContext);
  const [state, dispatch] = useReducer(loginReducer, initialSignInState);

  const submitEmail = useCallback(
    email => {
      auth.signIn(email).then(authLink => {
        dispatch({ type: SignInAction.verificationReceived, authLink });
      });
      dispatch({ type: SignInAction.submitEmail, email });
    },
    [auth]
  );

  const cancel = useCallback(() => {
    dispatch({ type: SignInAction.cancel });
  }, []);

  return {
    step: state.step,
    email: state.email,
    authLink: state.authLink,
    submitEmail,
    cancel
  };
}

export function SignInModalContainer() {
  const qs = new URLSearchParams(location.search);
  const { step, submitEmail, cancel, email, authLink } = useSignIn();
  // const redirectUrl = qs.get("sign_in_destination_url") || "/";

  useEffect(
    () => {
      if (authLink) window.location = authLink;
    },
    [authLink]
  );

  return (
    <SignInModal disableFullscreen>
      {step === SignInStep.submit ? (
        <SubmitEmail
          onSubmitEmail={submitEmail}
          initialEmail={email}
          signInReason={qs.get("sign_in_reason")}
          termsUrl={configs.link("terms_of_use", "https://github.com/mozilla/hubs/blob/master/TERMS.md")}
          showTerms={configs.feature("show_terms")}
          privacyUrl={configs.link("privacy_notice", "https://github.com/mozilla/hubs/blob/master/PRIVACY.md")}
          showPrivacy={configs.feature("show_privacy")}
        />
      ) : (
        <WaitForVerification
          onCancel={cancel}
          email={email}
          showNewsletterSignup={configs.feature("show_newsletter_signup")}
        />
      )}
    </SignInModal>
  );
}
