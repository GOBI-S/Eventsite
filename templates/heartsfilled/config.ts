export const templateConfig = {
  id: "heartsfilled",
  name: "Hearts Filled Memories",
  price: 249,

  fields: [
    { name: "birthdayPersonName", label: "Birthday Person Name", type: "text", required: true },
    { name: "fromName", label: "Your Name", type: "text", required: true },
    { name: "message", label: "Your Message", type: "textarea", required: true },
    { name: "birthdayDate", label: "Birthday Date", type: "date", required: true },
    { name: "photos", label: "Upload Photos", type: "image", multiple: true, max: 8 },
    { name: "musicUrl", label: "Favorite Song", type: "audio" }
  ]
}
