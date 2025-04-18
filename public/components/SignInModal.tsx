import React, { useState, useEffect } from "react"
import { Modal, SignInControl, LegalFooter } from "@fider/components"
import { Button } from "./common"
import { Trans } from "@lingui/react/macro"

interface SignInModalProps {
  isOpen: boolean
  onClose: () => void
}

export const SignInModal: React.FC<SignInModalProps> = (props) => {
  const [email, setEmail] = useState("")

  useEffect(() => {
    if (email) {
      setTimeout(() => setEmail(""), 5000)
    }
  }, [email])

  const onEmailSent = (value: string): void => {
    setEmail(value)
  }

  const closeModal = () => {
    setEmail("")
    props.onClose()
  }

  const content = email ? (
    <>
      <p>
        <Trans id="signin.message.emailsent">
          We have just sent a confirmation link to <b>{email}</b>. Click the link and you’ll be signed in.
        </Trans>
      </p>
      <p>
        <Button variant="tertiary" onClick={closeModal}>
          <Trans id="action.ok">OK</Trans>
        </Button>
      </p>
    </>
  ) : (
    props.isOpen ?
    (<>
      <h3>Loading...</h3>
      <div style={{visibility: "hidden", overflow: "hidden", height: 0}}>
        <SignInControl useEmail={true} onEmailSent={onEmailSent} />
      </div>
    </>)
    :
    <></>
  )

  return (
    <Modal.Window isOpen={props.isOpen} onClose={closeModal}>
      <Modal.Content>{content}</Modal.Content>
      <LegalFooter />
    </Modal.Window>
  )
}
