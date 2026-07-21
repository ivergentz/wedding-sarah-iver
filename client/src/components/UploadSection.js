import { useRef, useState } from "react"
import styled from "styled-components"
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
  MAX_FILE_SIZE_MB,
} from "../config/photos"

const UploadContainer = styled.section`
  padding: 5rem 2rem;
  max-width: 900px;
  margin: 0 auto;
  color: #000;
  background-color: #fff;
  text-align: center;
`

const SectionTitle = styled.h2`
  font-size: 3rem;
  font-weight: 900;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`

const Text = styled.p`
  font-size: 1.25rem;
  line-height: 1.7;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`

const NameInput = styled.input`
  display: block;
  width: 100%;
  max-width: 400px;
  margin: 0 auto 1.5rem;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 700;
  border: 4px solid #000;
  text-align: center;

  &::placeholder {
    color: #999;
    font-weight: 400;
  }

  &:focus {
    outline: none;
    background-color: #f0f0f0;
  }
`

const DropZone = styled.div`
  border: 4px dashed #000;
  padding: 3rem 2rem;
  cursor: pointer;
  transition: all 0.3s;
  background-color: ${(props) => (props.$dragging ? "#000" : "#fff")};
  color: ${(props) => (props.$dragging ? "#fff" : "#000")};

  &:hover {
    background-color: #f0f0f0;
  }

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`

const DropText = styled.p`
  font-size: 1.5rem;
  font-weight: 900;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`

const DropHint = styled.p`
  font-size: 1rem;
  color: inherit;
  opacity: 0.6;
`

const HiddenInput = styled.input`
  display: none;
`

const FileList = styled.div`
  margin-top: 2rem;
  text-align: left;
`

const FileRow = styled.div`
  border: 4px solid #000;
  padding: 1rem 1.5rem;
  margin-bottom: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  font-weight: 700;
  font-size: 1rem;

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }
`

const FileName = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
`

const FileStatus = styled.span`
  font-weight: 900;
  white-space: nowrap;
  color: ${(props) => {
    if (props.$status === "done") return "#008000"
    if (props.$status === "error") return "#d00000"
    return "#000"
  }};
`

const ProgressBar = styled.div`
  height: 8px;
  background-color: #ddd;
  margin-top: 0.5rem;

  &::after {
    content: "";
    display: block;
    height: 100%;
    width: ${(props) => props.$progress}%;
    background-color: #000;
    transition: width 0.2s;
  }
`

const FileRowWrapper = styled.div`
  margin-bottom: 0.75rem;

  ${FileRow} {
    margin-bottom: 0;
  }
`

const SuccessBox = styled.div`
  border: 4px solid #000;
  background-color: #000;
  color: #fff;
  padding: 1.5rem;
  margin-top: 2rem;
  font-size: 1.25rem;
  font-weight: 900;
`

const ErrorBox = styled.div`
  border: 4px solid #d00000;
  color: #d00000;
  padding: 1.5rem;
  margin-top: 2rem;
  font-size: 1.1rem;
  font-weight: 700;
`

function UploadSection() {
  const fileInputRef = useRef(null)
  const [guestName, setGuestName] = useState("")
  const [files, setFiles] = useState([])
  const [dragging, setDragging] = useState(false)
  const [globalError, setGlobalError] = useState(null)

  const uploadFile = (file, id) => {
    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`

    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)
    // Tag, über den der Admin die Gäste-Uploads findet, herunterlädt
    // und nach dem Sichern löscht (siehe /api/guest-uploads)
    formData.append("tags", "gaeste-upload")
    if (guestName.trim()) {
      formData.append("context", `caption=${guestName.trim()}`)
    }

    const xhr = new XMLHttpRequest()
    xhr.open("POST", url)

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const progress = Math.round((e.loaded / e.total) * 100)
        setFiles((prev) =>
          prev.map((f) => (f.id === id ? { ...f, progress } : f))
        )
      }
    }

    xhr.onload = () => {
      const success = xhr.status >= 200 && xhr.status < 300
      setFiles((prev) =>
        prev.map((f) =>
          f.id === id
            ? { ...f, status: success ? "done" : "error", progress: 100 }
            : f
        )
      )
    }

    xhr.onerror = () => {
      setFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: "error" } : f))
      )
    }

    xhr.send(formData)
  }

  const handleFiles = (fileList) => {
    setGlobalError(null)

    if (
      !CLOUDINARY_CLOUD_NAME ||
      CLOUDINARY_CLOUD_NAME === "DEIN_CLOUD_NAME"
    ) {
      setGlobalError(
        "Der Upload ist noch nicht eingerichtet. Bitte versucht es später noch einmal."
      )
      return
    }

    const newFiles = []

    Array.from(fileList).forEach((file) => {
      const isMedia =
        file.type.startsWith("image/") || file.type.startsWith("video/")
      const tooBig = file.size > MAX_FILE_SIZE_MB * 1024 * 1024

      const id = `${file.name}-${file.size}-${Date.now()}-${Math.random()}`

      if (!isMedia) {
        newFiles.push({ id, name: file.name, status: "error", progress: 0 })
        return
      }
      if (tooBig) {
        newFiles.push({
          id,
          name: `${file.name} (zu groß, max. ${MAX_FILE_SIZE_MB} MB)`,
          status: "error",
          progress: 0,
        })
        return
      }

      newFiles.push({ id, name: file.name, status: "uploading", progress: 0 })
      uploadFile(file, id)
    })

    setFiles((prev) => [...prev, ...newFiles])
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files?.length) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const doneCount = files.filter((f) => f.status === "done").length
  const uploading = files.some((f) => f.status === "uploading")

  const statusLabel = (status) => {
    if (status === "done") return "✓ FERTIG"
    if (status === "error") return "✕ FEHLER"
    return "LÄDT..."
  }

  return (
    <UploadContainer id='upload'>
      <SectionTitle>EURE BILDER</SectionTitle>
      <Text>
        Ihr habt selbst Fotos oder Videos gemacht? Her damit! Ladet sie hier
        hoch und macht unsere Sammlung komplett.
      </Text>

      <NameInput
        type='text'
        placeholder='Euer Name (optional)'
        value={guestName}
        onChange={(e) => setGuestName(e.target.value)}
      />

      <DropZone
        $dragging={dragging}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <DropText>FOTOS & VIDEOS HOCHLADEN</DropText>
        <DropHint>
          Tippen zum Auswählen oder Dateien hierher ziehen
        </DropHint>
      </DropZone>

      <HiddenInput
        ref={fileInputRef}
        type='file'
        accept='image/*,video/*'
        multiple
        onChange={(e) => {
          if (e.target.files?.length) {
            handleFiles(e.target.files)
            e.target.value = ""
          }
        }}
      />

      {globalError && <ErrorBox>{globalError}</ErrorBox>}

      {files.length > 0 && (
        <FileList>
          {files.map((f) => (
            <FileRowWrapper key={f.id}>
              <FileRow>
                <FileName>{f.name}</FileName>
                <FileStatus $status={f.status}>
                  {statusLabel(f.status)}
                </FileStatus>
              </FileRow>
              {f.status === "uploading" && (
                <ProgressBar $progress={f.progress} />
              )}
            </FileRowWrapper>
          ))}
        </FileList>
      )}

      {doneCount > 0 && !uploading && (
        <SuccessBox>
          {doneCount === 1
            ? "DANKE! 1 DATEI IST ANGEKOMMEN."
            : `DANKE! ${doneCount} DATEIEN SIND ANGEKOMMEN.`}
        </SuccessBox>
      )}
    </UploadContainer>
  )
}

export default UploadSection
