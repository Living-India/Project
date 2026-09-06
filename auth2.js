import { initializeApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  reload,
  applyActionCode,
  verifyPasswordResetCode,
  confirmPasswordReset
} from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyCeuizWkJRvp2_iOxD4UOFL12Os2k0KybQ',
  authDomain: 'living-india-7f73b.firebaseapp.com',
  projectId: 'living-india-7f73b',
  storageBucket: 'living-india-7f73b.firebasestorage.app',
  messagingSenderId: '439601825953',
  appId: '1:439601825953:web:cc38c29d819b86de03c8e0',
  measurementId: 'G-N76WYJXS7K'
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()
setPersistence(auth, browserLocalPersistence).catch(() => {})

const $ = id => document.getElementById(id)
const home = new URL('./', location.href).href
const loginUrl = new URL('./auth3.html', location.href).href
const baseFormHTML = $('form')?.innerHTML || ''
let state = 'signin'
let pendingEmail = sessionStorage.getItem('li-pending-email') || ''
let resetCode = ''

function friendlyError(err) {
  const code = String(err?.code || '')
  const messages = {
    'auth/invalid-credential': 'Incorrect email or password.',
    'auth/invalid-login-credentials': 'Incorrect email or password.',
    'auth/email-already-in-use': 'An account with this email already exists. Please sign in.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/popup-blocked': 'Google sign-in was blocked by the browser. Please allow pop-ups and try again.',
    'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
    'auth/cancelled-popup-request': 'Google sign-in was cancelled. Please try again.',
    'auth/network-request-failed': 'Cannot reach the account service. Please check your connection and try again.',
    'auth/too-many-requests': 'Too many attempts. Please wait a little and try again.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/operation-not-allowed': 'This sign-in method is not enabled in Firebase.',
    'auth/unauthorized-domain': 'This website domain is not authorised in Firebase.',
    'auth/invalid-action-code': 'This email link is invalid or has expired. Please request a new one.',
    'auth/expired-action-code': 'This email link has expired. Please request a new one.',
    'auth/user-not-found': 'No account was found for that email.'
  }
  return messages[code] || String(err?.message || err || 'Something went wrong. Please try again.')
}

function status(text, ok = false) {
  const el = $('status')
  if (el) {
    el.textContent = text
    el.className = 'status ' + (ok ? 'ok' : '')
  }
}

function showPass() {
  const x = $('password')
  if (!x) return
  x.type = x.type === 'password' ? 'text' : 'password'
  document.querySelectorAll('.show').forEach(b => { b.textContent = x.type === 'password' ? 'Show' : 'Hide' })
}

function restoreBaseForm() {
  if (!$('nameBox') || !$('emailBox') || !$('passBox')) {
    $('form').innerHTML = baseFormHTML
  }
  $('showPass')?.addEventListener('click', showPass)
}

function wireLinks() {
  $('links')?.querySelectorAll('[data-mode]').forEach(btn => {
    btn.addEventListener('click', () => render(btn.dataset.mode))
  })
}

function render(next) {
  state = next
  const signup = next === 'signup'
  const reset = next === 'reset'
  const verify = next === 'verify'
  const recovery = next === 'recovery'

  if (!verify && !recovery) restoreBaseForm()

  $('ey').textContent = recovery ? 'SECURE ACCOUNT' : reset ? 'ACCOUNT RECOVERY' : signup ? 'JOIN THE ARCHIVE' : verify ? 'EMAIL VERIFICATION' : 'WELCOME BACK'
  $('title').textContent = recovery ? 'Choose a new password' : reset ? 'Reset password' : signup ? 'Create your account' : verify ? 'Check your email' : 'Sign in'
  $('sub').textContent = recovery ? 'Enter a new password for your Living India account.' : reset ? 'Enter your email and we will send a secure reset link.' : signup ? 'Create an account and verify your email before entering Living India.' : verify ? 'We sent a verification link to your email. Open it, then return here to sign in.' : 'Sign in to save discoveries, collect heritage stamps and share stories.'

  $('nameBox')?.classList.toggle('hidden', !signup)
  $('emailBox')?.classList.toggle('hidden', verify || recovery)
  $('passBox')?.classList.toggle('hidden', reset || verify || recovery)
  $('confirmBox')?.classList.toggle('hidden', !signup && !recovery)
  $('google')?.classList.toggle('hidden', reset || verify || recovery)
  $('otpNote')?.classList.toggle('hidden', !verify)
  if (verify && $('otpNote')) $('otpNote').textContent = 'A verification link has been sent to your email. Check Spam or Promotions too.'

  $('links').innerHTML = (reset || verify || recovery)
    ? '<button type="button" data-mode="signin">Back to sign in</button>'
    : signup
      ? '<button type="button" data-mode="signin">Already have an account?</button>'
      : '<button type="button" data-mode="signup">Create account</button><button type="button" data-mode="reset">Forgot password?</button>'
  wireLinks()

  if (verify) {
    $('form').innerHTML = '<label>EMAIL</label><input id="verifyEmail" type="email" readonly><button class="primary" id="verifyBtn" type="submit">I have verified my email →</button><button class="secondary" id="resendBtn" type="button">Resend verification email</button>'
    $('verifyEmail').value = pendingEmail
  } else if (recovery) {
    $('form').innerHTML = '<label>NEW PASSWORD</label><div class="pw"><input id="password" type="password" minlength="6" required autocomplete="new-password"><button class="show" id="showPass" type="button">Show</button></div><label>CONFIRM NEW PASSWORD</label><input id="confirm" type="password" minlength="6" required autocomplete="new-password"><button class="primary" id="submit" type="submit">Update password →</button>'
    $('showPass').addEventListener('click', showPass)
  } else {
    $('submit').textContent = reset ? 'Send reset link →' : signup ? 'Create account →' : 'Sign in →'
  }

  $('form').onsubmit = submit
  $('resendBtn')?.addEventListener('click', resendVerification)
  status('')
}

async function submit(e) {
  e.preventDefault()
  const btn = $('submit') || $('verifyBtn')
  if (btn) btn.disabled = true
  status('Connecting…')

  try {
    if (state === 'signin') {
      const credential = await signInWithEmailAndPassword(auth, $('email').value.trim(), $('password').value)
      await reload(credential.user)
      if (!credential.user.emailVerified) {
        pendingEmail = credential.user.email || ''
        sessionStorage.setItem('li-pending-email', pendingEmail)
        await sendEmailVerification(credential.user, {
          url: loginUrl + '?verified=1',
          handleCodeInApp: true
        })
        await signOut(auth)
        render('verify')
        status('Your email is not verified yet. We sent a fresh verification link.', true)
        return
      }
      location.replace(home)
      return
    }

    if (state === 'signup') {
      const password = $('password').value
      if (password !== $('confirm').value) throw new Error('Passwords do not match.')
      pendingEmail = $('email').value.trim()
      const credential = await createUserWithEmailAndPassword(auth, pendingEmail, password)
      const fullName = $('name').value.trim()
      if (fullName) await updateProfile(credential.user, { displayName: fullName })
      await sendEmailVerification(credential.user, {
        url: loginUrl + '?verified=1',
        handleCodeInApp: true
      })
      sessionStorage.setItem('li-pending-email', pendingEmail)
      await signOut(auth)
      render('verify')
      status('Verification email sent. Check Inbox, Spam and Promotions.', true)
      return
    }

    if (state === 'verify') {
      render('signin')
      $('email').value = pendingEmail
      status('After clicking the verification link, sign in with your email and password.', true)
      return
    }

    if (state === 'reset') {
      await sendPasswordResetEmail(auth, $('email').value.trim(), {
        url: loginUrl,
        handleCodeInApp: true
      })
      status('Password reset email sent. Check your inbox.', true)
      return
    }

    if (state === 'recovery') {
      if (!resetCode) throw new Error('The password reset link is missing or invalid.')
      const password = $('password').value
      if (password !== $('confirm').value) throw new Error('Passwords do not match.')
      await confirmPasswordReset(auth, resetCode, password)
      resetCode = ''
      status('Password updated successfully. You can now sign in.', true)
      setTimeout(() => render('signin'), 700)
    }
  } catch (err) {
    console.error('[Living India Firebase Auth]', err)
    status(friendlyError(err))
  } finally {
    if ($('submit')) $('submit').disabled = false
    if ($('verifyBtn')) $('verifyBtn').disabled = false
  }
}

async function resendVerification() {
  if (!pendingEmail) {
    render('signin')
    status('Enter your email and password to send a new verification link.')
    return
  }
  render('signin')
  $('email').value = pendingEmail
  status('Sign in with your password. If your email is still unverified, a fresh verification link will be sent automatically.')
}

async function googleLogin() {
  status('Opening Google sign-in…')
  try {
    const result = await signInWithPopup(auth, googleProvider)
    if (result?.user) location.replace(home)
  } catch (err) {
    console.error('[Living India Firebase Google]', err)
    status(friendlyError(err))
  }
}

$('back')?.addEventListener('click', () => { location.href = home })
$('showPass')?.addEventListener('click', showPass)
$('googleBtn')?.addEventListener('click', googleLogin)
$('form')?.addEventListener('submit', submit)

;(async () => {
  const params = new URLSearchParams(location.search)
  const actionMode = params.get('mode')
  const oobCode = params.get('oobCode') || ''
  const verified = params.get('verified') === '1'
  resetCode = ''

  render(actionMode === 'signup' ? 'signup' : 'signin')

  try {
    if (oobCode && actionMode === 'verifyEmail') {
      await applyActionCode(auth, oobCode)
      pendingEmail = sessionStorage.getItem('li-pending-email') || ''
      sessionStorage.removeItem('li-pending-email')
      render('signin')
      if (pendingEmail) $('email').value = pendingEmail
      status('Email verified successfully. You can now sign in.', true)
      return
    }

    if (oobCode && actionMode === 'resetPassword') {
      await verifyPasswordResetCode(auth, oobCode)
      resetCode = oobCode
      render('recovery')
      status('Choose a new password.', true)
      return
    }

    if (verified) {
      render('signin')
      if (pendingEmail) $('email').value = pendingEmail
      status('Your verification link was opened. Sign in now to continue.', true)
      return
    }
  } catch (err) {
    console.error('[Living India Firebase Action]', err)
    status(friendlyError(err))
    return
  }

  onAuthStateChanged(auth, async user => {
    if (!user) return
    try {
      await reload(user)
      if (user.providerData.some(p => p.providerId === 'google.com') || user.emailVerified) {
        location.replace(home)
      }
    } catch (err) {
      console.error('[Living India Firebase Session]', err)
    }
  })
})()
