$(document).ready(function () {
  const token = sessionStorage.getItem("token")

  if (!token) {
    alert("Unauthorized. Please login.")
    window.location.href = "index.html"
  }
})
