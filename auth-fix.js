(() => {
  const SUPABASE_URL = 'https://nbxxknkecpnscirfnov.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_OxxgbDWRCVy3LPM69E_ydA_ybhkXURb';
  const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  const $ = id => document.getElementById(id);
  const home = new URL('./', location.href).href;
  const loginUrl = new URL('./auth2.html', location.href).href;
  let state = 'signin';
  let pendingEmail = '';

  function status(text, ok = false) { const el = $('status'); if (el) { el.textContent = text; el.className = 'status ' + (ok ? 'ok' : ''); } }
  window.showPass = () => { const x = $('password'), b = document.querySelector('.show'); if (!x) return; x.type = x.type === 'password' ? 'text' : 'password'; if (b) b.textContent = x.type === 'password' ? 'Show' : 'Hide'; };

  function render(next) {
    state = next;
    const signup = next === 'signup', reset = next === 'reset', verify = next === 'verify', recovery = next === 'recovery';
    $('ey').textContent = recovery ? 'SECURE ACCOUNT' : reset ? 'ACCOUNT RECOVERY' : signup ? 'JOIN THE ARCHIVE' : verify ? 'EMAIL VERIFICATION' : 'WELCOME BACK';
    $('title').textContent = recovery ? 'Choose a new password' : reset ? 'Reset password' : signup ? 'Create your account' : verify ? 'Verify your email' : 'Sign in';
    $('sub').textContent = recovery ? 'Set a new password for your Living India account.' : reset ? 'Enter your email and we will send a reset link.' : signup ? 'Create an account and verify your email with a 6-digit code.' : verify ? 'Enter the 6-digit code sent to your email.' : 'Sign in to save discoveries, collect heritage stamps and share stories.';
    $('nameBox').classList.toggle('hidden', !signup);
    $('emailBox').classList.toggle('hidden', verify || recovery);
    $('passBox').classList.toggle('hidden', reset || verify);
    $('confirmBox').classList.toggle('hidden', !signup && !recovery);
    $('google').classList.toggle('hidden', reset || verify || recovery);
    $('otpNote').classList.toggle('hidden', !verify);
    $('links').innerHTML = (reset || verify || recovery) ? '<button type="button" onclick="mode(\'signin\')">Back to sign in</button>' : signup ? '<button type="button" onclick="mode(\'signin\')">Already have an account?</button>' : '<button type="button" onclick="mode(\'signup\')">Create account</button><button type="button" onclick="mode(\'reset\')">Forgot password?</button>';
    if (verify) $('form').innerHTML = '<label>6-DIGIT VERIFICATION CODE</label><input id="otp" inputmode="numeric" maxlength="6" pattern="[0-9]{6}" required placeholder="123456"><button class="primary" id="submit" type="submit">Verify email →</button>';
    else if (recovery) $('form').innerHTML = '<label>NEW PASSWORD</label><div class="pw"><input id="password" type="password" minlength="6" required autocomplete="new-password"><button class="show" type="button" onclick="showPass()">Show</button></div><label>CONFIRM NEW PASSWORD</label><input id="confirm" type="password" minlength="6" required autocomplete="new-password"><button class="primary" id="submit" type="submit">Update password →</button>';
    else $('submit').textContent = reset ? 'Send reset link →' : signup ? 'Create account →' : 'Sign in →';
    status('');
  }
  window.mode = render;

  async function submit(e) {
    e.preventDefault(); e.stopImmediatePropagation();
    const btn = $('submit'); if (btn) btn.disabled = true; status('Please wait…');
    try {
      if (state === 'signin') {
        const { error } = await sb.auth.signInWithPassword({ email: $('email').value.trim(), password: $('password').value });
        if (error) throw error; status('Signed in. Opening Living India…', true); location.href = home; return;
      }
      if (state === 'signup') {
        if ($('password').value !== $('confirm').value) throw new Error('Passwords do not match.');
        pendingEmail = $('email').value.trim();
        const { data, error } = await sb.auth.signUp({ email: pendingEmail, password: $('password').value, options: { data: { full_name: $('name').value.trim() }, emailRedirectTo: loginUrl } });
        if (error) throw error;
        if (data.session) { location.href = home; return; }
        render('verify'); status('Verification code sent. Check your email.', true); return;
      }
      if (state === 'verify') {
        const token = $('otp').value.trim(); if (!/^\d{6}$/.test(token)) throw new Error('Enter the 6-digit verification code.');
        const { error } = await sb.auth.verifyOtp({ email: pendingEmail, token, type: 'signup' });
        if (error) throw error; status('Email verified! Opening Living India…', true); setTimeout(() => { location.href = home; }, 500); return;
      }
      if (state === 'reset') {
        const { error } = await sb.auth.resetPasswordForEmail($('email').value.trim(), { redirectTo: loginUrl + '?reset=1' });
        if (error) throw error; status('Reset email sent. Check your inbox.', true); return;
      }
      if (state === 'recovery') {
        if ($('password').value !== $('confirm').value) throw new Error('Passwords do not match.');
        const { error } = await sb.auth.updateUser({ password: $('password').value });
        if (error) throw error; status('Password updated successfully. Opening Living India…', true); setTimeout(() => { location.href = home; }, 600);
      }
    } catch (err) { status(err?.message || 'Something went wrong.'); }
    finally { if ($('submit')) $('submit').disabled = false; }
  }
  const form = $('form'); if (form) form.addEventListener('submit', submit, true);

  window.googleLogin = async () => { status('Opening Google sign-in…'); const { error } = await sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: home } }); if (error) status(error.message); };

  (async () => {
    const { data } = await sb.auth.getSession();
    const params = new URLSearchParams(location.search);
    if (params.get('reset') === '1' && data.session) { render('recovery'); return; }
    if (data.session) { location.href = home; return; }
    render(params.get('mode') === 'signup' ? 'signup' : 'signin');
  })();
})();
