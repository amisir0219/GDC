import { useCallback, useEffect, useState } from "react"
import Quill from "quill"
import "quill/dist/quill.snow.css"
import { io } from "socket.io-client"
import { useParams } from "react-router-dom"

const SAVE_INTERVAL_MS = 2000
const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
]

export default function TextEditor() {
  const { id: documentId } = useParams() //get documentId parameter
  const [socket, setSocket] = useState()
  const [quill, setQuill] = useState()

  useEffect(() => {
    const s = io("http://localhost:3001")
    setSocket(s)

    return () => {
      s.disconnect()
    }
  }, [])
  
  //Send document id to server, if document is saved will send that document back to client
  useEffect(() => {
    if (socket == null || quill == null) return

    socket.once("load-document", document => {
      quill.setContents(document)
      quill.enable()
    })

    socket.emit("get-document", documentId)
  }, [socket, quill, documentId])

  //Saves document to the database every couple milliseconds
  useEffect(() => {
    if (socket == null || quill == null) return

    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents())
    }, SAVE_INTERVAL_MS)

    return () => {
      clearInterval(interval)
    }
  }, [socket, quill])

  //Check to make sure there is a socket and quill, then checks whether quill has changes and broadcasts the changes to server 
  useEffect(() => {
    if (socket == null || quill == null) return

    const handler = delta => {
      quill.updateContents(delta)
    }
    socket.on("receive-changes", handler)

    return () => {
      socket.off("receive-changes", handler)
    }
  }, [socket, quill])
  
  //Check to make sure there is a socket and quill, then checks whether quill has changes and broadcasts the changes to server 
  useEffect(() => {
    if (socket == null || quill == null) return

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return
      socket.emit("send-changes", delta)
    }
    quill.on("text-change", handler)

    return () => {
      quill.off("text-change", handler)
    }
  }, [socket, quill])

  const wrapperRef = useCallback(wrapper => {
    if (wrapper == null) return

    wrapper.innerHTML = ""
    const editor = document.createElement("div")
    wrapper.append(editor)
    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    })
    //q.disable()
    q.setText("Loading...")
    setQuill(q)
  }, [])
  return <div className="container" ref={wrapperRef}></div>
}
