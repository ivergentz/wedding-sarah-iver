import { useState } from "react"
import styled from "styled-components"

const RSVPContainer = styled.section`
  padding: 5rem 2rem;
  max-width: 1280px;
  margin: 0 auto;
  background-color: #000;
`

const SectionTitle = styled.h2`
  font-size: 3rem;
  font-weight: 900;
  text-align: center;
  margin-bottom: 4rem;
  color: #fff;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`

const Message = styled.div`
  max-width: 768px;
  margin: 0 auto 1.5rem;
  padding: 1.5rem;
  border: 4px solid ${(props) => (props.$success ? "#000" : "#fff")};
  background-color: ${(props) => (props.$success ? "#fff" : "#000")};
  color: ${(props) => (props.$success ? "#000" : "#fff")};
  font-weight: 700;
`

const FormContainer = styled.div`
  max-width: 768px;
  margin: 0 auto;
  background-color: #fff;
  border: 4px solid #000;
  padding: 2.5rem;
`

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #000;
  font-weight: 700;
  font-size: 1.125rem;
`

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 4px solid ${(props) => (props.$error ? "#dc2626" : "#000")};
  font-weight: 700;
  font-size: 1rem;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 4px #000;
  }
`

const Select = styled.select`
  width: 100%;
  padding: 1rem;
  border: 4px solid #000;
  background-color: #fff;
  font-weight: 700;
  font-size: 1rem;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 4px #000;
  }
`

const Textarea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 4px solid #000;
  font-weight: 700;
  font-size: 1rem;
  min-height: 8rem;
  resize: vertical;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 4px #000;
  }
`

const ErrorText = styled.p`
  margin-top: 0.5rem;
  color: #dc2626;
  font-weight: 700;
  font-size: 0.875rem;
`

const SubmitButton = styled.button`
  width: 100%;
  padding: 1.5rem;
  font-size: 1.25rem;
  font-weight: 900;
  background-color: #000;
  color: #fff;
  border: 4px solid #000;
  cursor: pointer;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    background-color: #fff;
    color: #000;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

function RSVPForm({ onSubmit, message }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    inviteCode: "",
    guests: "1",
    attending: "yes",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Bitte gib deinen Namen ein"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Bitte gib deine E-Mail-Adresse ein"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Bitte gib eine gültige E-Mail-Adresse ein"
    }

    // Einladungscode Validierung
    if (!formData.inviteCode.trim()) {
      newErrors.inviteCode = "Bitte gib den Einladungscode ein"
    } else if (formData.inviteCode.toUpperCase() !== "0407") {
      newErrors.inviteCode = "Ungültiger Einladungscode"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    await onSubmit(formData)
    setIsSubmitting(false)
    setErrors({})

    setFormData({
      name: "",
      email: "",
      inviteCode: "",
      guests: "1",
      attending: "yes",
      message: "",
    })
  }

  return (
    <RSVPContainer id='rsvp'>
      <SectionTitle>BITTE BIS 30/04/26 ZU- / ABSAGEN</SectionTitle>
      {message && (
        <Message $success={message.type === "success"}>{message.text}</Message>
      )}
      <FormContainer>
        <FormGroup>
          <Label htmlFor='name'>VOLLSTÄNDIGER NAME *</Label>
          <Input
            type='text'
            id='name'
            name='name'
            value={formData.name}
            onChange={handleChange}
            $error={errors.name}
            placeholder='VORNAME NACHNAME'
          />
          {errors.name && <ErrorText>{errors.name}</ErrorText>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor='email'>E-MAIL *</Label>
          <Input
            type='email'
            id='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            $error={errors.email}
            placeholder='MAX@MUSTERMANN.DE'
          />
          {errors.email && <ErrorText>{errors.email}</ErrorText>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor='inviteCode'>CODE *</Label>
          <Input
            type='text'
            id='inviteCode'
            name='inviteCode'
            value={formData.inviteCode}
            onChange={handleChange}
            placeholder='STEHT AUF DEINER EINLADUNG'
            $error={errors.inviteCode}
            autoComplete='off'
          />
          {errors.inviteCode && <ErrorText>{errors.inviteCode}</ErrorText>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor='attending'>WIRST DU / WERDET IHR TEILNEHMEN? *</Label>
          <Select
            id='attending'
            name='attending'
            value={formData.attending}
            onChange={handleChange}
          >
            <option value='yes'>JA, ICH KOMME!</option>
            <option value='no'>LEIDER KANN ICH NICHT</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor='guests'>WIR SIND / ICH BIN: *</Label>
          <Select
            id='guests'
            name='guests'
            value={formData.guests}
            onChange={handleChange}
          >
            <option value='1'>EINE PERSON</option>
            <option value='2'>ZU ZWEIT</option>
            <option value='3'>ZU DRITT</option>
            <option value='4'>ZU VIERT</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor='message'>NACHRICHT AN DAS PAAR</Label>
          <Textarea
            id='message'
            name='message'
            value={formData.message}
            onChange={handleChange}
            placeholder='WAS NOCH SO?!'
          />
        </FormGroup>

        <SubmitButton onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "WIRD GESENDET..." : "SENDEN"}
        </SubmitButton>
      </FormContainer>
    </RSVPContainer>
  )
}

export default RSVPForm
