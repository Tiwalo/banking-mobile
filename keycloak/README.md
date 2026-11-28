# Tiwalo mobile sign-in theme

Apply `tiwalo-mobile` to the dedicated mobile client in the synthetic Keycloak realm. The theme extends the Keycloak 26.8.2 login templates and uses the same temporary text wordmark and Inter fonts as the app. Keycloak renders and submits the credential fields.

1. Stage `themes/tiwalo-mobile` in the Keycloak server's `themes` directory.
2. In that theme, place `Inter-Regular.ttf`, `Inter-SemiBold.ttf`, and `OFL-Inter.txt` from the mobile project's `assets/fonts` under `login/resources/fonts`. Serve the fonts from Keycloak.
3. In **Clients → tiwalo-mobile-development → Settings → Login settings**, set **Login theme** to **tiwalo-mobile**. Open a fresh authorization request to confirm the wordmark, simulation disclosure, and password field before testing the native callback.

Remove the client's theme selection to restore its realm default.
