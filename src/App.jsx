import React, { useEffect, useState } from "react"
function App() {
  const [data, setData] = useState([])
  const [updateData, setUpdateData] = useState(false)
  const [modalMode, setModalMode] = useState("add")
  const [id, setId] = useState(-1)
  const [lastName, setLastName] = useState("")
  const [firstName, setFirstName] = useState("")
  const [middleName, setMiddleName] = useState(null)
  const [emailAddress, setEmailAddress] = useState("")
  const [subject, setSubject] = useState("")
  const [text, setText] = useState("")
  const [emailContent, setEmailContent] = useState(null)
  const emailContentList = [
    "Discover the best deals on e-books! Dive into a world of reading with our limited-time discounts on top titles.",
    "Join our loyalty program today and earn rewards with every purchase! Don't miss out on exclusive member benefits.",
    "Upgrade your tech game with our latest gadgets and accessories. Shop now for the latest tech innovations at unbeatable prices!",
    "Plan your dream getaway with our vacation packages! Book now and enjoy special discounts on your next adventure.",
  ]
  useEffect(() => {
    fetch("http://localhost:3000/data")
      .then((res) => {
        return res.json()
      })
      .then((data) => {
        setData(data)
      })
  }, [updateData])

  return (
    <section className="d-flex flex-row p-2 d-flex flex-row justify-content-between align-items-start gap-5">
      <form
        id="userForm"
        className="w-25 h-25 border border-2 p-3 d-flex flex-column align-items-start justify-content-start gap-2"
      >
        <label htmlFor="lastNameInput" className="form-label">
          Last Name
        </label>
        <input
          type="text"
          className="form-control"
          id="lastNameInput"
          required
          value={lastName}
          onChange={(e) => {
            setLastName(e.target.value)
          }}
        />
        <label htmlFor="firstNameInput" className="form-label">
          First Name
        </label>
        <input
          type="text"
          className="form-control"
          id="firstNameInput"
          required
          value={firstName}
          onChange={(e) => {
            setFirstName(e.target.value)
          }}
        />
        <label htmlFor="middleNameInput" className="form-label">
          Middle name
        </label>
        <input
          type="text"
          className="form-control"
          id="middleNameInput"
          value={middleName || ""}
          onChange={(e) => {
            setMiddleName(e.target.value)
          }}
        />
        <label htmlFor="emailAddressInput" className="form-label">
          Email address
        </label>
        <input
          type="emailAddress"
          className="form-control"
          id="emailAddressInput"
          value={emailAddress}
          onChange={(e) => {
            setEmailAddress(e.target.value)
          }}
          required
        />

        <button
          className={`btn btn-primary w-75 mx-auto mt-3`}
          type="submit"
          form="userForm"
          onClick={async (e) => {
            e.preventDefault()
            if (
              !/^[\w-\.\d-_]+@([\w-]+\.)+[\w-]{2,4}$/.test(emailAddress) ||
              !firstName.length ||
              !lastName.length
            ) {
              alert("Incorrect data!")
              return
            }
            fetch(`http://localhost:3000/data`, {
              method: "POST",
              body: JSON.stringify({
                last_name: `${lastName}`,
                first_name: `${firstName}`,
                middle_name: middleName ? `${middleName}` : null,
                email_address: `${emailAddress}`,
              }),
              headers: {
                "Content-Type": "application/json",
              },
            })
              .then((res) => {
                res.json().then((result) => {
                  if (
                    res.status < 200 ||
                    res.status > 299 ||
                    !result.affectedRows
                  ) {
                    alert("Error! Rows affected: " + result.affectedRows)
                  } else {
                    setTimeout(() => {
                      setUpdateData(!updateData)
                    }, 1000)
                  }
                })
              })
              .catch((e) => {
                alert("Error!\n" + e.message)
              })
          }}
        >
          Add user
        </button>
      </form>
      {data.length ? (
        <table className="table table-striped table-hover border border-2">
          <thead>
            <tr>
              <th scope="col">
                <span
                  onClick={() => {
                    setUpdateData(!updateData)
                  }}
                >
                  ↻
                </span>
                &nbsp;&nbsp; ID
              </th>
              <th scope="col">First name</th>
              <th scope="col">Middle name</th>
              <th scope="col">Last name</th>
              <th scope="col">Email address</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => {
              return (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.first_name}</td>
                  <td>{row.middle_name || "-"}</td>
                  <td>{row.last_name}</td>
                  <td>{row.email_address}</td>
                  <td>
                    <button
                      className="btn btn-warning mx-2 btn-sm"
                      data-bs-toggle="modal"
                      data-bs-target="#modal"
                      onClick={() => {
                        setModalMode("edit")
                        setId(row.id)
                        setLastName(row.last_name)
                        setFirstName(row.first_name)
                        setMiddleName(row.middle_name || null)
                        setEmailAddress(row.email_address)
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger mx-2 btn-sm"
                      onClick={() => {
                        fetch(`http://localhost:3000/data/${row.id}`, {
                          method: "DELETE",
                          headers: {
                            "Content-Type": "application/json",
                          },
                        })
                          .then(() => {
                            setTimeout(() => {
                              setUpdateData(!updateData)
                            }, 1000)
                          })
                          .catch((e) => {
                            alert("Error" + e.message)
                          })
                      }}
                    >
                      Delete
                    </button>
                    <button
                      className="btn btn-primary mx-2 btn-sm"
                      data-bs-toggle="modal"
                      data-bs-target="#modal"
                      onClick={() => {
                        setId(row.id)
                        setLastName(row.last_name)
                        setFirstName(row.first_name)
                        setMiddleName(row.middle_name || null)
                        setEmailAddress(row.email_address)
                        setModalMode("mail")
                      }}
                    >
                      Send mail
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      ) : (
        <h2 className="mx-auto text-center">Database is empty</h2>
      )}
      <div className="modal fade" tabIndex={-1} id="modal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {modalMode === "edit" ? "Edit user" : "Send email to user"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {modalMode === "mail" ? (
                <form id="userForm">
                  <label htmlFor="emailInput" className="form-label">
                    Receiver
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="emailInput"
                    required
                    value={emailAddress}
                    onChange={(e) => {
                      setEmailAddress(e.target.value)
                    }}
                  />
                  <label htmlFor="subjectInput" className="form-label">
                    Subject
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="subjectInput"
                    required
                    value={subject}
                    onChange={(e) => {
                      setSubject(e.target.value)
                    }}
                  />
                  <label htmlFor="textInput" className="form-label">
                    Text
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="textInput"
                    required
                    value={text}
                    onChange={(e) => {
                      setText(e.target.value)
                    }}
                  />
                  <label htmlFor="contentSelect" className="form-label">
                    Content
                  </label>
                  <select
                    id="contentSelect"
                    className="form-select form-control"
                    defaultValue={0}
                    onChange={(e) => {
                      setEmailContent(
                        emailContentList[e.target.value - 1] || ""
                      )
                    }}
                  >
                    <option value="0">- Custom content -</option>
                    {emailContentList.map((item, index) => (
                      <option key={index + 1} value={index + 1}>
                        {item.split(" ").slice(0, 4).join(" ")} ...
                      </option>
                    ))}
                  </select>
                  <textarea
                    className="form-control mt-3"
                    cols="30"
                    value={emailContent || ""}
                    onChange={(e) => {
                      setEmailContent(e.target.value)
                    }}
                  ></textarea>
                </form>
              ) : (
                <form id="userForm">
                  <label htmlFor="lastNameInput" className="form-label">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastNameInput"
                    required
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value)
                    }}
                  />
                  <label htmlFor="firstNameInput" className="form-label">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="firstNameInput"
                    required
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value)
                    }}
                  />
                  <label htmlFor="middleNameInput" className="form-label">
                    Middle name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="middleNameInput"
                    value={middleName || ""}
                    onChange={(e) => {
                      setMiddleName(e.target.value)
                    }}
                  />
                  <label htmlFor="emailAddressInput" className="form-label">
                    Email address
                  </label>
                  <input
                    type="emailAddress"
                    className="form-control"
                    id="emailAddressInput"
                    value={emailAddress}
                    onChange={(e) => {
                      setEmailAddress(e.target.value)
                    }}
                    required
                  />
                </form>
              )}
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                type="button"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                className={`btn btn-primary`}
                type="submit"
                form="userForm"
                disabled={
                  (!emailContent || !emailContent.length) &&
                  modalMode === "mail"
                }
                onClick={async (e) => {
                  e.preventDefault()
                  if (
                    !/^[\w-\.\d-_]+@([\w-]+\.)+[\w-]{2,4}$/.test(
                      emailAddress
                    ) ||
                    (modalMode === "edit" &&
                      (!firstName.length || !lastName.length))
                  ) {
                    alert("Incorrect data!")
                    return
                  }
                  fetch(
                    modalMode === "edit"
                      ? `http://localhost:3000/data/${id}`
                      : `http://localhost:3000/sendMail`,
                    {
                      method: modalMode === "edit" ? "PUT" : "POST",
                      body:
                        modalMode === "edit"
                          ? JSON.stringify({
                              last_name: `${lastName}`,
                              first_name: `${firstName}`,
                              middle_name: middleName ? `${middleName}` : null,
                              email_address: `${emailAddress}`,
                            })
                          : JSON.stringify({
                              to: `${emailAddress}`,
                              subject: `${subject}`,
                              text: `${text}`,
                              html: `<p>${emailContent}</p>`,
                            }),
                      headers: {
                        "Content-Type": "application/json",
                      },
                    }
                  )
                    .then((res) => {
                      res.json().then((result) => {
                        if (
                          res.status < 200 ||
                          res.status > 299 ||
                          (modalMode !== "mail" && !result.affectedRows)
                        ) {
                          alert("Error! Rows affected: " + result.affectedRows)
                        } else {
                          setTimeout(() => {
                            setUpdateData(!updateData)
                          }, 1000)
                        }
                      })
                    })
                    .catch((e) => {
                      alert("Error!\n" + e.message)
                    })
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default App

