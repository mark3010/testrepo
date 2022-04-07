import { showPage } from "../utils.js"

import { handleErrors, makeOptions } from "../fetchUtils.js"

export function setupLoginHandlers() {
  document.getElementById("btn-login").onclick = login
}

async function login() {

  const credentials = {}
  credentials.username = document.getElementById("username").value
  credentials.password = document.getElementById("password").value
  const options = makeOptions("POST", credentials)
  try {
    const response = await fetch("http://localhost:8080/api/auth/login", options)
      .then(res => handleErrors(res))

    const token = response.token
    const role = response.roles[0]
    setLoginState(token, role)
    showPage("page-about")
  } catch (err) {
    document.getElementById("error").innerText = err.message + " - Try again"
  }
}


export function logout() {
  setLoginState(null)
  showPage("page-about")
}

export function setLoginState(token, loggedInAs) {
  if (token) {
    sessionStorage.setItem("token", token)
    if (loggedInAs) {
      sessionStorage.setItem("logged-in-as", loggedInAs)
    }
  } else {
    sessionStorage.clear("token")
    sessionStorage.clear("logged-in-as")
  }
  updateLoginDependentComponents()
}

export function updateLoginDependentComponents() {
  const loggedIn = sessionStorage.getItem("token")
  const loggedInAs = sessionStorage.getItem("logged-in-as")
  document.getElementById("user-role").innerText = ""
  if (loggedIn) {
    document.getElementById("user-role").innerText = "Logged in as: " + loggedInAs
  }
  document.getElementById("logged-in").style.display = loggedIn ? "block" : "none"
  document.getElementById("page-login").style.display = loggedIn ? "none" : "block"
  document.getElementById("page-logout").style.display = loggedIn ? "block" : "none"
}